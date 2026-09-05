import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { getPartnerBySlug } from "@/app/data/partners";
import { togglePartnerEnabled, PARTNER_SETTINGS_TAG } from "@/lib/partner-settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const secret = process.env.AUTH_SECRET;
  if (!token || !secret) return false;
  return (await verifySessionToken(token, secret)) !== null;
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await isAdmin())) return new NextResponse(null, { status: 401 });

  const { slug } = await params;
  if (!getPartnerBySlug(slug)) return new NextResponse(null, { status: 404 });

  try {
    const enabled = await togglePartnerEnabled(slug);
    revalidateTag(PARTNER_SETTINGS_TAG); // regenera as páginas que exibem parceiros ativos
    return NextResponse.json({ enabled });
  } catch {
    return new NextResponse(null, { status: 500 });
  }
}
