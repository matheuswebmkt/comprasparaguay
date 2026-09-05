// Filepath: lib/niche-settings.ts
// Version: 1.0
// Nome da Versão: "Atribuição DINÂMICA nicho↔parceiro (admin, sem deploy) — espelha lib/partner-settings.ts"
//
// A "Recomendação Oficial" de cada página de nicho passa a ser gerenciável no admin, sem editar código.
// Modelo: tabela `niche_settings(niche_key → partner_slug|null)`. Fonte de verdade quando há DB; SEED
// idempotente a partir do estático `Partner.niches` (a primeira migração preserva a atribuição atual).
//   • linha com partner_slug   → esse parceiro é o exclusivo do nicho (o pitch).
//   • linha com partner_slug NULL → Empty State forçado (o dono "limpou" a recomendação).
//   • SEM DB                    → fallback ESTÁTICO (Partner.niches) → build/SSG seguem funcionando.
// ⚠️ Separation of Concerns intacto: isto muda APENAS o slot (`NicheRecommendation`); a copy/SEO do nicho
//    (app/data/niches.ts) nunca é tocada. Ao salvar, `revalidateTag(NICHE_SETTINGS_TAG)` regenera as páginas.

import { unstable_cache } from "next/cache";
import { getSql } from "./db";
import { activePartners, getPartnerForNiche } from "@/app/data/partners";
import { niches } from "@/app/data/niches";
import { getActivePlanSlugs, getActivePlanSlugsCached } from "./plan-periods";

/** Tag de revalidação da atribuição de nichos (invalidada ao salvar no admin). */
export const NICHE_SETTINGS_TAG = "niche-settings";

type Sql = NonNullable<ReturnType<typeof getSql>>;

async function ensure(sql: Sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS niche_settings (
      niche_key    TEXT        PRIMARY KEY,
      partner_slug TEXT,
      updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  // Seed idempotente a partir do estático `Partner.niches` (só cria linha se ainda não existir) —
  // preserva a atribuição atual (ex: bar-e-cervejaria → patanegra-cervejaria) na 1ª migração.
  for (const p of activePartners) {
    for (const key of p.niches ?? []) {
      await sql`
        INSERT INTO niche_settings (niche_key, partner_slug)
        VALUES (${key}, ${p.slug})
        ON CONFLICT (niche_key) DO NOTHING
      `;
    }
  }
}

/** Fallback estático (sem DB): mapa key→slug a partir de `Partner.niches`. */
function staticAssignments(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const n of niches) {
    const p = getPartnerForNiche(n.key);
    if (p) map[n.key] = p.slug;
  }
  return map;
}

/**
 * Mapa nicho→parceiro (só entradas COM parceiro atribuído). Sem DB → fallback estático.
 * Real-time (não cacheado) — usar no ADMIN. As páginas públicas usam a versão cacheada abaixo.
 */
export async function getNicheAssignments(): Promise<Record<string, string>> {
  const sql = getSql();
  if (!sql) return staticAssignments();
  try {
    await ensure(sql);
    const rows = (await sql`
      SELECT niche_key, partner_slug FROM niche_settings WHERE partner_slug IS NOT NULL
    `) as { niche_key: string; partner_slug: string }[];
    const map: Record<string, string> = {};
    for (const r of rows) map[r.niche_key] = r.partner_slug;
    return map;
  } catch {
    return staticAssignments();
  }
}

/**
 * Versão CACHEADA (assa no SSG; revalida por tag) — usada pelas páginas PÚBLICAS de nicho.
 * Ao salvar no admin, `revalidateTag(NICHE_SETTINGS_TAG)` regenera o HTML em segundos (sem redeploy).
 */
export const getNicheAssignmentsCached = unstable_cache(
  async () => getNicheAssignments(),
  ["niche-assignments"],
  { tags: [NICHE_SETTINGS_TAG] },
);

/**
 * ⭐ CONTROLE GLOBAL DE EXIBIÇÃO DE PARCEIROS — o PLANO é o topo da hierarquia.
 *
 * Visível em TODO o site se, e somente se, houver **plano mensal vigente**
 * (`plan_entities`, /admin/dashboard/planos). Sem plano → some de tudo.
 *
 * ⚠️ `/admin/dashboard/nichos` (`niche_settings`) é **PLACEMENT, não visibilidade**: define apenas
 *    em QUAL nicho o parceiro é a Recomendação Oficial. Parceiro com plano e sem nicho aparece
 *    normalmente nas demais superfícies — só não ocupa slot de recomendação. Parceiro com nicho e
 *    sem plano some do site inteiro, inclusive do slot.
 * ⚠️ Modelo anterior era `nichos ∩ plano`, com o `/nichos` funcionando como gate global porque a
 *    página de planos ainda não existia. Não reintroduzir: o cruzamento fazia um parceiro pago
 *    desaparecer por não ter nicho atribuído.
 *
 * Versão CACHEADA (páginas públicas), tag `plan-periods`.
 */
export async function getVisiblePartnerSlugs(): Promise<Set<string>> {
  const withPlan = await getActivePlanSlugsCached("partner");
  const out = new Set<string>();
  for (const p of activePartners) if (withPlan.has(p.slug)) out.add(p.slug);
  return out;
}

/** Versão real-time (não-cacheada) — para o admin (`force-dynamic`). */
export async function getVisiblePartnerSlugsLive(): Promise<Set<string>> {
  const withPlan = await getActivePlanSlugs("partner");
  const out = new Set<string>();
  for (const p of activePartners) if (withPlan.has(p.slug)) out.add(p.slug);
  return out;
}

/**
 * Define (ou limpa) a atribuição de um nicho (admin). `partnerSlug = null` → Empty State forçado.
 * Valida a existência do nicho e do parceiro. Lança sem DB.
 */
export async function setNicheAssignment(nicheKey: string, partnerSlug: string | null): Promise<void> {
  const sql = getSql();
  if (!sql) throw new Error("DB not configured");
  if (!niches.some((n) => n.key === nicheKey)) throw new Error("niche not found");
  if (partnerSlug && !activePartners.some((p) => p.slug === partnerSlug)) throw new Error("partner not found");
  await ensure(sql);
  await sql`
    INSERT INTO niche_settings (niche_key, partner_slug, updated_at)
    VALUES (${nicheKey}, ${partnerSlug}, NOW())
    ON CONFLICT (niche_key) DO UPDATE SET partner_slug = ${partnerSlug}, updated_at = NOW()
  `;
}
