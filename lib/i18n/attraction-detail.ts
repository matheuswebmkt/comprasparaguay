// Filepath: lib/i18n/attraction-detail.ts
// Version: 2.1
// Nome da Versão: "CTA Comprar ingresso — captura de lead (não sai do site)"

import type { Locale } from "./config";

export interface AttractionDetailUI {
  breadcrumbHome: string;
  breadcrumbIndex: string;
  /** Eyebrow do hero — rótulo de tema acima do H1. */
  eyebrow: string;
  about: string;
  highlights: string;
  /** CTA principal = intenção de compra (modal → agência). */
  ctaDefault: string;
  /** CTA de atrativo SEM link de ingresso ("Tem link - NÃO" no admin — lugar/experiência pública, não
   * negócio com venda): "Reservar data" em vez de "Comprar ingresso". */
  ctaNoLink: string;
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
    eyebrow: "Atrativo · Foz do Iguaçu",
    about: "Sobre",
    highlights: "Destaques",
    ctaDefault: "Comprar ingresso",
    ctaNoLink: "Reservar data",
    addressLabel: "Endereço",
    faqTitle: "Perguntas frequentes",
    faqEyebrow: "Dúvidas comuns",
  },
  en: {
    breadcrumbHome: "Home",
    breadcrumbIndex: "Foz attractions",
    eyebrow: "Attraction · Foz do Iguaçu",
    about: "About",
    highlights: "Highlights",
    ctaDefault: "Buy tickets",
    ctaNoLink: "Reserve a date",
    addressLabel: "Address",
    faqTitle: "Frequently asked questions",
    faqEyebrow: "Common questions",
  },
  es: {
    breadcrumbHome: "Inicio",
    breadcrumbIndex: "Atractivos de Foz",
    eyebrow: "Atractivo · Foz do Iguaçu",
    about: "Sobre",
    highlights: "Destacados",
    ctaDefault: "Comprar entrada",
    ctaNoLink: "Reservar fecha",
    addressLabel: "Dirección",
    faqTitle: "Preguntas frecuentes",
    faqEyebrow: "Dudas comunes",
  },
};
