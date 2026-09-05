// Filepath: lib/portal-session.ts
// Version: 2.0
// Nome da Versão: "Sessão painel (HMAC, Edge-safe) — e-mail + entidade; cookie separado do admin"

import type { PlanEntityType } from "@/lib/plan-periods";

export const PORTAL_SESSION_COOKIE = "rgf_portal_session";
const SESSION_TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 dias

export type PortalSession = {
  entityType: PlanEntityType;
  entitySlug: string;
  email: string;
};

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

/** Token assinado: base64url(payload).base64url(hmac) */
export async function createPortalSessionToken(
  session: PortalSession,
  secret: string,
): Promise<string> {
  const payload = {
    t: session.entityType,
    s: session.entitySlug,
    e: session.email,
    exp: Date.now() + SESSION_TTL_MS,
  };
  const data = b64url(enc.encode(JSON.stringify(payload)));
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return `${data}.${b64url(sig)}`;
}

export async function verifyPortalSessionToken(
  token: string,
  secret: string,
): Promise<PortalSession | null> {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [data, sig] = parts;
  try {
    const key = await hmacKey(secret);
    const ok = await crypto.subtle.verify("HMAC", key, fromB64url(sig), enc.encode(data));
    if (!ok) return null;
    const payload = JSON.parse(dec.decode(fromB64url(data))) as {
      t?: string;
      s?: string;
      e?: string;
      u?: string; // legado username (sessões antigas)
      exp?: number;
    };
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    if (!["partner", "agency"].includes(payload.t ?? "")) return null;
    if (typeof payload.s !== "string" || !payload.s) return null;
    const email =
      typeof payload.e === "string" && payload.e
        ? payload.e
        : typeof payload.u === "string"
          ? payload.u
          : "";
    if (!email) return null;
    return {
      entityType: payload.t as PlanEntityType,
      entitySlug: payload.s,
      email,
    };
  } catch {
    return null;
  }
}

export const PORTAL_SESSION_MAX_AGE_SEC = Math.floor(SESSION_TTL_MS / 1000);
