// Filepath: app/api/portal/verify/route.ts
// GET ?token= → consome magic link e define cookie rgf_portal_session
// Redirect: /comercial/painel (login em /comercial/login)

import { NextRequest, NextResponse } from "next/server";
import { consumeMagicToken } from "@/lib/auth";
import { getPortalAccountByEmail } from "@/lib/portal-auth";
import {
  PORTAL_SESSION_COOKIE,
  PORTAL_SESSION_MAX_AGE_SEC,
  createPortalSessionToken,
} from "@/lib/portal-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function loginRedirect(req: NextRequest, error: string) {
  const url = new URL("/comercial/login", req.nextUrl.origin);
  url.searchParams.set("error", error);
  return NextResponse.redirect(url);
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return loginRedirect(req, "invalid");

  const email = await consumeMagicToken(token);
  if (!email) return loginRedirect(req, "invalid");

  const acc = await getPortalAccountByEmail(email);
  if (!acc || !acc.active) return loginRedirect(req, "invalid");

  const secret = process.env.AUTH_SECRET;
  if (!secret) return loginRedirect(req, "config");

  const session = await createPortalSessionToken(
    {
      entityType: acc.entityType,
      entitySlug: acc.entitySlug,
      email: acc.email,
    },
    secret,
  );

  const res = NextResponse.redirect(new URL("/comercial/painel", req.nextUrl.origin));
  res.cookies.set(PORTAL_SESSION_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: PORTAL_SESSION_MAX_AGE_SEC,
  });
  return res;
}
