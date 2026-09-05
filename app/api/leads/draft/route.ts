// Filepath: app/api/leads/draft/route.ts
// POST — captura SILENCIOSA de abandono (jul/2026 — ver
// conventions/funil-modal.md §2-bis/§17): grava nome/email/
// WhatsApp de quem preencheu contato no modal mas fechou/saiu SEM clicar no envio final. `leads.abandoned =
// true` — NUNCA roteado ao Telegram/agência (sem CAPI, sem notificação); é só dado interno pra recuperação de
// contato depois (e pra unificação com o submit real, ver app/api/leads/route.ts).
//
// Disparado via `navigator.sendBeacon` (mesmo padrão de lib/track.ts → /api/track) no fechar do modal
// (X/backdrop/Escape) e no `pagehide` (fechar aba/navegar embora) — ver TicketOfferModal.tsx `fireAbandonBeacon`.
// ⚠️ sendBeacon não permite desafio interativo → SEM Turnstile aqui (mitigado por same-origin + honeypot +
// rate-limit, mesmas camadas do /api/leads).

import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { getSql } from "@/lib/db";
import { isSameOriginRequest } from "@/lib/same-origin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Mesmos valores de app/api/leads/route.ts — rate limit só vale pra uma linha NOVA (ver abaixo), então não
// precisa ser a MESMA instância de contagem, só a mesma janela/teto.
const RATE_LIMIT_WINDOW_MIN = 15;
const RATE_LIMIT_MAX = 3;

const hashIp = (ip: string | null): string | null =>
  ip ? crypto.createHash("sha256").update(ip).digest("hex") : null;

const MAX = 256;
const clip = (v: unknown, n = MAX): string | null =>
  typeof v === "string" && v.trim().length > 0 ? v.trim().slice(0, n) : null;
// Calendário (D5/D6) — mesmo padrão de app/api/leads/route.ts.
const clipDate = (v: unknown): string | null =>
  typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null;
const clipQty = (v: unknown): number | null => {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) ? Math.min(999, Math.max(1, Math.trunc(n))) : null;
};

export async function POST(req: NextRequest) {
  // Mesma defesa do /api/track e /api/leads: exige mesma-origem (sendBeacon inclui origin/referer
  // normalmente) — fonte única em lib/same-origin.ts (hostname EXATO).
  if (!isSameOriginRequest(req)) return new NextResponse(null, { status: 403 });
  const referer = req.headers.get("referer");

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  // Honeypot: mesmo padrão do /api/leads — preenchido = bot → dropa em silêncio.
  if (typeof body.honeypot === "string" && body.honeypot.trim().length > 0) {
    return new NextResponse(null, { status: 204 });
  }

  const nome = clip(body.nome, 80);
  const whatsapp = clip(body.whatsapp);
  const email = clip(body.email, 160);
  const visitorId = clip(body.visitorId, 64);
  const sessionId = clip(body.sessionId, 64);

  // Qualificação/transporte/roteiro já respondidos antes do abandono (mesmas colunas do /api/leads — ver
  // conventions §2/§15/§20). Em "form-first" o contato costuma vir com essa qualificação já respondida.
  const asBoolOrNull = (v: unknown): boolean | null => (v === true ? true : v === false ? false : null);
  const isLocal = asBoolOrNull(body.isLocal);
  const alreadyInFoz = asBoolOrNull(body.alreadyInFoz);
  // TRI-STATE, igual ao /api/leads (`true` quer · `false` recusou · `null` não perguntado). Aqui o
  // rascunho não tem como consultar a config, então respeita o que o cliente informou: só vira booleano
  // quando houve resposta de verdade. Nunca coagir para `false` — ver o comentário no /api/leads.
  const wantsTransport = asBoolOrNull(body.wantsTransport);
  const visitDate = clipDate(body.visitDate);
  const ticketQty = clipQty(body.ticketQty);

  // Contexto do lead (jul/2026) — mesma derivação do /api/leads (nunca confia isso pronto do cliente sem clip).
  const leadContext = clip(body.leadContext, 32); // "atrativo" | "roteiro" | "ingresso"
  const roteiroSlug = clip(body.roteiroSlug, 80);
  const roteiroTitulo = clip(body.roteiroTitulo, 160);
  const itemSlug = clip(body.itemSlug, 128);
  const ctaType = clip(body.ctaType, 64);
  // Assinatura estável do produto — MESMA regra de app/api/leads/route.ts e lib/known-lead.ts.
  const productSignature =
    leadContext === "atrativo"
      ? `atrativo:${itemSlug ?? "generic"}`
      : leadContext === "roteiro"
        ? `roteiro:${roteiroSlug ?? "personalizar"}`
        : "ingresso:generic";

  // Consolidado (ver conventions §17): grava com QUALQUER sinal de engajamento — não exige telefone completo
  // (a qualificação sozinha já vale a pena recuperar). "Abriu e não fez nada" continua de fora de propósito
  // (nenhum sinal aqui) — sacrificado, vira aproximação no funil.
  const hasSignal =
    (!!nome && nome.length >= 2) || !!whatsapp || !!email || isLocal !== null || wantsTransport !== null || !!visitDate;
  if (!hasSignal) {
    return new NextResponse(null, { status: 204 });
  }

  const clientIp =
    clip(req.headers.get("x-forwarded-for")?.split(",")[0], 64) ??
    clip(req.headers.get("x-real-ip"), 64);
  const ipHash = hashIp(clientIp);

  const sql = getSql();
  if (!sql) return new NextResponse(null, { status: 204 });

  // Garante as colunas usadas aqui (idempotente — mesmo padrão defensivo de app/api/leads/route.ts, cobre um
  // deploy que ainda não rodou `pnpm db:migrate`/db/schema.sql).
  try {
    await sql`alter table leads add column if not exists abandoned boolean not null default false`;
    await sql`alter table leads add column if not exists product_signature text`;
    await sql`alter table leads add column if not exists visit_date date`;
    await sql`alter table leads add column if not exists ticket_qty int`;
    // Rascunho pode salvar só com nome (sem telefone ainda) — relaxa o NOT NULL herdado (idempotente).
    await sql`alter table leads alter column whatsapp drop not null`;
  } catch (err) {
    if (process.env.NODE_ENV === "development") console.error("leads/draft ensure columns error:", err);
  }

  // Reaproveita o MESMO rascunho em vez de inserir uma linha nova a cada abrir/fechar do modal na mesma
  // sessão (a mesma visita) — sem isso, alguém que abre/fecha/reabre repetidas vezes come o rate limit de
  // anti-abuso sozinho, e o envio REAL dele, mais pra frente, pode ser descartado em silêncio. Janela de 6h:
  // cobre uma visita longa sem grudar num rascunho de uma sessão anterior antiga.
  let existingId: number | null = null;
  if (sessionId) {
    try {
      const existing = (await sql`
        select id from leads
        where abandoned = true and session_id = ${sessionId}
          and created_at > now() - interval '6 hours'
        order by created_at desc limit 1
      `) as { id: number }[];
      existingId = existing[0]?.id ?? null;
    } catch (err) {
      if (process.env.NODE_ENV === "development") console.error("leads/draft lookup error:", err);
    }
  }

  // Rate limit só vale pra uma linha NOVA — atualizar um rascunho que já existe não deve contar de novo.
  if (!existingId) {
    try {
      const recent = (await sql`
        select count(*)::int as n from leads
        where created_at > now() - make_interval(mins => ${RATE_LIMIT_WINDOW_MIN})
          and ((visitor_id is not null and visitor_id = ${visitorId}) or (ip_hash is not null and ip_hash = ${ipHash}))
      `) as { n: number }[];
      if ((recent[0]?.n ?? 0) >= RATE_LIMIT_MAX) {
        return new NextResponse(null, { status: 204 });
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") console.error("leads/draft rate-limit check error:", err);
    }
  }

  let city: string | null = null;
  try {
    const c = req.headers.get("x-vercel-ip-city");
    city = c ? decodeURIComponent(c).slice(0, 80) : null;
  } catch {
    city = clip(req.headers.get("x-vercel-ip-city"), 80);
  }
  const country = clip(req.headers.get("x-vercel-ip-country"), 8);
  const userAgent = clip(req.headers.get("user-agent"), 512);
  const locale = ["pt", "en", "es"].includes(body.locale as string) ? (body.locale as string) : null;

  try {
    if (existingId) {
      // Atualiza o MESMO rascunho (snapshot mais recente vence) — não conta como um novo abandono.
      await sql`
        update leads set
          nome = ${nome}, email = ${email}, whatsapp = ${whatsapp}, cta_type = ${ctaType},
          is_local = ${isLocal}, already_in_foz = ${alreadyInFoz}, wants_transport = ${wantsTransport},
          lead_context = ${leadContext}, roteiro_slug = ${roteiroSlug}, roteiro_titulo = ${roteiroTitulo},
          visit_date = ${visitDate}, ticket_qty = ${ticketQty},
          product_signature = ${productSignature}
        where id = ${existingId}
      `;
    } else {
      await sql`
        insert into leads (
          nome, email, whatsapp, cta_type, lgpd_consent,
          page_path, session_id, visitor_id,
          utm_source, utm_medium, utm_campaign, utm_content, utm_term,
          country, city, referrer, user_agent, locale, ip_hash, abandoned,
          is_local, already_in_foz, wants_transport, lead_context, roteiro_slug, roteiro_titulo,
          visit_date, ticket_qty, product_signature
        ) values (
          ${nome}, ${email}, ${whatsapp}, ${ctaType}, ${true},
          ${clip(body.pagePath)}, ${sessionId}, ${visitorId},
          ${clip(body.utmSource)}, ${clip(body.utmMedium)}, ${clip(body.utmCampaign)},
          ${clip(body.utmContent)}, ${clip(body.utmTerm)},
          ${country}, ${city}, ${clip(referer, 1024)}, ${userAgent}, ${locale}, ${ipHash}, ${true},
          ${isLocal}, ${alreadyInFoz}, ${wantsTransport}, ${leadContext}, ${roteiroSlug}, ${roteiroTitulo},
          ${visitDate}, ${ticketQty}, ${productSignature}
        )
      `;
    }
  } catch (err) {
    if (process.env.NODE_ENV === "development") console.error("leads/draft insert error:", err);
  }

  return new NextResponse(null, { status: 204 });
}
