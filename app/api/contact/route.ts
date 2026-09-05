// Filepath: app/api/contact/route.ts
// Version: 1.0
// Nome da Versão: "Formulário de contato (/contato) → e-mail via Resend (roteirofoz@gmail.com)"
// Baseado na Versão: N/A

import { NextRequest, NextResponse } from "next/server";
import { sendContactFormEmail } from "@/lib/email";
import { isSameOriginRequest } from "@/lib/same-origin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX = 4000;
const clip = (v: unknown, n = MAX): string | null =>
  typeof v === "string" && v.trim().length > 0 ? v.trim().slice(0, n) : null;

function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req: NextRequest) {
  // Defesa: a requisição precisa vir do próprio site — fonte única em lib/same-origin.ts (hostname
  // EXATO; a versão antiga, duplicada em cada rota, aceitava domínio sósia via endsWith/includes).
  if (!isSameOriginRequest(req)) return new NextResponse(null, { status: 403 });

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  // Honeypot: campo-armadilha invisível (mesmo padrão do /api/leads). Preenchido = bot → dropa em silêncio.
  if (typeof body.honeypot === "string" && body.honeypot.trim().length > 0) {
    return new NextResponse(null, { status: 204 });
  }

  const nome = clip(body.nome, 80);
  const email = clip(body.email, 160);
  const mensagem = clip(body.mensagem, 4000);
  if (!nome || !email || !isValidEmail(email) || !mensagem) {
    return new NextResponse(null, { status: 400 });
  }

  const sent = await sendContactFormEmail({ nome, email, mensagem });
  if (!sent && process.env.NODE_ENV === "development") {
    console.warn("contact: e-mail não enviado (RESEND_API_KEY ausente ou erro no Resend).");
  }

  return new NextResponse(null, { status: 204 });
}
