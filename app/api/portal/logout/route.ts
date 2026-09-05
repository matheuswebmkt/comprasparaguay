// Filepath: app/api/portal/logout/route.ts
// POST → limpa cookie do painel e redireciona para /comercial/login

import { NextRequest, NextResponse } from "next/server";
import { PORTAL_SESSION_COOKIE } from "@/lib/portal-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/comercial/login", req.nextUrl.origin));
  res.cookies.set(PORTAL_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
