// Filepath: lib/i18n/obrigado.ts
// Parte do dicionário i18n — copy da página de confirmação pós-submit (/obrigado).
// Recriada no foco Compras PY: produto único de roteiro de compras em Ciudad del Este.

import type { Locale } from "./config";

export interface ObrigadoUI {
  eyebrow: string;
  title: string;
  subtitle: string;
  resumoLabel: string;
  /** Botão "Iniciar conversa" (wa.me) — mesmo CTA do modal, renderizado pela página de obrigado. */
  ctaWhats: string;
  ctaHome: string;
}

export const OBRIGADO_UI: Record<Locale, ObrigadoUI> = {
  pt: {
    eyebrow: "Pedido recebido",
    title: "Recebemos o seu pedido",
    subtitle:
      "Um especialista de Compras no Paraguai em Ciudad del Este revisa as suas escolhas e entra em contato com as condições para o seu dia de compras.",
    resumoLabel: "O que você pediu",
    ctaWhats: "Falar sobre minha reserva 💬",
    ctaHome: "Voltar para o início",
  },
  en: {
    eyebrow: "Request received",
    title: "We received your request",
    subtitle:
      "A Compras Paraguay specialist in Ciudad del Este reviews your choices and gets in touch with the conditions for your shopping day.",
    resumoLabel: "What you asked for",
    ctaWhats: "Talk about my booking 💬",
    ctaHome: "Back to home",
  },
  es: {
    eyebrow: "Solicitud recibida",
    title: "Recibimos tu solicitud",
    subtitle:
      "Un especialista de Compras Paraguay en Ciudad del Este revisa tus elecciones y se comunica contigo con las condiciones para tu día de compras.",
    resumoLabel: "Lo que pediste",
    ctaWhats: "Hablar sobre mi reserva 💬",
    ctaHome: "Volver al inicio",
  },
};
