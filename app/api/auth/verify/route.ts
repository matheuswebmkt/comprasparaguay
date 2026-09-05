// Filepath: app/api/auth/verify/route.ts
// Version: 1.0
// Nome da Versão: "Consome token mágico e define cookie de sessão"
// Baseado na Versão: N/A

import { NextRequest, NextResponse } from "next/server";
import { consumeMagicToken, isAllowedEmail } from "@/lib/auth";
import { SESSION_COOKIE, createSessionToken } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function loginRedirect(req: NextRequest, error: string) {
  const url = new URL("/admin/login", req.nextUrl.origin);
  url.searchParams.set("error", error);
  return NextResponse.redirect(url);
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return loginRedirect(req, "invalid");

  const email = await consumeMagicToken(token);
  if (!email || !isAllowedEmail(email)) return loginRedirect(req, "invalid");

  const secret = process.env.AUTH_SECRET;
  if (!secret) return loginRedirect(req, "config");

  const session = await createSessionToken(email, secret);
  const res = NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl.origin));
  res.cookies.set(SESSION_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  });
  return res;
}
