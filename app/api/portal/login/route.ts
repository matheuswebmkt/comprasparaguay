// Filepath: app/api/portal/login/route.ts
// POST { email } → valida se o e-mail tem acesso e envia magic link.
// Respostas explícitas (painel privado 1:1 — sem anti-enumeração genérica):
//   200 { ok: true, sent: true }
//   404 { ok: false, error: "not_found" }
//   403 { ok: false, error: "inactive" }
//   429 { ok: false, error: "throttle" }
//   502 { ok: false, error: "send_failed" }

import { NextRequest, NextResponse } from "next/server";
import { createMagicToken, normalizeEmail } from "@/lib/auth";
import { getPortalAccountByEmail } from "@/lib/portal-auth";
import { sendMagicLinkEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let email: unknown;
  try {
    ({ email } = await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  if (typeof email !== "string") {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const normalized = normalizeEmail(email);
  if (!normalized.includes("@") || normalized.length < 5) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const acc = await getPortalAccountByEmail(normalized);
  if (!acc) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  if (!acc.active) {
    return NextResponse.json({ ok: false, error: "inactive" }, { status: 403 });
  }

  const token = await createMagicToken(normalized);
  if (!token) {
    return NextResponse.json({ ok: false, error: "throttle" }, { status: 429 });
  }

  const link = `${req.nextUrl.origin}/api/portal/verify?token=${token}`;
  const sent = await sendMagicLinkEmail(normalized, link);

  if (!sent) {
    console.warn("[portal/login] Resend não enviou.", { to: normalized });
    if (process.env.NODE_ENV === "development") {
      console.info("[portal/login] LINK MÁGICO (dev only):", link);
    }
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, sent: true });
}
