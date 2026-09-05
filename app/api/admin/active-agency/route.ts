// Filepath: app/api/admin/active-agency/route.ts
// POST protegido (admin): define a AGÊNCIA ATIVA (leads + recomendação do nicho
// transfer) ou desativa todas. Body: { slug: string | null }.
// Devolve { activeAgency }. Revalida tag active-agency.

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { setActiveAgencySlug, ACTIVE_AGENCY_TAG } from "@/lib/agencies";
import { neutralizeAgencyOfferInSettings, OFFER_CONFIG_TAG } from "@/lib/offer-settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const secret = process.env.AUTH_SECRET;
  if (!token || !secret) return false;
  return (await verifySessionToken(token, secret)) !== null;
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return new NextResponse(null, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  let slug: string | null;
  if (body.slug === null || body.slug === undefined || body.slug === "") {
    slug = null;
  } else if (typeof body.slug === "string") {
    slug = body.slug.trim() || null;
  } else {
    return new NextResponse(null, { status: 400 });
  }

  try {
    await setActiveAgencySlug(slug);
    // Desativar → desliga "Definir agência" + transporte no editor de Oferta (não dá pra religar sem ativar).
    // ⛔ NÃO mexer aqui no toggle "Registrar leads no grupo (sem WhatsApp/botão)": ele é decisão do
    // admin e vale como está, inclusive um "Não" definido ANTES desta desativação (ver lib/offer-settings.ts).
    if (slug === null) await neutralizeAgencyOfferInSettings();
    revalidateTag(ACTIVE_AGENCY_TAG);
    revalidateTag(OFFER_CONFIG_TAG);
    return NextResponse.json({ activeAgency: slug });
  } catch {
    return new NextResponse(null, { status: 400 });
  }
}
