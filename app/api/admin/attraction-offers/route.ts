// Filepath: app/api/admin/attraction-offers/route.ts
// POST protegido (admin): salva "Ingresso por atrativo" (Modo/Tem link/URL) em
// attraction_offer_settings. Body: { offers: Array<{ slug, hasLink?, mode?, officialUrl? }> }.
// Ao salvar, revalida a tag `offer-config` (a config assada no HTML estático inclui as
// configs públicas por atrativo).

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { saveAttractionOffers, type AttractionOfferInput } from "@/lib/attraction-offers";
import { OFFER_CONFIG_TAG } from "@/lib/offer-settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const secret = process.env.AUTH_SECRET;
  if (!token || !secret) return false;
  return (await verifySessionToken(token, secret)) !== null;
}

const str = (v: unknown): string | null => (typeof v === "string" ? v : null);

export async function POST(req: Request) {
  if (!(await isAdmin())) return new NextResponse(null, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const raw = Array.isArray(body.offers) ? body.offers : [];
  const inputs: AttractionOfferInput[] = [];
  for (const o of raw) {
    if (!o || typeof o !== "object") continue;
    const r = o as Record<string, unknown>;
    if (typeof r.slug !== "string") continue;

    inputs.push({
      slug: r.slug,
      hasLink: typeof r.hasLink === "boolean" ? r.hasLink : undefined,
      mode: r.mode === "agency" ? "agency" : r.mode === "direct" ? "direct" : undefined,
      officialUrl: str(r.officialUrl),
    });
  }

  try {
    await saveAttractionOffers(inputs);
    revalidateTag(OFFER_CONFIG_TAG);
    return NextResponse.json({ ok: true });
  } catch {
    return new NextResponse(null, { status: 500 });
  }
}
