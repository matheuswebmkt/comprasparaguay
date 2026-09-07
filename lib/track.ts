// Filepath: lib/track.ts
// Version: 1.3
// Última mudança: "chaves locais rgf_* → cp_* (vocabulário do satélite de origem — D9; domínio novo, custo zero)"
// Nome da Versão: "Batching client-side: eventos ficam em memória e vão ao /api/track em lote"
// Baseado na Versão: 1.1
//
// Batching (jul/2026): reduz o custo de compute do Neon — em vez de 1 request por evento (pageview/clique),
// acumula em memória e manda em LOTE a cada FLUSH_INTERVAL_MS (ou ao atingir MAX_BATCH, ou ao sair da
// página). `visitorId`/`sessionId` vão UMA vez por lote (no payload raiz), não repetidos por evento.

import type { UtmParams } from "./utm";

const VISITOR_KEY = "cp_vid";
const SESSION_KEY = "cp_sid";

function uid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function getStored(storage: Storage, key: string): string {
  let v = storage.getItem(key);
  if (!v) {
    v = uid();
    storage.setItem(key, v);
  }
  return v;
}

/** ID anônimo persistente (sem PII). */
export function getVisitorId(): string {
  try {
    return getStored(window.localStorage, VISITOR_KEY);
  } catch {
    return "anon";
  }
}

/** ID de sessão (expira ao fechar a aba). */
export function getSessionId(): string {
  try {
    return getStored(window.sessionStorage, SESSION_KEY);
  } catch {
    return "anon";
  }
}

export interface TrackInput {
  type: "pageview" | "cta_click" | "impression";
  path?: string;
  ctaType?: string;
  itemSlug?: string;
  destination?: string;
  utm?: UtmParams;
}

const IMPRESSION_KEY = "cp_imp";

/**
 * Registra a IMPRESSÃO de um parceiro no máximo UMA vez por sessão — não importa
 * quantos cards/seções dele apareçam nem em quantas páginas. O dedupe vive no
 * sessionStorage: repetições na mesma visita nem chegam a tocar a API/banco.
 * O banco guarda visitor_id + session_id, então o dashboard ainda deriva
 * "pessoas únicas × visitas × recorrência" das linhas.
 */
export function trackImpressionOnce(itemSlug: string, ctaType: string): void {
  if (typeof window === "undefined" || !itemSlug) return;
  try {
    const raw = window.sessionStorage.getItem(IMPRESSION_KEY);
    const seen: string[] = raw ? JSON.parse(raw) : [];
    if (seen.includes(itemSlug)) return; // já contamos este parceiro nesta sessão
    seen.push(itemSlug);
    window.sessionStorage.setItem(IMPRESSION_KEY, JSON.stringify(seen));
  } catch {
    /* se o storage falhar, seguimos e disparamos (melhor contar do que perder) */
  }
  track({ type: "impression", itemSlug, ctaType });
}

const FLUSH_INTERVAL_MS = 20_000; // 20s
const MAX_BATCH = 20;

let queue: TrackInput[] = [];
let listenersAttached = false;

function eventPayload(input: TrackInput) {
  return {
    type: input.type,
    path: input.path ?? (typeof window !== "undefined" ? window.location.pathname : undefined),
    ctaType: input.ctaType,
    itemSlug: input.itemSlug,
    destination: input.destination,
    utmSource: input.utm?.source,
    utmMedium: input.utm?.medium,
    utmCampaign: input.utm?.campaign,
    utmContent: input.utm?.content,
    utmTerm: input.utm?.term,
  };
}

/**
 * Manda a fila inteira num único request (`sendBeacon`, com fallback `fetch keepalive`) e a esvazia.
 * No-op se vazia ou no server. Silencioso — tracking nunca quebra a navegação.
 */
function flush(): void {
  if (typeof window === "undefined" || queue.length === 0) return;
  const events = queue.map(eventPayload);
  queue = [];
  const payload = JSON.stringify({
    events,
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
  });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }));
    } else {
      void fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      });
    }
  } catch {
    /* tracking nunca quebra a navegação */
  }
}

/**
 * Registra os 3 gatilhos de flush (1× só, guardado por `listenersAttached`):
 * timer de FLUSH_INTERVAL_MS, `pagehide` (fechar aba/navegar embora) e `visibilitychange` p/ "hidden"
 * (mobile costuma nunca disparar `pagehide` antes de matar o processo — troca de app/minimizar já flusha).
 */
function ensureListeners(): void {
  if (listenersAttached || typeof window === "undefined") return;
  listenersAttached = true;
  window.setInterval(flush, FLUSH_INTERVAL_MS);
  window.addEventListener("pagehide", flush);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
  });
}

/**
 * Enfileira um evento (batching — ver cabeçalho do arquivo). Flusha na hora só se a fila atingir
 * `MAX_BATCH`; senão espera o próximo gatilho (timer/saída de página).
 */
export function track(input: TrackInput): void {
  if (typeof window === "undefined") return;
  ensureListeners();
  queue.push(input);
  if (queue.length >= MAX_BATCH) flush();
}
