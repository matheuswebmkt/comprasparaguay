// Filepath: app/data/niches.ts
// Version: 1.2
// Nome da Versão: "Cluster reduzido ao transfer — 7 nichos de gastronomia removidos (rota /onde-comer extinta)"
// Baseado na Versão: N/A
//
// ⚠️ SEPARATION OF CONCERNS (regra-mestra — plan.md / conventions §2):
//   Este arquivo é a ISCA de SEO. A copy é SOBRE O NICHO e os termos de busca — JAMAIS cita o parceiro
//   nem se contamina com palavras-chave/contexto dele. A recomendação (o parceiro exclusivo) vive SÓ no
//   componente `NicheRecommendation` (slot de pitch), casado por `key` via `getPartnerForNiche`. Trocar/
//   remover o parceiro NÃO altera nada aqui. Sem parceiro → o slot vira Empty State (autoridade preservada).
//
// ⚠️ CONTEÚDO ORIGINAL (conventions §8): fatos são livres; a redação é 100% nossa (nunca verbatim).

import type { Metadata } from "next";
import type { PartnerCategory } from "@/app/types";
import { pageMetadata, SILO_KEYWORDS } from "@/lib/seo";

// -----------------------------------------------------------------------------
// Tipos
// -----------------------------------------------------------------------------
export interface NicheBullet {
  /** Nome de um ícone lucide (mapeado no template; fallback seguro se ausente). */
  icon?: string;
  title: string;
  text: string;
}

export interface NicheSection {
  /** Rótulo curto (uppercase) acima do H2 da seção. */
  eyebrow?: string;
  icon?: string;
  heading: string;
  /** Substring do `heading` que recebe o destaque Verde Selva (TituloComDestaque). */
  headingDestaque?: string;
  paragraphs: string[];
  /** Grade opcional de cards (diferenciais, critérios, dicas). */
  bullets?: NicheBullet[];
  /** Parágrafo de fechamento EXIBIDO DEPOIS dos cards (quando há bullets). */
  closing?: string;
}

export interface Niche {
  /** Identificador/âncora do nicho (ex: "churrascaria-em-foz-do-iguacu"). NÃO é rota pública —
   *  páginas de nicho são legado e nunca existirão; a superfície viva é o hub /onde-comer,
   *  onde cada nicho é um card (âncora #slug) que abre o modal do parceiro. */
  slug: string;
  /** Chave estável de match com `Partner.niches` (ex: "churrascaria"). */
  key: string;
  /** Categoria para agrupamento (hub) e JSON-LD do parceiro no slot. */
  category: PartnerCategory;
  /** Substantivo do nicho em minúsculo p/ interpolação de copy (ex: "churrascaria", "bar e cervejaria"). */
  nicheNoun: string;

  // SEO / metadata
  seoTitle: string;
  seoDescription: string;
  keywords?: string[];

  // Hero
  eyebrow: string;
  h1: string;
  heroLead: string[];
  /** Rótulo do CTA do hero (âncora interna #recomendacao), por nicho.
   *  Presente só no nicho dedicado (transfer), que usam hero com CTA. */
  heroCta?: string;
  heroBadges?: string[];

  // Slot de recomendação (moldura NEUTRA — não cita parceiro; funciona com pitch OU empty state).
  // Só as páginas dedicadas (hospedagem/transfer) têm; os nichos do hub /onde-comer não usam.
  recommendationEyebrow?: string;
  recommendationTitle?: string;
  recommendationLead?: string;

  // Conteúdo editorial — só as páginas dedicadas (hospedagem/transfer) têm; os nichos do hub
  // /onde-comer não usam (o conteúdo deles vive em lib/i18n/onde-comer.ts).
  sections?: NicheSection[];
  faq?: { q: string; a: string }[];

  // Autoria (articleSchema)
  datePublished: string;
  dateModified: string;

  // Rótulos de navegação/breadcrumb
  breadcrumbLabel: string;
  /** Rótulo curto p/ grids de cluster e navegação (ex: "Churrascaria"). */
  navLabel: string;
}

// -----------------------------------------------------------------------------
// Conteúdo dos nichos
// -----------------------------------------------------------------------------
export const niches: Niche[] = [
  // ===========================================================================
  // TRANSFER — turismo
  // ===========================================================================
  {
    slug: "transfer",
    key: "transfer",
    category: "turismo",
    nicheNoun: "transfer",
    seoTitle: "Transfer para Compras no Paraguai e Duty Free Puerto Iguazú",
    seoDescription:
      "Transfer para Ciudad del Este, Duty Free de Puerto Iguazú e os shoppings de Foz — atravesse a fronteira sem depender de aplicativo e aproveite melhor o seu dia de compras.",
    keywords: [
      "transfer foz do iguaçu",
      "transfer aeroporto foz do iguaçu",
      "transfer compras paraguai",
      "transfer ponte da amizade",
      "transfer duty free puerto iguazú",
      "transfer Ciudad del Este",
      "receptivo foz do iguaçu", // copy-ok — keyword de intenção de busca (§21.6), não é copy visível
      "transporte para compras em foz",
    ],
    eyebrow: "Transfer · Compras na Fronteira",
    h1: "Compras no Paraguai sem complicação",
    heroLead: [
      "Com um transfer/privativo, você atravessa na hora certa e volta com as compras sem estresse.",
    ],
    heroCta: "Ver transfer",
    recommendationEyebrow: "A escolha da nossa equipe",
    recommendationTitle: "A nossa recomendação de transfer para o roteiro de compras",
    recommendationLead:
      "Avaliamos atendimento, pontualidade e confiança. Para o seu dia de compras render sem estresse, este é o transfer que a nossa equipe indica na fronteira.",
    sections: [
      {
        eyebrow: "Como escolher",
        icon: "ShieldCheck",
        heading: "O que um bom transfer de compras oferece",
        headingDestaque: "transfer",
        paragraphs: [
          "Nem todo transfer é igual. Os melhores unem pontualidade, veículos confortáveis e transparência — você sabe exatamente o que está contratando, sem taxas escondidas. Motoristas experientes conhecem os horários da fronteira e o caminho certo para você não perder a manhã de compras em Ciudad del Este.",
        ],
        bullets: [
          { icon: "ShieldCheck", title: "Transparência", text: "Valores claros antes de embarcar: você sabe o que contratou do início ao fim, sem surpresa no final." },
          { icon: "Users", title: "Ajuste ao seu roteiro de compras", text: "A travessia da ponte, o horário do duty free, os shoppings e a volta com as compras: o transfer se adapta ao seu dia." },
          { icon: "Star", title: "Motoristas que conhecem a fronteira", text: "Quem dirige em Foz conhece os horários de pico da Ponte da Amizade e o melhor caminho para cada destino de compras." },
        ],
        closing:
          "Vale checar a reputação, a cobertura de rotas (do aeroporto à Ciudad del Este, ao duty free e aos shoppings) e o suporte durante o passeio. Um transfer confiável se antecipa aos imprevistos da fronteira e adapta o programa ao seu ritmo — em família, em casal ou em grupo.",
      },
    ],
    faq: [
      { q: "Vale a pena contratar transfer para as compras na Tríplice Fronteira?", a: "Para quem vai comprar em Ciudad del Este ou no duty free, sim. A fronteira tem horários, filas e travessias que mudam o seu dia, e o transfer resolve o transporte do hotel até o destino e a volta com as compras, poupando tempo e evitando dor de cabeça. A recomendação da nossa equipe nesta página prioriza operadores locais pontuais e confiáveis." },
      { q: "Quanto custa um transfer em Foz do Iguaçu?", a: "O valor varia conforme a distância, o horário e o tamanho do grupo. Muitas operadoras oferecem condições que já incluem o transporte de ida e volta até o destino de compras, o que costuma sair mais prático. O ideal é conferir as condições direto com a operadora recomendada." },
      { q: "O que é um receptivo em Foz do Iguaçu?", a: "Receptivo é a agência local que recebe o turista e organiza a estadia: transfers do aeroporto e hotel, passeios guiados e roteiros pela região. É quem cuida da sua experiência em terra, do começo ao fim da estadia." }, // copy-ok — FAQ definicional do termo de busca "o que é receptivo" (§21.6)
      { q: "O transfer leva até onde nas compras?", a: "Os destinos de compras da fronteira: Ciudad del Este (logo depois da Ponte da Amizade), o Duty Free de Puerto Iguazú e os shoppings Cataratas JL e Catuaí Palladium, em Foz. Boas operadoras ajudam ainda a encaixar a noite argentina no By Night no mesmo roteiro." },
      { q: "O transfer ajuda a organizar o roteiro de compras dos meus dias em Foz?", a: "Sim. Uma boa operadora monta um programa fluido, encaixando Ciudad del Este de manhã (enquanto o comércio está aberto), o duty free no meio da tarde e a noite argentina no By Night — sem você se preocupar com transporte e horários." },
    ],
    datePublished: "2026-07-03",
    dateModified: "2026-07-03",
    breadcrumbLabel: "Transfer em Foz do Iguaçu",
    navLabel: "Transfer",
  },
];

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------
export const getNiche = (slug: string): Niche | undefined =>
  niches.find((n) => n.slug === slug);

export const getNicheByKey = (key: string): Niche | undefined =>
  niches.find((n) => n.key === key);

/** Metadata (Next) montada a partir do nicho — usada por cada page.tsx do cluster. */
export function buildNicheMetadata(niche: Niche): Metadata {
  // O cluster só tem o transfer hoje: silo "agência" sempre.
  const silo: keyof typeof SILO_KEYWORDS = "agencia";

  return pageMetadata({
    title: niche.seoTitle,
    description: niche.seoDescription,
    path: `/${niche.slug}`,
    keywords: niche.keywords,
    silo,
    imageAlt: niche.h1,
    type: "article",
  });
}
