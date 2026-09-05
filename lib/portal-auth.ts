// Filepath: lib/portal-auth.ts
// Version: 2.0
// Nome da Versão: "Contas do painel por e-mail (magic link) — partner | agency"
//
// Login separado do admin. Admin cadastra o e-mail; entidade entra só com link mágico.

import { getSql } from "./db";
import { listCatalogEntities, type PlanEntityType } from "./plan-periods";

export interface PortalAccount {
  entityType: PlanEntityType;
  entitySlug: string;
  email: string;
  active: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

type Sql = NonNullable<ReturnType<typeof getSql>>;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  // Validação leve (mesmo espírito do admin)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 200;
}

async function ensure(sql: Sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS portal_accounts (
      entity_type     TEXT NOT NULL,
      entity_slug     TEXT NOT NULL,
      email           TEXT NOT NULL,
      active          BOOLEAN NOT NULL DEFAULT true,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (entity_type, entity_slug)
    )
  `;
  // Migração se a tabela v1 (username/password) já existia:
  await sql`ALTER TABLE portal_accounts ADD COLUMN IF NOT EXISTS email TEXT`;
  // Relaxa colunas legadas (username/password_hash) se existirem — senão o INSERT com e-mail falha
  await sql`
    DO $mig$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'portal_accounts' AND column_name = 'username'
      ) THEN
        ALTER TABLE portal_accounts ALTER COLUMN username DROP NOT NULL;
      END IF;
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'portal_accounts' AND column_name = 'password_hash'
      ) THEN
        ALTER TABLE portal_accounts ALTER COLUMN password_hash DROP NOT NULL;
      END IF;
    END
    $mig$
  `;
  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS portal_accounts_email_uidx
    ON portal_accounts (lower(email))
    WHERE email IS NOT NULL AND email <> ''
  `;
}

export function entityDisplayName(entityType: PlanEntityType, entitySlug: string): string {
  const hit = listCatalogEntities().find(
    (e) => e.entityType === entityType && e.entitySlug === entitySlug,
  );
  return hit?.entityName ?? entitySlug;
}

function mapRow(r: {
  entity_type: PlanEntityType;
  entity_slug: string;
  email: string;
  active: boolean;
  created_at: string | null;
  updated_at: string | null;
}): PortalAccount {
  return {
    entityType: r.entity_type,
    entitySlug: r.entity_slug,
    email: r.email,
    active: r.active,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export async function getPortalAccount(
  entityType: PlanEntityType,
  entitySlug: string,
): Promise<PortalAccount | null> {
  const sql = getSql();
  if (!sql) return null;
  try {
    await ensure(sql);
    const rows = (await sql`
      SELECT entity_type, entity_slug, email, active,
             created_at::text as created_at, updated_at::text as updated_at
      FROM portal_accounts
      WHERE entity_type = ${entityType} AND entity_slug = ${entitySlug}
        AND email IS NOT NULL AND email <> ''
    `) as {
      entity_type: PlanEntityType;
      entity_slug: string;
      email: string;
      active: boolean;
      created_at: string | null;
      updated_at: string | null;
    }[];
    const r = rows[0];
    return r ? mapRow(r) : null;
  } catch {
    return null;
  }
}

/** Conta ativa pelo e-mail (login magic link). */
export async function getPortalAccountByEmail(email: string): Promise<PortalAccount | null> {
  const sql = getSql();
  if (!sql) return null;
  const e = normalizeEmail(email);
  if (!e) return null;
  try {
    await ensure(sql);
    const rows = (await sql`
      SELECT entity_type, entity_slug, email, active,
             created_at::text as created_at, updated_at::text as updated_at
      FROM portal_accounts
      WHERE lower(email) = ${e}
      LIMIT 1
    `) as {
      entity_type: PlanEntityType;
      entity_slug: string;
      email: string;
      active: boolean;
      created_at: string | null;
      updated_at: string | null;
    }[];
    const r = rows[0];
    if (!r || !r.email) return null;
    return mapRow(r);
  } catch {
    return null;
  }
}

export async function listPortalAccounts(): Promise<PortalAccount[]> {
  const sql = getSql();
  if (!sql) return [];
  try {
    await ensure(sql);
    const rows = (await sql`
      SELECT entity_type, entity_slug, email, active,
             created_at::text as created_at, updated_at::text as updated_at
      FROM portal_accounts
      WHERE email IS NOT NULL AND email <> ''
      ORDER BY entity_type, entity_slug
    `) as {
      entity_type: PlanEntityType;
      entity_slug: string;
      email: string;
      active: boolean;
      created_at: string | null;
      updated_at: string | null;
    }[];
    return rows.map(mapRow);
  } catch {
    return [];
  }
}

/**
 * Cria ou atualiza o e-mail de acesso ao painel (magic link).
 */
export async function upsertPortalAccount(input: {
  entityType: PlanEntityType;
  entitySlug: string;
  email: string;
  active?: boolean;
}): Promise<PortalAccount> {
  const sql = getSql();
  if (!sql) throw new Error("DB not configured");

  const known = listCatalogEntities().some(
    (e) => e.entityType === input.entityType && e.entitySlug === input.entitySlug,
  );
  if (!known) throw new Error("entity not found");

  const email = normalizeEmail(input.email);
  if (!isValidEmail(email)) throw new Error("e-mail inválido");

  await ensure(sql);
  const active = input.active !== false;

  // E-mail único entre entidades
  const clash = (await sql`
    SELECT entity_type, entity_slug FROM portal_accounts
    WHERE lower(email) = ${email}
      AND NOT (entity_type = ${input.entityType} AND entity_slug = ${input.entitySlug})
    LIMIT 1
  `) as { entity_type: string; entity_slug: string }[];
  if (clash.length) throw new Error("este e-mail já está vinculado a outra entidade");

  await sql`
    INSERT INTO portal_accounts (entity_type, entity_slug, email, active, updated_at)
    VALUES (${input.entityType}, ${input.entitySlug}, ${email}, ${active}, NOW())
    ON CONFLICT (entity_type, entity_slug) DO UPDATE SET
      email = ${email},
      active = ${active},
      updated_at = NOW()
  `;

  const acc = await getPortalAccount(input.entityType, input.entitySlug);
  if (!acc) throw new Error("save failed");
  return acc;
}
