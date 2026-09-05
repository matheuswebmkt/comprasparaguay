// Filepath: app/api/admin/plan-period/route.ts
// POST actions: start_renew | interrupt_grace | pause | resume

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import {
  startOrRenewPlan,
  interruptGraceNow,
  pausePlan,
  resumePlan,
  parseBrlToCents,
  PLAN_PERIODS_TAG,
  type PlanEntityType,
} from "@/lib/plan-periods";
import { NICHE_SETTINGS_TAG } from "@/lib/niche-settings";
import { ACTIVE_AGENCY_TAG } from "@/lib/agencies";
import { OFFER_CONFIG_TAG } from "@/lib/offer-settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function adminEmail(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const secret = process.env.AUTH_SECRET;
  if (!token || !secret) return null;
  return verifySessionToken(token, secret);
}

function revalidatePlanSurfaces() {
  revalidateTag(PLAN_PERIODS_TAG);
  revalidateTag(NICHE_SETTINGS_TAG);
  revalidateTag(ACTIVE_AGENCY_TAG);
  revalidateTag(OFFER_CONFIG_TAG);
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
  if (!["partner", "agency"].includes(entityType) || !entitySlug) {
    return new NextResponse(null, { status: 400 });
  }

  const actionRaw = typeof body.action === "string" ? body.action : "start_renew";
  const action =
    actionRaw === "interrupt_grace" || actionRaw === "pause" || actionRaw === "resume"
      ? actionRaw
      : "start_renew";
  const note = typeof body.note === "string" ? body.note : null;

  try {
    if (action === "interrupt_grace") {
      const period = await interruptGraceNow({ entityType, entitySlug, note, createdBy: email });
      revalidatePlanSurfaces();
      return NextResponse.json({ period, action });
    }
    if (action === "pause") {
      const period = await pausePlan({ entityType, entitySlug, note, createdBy: email });
      revalidatePlanSurfaces();
      return NextResponse.json({ period, action });
    }
    if (action === "resume") {
      const period = await resumePlan({ entityType, entitySlug, note, createdBy: email });
      revalidatePlanSurfaces();
      return NextResponse.json({ period, action });
    }

    const templateSlug =
      typeof body.templateSlug === "string" && body.templateSlug.trim()
        ? body.templateSlug.trim()
        : null;

    let amountCents: number | null | undefined = undefined;
    if (body.amountCents === null) {
      amountCents = null;
    } else if (typeof body.amountCents === "number" && Number.isFinite(body.amountCents)) {
      amountCents = Math.max(0, Math.round(body.amountCents));
    } else if (typeof body.amountBrl === "string") {
      const t = body.amountBrl.trim();
      amountCents = t === "" ? null : parseBrlToCents(t);
      if (t !== "" && amountCents === null) {
        return NextResponse.json({ error: "Valor inválido" }, { status: 400 });
      }
    }

    const period = await startOrRenewPlan({
      entityType,
      entitySlug,
      templateSlug,
      amountCents,
      note,
      createdBy: email,
    });
    revalidatePlanSurfaces();
    return NextResponse.json({ period, action });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
