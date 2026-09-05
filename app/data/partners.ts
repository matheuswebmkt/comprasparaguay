// Filepath: app/data/partners.ts
// Version: 3.3
// Nome da Versão: "+ 2º parceiro real: Cantina La Gregoria (pizzaria, nicho 'pizzaria')"
// Baseado na Versão: 3.2 (Patanegra + campo niches + getPartnerForNiche)

import { Partner, PartnerCategory, PartnerCategoryMeta } from "@/app/types";

// =============================================================================
// CATEGORIAS (fixas — conventions.md §3)
// =============================================================================
export const partnerCategories: PartnerCategoryMeta[] = [
  {
    slug: "gastronomia",
    name: "Gastronomia e Culinária",
    iconName: "UtensilsCrossed",
    accent: "hsl(35, 82%, 47%)",
    description:
      "Restaurantes, pizzarias, cafés e experiências gastronômicas da Tríplice Fronteira.",
  },
  {
    slug: "hotelaria",
    name: "Hotelaria",
    iconName: "Hotel",
    accent: "hsl(210, 56%, 23%)",
    description:
      "Hotéis e pousadas para se hospedar perto das Cataratas e da Tríplice Fronteira.",
  },
  {
    slug: "turismo",
    name: "Turismo",
    iconName: "Compass",
    accent: "hsl(152, 47%, 32%)",
    description:
      "Agências de turismo locais que montam roteiros e passeios pela região.",
  },
];

export const getCategoryMeta = (slug: PartnerCategory): PartnerCategoryMeta =>
  partnerCategories.find((c) => c.slug === slug) ?? partnerCategories[0];

// =============================================================================
// PARCEIROS — vazio até cadastrar parceiros REAIS.
// Sem parceiros, a home exibe apenas a seção Roteiro foz + footer.
// `country`: "BR" (Foz do Iguaçu) | "AR" (Puerto Iguazú) | "PY" (Ciudad del Este).
//
// Template para adicionar um parceiro real:
// {
//   id: 1,
//   slug: "nome-do-parceiro",
//   name: "Nome do Parceiro",
//   category: "gastronomia",            // | "hotelaria" | "turismo"
//   country: "BR",                      // | "AR" | "PY"
//   tagline: "Frase curta de impacto.",
//   description: ["Parágrafo 1.", "Parágrafo 2."],
//   address: "Rua, número",
//   neighborhood: "Bairro",
//   city: "Foz do Iguaçu",
//   state: "PR",
//   mapUrl: "https://maps.google.com/...",
//   geo: { lat: -25.5, lng: -54.5 },    // opcional (LocalBusiness JSON-LD)
//   ctaUrl: "https://site-ou-cardapio.com",
//   ctaLabel: "Ver cardápio",
//   website: "https://site.com",        // opcional
//   whatsapp: "5545999999999",          // só dígitos (E.164 sem +)
//   instagram: "handle",                // sem @
//   cover: "/images/parceiros/nome-do-parceiro/cover.webp",
//   highlights: ["Destaque 1", "Destaque 2", "Destaque 3"],
//   priceRange: "$$",                   // "$" | "$$" | "$$$"
//   hours: ["Ter–Dom: 11h–23h"],
//   featured: true,                     // opcional
//   status: "active",                   // "active" | "draft"
// }
// =============================================================================
export const partners: Partner[] = [
  {
    id: 1,
    slug: "patanegra-cervejaria",
    name: "Cervejaria Patanegra",
    category: "gastronomia",
    businessType: "Cervejaria",
    country: "BR",
    featured: true,
    status: "active",
    // Recomendação Oficial EXCLUSIVA do nicho bar-e-cervejaria no hub /onde-comer.
    niches: ["bar-e-cervejaria"],
    seoTitle: "Patanegra — Chopp Artesanal e Delivery de Chope em Foz do Iguaçu",
    seoDescription:
      "Chope artesanal premiado com entrega gelada em Foz do Iguaçu e região. Mais de 15 estilos — Pilsen, chopes de vinho, IPA e sours. Peça seu delivery de chopp ou chopeira para eventos.",
    tagline:
      "Peça agora mesmo o Chope artesanal mais premiado, entregue gelado onde você estiver — em Foz do Iguaçu e região.",
    description: [
      "Mais que cerveja, um estilo de vida. A Patanegra é a cervejaria de chope especial mais premiada de Foz do Iguaçu — puro malte, padrão rigoroso de pureza e aquele frescor de fábrica que vai do tanque direto pro seu copo.",
      "Bateu a vontade? É só pedir. O delivery próprio leva o seu chope gelado, na temperatura certa, até a sua casa ou local que precisar — com a agilidade de quem leva cerveja a sério. São mais de 15 estilos pra escolher: da Pilsen clássica aos chopes de vinho e às sours frutadas.",
    ],
    city: "Foz do Iguaçu",
    state: "PR",
    // Cardápio + preços atualizados e calculadora de chopp ficam no site oficial deles.
    ctaUrl: "https://patanegradelivery-mcr.vercel.app/",
    ctaLabel: "Fazer pedido",
    whatsapp: "554599901000",
    whatsappMessage:
      "Olá, Patanegra! Vim pelo site da Compras Paraguay e quero fazer um pedido de chopp. Pode me ajudar?",
    instagram: "patanegrafoz",
    cover: "/images/parceiros/patanegra/cover.webp",
    gallery: [
      "/images/parceiros/patanegra/branding/1.webp",
      "/images/parceiros/patanegra/branding/2.webp",
      "/images/parceiros/patanegra/branding/3.webp",
    ],
    highlights: ["Delivery", "Entrega gelada", "Foz e região", "Puro malte", "Chope de vinho", "+15 estilos"],
    hours: [
      "Atendimento e delivery: todos os dias",
      "Pedidos pelo site, WhatsApp e Instagram",
    ],
    features: [
      {
        iconName: "Award",
        title: "Cervejaria premiada",
        text: "Eleita entre as melhores cervejarias especiais, com medalhas de ouro, prata e bronze. Qualidade reconhecida em cada copo.",
      },
      {
        iconName: "Truck",
        title: "Delivery gelado",
        text: "Frota própria que leva o seu chope na temperatura ideal até você, em Foz do Iguaçu e região. Pediu, chegou gelado.",
      },
      {
        iconName: "Snowflake",
        title: "Frescor de fábrica",
        text: "Envase rápido que preserva os aromas e sabores originais. Do tanque direto pro seu copo, sem perder o frescor.",
      },
      {
        iconName: "Beer",
        title: "Mais de 15 estilos",
        text: "Da Pilsen clássica aos chopes de vinho, IPAs e sours frutadas. Tem o chope certo pra cada momento e paladar.",
      },
    ],
    serviceHighlight: {
      title: "Vai preparar um evento em Foz?",
      text: "Festa, casamento ou confraternização da empresa? A Patanegra monta a experiência completa de chopeira: instalação técnica profissional, barris de 30L e 50L e a garantia de eficiência e qualidade do produto. E pra você não errar na quantidade, eles têm uma calculadora de chopp no próprio site que estima exatamente quanto pedir, sem desperdício.",
      items: ["Chopeira profissional instalada", "Cilindro de CO₂", "Barris de 30L e 50L", "Copos (se necessário)"],
      image: "/images/parceiros/patanegra/branding/eventos.webp",
      ctaLabel: "Calcular e pedir no site",
    },
    menu: [
      {
        groupLabel: "Chopes mais pedidos — Growler 1L",
        cols: 3,
        items: [
          { name: "Pilsen Cristal", desc: "Clara, leve e refrescante, de baixo amargor. A queridinha dos brasileiros.", badge: "Campeão de vendas", image: "/images/parceiros/patanegra/chopes/pilsen-cristal.webp" },
          { name: "Chopp de Vinho Branco", desc: "Fermentado de uvas Moscato, levemente adocicado. Perfeito pra dias quentes.", badge: "Mais pedido", image: "/images/parceiros/patanegra/chopes/vinho-branco.webp" },
          { name: "Chopp de Vinho Tinto", desc: "Uvas Isabel e Bordeaux, com perfil frisante e creme marcante.", badge: "Mais pedido", image: "/images/parceiros/patanegra/chopes/vinho-tinto.webp" },
          { name: "Session IPA", desc: "Leve, dourada e super refrescante, com amargor moderado e aroma cítrico intenso.", badge: "Mais pedido", image: "/images/parceiros/patanegra/chopes/session-ipa.webp" },
          { name: "Hefe Weiss", desc: "Cerveja de trigo turva e encorpada, com espuma espessa e notas de cravo e banana.", image: "/images/parceiros/patanegra/chopes/hefe-weiss.webp" },
          { name: "Sour Frutas Vermelhas", desc: "Coloração rosa, com morango, framboesa e amora. Corpo leve e acidez balanceada.", image: "/images/parceiros/patanegra/chopes/sour-frutas-vermelhas.webp" },
        ],
      },
      {
        groupLabel: "Barris para a sua festa, social ou evento",
        note: "Mais de 15 estilos disponíveis em barris de 30L e 50L. Fala com a gente pra montar o seu.",
        cols: 4,
        items: [
          { name: "Barril Pilsen 30L", desc: "Rende cerca de 60 copos de 500 ml. O clássico que agrada todo mundo.", badge: "Campeão de vendas", image: "/images/parceiros/patanegra/chopes/barril-pilsen.webp" },
          { name: "Barril Premium Lager 30L", desc: "Dourada, maltada e cremosa, de corpo médio e amargor moderado.", badge: "Mais pedido", image: "/images/parceiros/patanegra/chopes/barril-premium-lager.webp" },
          { name: "Barril Vinho Branco 30L", desc: "O nosso chopp de vinho Moscato em barril — levemente adocicado e refrescante, sucesso garantido.", badge: "Mais pedido", image: "/images/parceiros/patanegra/chopes/barril-vinho-branco.webp" },
          { name: "Barril Pilsen 50L", desc: "Pra festas grandes, com o melhor custo por litro.", badge: "Campeão de vendas", image: "/images/parceiros/patanegra/chopes/barril-pilsen-50.webp" },
        ],
      },
    ],
    awards: {
      image: "/images/parceiros/patanegra/premiacoes.webp",
      title: "A cervejaria de chope mais premiada de Foz",
      text: "Não é por acaso. A Patanegra é hoje a maior referência em chope especial de Foz do Iguaçu e região — reconhecida por qualidade e pureza nas principais premiações do setor.",
      points: [
        "Presente nos maiores e melhores eventos da região",
        "Nos principais pontos comerciais da cidade",
        "A escolha número 1 dos consumidores",
      ],
    },
    logo: "/images/parceiros/patanegra/logo.png",
    closing: {
      text: "Mais que cerveja, um estilo de vida. Peça o seu chopp Patanegra e entregamos o sabor e frescor gelado de fábrica até você — em Foz do Iguaçu e região.",
      image: "/images/parceiros/patanegra/fechamento.webp",
    },
  },
  {
    id: 2,
    slug: "cantina-la-gregoria",
    name: "Cantina La Gregoria",
    category: "gastronomia",
    businessType: "Pizzaria",
    country: "BR",
    featured: true,
    status: "active",
    // Recomendação Oficial EXCLUSIVA do nicho pizzaria no hub /onde-comer.
    niches: ["pizzaria"],
    seoTitle: "Cantina La Gregoria — Pizzaria e Rodízio de Pizza em Foz do Iguaçu",
    seoDescription:
      "Pizzaria italiana no Centro de Foz do Iguaçu: rodízio de terça a sexta, pizza à la carte do brotinho à gigante, massa artesanal, pizza de chocolate, calzones e vinhos selecionados. Delivery e reservas.",
    tagline:
      "A pizzaria mais charmosa de Foz do Iguaçu: pizza artesanal em rodízio, à la carte e delivery — massa no ponto e aquele capricho de família.",
    description: [
      "No coração do Centro de Foz do Iguaçu, a Cantina La Gregoria traz o aconchego de uma verdadeira cantina italiana. A pizza é feita com massa artesanal, ingredientes selecionados e o capricho de quem trata pizza como arte — do clássico salgado à surpreendente pizza de chocolate.",
      "De terça a domingo, você escolhe: o rodízio, para provar de tudo à vontade, ou o à la carte, para montar a sua no tamanho que quiser — do brotinho à gigante. E se a vontade bater em casa, o delivery leva a La Gregoria até você.",
    ],
    address: "R. Alm. Barroso, 1466 - Sl 04",
    neighborhood: "Foz do Iguaçu",
    city: "Foz do Iguaçu",
    state: "PR",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Cantina%20La%20Gregoria%2C%20R.%20Alm.%20Barroso%2C%201466%20-%20Centro%2C%20Foz%20do%20Igua%C3%A7u%20-%20PR%2C%2085851-010",
    ctaUrl: "https://pedir.delivery/app/cantinalagregoria/menu",
    ctaLabel: "Cardápio/pedido",
    whatsapp: "5545998488958",
    whatsappMessage:
      "Olá, Cantina La Gregoria! Vim pelo site da Compras Paraguay e quero fazer um pedido ou uma reserva. Podem me ajudar?",
    instagram: "cantinalagregoria",
    facebook: "https://www.facebook.com/cantinalagregoria",
    cover: "/images/parceiros/cantina-la-gregoria/cover.webp",
    gallery: [
      "/images/parceiros/cantina-la-gregoria/branding/1.webp",
      "/images/parceiros/cantina-la-gregoria/branding/2.webp",
      "/images/parceiros/cantina-la-gregoria/branding/3.webp",
    ],
    highlights: ["Rodízio", "À la carte", "Delivery", "Massa artesanal", "Pizza de chocolate", "Vinhos selecionados"],
    priceRange: "$$",
    hours: [
      "Terça a domingo: 18h30 às 23h00",
      "Segunda-feira: fechado",
      "Rodízio e à la carte, de terça a domingo",
    ],
    features: [
      {
        iconName: "Wheat",
        title: "Massa artesanal",
        text: "Massa feita no capricho, na fermentação e no ponto certos — a base de uma pizza que é levada a sério, do brotinho à gigante.",
      },
      {
        iconName: "Sparkles",
        title: "Rodízio à vontade",
        text: "De terça a domingo, o rodízio traz uma variedade de sabores salgados e doces para você provar de tudo, sem pressa.",
      },
      {
        iconName: "Truck",
        title: "Delivery",
        text: "A pizza da La Gregoria quentinha na sua casa ou no hotel — perfeita para relaxar depois de um dia de passeios em Foz do Iguaçu.",
      },
      {
        iconName: "Award",
        title: "Cantina italiana",
        text: "O aconchego de uma cantina de verdade, no Centro de Foz, com uma carta de vinhos selecionados para acompanhar.",
      },
    ],
    serviceHighlight: {
      title: "Uma noite especial em Foz do Iguaçu?",
      text: "Aniversário, encontro a dois ou aquele jantar em família: a Cantina La Gregoria tem o ambiente aconchegante, a pizza no capricho e uma carta de vinhos selecionados para tornar a noite memorável. Faça sua reserva pelo WhatsApp e garanta a sua mesa.",
      items: ["Reservas pelo WhatsApp", "Ambiente aconchegante de cantina", "Vinhos selecionados", "Rodízio ou à la carte"],
      image: "/images/parceiros/cantina-la-gregoria/branding/ambiente.webp",
      ctaLabel: "Reservar pelo WhatsApp",
      ctaWhatsapp: true,
      imageSquare: true,
    },
    // Cardápio só-imagem (sem nome/desc por item): a galeria fala por si; o cardápio completo fica no botão de pedido.
    menu: [
      {
        groupLabel: "Perfeito para cada momento — do brotinho à gigante",
        cols: 3,
        items: [
          { image: "/images/parceiros/cantina-la-gregoria/pizzas/1.webp" },
          { image: "/images/parceiros/cantina-la-gregoria/pizzas/2.webp" },
          { image: "/images/parceiros/cantina-la-gregoria/pizzas/3.webp" },
        ],
      },
      {
        groupLabel: "Massa tradicional, massa de chocolate, calzones e vinhos",
        note: "Sabores salgados e doces no rodízio, de terça a domingo.",
        cols: 3,
        items: [
          { image: "/images/parceiros/cantina-la-gregoria/pizzas/4.webp" },
          { image: "/images/parceiros/cantina-la-gregoria/pizzas/5.webp" },
          { image: "/images/parceiros/cantina-la-gregoria/pizzas/6.webp" },
        ],
      },
    ],
    logo: "/images/parceiros/cantina-la-gregoria/logo.png",
    closing: {
      text: "Mais que uma pizzaria, uma cantina. Venha viver a experiência da Cantina La Gregoria no coração de Foz do Iguaçu — ou peça o delivery e traga o capricho italiano para a sua mesa.",
      image: "/images/parceiros/cantina-la-gregoria/fechamento.webp",
    },
  },
];

/** Parceiros ativos (oculta rascunhos). */
export const activePartners = partners.filter((p) => p.status !== "draft");

export const getPartnerBySlug = (slug: string): Partner | undefined =>
  partners.find((p) => p.slug === slug);

export const getPartnersByCategory = (category: PartnerCategory): Partner[] =>
  activePartners.filter((p) => p.category === category);

/**
 * Parceiro EXCLUSIVO de um nicho (a "Recomendação Oficial" da página `/<nicho>`).
 * Retorna o primeiro parceiro ATIVO cujo `niches` inclui a chave — só deve existir um por nicho
 * (exclusividade comercial). NÃO considera o toggle do admin: quem intersecta com `getEnabledSlugs`
 * é o componente `NicheRecommendation` (para a página herdar a dependência de cache/tag).
 */
export const getPartnerForNiche = (nicheKey: string): Partner | undefined =>
  activePartners.find((p) => p.niches?.includes(nicheKey));
