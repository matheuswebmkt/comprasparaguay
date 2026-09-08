// Filepath: lib/telegram.ts
// Version: 1.4
// Nome da Versão: "Card íntegro do envio ao pós-clique — o briefing sobrevive ao Assumir/Confirmar"
// Baseado na Versão: 1.3
//
// Regra dura (conventions §4 e §12): AMBIENTE SERVERLESS. NADA de long-polling nem de
// bibliotecas com `.on('message')` — toda comunicação com o Telegram é via requisição HTTP
// (Bot API) e webhook. Este módulo é puro (sem dependência de banco): só fala com o Telegram.
// No-op silencioso se faltar TELEGRAM_BOT_TOKEN; nunca lança (falha logada só em dev).

import { DEFAULT_WA_GREETING } from "./offer-defaults";
import type { ItensKind, ProductCopyKind } from "./offer-defaults";
import type { Locale } from "./i18n/config";
import { buildWaMessage, fillPedidos } from "./pedido-resumo";
import { isLocale, DEFAULT_LOCALE } from "./i18n/config";
import type { OverdueLead } from "./lead-alerts";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const API = "https://api.telegram.org";

/** Escapa os caracteres reservados do parse_mode HTML do Telegram. */
function esc(v: string | null | undefined): string {
  return (v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Chamada de baixo nível à Bot API (HTTP). Retorna o objeto `result` em sucesso ou `null`
 * em qualquer falha (token ausente, rede, erro da API). NUNCA lança — não pode quebrar o
 * fluxo do lead nem a resposta ao webhook.
 */
async function call<T = Record<string, unknown>>(
  method: string,
  body: Record<string, unknown>
): Promise<T | null> {
  if (!BOT_TOKEN) return null;
  try {
    const res = await fetch(`${API}/bot${BOT_TOKEN}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = (await res.json().catch(() => null)) as
      | { ok?: boolean; result?: T; description?: string }
      | null;
    if (!json?.ok) {
      if (process.env.NODE_ENV === "development") {
        console.error(`telegram ${method} error:`, res.status, json?.description ?? "(sem corpo)");
      }
      return null;
    }
    return (json.result ?? null) as T | null;
  } catch (err) {
    if (process.env.NODE_ENV === "development") console.error(`telegram ${method} exception:`, err);
    return null;
  }
}

// ------------------------------------------------------------------ Notificação do lead

export interface NewLeadNotice {
  leadId: number;
  nome: string | null;
  // Qualificação do lead (PA §15) — opcional; renderizada como "Perfil" quando presente.
  isLocal?: boolean | null;      // morador de Foz?
  alreadyInFoz?: boolean | null; // já está em Foz? (null quando morador)
  /** Cross-sell de transporte — TRI-STATE (ver db/schema.sql `wants_transport`): `true` quer · `false`
   * recusou · `null`/undefined não foi perguntado. Só o `true` vira linha no card (`transportLine`);
   * recusa e ausência de pergunta são silêncio, que é o certo — o vendedor não precisa ler "não quer". */
  wantsTransport?: boolean | null;
  locale?: string | null;        // idioma escolhido no modal (pt|en|es) → a agência abre a conversa no idioma certo
  /** Título legível do roteiro escolhido (linha extra). */
  roteiroTitulo?: string | null;
  /** Slug do roteiro (linha extra opcional). */
  roteiroSlug?: string | null;
  /** Token do pedido (legado de /r/[token], página removida — não gera linha no card). */
  pedidoToken?: string | null;
  /** Resumo de UMA linha do pedido (`lib/pedido-resumo.resumoCurto`), na VOZ da agência — só o wa.me
   * usa; o card já mostra dia/pessoas/transporte em linhas próprias. */
  resumo?: string | null;
  /** Classificação dos itens (`itensKind`) — o rótulo do link acompanha: ingressos, reservas ou os dois. */
  itens?: ItensKind;
  /** NOMES legíveis dos itens do pedido (`atrativoNomes`, lib/lead-card.ts) — viram a linha logo abaixo
   * do assunto no card e a lista "Para: …" do wa.me. Resolvidos pelo CHAMADOR (este módulo é puro). */
  itemNames?: string[];
  /** Bucket de produto (`productKindOf`, lib/lead-card.ts) — decide o RÓTULO da linha do assunto:
   * `🎟️ Atrativo:` para ingresso, `🗺️ Roteiro:` para roteiro/personalizar. Quem resolve é o CHAMADOR:
   * este módulo é puro e não deriva contexto de lead (a derivação tem fonte única em lib/lead-card.ts,
   * usada tanto pelo corpo da requisição quanto pela linha já gravada no banco). */
  productKind?: ProductCopyKind;
  /** Dia da visita/início escolhido no calendário (D5/D6) — ISO YYYY-MM-DD vindo da request, ou `Date`
   * quando RELIDO da coluna `visit_date` (o driver do Neon devolve `date` como `Date`, não string). */
  visitDate?: string | Date | null;
  /** Quantidade de ingressos escolhida no stepper (só atrativo). */
  ticketQty?: number | null;
}

/**
 * Linha de transporte — só quando o lead marcou. `null` caso contrário.
 *
 * ⛔ **NÃO nomear a agência aqui** (decisão do usuário). O nome saía de `officialAgencyName()`, um slug
 * FIXO do catálogo (`OFFICIAL_AGENCY_SLUG`), e por isso mentia em dois cenários: afirmava a agência
 * oficial quando quem recebeu o lead é outra do rodízio, e nomeava uma agência inteira no card SEM
 * AGÊNCIA — justamente onde ninguém está atendendo. É o mesmo defeito que o
 * `content_name: "Foz_Falls_transporte"` teve no pixel: nome de UMA agência, que rotaciona, numa
 * string fixa. Quem entrega já está no roteamento (`assigned_partner`); o card só precisa registrar
 * que o transporte foi pedido.
 */
function transportLine(wantsTransport?: boolean | null): string | null {
  return wantsTransport ? "🚐 <b>Transporte:</b> solicitado" : null;
}

/**
 * Dia escolhido → `DD/MM/YYYY`. Fonte ÚNICA de formatação (usada por `visitDateLine` e `buildWaUrl`).
 * ⚠️ Aceita `string` E `Date` de propósito: quando o valor vem do BODY da request (`/api/leads`) é a string
 * ISO `YYYY-MM-DD`, mas quando é RELIDO do banco (webhook: confirm/wa/start) o driver do Neon devolve a
 * coluna `date` como objeto `Date` — chamar `.split` nele estoura a request inteira em 500.
 * ⚠️ Getters **UTC**: uma coluna `date` volta como meia-noite UTC; getters locais mostrariam em BRT o
 * DIA ANTERIOR.
 */
function formatVisitDate(visitDate?: string | Date | null): string | null {
  if (!visitDate) return null;
  if (visitDate instanceof Date) {
    if (Number.isNaN(visitDate.getTime())) return null;
    const d = String(visitDate.getUTCDate()).padStart(2, "0");
    const m = String(visitDate.getUTCMonth() + 1).padStart(2, "0");
    return `${d}/${m}/${visitDate.getUTCFullYear()}`;
  }
  const [y, m, d] = String(visitDate).split("-");
  if (!y || !m || !d) return null;
  return `${d}/${m}/${y}`;
}

/** Linha do dia escolhido no calendário (D5/D6). */
function visitDateLine(visitDate?: string | Date | null): string | null {
  const dia = formatVisitDate(visitDate);
  return dia ? `📅 <b>Dia:</b> ${dia}` : null;
}

/** Quantas PESSOAS — é o que o modal pergunta, e serve tanto a ingresso quanto a reserva de data
 * (onde "quantos ingressos" não faz sentido: o lugar não vende ingresso, §17-ter). */
function ticketQtyLine(ticketQty?: number | null): string | null {
  return ticketQty ? `🎟️ <b>Para quantas pessoas:</b> ${ticketQty}` : null;
}

/** Linha de idioma (i18n) — destaca quando NÃO é português (o vendedor abre a conversa no idioma certo). */
function localeLine(locale?: string | null): string | null {
  if (locale === "en") return "🌐 <b>Idioma:</b> English 🇺🇸 (fale em inglês)";
  if (locale === "es") return "🌐 <b>Idioma:</b> Español 🇪🇸 (fale em espanhol)";
  return null; // pt (ou ausente) → sem ruído
}

/** Formata uma data em horário curto de Brasília (DD/MM, HH:MM). */
export function formatBRT(date: Date): string {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return "";
  }
}
/** Horário curto em Brasília, a partir de AGORA (mensagens disparadas no momento do envio do lead). */
function nowBRT(): string {
  return formatBRT(new Date());
}

/** Tempo de espera legível (segundos → "42s" · "3m 12s" · "2h 5m") — usado no ping de lead pendente (Sprint 11). */
export function formatWait(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  if (s < 60) return `${s}s`;
  const totalMinutes = Math.floor(s / 60);
  const secs = s % 60;
  if (totalMinutes < 60) return secs > 0 ? `${totalMinutes}m ${secs}s` : `${totalMinutes}m`;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/** Linha "Perfil" a partir da qualificação (morador/turista + se já está em Foz). `null` quando não informado. */
function profileLine(isLocal?: boolean | null, alreadyInFoz?: boolean | null): string | null {
  if (isLocal === true) return "🧭 <b>Perfil:</b> Morador de Foz";
  if (isLocal === false) {
    const suf = alreadyInFoz === true ? " · já está em Foz" : alreadyInFoz === false ? " · ainda não está em Foz" : "";
    return `🧭 <b>Perfil:</b> Turista${suf}`;
  }
  return null;
}

/**
 * Títulos do card — FIXOS, um por cenário (decisão do usuário).
 *
 * ⛔ **Não voltar a interpolar o produto aqui** (`[NOVO LEAD: ROTEIRO 3 DIAS — COMPRAS]`). O nome do
 * roteiro/atrativo já aparece logo abaixo, na linha do assunto, e repeti-lo no título fazia o card
 * dizer duas vezes a mesma coisa nas duas primeiras linhas. O título diz o QUE chegou; o assunto diz
 * qual produto.
 */
const LEAD_TITLE = "🟢 <b>NOVA QUALIFICAÇÃO</b>";
/** Cenário sem agência — visualmente distinto de propósito: não é um lead pra "Assumir", é registro. */
const LEAD_TITLE_INFO_ONLY = "ℹ️ <b>REGISTRO DE NOVA QUALIFICAÇÃO</b>";

function leadHeadline(infoOnly?: boolean): string {
  return infoOnly ? LEAD_TITLE_INFO_ONLY : LEAD_TITLE;
}

/**
 * CABEÇALHO do card: título → assunto → bloco de detalhes, cada um separado por uma linha em branco.
 * O corpo (nome, contato e qualificação) vem de `detailLines`, depois de mais uma linha em branco.
 *
 * ⚠️ **O nome NÃO mora aqui** (decisão do usuário): o topo do card responde "que pedido é este", e só
 * depois "de quem". Quem lê o grupo bate o olho no produto para decidir se pega o lead — com o nome
 * espremido entre o título e o assunto, as três primeiras linhas viravam um bloco só e nada se
 * destacava. O nome abre o bloco informativo, junto do contato e da qualificação, que é onde ele é
 * usado de fato.
 */
function baseLines(
  opts?: {
    roteiroTitulo?: string | null;
    roteiroSlug?: string | null;
    productKind?: ProductCopyKind;
    /** Classificação dos itens (`itensKind`) — a linha do assunto acompanha o que o pedido contém. */
    itens?: ItensKind;
    /** Nomes legíveis dos itens — a lista logo abaixo do assunto (sem ela, o vendedor não sabe O QUE
     * foi reservado: o link /r/[token] que a justificava foi removido neste projeto). */
    itemNames?: string[];
    infoOnly?: boolean;
    /** Token do pedido — vira a linha de link, onde a lista completa vive. */
    pedidoToken?: string | null;
  },
): string[] {
  const lines = [leadHeadline(opts?.infoOnly)];
  const assunto = opts?.roteiroTitulo || opts?.roteiroSlug;

  // O card É o briefing do vendedor: a página de pedido foi removida deste projeto, então os NOMES
  // (opts.itemNames) são a única fonte do "o que foi pedido" — eles entram logo abaixo do assunto.
  if (opts?.productKind === "atrativo") {
    // O rótulo diz o que o pedido CONTÉM: um pedido misto chamado só de "Ingressos" esconde metade
    // dele, e um de reserva de data não tem ingresso nenhum (§17-ter).
    lines.push(
      "",
      opts.itens === "reservas"
        ? "📅 <b>Reservas</b>"
        : opts.itens === "misto"
          ? "🎫 <b>Ingressos e reservas</b>"
          : "🎫 <b>Ingressos</b>",
    );
    // O card É o briefing: com a página do pedido removida, a lista de nomes é a ÚNICA fonte do "o que
    // foi pedido" — logo abaixo do assunto, os nomes exatamente como o lead os escolheu.
    const nomes = (opts.itemNames ?? []).map((s) => s.trim()).filter(Boolean);
    if (nomes.length) lines.push(nomes.map(esc).join(", "));
  } else if (assunto) {
    lines.push("", `🗺️ <b>Roteiro:</b> ${esc(assunto)}`);
  }
  // ⚠️ O link público /r/[token] foi removido (página deletada na simplificação Compras PY).
  return lines;
}

/**
 * Linhas informativas do lead, SEMPRE nesta ordem: perfil → idioma → dia → ingressos → transporte.
 *
 * ⚠️ Fonte ÚNICA, como `baseLines`. Este bloco já esteve copiado em cinco montadores, e foi exatamente
 * assim que o card do "Assumir Lead" acabou perdendo todas essas linhas enquanto os outros as mantinham:
 * a correção foi aplicada numa cópia e as demais seguiram divergindo em silêncio. Ao criar uma
 * notificação nova, chamar esta função — não reescrever a sequência.
 */
function detailLines(
  n: Pick<
    NewLeadNotice,
    "nome" | "isLocal" | "alreadyInFoz" | "locale" | "visitDate" | "ticketQty" | "wantsTransport"
  >,
  /** WhatsApp do lead — passar SÓ onde ele pode aparecer (§12: no card com fila, o número fica oculto
   * até o claim/confirm). Quem não deve exibir simplesmente não passa. */
  opts?: { whatsapp?: string | null },
): string[] {
  return [
    `👤 <b>Nome:</b> ${esc(n.nome) || "—"}`,
    opts?.whatsapp ? `📱 <b>WhatsApp:</b> ${esc(opts.whatsapp)}` : null,
    profileLine(n.isLocal, n.alreadyInFoz),
    localeLine(n.locale),
    visitDateLine(n.visitDate),
    ticketQtyLine(n.ticketQty),
    transportLine(n.wantsTransport),
  ].filter((l): l is string => Boolean(l));
}

/**
 * Envia o aviso de NOVO LEAD ao grupo de vendedores com o botão inline [🙋‍♂️ Assumir Lead].
 * ⚠️ O WhatsApp do cliente NÃO é exibido aqui de propósito (anti-colisão): só é revelado, via
 * botão wa.me, para o vendedor que assumir (ver o webhook). Retorna o `message_id` ou `null`.
 */
export async function notifyNewLead(n: NewLeadNotice, chatId: string | null): Promise<number | null> {
  if (!BOT_TOKEN || !chatId) return null;

  const linhas = baseLines({
    roteiroTitulo: n.roteiroTitulo,
    roteiroSlug: n.roteiroSlug,
    productKind: n.productKind,
    itens: n.itens,
    itemNames: n.itemNames,
    pedidoToken: n.pedidoToken,
  });
  linhas.push("", ...detailLines(n));
  const hora = nowBRT();
  if (hora) linhas.push(`🕐 Enviado em: ${hora}`);
  linhas.push("", "Clique para assumir e receber o WhatsApp do cliente 👇");

  const result = await call<{ message_id: number }>("sendMessage", {
    chat_id: chatId,
    text: linhas.join("\n"),
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[{ text: "🙋‍♂️ Assumir Lead", callback_data: `claim:${n.leadId}` }]],
    },
  });

  return result?.message_id ?? null;
}

/**
 * Modo CENTRAL (passivo): a agência tem UM número central que atende o lead direto pelo site.
 * O Telegram vira só LOG/histórico — SEM botão "Assumir" (não distribuímos).
 *
 * `confirmFlow` (item A): quando o sucesso do modal é o botão "Iniciar conversa" central (mesmo
 * WhatsApp compartilhado), o WhatsApp do lead fica OCULTO até um vendedor tocar [✅ Confirmar] —
 * a edição (`editConfirmedMessage`) então libera o botão "Iniciar conversa". SEM claim atômico:
 * qualquer vendedor pode confirmar (não há disputa — é o mesmo número central pra todos, então
 * cair na conversa já iniciada pelo lead não é colisão). Sem `confirmFlow`, mantém o comportamento
 * antigo: WhatsApp visível direto no texto, sem botão (a agência atende sozinha, fora do Telegram).
 */
export async function notifyLeadLog(
  n: NewLeadNotice & { whatsapp: string; confirmFlow?: boolean },
  chatId: string | null,
): Promise<number | null> {
  if (!BOT_TOKEN || !chatId) return null;

  const linhas = baseLines({
    roteiroTitulo: n.roteiroTitulo,
    roteiroSlug: n.roteiroSlug,
    productKind: n.productKind,
    itens: n.itens,
    itemNames: n.itemNames,
    pedidoToken: n.pedidoToken,
  });
  linhas.push("", ...detailLines(n, { whatsapp: n.confirmFlow ? null : n.whatsapp }));
  const hora = nowBRT();
  if (hora) linhas.push(`🕐 Enviado em: ${hora}`);
  linhas.push(
    "",
    n.confirmFlow
      ? "⚠️ <b>Modo Central Ativo:</b> toque em Confirmar para liberar o botão de iniciar conversa 👇"
      : "⚠️ <b>Modo Central Ativo:</b> o lead acabou de visualizar o botão para chamar o número central.",
  );

  const result = await call<{ message_id: number }>("sendMessage", {
    chat_id: chatId,
    text: linhas.join("\n"),
    parse_mode: "HTML",
    ...(n.confirmFlow
      ? { reply_markup: { inline_keyboard: [[{ text: "✅ Confirmar", callback_data: `confirm:${n.leadId}` }]] } }
      : {}), // sem confirmFlow: é log puro, sem "Assumir" nem "Confirmar".
  });

  return result?.message_id ?? null;
}

/**
 * Teclado do card SEM AGÊNCIA: um botão URL `[📲 Iniciar conversa]` com o wa.me do lead já montado.
 *
 * ⚠️⚠️ **Exceção DELIBERADA à anti-colisão do §12** (que manda esconder o WhatsApp do turista até
 * alguém assumir). Aquela regra existe pra impedir que dois vendedores atropelem o mesmo lead — e sem
 * agência definida não há dois vendedores: o dono do site atende sozinho. Sem o botão, o lead capturado
 * nesse período viraria um registro que ninguém consegue responder. Com agência ativa nada muda: lá
 * continua valendo "Assumir"/"Confirmar" e o número segue escondido até o claim.
 * Sem `whatsapp` (ex.: rascunho) → card sem botão, como era antes.
 */
function infoOnlyKeyboard(n: NewLeadNotice & { whatsapp?: string | null; greetingTemplate?: string | null }) {
  if (!n.whatsapp) return {};
  return {
    reply_markup: {
      inline_keyboard: [[{
        text: "📲 Iniciar conversa",
        url: buildWaUrl(n.whatsapp, n.nome, n.greetingTemplate, {
          resumo: n.resumo,
          token: n.pedidoToken,
          kind: n.productKind,
          locale: isLocale(n.locale) ? n.locale : DEFAULT_LOCALE,
          itens: n.itens,
          itemCount: n.itemNames?.length ?? 0,
          nomes: n.itemNames,
        }),
      }]],
    },
  };
}

/**
 * Card do cenário SEM AGÊNCIA definida/ativa: o lead continua sendo registrado no grupo E ganha o CTA
 * de iniciar a conversa já liberado (ver `infoOnlyKeyboard` pro porquê da exceção ao §12). Serve pro
 * dono atender pessoalmente e repassar depois, em vez de perder o lead enquanto não há contrato.
 * Retorna o `message_id` (a rota grava em `leads.telegram_message_id`) ou `null`.
 */
export async function notifyLeadInfoOnly(
  n: NewLeadNotice & { whatsapp?: string | null; greetingTemplate?: string | null },
  chatId: string | null,
): Promise<number | null> {
  if (!BOT_TOKEN || !chatId) return null;

  const linhas = baseLines({
    roteiroTitulo: n.roteiroTitulo,
    roteiroSlug: n.roteiroSlug,
    productKind: n.productKind,
    itens: n.itens,
    itemNames: n.itemNames,
    pedidoToken: n.pedidoToken,
    infoOnly: true,
  });
  linhas.push("", ...detailLines(n));
  const hora = nowBRT();
  if (hora) linhas.push(`🕐 Enviado em: ${hora}`);
  linhas.push("", "⚠️ Sem agência atendendo — o atendimento é seu 👇");

  const result = await call<{ message_id: number }>("sendMessage", {
    chat_id: chatId,
    text: linhas.join("\n"),
    parse_mode: "HTML",
    ...infoOnlyKeyboard(n),
  });

  return result?.message_id ?? null;
}

/**
 * RECONCILIAÇÃO DE REENVIO (Sprint 6, decisão do usuário) — reescreve o card que já está no grupo com
 * os dados do NOVO envio, em vez de empilhar um segundo card do mesmo turista. Cenário real (portado do
 * RG, leads 387/388 lá): a mesma pessoa reenvia o MESMO produto dentro da janela de dedup (perdeu o
 * `known-lead`/trocou de aparelho) — o card antigo ainda está pendente na fila; reescrevê-lo com o
 * contexto mais recente entrega a informação atualizada à agência SEM duplicar a fila.
 *
 * ⚠️ Só usar com o card AINDA PENDENTE (`claimed_by is null` — checado pelo chamador): reescrever um
 * card já assumido apagaria o "✅ Assumido por X" e o botão do dono. Já assumido → card NOVO pelo
 * caminho normal (decisão do usuário).
 *
 * ⚠️ **O chamador NUNCA pode cair em `sendMessage` quando isto devolver `false`.** Reenvio idêntico gera
 * texto idêntico, o Telegram responde "message is not modified", `call` devolve `null` e o retorno é
 * `false` — mas o card certo já está no grupo, e um fallback de envio recriaria a duplicata que esta
 * função existe pra evitar.
 */
export async function editLeadCard(
  n: NewLeadNotice & {
    whatsapp?: string | null;
    /** `true` = modo passivo (log/central); `false` = modo `assume` (botão "Assumir Lead"). */
    passive?: boolean;
    confirmFlow?: boolean;
    /** `created_at` do lead ORIGINAL — o card preserva a hora de entrada na fila. */
    sentAt?: Date | null;
  },
  chatId: string | null,
  messageId: number,
): Promise<boolean> {
  if (!BOT_TOKEN || !chatId) return false;

  // Contato só aparece no log PURO (passivo sem confirmFlow) — em assume/confirmFlow o número segue
  // escondido até alguém assumir/confirmar (mesma regra de notifyLeadLog).
  const contactPublic = n.passive === true && !n.confirmFlow;

  const linhas = baseLines({
    roteiroTitulo: n.roteiroTitulo,
    roteiroSlug: n.roteiroSlug,
    productKind: n.productKind,
    itens: n.itens,
    itemNames: n.itemNames,
    pedidoToken: n.pedidoToken,
  });
  linhas.push("", ...detailLines(n, { whatsapp: contactPublic ? n.whatsapp : null }));
  // Rótulo ÚNICO em toda notificação (`🕐 Enviado em:`): é sempre o mesmo fato — a hora em que o lead
  // preencheu o formulário. Duas etiquetas para o mesmo dado ("Enviado"/"Recebido") só faziam quem lê o
  // grupo comparar cards e supor uma diferença que não existe.
  if (n.sentAt) linhas.push(`🕐 Enviado em: ${formatBRT(n.sentAt)}`);
  // Marca explícita do reenvio: sem ela o card mudaria "sozinho" na tela de quem já tinha lido.
  const agora = nowBRT();
  if (agora) linhas.push(`🔄 <b>Atualizado em:</b> ${agora} (novo envio do mesmo cliente)`);
  linhas.push(
    "",
    n.passive
      ? n.confirmFlow
        ? "⚠️ Toque em Confirmar para liberar o botão de iniciar conversa 👇"
        : "⚠️ <b>Modo Central Ativo:</b> o lead acabou de visualizar o botão para chamar o número central."
      : "Clique para assumir e receber o WhatsApp do cliente 👇",
  );

  const res = await call("editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text: linhas.join("\n"),
    parse_mode: "HTML",
    // Sem `reply_markup` o editMessageText REMOVE o teclado — é o que o log puro quer (nunca teve botão).
    ...(n.passive
      ? n.confirmFlow
        ? { reply_markup: { inline_keyboard: [[{ text: "✅ Confirmar", callback_data: `confirm:${n.leadId}` }]] } }
        : {}
      : { reply_markup: { inline_keyboard: [[{ text: "🙋‍♂️ Assumir Lead", callback_data: `claim:${n.leadId}` }]] } }),
  });
  return res !== null;
}

/**
 * Reescreve um card do cenário SEM AGÊNCIA. Chamador: `/api/leads` (reenvio do mesmo produto dentro
 * da janela de dedup, `updated: true`). Mantém o contrato do cenário: o mesmo teclado do card original
 * (CTA de conversa liberado, ver `infoOnlyKeyboard`) e nenhum botão de fila (Assumir/Confirmar).
 *
 * ⚠️ Dedicado, NÃO reusa `editLeadCard`: aquele injeta `reply_markup` com Assumir/Confirmar — daria
 * acesso ao contato num cenário em que o gate de plano diz que ninguém deve ter (mesma razão pela qual
 * `notifyLeadInfoOnly` não reusa `notifyLeadLog`).
 *
 * `sentAt` = `created_at` do card original (preserva a hora de entrada na fila). Devolve `false` se a
 * edição falhar — e, como em `editLeadCard`, o chamador NÃO deve compensar mandando mensagem nova.
 */
export async function editInfoOnlyCard(
  chatId: string | number,
  messageId: number,
  n: NewLeadNotice & {
    sentAt?: Date | null; updated?: boolean;
    whatsapp?: string | null; greetingTemplate?: string | null;
  },
): Promise<boolean> {
  if (!BOT_TOKEN || !chatId) return false;

  const linhas = baseLines({
    roteiroTitulo: n.roteiroTitulo,
    roteiroSlug: n.roteiroSlug,
    productKind: n.productKind,
    itens: n.itens,
    itemNames: n.itemNames,
    pedidoToken: n.pedidoToken,
    infoOnly: true,
  });
  linhas.push("", ...detailLines(n));
  // Rótulo ÚNICO em toda notificação (`🕐 Enviado em:`): é sempre o mesmo fato — a hora em que o lead
  // preencheu o formulário. Duas etiquetas para o mesmo dado ("Enviado"/"Recebido") só faziam quem lê o
  // grupo comparar cards e supor uma diferença que não existe.
  if (n.sentAt) linhas.push(`🕐 Enviado em: ${formatBRT(n.sentAt)}`);
  // Só no REENVIO (não no pedido de transporte, Sprint 7 — lá a linha 🚐 já é a mudança visível).
  if (n.updated) {
    const agora = nowBRT();
    if (agora) linhas.push(`🔄 <b>Atualizado em:</b> ${agora} (novo envio do mesmo cliente)`);
  }
  linhas.push("", "⚠️ Sem agência atendendo — o atendimento é seu 👇");

  // ⚠️ O teclado É reenviado: `editMessageText` sem `reply_markup` REMOVE o botão, e a reescrita
  // deixaria o card sem o CTA de conversa que o original tinha.
  const res = await call("editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text: linhas.join("\n"),
    parse_mode: "HTML",
    ...infoOnlyKeyboard(n),
  });
  return res !== null;
}

const firstNameOf = (nome: string | null) => (nome ?? "").trim().split(/\s+/)[0] || "";
const fillTemplate = (tpl: string, vars: { nome: string; cupom: string }) =>
  tpl.replace(/\{nome\}/gi, vars.nome).replace(/\{cupom\}/gi, vars.cupom);

// ------------------------------------------------------------------ Webhook (Assumir Lead)

/** Nome legível do vendedor a partir do `from` do callback_query. */
export function formatClaimer(from: {
  first_name?: string;
  last_name?: string;
  username?: string;
  id?: number;
}): string {
  const nome = [from.first_name, from.last_name].filter(Boolean).join(" ").trim();
  const uname = from.username ? `@${from.username}` : "";
  const label = [nome, uname && `(${uname})`].filter(Boolean).join(" ").trim();
  return (label || `id:${from.id ?? "?"}`).slice(0, 80);
}

/** Responde ao clique (tira o "loading" do botão). Alerta popup se `showAlert`. */
export async function answerCallback(
  callbackQueryId: string,
  text?: string,
  showAlert = false
): Promise<void> {
  await call("answerCallbackQuery", {
    callback_query_id: callbackQueryId,
    ...(text ? { text } : {}),
    show_alert: showAlert,
  });
}

/**
 * Monta o link wa.me do cliente (mesma lógica do cofre de leads: só dígitos, mantém DDI). A saudação é
 * EDITÁVEL no admin (Oferta da agência), por idioma — `template` vem de `getAgencyGreeting(locale)` no
 * caller (lib/offer-settings.ts). Sem template configurado → cai no default (`DEFAULT_WA_GREETING.pt`).
 * Placeholder `{nome}`. `visitDate`/`ticketQty` (D5/D6, opcionais): anexa um resumo curto ("📅 Dia" /
 * "🎟️ Ingressos") — o vendedor já chega sabendo o que o lead escolheu, sem precisar perguntar de novo.
 */
export function buildWaUrl(
  whatsapp: string,
  nome: string | null,
  template?: string | null,
  pedido?: {
    /** Resumo de uma linha, na voz da AGÊNCIA (`resumoCurto(..., "agencia")`). */
    resumo?: string | null;
    /** Token do pedido — vira a linha de link. Sem ele a mensagem sai só com intro + resumo. */
    token?: string | null;
    kind?: ProductCopyKind;
    locale?: Locale;
    /** Classificação dos itens — muda o rótulo do link (§17-ter). */
    itens?: ItensKind;
    /** Nº de itens (pro `{pedidos}` da saudação) e os NOMES (lista "Para: …"). */
    itemCount?: number;
    nomes?: string[];
  },
): string {
  const digits = whatsapp.replace(/\D/g, "");
  const tpl = (template ?? "").trim() || DEFAULT_WA_GREETING.pt;
  const intro = fillPedidos(
    fillTemplate(tpl, { nome: firstNameOf(nome), cupom: "" }),
    pedido?.itemCount ?? 0,
    pedido?.locale ?? "pt",
  );
  // Mesma montagem das duas pontas (`lib/pedido-resumo.ts`): intro → resumo → lista "Para: …". Texto
  // PURO aqui — o wa.me não interpreta o HTML do Telegram, então nada de <b> nesta string.
  const msg = buildWaMessage(
    intro,
    pedido?.resumo ?? "",
    pedido?.token ?? null,
    pedido?.kind ?? "atrativo",
    pedido?.locale ?? "pt",
    "agencia",
    { nomes: pedido?.nomes },
  );
  return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
}

export interface ClaimedEdit extends NewLeadNotice {
  chatId: number | string;
  messageId: number;
  claimedBy: string;
  /** `created_at` do lead, JÁ formatado (`formatBRT`) — preserva a hora do ENVIO, nunca a do clique. */
  sentAt?: string | null;
}

/**
 * Edita a mensagem do grupo: some o "Assumir Lead" e exibe "✅ Assumido por <vendedor>" + um botão
 * CALLBACK [📲 Receber WhatsApp do cliente] (`wa:<leadId>`). ⚠️ TG-4: o link do WhatsApp NÃO é mais um
 * botão URL aberto a todos — o webhook autoriza só o DONO (via deep-link no privado); não-dono recebe negado.
 *
 * ⚠️⚠️ **O card assumido continua sendo o BRIEFING do vendedor, não um recibo.** A 1ª versão desta
 * função chamava `baseLines` sem opções e reduzia o card a três linhas — sumiam a tag do
 * produto, o assunto, a montagem, perfil, idioma, dia, ingressos, transporte e o horário. Quem assumia
 * perdia justamente o que precisa para abrir a conversa, e o grupo ficava sem histórico do lead. É o
 * mesmo defeito que `editConfirmedMessage` já tinha corrigido do seu lado: a mensagem serve de LOG, e
 * nada que estava visível pode desaparecer na edição. Ao mexer aqui, preserve todas as linhas.
 *
 * ⚠️ O WhatsApp segue FORA do texto (§12, anti-colisão): mesmo depois do claim, o número só chega ao
 * dono pelo botão. Isto não é esquecimento — não acrescentar.
 */
export async function editClaimedMessage(e: ClaimedEdit): Promise<void> {
  const linhas = baseLines({
    roteiroTitulo: e.roteiroTitulo,
    roteiroSlug: e.roteiroSlug,
    productKind: e.productKind,
    itens: e.itens,
    itemNames: e.itemNames,
    pedidoToken: e.pedidoToken,
  });
  linhas.push("", ...detailLines(e));
  if (e.sentAt) linhas.push(`🕐 Enviado em: ${e.sentAt}`);
  linhas.push("", `✅ <b>Assumido por ${esc(e.claimedBy)}</b>`);
  const text = linhas.join("\n");

  await call("editMessageText", {
    chat_id: e.chatId,
    message_id: e.messageId,
    text,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[{ text: "📲 Receber WhatsApp do cliente", callback_data: `wa:${e.leadId}` }]],
    },
  });
}

export interface ConfirmedEdit extends NewLeadNotice {
  chatId: number | string;
  messageId: number;
  whatsapp: string;
  confirmedBy: string;
  greetingTemplate?: string | null;
  sentAt?: string | null; // horário ORIGINAL do envio (já formatado, `formatBRT`) — preserva o log, não usa o horário do clique
}

/**
 * Edita a mensagem do log (modo central, item A): some o "Confirmar" e exibe "✅ Confirmado por
 * <vendedor>" + um botão URL [📲 Iniciar conversa] já com o wa.me + saudação da agência prontos.
 * Botão URL direto (não callback) porque é o MESMO número central pra todos — sem dono a travar,
 * ao contrário do `wa:<id>` do modo "Assumir" (TG-4).
 * ⚠️ **A edição não pode ocultar nada que já estava visível.** Esta mensagem SERVE DE LOG (o histórico
 * do lead no grupo), então reconstrói TODAS as linhas do `notifyLeadLog` original — tag, assunto,
 * montagem, WhatsApp, perfil, idioma, dia, ingressos, transporte, horário — e só troca o rodapé
 * (prompt "Confirmar" → "✅ Confirmado por X"). Substituir o texto por nome+status deixa o vendedor sem
 * o briefing no exato momento em que ele vai abrir a conversa.
 */
export async function editConfirmedMessage(e: ConfirmedEdit): Promise<void> {
  const linhas = baseLines({
    roteiroTitulo: e.roteiroTitulo,
    roteiroSlug: e.roteiroSlug,
    productKind: e.productKind,
    itens: e.itens,
    itemNames: e.itemNames,
    pedidoToken: e.pedidoToken,
  });
  linhas.push("", ...detailLines(e, { whatsapp: e.whatsapp }));
  if (e.sentAt) linhas.push(`🕐 Enviado em: ${e.sentAt}`);
  linhas.push("", `✅ <b>Confirmado por ${esc(e.confirmedBy)}</b>`);

  await call("editMessageText", {
    chat_id: e.chatId,
    message_id: e.messageId,
    text: linhas.join("\n"),
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[{
        text: "📲 Iniciar conversa",
        url: buildWaUrl(e.whatsapp, e.nome, e.greetingTemplate, {
          resumo: e.resumo,
          token: e.pedidoToken,
          kind: e.productKind,
          locale: isLocale(e.locale) ? e.locale : DEFAULT_LOCALE,
          itens: e.itens,
          itemCount: e.itemNames?.length ?? 0,
          nomes: e.itemNames,
        }),
      }]],
    },
  });
}

// ------------------------------------------------------------------ TG-4: link travado no dono (deep-link)

let cachedUsername: string | null = null;
/** Username do bot (via getMe, cacheado) — necessário para montar o deep-link `t.me/<bot>?start=...`. */
export async function getBotUsername(): Promise<string | null> {
  if (cachedUsername) return cachedUsername;
  const me = await call<{ username?: string }>("getMe", {});
  cachedUsername = me?.username ?? null;
  return cachedUsername;
}

/** Deep-link que abre o bot no privado com um parâmetro (`/start <param>`). `null` se sem username. */
export async function buildStartDeepLink(param: string): Promise<string | null> {
  const u = await getBotUsername();
  return u ? `https://t.me/${u}?start=${encodeURIComponent(param)}` : null;
}

/** answerCallbackQuery com URL (o client abre o link — só aceita t.me/deep-link ou game). */
export async function answerCallbackUrl(callbackQueryId: string, url: string): Promise<void> {
  await call("answerCallbackQuery", { callback_query_id: callbackQueryId, url });
}

/** Mensagem simples no privado de um usuário (id = chat_id). Retorna true se enviou. */
export async function sendPrivateText(userId: number, text: string): Promise<boolean> {
  const res = await call("sendMessage", { chat_id: userId, text, parse_mode: "HTML" });
  return res !== null;
}

/**
 * DM privado com o botão wa.me do cliente (o dono já abriu o bot via deep-link → o bot pode responder).
 * Aqui o botão URL é OK: é o chat privado do próprio dono, ninguém mais vê. `greetingTemplate` = saudação
 * editável no admin pro idioma do lead (`getAgencyGreeting(locale)` no caller) — undefined usa o default.
 */
export async function sendPrivateWa(
  userId: number,
  nome: string | null,
  whatsapp: string,
  greetingTemplate?: string | null,
  pedido?: {
    resumo?: string | null;
    token?: string | null;
    kind?: ProductCopyKind;
    locale?: Locale;
    itens?: ItensKind;
    itemCount?: number;
    nomes?: string[];
  },
): Promise<boolean> {
  const res = await call("sendMessage", {
    chat_id: userId,
    text: `📇 <b>WhatsApp do cliente${nome ? " " + esc(nome) : ""}</b>\nToque no botão para iniciar o atendimento 👇`,
    parse_mode: "HTML",
    reply_markup: { inline_keyboard: [[{ text: "📲 Abrir WhatsApp do cliente", url: buildWaUrl(whatsapp, nome, greetingTemplate, pedido) }]] },
  });
  return res !== null;
}

// ------------------------------------------------------------------ Ping de lead pendente (Sprint 11)

/** Apaga uma mensagem do grupo (usado pelo cron pra remover o ping anterior antes de mandar um novo). */
export async function deleteMessage(chatId: string | number, messageId: number): Promise<void> {
  await call("deleteMessage", { chat_id: chatId, message_id: messageId });
}

const PENDING_ALERT_MAX_NAMES = 20; // segurança — evita uma mensagem gigante em backlogs fora do normal

/**
 * Avisa quem está sem "Assumir"/"Confirmar", listando NOME + tempo de espera de cada um — deixa claro
 * quem e há quanto tempo, sem precisar abrir o painel (mesmo `formatWait` dos cards individuais). O
 * chamador (cron) cuida de apagar a anterior antes de mandar essa — nunca deve haver 2 pings vivos ao
 * mesmo tempo (por isso uma lista, e não uma mensagem por pessoa, evita duplicar spam quando há mais de
 * um). Retorna o `message_id` ou `null`.
 */
export async function sendPendingAlert(chatId: string | number, leads: OverdueLead[]): Promise<number | null> {
  const shown = leads.slice(0, PENDING_ALERT_MAX_NAMES);
  const extra = leads.length - shown.length;
  const linhas = [
    "⏰ <b>Aguardando confirmação:</b>",
    ...shown.map((l) => `• ${esc(l.nome)} - Há ${formatWait(l.waitSeconds)}`),
  ];
  if (extra > 0) linhas.push(`+ ${extra} outro${extra > 1 ? "s" : ""}`);

  const result = await call<{ message_id: number }>("sendMessage", {
    chat_id: chatId,
    text: linhas.join("\n"),
    parse_mode: "HTML",
  });
  return result?.message_id ?? null;
}
