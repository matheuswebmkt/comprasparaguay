// Filepath: app/data/niches.ts
// Version: 1.1
// Nome da Versão: "Cluster SEO de nichos — copy limpa (sem âncora legada da roda)"
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
  // BAR E CERVEJARIA — exemplar COM parceiro (Patanegra ocupa a chave "bar-e-cervejaria")
  // ===========================================================================
  {
    slug: "bar-e-cervejaria-em-foz-do-iguacu",
    key: "bar-e-cervejaria",
    category: "gastronomia",
    nicheNoun: "bar e cervejaria",
    seoTitle: "Bar e Cervejaria em Foz do Iguaçu: os Melhores Chopes e Happy Hour",
    seoDescription:
      "Guia de bares e cervejarias em Foz do Iguaçu: onde tomar o melhor chopp artesanal, happy hour e cerveja gelada na Tríplice Fronteira. A seleção da nossa equipe para o seu roteiro.",
    keywords: [
      "bar em foz do iguaçu",
      "cervejaria em foz do iguaçu",
      "chopp artesanal foz do iguaçu",
      "happy hour foz do iguaçu",
      "onde beber chopp em foz",
      "cerveja artesanal foz do iguaçu",
    ],
    eyebrow: "Gastronomia · Foz do Iguaçu",
    h1: "Bar e cervejaria em Foz do Iguaçu: onde tomar o melhor chopp da fronteira",
    heroLead: [
      "Foz do Iguaçu não é só Cataratas e passeios de dia: quando o sol desce sobre a Tríplice Fronteira, a cidade troca o roteiro turístico pelo copo gelado. É a hora do happy hour, do chopp puro malte e daquele encontro que rende até tarde.",
      "Reunimos aqui o que importa para escolher bem: como é a cena de bares e cervejarias da cidade, o que diferencia um chopp artesanal de verdade e onde encaixar uma boa parada para brindar — de preferência, depois dos atrativos do dia, no Centro ou perto do hotel.",
    ],
    heroBadges: ["Chopp artesanal", "Happy hour", "Foz e região", "Puro malte"],
    datePublished: "2026-07-03",
    dateModified: "2026-07-03",
    breadcrumbLabel: "Bar e cervejaria em Foz do Iguaçu",
    navLabel: "Bar e cervejaria",
  },

  // ===========================================================================
  // CHURRASCARIA — exemplar EMPTY STATE (sem parceiro atribuído à chave "churrascaria")
  // ===========================================================================
  {
    slug: "churrascaria-em-foz-do-iguacu",
    key: "churrascaria",
    category: "gastronomia",
    nicheNoun: "churrascaria",
    seoTitle: "Churrascaria em Foz do Iguaçu: Onde Comer a Melhor Carne da Fronteira",
    seoDescription:
      "Guia de churrascarias em Foz do Iguaçu: rodízio, corte na brasa e a melhor carne da Tríplice Fronteira. A seleção da nossa equipe para o seu almoço ou jantar em Foz.",
    keywords: [
      "churrascaria em foz do iguaçu",
      "rodízio em foz do iguaçu",
      "melhor churrascaria foz do iguaçu",
      "onde comer carne em foz",
      "churrasco foz do iguaçu",
      "rodízio de carne foz",
    ],
    eyebrow: "Gastronomia · Foz do Iguaçu",
    h1: "Churrascaria em Foz do Iguaçu: onde comer a melhor carne da fronteira",
    heroLead: [
      "Terra de fronteira com o Sul do Brasil, a Argentina e o Paraguai, Foz do Iguaçu tem no churrasco quase uma segunda língua. É o prato que reúne a família depois do passeio, fecha o dia de turista com chave de ouro e vira programa de fim de semana para quem é da cidade.",
      "Se você busca uma boa churrascaria em Foz — de rodízio farto a corte à la carte na brasa —, este guia mostra o que faz a carne daqui ser tão boa, como escolher a casa certa e onde encaixar esse almoço (ou jantar) no seu roteiro pela Tríplice Fronteira.",
    ],
    heroBadges: ["Rodízio", "Corte na brasa", "Almoço e jantar", "Para a família"],
    datePublished: "2026-07-03",
    dateModified: "2026-07-03",
    breadcrumbLabel: "Churrascaria em Foz do Iguaçu",
    navLabel: "Churrascaria",
  },

  // ===========================================================================
  // RESTAURANTE — gastronomia (empty state até haver parceiro)
  // ===========================================================================
  {
    slug: "restaurante-em-foz-do-iguacu",
    key: "restaurante",
    category: "gastronomia",
    nicheNoun: "restaurante",
    seoTitle: "Restaurante em Foz do Iguaçu: Onde Comer Bem na Tríplice Fronteira",
    seoDescription:
      "Guia de restaurantes em Foz do Iguaçu: onde comer bem, da comida típica da fronteira à alta gastronomia. A seleção da nossa equipe para o seu almoço ou jantar na cidade.",
    keywords: [
      "restaurante em foz do iguaçu",
      "onde comer em foz do iguaçu",
      "melhor restaurante foz do iguaçu",
      "comer bem em foz",
      "restaurante perto das cataratas",
      "comida típica foz do iguaçu",
    ],
    eyebrow: "Gastronomia · Foz do Iguaçu",
    h1: "Restaurante em Foz do Iguaçu: onde comer bem na Tríplice Fronteira",
    heroLead: [
      "Comer em Foz do Iguaçu é atravessar três países sem sair da mesa. O encontro entre Brasil, Argentina e Paraguai deixou na cidade uma cozinha diversa como poucas: da parrilla ao prato árabe, do peixe de água doce à alta gastronomia, tudo convive num raio de poucos quilômetros.",
      "Se você procura um bom restaurante em Foz — para um almoço em família, um jantar a dois ou uma parada entre um passeio e outro —, este guia mostra o que a cidade tem de melhor, como escolher a casa certa e onde encaixar a refeição no seu roteiro pela fronteira.",
    ],
    heroBadges: ["Comida de fronteira", "Almoço e jantar", "Para todos os bolsos", "Para a família"],
    datePublished: "2026-07-03",
    dateModified: "2026-07-03",
    breadcrumbLabel: "Restaurante em Foz do Iguaçu",
    navLabel: "Restaurante",
  },

  // ===========================================================================
  // PIZZARIA — gastronomia
  // ===========================================================================
  {
    slug: "pizzaria-em-foz-do-iguacu",
    key: "pizzaria",
    category: "gastronomia",
    nicheNoun: "pizzaria",
    seoTitle: "Pizzaria em Foz do Iguaçu: as Melhores Pizzas da Fronteira",
    seoDescription:
      "Guia de pizzarias em Foz do Iguaçu: onde comer a melhor pizza, do forno a lenha ao delivery. A recomendação da nossa equipe para o seu rodízio ou pedido em casa.",
    keywords: [
      "pizzaria em foz do iguaçu",
      "melhor pizza foz do iguaçu",
      "rodízio de pizza foz do iguaçu",
      "delivery de pizza foz",
      "pizzaria perto das cataratas",
      "pizza em foz do iguaçu",
    ],
    eyebrow: "Gastronomia · Foz do Iguaçu",
    h1: "Pizzaria em Foz do Iguaçu: onde comer a melhor pizza da fronteira",
    heroLead: [
      "Tem noite em que a fome pede algo simples e certeiro — e poucas coisas resolvem tão bem quanto uma boa pizza. Em Foz do Iguaçu, a herança italiana e o gosto da fronteira por mesa farta fizeram da pizza um clássico de fim de dia, seja no salão da pizzaria ou entregue quentinha em casa.",
      "Se você procura a melhor pizza de Foz — rodízio para experimentar de tudo ou um delivery para curtir no hotel depois do passeio —, este guia mostra o que faz uma pizza valer a pena, como escolher a casa certa e onde ela entra no seu roteiro pela cidade.",
    ],
    heroBadges: ["Forno a lenha", "Rodízio", "Delivery", "Massa artesanal"],
    datePublished: "2026-07-03",
    dateModified: "2026-07-03",
    breadcrumbLabel: "Pizzaria em Foz do Iguaçu",
    navLabel: "Pizzaria",
  },

  // ===========================================================================
  // SHAWARMA — gastronomia (herança árabe real de Foz)
  // ===========================================================================
  {
    slug: "shawarma-em-foz-do-iguacu",
    key: "shawarma",
    category: "gastronomia",
    nicheNoun: "shawarma",
    seoTitle: "Shawarma em Foz do Iguaçu: o Melhor da Culinária Árabe da Fronteira",
    seoDescription:
      "Guia de shawarma e comida árabe em Foz do Iguaçu: onde comer o melhor beirute, esfiha e shawarma da cidade. A recomendação da nossa equipe, herdeira da forte tradição árabe da fronteira.",
    keywords: [
      "shawarma em foz do iguaçu",
      "comida árabe foz do iguaçu",
      "melhor shawarma foz",
      "esfiha foz do iguaçu",
      "beirute foz do iguaçu",
      "shawarma delivery foz",
    ],
    eyebrow: "Gastronomia · Foz do Iguaçu",
    h1: "Shawarma em Foz do Iguaçu: o melhor da culinária árabe da fronteira",
    heroLead: [
      "Foz do Iguaçu tem uma das maiores e mais vivas comunidades árabes do Brasil — e isso se sente na mesa. O shawarma, aquele wrap de carne fatiada no espeto vertical com pão, molho e temperos, faz parte do dia a dia da cidade tanto quanto o churrasco ou a pizza.",
      "Se você procura o melhor shawarma de Foz — ou quer explorar a culinária árabe da fronteira, das esfihas ao beirute —, este guia mostra por que a cidade é referência no assunto, o que faz um bom shawarma e onde encaixar essa parada saborosa no seu roteiro.",
    ],
    heroBadges: ["Culinária árabe", "No espeto", "Rápido e saboroso", "Delivery"],
    datePublished: "2026-07-03",
    dateModified: "2026-07-03",
    breadcrumbLabel: "Shawarma em Foz do Iguaçu",
    navLabel: "Shawarma",
  },

  // ===========================================================================
  // SUSHI — gastronomia
  // ===========================================================================
  {
    slug: "sushi-em-foz-do-iguacu",
    key: "sushi",
    category: "gastronomia",
    nicheNoun: "sushi",
    seoTitle: "Sushi em Foz do Iguaçu: os Melhores Rodízios e Culinária Japonesa",
    seoDescription:
      "Guia de sushi e comida japonesa em Foz do Iguaçu: onde comer o melhor rodízio, temaki e sashimi da cidade. A recomendação da nossa equipe para o seu jantar japonês na fronteira.",
    keywords: [
      "sushi em foz do iguaçu",
      "comida japonesa foz do iguaçu",
      "rodízio de sushi foz",
      "melhor japonês foz do iguaçu",
      "temaki foz do iguaçu",
      "sushi delivery foz",
    ],
    eyebrow: "Gastronomia · Foz do Iguaçu",
    h1: "Sushi em Foz do Iguaçu: onde comer a melhor comida japonesa da fronteira",
    heroLead: [
      "A cidade das Cataratas também é terra de boa comida japonesa. A imigração nipônica que ajudou a construir o Paraná deixou em Foz do Iguaçu uma cena de sushi que cresce a cada ano — de restaurantes tradicionais a rodízios fartos e delivery para curtir no hotel.",
      "Se você procura o melhor sushi de Foz — um rodízio para provar de tudo, um sashimi fresquinho ou aquele temaki generoso —, este guia mostra o que diferencia a comida japonesa de qualidade, como escolher a casa certa e onde encaixá-la no seu roteiro pela fronteira.",
    ],
    heroBadges: ["Rodízio", "Peixe fresco", "Temaki e sashimi", "Delivery"],
    datePublished: "2026-07-03",
    dateModified: "2026-07-03",
    breadcrumbLabel: "Sushi em Foz do Iguaçu",
    navLabel: "Sushi",
  },

  // ===========================================================================
  // HAMBURGUERIA — gastronomia
  // ===========================================================================
  {
    slug: "hamburgueria-em-foz-do-iguacu",
    key: "hamburgueria",
    category: "gastronomia",
    nicheNoun: "hamburgueria",
    seoTitle: "Hamburgueria em Foz do Iguaçu: os Melhores Hambúrgueres Artesanais",
    seoDescription:
      "Guia de hamburguerias em Foz do Iguaçu: onde comer o melhor hambúrguer artesanal da cidade, no salão ou por delivery. A recomendação da nossa equipe para o seu lanche na fronteira.",
    keywords: [
      "hamburgueria em foz do iguaçu",
      "hambúrguer artesanal foz do iguaçu",
      "melhor hambúrguer foz",
      "burger foz do iguaçu",
      "hamburgueria delivery foz",
      "lanche em foz do iguaçu",
    ],
    eyebrow: "Gastronomia · Foz do Iguaçu",
    h1: "Hamburgueria em Foz do Iguaçu: onde comer o melhor hambúrguer artesanal",
    heroLead: [
      "A febre do hambúrguer artesanal também tomou conta de Foz do Iguaçu. O que antes era só fast-food virou uma cena de hamburguerias autorais, com blends especiais, pães brioche e receitas que transformam um lanche simples em experiência — de salão cheio ou entregue quentinho em casa.",
      "Se você procura o melhor hambúrguer de Foz — para um jantar despretensioso ou um delivery no fim da noite —, este guia mostra o que separa o burger artesanal do comum, como escolher a casa certa e onde encaixar esse lanche no seu roteiro pela cidade.",
    ],
    heroBadges: ["Artesanal", "Blend especial", "Delivery", "Pão brioche"],
    datePublished: "2026-07-03",
    dateModified: "2026-07-03",
    breadcrumbLabel: "Hamburgueria em Foz do Iguaçu",
    navLabel: "Hamburgueria",
  },

  // ===========================================================================
  // TRANSFER — turismo
  // ===========================================================================
  {
    slug: "transfer",
    key: "transfer",
    category: "turismo",
    nicheNoun: "transfer",
    seoTitle: "Transfer para compras na Tríplice Fronteira | Compras Paraguay",
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
    h1: "Seu dia de compras sem complicação",
    heroLead: [
      "Ciudad del Este, o duty free argentino e os shoppings de Foz ficam a poucos minutos um do outro — mas a fronteira tem horários, filas e travessias que mudam o seu dia. Com um transfer, você atravessa na hora certa e volta com as compras sem estresse.",
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
  const silo: keyof typeof SILO_KEYWORDS =
    niche.category === "gastronomia" ? "gastronomia" : "agencia";

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
