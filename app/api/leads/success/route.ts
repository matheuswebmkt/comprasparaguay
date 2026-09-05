// Filepath: app/api/leads/success/route.ts
// POST — marca o CTA final da tela de sucesso (link direto do ingresso ou WhatsApp central) direto na linha
// do lead, em vez de um evento granular por clique (jul/2026 — ver
// conventions/funil-modal.md §17). O lead já existe (criado no
// /api/leads ou reaproveitado via skip-to-success); localiza por `modal_id`. Nunca cria lead novo, sem
// rate-limit (é uma atualização de um lead já existente e já protegido no /api/leads).
// Chamado por components/roteiros/LeadSuccessScreen.tsx.

import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { isSameOriginRequest } from "@/lib/same-origin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const clip = (v: unknown, n = 256): string | null =>
  typeof v === "string" && v.trim().length > 0 ? v.trim().slice(0, n) : null;

// Só os CTAs finais que existem hoje na LeadSuccessScreen (WhatsApp central / link direto do ingresso).
const CTA_TYPES = new Set(["modal_central_whatsapp", "modal_success_direct"]);

export async function POST(req: NextRequest) {
  if (!isSameOriginRequest(req)) return new NextResponse(null, { status: 403 });

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const modalId = clip(body.modalId, 64);
  const shown = body.shown === true;
  const clicked = body.clicked === true;
  const ctaType = typeof body.ctaType === "string" && CTA_TYPES.has(body.ctaType) ? body.ctaType : null;
  if (!modalId || (!shown && !clicked)) return new NextResponse(null, { status: 204 });

  const sql = getSql();
  if (!sql) return new NextResponse(null, { status: 204 });

  // Garante as colunas (idempotente — cobre um deploy que ainda não rodou `pnpm db:migrate`/db/schema.sql).
  try {
    await sql`alter table leads add column if not exists cta_shown boolean`;
    await sql`alter table leads add column if not exists cta_clicked boolean`;
    await sql`alter table leads add column if not exists success_cta_type text`;
  } catch (err) {
    if (process.env.NODE_ENV === "development") console.error("leads/success ensure columns error:", err);
  }

  try {
    if (clicked) {
      await sql`update leads set cta_shown = true, cta_clicked = true, success_cta_type = coalesce(${ctaType}, success_cta_type) where modal_id = ${modalId}`;
    } else {
      await sql`update leads set cta_shown = true, success_cta_type = coalesce(${ctaType}, success_cta_type) where modal_id = ${modalId}`;
    }
  } catch (err) {
    if (process.env.NODE_ENV === "development") console.error("leads/success error:", err);
    return new NextResponse(null, { status: 204 });
  }

  return new NextResponse(null, { status: 204 });
}
