// Filepath: lib/modal-track.ts
// Version: 1.0
// Nome da Versão: "Funil do modal — passos 1st-party (sendBeacon → /api/modal-track)"
//
// Espelha lib/track.ts, mas para o funil granular do TicketOfferModal: cada PASSO alcançado
// vira uma linha em `modal_events` (keyed por modal_id = UUID da abertura). Silencioso e
// não-bloqueante; no-op no servidor. Reusa os ids anônimos de lib/track (sem PII).

import { getSessionId, getVisitorId } from "./track";

/** Passos do funil (casa com o allowlist do /api/modal-track e a taxonomia do schema). */
export type ModalStep =
  | "open"
  | "offer_shown"
  | "q_local_yes"
  | "q_local_no"
  | "q_infoz_yes"
  | "q_infoz_no"
  | "offer_check"
  | "agency_check"
  | "transport_check"
  | "field_name"
  | "field_email"
  | "field_phone"
  | "submit"
  | "success"
  | "success_cta_shown"
  | "success_cta";

/** UUID por abertura do modal (dedupe/agrupamento do funil por-open). */
export function newModalId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export interface ModalTrackOpts {
  modalId: string;
  itemSlug?: string | null;
  ctaType?: string | null;
  pagePath?: string | null;
}

/**
 * Registra um passo do funil via sendBeacon (sobrevive a fechar a aba/navegar),
 * com fallback fetch keepalive. Sem `modalId` ou fora do browser → no-op.
 */
export function modalTrack(step: ModalStep, opts: ModalTrackOpts): void {
  if (typeof window === "undefined" || !opts.modalId) return;

  const payload = JSON.stringify({
    modalId: opts.modalId,
    step,
    itemSlug: opts.itemSlug ?? undefined,
    ctaType: opts.ctaType ?? undefined,
    path: opts.pagePath ?? window.location.pathname,
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
  });

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/modal-track", new Blob([payload], { type: "application/json" }));
    } else {
      void fetch("/api/modal-track", {
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
