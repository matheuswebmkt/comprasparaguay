// Filepath: lib/pedido-resumo.ts
// Version: 1.0
// Nome da Versão: "Resumo de uma linha + link do pedido — fonte única das 3 superfícies"
//
// Módulo PURO (sem DB, sem catálogo): usado pelo client (modal, tela de sucesso) E pelo server
// (card do Telegram, wa.me pós-claim). É o que impede as três superfícies de descreverem o mesmo
// pedido de três jeitos diferentes.
//
// ⚠️ O resumo é curto DE PROPÓSITO: o detalhe vive na página do pedido (/r/[token]), e mensagem de
// WhatsApp que cresce com o tamanho do roteiro é mensagem que ninguém lê. Se precisar de mais um
// campo aqui, a pergunta certa é se ele não pertence à página.

import type { Locale } from "./i18n/config";
import type { ItensKind, ProductCopyKind } from "./offer-defaults";

/** Quem está falando: muda só a voz do transporte ("quero" × "com"). */
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
}> = {
  pt: {
    atrativos: (n) => `${n} ${n === 1 ? "atrativo" : "atrativos"}`,
    experiencias: (n) => `${n} ${n === 1 ? "experiência" : "experiências"}`,
    dias: (v) => `${v} dias`,
    inicio: (d) => `início ${d}`,
    pessoas: (v) => `${v} ${v === "1" ? "pessoa" : "pessoas"}`,
    transporte: { lead: "quero transporte", agencia: "com transporte" },
    faixaMais: (v) => `${v}+`,
    indeciso: "dias a definir",
  },
  en: {
    atrativos: (n) => `${n} ${n === 1 ? "attraction" : "attractions"}`,
    experiencias: (n) => `${n} ${n === 1 ? "experience" : "experiences"}`,
    dias: (v) => `${v} days`,
    inicio: (d) => `starting ${d}`,
    pessoas: (v) => `${v} ${v === "1" ? "person" : "people"}`,
    transporte: { lead: "I want transport", agencia: "with transport" },
    faixaMais: (v) => `${v}+`,
    indeciso: "days to be defined",
  },
  es: {
    atrativos: (n) => `${n} ${n === 1 ? "atractivo" : "atractivos"}`,
    experiencias: (n) => `${n} ${n === 1 ? "experiencia" : "experiencias"}`,
    dias: (v) => `${v} días`,
    inicio: (d) => `inicio ${d}`,
    pessoas: (v) => `${v} ${v === "1" ? "persona" : "personas"}`,
    transporte: { lead: "quiero transporte", agencia: "con transporte" },
    faixaMais: (v) => `${v}+`,
    indeciso: "días a definir",
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
 * Uma linha com o essencial do pedido: `3 atrativos · 29/08/2026 · 3 pessoas · quero transporte`.
 * Campo ausente simplesmente não entra — nada de placeholder (mesma regra do card, G2).
 */
export function resumoCurto(input: ResumoInput, locale: Locale, voz: VozResumo): string {
  const t = T[locale];
  const partes: string[] = [];

  if (input.itemCount > 0) {
    // ⚠️ Produto único (atrativo): todo pedido usa o vocabulário de atrativos/ingressos.
    partes.push(t.atrativos(input.itemCount));
  }
  const data = formatDate(input.visitDate);
  if (data) partes.push(data);
  if (input.pessoas != null && input.pessoas !== "" && input.pessoas !== "undecided") {
    const v = String(input.pessoas);
    partes.push(t.pessoas(v.endsWith("+") ? t.faixaMais(v.slice(0, -1)) : v));
  }
  if (input.wantsTransport === true) partes.push(t.transporte[voz]);

  return partes.join(" · ");
}


/**
 * Monta a mensagem final do wa.me: introdução → resumo. Blocos separados por linha em branco,
 * que é como o WhatsApp respira.
 * ⚠️ Parâmetros de produto/locale/voz mantidos na assinatura por compatibilidade de chamadores;
 * a mensagem agora é genérica (o link /r/[token] foi removido).
 */
export function buildWaMessage(
  intro: string,
  resumo: string,
  _token: string | null | undefined,
  _kind: ProductCopyKind,
  _locale: Locale,
  _voz: VozResumo,
  _opts?: { itens?: ItensKind },
): string {
  return [intro, resumo || null].filter(Boolean).join("\n\n");
}
