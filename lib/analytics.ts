// Filepath: lib/analytics.ts
// Version: 1.2
// Nome da Versão: "dataLayer zera a taxonomia a cada push (o modelo do GTM acumula, e o valor velho vazava)"
// Baseado na Versão: 1.1

import { fbqTrack } from "./fbq";
import { TRACKING_PROPERTY } from "./tracking-taxonomy";

export interface ConversionDef {
  /** Nome do evento no Meta Pixel (padrão ou custom). */
  meta: string;
  /** Nome do evento no dataLayer (consumido pelo GTM → GA4). */
  ga: string;
  /** 'track' p/ eventos padrão do Meta; 'trackCustom' p/ personalizados. */
  metaType: "track" | "trackCustom";
}

/**
 * Catálogo central de eventos de conversão. Cada evento é definido UMA vez
 * (nome Meta + nome GA4) e disparado para os dois canais via trackConversion.
 * Nomes GA4 seguem o padrão recomendado (generate_lead, begin_checkout) →
 * viram conversão no GA4 sem configuração extra.
 *
 * A escada (ViewContent → InitiateCheckout → Lead / Contact) é o contrato de PORTFÓLIO —
 * `_docs-portfolio/pixel-matrix.md` §4, executado em `lib/tracking-taxonomy.PORTFOLIO_EVENTS`.
 * Só o `CTAClick` é custom, e de propósito: é telemetria de UI, não degrau do funil.
 *
 * 🚫 `ViewModalVIP` foi REMOVIDO (D10) e não deve voltar, nem com outro nome: evento custom não é
 * first-class no painel do Meta, e era vocabulário de um satélite dentro de um pixel que atende
 * vários (D9). Quem marca o início do fluxo agora é o `InitiateCheckout` na abertura do modal.
 * Nada se perdeu: o que ele distinguia volta como param (`vertical`, `item_slug`, `cta_type`).
 */
export const CONVERSIONS = {
  viewContent:      { meta: "ViewContent",      ga: "view_item",      metaType: "track" },
  lead:             { meta: "Lead",             ga: "generate_lead",  metaType: "track" },
  initiateCheckout: { meta: "InitiateCheckout", ga: "begin_checkout", metaType: "track" },
  contact:          { meta: "Contact",          ga: "contact",        metaType: "track" },
  ctaClick:         { meta: "CTAClick",         ga: "cta_click",      metaType: "trackCustom" },
} as const satisfies Record<string, ConversionDef>;

/**
 * Chaves que UM evento manda e outro não — existem para serem ZERADAS, ver `pushDataLayer`.
 *
 * ⚠️ Manter em sincronia com o que os pontos de disparo mandam: `taxonomyParams`
 * (vertical/niche/item_slug/partner_slug/content_ids), `buildLeadEventParams`
 * (lead_kind/experience_slug/journey_stage/transfer/locale/ticket_qty/value/currency), os extras de
 * UI dos chamadores (cta_type/destination) e o `event_id` do dedupe. Chave nova num evento entra
 * AQUI também, senão ela é a próxima a ficar velha.
 *
 * `property` fica de FORA de propósito: `trackConversion` o injeta em todo evento, então ele nunca
 * chega a ser um valor residual.
 */
const DATALAYER_RESET_KEYS = [
  "vertical",
  "niche",
  "item_slug",
  "partner_slug",
  "content_ids",
  "lead_kind",
  "experience_slug",
  "journey_stage",
  "transfer",
  "locale",
  "ticket_qty",
  "value",
  "currency",
  "cta_type",
  "destination",
  "event_id",
] as const;

/**
 * Push seguro no dataLayer do GTM (no-op no servidor).
 *
 * ⚠️ **O dataLayer não é uma fila de eventos independentes — é um modelo que ACUMULA.** Cada `push`
 * FUNDE com o estado anterior em vez de substituí-lo, então mandar só as chaves do evento atual
 * deixa as do evento anterior vivas, e a variável do GTM devolve o valor velho sem erro nenhum.
 * Caso concreto: o `begin_checkout` de um atrativo grava `item_slug`; o `cta_click` seguinte, num
 * parceiro de gastronomia, sairia carimbado com aquele atrativo.
 *
 * Por isso toda chave da taxonomia que NÃO veio neste evento vai como `null`: o GTM sobrescreve o
 * valor antigo, a variável resolve vazia e o GA4 omite o parâmetro. É a regra de omissão do lado
 * Meta (D8) — só que no caminho Google ela precisa ser feita à mão, porque lá cada `fbq('track')`
 * carrega o próprio objeto e não existe estado compartilhado.
 *
 * 🚫 Isto NÃO exige bump de `TAXONOMY_VERSION`: nenhum nome de parâmetro, valor de enum ou evento
 * mudou. É correção de transporte, não de contrato.
 */
export function pushDataLayer(event: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  const limpeza: Record<string, unknown> = {};
  for (const k of DATALAYER_RESET_KEYS) {
    if (!params || !(k in params)) limpeza[k] = null;
  }
  window.dataLayer.push({ event, ...limpeza, ...params });
}

/**
 * Dispara um evento de conversão para Meta (Pixel) E Google (dataLayer→GTM→GA4)
 * de uma vez. Mantém os dois pixels sempre em sincronia (evento definido num só
 * lugar). `eventID` casa o Pixel com o CAPI (dedupe) e também vai ao dataLayer.
 *
 * `property` é injetado AQUI, no funil, e não nos pontos de chamada
 * (`_docs-portfolio/pixel-matrix.md` §8): o pixel é compartilhado pelos satélites do portfólio,
 * então todo evento — presente e FUTURO — precisa sair identificado, sem depender de alguém lembrar
 * de passar o param. Vem DEPOIS do spread de `params` de propósito: se um chamador mandar
 * `property`, a taxonomia do repo é que vence, não a string dele (G8).
 */
export function trackConversion(
  conv: ConversionDef,
  params?: Record<string, unknown>,
  opts?: { eventID?: string }
): void {
  const withProperty = { ...params, property: TRACKING_PROPERTY };
  fbqTrack(conv.meta, withProperty, conv.metaType, opts?.eventID ? { eventID: opts.eventID } : undefined);
  pushDataLayer(conv.ga, {
    ...withProperty,
    ...(opts?.eventID ? { event_id: opts.eventID } : {}),
  });
}
