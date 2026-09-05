// Filepath: components/ticket-offer/TurnstileWidget.tsx
// Version: 1.0
// Nome da Versão: "Widget Cloudflare Turnstile (anti-bot) — render/remove no ciclo do modal"
"use client";

import { useEffect, useRef } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/** Turnstile ligado? (site key presente). Usado pelo modal p/ exigir o token e carregar o script. */
export const TURNSTILE_ENABLED = Boolean(SITE_KEY);

/**
 * Renderiza o widget do Turnstile e devolve o token via `onToken` (null ao expirar/erro).
 * No-op sem `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. Espera o script (`window.turnstile`) via polling curto.
 * Como o modal desmonta ao fechar, o widget é recriado a cada abertura (token sempre fresco).
 */
export default function TurnstileWidget({ onToken }: { onToken: (t: string | null) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cbRef = useRef(onToken);
  cbRef.current = onToken;

  useEffect(() => {
    if (!SITE_KEY) return;
    let widgetId: string | undefined;
    let poll: ReturnType<typeof setInterval> | undefined;

    const render = (): boolean => {
      if (!containerRef.current || !window.turnstile) return false;
      widgetId = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        theme: "light",
        callback: (t: string) => cbRef.current(t),
        "error-callback": () => cbRef.current(null),
        "expired-callback": () => cbRef.current(null),
      });
      return true;
    };

    if (!render()) {
      poll = setInterval(() => { if (render()) clearInterval(poll); }, 200);
    }

    return () => {
      if (poll) clearInterval(poll);
      if (widgetId && window.turnstile) { try { window.turnstile.remove(widgetId); } catch { /* noop */ } }
    };
  }, []);

  if (!SITE_KEY) return null;
  return <div ref={containerRef} className="flex justify-center" />;
}
