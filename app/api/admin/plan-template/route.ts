// Filepath: app/api/admin/plan-template/route.ts
// GET: lista templates de plano
// POST: cria ou atualiza template (slug, name, description, defaultDays, amount, grace, active)

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import {
  listPlanTemplates,
  upsertPlanTemplate,
  parseBrlToCents,
  PLAN_PERIODS_TAG,
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

function numOrUndef(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v))) return Number(v);
  return undefined;
}

export async function GET() {
  const email = await adminEmail();
  if (!email) return new NextResponse(null, { status: 401 });
  const templates = await listPlanTemplates(true);
  return NextResponse.json({ templates });
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

  const slug = typeof body.slug === "string" ? body.slug : "";
  const name = typeof body.name === "string" ? body.name : "";
  if (!slug.trim() || !name.trim()) {
    return NextResponse.json({ error: "slug e name são obrigatórios" }, { status: 400 });
  }

  const description = typeof body.description === "string" ? body.description : null;
  const defaultDays = numOrUndef(body.defaultDays);
  const defaultGraceDays = numOrUndef(body.defaultGraceDays);
  const active = body.active === false ? false : true;

  let defaultAmountCents: number | null | undefined = undefined;
  if (body.defaultAmountCents === null) {
    defaultAmountCents = null;
  } else if (typeof body.defaultAmountCents === "number" && Number.isFinite(body.defaultAmountCents)) {
    defaultAmountCents = Math.max(0, Math.round(body.defaultAmountCents));
  } else if (typeof body.defaultAmountBrl === "string") {
    const t = body.defaultAmountBrl.trim();
    defaultAmountCents = t === "" ? null : parseBrlToCents(t);
    if (t !== "" && defaultAmountCents === null) {
      return NextResponse.json({ error: "Valor padrão inválido" }, { status: 400 });
    }
  }

  try {
    const template = await upsertPlanTemplate({
      slug,
      name,
      description,
      defaultDays,
      defaultAmountCents,
      defaultGraceDays,
      active,
    });
    revalidateTag(PLAN_PERIODS_TAG);
    return NextResponse.json({ template });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
