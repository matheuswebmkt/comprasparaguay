// Filepath: lib/i18n/obrigado.ts
// Parte do dicionário i18n — copy da página de confirmação pós-submit (/obrigado).
// Recriada no foco Compras PY: produto único de roteiro de compras em Ciudad del Este.

import type { Locale } from "./config";

export interface ObrigadoUI {
  title: string;
  subtitle: string;
  /** Link de texto para a página pública do pedido (/r/<token>) — só aparece com token no handoff. */
  verResumo: string;
  /** Botão "Iniciar conversa" (wa.me) — mesmo CTA do modal, renderizado pela página de obrigado
   *  quando o modo de sucesso é "Iniciar conversa" (ou no fallback de dedup). */
  ctaWhats: string;
  ctaHome: string;
}

export const OBRIGADO_UI: Record<Locale, ObrigadoUI> = {
  pt: {
    title: "Recebemos o seu pedido",
    subtitle:
      "É só aguardar um momento. Um especialista de Compras no Paraguai em Ciudad del Este vai te chamar no WhatsApp com as condições deste pedido.",
    verResumo: "Ver resumo",
    ctaWhats: "Falar sobre minha reserva 💬",
    ctaHome: "Voltar para o início",
  },
  en: {
    title: "We received your request",
    subtitle:
      "Just wait a moment. A Compras Paraguay specialist in Ciudad del Este will message you on WhatsApp with the conditions for this request.",
    verResumo: "See summary",
    ctaWhats: "Talk about my booking 💬",
    ctaHome: "Back to home",
  },
  es: {
    title: "Recibimos tu solicitud",
    subtitle:
      "Solo espera un momento. Un especialista de Compras Paraguay en Ciudad del Este te escribirá por WhatsApp con las condiciones de este pedido.",
    verResumo: "Ver resumen",
    ctaWhats: "Hablar sobre mi reserva 💬",
    ctaHome: "Volver al inicio",
  },
};
