// Filepath: lib/cookie-consent.ts
// Version: 1.0
// Nome da Versão: "Consentimento de cookies próprio (sem CMP externo) — gate do Meta Pixel/GTM"
// Baseado na Versão: N/A

const STORAGE_KEY = "rgf_cookie_consent";
/** Disparado no `window` quando o consentimento é concedido — avisa quem já montou (ex: ConsentGate). */
export const COOKIE_CONSENT_EVENT = "rgf:cookie-consent-granted";

/** Já temos o aceite salvo desta sessão do navegador (localStorage — sobrevive entre visitas)? */
export function hasCookieConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false; // storage indisponível (modo privado/quota) — trata como sem consentimento ainda
  }
}

/** Grava o aceite e avisa quem estiver esperando (ex: MetaPixel/GTM liberarem sem precisar recarregar a página). */
export function grantCookieConsent(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // noop — sem storage, o aceite não persiste entre visitas, mas o banner some nesta sessão mesmo assim
  }
  window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
}
