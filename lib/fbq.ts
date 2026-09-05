// Filepath: lib/fbq.ts
// Version: 1.1
// Nome da Versão: "Helper do Meta Pixel (fbq) — suporte a eventID (dedupe com CAPI)"
// Baseado na Versão: 1.0

/**
 * Dispara um evento no Meta Pixel, se o `fbq` estiver presente.
 * @param event Nome do evento (padrão Meta, ex: 'PageView', 'Lead'; ou custom).
 * @param params Parâmetros opcionais do evento.
 * @param type 'track' para eventos padrão; 'trackCustom' para eventos personalizados.
 * @param options Opções do Pixel — `eventID` casa o evento do browser com o da
 *                Conversions API (server-side) para o Meta deduplicar.
 */
export function fbqTrack(
  event: string,
  params?: Record<string, unknown>,
  type: "track" | "trackCustom" = "track",
  options?: { eventID?: string }
): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  if (params && options) window.fbq(type, event, params, options);
  else if (params) window.fbq(type, event, params);
  else window.fbq(type, event);
}
