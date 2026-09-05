// Filepath: app/api/admin/plan-notes/route.ts
// GET  ?entityType=&entitySlug=&scope=period|entity  → lista notas
// POST { entityType, entitySlug, scope: "period"|"entity", body, visibility? }

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import {
  listPeriodNotes,
  addPeriodNote,
  listEntityNotes,
  addEntityNote,
  getPlanPeriod,
  PLAN_PERIODS_TAG,
  type PlanEntityType,
  type NoteVisibility,
} from "@/lib/plan-periods";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function adminEmail(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const secret = process.env.AUTH_SECRET;
  if (!token || !secret) return null;
  return verifySessionToken(token, secret);
}

export async function GET(req: Request) {
  if (!(await adminEmail())) return new NextResponse(null, { status: 401 });

  const url = new URL(req.url);
  const entityType = url.searchParams.get("entityType") as PlanEntityType | null;
  const entitySlug = url.searchParams.get("entitySlug")?.trim() ?? "";
  const scope = url.searchParams.get("scope") === "entity" ? "entity" : "period";
  if (!entityType || !["partner", "agency"].includes(entityType) || !entitySlug) {
    return NextResponse.json({ error: "params" }, { status: 400 });
  }

  if (scope === "entity") {
    const notes = await listEntityNotes(entityType, entitySlug);
    return NextResponse.json({ notes });
  }

  const period = await getPlanPeriod(entityType, entitySlug);
  const notes = await listPeriodNotes(entityType, entitySlug, {
    periodStart: period?.periodStart ?? null,
    includeAdmin: true,
  });
  return NextResponse.json({
    notes,
    legacyNote: period?.notes ?? null,
    periodStart: period?.periodStart ?? null,
  });
}

export async function POST(req: Request) {
  const email = await adminEmail();
  if (!email) return new NextResponse(null, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const entityType = body.entityType as PlanEntityType;
  const entitySlug = typeof body.entitySlug === "string" ? body.entitySlug.trim() : "";
  const text = typeof body.body === "string" ? body.body : "";
  const scope = body.scope === "entity" ? "entity" : "period";
  if (!["partner", "agency"].includes(entityType) || !entitySlug) {
    return NextResponse.json({ error: "entity inválida" }, { status: 400 });
  }

  try {
    if (scope === "entity") {
      const note = await addEntityNote({
        entityType,
        entitySlug,
        body: text,
        createdBy: email,
      });
      revalidateTag(PLAN_PERIODS_TAG);
      return NextResponse.json({ note });
    }

    const visibility: NoteVisibility = body.visibility === "admin" ? "admin" : "shared";
    const note = await addPeriodNote({
      entityType,
      entitySlug,
      body: text,
      visibility,
      createdBy: email,
    });
    revalidateTag(PLAN_PERIODS_TAG);
    return NextResponse.json({ note });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
