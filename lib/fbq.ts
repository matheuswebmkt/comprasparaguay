// Filepath: lib/fbq.ts
// Version: 1.2
// Nome da Versão: "Helper do Meta Pixel (fbq) — buffer pós-aceite + eventID (dedupe com CAPI)"
// Baseado na Versão: 1.1

import { hasCookieConsent } from "./cookie-consent";

/**
 * Chamadas de `fbq` pendentes: o consentimento JÁ foi dado, mas o script do Pixel ainda não subiu.
 * O Pixel é montado por `next/script` no aceite, e o `InitiateCheckout` dispara de um modal
 * lazy-loaded — a corrida existe de verdade. Enfileirar aqui garante que o evento não se perca.
 *
 * ⚠️ Só entra na fila com consentimento concedido. Sem consentimento, o evento é DESCARTADO:
 *    bufferizar evento pré-aceite e despejá-lo depois seria coletar dado sem base legal.
 */
const pending: Array<() => void> = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function flushPending(): void {
  const calls = pending.splice(0);
  for (const call of calls) call();
}

function scheduleFlush(): void {
  if (flushTimer !== null) return;
  let tries = 0;
  const tick = () => {
    if (typeof window === "undefined") {
      flushTimer = null;
      return;
    }
    if (typeof window.fbq === "function") {
      flushTimer = null;
      flushPending();
      return;
    }
    if (++tries >= 40) {
      // ~2s sem o Pixel subir: desiste e descarta — melhor perder do que vazar depois.
      flushTimer = null;
      pending.length = 0;
      return;
    }
    flushTimer = setTimeout(tick, 50);
  };
  flushTimer = setTimeout(tick, 50);
}

/**
 * Dispara um evento no Meta Pixel, se o `fbq` estiver presente.
 *
 * Se o pixel ainda não subiu mas o consentimento já foi concedido, o evento é enfileirado e
 * disparado assim que `fbq` aparecer (ver `scheduleFlush`). Sem consentimento, é no-op.
 *
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
  if (typeof window === "undefined") return;

  const fire = () => {
    if (typeof window.fbq !== "function") return;
    if (params && options) window.fbq(type, event, params, options);
    else if (params) window.fbq(type, event, params);
    else window.fbq(type, event);
  };

  if (typeof window.fbq === "function") {
    fire();
    return;
  }

  // Sem pixel ainda: só enfileira se o aceite já existe (o Pixel está a caminho).
  if (hasCookieConsent()) {
    pending.push(fire);
    scheduleFlush();
  }
}
