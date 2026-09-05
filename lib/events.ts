// Filepath: lib/events.ts
// Version: 1.1
// Nome da Versão: "+ evento 'impression' (viu o card/seção do parceiro)"
// Baseado na Versão: 1.0

import { getSql } from "./db";

// 'impression' = viu o card/seção de um parceiro (deduplicado por sessão no client → 1 linha por parceiro por visita).
export const EVENT_TYPES = ["pageview", "cta_click", "impression"] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export interface TrackPayload {
  type: EventType;
  path?: string | null;
  /** Tipo/posição do CTA: hero, navbar, partner_card, partner_cta, whatsapp, website, instagram... */
  ctaType?: string | null;
  /** Slug do item: parceiro ou atrativo. */
  itemSlug?: string | null;
  destination?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  utmTerm?: string | null;
  referrer?: string | null;
  userAgent?: string | null;
  country?: string | null;
  city?: string | null;
  visitorId?: string | null;
  sessionId?: string | null;
}

/**
 * Persiste um evento no Neon. Retorna `false` (no-op) se o banco não estiver
 * configurado — nunca lança por falta de DATABASE_URL.
 */
export async function recordEvent(p: TrackPayload): Promise<boolean> {
  const sql = getSql();
  if (!sql) return false;

  await sql`
    insert into events (
      type, path, cta_type, item_slug, destination,
      utm_source, utm_medium, utm_campaign, utm_content, utm_term,
      referrer, user_agent, country, city, visitor_id, session_id
    ) values (
      ${p.type}, ${p.path ?? null}, ${p.ctaType ?? null}, ${p.itemSlug ?? null}, ${p.destination ?? null},
      ${p.utmSource ?? null}, ${p.utmMedium ?? null}, ${p.utmCampaign ?? null}, ${p.utmContent ?? null}, ${p.utmTerm ?? null},
      ${p.referrer ?? null}, ${p.userAgent ?? null}, ${p.country ?? null}, ${p.city ?? null}, ${p.visitorId ?? null}, ${p.sessionId ?? null}
    )
  `;
  return true;
}

/**
 * Persiste VÁRIOS eventos em UMA query (`unnest`) — usado pelo batching client-side de `/api/track`
 * (jul/2026): antes, cada pageview/clique virava 1 INSERT isolado, acordando o
 * compute do Neon a cada evento; agora o navegador acumula e manda em lote (~20s ou até 20 eventos), então N
 * eventos custam 1 round-trip ao banco em vez de N. Cap de tamanho já aplicado pela rota antes de chamar
 * isso — nunca lança por falta de DATABASE_URL.
 */
export async function recordEvents(events: TrackPayload[]): Promise<number> {
  const sql = getSql();
  if (!sql || events.length === 0) return 0;

  await sql`
    insert into events (
      type, path, cta_type, item_slug, destination,
      utm_source, utm_medium, utm_campaign, utm_content, utm_term,
      referrer, user_agent, country, city, visitor_id, session_id
    )
    select * from unnest(
      ${events.map((e) => e.type)}::text[],
      ${events.map((e) => e.path ?? null)}::text[],
      ${events.map((e) => e.ctaType ?? null)}::text[],
      ${events.map((e) => e.itemSlug ?? null)}::text[],
      ${events.map((e) => e.destination ?? null)}::text[],
      ${events.map((e) => e.utmSource ?? null)}::text[],
      ${events.map((e) => e.utmMedium ?? null)}::text[],
      ${events.map((e) => e.utmCampaign ?? null)}::text[],
      ${events.map((e) => e.utmContent ?? null)}::text[],
      ${events.map((e) => e.utmTerm ?? null)}::text[],
      ${events.map((e) => e.referrer ?? null)}::text[],
      ${events.map((e) => e.userAgent ?? null)}::text[],
      ${events.map((e) => e.country ?? null)}::text[],
      ${events.map((e) => e.city ?? null)}::text[],
      ${events.map((e) => e.visitorId ?? null)}::text[],
      ${events.map((e) => e.sessionId ?? null)}::text[]
    )
  `;
  return events.length;
}
