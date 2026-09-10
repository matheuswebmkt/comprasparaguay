// Filepath: app/api/telegram-webhook/route.ts
// Version: 2.3
// Nome da Versão: "Ping de lead pendente (Sprint 11) — apaga o aviso quando não sobra mais lead atrasado"
// Baseado na Versão: 2.1
//
// O Telegram faz POST aqui em dois momentos:
//  1) callback_query — clique num botão inline do grupo: `claim:<id>` (assumir) ou `wa:<id>` (pedir WhatsApp).
//  2) message — `/start lead_<id>` no PRIVADO do bot (o dono chegou via deep-link) → o bot manda o wa.me.
// ⚠️ SEGURANÇA (conventions §12): rota chamada pelos servidores do Telegram (origem externa) → NÃO usa
// same-origin; a defesa é o `secret_token` (header X-Telegram-Bot-Api-Secret-Token). Sem match → 401.

import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import {
  answerCallback,
  answerCallbackUrl,
  buildStartDeepLink,
  deleteMessage,
  editClaimedMessage,
  editConfirmedMessage,
  formatBRT,
  formatClaimer,
  sendPrivateText,
  sendPrivateWa,
} from "@/lib/telegram";
import { getWaGreetingFor } from "@/lib/offer-settings";
import { itensKind } from "@/lib/offer-defaults";
import { atrativoNomes, productKindOf } from "@/lib/lead-card";
import { getPendingAlertMessageId, setPendingAlertMessageId, countOverdueLeads, resolveAlertChatId, LEAD_ALERT_MIN } from "@/lib/lead-alerts";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n/config";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Se não sobrar NENHUM lead ATRASADO (mesma régua `LEAD_ALERT_MIN` do cron — não qualquer lead sem
 * resposta; um lead recém-chegado não deve travar o aviso de sumir), apaga o ping "aguardando confirmação"
 * (se houver um vivo). Chamado depois de QUALQUER claim/confirm bem-sucedido — best-effort, nunca lança
 * (a rede de segurança do cron cobre o que sobrar). */
async function clearPendingAlertIfAllDone(): Promise<void> {
  try {
    if ((await countOverdueLeads(LEAD_ALERT_MIN)) > 0) return;
    const id = await getPendingAlertMessageId();
    if (!id) return;
    const chatId = await resolveAlertChatId();
    if (chatId) await deleteMessage(chatId, id);
    await setPendingAlertMessageId(null);
  } catch {
    /* rede de segurança do cron cobre o que sobrar */
  }
}

// Sempre 200 (senão o Telegram reenvia), exceto no 401 de auth (não é o Telegram de verdade).
const OK = () => NextResponse.json({ ok: true });

interface TgFrom { id?: number; first_name?: string; last_name?: string; username?: string }
interface TgCallbackQuery {
  id: string;
  from: TgFrom;
  data?: string;
  message?: { message_id: number; chat: { id: number } };
}
interface TgMessage { from?: TgFrom; chat?: { id: number; type?: string }; text?: string }

type LeadRow = {
  nome: string | null; whatsapp: string; claimed_by: string | null; claimed_by_id: string | number | null; locale: string | null;
  // Calendário + quantidade (D5/D6) — a coluna `date` do Neon volta como `Date`, não string.
  visit_date: string | Date | null;
  ticket_qty: number | null;
  // Contexto do produto — resolve QUAL saudação de "3b · Textos por produto" usar no wa.me, na voz
  // portal × agência (ver `greetingFor`).
  lead_context: string | null;
  roteiro_slug: string | null;
  roteiro_titulo: string | null;
  cta_type: string | null;
  // Pedido público: TODO caminho que monta um wa.me precisa do link do resumo — inclusive o DM do
  // dono (`wa:<id>`) e o deep-link (`/start lead_<id>`) — e o card de dia/pessoas/transporte das edições.
  public_token: string | null;
  item_slugs: string | null;
  roteiro_dias: string | null;
  roteiro_pessoas: string | null;
  wants_transport: boolean | null;
};
// Linha completa do card: TODA edição pós-clique (Assumir e Confirmar) reescreve a mensagem inteira, e
// ela é o LOG do lead no grupo — precisa dos mesmos campos que a notificação original mostrou, senão a
// edição apaga o briefing do vendedor (ver `editClaimedMessage`/`editConfirmedMessage`).
type CardLeadRow = LeadRow & {
  is_local: boolean | null;
  already_in_foz: boolean | null;
  created_at: string;
};
/** O claim NÃO traz o contato: §12 manda revelar o número só ao dono, pelo botão — o card assumido
 * segue sem WhatsApp no texto, então nem faz sentido carregar o dado até aqui. */
type ClaimedCardRow = Omit<CardLeadRow, "whatsapp" | "claimed_by" | "claimed_by_id">;
// ⚠️ A lista de colunas é repetida literalmente nas duas queries (o `returning` do claim e o `select` do
// confirm) porque o driver do Neon parametriza qualquer `${}` — uma const interpolada viraria placeholder,
// não SQL. Ao acrescentar um campo ao card, acrescentar NOS DOIS lugares.
/**
 * Saudação pronta do wa.me, no idioma do LEAD (`leads.locale`; legado sem locale → pt) e no bucket de
 * produto DELE ("3b · Textos por produto"): quem pediu ingresso de atrativo recebe uma abertura
 * diferente de quem pediu roteiro sob medida. Ver `productKindOf` (lib/lead-card.ts).
 */
type LeadProductCols = Pick<LeadRow, "lead_context" | "roteiro_slug" | "roteiro_titulo" | "cta_type">;
/** Linha do banco → contexto de produto de `lib/lead-card.ts` (fonte única da tag e do bucket de copy). */
const productCtxOf = (lead: LeadProductCols) => ({
  leadContext: lead.lead_context,
  roteiroSlug: lead.roteiro_slug,
  roteiroTitulo: lead.roteiro_titulo,
  ctaType: lead.cta_type,
});
/**
 * Saudação pronta do wa.me, no idioma do LEAD (`leads.locale`; legado sem locale → pt) e no bucket de
 * produto DELE ("3b · Textos por produto"): quem pediu ingresso de atrativo recebe uma abertura
 * diferente de quem pediu roteiro sob medida. Ver `productKindOf` (lib/lead-card.ts).
 *
 * ⚠️ VOZ CONDICIONAL — quem fala depende do estado ATUAL da agência (lido no momento da chamada):
 *   • AGÊNCIA definida + plano vigente → `waGreetingAgency`, com `{agencia}` já substituído pelo nome
 *     da agência ativa ("Aqui é a agência Foz Falls. Recebemos...") — o lead vê logo com quem fala.
 *   • SEM agência ativa (nenhuma definida, plano vencido ou agência desativada) → voz do PORTAL:
 *     "Aqui é do Compras Paraguay" (`waGreeting`) — independe do toggle "Receber os leads no grupo",
 *     que só decide se o card vai ao grupo, não quem fala no wa.me.
 * Os cards/botões criados antes de uma virada de estado guardam a voz do momento em que foram
 * montados; os caminhos de clique (`wa:<id>`, deep-link) re-resolvem no ato, então o DM chega na voz
 * corrente.
 */
const greetingFor = async (lead: LeadRow): Promise<string> =>
  // Voz portal × agência resolvida na fonte única (`getWaGreetingFor`, lib/offer-settings.ts) — o
  // webhook não decide a voz, só deriva produto/idioma do lead e delega.
  getWaGreetingFor(
    productKindOf(productCtxOf(lead)),
    isLocale(lead.locale) ? lead.locale : DEFAULT_LOCALE,
  );
/** Campos do card que só dependem do contexto de produto — os mesmos nas duas edições pós-clique. */
const cardProductFields = (lead: LeadProductCols) => ({
  roteiroTitulo: lead.roteiro_titulo,
  roteiroSlug: lead.roteiro_slug,
  productKind: productKindOf(productCtxOf(lead)),
});

/**
 * Pedido (link do resumo) a partir da linha já gravada — o que os wa.me pós-clique precisam.
 * A mensagem pronta é só intro + "Ver resumo: link"; nada de resumo/nomes no texto.
 */
const pedidoDoLead = (lead: LeadRow) => ({
  token: lead.public_token,
  locale: isLocale(lead.locale) ? lead.locale : DEFAULT_LOCALE,
});
const ownerIdOf = (l: { claimed_by_id: string | number | null }) =>
  l.claimed_by_id != null ? Number(l.claimed_by_id) : null;

export async function POST(req: NextRequest) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const got = req.headers.get("x-telegram-bot-api-secret-token");
  if (!secret || got !== secret) return new NextResponse(null, { status: 401 });

  let update: { callback_query?: TgCallbackQuery; message?: TgMessage };
  try {
    update = (await req.json()) as typeof update;
  } catch {
    return OK();
  }

  if (update.callback_query) return handleCallback(update.callback_query);
  if (update.message) return handleMessage(update.message);
  return OK();
}

// ------------------------------------------------------------------ callback_query
async function handleCallback(cq: TgCallbackQuery): Promise<NextResponse> {
  const sql = getSql();
  if (!sql) {
    await answerCallback(cq.id, "Sistema temporariamente indisponível.");
    return OK();
  }

  const claimMatch = /^claim:(\d+)$/.exec(cq.data ?? "");
  const waMatch = /^wa:(\d+)$/.exec(cq.data ?? "");
  const confirmMatch = /^confirm:(\d+)$/.exec(cq.data ?? "");

  // ---- Assumir Lead ----
  if (claimMatch) {
    const chatId = cq.message?.chat?.id;
    const messageId = cq.message?.message_id;
    if (!chatId || !messageId) {
      await answerCallback(cq.id, "Ação inválida.");
      return OK();
    }
    const leadId = Number(claimMatch[1]);
    const claimer = formatClaimer(cq.from);
    const claimerId = cq.from.id ?? null;

    // Claim ATÔMICO (primeiro clique vence) — grava também o user_id (TG-4: trava o wa.me no dono).
    // O `returning` traz as colunas do CARD (não só o nome): a edição reescreve a mensagem inteira, e
    // sem elas o card assumido perderia tag, assunto, montagem, perfil, idioma, dia, ingressos,
    // transporte e horário. Vem do próprio UPDATE atômico — nenhuma query extra.
    let claimed: ClaimedCardRow[];
    try {
      claimed = (await sql`
        update leads
           set claimed_by = ${claimer}, claimed_by_id = ${claimerId}, claimed_at = now()
         where id = ${leadId} and claimed_by is null
        returning nome, locale, is_local, already_in_foz, wants_transport, created_at,
                  visit_date, ticket_qty, lead_context, roteiro_slug, roteiro_titulo, cta_type,
                  public_token, item_slugs, roteiro_dias, roteiro_pessoas
      `) as ClaimedCardRow[];
    } catch (err) {
      if (process.env.NODE_ENV === "development") console.error("webhook claim error:", err);
      await answerCallback(cq.id, "Erro ao processar. Tente novamente.");
      return OK();
    }

    if (claimed.length === 0) {
      let by = "outro vendedor";
      try {
        const cur = (await sql`select claimed_by from leads where id = ${leadId}`) as { claimed_by: string | null }[];
        if (cur[0]?.claimed_by) by = cur[0].claimed_by;
      } catch { /* fallback */ }
      await answerCallback(cq.id, `⚠️ Esse lead já foi assumido por ${by}.`, true);
      return OK();
    }

    await answerCallback(cq.id, "✅ Lead seu! Toque em “Receber WhatsApp do cliente”.");
    const lead = claimed[0];
    await editClaimedMessage({
      chatId,
      messageId,
      leadId,
      claimedBy: claimer,
      nome: lead.nome,
      ...cardProductFields(lead),
      // ⓘ `itens` acompanha `itemNames` SEMPRE: sem ele o rótulo do assunto regride para "🎫 Ingressos"
      // na edição pós-claim (o struct original do card vinha do body com a classificação certa).
      itens: itensKind((lead.item_slugs ?? "").split(",").filter(Boolean)),
      pedidoToken: lead.public_token,
      itemNames: atrativoNomes((lead.item_slugs ?? "").split(",").filter(Boolean)),
      isLocal: lead.is_local,
      alreadyInFoz: lead.already_in_foz,
      wantsTransport: lead.wants_transport,
      locale: lead.locale,
      visitDate: lead.visit_date,
      ticketQty: lead.ticket_qty,
      // Horário do ENVIO do lead, não o do clique em Assumir — o card é o log do lead.
      sentAt: formatBRT(new Date(lead.created_at)),
    });
    await clearPendingAlertIfAllDone();
    return OK();
  }

  // ---- Receber WhatsApp (só o DONO) ----
  if (waMatch) {
    const leadId = Number(waMatch[1]);
    let lead: LeadRow | undefined;
    try {
      const rows = (await sql`
        select nome, whatsapp, claimed_by, claimed_by_id, locale, visit_date, ticket_qty,
               lead_context, roteiro_slug, roteiro_titulo, cta_type,
               public_token, item_slugs, roteiro_dias, roteiro_pessoas, wants_transport
          from leads where id = ${leadId}
      `) as LeadRow[];
      lead = rows[0];
    } catch { /* trata abaixo */ }
    if (!lead) {
      await answerCallback(cq.id, "Lead não encontrado.");
      return OK();
    }
    const ownerId = ownerIdOf(lead);
    // Não é o dono (e há dono definido) → negado.
    if (ownerId != null && cq.from.id !== ownerId) {
      await answerCallback(cq.id, `⚠️ Esse lead é de ${lead.claimed_by ?? "outro vendedor"}. Fale com quem assumiu.`, true);
      return OK();
    }
    // Dono (ou legado sem id): tenta DM DIRETO (após o 1º Start, sem "/start" repetido a cada clique).
    // Só cai no deep-link na PRIMEIRA vez (quando o vendedor ainda não iniciou o bot → o DM falha).
    const sentDirect = cq.from.id != null
      ? await sendPrivateWa(cq.from.id, lead.nome, lead.whatsapp, await greetingFor(lead), pedidoDoLead(lead))
      : false;
    if (sentDirect) {
      await answerCallback(cq.id, "✅ WhatsApp do cliente enviado no seu privado com o bot.");
    } else {
      const deep = await buildStartDeepLink(`lead_${leadId}`);
      if (deep) await answerCallbackUrl(cq.id, deep);
      else await answerCallback(cq.id, `WhatsApp do cliente: ${lead.whatsapp}`, true); // fallback sem username do bot
    }
    return OK();
  }

  // ---- Confirmar (modo central, item A) — sem claim atômico: qualquer vendedor pode confirmar,
  // pois é o MESMO WhatsApp central pra todos (não há disputa a evitar, ao contrário do "Assumir"). ----
  if (confirmMatch) {
    const chatId = cq.message?.chat?.id;
    const messageId = cq.message?.message_id;
    if (!chatId || !messageId) {
      await answerCallback(cq.id, "Ação inválida.");
      return OK();
    }
    const leadId = Number(confirmMatch[1]);
    const confirmer = formatClaimer(cq.from);

    let lead: CardLeadRow | undefined;
    try {
      const rows = (await sql`
        select nome, whatsapp, claimed_by, claimed_by_id, locale,
               is_local, already_in_foz, wants_transport, created_at, visit_date, ticket_qty,
               lead_context, roteiro_slug, roteiro_titulo, cta_type,
               public_token, item_slugs, roteiro_dias, roteiro_pessoas
          from leads where id = ${leadId}
      `) as CardLeadRow[];
      lead = rows[0];
    } catch { /* trata abaixo */ }
    if (!lead) {
      await answerCallback(cq.id, "Lead não encontrado.");
      return OK();
    }

    // ⚠️ Confirmar TAMBÉM marca o lead como atendido (mesmas colunas do claim): sem isto, o lead
    // confirmado ficava com `claimed_at is null` pra sempre — continuava contando como atrasado
    // (countOverdueLeads), o ping "⏰ Aguardando confirmação" NUNCA sumia do grupo e o cron o
    // re-anunciava a cada ciclo. Guarda "primeiro vence", igual ao claim.
    try {
      await sql`
        update leads
           set claimed_by = ${confirmer}, claimed_by_id = ${cq.from.id ?? null}, claimed_at = now()
         where id = ${leadId} and claimed_by is null
      `;
    } catch (err) {
      if (process.env.NODE_ENV === "development") console.error("webhook confirm-mark error:", err);
      // best-effort: sem a marcação o ping ficaria preso — mas o card editado ainda vale como log
    }

    await answerCallback(cq.id, "✅ Confirmado! Toque em “Iniciar conversa”.");
    await editConfirmedMessage({
      chatId,
      messageId,
      leadId,
      nome: lead.nome,
      whatsapp: lead.whatsapp,
      confirmedBy: confirmer,
      greetingTemplate: await greetingFor(lead),
      ...cardProductFields(lead),
      pedidoToken: lead.public_token,
      // ⓘ `itens` acompanha `itemNames` SEMPRE: sem ele o rótulo do assunto regride para "🎫 Ingressos"
      // na edição pós-confirm (o struct original do card vinha do body com a classificação certa).
      itens: itensKind((lead.item_slugs ?? "").split(",").filter(Boolean)),
      itemNames: atrativoNomes((lead.item_slugs ?? "").split(",").filter(Boolean)),
      isLocal: lead.is_local,
      alreadyInFoz: lead.already_in_foz,
      wantsTransport: lead.wants_transport,
      locale: lead.locale,
      sentAt: formatBRT(new Date(lead.created_at)),
      visitDate: lead.visit_date,
      ticketQty: lead.ticket_qty,
    });
    await clearPendingAlertIfAllDone();
    return OK();
  }

  await answerCallback(cq.id, "Ação inválida.");
  return OK();
}

// ------------------------------------------------------------------ message (/start lead_<id> no privado)
async function handleMessage(msg: TgMessage): Promise<NextResponse> {
  if (msg.chat?.type !== "private") return OK(); // só o deep-link no privado interessa
  const m = /^\/start\s+lead_(\d+)$/.exec((msg.text ?? "").trim());
  if (!m) return OK();

  const leadId = Number(m[1]);
  const fromId = msg.from?.id;
  if (!fromId) return OK();

  const sql = getSql();
  if (!sql) return OK();

  let lead: LeadRow | undefined;
  try {
    // ⚠️ Este SELECT precisa trazer TODAS as colunas que os cards e o wa.me leem — ele alimenta o
    // PRIMEIRO acesso do vendedor (quando o DM direto ainda falha por falta de /start).
    const rows = (await sql`select nome, whatsapp, claimed_by, claimed_by_id, locale, visit_date, ticket_qty, lead_context, roteiro_slug, roteiro_titulo, cta_type,
               public_token, item_slugs, roteiro_dias, roteiro_pessoas, wants_transport
          from leads where id = ${leadId}`) as LeadRow[];
    lead = rows[0];
  } catch { /* trata abaixo */ }
  if (!lead) {
    await sendPrivateText(fromId, "Lead não encontrado.");
    return OK();
  }
  const ownerId = ownerIdOf(lead);
  if (ownerId != null && fromId !== ownerId) {
    await sendPrivateText(fromId, `⚠️ Este lead é de <b>${lead.claimed_by ?? "outro vendedor"}</b>. Você não pode acessá-lo.`);
    return OK();
  }
  await sendPrivateWa(fromId, lead.nome, lead.whatsapp, await greetingFor(lead), pedidoDoLead(lead));
  return OK();
}
