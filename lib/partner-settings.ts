import { unstable_cache } from "next/cache";
import { getSql } from "./db";
import { activePartners } from "@/app/data/partners";

/** Tag de revalidação do toggle de parceiros (invalidada ao ligar/desligar no admin). */
export const PARTNER_SETTINGS_TAG = "partner-settings";

async function ensureTable(sql: NonNullable<ReturnType<typeof getSql>>) {
  await sql`
    CREATE TABLE IF NOT EXISTS partner_settings (
      slug        TEXT        PRIMARY KEY,
      enabled     BOOLEAN     NOT NULL DEFAULT TRUE,
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

/**
 * Retorna o conjunto de slugs habilitados para exibição na home.
 * Modelo opt-out: slug AUSENTE na tabela = habilitado por padrão.
 * Se o DB não estiver configurado, retorna todos os parceiros ativos.
 */
export async function getEnabledSlugs(): Promise<Set<string>> {
  const allSlugs = new Set(activePartners.map((p) => p.slug));
  const sql = getSql();
  if (!sql) return allSlugs;

  try {
    await ensureTable(sql);
    const rows = (await sql`SELECT slug, enabled FROM partner_settings`) as {
      slug: string;
      enabled: boolean;
    }[];
    const settings = new Map(rows.map((r) => [r.slug, r.enabled]));
    const result = new Set<string>();
    for (const slug of allSlugs) {
      if (!settings.has(slug) || settings.get(slug) === true) result.add(slug);
    }
    return result;
  } catch {
    return allSlugs;
  }
}

/**
 * Versão CACHEADA de getEnabledSlugs para as páginas PÚBLICAS (assa no SSG; revalida por tag).
 * Retorna array (Set não é serializável no Data Cache) — o caller faz `new Set(...)`. Ao ligar/desligar
 * um parceiro no admin, `revalidateTag(PARTNER_SETTINGS_TAG)` regenera o HTML em segundos (sem redeploy).
 * O admin usa `isPartnerEnabled` (não-cacheado) → estado em tempo real no painel.
 */
export const getEnabledSlugsCached = unstable_cache(
  async () => Array.from(await getEnabledSlugs()),
  ["enabled-slugs"],
  { tags: [PARTNER_SETTINGS_TAG] },
);

/**
 * Retorna se um parceiro específico está habilitado.
 * Padrão: habilitado quando slug não está na tabela.
 */
export async function isPartnerEnabled(slug: string): Promise<boolean> {
  const sql = getSql();
  if (!sql) return true;

  try {
    await ensureTable(sql);
    const rows = (await sql`SELECT enabled FROM partner_settings WHERE slug = ${slug}`) as {
      enabled: boolean;
    }[];
    return rows.length === 0 ? true : rows[0].enabled;
  } catch {
    return true;
  }
}

/**
 * Inverte o estado de habilitação de um parceiro. Retorna o novo valor.
 */
export async function togglePartnerEnabled(slug: string): Promise<boolean> {
  const sql = getSql();
  if (!sql) throw new Error("DB not configured");

  await ensureTable(sql);

  const rows = (await sql`SELECT enabled FROM partner_settings WHERE slug = ${slug}`) as {
    enabled: boolean;
  }[];
  const newEnabled = rows.length === 0 ? false : !rows[0].enabled;

  await sql`
    INSERT INTO partner_settings (slug, enabled, updated_at)
    VALUES (${slug}, ${newEnabled}, NOW())
    ON CONFLICT (slug) DO UPDATE SET enabled = ${newEnabled}, updated_at = NOW()
  `;

  return newEnabled;
}
