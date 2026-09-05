// Filepath: lib/i18n/obrigado.ts
// Parte do dicionário i18n — copy da página de confirmação pós-submit (/obrigado).
// Recriada no foco Compras PY: produto único de roteiro de compras em Ciudad del Este.

import type { Locale } from "./config";

export interface ObrigadoUI {
  eyebrow: string;
  title: string;
  subtitle: string;
  resumoLabel: string;
  ctaCompras: string;
  ctaHome: string;
  footer: string;
}

export const OBRIGADO_UI: Record<Locale, ObrigadoUI> = {
  pt: {
    eyebrow: "Pedido recebido",
    title: "Recebemos o seu pedido",
    subtitle:
      "Um especialista em Ciudad del Este revisa as suas escolhas e entra em contato com as condições e a melhor ordem para o seu dia de compras.",
    resumoLabel: "O que você pediu",
    ctaCompras: "Ver roteiro de compras",
    ctaHome: "Voltar para o início",
    footer: "Enquanto isso, pode ir organizando a lista do que não pode faltar.",
  },
  en: {
    eyebrow: "Request received",
    title: "We received your request",
    subtitle:
      "A specialist in Ciudad del Este reviews your choices and gets in touch with the conditions and the best order for your shopping day.",
    resumoLabel: "What you asked for",
    ctaCompras: "See the shopping guide",
    ctaHome: "Back to home",
    footer: "Meanwhile, you can start working on your must-buy list.",
  },
  es: {
    eyebrow: "Solicitud recibida",
    title: "Recibimos tu solicitud",
    subtitle:
      "Un especialista en Ciudad del Este revisa tus elecciones y se comunica contigo con las condiciones y el mejor orden para tu día de compras.",
    resumoLabel: "Lo que pediste",
    ctaCompras: "Ver la guía de compras",
    ctaHome: "Volver al inicio",
    footer: "Mientras tanto, puedes ir armando tu lista de lo que no puede faltar.",
  },
};