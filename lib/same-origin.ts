// Filepath: lib/same-origin.ts
// Version: 1.0
// Nome da Versão: "Guarda same-origin por hostname EXATO — corrige o bypass por domínio sósia"
//
// Fonte ÚNICA da checagem de mesma-origem das rotas de ingestão (/api/track, /api/leads,
// /api/leads/draft, /api/leads/success, /api/modal-track, /api/contact).
//
// ⚠️ MOTIVO (correção de segurança): a versão anterior estava duplicada em várias rotas e comparava com
// `origin.endsWith(host)` / `referer.includes(host)`. Isso aceita **domínio sósia**: com
// `host = "comprasparaguay.online"`, um `origin = "https://evil-comprasparaguay.online"` passa (`endsWith` casa o
// sufixo), e `referer.includes(host)` é ainda mais frouxo — qualquer URL que CONTENHA a string em
// qualquer posição (inclusive num path ou query, ex: `https://evil.com/?x=comprasparaguay.online`) passava.
// Agora comparamos o **hostname parseado**, exato, case-insensitive.
//
// Semântica preservada de propósito: continua valendo se o `origin` OU o `referer` casar (o
// `sendBeacon` de algumas rotas nem sempre manda os dois) — só a COMPARAÇÃO ficou estrita. Sem header
// nenhum → bloqueia, como antes.

/** Hostname de uma URL (lowercase) — `null` se não parsear (header ausente/malformado). */
function hostnameOf(value: string | null): string | null {
  if (!value) return null;
  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return null;
  }
}

/**
 * `true` quando a requisição vem do próprio site. Compara o hostname do `origin` OU do `referer`
 * com o do header `host` (que pode incluir porta — `localhost:3000` → `localhost`).
 */
export function isSameOriginRequest(req: {
  headers: { get(name: string): string | null };
}): boolean {
  const rawHost = req.headers.get("host");
  if (!rawHost) return false;
  // `host` vem como "dominio" ou "dominio:porta" (nunca com esquema) — só o nome interessa.
  const host = rawHost.split(":")[0].toLowerCase();
  if (!host) return false;

  const origin = hostnameOf(req.headers.get("origin"));
  const referer = hostnameOf(req.headers.get("referer"));
  return origin === host || referer === host;
}
