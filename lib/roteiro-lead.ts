// Filepath: lib/roteiro-lead.ts
// Version: 2.3
// Nome da Versão: "+ resolveLeadKind — ponte LeadContext → LeadKind do portfólio, única para as 2 pontas"
// Baseado na Versão: 2.2
//
// Client-safe (sem DB). Usado pelo modal e pelo server (Telegram, /api/leads).

import type { Locale } from "@/lib/i18n/config";
import type { ProductCopies, ProductLeadCopy } from "@/lib/offer-defaults";
import { DEFAULT_PRODUCT_COPIES } from "@/lib/offer-defaults";
import type { LeadKind } from "@/lib/lead-value";

/**
 * Contexto de abertura do modal de captura.
 * - ingresso: fluxo legado (oferta/agência no modal)
 * - roteiro: orçamento de roteiro pronto ou personalização desse roteiro
 * - atrativo: compra de ingresso do atrativo → agência
 */
export type LeadContext = "ingresso" | "roteiro" | "atrativo";

/** Intenção legada no open (CTA unificado usa só orcamento; preferência vem do form). */
export type LeadIntent = "orcamento" | "personalizar";

/** Payload no CustomEvent `ticket-offer:open`. */
export interface TicketOfferOpenDetail {
  href: string;
  ctaType: string;
  itemSlug?: string;
  /** Default: inferido de ctaType. */
  context?: LeadContext;
  /** orcamento (default) | personalizar — copy e Telegram. */
  intent?: LeadIntent;
  /** Título do roteiro (Telegram + card do modal). */
  roteiroTitulo?: string;
  /** Slug estável do roteiro (ex.: 3-dias-classico). */
  roteiroSlug?: string;
  /** Resumo multi-linha (Telegram) — personalização / notas. */
  roteiroResumo?: string;
  /**
   * `content_ids` do pixel: os slugs de atrativo que o bundle inclui (matriz §1.3 / D7). No Roteiro
   * Foz o produto **é** o bundle, então este param não é opcional quando há roteiro em jogo.
   *
   * Vem por prop em vez de o modal derivar do `roteiroSlug` por dois motivos: (1) o modal é montado
   * em toda página e não deve arrastar o catálogo de roteiros para o bundle do client; (2) o
   * catálogo de DIAS AVULSOS monta um roteiro sintético (`por-dias-N`) que não existe em
   * `app/data/roteiros.ts` — não haveria de onde derivar.
   */
  contentIds?: string[];
  /**
   * Card do topo do modal com o item em contexto, quando presente.
   * Roteiro: cover + título. Atrativo: cover + nome.
   */
  subjectTitle?: string;
  subjectImage?: string | null;
  subjectSubtitle?: string | null;
  /**
   * Nome + tagline do item NOS TRÊS IDIOMAS (`attractionSubjectI18n`, lib/i18n/attractions.ts).
   *
   * ⚠️⚠️ Existe porque o modal tem seletor de idioma PRÓPRIO e este `detail` é um SNAPSHOT do clique:
   * com só `subjectTitle`/`subjectSubtitle`, trocar o idioma lá dentro deixava o card do assunto no
   * idioma da página. O modal não resolve sozinho — o dicionário de atrativos tem ~230 KB e ele é
   * montado em TODA página; quem já o tem no bundle (card e página de atrativo) manda as três versões.
   * Ausente → o modal cai nos campos de snapshot acima.
   */
  subjectI18n?: Record<Locale, { title: string; subtitle: string }>;
}

export function isRoteiroLeadContext(
  detail: Pick<TicketOfferOpenDetail, "context" | "ctaType"> | null | undefined,
): boolean {
  if (!detail) return false;
  if (detail.context === "roteiro") return true;
  if (detail.context === "ingresso" || detail.context === "atrativo") return false;
  const t = detail.ctaType ?? "";
  return (
    t === "roteiro_cta" ||
    t === "roteiro_personalizar" ||
    t.startsWith("roteiro_")
  );
}

export function isAtrativoLeadContext(
  detail: Pick<TicketOfferOpenDetail, "context" | "ctaType"> | null | undefined,
): boolean {
  if (!detail) return false;
  if (detail.context === "atrativo") return true;
  const t = detail.ctaType ?? "";
  return t === "atrativo" || t.startsWith("atrativo_");
}

export function isPersonalizarIntent(
  detail: Pick<TicketOfferOpenDetail, "intent" | "ctaType"> | null | undefined,
): boolean {
  if (!detail) return false;
  if (detail.intent === "personalizar") return true;
  const t = detail.ctaType ?? "";
  return t === "roteiro_personalizar" || t.includes("personalizar");
}

/**
 * `LeadContext` do RF → `LeadKind` do contrato de portfólio (`lib/lead-value.ts`).
 *
 * ⚠️⚠️ **Fonte ÚNICA, chamada pelas DUAS pontas** — client (`TicketOfferModal`, wizard) e server
 * (`app/api/leads/route.ts` → CAPI). É isto que garante o G1: `lead_kind` entra no cálculo do
 * `value`, e se as duas pontas derivassem o kind por caminhos próprios, o mesmo `event_id` sairia
 * com dois valores e o Meta ficaria com um dos dois, de forma não-determinística.
 *
 * A entrada é só o `leadContext` de propósito: é o único sinal que as duas pontas têm **idêntico**
 * (o client o calcula e o posta; o server lê o que foi postado). Derivar de `ctaType`/`intent` no
 * client e de outra coisa no server é exatamente como a divergência volta.
 *
 * O mapa:
 * - `roteiro` (pronto, dias avulsos ou montado no wizard) → **`experience`**: é bundle, vários
 *   atrativos num pedido só.
 * - `atrativo` / `ingresso` → **`ticket`**: item único.
 * - `decide` existe no enum do portfólio mas **nenhum fluxo do RF o produz** — lá ele significa
 *   "lead sem item escolhido", caminho que este satélite não tem. Contrato existir não obriga a
 *   preencher (matriz §2).
 *
 * ℹ️ Na tabela de pesos, `experience` vale 2 pontos-base e `ticket` 1. O que move mais o `value` são
 * `transfer` (+4), `journey_stage` (+2/+1) e `ticket_qty` (+2/+3).
 */
export function resolveLeadKind(context?: LeadContext | string | null): LeadKind {
  return context === "roteiro" ? "experience" : "ticket";
}

/**
 * Faixa de PESSOAS do wizard (`1-2` · `3+` · `undecided`) → `ticket_qty` do contrato de portfólio.
 *
 * **Por que pessoas viram ingressos:** são a mesma quantidade — 5 pessoas no roteiro são 5 ingressos
 * em cada atrativo. "Pessoas" é só o rótulo que o visitante lê; o peso de `ticketQty` na tabela de
 * `value` existe justamente como proxy de grupo/família.
 *
 * ⚠️⚠️ **Regra: sempre o PISO da faixa, nunca o topo.** O wizard coleta faixa, não número exato, então
 * qualquer valor dentro dela é estimativa. Escolher o piso garante que o `value` nunca seja INFLADO —
 * um `3+` que na verdade é 3 entra na faixa média (+2 pontos) em vez de fingir ser um grupo grande
 * (+3). Superestimar aqui envenena a distribuição que a otimização por valor aprende, e o erro só
 * aparece semanas depois como campanha ruim. Subestimar apenas deixa pontos na mesa.
 *
 * ⚠️ Fonte ÚNICA para as duas pontas (G1), como `resolveLeadKind`: o client passa isto a
 * `buildLeadEventParams` e o server recalcula a partir do MESMO `roteiroPessoas` que foi postado.
 *
 * `undecided`/ausente → `null` → o param é OMITIDO (D8), nunca vira 0 ou "unknown".
 */
export function ticketQtyFromPessoas(pessoas?: string | null): number | null {
  if (pessoas === "1-2") return 1;
  if (pessoas === "3+") return 3;
  return null;
}

// ⛔ Aqui existia `formatRoteiroLeadTag` — a tag em caixa alta do título do card do Telegram
// (`[NOVO LEAD: ROTEIRO 3 DIAS — CLÁSSICO]`). REMOVIDA com seu único consumidor (`roteiroTagOf`,
// lib/lead-card.ts): o título do card virou fixo, porque o produto já aparece na linha do assunto —
// ver `conventions/telegram.md` §12.

export type LeadModalCopy = ProductLeadCopy;

// ⚠️ Re-exporta apenas o bucket atrativo (produto único). Os buckets roteiro/personalizar foram
// removidos na simplificação Compras PY.

/**
 * Resolve copy do modal por produto.
 * `productCopies` vem do OfferConfig (admin); se ausente, usa DEFAULT_PRODUCT_COPIES.
 *
 * Produto único (atrativo/roteiro de compras): sempre o bucket `atrativo`.
 */
export function resolveLeadModalCopy(
  locale: Locale,
  detail: TicketOfferOpenDetail | null,
  productCopies?: ProductCopies | null,
): LeadModalCopy | null {
  if (!detail) return null;
  const pc = productCopies ?? DEFAULT_PRODUCT_COPIES;
  return pc.atrativo[locale] ?? DEFAULT_PRODUCT_COPIES.atrativo[locale];
}
