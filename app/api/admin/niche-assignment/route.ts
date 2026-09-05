// Filepath: app/api/admin/niche-assignment/route.ts
// POST protegido (admin): define a "Recomendação Oficial" (parceiro exclusivo) de um NICHO.
// Body: { nicheKey: string, partnerSlug: string | null } — partnerSlug vazio/null = Empty State.
// Ao salvar, revalida a tag `niche-settings` → as páginas de nicho regeneram (sem redeploy). Ver conventions §14.

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { setNicheAssignment, NICHE_SETTINGS_TAG } from "@/lib/niche-settings";

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

  const nicheKey = typeof body.nicheKey === "string" ? body.nicheKey.trim() : "";
  if (!nicheKey) return new NextResponse(null, { status: 400 });
  // "" (ou ausente) = limpar a atribuição → Empty State.
  const partnerSlug =
    typeof body.partnerSlug === "string" && body.partnerSlug.trim() ? body.partnerSlug.trim() : null;

  try {
    await setNicheAssignment(nicheKey, partnerSlug);
    revalidateTag(NICHE_SETTINGS_TAG);
    return NextResponse.json({ nicheKey, partnerSlug });
  } catch {
    return new NextResponse(null, { status: 400 });
  }
}
