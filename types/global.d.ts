// Filepath: types/global.d.ts
// Version: 2.0
// Nome da Versão: "Tipagem do Meta Pixel (window.fbq) — GTM removido"
// Baseado na Versão: 1.2

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
    dataLayer?: Record<string, unknown>[];
    // Cloudflare Turnstile (anti-bot do modal) — presente após carregar o script api.js.
    turnstile?: {
      render: (
        el: HTMLElement | string,
        opts: {
          sitekey: string;
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          theme?: "auto" | "light" | "dark";
          size?: "normal" | "compact" | "flexible";
        },
      ) => string;
      remove: (id: string) => void;
      reset: (id?: string) => void;
    };
  }
}

export {};
