// Filepath: lib/seo.ts
// Version: 5.1
// Nome da Versão: "URL dos destinos sob /roteiros-de-compras e título-reserva sem 'ingresso'"
// Nome da Versão: "SEO absoluto — silos Foz (atrativos, gastronomia, fronteira) + helpers de metadata"
//
// Identidade SEO do domínio = Compras Paraguay como REFERÊNCIA sobre Foz do Iguaçu:
// atrativos, o que fazer, onde comer, Tríplice Fronteira e (quando prontos) roteiros.
// Pacotes são um produto — não o único eixo de ranking.

import type { Metadata } from "next";
import type { Partner, Attraction, Roteiro, PartnerCategory } from "@/app/types";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.comprasparaguay.online"
).replace(/\/$/, "");

export const SITE_NAME = "Compras Paraguay";

/** Imagem OG padrão da marca. */
export const BRAND_OG_IMAGE = "/images/atrativos/cataratas-do-iguacu/cover.webp";

/**
 * Palavras-chave canônicas de intenção de COMPRAS no Paraguai (Compras PY).
 * Usar na home e em hubs; páginas filhas especializam.
 */
export const COMPRAS_PRIMARY_KEYWORDS = [
  "compras no Paraguai",
  "compras em Ciudad del Este",
  "compras no Paraguai o que comprar",
  "Ciudad del Este o que comprar",
  "onde comprar em Ciudad del Este",
  "Ponte da Amizade compras",
  "duty free Puerto Iguazú",
  "compras em Foz do Iguaçu e Paraguai",
  "Shopping Catuaí Palladium",
  "Cataratas JL Shopping",
];

/**
 * Palavras-chave canônicas de intenção (pesquisa real sobre Foz do Iguaçu).
 * Usar em layout/hubs; páginas filhas especializam.
 */
export const FOZ_PRIMARY_KEYWORDS = [
  "Roteiro Foz do Iguaçu",
  "o que fazer em Foz do Iguaçu",
  "o que fazer em Foz do Iguaçu em 3 dias",
  "o que fazer em Foz do Iguaçu em 2 dias",
  "roteiro de 3 dias em Foz do Iguaçu",
  "roteiro de 2 dias em Foz do Iguaçu",
  "roteiro de 1 dia em Foz do Iguaçu",
  "passeios em Foz do Iguaçu",
  "pontos turísticos Foz do Iguaçu",
  "atrativos de Foz do Iguaçu",
  "Cataratas do Iguaçu",
  "Tríplice Fronteira",
  "onde comer em Foz do Iguaçu",
  "guia completo Foz do Iguaçu",
  "turismo em Foz do Iguaçu",
  "roteiro Foz do Iguaçu 3 dias",
  "roteiros prontos Foz",
  "ingresso Foz do Iguaçu",
  "ingressos passeios Foz",
  // Expansão jul/2026 (auditoria overnight): variações long-tail de intenção real de busca,
  // sem inventar fatos novos — só cobertura adicional de frases que turistas realmente digitam.
  "quantos dias ficar em Foz do Iguaçu",
  "melhor época para ir a Foz do Iguaçu",
  "vale a pena ir a Foz do Iguaçu",
  "primeira vez em Foz do Iguaçu",
  "roteiro de 4 dias em Foz do Iguaçu",
  "roteiro de 5 dias em Foz do Iguaçu",
  "o que não pode faltar em Foz do Iguaçu",
  "Foz do Iguaçu com crianças",
  "como chegar em Foz do Iguaçu",
  "melhor época para visitar as Cataratas",
] as const;

/** Silos de keywords — mesclar com keywords da página (sem duplicar). */
export const SILO_KEYWORDS = {
  atrativos: [
    "atrativos de Foz do Iguaçu",
    "pontos turísticos Foz do Iguaçu",
    "o que visitar em Foz do Iguaçu",
    "passeios em Foz do Iguaçu",
    "ingresso Foz do Iguaçu",
    "comprar ingresso Cataratas",
    "ingressos passeios Foz",
    "Cataratas do Iguaçu",
    "Parque das Aves",
    "Itaipu Binacional",
    "Marco das Três Fronteiras",
    // Expansão jul/2026: comparação/diferenciação entre atrativos (padrão real de busca).
    "Cataratas lado brasileiro ou argentino",
    "melhores passeios em Foz do Iguaçu",
    "atrativos imperdíveis em Foz do Iguaçu",
    "o que ver em Foz do Iguaçu",
  ],
  oQueFazer: [
    "o que fazer em Foz do Iguaçu",
    "o que fazer em Foz do Iguaçu em 1 dia",
    "o que fazer em Foz do Iguaçu em 2 dias",
    "o que fazer em Foz do Iguaçu em 3 dias",
    "o que fazer em Foz do Iguaçu em 4 dias",
    "o que fazer em Foz do Iguaçu em 5 dias",
    "passeios em Foz do Iguaçu",
    "guia Foz do Iguaçu",
    // Expansão jul/2026
    "o que fazer em Foz do Iguaçu com crianças",
    "o que fazer em Foz do Iguaçu de graça", // copy-ok — keyword de intenção de busca (§21.6), não é copy visível
    "roteiro de viagem Foz do Iguaçu",
  ],
  gastronomia: [
    "onde comer em Foz do Iguaçu",
    "gastronomia Foz do Iguaçu",
    "melhores restaurantes Foz do Iguaçu",
    "comida típica Foz do Iguaçu",
    "onde comer perto das Cataratas",
    // Expansão jul/2026
    "onde comer barato em Foz do Iguaçu",
    "onde comer bem em Foz do Iguaçu",
    "restaurante perto do Centro de Foz",
  ],
  triplice: [
    "Tríplice Fronteira",
    "Tríplice Fronteira Foz do Iguaçu",
    "Brasil Argentina Paraguai",
    "Marco das Três Fronteiras",
    "o que fazer na Tríplice Fronteira",
    "fronteira Foz do Iguaçu",
    "compras no Paraguai",
    "Cataratas lado argentino",
    // Expansão jul/2026
    "documentos para Argentina e Paraguai",
    "como atravessar a fronteira em Foz do Iguaçu",
    "Ciudad del Este compras",
    "Puerto Iguazú o que fazer",
  ],
  agencia: [
    "agência de turismo em Foz do Iguaçu",
    "receptivo Foz do Iguaçu", // copy-ok — keyword de intenção de busca (§21.6), não é copy visível
    "passeios em Foz do Iguaçu",
    "transfer Foz do Iguaçu",
    // Expansão jul/2026
    "melhor agência de turismo em Foz do Iguaçu",
    "vale a pena contratar agência em Foz do Iguaçu",
    "transfer aeroporto Foz do Iguaçu",
  ],
  /** Páginas estratégicas “roteiro de N dias” (intenção de busca forte). */
  roteiroDias: [
    "roteiro Foz do Iguaçu",
    "roteiro de Foz do Iguaçu",
    "roteiro Foz do Iguaçu 1 dia",
    "roteiro Foz do Iguaçu 2 dias",
    "roteiro Foz do Iguaçu 3 dias",
    "o que fazer em Foz do Iguaçu em 1 dia",
    "o que fazer em Foz do Iguaçu em 2 dias",
    "o que fazer em Foz do Iguaçu em 3 dias",
    "passeios em Foz do Iguaçu",
    "plano de viagem Foz do Iguaçu",
    // Expansão jul/2026
    "roteiro Foz do Iguaçu 4 dias",
    "roteiro Foz do Iguaçu 5 dias",
    "quantos dias preciso em Foz do Iguaçu",
    "itinerário Foz do Iguaçu",
  ],
} as const;

const abs = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path}`);

function uniqueKeywords(...lists: (readonly string[] | string[] | undefined)[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const list of lists) {
    if (!list) continue;
    for (const k of list) {
      const key = k.trim().toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(k.trim());
    }
  }
  return out;
}

// =============================================================================
// METADATA HELPER (Next.js)
// =============================================================================

export type PageMetadataInput = {
  /** Título absoluto (sem template "| Compras Paraguay" se absolute=true). */
  title: string;
  description: string;
  /** Path canônico começando com / */
  path: string;
  keywords?: readonly string[] | string[];
  /** Silo a mesclar com keywords da página */
  silo?: keyof typeof SILO_KEYWORDS;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  /** Se true (default), title vira { absolute } */
  absoluteTitle?: boolean;
  noIndex?: boolean;
};

/**
 * Metadata Next completa: title, description, keywords, canonical, OG, Twitter, robots.
 * Use em hubs e páginas editoriais estáticas.
 */
export function pageMetadata(input: PageMetadataInput): Metadata {
  const {
    title,
    description,
    path,
    keywords: pageKw,
    silo,
    image = BRAND_OG_IMAGE,
    imageAlt = title,
    type = "article",
    absoluteTitle = true,
    noIndex = false,
  } = input;

  const keywords = uniqueKeywords(
    pageKw,
    silo ? SILO_KEYWORDS[silo] : undefined,
    ["Compras Paraguay", "Foz do Iguaçu"],
  );

  const ogImage = {
    url: image,
    width: 1200,
    height: 630,
    alt: imageAlt,
  };

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type,
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "pt_BR",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

// =============================================================================
// BREADCRUMB PILLARS (silos)
// =============================================================================

/** Pilar de breadcrumb conforme categoria do nicho/parceiro. */
export function nichePillar(category: PartnerCategory): { name: string; url: string } {
  switch (category) {
    case "gastronomia":
      return { name: "Atrativos", url: "/roteiros-de-compras" };
    case "hotelaria":
      return { name: "Atrativos", url: "/roteiros-de-compras" };
    case "turismo":
      return { name: "Transfer em Foz", url: "/transfer" };
    default:
      return { name: "Atrativos", url: "/roteiros-de-compras" };
  }
}

// =============================================================================
// ATRATIVOS — títulos e keywords
// =============================================================================

/**
 * Âncora de lugar do atrativo.
 *
 * ⚠️ O catálogo passa da fronteira: a maioria dos atrativos é em Foz, mas há um bloco em Puerto
 * Iguazú (`country: "AR"`) e outro no Paraguai (`country: "PY"`). Escrever "em Foz do Iguaçu"
 * para esses é erro factual — e contradiz o `addressCountry` que o próprio JSON-LD declara logo
 * abaixo, em `attractionSchema`.
 */
function attractionPlaceAnchor(a: Attraction): string {
  if (a.country === "AR") return `em ${a.city}`;
  if (a.country === "PY") return "no Paraguai";
  return "em Foz";
}

/**
 * Nome do lugar por extenso — para `keywords` e `alternateName`, onde não existe teto de
 * caracteres e o que importa é desambiguar a entidade, não caber na SERP.
 *
 * ⚠️ Serve para o mesmo erro que `attractionPlaceAnchor` evita: o catálogo tinha
 * `alternateName: "{Nome} Foz do Iguaçu"` fixo, o que declarava ao Google que atrativos de Puerto
 * Iguazú e do Paraguai ficam em Foz — contradizendo o `addressCountry` do próprio schema, três
 * campos abaixo.
 */
export function attractionPlaceLabel(a: Attraction): string {
  if (a.country === "AR") return `${a.city}, Argentina`;
  if (a.country === "PY") return `${a.city}, Paraguai`;
  return "Foz do Iguaçu";
}

/**
 * Título SEO do atrativo — o DADO é autoridade.
 *
 * ⚠️ NÃO reintroduzir gate por regex aqui. Havia um que só devolvia `a.seoTitle` quando o valor
 * casava um punhado de palavras de compra. Fazia sentido quando o catálogo tinha títulos herdados
 * fracos; depois que ele foi reescrito com títulos próprios, o mesmo gate passou a descartar
 * TODOS eles — cada página servia o mesmo molde gerado, que ainda por cima localizava em Foz os
 * atrativos de Argentina e Paraguai. Título fraco se conserta no dado, nunca sobrescrevendo o
 * dado aqui.
 *
 * O fallback abaixo só roda para atrativo sem `seoTitle` próprio. Forma canônica do título (teto
 * de 60 chars, sem sufixo de marca, âncora de lugar por país): `conventions/seo.md` §19.
 */
export function attractionSeoTitle(a: Attraction): string {
  if (a.seoTitle) return a.seoTitle;
  return `${a.name}: guia de visita ${attractionPlaceAnchor(a)}`;
}

/**
 * Description SEO do atrativo — o DADO é autoridade (mesma regra do título acima).
 *
 * ⚠️ Este texto alimenta TRÊS consumidores: a `metadata` da página, `attractionSchema.description`
 * e `articleSchema.description`. Correção se faz aqui, na fonte — não ponto a ponto.
 *
 * ⚠️ A versão anterior deste fallback prometia preço fechado pelo parceiro comercial e nomeava o
 * canal de atendimento antes do envio do pedido — as duas coisas proibidas por §21.5 e §21.2. Por
 * causa do gate removido acima, ela esteve viva em quase todas as páginas de atrativo e passou
 * verde no checker o tempo todo, que é exatamente a lacuna descrita em §21.9.
 */
export function attractionSeoDescription(a: Attraction): string {
  if (a.seoDescription) return a.seoDescription;
  const base = a.tagline.replace(/\s+/g, " ").trim();
  const oferta =
    a.country === "BR"
      ? "Ingresso e roteiro completo em Foz do Iguaçu."
      : "Ingresso e roteiro a partir de Foz do Iguaçu.";
  return `${base} ${oferta}`;
}

export function attractionKeywords(a: Attraction): string[] {
  return uniqueKeywords(
    [
      a.name,
      `${a.name} ${attractionPlaceLabel(a)}`,
      `ingresso ${a.name}`,
      `comprar ingresso ${a.name}`,
      `preço ingresso ${a.name}`,
      `visitar ${a.name}`,
      `como chegar ${a.name}`,
      "ingressos Foz do Iguaçu",
    ],
    SILO_KEYWORDS.atrativos,
  );
}

/**
 * FAQ do atrativo: só a versão editorial.
 *
 * ⚠️ O bloco de INGRESSO (`TICKET_FAQ`) saiu junto com a venda de ingresso: nenhum dos 5 atrativos
 * do catálogo vende bilhete — todos abrem reserva de data. A pergunta "como comprar ingresso para X"
 * continuava no ar (e no `FAQPage` do JSON-LD) sobre um produto que não existe.
 *
 * ⚠️ Não criar um campo `ticketed`/`hasTicket` no chamador para religar isso: a informação não tem
 * mais dono nenhum. Se algum dia voltar a existir venda de ingresso, ela volta com fonte própria e
 * com as respostas reescritas — o texto antigo afirmava que o site vende ingresso.
 */
export function attractionDefaultFaq(
  a: Attraction,
): { q: string; a: string }[] {
  const where =
    a.info?.find((i) => /onde|local|fica/i.test(i.label))?.value ??
    a.address ??
    `${a.city}, ${a.state}`;
  const tip = a.info?.find((i) => /dica|horário|melhor/i.test(i.label))?.value;

  const editorial =
    a.faq && a.faq.length > 0
      ? a.faq
      : [
          {
            q: `O que é ${a.name}?`,
            a: `${a.tagline} ${a.description[0] ?? ""}`.replace(/\s+/g, " ").trim().slice(0, 500),
          },
          {
            // ⚠️ Não prometer mapa: a página de atrativo não renderiza nenhum, e `mapUrl` está
            // vazio em todo o catálogo. A resposta antiga dizia "veja o mapa nesta página".
            q: `Onde fica ${a.name}?`,
            a: `${a.name} fica em ${where}, ${attractionPlaceLabel(a)} — na região da Tríplice Fronteira.`,
          },
          {
            q: `Vale a pena visitar ${a.name}?`,
            a:
              a.highlights?.length > 0
                ? `Sim para a maioria dos roteiros. Pontos fortes: ${a.highlights.join(", ")}. ${tip ? `Dica: ${tip}` : "Combine com atrativos do mesmo corredor no mesmo dia."}`
                : `Sim — é um dos pontos mais buscados em Foz do Iguaçu. ${tip ? `Dica: ${tip}` : ""}`.trim(),
          },
          {
            // ⚠️ Sem caminho de URL cru na prosa e sem nomear o parceiro comercial em copy de
            // marketing (§21.5 — a relação do visitante é com o Compras Paraguay).
            q: `Como encaixar ${a.name} no roteiro de Foz?`,
            a: `${a.name} entra no dia em que faz sentido pela logística — quem conhece a cidade encaixa junto com os outros passeios, na ordem que evita atravessar Foz sem necessidade.`,
          },
        ];

  return [...editorial];
}

// =============================================================================
// ENTITY / MARCA
// =============================================================================

/**
 * Entidade principal do domínio (Organization + área turística).
 * Sinal de marca Compras Paraguay — referência sobre Foz, não um atrativo único.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: [
      "Roteiro Foz do Iguaçu",
      "Compras Paraguay",
      "Guia Compras Paraguay",
      "Guia de Foz do Iguaçu",
    ],
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: abs("/android-chrome-512x512.png"),
    },
    image: abs(BRAND_OG_IMAGE),
    description:
      "Compras Paraguay é o guia de roteiros e ingressos em Foz do Iguaçu e na Tríplice Fronteira: o que fazer, atrativos, onde comer e o planejamento dos dias na cidade, revisado por especialistas em Foz.",
    areaServed: {
      "@type": "City",
      name: "Foz do Iguaçu",
      containedInPlace: {
        "@type": "State",
        name: "Paraná",
        containedInPlace: { "@type": "Country", name: "Brasil" },
      },
    },
    knowsAbout: [
      "O que fazer em Foz do Iguaçu",
      "Atrativos de Foz do Iguaçu",
      "Ingressos de passeios em Foz do Iguaçu",
      "Cataratas do Iguaçu",
      "Tríplice Fronteira",
      "Parque das Aves",
      "Itaipu Binacional",
      "Gastronomia em Foz do Iguaçu",
      "Turismo em Foz do Iguaçu",
      "Roteiros em Foz do Iguaçu",
    ],
    sameAs: [
      "https://instagram.com/comprasparaguay",
      "https://www.facebook.com/comprasparaguay",
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: "Roteiro Foz do Iguaçu",
    url: SITE_URL,
    inLanguage: "pt-BR",
    description:
      "Guia e ingressos em Foz do Iguaçu: o que fazer, atrativos, onde comer, Tríplice Fronteira e roteiros prontos de 1 a 3 dias — curadoria Compras Paraguay, com revisão humana de quem conhece a cidade.",
    publisher: { "@id": `${SITE_URL}/#organization` },
    about: { "@id": `${SITE_URL}/#organization` },
    // ⚠️ SEM `potentialAction`/`SearchAction`. Havia um aqui declarando busca no site, mas o
    // `urlTemplate` apontava para /atrativos SEM o placeholder `{search_term_string}` que a
    // própria declaração exige — e o site não tem busca nenhuma para o placeholder apontar.
    // Declarar a ação sem ter a busca é afirmação falsa; só faz sentido reintroduzir se
    // /atrativos (ou outra rota) ganhar busca real por query string.
  };
}

/**
 * Entidade de destino (Place) — ancora “Foz do Iguaçu” ao site sem ser a marca.
 */
export function fozDestinationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "@id": `${SITE_URL}/#foz-destino`,
    name: "Foz do Iguaçu",
    description:
      "Destino na Tríplice Fronteira: Cataratas do Iguaçu, Itaipu, Parque das Aves, compras, gastronomia e fronteiras com Argentina e Paraguai. Guia e curadoria pelo Compras Paraguay.",
    url: SITE_URL,
    touristType: ["Família", "Casais", "Aventura", "Gastronomia", "Compras", "Natureza"],
    includesAttraction: [
      { "@type": "TouristAttraction", name: "Cataratas do Iguaçu" },
      { "@type": "TouristAttraction", name: "Parque das Aves" },
      { "@type": "TouristAttraction", name: "Itaipu Binacional" },
      { "@type": "TouristAttraction", name: "Marco das Três Fronteiras" },
    ],
  };
}

// =============================================================================
// LISTAS / NAVEGAÇÃO
// =============================================================================

export function itemListSchema(opts: {
  name: string;
  description?: string;
  items: { name: string; url: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: opts.name,
    ...(opts.description ? { description: opts.description } : {}),
    numberOfItems: opts.items.length,
    itemListElement: opts.items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: abs(it.url),
    })),
  };
}

/**
 * Página institucional tipada e amarrada à entidade do site.
 *
 * `AboutPage` em /sobre é sinal de E-E-A-T: liga a descrição de quem somos à `Organization` do
 * layout raiz, em vez de deixar a página sem JSON-LD nenhum (que era o estado de /sobre, /contato
 * e /aviso-legal). `isPartOf`/`about` apontam para os `@id` já emitidos globalmente — sem eles o
 * nó fica solto e não reforça entidade nenhuma.
 */
export function webPageSchema(opts: {
  type: "AboutPage" | "ContactPage" | "WebPage";
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": opts.type,
    name: opts.name,
    description: opts.description,
    url: abs(opts.url),
    inLanguage: "pt-BR",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.url),
    })),
  };
}

// =============================================================================
// PARCEIROS / ATRATIVOS / ROTEIROS
// =============================================================================

export function partnerSchema(partner: Partner) {
  const type =
    partner.category === "gastronomia"
      ? "Restaurant"
      : partner.category === "hotelaria"
        ? "LodgingBusiness"
        : "TravelAgency";

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": type,
    name: partner.name,
    description: partner.tagline,
    url: abs(`/${partner.slug}`),
    image: abs(partner.cover),
    address: {
      "@type": "PostalAddress",
      ...(partner.address ? { streetAddress: partner.address } : {}),
      addressLocality: partner.city,
      addressRegion: partner.state,
      addressCountry: partner.country,
    },
    areaServed: partner.city,
  };

  if (partner.geo) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: partner.geo.lat,
      longitude: partner.geo.lng,
    };
  }
  if (partner.phone) schema.telephone = partner.phone;
  if (partner.priceRange) schema.priceRange = partner.priceRange;

  const sameAs: string[] = [];
  if (partner.instagram) sameAs.push(`https://instagram.com/${partner.instagram}`);
  if (partner.facebook) sameAs.push(partner.facebook);
  if (partner.website) sameAs.push(partner.website);
  if (partner.ifood) sameAs.push(partner.ifood);
  if (sameAs.length) schema.sameAs = sameAs;

  return schema;
}

/** TouristAttraction + oferta de reserva (captura no Compras Paraguay → agência). */
export function attractionSchema(a: Attraction) {
  const pageUrl = abs(`/roteiros-de-compras/${a.slug}`);
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: a.name,
    alternateName: `${a.name} ${attractionPlaceLabel(a)}`,
    description: attractionSeoDescription(a),
    url: pageUrl,
    image: abs(a.cover),
    address: {
      "@type": "PostalAddress",
      ...(a.address ? { streetAddress: a.address } : {}),
      addressLocality: a.city,
      addressRegion: a.state,
      addressCountry: a.country,
    },
    isPartOf: { "@id": `${SITE_URL}/#foz-destino` },
    touristType: ["Família", "Casais", "Turismo"],
    // ⚠️ SEM `offers` (§21.7). Havia aqui um `Offer` com `availability: InStock`, `priceCurrency:
    // BRL` e o site como `seller` — declarando ao Google uma oferta que não existe: não vendemos
    // nem processamos pagamento, e não há preço nenhum para declarar. É a MESMA correção que
    // `roteiroTripSchema` já tinha recebido; a regra havia sido aplicada em roteiros e esquecida
    // aqui. NÃO reintroduzir em nenhum dos dois.
  };
  if (a.officialUrl && !a.officialUrl.includes("google.")) schema.sameAs = [a.officialUrl];
  if (a.highlights?.length) {
    schema.keywords = [...a.highlights, `ingresso ${a.name}`, attractionPlaceLabel(a)].join(", ");
  }
  return schema;
}

/** Título SEO padrão de um plano pronto (se não houver seoTitle no dado). */
export function defaultRoteiroSeoTitle(r: Roteiro): string {
  const dias = r.diasCount === 1 ? "1 dia" : `${r.diasCount} dias`;
  return `Roteiro Foz do Iguaçu ${dias} — ${r.profileLabel}`;
}

/**
 * ⚠️ Fallback — hoje sem uso real: `buildCatalog()` em `app/data/roteiros.ts` já atribui
 * `seoDescription` a todos os planos gerados. Mantido para plano que venha sem valor próprio.
 * A versão anterior fechava nomeando o parceiro comercial ("condições com a agência…"), que §21.5
 * proíbe em copy de marketing — a relação do visitante é com o Compras Paraguay.
 */
export function defaultRoteiroSeoDescription(r: Roteiro): string {
  const dias = r.diasCount === 1 ? "1 dia" : `${r.diasCount} dias`;
  return `${r.descricao_curta} Plano de ${dias} em Foz do Iguaçu (${r.profileLabel}): manhã, tarde e noite, na ordem que aproveita melhor o seu tempo na cidade.`;
}

/**
 * FAQ padrão de um roteiro pronto — sintetizada a partir dos campos que o próprio plano já tem
 * (dias, perfil, preço, atrativos do itinerário). Não inventa fato novo: mesma lógica de
 * `attractionDefaultFaq`, adaptada pra página de roteiro (que hoje não tem FAQ nem FAQPage schema).
 * `attractionNames` = nomes já resolvidos dos atrativos do plano (páginas passam via
 * `getRoteiroAttractionSlugs` + `getAttractionBySlug`, evitando import circular aqui).
 */
/**
 * FAQ da página individual de roteiro.
 *
 * ⚠️ DUAS FORMAS DA MESMA PERGUNTA, de propósito:
 *  · `q` é a VISÍVEL. Curta e natural. Todas as cinco terminavam em "…no roteiro de N dias —
 *    Clássico?", e cinco perguntas seguidas com o mesmo sufixo lêem como texto gerado por
 *    máquina — a página inteira já diz de que roteiro se trata.
 *  · `qSchema` é a do JSON-LD. Ali a repetição TEM função: um resultado rico pode exibir a
 *    pergunta fora do contexto da página, então ela precisa se sustentar sozinha.
 *
 * Quem renderiza usa `q`; quem monta o `faqSchema` usa `qSchema ?? q`.
 */
export type RoteiroFaqItem = { q: string; a: string; qSchema?: string };

export function roteiroDefaultFaq(
  r: Roteiro,
  attractionNames: string[],
): RoteiroFaqItem[] {
  const dias = r.diasCount === 1 ? "1 dia" : `${r.diasCount} dias`;
  const alvo = `o roteiro de ${dias} — ${r.profileLabel}`;
  const listaAtrativos =
    attractionNames.length > 0 ? attractionNames.slice(0, 6).join(", ") : null;

  const faq: (RoteiroFaqItem | null)[] = [
    {
      q: "O que está incluso neste roteiro?",
      qSchema: `O que está incluso n${alvo}?`,
      a: `${r.descricao_curta} O planejamento cobre manhã, tarde e noite de cada dia, com a ordem das atrações resolvida para você não atravessar a cidade sem necessidade.`,
    },
    {
      q: "Quanto custa?",
      qSchema: `Quanto custa ${alvo}?`,
      a: `Depende de quando você vai, de quantas pessoas viajam e de quais atrações entram — ingressos, câmbio e alta temporada mudam bastante a conta. Por isso o valor não sai de uma tabela genérica: ele é fechado em cima do roteiro montado para os seus dias.`,
    },
    {
      // ⚠️ RESPOSTA LEGADA REMOVIDA — não reintroduzir. Era "Em /montar-roteiro você ajusta as
      // experiências e os dias a partir deste plano como ponto de partida", que descrevia a
      // ferramenta de usar o plano pronto como TEMPLATE editável. Ela não existe mais: o botão
      // da página abre direto o modal de captura. A antiga ainda citava um caminho de URL cru na
      // prosa e punha o visitante como sujeito do verbo de montar, o que §21.5 bane.
      q: "Posso adaptar aos meus dias?",
      qSchema: `Posso adaptar ${alvo} aos meus dias?`,
      a: "Sim. A sequência publicada é a mesma para todo mundo, mas o que você recebe é fechado em cima das suas datas, de quem viaja com você e do que não pode ficar de fora — quem faz esse ajuste é um especialista que vive em Foz. Se preferir partir de outro ponto, o seu também pode ser feito do zero.",
    },
    listaAtrativos
      ? {
          q: "Quais atrativos entram?",
          qSchema: `Quais atrativos entram n${alvo}?`,
          a: `Este plano passa por: ${listaAtrativos}. Cada um tem página própria no catálogo de atrativos com detalhes, dicas e tempo sugerido de visita.`,
        }
      : null,
    {
      q: "Como recebo o roteiro?",
      qSchema: `Como recebo ${alvo}?`,
      // ⚠️ Saiu "Toque no botão desta página": narrava a interface e ainda assumia toque, quando
      // no desktop é clique.
      a: "Responda algumas perguntas rápidas — leva menos de dois minutos. Um especialista que vive em Foz revisa suas respostas, ajusta a logística e monta a versão final dos seus dias na cidade.",
    },
  ];

  return faq.filter((x): x is RoteiroFaqItem => x !== null);
}

/**
 * TouristTrip — plano de visita curado.
 * Complementa Article (conteúdo) com tipo de viagem.
 */
export function roteiroTripSchema(r: Roteiro) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "@id": abs(`/roteiros/${r.slug}#trip`),
    name: r.titulo,
    description: r.descricao_curta,
    url: abs(`/roteiros/${r.slug}`),
    touristType: [r.profileLabel, "Turismo em Foz do Iguaçu"],
    itinerary: {
      "@type": "ItemList",
      name: `${r.titulo} — dias`,
      numberOfItems: r.diasCount,
      itemListElement: r.dias.map((d, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: d.title ?? `Dia ${d.day}`,
      })),
    },
    provider: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
    },
    touristDestination: {
      "@type": "City",
      name: "Foz do Iguaçu",
    },
  };

  if (r.cover) schema.image = abs(r.cover);

  // ⚠️ SEM `offers` (§21.7). O bloco antigo publicava um `Offer` com `price` no JSON-LD a partir do
  // `preco_base` — além de violar a proibição de preço, declarava ao Google uma oferta que não
  // existe: não vendemos nem processamos pagamento. NÃO reintroduzir.

  return schema;
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export function articleSchema(opts: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  image?: string;
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    mainEntityOfPage: abs(opts.url),
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    inLanguage: "pt-BR",
    author: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: abs("/android-chrome-512x512.png") },
    },
    about: {
      "@type": "City",
      name: "Foz do Iguaçu",
    },
  };
  if (opts.image) schema.image = abs(opts.image);
  return schema;
}
