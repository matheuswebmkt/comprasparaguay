// Filepath: app/api/auth/request/route.ts
// Version: 1.0
// Nome da Versão: "Solicita link mágico — só envia para o ADMIN_EMAIL (anti-abuso Resend)"
// Baseado na Versão: N/A

import { NextRequest, NextResponse } from "next/server";
import { isAllowedEmail, normalizeEmail, createMagicToken } from "@/lib/auth";
import { sendMagicLinkEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Resposta SEMPRE genérica: não revela se o e-mail é o autorizado (anti-enumeração)
  // e, crucialmente, NÃO chama o Resend para nenhum e-mail fora da allowlist (conventions.md §5).
  const generic = NextResponse.json({ ok: true });

  let email: unknown;
  try {
    ({ email } = await req.json());
  } catch {
    return generic;
  }

  if (typeof email !== "string" || !isAllowedEmail(email)) {
    return generic; // zero consumo de envio
  }

  const normalized = normalizeEmail(email);
  const token = await createMagicToken(normalized);
  if (!token) return generic; // DB ausente ou throttle (1/min)

  const link = `${req.nextUrl.origin}/api/auth/verify?token=${token}`;
  const sent = await sendMagicLinkEmail(normalized, link);
  if (!sent && process.env.NODE_ENV === "development") {
    console.info("[admin/login] LINK MÁGICO (dev only):", link);
  }

  return generic;
}
