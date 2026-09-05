// Filepath: app/api/admin/portal-account/route.ts
// GET ?entityType=&entitySlug= → conta (e-mail, sem segredo)
// POST → cria/atualiza { entityType, entitySlug, email, active? }

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import {
  getPortalAccount,
  upsertPortalAccount,
  type PortalAccount,
} from "@/lib/portal-auth";
import type { PlanEntityType } from "@/lib/plan-periods";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const secret = process.env.AUTH_SECRET;
  if (!token || !secret) return null;
  return verifySessionToken(token, secret);
}

function publicAccount(a: PortalAccount) {
  return {
    entityType: a.entityType,
    entitySlug: a.entitySlug,
    email: a.email,
    active: a.active,
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
  };
}

export async function GET(req: Request) {
  if (!(await requireAdmin())) return new NextResponse(null, { status: 401 });

  const url = new URL(req.url);
  const entityType = url.searchParams.get("entityType") as PlanEntityType | null;
  const entitySlug = url.searchParams.get("entitySlug")?.trim() ?? "";
  if (!entityType || !["partner", "agency"].includes(entityType) || !entitySlug) {
    return NextResponse.json({ error: "params" }, { status: 400 });
  }

  const acc = await getPortalAccount(entityType, entitySlug);
  return NextResponse.json({ account: acc ? publicAccount(acc) : null });
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return new NextResponse(null, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const entityType = body.entityType as PlanEntityType;
  const entitySlug = typeof body.entitySlug === "string" ? body.entitySlug.trim() : "";
  const email = typeof body.email === "string" ? body.email : "";
  if (!["partner", "agency"].includes(entityType) || !entitySlug) {
    return NextResponse.json({ error: "entity inválida" }, { status: 400 });
  }

  try {
    const account = await upsertPortalAccount({
      entityType,
      entitySlug,
      email,
      active: body.active === false ? false : true,
    });
    return NextResponse.json({ account: publicAccount(account) });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
