// Filepath: lib/db.ts
// Version: 1.0
// Nome da Versão: "Cliente Neon serverless (lazy, build-safe)"
// Baseado na Versão: N/A

import { neon } from "@neondatabase/serverless";

let cached: ReturnType<typeof neon> | null = null;

/**
 * Cliente SQL do Neon. Inicialização preguiçosa para o build NÃO depender da
 * DATABASE_URL. Retorna `null` quando a env não está definida (callers fazem no-op).
 */
export function getSql(): ReturnType<typeof neon> | null {
  if (cached) return cached;
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  cached = neon(url);
  return cached;
}

export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
