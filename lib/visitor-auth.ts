// Filepath: lib/visitor-auth.ts
// Version: 1.0
// Nome da Versão: "Magic link visitante + contas + roteiros salvos (Neon)"
// Node-only (node:crypto + Neon). NÃO importar no middleware Edge.

import { createHash, randomBytes } from "node:crypto";
import { getSql } from "./db";

const TOKEN_TTL_MS = 15 * 60 * 1000;
const PURPOSE = "visitor";

export function normalizeVisitorEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidVisitorEmail(email: string): boolean {
  const e = normalizeVisitorEmail(email);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 200;
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

type Sql = NonNullable<ReturnType<typeof getSql>>;

export async function ensureVisitorTables(sql: Sql): Promise<void> {
  await sql`
    alter table magic_tokens add column if not exists purpose text not null default 'admin'
  `;
  await sql`
    create table if not exists visitor_accounts (
      email       text primary key,
      name        text,
      whatsapp    text,
      created_at  timestamptz not null default now(),
      updated_at  timestamptz not null default now()
    )
  `;
  await sql`
    create table if not exists saved_roteiros (
      id              bigserial primary key,
      email           text not null references visitor_accounts(email) on delete cascade,
      slug            text,
      titulo          text not null,
      draft_json      jsonb,
      resumo          text,
      source          text,
      template_slug   text,
      created_at      timestamptz not null default now(),
      updated_at      timestamptz not null default now()
    )
  `;
  await sql`
    create index if not exists saved_roteiros_email_idx
    on saved_roteiros (email, updated_at desc)
  `;
}

export async function createVisitorMagicToken(
  email: string,
): Promise<string | null> {
  const sql = getSql();
  if (!sql) return null;
  await ensureVisitorTables(sql);

  const recent = (await sql`
    select 1 from magic_tokens
    where email = ${email}
      and purpose = ${PURPOSE}
      and used_at is null
      and created_at > now() - interval '60 seconds'
    limit 1
  `) as unknown[];
  if (recent.length) return null;

  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + TOKEN_TTL_MS).toISOString();
  await sql`
    insert into magic_tokens (token_hash, email, expires_at, purpose)
    values (${hashToken(token)}, ${email}, ${expires}, ${PURPOSE})
  `;
  return token;
}

export async function consumeVisitorMagicToken(
  token: string,
): Promise<string | null> {
  const sql = getSql();
  if (!sql) return null;
  await ensureVisitorTables(sql);

  const rows = (await sql`
    update magic_tokens set used_at = now()
    where token_hash = ${hashToken(token)}
      and purpose = ${PURPOSE}
      and used_at is null
      and expires_at > now()
    returning email
  `) as { email: string }[];
  return rows.length ? rows[0].email : null;
}

export async function upsertVisitorAccount(opts: {
  email: string;
  name?: string | null;
  whatsapp?: string | null;
}): Promise<void> {
  const sql = getSql();
  if (!sql) return;
  await ensureVisitorTables(sql);
  const email = normalizeVisitorEmail(opts.email);
  const name = opts.name?.trim() || null;
  const whatsapp = opts.whatsapp?.trim() || null;
  await sql`
    insert into visitor_accounts (email, name, whatsapp)
    values (${email}, ${name}, ${whatsapp})
    on conflict (email) do update set
      name = coalesce(excluded.name, visitor_accounts.name),
      whatsapp = coalesce(excluded.whatsapp, visitor_accounts.whatsapp),
      updated_at = now()
  `;
}

export async function getVisitorAccount(email: string): Promise<{
  email: string;
  name: string | null;
  whatsapp: string | null;
} | null> {
  const sql = getSql();
  if (!sql) return null;
  await ensureVisitorTables(sql);
  const rows = (await sql`
    select email, name, whatsapp from visitor_accounts
    where email = ${normalizeVisitorEmail(email)}
    limit 1
  `) as { email: string; name: string | null; whatsapp: string | null }[];
  return rows[0] ?? null;
}

export type SavedRoteiroRow = {
  id: number;
  email: string;
  slug: string | null;
  titulo: string;
  draft_json: unknown;
  resumo: string | null;
  source: string | null;
  template_slug: string | null;
  created_at: string;
  updated_at: string;
};

export async function saveVisitorRoteiro(opts: {
  email: string;
  titulo: string;
  slug?: string | null;
  draft?: unknown;
  resumo?: string | null;
  source?: string | null;
  templateSlug?: string | null;
}): Promise<number | null> {
  const sql = getSql();
  if (!sql) return null;
  await ensureVisitorTables(sql);
  await upsertVisitorAccount({ email: opts.email });

  const draftJson =
    opts.draft != null ? JSON.stringify(opts.draft) : null;
  const rows = (await sql`
    insert into saved_roteiros (
      email, slug, titulo, draft_json, resumo, source, template_slug
    ) values (
      ${normalizeVisitorEmail(opts.email)},
      ${opts.slug ?? null},
      ${opts.titulo.slice(0, 200)},
      ${draftJson},
      ${opts.resumo?.slice(0, 4000) ?? null},
      ${opts.source ?? null},
      ${opts.templateSlug ?? null}
    )
    returning id
  `) as { id: number }[];
  return rows[0]?.id ?? null;
}

export async function listVisitorRoteiros(
  email: string,
  limit = 20,
): Promise<SavedRoteiroRow[]> {
  const sql = getSql();
  if (!sql) return [];
  await ensureVisitorTables(sql);
  return (await sql`
    select id, email, slug, titulo, draft_json, resumo, source, template_slug,
           created_at::text, updated_at::text
    from saved_roteiros
    where email = ${normalizeVisitorEmail(email)}
    order by updated_at desc
    limit ${limit}
  `) as SavedRoteiroRow[];
}

/**
 * Lead passivo: e-mail capturado ao salvar/criar conta (sem WhatsApp ainda).
 * Usa whatsapp sintético `email:<hash>` se a coluna for NOT NULL.
 */
export async function recordPassiveLead(opts: {
  email: string;
  name?: string | null;
  pagePath?: string | null;
  ctaType?: string;
}): Promise<number | null> {
  const sql = getSql();
  if (!sql) return null;

  try {
    await sql`
      create table if not exists leads (
        id               bigserial primary key,
        nome             text,
        email            text,
        whatsapp         text not null,
        cta_type         text,
        created_at       timestamptz default now()
      )
    `;
    await sql`alter table leads add column if not exists page_path text`;
    await sql`alter table leads add column if not exists lgpd_consent boolean default true`;

    const email = normalizeVisitorEmail(opts.email);
    // Dedup: mesmo e-mail + cta save nos últimos 7 dias → não duplica
    const existing = (await sql`
      select id from leads
      where lower(email) = ${email}
        and cta_type = ${opts.ctaType ?? "save_roteiro"}
        and created_at > now() - interval '7 days'
      limit 1
    `) as { id: number }[];
    if (existing.length) return existing[0].id;

    // Placeholder: leads.whatsapp é NOT NULL no schema legado — marca pendência de contato.
    const placeholderWa = `email:${email}`;
    const inserted = (await sql`
      insert into leads (nome, email, whatsapp, cta_type, page_path, lgpd_consent)
      values (
        ${opts.name?.trim() || null},
        ${email},
        ${placeholderWa},
        ${opts.ctaType ?? "save_roteiro"},
        ${opts.pagePath ?? null},
        true
      )
      returning id
    `) as { id: number }[];
    return inserted[0]?.id ?? null;
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("recordPassiveLead error:", err);
    }
    return null;
  }
}
