// Filepath: lib/seo.ts
// Version: 6.0
// Nome da Versão: "SEO na narrativa Compras PY — silo compras, helpers sem 'ingresso', entidades e @ do social corretos"
//
// Identidade SEO do domínio = Compras Paraguay como CURADORIA DE COMPRAS na Tríplice Fronteira:
// roteiro de compras em Ciudad del Este, duty free e By Night em Puerto Iguazú e os shoppings da
// região de Foz do Iguaçu. O dia de compras sai de Foz com guia especialista; atendimento,
// reservas e contratação são da agência parceira.

import type { Metadata } from "next";
import type { Partner, Attraction, PartnerCategory } from "@/app/types";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.comprasparaguay.online"
).replace(/\/$/, "");

export const SITE_NAME = "Compras Paraguay";

/** Imagem OG padrão da marca — o destino-carro-chefe (Compras no Paraguai / Ciudad del Este). */
export const BRAND_OG_IMAGE = "/images/atrativos/compras-paraguai-ciudad-del-este/cover.webp";

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

/** Silos de keywords — mesclar com keywords da página (sem duplicar). */
export const SILO_KEYWORDS = {
  /** Eixo-compras do domínio: roteiros de compras na fronteira (home, hub, destinos). */
  compras: [
    "compras no Paraguai",
    "roteiro de compras em Ciudad del Este",
    "o que comprar em Ciudad del Este",
    "onde comprar em Ciudad del Este",
    "compras em Foz do Iguaçu e Paraguai",
    "duty free Puerto Iguazú",
    "By Night Puerto Iguazú",
    "Shopping Catuaí Palladium",
    "Cataratas JL Shopping",
    "Ponte da Amizade compras",
    "cota de compras Paraguai",
    "melhor dia para compras em Ciudad del Este",
    "dia de compras no Paraguai com guia",
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
      return { name: "Roteiros de compras", url: "/roteiros-de-compras" };
    case "hotelaria":
      return { name: "Roteiros de compras", url: "/roteiros-de-compras" };
    case "turismo":
      return { name: "Transfer em Foz", url: "/transfer" };
    default:
      return { name: "Roteiros de compras", url: "/roteiros-de-compras" };
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
      ? "Dia de compras em Foz do Iguaçu com guia especialista e logística resolvida."
      : "Dia de compras a partir de Foz do Iguaçu com guia especialista e logística resolvida.";
  return `${base} ${oferta}`;
}

export function attractionKeywords(a: Attraction): string[] {
  return uniqueKeywords(
    [
      a.name,
      `${a.name} ${attractionPlaceLabel(a)}`,
      `compras ${a.name}`,
      `visitar ${a.name}`,
      `como chegar em ${a.name}`,
      `${a.name} Tríplice Fronteira`,
    ],
    SILO_KEYWORDS.compras,
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
            a: `${a.name} entra no dia em que faz sentido pela logística — quem conhece a fronteira encaixa junto com os outros destinos de compras, na ordem que evita atravessar a cidade sem necessidade.`,
          },
        ];

  return [...editorial];
}

// =============================================================================
// ENTITY / MARCA
// =============================================================================

/**
 * Entidade principal do domínio (Organization + área de atuação).
 * Sinal de marca Compras Paraguay — curadoria de compras na fronteira, não um destino único.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: [
      "Compras Paraguay",
      "Compras PY",
      "Guia Compras Paraguay",
    ],
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: abs("/android-chrome-512x512.png"),
    },
    image: abs(BRAND_OG_IMAGE),
    description:
      "Compras Paraguay é a curadoria de compras na Tríplice Fronteira: roteiro de compras em Ciudad del Este, duty free e By Night em Puerto Iguazú e os shoppings da região — dias de compras conduzidos por guias especialistas, com atendimento da agência parceira.",
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
      "Compras no Paraguai",
      "Compras em Ciudad del Este",
      "Duty free em Puerto Iguazú",
      "By Night em Puerto Iguazú",
      "Shopping Catuaí Palladium",
      "Cataratas JL Shopping",
      "Tríplice Fronteira",
      "Cota de compras na fronteira",
      "Ponte da Amizade",
      "Transfer em Foz do Iguaçu",
    ],
    sameAs: [
      "https://instagram.com/roteirosfoz",
      "https://www.facebook.com/roteirofoz",
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: "Compras PY",
    url: SITE_URL,
    inLanguage: "pt-BR",
    description:
      "Curadoria de compras na tríplice fronteira: Ciudad del Este, duty free e By Night em Puerto Iguazú e os shoppings da região — com guia especialista e logística de ida e volta a partir do seu hotel em Foz do Iguaçu.",
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
    schema.keywords = [...a.highlights, `compras ${a.name}`, attractionPlaceLabel(a)].join(", ");
  }
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
