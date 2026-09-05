// Filepath: app/api/modal-track/route.ts
// Version: 1.0
// Nome da Versão: "Ingestão do funil do modal (modal_events) — same-origin + allowlist de step"
//
// Rota DEDICADA do funil do TicketOfferModal (não polui a tabela `events` nem os totais de cta_click).
// Mesmo endurecimento do /api/track: same-origin + validação. No-op sem DB; nunca quebra o usuário.

import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { isSameOriginRequest } from "@/lib/same-origin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Allowlist dos passos (casa com ModalStep em lib/modal-track.ts e o schema).
const STEPS = new Set([
  "open",
  "offer_shown",
  "q_local_yes",
  "q_local_no",
  "q_infoz_yes",
  "q_infoz_no",
  "offer_check",
  "agency_check",
  "transport_check",
  "field_name",
  "field_email",
  "field_phone",
  "submit",
  "success",
  "success_cta_shown",
  "success_cta",
]);

const clip = (v: unknown, n = 256): string | null =>
  typeof v === "string" && v.trim().length > 0 ? v.trim().slice(0, n) : null;

export async function POST(req: NextRequest) {
  // Defesa: precisa vir do próprio site — fonte única em lib/same-origin.ts (hostname EXATO).
  if (!isSameOriginRequest(req)) return new NextResponse(null, { status: 403 });

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const step = body.step;
  const modalId = clip(body.modalId, 64);
  if (typeof step !== "string" || !STEPS.has(step) || !modalId) {
    return new NextResponse(null, { status: 400 });
  }

  const sql = getSql();
  if (!sql) return new NextResponse(null, { status: 204 }); // no-op sem DB

  try {
    // Rede de segurança p/ ambiente novo (espelha o /api/leads). Migração real: pnpm db:migrate.
    await sql`
      create table if not exists modal_events (
        id          bigserial primary key,
        modal_id    text        not null,
        step        text        not null,
        item_slug   text,
        cta_type    text,
        page_path   text,
        visitor_id  text,
        session_id  text,
        created_at  timestamptz not null default now()
      )
    `;
    await sql`
      insert into modal_events (modal_id, step, item_slug, cta_type, page_path, visitor_id, session_id)
      values (
        ${modalId}, ${step}, ${clip(body.itemSlug, 64)}, ${clip(body.ctaType, 64)},
        ${clip(body.path, 256)}, ${clip(body.visitorId, 64)}, ${clip(body.sessionId, 64)}
      )
    `;
  } catch (err) {
    if (process.env.NODE_ENV === "development") console.error("modal-track error:", err);
    return new NextResponse(null, { status: 202 });
  }

  return new NextResponse(null, { status: 204 });
}
