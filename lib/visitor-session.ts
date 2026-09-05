// Filepath: lib/visitor-session.ts
// Version: 1.0
// Nome da Versão: "Sessão visitante (HMAC) — cookie separado do admin"
// Edge-safe (Web Crypto) — reutiliza o padrão de lib/session.ts.

export const VISITOR_SESSION_COOKIE = "rf_visitor_session";
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
    ["sign", "verify"],
  );
}

export type VisitorSessionPayload = {
  email: string;
  name?: string | null;
  whatsapp?: string | null;
};

/** Token assinado: base64url(payload).base64url(hmac). */
export async function createVisitorSessionToken(
  data: VisitorSessionPayload,
  secret: string,
): Promise<string> {
  const payload = {
    e: data.email,
    n: data.name ?? null,
    w: data.whatsapp ?? null,
    exp: Date.now() + SESSION_TTL_MS,
  };
  const body = b64url(enc.encode(JSON.stringify(payload)));
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(body));
  return `${body}.${b64url(sig)}`;
}

export async function verifyVisitorSessionToken(
  token: string,
  secret: string,
): Promise<VisitorSessionPayload | null> {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  try {
    const key = await hmacKey(secret);
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      fromB64url(sig),
      enc.encode(body),
    );
    if (!ok) return null;
    const payload = JSON.parse(dec.decode(fromB64url(body))) as {
      e?: string;
      n?: string | null;
      w?: string | null;
      exp?: number;
    };
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    if (typeof payload.e !== "string" || !payload.e) return null;
    return {
      email: payload.e,
      name: typeof payload.n === "string" ? payload.n : null,
      whatsapp: typeof payload.w === "string" ? payload.w : null,
    };
  } catch {
    return null;
  }
}

export const VISITOR_SESSION_MAX_AGE = 30 * 24 * 60 * 60;
