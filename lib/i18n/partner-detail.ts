// Filepath: lib/i18n/partner-detail.ts
// Version: 1.0
// Nome da Versão: "Dicionário i18n do CHROME (UI fixa) de /[slug] (pt/en/es)"
//
// Cobre SÓ os rótulos/títulos fixos da página de detalhe do parceiro. Todo o conteúdo do parceiro em si
// (nome, tagline, description, features, highlights, hours, menu, serviceHighlight, closing, awards) é
// DADO (app/data/partners.ts) — fica intacto em qualquer idioma (fase futura, ver memória i18n-architecture).

import type { Locale } from "./config";

export interface PartnerDetailUI {
  breadcrumbHome: string;
  breadcrumbPillar: string;
  about: string;
  whyPrefix: string;
  highlights: string;
  hours: string;
  ctaDefault: string;
  whatsapp: string;
  ifood: string;
  website: string;
  instagram: string;
  facebook: string;
  call: string;
  viewOnMap: string;
  recognition: string;
  menuEyebrow: string;
  menuTitle: string;
  menuBodyBefore: string;
  menuBodyMiddle: string;
  menuBodyStrong: string;
  menuBodyAfter: string;
  menuCtaDefault: string;
  eventsBadge: string;
  eventsCtaDefault: string;
  backTitle: string;
  backBody: string;
  backCta: string;
}

export const PARTNER_DETAIL_UI: Record<Locale, PartnerDetailUI> = {
  pt: {
    breadcrumbHome: "Início",
    breadcrumbPillar: "Atrativos",
    about: "Sobre",
    whyPrefix: "Por que a",
    highlights: "Destaques",
    hours: "Funcionamento",
    ctaDefault: "Acessar",
    whatsapp: "WhatsApp",
    ifood: "Pedir no iFood",
    website: "Site oficial",
    instagram: "Instagram",
    facebook: "Facebook",
    call: "Ligar",
    viewOnMap: "Ver no mapa",
    recognition: "Reconhecimento",
    menuEyebrow: "Peça pra você",
    menuTitle: "Do nosso cardápio",
    menuBodyBefore: "Uma amostra do que a ",
    menuBodyMiddle: " prepara. O ",
    menuBodyStrong: "cardápio completo e sempre atualizado",
    menuBodyAfter: " fica a um clique no botão de pedido — é lá que você monta o seu.",
    menuCtaDefault: "Fazer meu pedido",
    eventsBadge: "Para eventos e festas",
    eventsCtaDefault: "Saiba mais no site",
    backTitle: "Queremos que o seu roteiro seja perfeito",
    backBody: "Reunimos num só lugar as nossas recomendações — onde comer, passear e o que vale a pena, sem cair em armadilha para turista.",
    backCta: "Ver todas as recomendações",
  },
  en: {
    breadcrumbHome: "Home",
    breadcrumbPillar: "Attractions",
    about: "About",
    whyPrefix: "Why",
    highlights: "Highlights",
    hours: "Hours",
    ctaDefault: "Visit",
    whatsapp: "WhatsApp",
    ifood: "Order on iFood",
    website: "Official website",
    instagram: "Instagram",
    facebook: "Facebook",
    call: "Call",
    viewOnMap: "View on map",
    recognition: "Recognition",
    menuEyebrow: "Order for yourself",
    menuTitle: "From our menu",
    menuBodyBefore: "A sample of what ",
    menuBodyMiddle: " prepares. The ",
    menuBodyStrong: "full, always up-to-date menu",
    menuBodyAfter: " is one click away on the order button — that's where you build yours.",
    menuCtaDefault: "Place my order",
    eventsBadge: "For events and parties",
    eventsCtaDefault: "Learn more on the site",
    backTitle: "We want your trip to be perfect",
    backBody: "We've gathered our recommendations in one place — where to eat, what to do and what's worth it, without falling into a tourist trap.",
    backCta: "See all recommendations",
  },
  es: {
    breadcrumbHome: "Inicio",
    breadcrumbPillar: "Atractivos",
    about: "Sobre",
    whyPrefix: "Por qué",
    highlights: "Destacados",
    hours: "Horario",
    ctaDefault: "Acceder",
    whatsapp: "WhatsApp",
    ifood: "Pedir por iFood",
    website: "Sitio oficial",
    instagram: "Instagram",
    facebook: "Facebook",
    call: "Llamar",
    viewOnMap: "Ver en el mapa",
    recognition: "Reconocimiento",
    menuEyebrow: "Pide el tuyo",
    menuTitle: "De nuestro menú",
    menuBodyBefore: "Una muestra de lo que ",
    menuBodyMiddle: " prepara. El ",
    menuBodyStrong: "menú completo y siempre actualizado",
    menuBodyAfter: " está a un clic en el botón de pedido — ahí armas el tuyo.",
    menuCtaDefault: "Hacer mi pedido",
    eventsBadge: "Para eventos y fiestas",
    eventsCtaDefault: "Saber más en el sitio",
    backTitle: "Queremos que tu viaje sea perfecto",
    backBody: "Reunimos en un solo lugar nuestras recomendaciones — dónde comer, pasear y qué vale la pena, sin caer en trampas para turistas.",
    backCta: "Ver todas las recomendaciones",
  },
};
