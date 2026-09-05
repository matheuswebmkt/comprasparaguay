// Filepath: lib/attraction-offers.ts
// Version: 1.0
// Nome da Versão: "Ingresso por atrativo — Modo (Direto/Agência) + Tem link + URL, por atrativo"
//
// A tela de sucesso do modal de captura, quando o lead vem de uma página de atrativo
// (context="atrativo"), precisa saber POR ATRATIVO: se mostra o link oficial de compra
// desse atrativo específico, se cai no modo de sucesso global (ver lib/offer-settings.ts
// §Parte 1), ou se esse atrativo nem tem link (sem ingresso — ex.: Compras Paraguai,
// Feirinha). Modelo: tabela `attraction_offer_settings(attraction_slug → {has_link, mode,
// official_url})`. SEM campos sensíveis (roteamento de lead continua 100% global, seção
// Agência), então o shape é o MESMO no admin e no client (sem split admin/público).

import { getSql } from "./db";
import { attractions } from "@/app/data/attractions";
import type { AttractionOfferMode, AttractionOfferSetting, AttractionOfferPublic } from "./offer-defaults";

type Sql = NonNullable<ReturnType<typeof getSql>>;

const asStr = (v: unknown): string | null => {
  const t = typeof v === "string" ? v.trim() : "";
  return t.length ? t : null;
};

async function ensure(sql: Sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS attraction_offer_settings (
      attraction_slug TEXT        PRIMARY KEY,
      has_link        BOOLEAN     NOT NULL DEFAULT true,
      mode            TEXT        NOT NULL DEFAULT 'direct',
      official_url    TEXT,
      no_link_mode    TEXT        NOT NULL DEFAULT 'close',
      updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE attraction_offer_settings ADD COLUMN IF NOT EXISTS no_link_mode TEXT NOT NULL DEFAULT 'close'`;
}

type Row = {
  attraction_slug: string;
  has_link: boolean;
  mode: string;
  official_url: string | null;
  no_link_mode: string;
};

const toSetting = (r: Row): AttractionOfferSetting => ({
  slug: r.attraction_slug,
  hasLink: r.has_link !== false,
  mode: r.mode === "agency" ? "agency" : "direct",
  officialUrl: asStr(r.official_url),
  noLinkMode: r.no_link_mode === "whatsapp" ? "whatsapp" : "close",
});

/**
 * Linhas SALVAS (real-time, não cacheado) — para o ADMIN montar a lista (mescla com o
 * catálogo `attractions`). Sem DB → `[]`.
 */
export async function getAttractionOfferSettings(): Promise<AttractionOfferSetting[]> {
  const sql = getSql();
  if (!sql) return [];
  try {
    await ensure(sql);
    const rows = (await sql.query(
      `SELECT attraction_slug, has_link, mode, official_url, no_link_mode FROM attraction_offer_settings ORDER BY attraction_slug`,
    )) as Row[];
    return rows.map(toSetting);
  } catch {
    return [];
  }
}

/**
 * Projeção COMPLETA para TODOS os atrativos do catálogo (não só os salvos) — entra no
 * `OfferConfig` assado (`lib/offer-settings.ts`). Atrativo sem linha salva usa o default:
 * `hasLink: true`, `mode: "direct"`, `officialUrl` do próprio catálogo estático
 * (`attractions.ts` — campo que hoje só alimenta `sameAs` do schema.org). `name` vem SEMPRE
 * do catálogo (não é salvo em DB) — alimenta o seletor "Incluir ingresso de outros
 * atrativos?" no modal sem precisar importar o arquivo pesado de conteúdo no client. Sem
 * DB → cada atrativo cai no mesmo default (link do catálogo, modo Direto).
 */
export async function getAttractionOffersPublic(): Promise<Record<string, AttractionOfferPublic>> {
  const settings = await getAttractionOfferSettings();
  const bySlug = new Map(settings.map((s) => [s.slug, s]));
  const out: Record<string, AttractionOfferPublic> = {};
  for (const a of attractions) {
    const saved = bySlug.get(a.slug);
    out[a.slug] = {
      slug: a.slug,
      name: a.name,
      hasLink: saved?.hasLink ?? true,
      mode: saved?.mode ?? "direct",
      officialUrl: saved?.officialUrl ?? (a.officialUrl || null),
      noLinkMode: saved?.noLinkMode ?? "close",
    };
  }
  return out;
}

/** Payload de save de UM atrativo (admin). Todos os campos opcionais menos o slug. */
export interface AttractionOfferInput {
  slug: string;
  hasLink?: boolean;
  mode?: AttractionOfferMode;
  officialUrl?: string | null;
  noLinkMode?: "close" | "whatsapp";
}

const clip = (v: string | null | undefined, n: number): string | null => {
  const t = (v ?? "").trim();
  return t.length ? t.slice(0, n) : null;
};

/**
 * Upsert em massa (admin). Só aceita slugs de atrativos existentes no catálogo (ignora os
 * demais). Lança sem DB.
 */
export async function saveAttractionOffers(inputs: AttractionOfferInput[]): Promise<void> {
  const sql = getSql();
  if (!sql) throw new Error("DB not configured");
  await ensure(sql);
  const validSlugs = new Set(attractions.map((a) => a.slug));
  const ops: Promise<unknown>[] = [];
  for (const i of inputs) {
    if (!validSlugs.has(i.slug)) continue;
    ops.push(sql`
      INSERT INTO attraction_offer_settings (attraction_slug, has_link, mode, official_url, no_link_mode, updated_at)
      VALUES (
        ${i.slug}, ${i.hasLink ?? true}, ${i.mode === "agency" ? "agency" : "direct"}, ${clip(i.officialUrl, 500)},
        ${i.noLinkMode === "whatsapp" ? "whatsapp" : "close"}, NOW()
      )
      ON CONFLICT (attraction_slug) DO UPDATE SET
        has_link     = EXCLUDED.has_link,
        mode         = EXCLUDED.mode,
        official_url = EXCLUDED.official_url,
        no_link_mode = EXCLUDED.no_link_mode,
        updated_at   = NOW()
    `);
  }
  await Promise.all(ops);
}
