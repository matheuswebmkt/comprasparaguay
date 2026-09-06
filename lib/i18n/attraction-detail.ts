// Filepath: lib/i18n/attraction-detail.ts
// Version: 2.3
// Nome da Versão: "Eyebrow do destino: 'Destino · …' ("Atrativo" era legado de ingresso)"

import type { Locale } from "./config";

export interface AttractionDetailUI {
  breadcrumbHome: string;
  breadcrumbIndex: string;
  /** Eyebrow do hero — rótulo de tema acima do H1. */
  eyebrow: string;
  about: string;
  highlights: string;
  /** CTA principal = reservar o dia. ⚠️ Rótulo ÚNICO: não existe mais "Comprar ingresso" — nenhum
   * atrativo do catálogo vende ingresso, todos abrem a captura de reserva de data (v3.0 do
   * `offer-defaults.ts`). Os mesmos 3 textos vivem em `SHARED_UI.roteirosCta.ctaReserva`: um PT, uma
   * tradução por idioma (§21.8-6) — trocou aqui, troca lá. */
  ctaReserva: string;
  // ⛔ NÃO reintroduzir um `ctaHint` sob o CTA. O anterior dizia "Condições com a agência parceira
  // no WhatsApp — ingressos e transfers sem sair do Compras Paraguay" e violava §21 duas vezes: nomeava
  // o CANAL antes do envio (§21.2) e a AGÊNCIA PARCEIRA na nossa voz (§21.5). Removido em
  // 08/08/2026. O que a jornada faz depois do clique é assunto do modal, não do sidebar.
  /** Rótulo do endereço em texto plano (sem link externo). */
  addressLabel: string;
  faqTitle: string;
  faqEyebrow: string;
}

export const ATTRACTION_DETAIL_UI: Record<Locale, AttractionDetailUI> = {
  pt: {
    breadcrumbHome: "Início",
    breadcrumbIndex: "Atrativos de Foz",
    eyebrow: "Destino · Foz do Iguaçu",
    about: "Sobre",
    highlights: "Destaques",
    ctaReserva: "Reservar data",
    addressLabel: "Endereço",
    faqTitle: "Perguntas frequentes",
    faqEyebrow: "Dúvidas comuns",
  },
  en: {
    breadcrumbHome: "Home",
    breadcrumbIndex: "Foz attractions",
    eyebrow: "Destination · Foz do Iguaçu",
    about: "About",
    highlights: "Highlights",
    ctaReserva: "Reserve a date",
    addressLabel: "Address",
    faqTitle: "Frequently asked questions",
    faqEyebrow: "Common questions",
  },
  es: {
    breadcrumbHome: "Inicio",
    breadcrumbIndex: "Atractivos de Foz",
    eyebrow: "Destino · Foz do Iguaçu",
    about: "Sobre",
    highlights: "Destacados",
    ctaReserva: "Reservar fecha",
    addressLabel: "Dirección",
    faqTitle: "Preguntas frecuentes",
    faqEyebrow: "Dudas comunes",
  },
};
