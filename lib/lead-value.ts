// Filepath: lib/lead-value.ts
// Version: 1.2
// Nome da Versão: "Documenta o que `value` significa no modelo de receita do satélite (D12)"
// Baseado na Versão: 1.1
//
// Módulo PURO (sem DB, sem React, sem `window`) — roda no client (TicketOfferModal, alimenta o Pixel)
// E no server (app/api/leads/route.ts → lib/meta-capi.ts, alimenta o CAPI). É a fonte ÚNICA do payload
// do evento `Lead`: as duas pontas chamam `buildLeadEventParams` com os MESMOS sinais e produzem o
// MESMO resultado — isso é o que garante que Pixel e CAPI nunca divirjam no `value` do mesmo `event_id`
// (o Meta deduplica por event_id e fica só com uma das duas versões; se divergissem, o valor seria
// não-determinístico). Ver _docs-dev-coder/plan.md (guardrail G1) e conventions/tracking-metricas.md §6.
//
// ⚠️ O QUE `value` SIGNIFICA AQUI (leia antes de mexer em peso — ver D12 em pixel-decisions.md):
// É PONTUAÇÃO DE QUALIDADE, não dinheiro. Estima quanto o lead vale para a AGÊNCIA que o recebe,
// NÃO o que este site fatura com ele. O `BRL` no `currency` é exigência de formato do Meta.
//
// Motivo (instância deste satélite — o PRINCÍPIO do D12 é o mesmo nos três): o Compras Paraguay não ganha
// comissão por ingresso nem por roteiro. Cobra das entidades parceiras um PLANO MENSAL manual pelo
// direito de estar visível e receber os leads (`lib/plan-periods.ts`, conventions §13-ter). A receita
// é a mesma se a agência fechar 10 ou 200 roteiros. Disso decorre:
//   • ROAS é estruturalmente sem sentido — não há receita atribuível a um lead. Não configurar meta
//     de retorno; a métrica que importa é CUSTO POR LEAD QUALIFICADO.
//   • O multiplicador NÃO TEM (nem precisa de) âncora financeira. O que carrega informação é a RAZÃO
//     entre os valores — um lead de 150 vale 10× um de 15, e é só isso que a otimização por valor lê.
//   • A cadeia é indireta: lead bom → agência satisfeita → agência renova o plano → receita. Otimizar
//     para "lead que a agência gosta de receber" É otimizar a receita, com um elo no meio.
//
// ⚠️ SÓ este parágrafo de contexto é local. `LEAD_VALUE_WEIGHTS`, `LEAD_VALUE_MULTIPLIER_BRL` e
// `LEAD_VALUE_VERSION` são CONTRATO DE PORTFÓLIO (matriz §5): existe UMA distribuição de valor dentro
// do pixel, e ela não varia por projeto. Mexer neles é re-baseline nos repos plugados, não cleanup.
//
// 🚫 NÃO trocar isto por preço real de ingresso (R$ 69,90 × qtd, somando atrativos na experiência):
// o site não fatura esse dinheiro, `Lead` não é venda, e colidiria com o `Purchase` (D2), que é o
// evento reservado à receita real. Não existe preço no repositório — é decisão de produto.
//
// 🚫 NÃO embutir taxa de fechamento nos pesos. O modelo é imune a ela de propósito: a ordenação
// entre leads continua correta mesmo que 100% fechem. (E não há como medi-la: `leads.claimed_by`
// registra quem ASSUMIU o lead no Telegram, nunca se a venda aconteceu.)
//
// ⚠️ A TABELA DE PESOS (LEAD_VALUE_WEIGHTS) É CONTRATO COM O ADS, igual aos nomes de evento (§11).
// Otimização por valor no Meta aprende uma distribuição a partir do histórico de `value` recebido.
// Mudar peso re-escala esse histórico e quebra a relação valor↔lance já aprendida, além de invalidar
// qualquer meta de ROAS configurada na campanha. Alterar peso = re-baseline CONSCIENTE: bump o
// LEAD_VALUE_VERSION e avise quem roda campanha. NÃO é um append inofensivo.

export type LeadKind = "ticket" | "experience" | "decide";
export type JourneyStage = "planning" | "traveling" | "local";

/** Bump obrigatório sempre que LEAD_VALUE_WEIGHTS ou LEAD_VALUE_MULTIPLIER_BRL mudar (re-baseline). */
export const LEAD_VALUE_VERSION = "2026-07-v1";

/** value = pontos × multiplicador. Ver plan.md seção B para a justificativa do multiplicador. */
export const LEAD_VALUE_MULTIPLIER_BRL = 15;
export const LEAD_VALUE_CURRENCY = "BRL";

/** Pontos mínimos de qualquer lead (nunca 0 — o Meta descarta value:0 da otimização por valor). */
const LEAD_VALUE_FLOOR_POINTS = 1;

/** Pontos fixos para morador de Foz (journey_stage="local"), ignorando qualquer bônus (ver seção B). */
const LOCAL_FLOOR_POINTS = 1;

export const LEAD_VALUE_WEIGHTS = {
  base: {
    ticket: 1,
    experience: 2,
    decide: 2,
  } as Record<LeadKind, number>,
  transfer: 4,
  journeyStage: {
    planning: 2,
    traveling: 1,
  } as Partial<Record<Exclude<JourneyStage, "local">, number>>,
  // Faixas por quantidade de ingresso — proxy de grupo/família (não coletamos composição de grupo).
  ticketQty: {
    mid: { min: 3, max: 5, points: 2 },
    high: { min: 6, points: 3 },
  },
} as const;

/**
 * Deriva o estágio da jornada a partir dos 2 booleanos já coletados no modal (qualificação).
 * Enum FECHADO — nunca retorna string livre. `undefined` = desconhecido → o parâmetro deve ser
 * OMITIDO do payload (nunca mandar "unknown"; ver guardrail G6).
 */
export function resolveJourneyStage(
  isLocal: boolean | null | undefined,
  alreadyInFoz: boolean | null | undefined
): JourneyStage | undefined {
  if (isLocal === true) return "local";
  if (alreadyInFoz === true) return "traveling";
  if (alreadyInFoz === false) return "planning";
  return undefined;
}

export interface LeadValueSignals {
  leadKind: LeadKind;
  journeyStage?: JourneyStage;
  transfer: boolean;
  ticketQty?: number | null;
}

/** Pontos brutos (pré-multiplicador), só para os 3 cenários de verificação manual do Sprint 4. */
function computeLeadPoints(signals: LeadValueSignals): number {
  if (signals.journeyStage === "local") return LOCAL_FLOOR_POINTS;

  let points = LEAD_VALUE_WEIGHTS.base[signals.leadKind];

  if (signals.transfer) points += LEAD_VALUE_WEIGHTS.transfer;

  if (signals.journeyStage === "planning" || signals.journeyStage === "traveling") {
    points += LEAD_VALUE_WEIGHTS.journeyStage[signals.journeyStage] ?? 0;
  }

  const qty = signals.ticketQty ?? 0;
  const { mid, high } = LEAD_VALUE_WEIGHTS.ticketQty;
  if (qty >= high.min) points += high.points;
  else if (qty >= mid.min && qty <= mid.max) points += mid.points;

  return Math.max(points, LEAD_VALUE_FLOOR_POINTS);
}

/** Valor final em BRL (pontos × multiplicador), pronto para o campo `value` do evento `Lead`. */
export function computeLeadValue(signals: LeadValueSignals): number {
  return computeLeadPoints(signals) * LEAD_VALUE_MULTIPLIER_BRL;
}

export interface LeadEventContext {
  leadKind: LeadKind;
  itemSlug?: string | null;
  experienceSlug?: string | null;
  isLocal?: boolean | null;
  alreadyInFoz?: boolean | null;
  wantsTransport: boolean;
  locale?: string | null;
  /** Só relevante no fluxo de ingresso avulso — omitido nos demais. */
  ticketQty?: number | null;
}

/**
 * Monta o objeto de parâmetros do evento `Lead` — fonte ÚNICA consumida pelo Pixel (client,
 * TicketOfferModal) e pelo CAPI (server, lib/meta-capi.ts via app/api/leads/route.ts). Omite
 * qualquer dimensão desconhecida em vez de preencher com placeholder (guardrail G6): parâmetro
 * ausente não atrapalha regra de Conversão Personalizada; "unknown" em volume dilui qualquer regra.
 *
 * NUNCA inclui PII (nome/e-mail/WhatsApp) — isso seguiria só hasheado em user_data do CAPI (§11/§18),
 * fora deste módulo.
 */
export function buildLeadEventParams(ctx: LeadEventContext): Record<string, unknown> {
  const journeyStage = resolveJourneyStage(ctx.isLocal, ctx.alreadyInFoz);

  // 🚫 Não voltar a incluir `content_name: "VIP_Roda_Gigante"` (removido jul/2026): era IGUAL em
  // todo lead, então não discriminava nada — e ainda amarrava o produto de UM satélite dentro de um
  // pixel que atende três (D9). Quem identifica o produto é `item_slug`/`experience_slug`; quem
  // identifica o site é `property`, injetado no funil (lib/analytics + lib/meta-capi).
  const params: Record<string, unknown> = {
    lead_kind: ctx.leadKind,
  };

  if (ctx.itemSlug) params.item_slug = ctx.itemSlug;
  if (ctx.experienceSlug) params.experience_slug = ctx.experienceSlug;
  if (journeyStage) params.journey_stage = journeyStage;
  params.transfer = ctx.wantsTransport;
  if (ctx.locale) params.locale = ctx.locale;
  if (ctx.ticketQty != null) params.ticket_qty = ctx.ticketQty;

  params.value = computeLeadValue({
    leadKind: ctx.leadKind,
    journeyStage,
    transfer: ctx.wantsTransport,
    ticketQty: ctx.ticketQty,
  });
  params.currency = LEAD_VALUE_CURRENCY;

  return params;
}
