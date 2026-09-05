// Filepath: app/api/visitor/me/route.ts
// Version: 1.0
// Nome da Versão: "Sessão visitante atual (para modal + UI salvar)"

import { NextRequest, NextResponse } from "next/server";
import { getVisitorAccount } from "@/lib/visitor-auth";
import {
  VISITOR_SESSION_COOKIE,
  verifyVisitorSessionToken,
} from "@/lib/visitor-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const secret = process.env.AUTH_SECRET;
  const token = req.cookies.get(VISITOR_SESSION_COOKIE)?.value;
  if (!secret || !token) {
    return NextResponse.json({ authenticated: false });
  }

  const session = await verifyVisitorSessionToken(token, secret);
  if (!session) {
    return NextResponse.json({ authenticated: false });
  }

  const account = await getVisitorAccount(session.email);
  return NextResponse.json({
    authenticated: true,
    email: session.email,
    name: account?.name ?? session.name ?? null,
    whatsapp: account?.whatsapp ?? session.whatsapp ?? null,
  });
}
