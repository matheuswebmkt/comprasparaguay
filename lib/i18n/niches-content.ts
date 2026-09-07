// Filepath: lib/i18n/niches-content.ts
// Version: 1.7
// Nome da Versão: "Cluster só tem transfer — espelho en/es reduzido a ele"
//
// O `pt` é a matriz e vive em `app/data/niches.ts`; aqui só en/es (consumidores usam
// `NICHES_CONTENT[locale][slug] ?? niche`). O cluster tem só o transfer — não há mais o que espelhar.

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
      eyebrow: "Transfer · Shopping on the Frontier",
      h1: "Shopping in Paraguay without the hassle",
      h1Destaque: "without the hassle",
      heroLead: [
        "With a transfer/private car, you cross at the right time and come back with your purchases without stress.",
      ],
      heroCta: "See transfer",
      nicheNoun: "transfer",
      ...EN,
      heroHubLabel: "See the shopping guides",
      sections: [
        {
          eyebrow: "How to choose",
          heading: "What a good shopping transfer offers",
          headingDestaque: "transfer",
          paragraphs: [
            "Not every transfer is the same. The best combine punctuality, comfortable vehicles and transparency — you know exactly what you're hiring, with no hidden fees. Experienced drivers know the border hours and the right route so you don't miss the morning shopping in Ciudad del Este.",
          ],
          bullets: [
            { icon: "ShieldCheck", title: "Transparency", text: "Clear prices before boarding: you know what you hired from start to finish, with no surprise at the end." },
            { icon: "Users", title: "Fits your shopping plan", text: "The bridge crossing, the duty free hours, the malls and the way back with your bags: the transfer adapts to your day." },
            { icon: "Star", title: "Drivers who know the border", text: "Those who drive in Foz know the Friendship Bridge's peak hours and the best route to each shopping stop." },
          ],
          closing:
            "It's worth checking the reputation, route coverage (from the airport to Ciudad del Este, the duty free and the malls) and support during the ride. A reliable transfer anticipates border surprises and adapts the program to your pace — as a family, a couple or a group.",
        },
      ],
      faq: [
        {
          q: "Is it worth hiring a transfer for shopping on the Triple Frontier?",
          a: "For those heading to Ciudad del Este or the duty free, yes. The border has hours, queues and crossings that change your day, and a transfer handles transport from the hotel to the destination and back with your purchases, saving time and avoiding headaches. Our team's recommendation on this page prioritizes punctual, reliable local operators.",
        },
        {
          q: "How much does a transfer in Foz do Iguaçu cost?",
          a: "The price varies by distance, time and group size. Many operators offer conditions that already include round-trip transport to the shopping destination, which tends to be more practical. The ideal is to check the conditions directly with the recommended operator.",
        },
        {
          q: "What is a local operator (receptivo) in Foz do Iguaçu?", // copy-ok — FAQ definicional do termo de busca (§21.6)
          a: "A receptivo is the local agency that welcomes the traveler and organizes the stay: airport and hotel transfers, guided tours and itineraries around the region. It's who takes care of your on-the-ground experience, from the start to the end of your stay.", // copy-ok — resposta definicional do mesmo termo
        },
        {
          q: "Where does the transfer take you for shopping?",
          a: "The border's shopping stops: Ciudad del Este (right after the Friendship Bridge), the Duty Free of Puerto Iguazú and the malls Cataratas JL and Catuaí Palladium in Foz. Good operators also help fit the Argentine night out at By Night into the same plan.",
        },
        {
          q: "Does the transfer help organize my shopping days in Foz?",
          a: "Yes. A good operator puts together a fluid program, fitting Ciudad del Este in the morning (while stores are open), the duty free in mid-afternoon and the Argentine night at By Night — without you worrying about transport and schedules.",
        },
      ],
    },
  },
  es: {
    transfer: {
      eyebrow: "Transfer · Compras en la Frontera",
      h1: "Compras en Paraguay sin complicaciones",
      h1Destaque: "sin complicaciones",
      heroLead: [
        "Con un traslado/auto privado, cruzas en el momento justo y vuelves con las compras sin estrés.",
      ],
      heroCta: "Ver transfer",
      nicheNoun: "transfer",
      ...ES,
      heroHubLabel: "Ver las guías de compras",
      sections: [
        {
          eyebrow: "Cómo elegir",
          heading: "Lo que ofrece un buen transfer de compras",
          headingDestaque: "transfer",
          paragraphs: [
            "No todo transfer es igual. Los mejores unen puntualidad, vehículos cómodos y transparencia — sabes exactamente lo que contratas, sin tarifas ocultas. Conductores experimentados conocen los horarios de la frontera y la ruta correcta para no perder la mañana de compras en Ciudad del Este.",
          ],
          bullets: [
            { icon: "ShieldCheck", title: "Transparencia", text: "Valores claros antes de embarcar: sabes lo que contrataste de principio a fin, sin sorpresas al final." },
            { icon: "Users", title: "Se ajusta a tu plan de compras", text: "El cruce del puente, el horario del duty free, los shoppings y la vuelta con las bolsas: el transfer se adapta a tu día." },
            { icon: "Star", title: "Conductores que conocen la frontera", text: "Quien maneja en Foz conoce los horarios pico del Puente de la Amistad y el mejor camino para cada destino de compras." },
          ],
          closing:
            "Vale revisar la reputación, la cobertura de rutas (del aeropuerto a Ciudad del Este, el duty free y los shoppings) y el soporte durante el paseo. Un transfer confiable se anticipa a los imprevistos de la frontera y adapta el programa a tu ritmo — en familia, en pareja o en grupo.",
        },
      ],
      faq: [
        {
          q: "¿Vale la pena contratar transfer para las compras en la Triple Frontera?",
          a: "Para quien va a comprar a Ciudad del Este o al duty free, sí. La frontera tiene horarios, filas y cruces que cambian tu día, y el transfer resuelve el transporte del hotel al destino y la vuelta con las compras, ahorrando tiempo y evitando dolores de cabeza. La recomendación de nuestro equipo en esta página prioriza operadores locales puntuales y confiables.",
        },
        {
          q: "¿Cuánto cuesta un transfer en Foz do Iguaçu?",
          a: "El valor varía según la distancia, el horario y el tamaño del grupo. Muchos operadores ofrecen condiciones que ya incluyen el transporte de ida y vuelta al destino de compras, lo que suele ser más práctico. Lo ideal es consultar las condiciones directamente con el operador recomendado.",
        },
        {
          q: "¿Qué es un operador local en Foz do Iguaçu?", // copy-ok — FAQ definicional do termo de busca (§21.6); o nome do serviço local é "receptivo", termo banido na prosa
          a: "Es la agencia local que recibe al turista y organiza la estadía: transfers del aeropuerto y del hotel, paseos guiados e itinerarios por la región. Es quien cuida tu experiencia en tierra, de principio a fin de la estadía.",
        },
        {
          q: "¿A dónde lleva el transfer para las compras?",
          a: "A los destinos de compras de la frontera: Ciudad del Este (justo después del Puente de la Amistad), el Duty Free de Puerto Iguazú y los shoppings Cataratas JL y Catuaí Palladium, en Foz. Los buenos operadores también ayudan a encajar la noche argentina en el By Night en el mismo plan.",
        },
        {
          q: "¿El transfer ayuda a organizar mis días de compras en Foz?",
          a: "Sí. Un buen operador arma un programa fluido, encajando Ciudad del Este por la mañana (mientras el comercio está abierto), el duty free a media tarde y la noche argentina en el By Night — sin que te preocupes por el transporte y los horarios.",
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
    title: "Os destinos de compra mais buscados na Tríplice Fronteira",
    subtitle:
      "Ciudad del Este, Puerto Iguazú e mais",
  },
  en: {
    eyebrow: "Transfer in the Triple Frontier",
    title: "The most sought-after shopping destinations in the Triple Frontier",
    subtitle:
      "Ciudad del Este, Puerto Iguazú and more",
  },
  es: {
    eyebrow: "Transfer en la Triple Frontera",
    title: "Los destinos de compras más buscados en la Triple Frontera",
    subtitle:
      "Ciudad del Este, Puerto Iguazú y más",
  },
};

// =============================================================================
// Card de recomendação do /transfer — versão PRÓPRIA do Compras Paraguay (sem agência).
// Substitui o card da agência no nicho `transfer`: imagem de van neutra + identidade do
// site, título "Transfers e Transporte turístico" (sem nome da agência). O CTA abre o MODAL de
// reserva (v2.0 do `TransferPitchCard`) — por isso não há mais número de WhatsApp nem mensagem
// pré-preenchida aqui: o que o lead recebe é a captura da data, e o contato vem depois, humano. 
// =============================================================================

export interface TransferPitchI18n {
  eyebrow: string;
  title: string;
  description: string;
  tags: string[];
}

export const TRANSFER_PITCH: Record<Locale, TransferPitchI18n> & {
  /** Imagem de van neutra com identidade visual do site (asset a fornecer). */
  cover: string;
  /** Slug interno p/ tracking de impressão/CTA deste card. */
  itemSlug: string;
} = {
  cover: "/images/transfer/cover.webp",
  itemSlug: "compras-paraguay-transfer",
  pt: {
    eyebrow: "COMPRAS NA TRÍPLICE FRONTEIRA",
    title: "Transfers e privativos para suas compras no Paraguai",
    description:
      "Guias especialistas em Foz do Iguaçu, Paraguai e Argentina — visite Ciudad del Este, Puerto Iguazú, Duty Free e mais na Tríplice Fronteira.",
    tags: ["Roteiro de compras", "Transfers", "Tríplice Fronteira"],
  },
  en: {
    eyebrow: "SHOPPING IN THE TRIPLE FRONTIER",
    title: "Transfers and private cars for your shopping in Paraguay",
    description:
      "Specialist guides in Foz do Iguaçu, Paraguay and Argentina — visit Ciudad del Este, Puerto Iguazú, the duty free and more in the Triple Frontier.",
    tags: ["Shopping plan", "Transfers", "Triple Frontier"],
  },
  es: {
    eyebrow: "COMPRAS EN LA TRIPLE FRONTERA",
    title: "Traslados y autos privados para tus compras en Paraguay",
    description:
      "Guías especialistas en Foz do Iguaçu, Paraguay y Argentina — visita Ciudad del Este, Puerto Iguazú, el Duty Free y más en la Triple Frontera.",
    tags: ["Plan de compras", "Traslados", "Triple Frontera"],
  },
};
