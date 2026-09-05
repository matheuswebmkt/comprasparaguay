// Filepath: app/api/auth/logout/route.ts
// Version: 1.0
// Nome da Versão: "Encerra a sessão (limpa cookie)"
// Baseado na Versão: N/A

import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/admin/login", req.nextUrl.origin));
  res.cookies.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
