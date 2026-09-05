// Filepath: lib/agencies.ts
// Version: 2.0
// Nome da Versão: "Seed + enrich a partir do catálogo estático app/data/agencies.ts (SSOT de perfil)"
//
// Agências são a entidade que RECEBE os leads (≠ partners/negócios locais de app/data/partners.ts).
// Perfil (nome, contatos, copy) = `app/data/agencies.ts`. Neon (tabela `agencies`) mantém a RELAÇÃO
// com os leads: cada lead grava o `slug` da agência ativa (leads.assigned_partner). Trocar de agência
// NÃO apaga os leads antigos. Ver conventions §13.

import { unstable_cache } from "next/cache";
import { getSql } from "./db";
import {
  seedableAgencies,
  getAgencyBySlug,
  type AgencyProfile,
} from "@/app/data/agencies";
import { isPlanCurrentlyActive } from "./plan-periods";

export interface Agency {
  slug: string;
  name: string;
  city: string | null;
  country: string | null;      // BR | AR | PY
  whatsapp: string | null;
  instagram: string | null;
  website: string | null;
  description: string | null;
  logo_path: string | null;
  created_at: string;
}

const ACTIVE_KEY = "active_agency";
/**
 * Sem app_settings → nenhuma agência ativa (Empty State no nicho; leads sem assigned_partner).
 * Ativar no admin `/dashboard/agencia` (foz-falls em prod, agencia-teste p/ testes de lead).
 * Valor especial `__none__` = desativada explicitamente.
 */
const DEFAULT_ACTIVE: string | null = null;

/** Tag de revalidação da agência ativa (nicho `transfer` + surfaces cacheadas). */
export const ACTIVE_AGENCY_TAG = "active-agency";

type Sql = NonNullable<ReturnType<typeof getSql>>;

/** Preenche campos nulos do row com o catálogo estático (SSOT). Nome do catálogo vence se o row só tem seed mínimo. */
function enrichFromCatalog(row: Agency): Agency {
  const cat = getAgencyBySlug(row.slug);
  if (!cat) return row;
  const desc = cat.description.join(" ").trim();
  return {
    ...row,
    name: row.name?.trim() || cat.name,
    city: row.city?.trim() || cat.city,
    country: row.country?.trim() || cat.country,
    whatsapp: row.whatsapp?.trim() || cat.whatsapp || null,
    instagram: row.instagram?.trim() || cat.instagram || null,
    website: row.website?.trim() || cat.website || null,
    description: row.description?.trim() || (desc || null),
    logo_path: row.logo_path?.trim() || cat.logo || null,
  };
}

async function ensure(sql: Sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS agencies (
      slug         TEXT PRIMARY KEY,
      name         TEXT NOT NULL,
      city         TEXT,
      country      TEXT,
      whatsapp     TEXT,
      instagram    TEXT,
      website      TEXT,
      description  TEXT,
      logo_path    TEXT,
      created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE TABLE IF NOT EXISTS app_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;

  // Seed idempotente a partir do catálogo estático. Não sobrescreve overrides já gravados no DB
  // (só preenche colunas ainda NULL) — o perfil canônico continua em app/data/agencies.ts.
  for (const a of seedableAgencies()) {
    const desc = a.description.join(" ").trim() || null;
    await sql`
      INSERT INTO agencies (slug, name, city, country, whatsapp, instagram, website, description, logo_path)
      VALUES (
        ${a.slug}, ${a.name}, ${a.city}, ${a.country},
        ${a.whatsapp ?? null}, ${a.instagram ?? null}, ${a.website ?? null},
        ${desc}, ${a.logo ?? null}
      )
      ON CONFLICT (slug) DO UPDATE SET
        name        = COALESCE(NULLIF(TRIM(agencies.name), ''), EXCLUDED.name),
        city        = COALESCE(agencies.city, EXCLUDED.city),
        country     = COALESCE(agencies.country, EXCLUDED.country),
        whatsapp    = COALESCE(agencies.whatsapp, EXCLUDED.whatsapp),
        instagram   = COALESCE(agencies.instagram, EXCLUDED.instagram),
        website     = COALESCE(agencies.website, EXCLUDED.website),
        description = COALESCE(agencies.description, EXCLUDED.description),
        logo_path   = COALESCE(agencies.logo_path, EXCLUDED.logo_path)
    `;
  }
}

/** Todas as agências conhecidas (ordem alfabética), enriquecidas com o catálogo. Sem DB → []. */
export async function getAgencies(): Promise<Agency[]> {
  const sql = getSql();
  if (!sql) return [];
  try {
    await ensure(sql);
    const rows = (await sql`
      SELECT slug, name, city, country, whatsapp, instagram, website, description, logo_path,
             to_char(created_at at time zone 'America/Sao_Paulo', 'DD/MM/YYYY') as created_at
      FROM agencies ORDER BY name
    `) as Agency[];
    return rows.map(enrichFromCatalog);
  } catch {
    return [];
  }
}

/** Uma agência pelo slug (DB + catálogo). */
export async function getAgency(slug: string): Promise<Agency | null> {
  const list = await getAgencies();
  return list.find((a) => a.slug === slug) ?? null;
}

/**
 * Slug da agência ATIVA (leads + recomendação pública). `null` = nenhuma ativa
 * (Empty State no nicho; novos leads sem `assigned_partner` quando o fluxo depende da ativa).
 * ⭐ Topo da hierarquia: exige plano mensal vigente (`/admin/dashboard/planos`), além do toggle Ativar.
 */
export async function getActiveAgencySlug(): Promise<string | null> {
  const sql = getSql();
  if (!sql) return DEFAULT_ACTIVE;
  try {
    await sql`CREATE TABLE IF NOT EXISTS app_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
    const rows = (await sql`SELECT value FROM app_settings WHERE key = ${ACTIVE_KEY}`) as { value: string }[];
    const v = rows[0]?.value?.trim() ?? "";
    if (!v || v === "__none__") return null;
    // Plano mensal no topo: sem período vigente → trata como desativada no site/leads.
    if (!(await isPlanCurrentlyActive("agency", v))) return null;
    return v;
  } catch {
    return DEFAULT_ACTIVE;
  }
}

/** Toggle "Ativar" no admin — ignora plano (só o flag operacional). */
export async function getActiveAgencySlugRaw(): Promise<string | null> {
  const sql = getSql();
  if (!sql) return DEFAULT_ACTIVE;
  try {
    await sql`CREATE TABLE IF NOT EXISTS app_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
    const rows = (await sql`SELECT value FROM app_settings WHERE key = ${ACTIVE_KEY}`) as { value: string }[];
    const v = rows[0]?.value?.trim() ?? "";
    if (!v || v === "__none__") return null;
    return v;
  } catch {
    return DEFAULT_ACTIVE;
  }
}

// Cache do flag BRUTO "Ativar" (só o valor do app_settings, sem checar plano) — sem `revalidate` por
// tempo: só muda quando o admin troca a agência ativa, e essa rota já chama `revalidateTag(ACTIVE_AGENCY_TAG)`.
const getActiveAgencySlugRawCached = unstable_cache(
  async () => getActiveAgencySlugRaw(),
  ["active-agency-slug-raw"],
  { tags: [ACTIVE_AGENCY_TAG] },
);

/**
 * Versão CACHEADA do slug ativo — páginas públicas (ex: recomendação do nicho agência). Compõe o flag
 * "Ativar" (cacheado acima, só muda por ação admin) com a checagem de vigência do plano em JS puro
 * (`isPlanCurrentlyActive`, roda a cada chamada, NUNCA cacheada) — corrige bug real (jul/2026): antes
 * cacheávamos `getActiveAgencySlug()` inteiro, que já embutia a checagem de tempo —
 * um plano vencendo sozinho (sem NENHUMA ação no admin naquele dia) nunca invalidava o cache, então a
 * agência continuava aparecendo como vigente indefinidamente após o vencimento. Agora o vencimento por
 * passagem do tempo é detectado no PRIMEIRO acesso após o prazo virar, sem precisar de nenhuma query nova.
 * `revalidateTag(ACTIVE_AGENCY_TAG)` no POST /api/admin/active-agency cobre a parte manual.
 */
export async function getActiveAgencySlugCached(): Promise<string | null> {
  const v = await getActiveAgencySlugRawCached();
  if (!v) return null;
  if (!(await isPlanCurrentlyActive("agency", v))) return null;
  return v;
}

/**
 * Define a agência ativa (admin). `slug = null` desativa todas (Empty State no nicho;
 * deixa de carimbar novos leads). Só aceita slug existente quando ativando. Lança sem DB.
 */
export async function setActiveAgencySlug(slug: string | null): Promise<void> {
  const sql = getSql();
  if (!sql) throw new Error("DB not configured");
  await ensure(sql);

  if (slug === null) {
    await sql`
      INSERT INTO app_settings (key, value, updated_at) VALUES (${ACTIVE_KEY}, ${"__none__"}, NOW())
      ON CONFLICT (key) DO UPDATE SET value = ${"__none__"}, updated_at = NOW()
    `;
    return;
  }

  const exists = (await sql`SELECT 1 FROM agencies WHERE slug = ${slug}`) as unknown[];
  if (!exists.length) throw new Error("agency not found");
  await sql`
    INSERT INTO app_settings (key, value, updated_at) VALUES (${ACTIVE_KEY}, ${slug}, NOW())
    ON CONFLICT (key) DO UPDATE SET value = ${slug}, updated_at = NOW()
  `;
}

/** Reexport do tipo de perfil estático (consumidores que só precisam do catálogo). */
export type { AgencyProfile };
