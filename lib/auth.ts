// Filepath: lib/auth.ts
// Version: 1.0
// Nome da Versão: "Allowlist + magic tokens (node:crypto + Neon) — só route handlers Node"
// Baseado na Versão: N/A

import { createHash, randomBytes } from "node:crypto";
import { getSql } from "./db";

const TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutos

/** ÚNICO e-mail autorizado (conventions.md §5). */
export const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? "admin@comprasparaguay.online")
  .trim()
  .toLowerCase();

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isAllowedEmail(email: string): boolean {
  return normalizeEmail(email) === ADMIN_EMAIL;
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Cria um token mágico para o e-mail (já validado pelo caller).
 * Throttle: no máximo 1 token não-usado por minuto por e-mail.
 * Retorna o token em claro (para o link) ou null (DB ausente / throttle).
 */
export async function createMagicToken(email: string): Promise<string | null> {
  const sql = getSql();
  if (!sql) return null;

  try {
    await sql`alter table magic_tokens add column if not exists purpose text not null default 'admin'`;
  } catch {
    // tabela ainda não existe / sem permissão — insert legado abaixo
  }

  const recent = (await sql`
    select 1 from magic_tokens
    where email = ${email} and used_at is null
      and created_at > now() - interval '60 seconds'
    limit 1
  `) as unknown[];
  if (recent.length) return null;

  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + TOKEN_TTL_MS).toISOString();
  try {
    await sql`
      insert into magic_tokens (token_hash, email, expires_at, purpose)
      values (${hashToken(token)}, ${email}, ${expires}, 'admin')
    `;
  } catch {
    await sql`
      insert into magic_tokens (token_hash, email, expires_at)
      values (${hashToken(token)}, ${email}, ${expires})
    `;
  }
  return token;
}

/**
 * Consome um token (uso único, atômico via UPDATE ... RETURNING).
 * Retorna o e-mail se válido/não-usado/não-expirado, senão null.
 */
export async function consumeMagicToken(token: string): Promise<string | null> {
  const sql = getSql();
  if (!sql) return null;

  // Só tokens de admin (purpose default ou 'admin') — evita consumir magic link de visitante.
  const rows = (await sql`
    update magic_tokens set used_at = now()
    where token_hash = ${hashToken(token)}
      and used_at is null
      and expires_at > now()
      and (purpose is null or purpose = 'admin')
    returning email
  `) as { email: string }[];
  return rows.length ? rows[0].email : null;
}
