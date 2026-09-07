// Filepath: lib/session.ts
// Version: 1.1
// Última mudança: "chaves locais rgf_* → cp_* (vocabulário do satélite de origem — D9; domínio novo, custo zero)"
// Nome da Versão: "Sessão assinada (HMAC via Web Crypto) — Edge-safe"
// Baseado na Versão: N/A
//
// ⚠️ Edge-safe: usa SOMENTE Web Crypto (crypto.subtle), sem node:crypto nem Neon,
// para poder ser importado pelo middleware (runtime Edge) e pelos route handlers.

export const SESSION_COOKIE = "cp_admin_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 dias

const enc = new TextEncoder();
const dec = new TextDecoder();

function b64url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = "";
  for (const b of arr) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(str: string): Uint8Array<ArrayBuffer> {
  let s = str.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/** Cria um token de sessão assinado: base64url(payload).base64url(hmac). */
export async function createSessionToken(email: string, secret: string): Promise<string> {
  const payload = { e: email, exp: Date.now() + SESSION_TTL_MS };
  const data = b64url(enc.encode(JSON.stringify(payload)));
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return `${data}.${b64url(sig)}`;
}

/** Valida assinatura + expiração. Retorna o e-mail ou null. */
export async function verifySessionToken(token: string, secret: string): Promise<string | null> {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [data, sig] = parts;
  try {
    const key = await hmacKey(secret);
    const ok = await crypto.subtle.verify("HMAC", key, fromB64url(sig), enc.encode(data));
    if (!ok) return null;
    const payload = JSON.parse(dec.decode(fromB64url(data)));
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return typeof payload.e === "string" ? payload.e : null;
  } catch {
    return null;
  }
}
