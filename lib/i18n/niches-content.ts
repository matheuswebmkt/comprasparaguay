// Filepath: lib/i18n/niches-content.ts
// Version: 1.0
// Nome da Versão: "Conteúdo visível das páginas de nicho (transfer) — en/es"
//
// O `pt` é a matriz e vive em `app/data/niches.ts`; aqui só en/es (consumidores usam
// `NICHES_CONTENT[locale][slug] ?? niche`). Os 6 nichos de gastronomia não têm página própria
// (vivem no hub /onde-comer, cujo conteúdo está em lib/i18n/onde-comer.ts) — não entram aqui.

import type { Locale } from "./config";

export interface NicheBulletI18n {
  icon?: string;
  title: string;
  text: string;
}

export interface NicheSectionI18n {
  eyebrow?: string;
  heading: string;
  headingDestaque?: string;
  paragraphs: string[];
  bullets?: NicheBulletI18n[];
  closing?: string;
}

export interface NicheContentI18n {
  eyebrow: string;
  h1: string;
  h1Destaque: string;
  heroLead: string[];
  /** Rótulo do CTA do hero (âncora interna #recomendacao), por nicho.
   *  Presente só no nicho dedicado (transfer), que usam hero com CTA. */
  heroCta?: string;
  /** Substantivo do nicho (para interpolação do título do FAQ). */
  nicheNoun: string;
  /** Chrome da página de nicho. */
  faqEyebrow: string;
  faqTitle: (noun: string) => string;
  heroHubLabel: string;
  verAtrativosLabel: string;
  /** Slot de recomendação — empty state (sem parceiro/hotel/agência ativos). */
  recEyebrow: string;
  recComingTitle: (noun: string) => string;
  recComingBody: string;
  sections: NicheSectionI18n[];
  faq: { q: string; a: string }[];
}

const EN = {
  faqEyebrow: "Frequently asked questions",
  faqTitle: (noun: string) => `Questions about ${noun} in Foz do Iguaçu`,
  verAtrativosLabel: "See Foz attractions",
  recEyebrow: "Our team's pick",
  recComingTitle: (noun: string) => `Our ${noun} recommendation is on its way`,
  recComingBody:
    "Our team is testing the best places in this segment in Foz do Iguaçu. Soon, we'll reveal our exclusive Official Recommendation here — hand-picked for your itinerary.",
};

const ES = {
  faqEyebrow: "Preguntas frecuentes",
  faqTitle: (noun: string) => `Dudas sobre ${noun} en Foz do Iguaçu`,
  verAtrativosLabel: "Ver atractivos de Foz",
  recEyebrow: "La elección de nuestro equipo",
  recComingTitle: (noun: string) => `Nuestra recomendación de ${noun} está en camino`,
  recComingBody:
    "Nuestro equipo está probando los mejores establecimientos de este segmento en Foz do Iguaçu. Pronto revelaremos aquí nuestra Recomendación Oficial exclusiva — elegida a dedo para tu itinerario.",
};

export const NICHES_CONTENT: Record<Locale, Record<string, NicheContentI18n>> = {
  // pt é a matriz: fallback no dado (app/data/niches.ts).
  pt: {},
  en: {
    transfer: {
      eyebrow: "Transfer · Foz do Iguaçu",
      h1: "Tours and itineraries without the hassle",
      h1Destaque: "without the hassle",
      heroLead: [
        "Foz do Iguaçu's attractions are incredible, but they're spread across a region that crosses borders. Without organization, it's easy to lose time, tickets or the best time of day at each place.",
      ],
      heroCta: "See transfer",
      nicheNoun: "transfer",
      ...EN,
      heroHubLabel: "See what to do in Foz do Iguaçu",
      sections: [
        {
          eyebrow: "How to choose",
          heading: "What a good transfer offers",
          headingDestaque: "transfer",
          paragraphs: [
            "Not every transfer is the same. The best combine punctuality, comfortable vehicles and transparency — you know exactly what you're hiring, with no hidden fees. Experienced drivers and real knowledge of the region make all the difference in the quality of the ride.",
          ],
          bullets: [
            { icon: "ShieldCheck", title: "Transparency", text: "Clear prices before boarding: you know what you hired from start to finish, with no surprise at the end." },
            { icon: "Users", title: "Fits your itinerary", text: "Arrival time, the day's attraction, group, family or couple: the transfer adapts to your pace." },
            { icon: "Star", title: "Drivers who know", text: "Those who drive in Foz know the Falls' peak hours and the best route to each attraction." },
          ],
          closing:
            "It's worth checking the reputation, route coverage (from the Falls to the less obvious outings) and support during the ride. A reliable transfer anticipates unexpected events and adapts the program to your pace — whether as a family, a couple or a group.",
        },
      ],
      faq: [
        {
          q: "Is it worth hiring a transfer in Foz do Iguaçu?",
          a: "For most visitors, yes. The attractions are spread across a region that crosses borders, and a transfer solves transport between the hotel and each outing, saving time and avoiding headaches. Our team's recommendation on this page prioritizes punctual, reliable local operators.",
        },
        {
          q: "How much does a transfer in Foz do Iguaçu cost?",
          a: "The price varies by distance, time and group size. Many operators offer conditions that already include round-trip transport to the attractions, which tends to be more practical. The ideal is to check the conditions directly with the recommended operator.",
        },
        {
          q: "What is a local operator (receptivo) in Foz do Iguaçu?", // copy-ok — FAQ definicional do termo de busca (§21.6)
          a: "A receptivo is the local agency that welcomes the traveler and organizes the stay: airport and hotel transfers, guided tours and itineraries around the region. It's who takes care of your on-the-ground experience, from the start to the end of your stay.", // copy-ok — resposta definicional do mesmo termo
        },
        {
          q: "Which attractions in Foz does the transfer take you to?",
          a: "The classics are the Falls on the Brazilian and Argentine sides, Itaipu, the Bird Park and the Triple Frontier Landmark, plus shopping in Paraguay. Good operators also help fit Macuco Safari, Duty Free, the Fair and themed leisure into the itinerary.",
        },
        {
          q: "Does the transfer help organize the itinerary for my days in Foz?",
          a: "Yes. A good operator puts together a fluid program, fitting the big attractions by day and late-afternoon experiences — like the Triple Frontier Landmark — to crown the outing without you worrying about transport and schedules.",
        },
      ],
    },
  },
  es: {
    transfer: {
      eyebrow: "Transfer · Foz do Iguaçu",
      h1: "Paseos e itinerarios sin complicaciones",
      h1Destaque: "sin complicaciones",
      heroLead: [
        "Los atractivos de Foz do Iguaçu son increíbles, pero están distribuidos por una región que cruza fronteras. Sin organización, es fácil perder tiempo, entrada o el mejor horario de cada lugar.",
      ],
      heroCta: "Ver transfer",
      nicheNoun: "transfer",
      ...ES,
      heroHubLabel: "Ver qué hacer en Foz do Iguaçu",
      sections: [
        {
          eyebrow: "Cómo elegir",
          heading: "Lo que ofrece un buen transfer",
          headingDestaque: "transfer",
          paragraphs: [
            "No todo transfer es igual. Los mejores unen puntualidad, vehículos cómodos y transparencia — sabes exactamente lo que contratas, sin tarifas ocultas. Conductores experimentados y conocimiento real de la región hacen toda la diferencia en la calidad del paseo.",
          ],
          bullets: [
            { icon: "ShieldCheck", title: "Transparencia", text: "Valores claros antes de embarcar: sabes lo que contrataste de principio a fin, sin sorpresas al final." },
            { icon: "Users", title: "Se ajusta a tu itinerario", text: "Horario de llegada, atractivo del día, grupo, familia o pareja: el transfer se adapta a tu ritmo." },
            { icon: "Star", title: "Conductores que conocen", text: "Quien maneja en Foz conoce los horarios pico de las Cataratas y el mejor camino para cada atractivo." },
          ],
          closing:
            "Vale revisar la reputación, la cobertura de rutas (de las Cataratas a los paseos menos obvios) y el soporte durante el paseo. Un transfer confiable se anticipa a los imprevistos y adapta el programa a tu ritmo — sea en familia, en pareja o en grupo.",
        },
      ],
      faq: [
        {
          q: "¿Vale la pena contratar transfer en Foz do Iguaçu?",
          a: "Para la mayoría de los visitantes, sí. Los atractivos están repartidos por una región que cruza fronteras, y el transfer resuelve el transporte entre el hotel y cada paseo, ahorrando tiempo y evitando dolores de cabeza. La recomendación de nuestro equipo en esta página prioriza operadores locales puntuales y confiables.",
        },
        {
          q: "¿Cuánto cuesta un transfer en Foz do Iguaçu?",
          a: "El valor varía según la distancia, el horario y el tamaño del grupo. Muchos operadores ofrecen condiciones que ya incluyen el transporte de ida y vuelta a los atractivos, lo que suele ser más práctico. Lo ideal es consultar las condiciones directamente con el operador recomendado.",
        },
        {
          q: "¿Qué es un operador local en Foz do Iguaçu?", // copy-ok — FAQ definicional do termo de busca (§21.6); o nome do serviço local é "receptivo", termo banido na prosa
          a: "Es la agencia local que recibe al turista y organiza la estadía: transfers del aeropuerto y del hotel, paseos guiados e itinerarios por la región. Es quien cuida tu experiencia en tierra, de principio a fin de la estadía.",
        },
        {
          q: "¿A qué atractivos de Foz lleva el transfer?",
          a: "Los clásicos son las Cataratas del lado brasileño y argentino, Itaipú, el Parque de las Aves y el Marco de las Tres Fronteras, además de las compras en Paraguay. Los buenos operadores también ayudan a encajar Macuco Safari, Duty Free, la Feria y el ocio temático en el itinerario.",
        },
        {
          q: "¿El transfer ayuda a organizar el itinerario de mis días en Foz?",
          a: "Sí. Un buen operador arma un programa fluido, encajando los grandes atractivos de día y las experiencias de final de tarde — como el Marco de las Tres Fronteras — para coronar el paseo sin que te preocupes por el transporte y los horarios.",
        },
      ],
    },
  },
};

// =============================================================================
// Seção EXCLUSIVA do /transfer — atrativos mais pedidos no transfer.
// Os 3 primeiros são atrativos reais (slug abaixo) e reaproveitam a i18n de atrativo
// (CARD_LABELS/ATTRACTION_NAMES + ATTRACTIONS_I18N); aqui entram só o cabeçalho da seção
// e o card exclusivo (Aeroporto / check-in e check-out no hotel), que não tem página própria
// e por isso NÃO vai para o array global `attractions`.
// =============================================================================

export interface TransferAtrativosI18n {
  eyebrow: string;
  title: string;
  subtitle: string;
}

/** Slugs dos 4 atrativos exibidos na seção (todos com página própria). */
export const TRANSFER_ATRATIVOS_SLUGS = [
  "compras-paraguai-ciudad-del-este",
  "by-night-argentina-puerto-iguazu",
  "duty-free-shop-puerto-iguazu-argentina",
  "shopping-catuai-palladium",
] as const;

export const TRANSFER_ATRATIVOS: Record<Locale, TransferAtrativosI18n> = {
  pt: {
    eyebrow: "Transfer na Tríplice Fronteira",
    title: "Os principais transfers mais buscados",
    subtitle:
      "Das compras no Paraguai à noite argentina e ao trajeto de chegada: o que quase todo mundo resolve com um transfer em Foz.",
  },
  en: {
    eyebrow: "Transfer in the Triple Frontier",
    title: "The most sought-after transfers",
    subtitle:
      "From the Paraguay shopping to the Argentine nightlife and the arrival route: what most people sort out with a transfer in Foz.",
  },
  es: {
    eyebrow: "Transfer en la Triple Frontera",
    title: "Los principales traslados más buscados",
    subtitle:
      "De las compras en Paraguay a la noche argentina y el trayecto de llegada: lo que casi todos resuelven con un traslado en Foz.",
  },
};

// =============================================================================
// Card de recomendação do /transfer — versão PRÓPRIA do Compras Paraguay (sem agência).
// Substitui o card da agência no nicho `transfer`: imagem de van neutra + identidade do
// site, título "Transfers e Transporte turístico" (sem nome da agência) e CTA que abre o
// WhatsApp diretamente (número fixo + mensagem pronta). 
// =============================================================================

export interface TransferPitchI18n {
  eyebrow: string;
  title: string;
  description: string;
  tags: string[];
  cta: string;
  /** Mensagem pré-preenchida do wa.me (por idioma). */
  message: string;
}

export const TRANSFER_PITCH: Record<Locale, TransferPitchI18n> & {
  /** Número do WhatsApp (formato internacional, sem `+`). */
  whatsapp: string;
  /** Imagem de van neutra com identidade visual do site (asset a fornecer). */
  cover: string;
  /** Slug interno p/ tracking de impressão/CTA deste card. */
  itemSlug: string;
} = {
  whatsapp: "5545999245153",
  cover: "/images/transfer/cover.webp",
  itemSlug: "roteiro-foz-transfer",
  pt: {
    eyebrow: "TURISMO NA TRÍPLICE FRONTEIRA",
    title: "Transfers e Transporte turístico",
    description:
      "Especialistas em Foz do Iguaçu, Paraguai e Argentina — transfers e passeios pela Tríplice Fronteira sem complicação.",
    tags: ["Turismo privativo", "Transfers", "Tríplice Fronteira"],
    cta: "Conversar no WhatsApp",
    message:
      "Olá! Vim pelo site da Compras Paraguay e quero mais informações sobre o transfer em Foz do Iguaçu.",
  },
  en: {
    eyebrow: "TOURISM IN THE TRIPLE FRONTIER",
    title: "Transfers and tourist transport",
    description:
      "Specialists in Foz do Iguaçu, Paraguay and Argentina — transfers and tours across the Triple Frontier, without the hassle.",
    tags: ["Private tourism", "Transfers", "Triple Frontier"],
    cta: "Chat on WhatsApp",
    message:
      "Hi! I came from the Compras Paraguay website and I'd like more information about the transfer in Foz do Iguaçu.",
  },
  es: {
    eyebrow: "TURISMO EN LA TRIPLE FRONTERA",
    title: "Traslados y transporte turístico",
    description:
      "Especialistas en Foz do Iguaçu, Paraguay y Argentina — traslados y paseos por la Triple Frontera sin complicaciones.",
    tags: ["Turismo privado", "Traslados", "Triple Frontera"],
    cta: "Hablar por WhatsApp",
    message:
      "¡Hola! Vengo del sitio de Compras Paraguay y quiero más información sobre el traslado en Foz do Iguaçu.",
  },
};
