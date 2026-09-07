// Filepath: app/api/track/route.ts
// Version: 3.2
// Nome da Versão: "/transfer vira allowlist EXPLÍCITA; caem PARTNER_PATHS/NICHE_PATHS e a regex /roteiros/*"
// Baseado na Versão: 3.1

import { NextRequest, NextResponse } from "next/server";
import { recordEvents, EVENT_TYPES, type EventType, type TrackPayload } from "@/lib/events";
import { isSameOriginRequest } from "@/lib/same-origin";

// Teto de segurança por request (não o tamanho normal — MAX_BATCH em lib/track.ts é 20; aqui sobra folga
// sem abrir espaço pra flood de um client malicioso mandando um lote gigante).
const MAX_EVENTS_PER_REQUEST = 50;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX = 512;
const clip = (v: unknown, n = MAX): string | null =>
  typeof v === "string" && v.length > 0 ? v.slice(0, n) : null;

// Só rastreamos paths que são rotas REAIS do site (derruba probes de bot tipo /cmd_sco).
// ⚠️ Ao criar uma nova rota estática, adicione-a AQUI. A allowlist é a única autoridade: rota fora
// dela é ignorada em silêncio (204) — sem erro, sem log, só um dashboard sem aquela página.
// ⚠️ `/transfer` estava antes só de rebote: entrava porque o slug do nicho era idêntico à rota, e
//    um slug de URL muda por SEO enquanto a rota continua a mesma — o vertical de transporte
//    (carro-chefe do pixel: D1) pararia de gravar pageview, clique E impression sem ninguém ver.
//    Lista explícita elimina essa dependência acidental.
// ⚠️ `/obrigado` fica fora de propósito: é confirmação noindex, e o que ali importa é medido no
//    funil do modal (`modal_events`), não como página.
const STATIC_PATHS = new Set([
  "/",
  "/roteiros-de-compras",
  "/transfer",
  "/triplice-fronteira",
  "/sobre",
  "/aviso-legal",
  "/contato",
]);
function isTrackablePath(p: unknown): p is string {
  if (typeof p !== "string" || !p.startsWith("/")) return false;
  if (STATIC_PATHS.has(p)) return true;
  // Página individual de destino de compra (`app/data/attractions.ts` → 5 slugs).
  if (/^\/roteiros-de-compras\/[a-z0-9-]+$/.test(p)) return true;
  return false;
}

export async function POST(req: NextRequest) {
  // Defesa: a requisição precisa vir do próprio site — fonte única em lib/same-origin.ts (hostname EXATO).
  if (!isSameOriginRequest(req)) return new NextResponse(null, { status: 403 });

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  // Lote (jul/2026): `body.events[]` no lugar de um evento solto. Teto de
  // segurança contra flood — o client normal nunca manda mais que MAX_BATCH (20, ver lib/track.ts).
  const rawEvents = Array.isArray(body.events) ? body.events.slice(0, MAX_EVENTS_PER_REQUEST) : [];
  if (rawEvents.length === 0) return new NextResponse(null, { status: 204 });

  // Campos compartilhados do lote inteiro — computados 1× fora do loop (visitorId/sessionId vêm no corpo
  // raiz do lote, não repetidos por evento; referrer/userAgent/geo vêm dos headers da própria request HTTP).
  const visitorId = clip(body.visitorId, 64);
  const sessionId = clip(body.sessionId, 64);
  const referrerHeader = clip(req.headers.get("referer"), 1024);
  const userAgent = clip(req.headers.get("user-agent"), 512);
  const country = clip(req.headers.get("x-vercel-ip-country"), 8);
  // Geo do Vercel (presente em produção; ausente em dev → null).
  let city: string | null = null;
  try {
    const c = req.headers.get("x-vercel-ip-city");
    city = c ? decodeURIComponent(c) : null;
  } catch {
    city = clip(req.headers.get("x-vercel-ip-city"), 80);
  }
  city = clip(city, 80);

  const events: TrackPayload[] = [];
  for (const raw of rawEvents) {
    if (!raw || typeof raw !== "object") continue;
    const e = raw as Record<string, unknown>;
    const type = e.type;
    if (typeof type !== "string" || !EVENT_TYPES.includes(type as EventType)) continue;
    // Allowlist de path: ignora silenciosamente qualquer rota inexistente (ruído de bot) — por evento.
    const path = clip(e.path);
    if (!isTrackablePath(path)) continue;
    events.push({
      type: type as EventType,
      path,
      ctaType: clip(e.ctaType),
      itemSlug: clip(e.itemSlug),
      destination: clip(e.destination, 1024),
      utmSource: clip(e.utmSource),
      utmMedium: clip(e.utmMedium),
      utmCampaign: clip(e.utmCampaign),
      utmContent: clip(e.utmContent),
      utmTerm: clip(e.utmTerm),
      referrer: referrerHeader,
      userAgent,
      country,
      city,
      visitorId,
      sessionId,
    });
  }
  if (events.length === 0) return new NextResponse(null, { status: 204 });

  try {
    await recordEvents(events);
  } catch (err) {
    if (process.env.NODE_ENV === "development") console.error("track error:", err);
    // Nunca quebra a navegação do usuário por falha de tracking.
    return new NextResponse(null, { status: 202 });
  }

  return new NextResponse(null, { status: 204 });
}
