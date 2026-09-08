// Filepath: lib/pedido-resumo.ts
// Version: 1.0
// Nome da Versão: "Resumo de uma linha + link do pedido — fonte única das 3 superfícies"
//
// Módulo PURO (sem DB, sem catálogo): usado pelo client (modal, tela de sucesso) E pelo server
// (card do Telegram, wa.me pós-claim). É o que impede as três superfícies de descreverem o mesmo
// pedido de três jeitos diferentes.
//
// ⚠️ O resumo é curto DE PROPÓSITO: o DETALHE do pedido são os NOMES, que viajam na lista "Incluído: …"
// montada por `buildWaMessage`/`listaPedidos` — o resumo carrega só data/pessoas/transporte. Se
// precisar de mais um campo aqui, a pergunta certa é se ele não pertence à página.

import type { Locale } from "./i18n/config";
import type { ProductCopyKind } from "./offer-defaults";

/** Quem está falando: muda só a voz do transporte (fato declarado × fato do serviço). */
export type VozResumo = "lead" | "agencia";

export interface ResumoInput {
  kind: ProductCopyKind;
  /** Quantos atrativos/experiências o pedido inclui. */
  itemCount: number;
  /** Faixa de dias do wizard (`1-3` | `4+` | `undecided`). Só o roteiro personalizado usa. */
  wizardDias?: string | null;
  visitDate?: string | Date | null;
  /** Número (modal) ou faixa (wizard, ex.: `3+`). */
  pessoas?: number | string | null;
  wantsTransport?: boolean | null;
}

const T: Record<Locale, {
  atrativos: (n: number) => string;
  experiencias: (n: number) => string;
  dias: (v: string) => string;
  inicio: (d: string) => string;
  pessoas: (v: string) => string;
  transporte: Record<VozResumo, string>;
  faixaMais: (v: string) => string;
  indeciso: string;
  /** "{pedidos}" dos textos: artigo + substantivo, singular/plural conforme o nº de itens. */
  reserva: (n: number) => string;
  /** A data no resumo do pedido de atrativo — vem com o "Para o dia" embutido. */
  paraODia: (d: string) => string;
  /** Prefixo da lista de nomes ("Incluído: Cataratas JL Shopping, Duty Free"). */
  paraLista: string;
}> = {
  pt: {
    atrativos: (n) => `${n} ${n === 1 ? "atrativo" : "atrativos"}`,
    experiencias: (n) => `${n} ${n === 1 ? "experiência" : "experiências"}`,
    dias: (v) => `${v} dias`,
    inicio: (d) => `início ${d}`,
    pessoas: (v) => `${v} ${v === "1" ? "pessoa" : "pessoas"}`,
    // As duas vozes renderizam a MESMA frase de transporte (fato do produto) — o parâmetro segue só
    // como assinatura das chamadas (webhook × tela /obrigado).
    transporte: { lead: "Transporte incluído", agencia: "Transporte incluído" },
    faixaMais: (v) => `${v}+`,
    indeciso: "dias a definir",
    reserva: (n) => (n === 1 ? "a reserva" : "as reservas"),
    paraODia: (d) => `Para o dia ${d}`,
    paraLista: "Incluído",
  },
  en: {
    atrativos: (n) => `${n} ${n === 1 ? "attraction" : "attractions"}`,
    experiencias: (n) => `${n} ${n === 1 ? "experience" : "experiences"}`,
    dias: (v) => `${v} days`,
    inicio: (d) => `starting ${d}`,
    pessoas: (v) => `${v} ${v === "1" ? "person" : "people"}`,
    transporte: { lead: "Transport included", agencia: "Transport included" },
    faixaMais: (v) => `${v}+`,
    indeciso: "days to be defined",
    reserva: (n) => (n === 1 ? "the booking" : "the bookings"),
    paraODia: (d) => `For ${d}`,
    paraLista: "Included",
  },
  es: {
    atrativos: (n) => `${n} ${n === 1 ? "atractivo" : "atractivos"}`,
    experiencias: (n) => `${n} ${n === 1 ? "experiencia" : "experiencias"}`,
    dias: (v) => `${v} días`,
    inicio: (d) => `inicio ${d}`,
    pessoas: (v) => `${v} ${v === "1" ? "persona" : "personas"}`,
    transporte: { lead: "Transporte incluido", agencia: "Transporte incluido" },
    faixaMais: (v) => `${v}+`,
    indeciso: "días a definir",
    reserva: (n) => (n === 1 ? "la reserva" : "las reservas"),
    paraODia: (d) => `Para el día ${d}`,
    paraLista: "Incluido",
  },
};

/** Data (ISO ou `Date` do driver do Neon) → DD/MM/AAAA. Getters UTC: coluna `date` é meia-noite UTC. */
function formatDate(v?: string | Date | null): string | null {
  if (!v) return null;
  if (v instanceof Date) {
    if (Number.isNaN(v.getTime())) return null;
    const d = String(v.getUTCDate()).padStart(2, "0");
    const m = String(v.getUTCMonth() + 1).padStart(2, "0");
    return `${d}/${m}/${v.getUTCFullYear()}`;
  }
  const [y, m, d] = String(v).split("-");
  return y && m && d ? `${d}/${m}/${y}` : null;
}

/** `4+` → "4+ dias" · `undecided` → "dias a definir". */
// ⚠️ Removida na simplificação Compras PY (produto único de atrativo não usa dias de roteiro).

/**
 * Uma linha com o essencial do pedido. No produto único (atrativo) a CONTAGEM saiu do resumo de
 * propósito: os NOMES viajam na lista "Incluído: …" logo abaixo (`buildWaMessage`), então "5 atrativos"
 * era informação duplicada — e a data ganha o "Para o dia" que abre o resumo naturalmente.
 * Campo ausente simplesmente não entra — nada de placeholder (mesma regra do card, G2).
 */
export function resumoCurto(input: ResumoInput, locale: Locale, voz: VozResumo): string {
  const t = T[locale];
  const atrativo = input.kind === "atrativo";
  const partes: string[] = [];

  // Legado (linha de roteiro): mantém a contagem. Produto atrativo: a lista de nomes conta por si.
  if (!atrativo && input.itemCount > 0) {
    partes.push(t.atrativos(input.itemCount));
  }
  const data = formatDate(input.visitDate);
  if (data) partes.push(atrativo ? t.paraODia(data) : data);
  if (input.pessoas != null && input.pessoas !== "" && input.pessoas !== "undecided") {
    const v = String(input.pessoas);
    partes.push(t.pessoas(v.endsWith("+") ? t.faixaMais(v.slice(0, -1)) : v));
  }
  if (input.wantsTransport === true) partes.push(t.transporte[voz]);

  return partes.join(" · ");
}

/** "{pedidos}" → artigo + substantivo no singular/plural do nº de itens ("a reserva" / "as reservas"). */
export function pedidosLabel(itemCount: number, locale: Locale): string {
  return T[locale].reserva(itemCount > 0 ? itemCount : 2);
}

/** Substitui o placeholder `{pedidos}` nos textos por produto (admin-editáveis). Sem placeholder, devolve o texto intacto. */
export function fillPedidos(intro: string, itemCount: number, locale: Locale): string {
  return intro.replace(/\{pedidos\}/gi, pedidosLabel(itemCount, locale));
}

/** Lista de nomes do pedido: "Incluído: Cataratas JL Shopping, Duty Free" — vazia se não houver nomes. */
export function listaPedidos(nomes: string[], locale: Locale): string {
  const limpos = nomes.map((n) => n.trim()).filter(Boolean);
  return limpos.length ? `${T[locale].paraLista}: ${limpos.join(", ")}` : "";
}


/**
 * Monta a mensagem final do wa.me: introdução → resumo → lista "Incluído: <nomes>". Blocos separados por
 * linha em branco, que é como o WhatsApp respira.
 * ⚠️ Parâmetros de produto/voz mantidos na assinatura por compatibilidade de chamadores; a mensagem é
 * genérica (o link /r/[token] foi removido).
 */
export function buildWaMessage(
  intro: string,
  resumo: string,
  _token: string | null | undefined,
  _kind: ProductCopyKind,
  locale: Locale,
  _voz: VozResumo,
  opts?: { nomes?: string[] },
): string {
  return [intro, resumo || null, listaPedidos(opts?.nomes ?? [], locale) || null]
    .filter(Boolean)
    .join("\n\n");
}
