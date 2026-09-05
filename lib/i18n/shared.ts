// Filepath: lib/i18n/shared.ts
// Version: 1.2
// Nome da Versão: "Tradução única de 'Fazer meu roteiro' em en/es (make/hacer) — §21.8"
//
// Mesma estratégia de lib/i18n/home.ts: só strings de UI fixa. Nomes de nicho (app/data/niches.ts) e dados
// de atrativos/parceiros (app/data/attractions.ts, app/data/partners.ts) NÃO entram aqui — ficam intactos em
// qualquer idioma (fase futura, ver memória i18n-architecture). O eyebrow/título/corpo do `PartnerPicks`
// (seção "vitrine de parceiros" das páginas de SEO) reaproveita literalmente `HOME_UI[locale].hookHero`
// (mesma copy no código-fonte atual) — não duplicado aqui.

import type { Locale } from "./config";

export interface SharedUI {
  partnerCard: {
    ctaDefault: string;
    viewMore: string;
    /** Setas da galeria do card (aria-label). */
    prevImage: string;
    nextImage: string;
  };
  nicheLinks: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  relatedAttractions: {
    eyebrow: string;
    title: string;
    subtitle: string;
    /* ⚠️ Saiu `dragHint` ("Arraste para o lado →"). O carrossel ganhou setas de verdade, e o
       texto (a) narrava a interface, (b) assumia arrasto — no desktop é scroll ou seta.
       Os dois rótulos abaixo são só para leitor de tela: os botões mostram um chevron. */
    prevLabel: string;
    nextLabel: string;
  };
  attractionCard: {
    learnMore: string;
  };
  /** CTA de fechamento → hub de roteiros. */
  roteirosCta: {
    title: string;
    text: string;
    /** Botão dourado → /montar-roteiro. */
    ctaPrincipal: string;
    /** Link de texto → /roteiros. */
    ctaProntos: string;
    /** CTA dourado do funil de compras (hero + CtaFinal + card/página de atrativo): abre o modal e a
     * pessoa cai no calendário. ⚠️ É o MESMO texto de `ATTRACTION_DETAIL_UI.ctaReserva` nos 3 idiomas
     * (§21.8-6: um PT, uma tradução). */
    ctaReserva: string;
    /** Título/subtítulo do card do assunto dentro do modal quando o clique vem de um CTA genérico de
     * reserva. Vem daqui e não de `app/data/attractions.ts`: o catálogo é conteúdo pesado e não entra
     * no bundle de quem só mostra o botão. */
    reservaSubject: string;
    reservaSubjectSub: string;
    /** Linha de rodapé dos fechamentos ("Leva menos de 2 minutos · …"). */
    footnote: string;
  };
  attractionsSection: {
    eyebrow: string;
    title: string;
    subtitle: string;
    viewAllLabel: string;
  };
  /** Seção "Atrativos em destaque" — compartilhada entre home, /o-que-fazer e /roteiros. */
  atrativosDestaque: {
    eyebrow: string;
    title: string;
    titleDestaque: string;
    subtitle: string;
    inviteText: string;
    cta: string;
  };
  /** Banner de cookies (componente global, sem CMP externo). */
  cookieBanner: {
    ariaLabel: string;
    textBefore: string;
    linkLabel: string;
    textAfter: string;
    accept: string;
  };
  /** Sidebar de contato (mini modal de contato e modais de detalhe). */
  contactSidebar: {
    title: string;
    whatsapp: string;
    visitSite: string;
    instagram: string;
    call: string;
    email: string;
    waFallback: (name: string) => string;
    ariaInstagram: (name: string) => string;
    ariaPhone: (name: string) => string;
    ariaEmail: (name: string) => string;
  };
  /** Card de recomendação de nicho (hospedagem/transfer). */
  nichePitch: {
    badge: string;
    footer: string;
    alt: (name: string, businessType: string, city: string) => string;
  };
}

export const SHARED_UI: Record<Locale, SharedUI> = {
  pt: {
    partnerCard: {
      ctaDefault: "Acessar",
      viewMore: "Ver mais detalhes",
      prevImage: "Imagem anterior",
      nextImage: "Próxima imagem",
    },
    nicheLinks: {
      eyebrow: "Guias por categoria",
      title: "Onde comer, beber e se hospedar em Foz",
      subtitle: "Guias diretos ao ponto para cada tipo de programa — com a recomendação da nossa equipe em cada um.",
    },
    relatedAttractions: {
      eyebrow: "Atrativos turísticos",
      title: "Atrativos imperdíveis de Foz do Iguaçu",
      subtitle: "Complete o seu roteiro com os principais pontos turísticos da região.",
      prevLabel: "Ver atrativos anteriores",
      nextLabel: "Ver próximos atrativos",
    },
    attractionCard: {
      learnMore: "Saber mais",
    },
    /* ⚠️ O `text` anterior era "Escolha um plano de 1 a 3 dias ou crie o seu e receba as
       condições da agência parceira." — duas violações do §21 numa frase: nomeava a AGÊNCIA
       PARCEIRA em copy de marketing (§21.5 só admite o termo na microcopy de LGPD e no
       disclaimer do footer, onde a lei exige) e antecipava o canal de atendimento, que §21.2
       proíbe antes do submit. Nenhuma das duas é pega pelo checker. */
    roteirosCta: {
      title: "Pronto para o seu roteiro de compras?",
      text: "Você conta o que quer comprar e um especialista em Ciudad del Este organiza a ordem do seu dia — lojas, horários e a travessia da ponte já resolvidos.",
      ctaPrincipal: "Quero meu roteiro de compras",
      ctaProntos: "Ver atrativos e shoppings",
      ctaReserva: "Reservar data",
      reservaSubject: "Compras no Paraguai — Ciudad del Este",
      reservaSubjectSub:
        "Dia de compras com carro privativo e guia especialista, saindo do seu hotel em Foz do Iguaçu",
      footnote: "Leva menos de 2 minutos",
    },
    attractionsSection: {
      eyebrow: "Atrativos turísticos",
      title: "Os atrativos imperdíveis da região",
      subtitle:
        "Das Cataratas a Itaipu, os principais pontos de Foz do Iguaçu e da Tríplice Fronteira para encaixar no seu roteiro.",
      viewAllLabel: "Ver o guia de atrativos de Foz",
    },
    atrativosDestaque: {
      eyebrow: "Pontos turísticos",
      title: "Atrativos em destaque",
      titleDestaque: "Atrativos",
      subtitle:
        "Quatro experiências para não errar: do cartão-postal de Foz do Iguaçu ao que costuma escapar da rota óbvia.",
      inviteText:
        "Esses são só o começo: o guia completo reúne dezenas de atrativos de Foz do Iguaçu e da Tríplice Fronteira.",
      cta: "Ver todos os atrativos",
    },
    cookieBanner: {
      ariaLabel: "Aviso de cookies",
      textBefore:
        "Usamos cookies e tecnologias semelhantes para melhorar sua experiência e medir a performance do site. Ao continuar navegando, você concorda com isso — saiba mais no nosso ",
      linkLabel: "Aviso Legal, Termos e Privacidade",
      textAfter: ".",
      accept: "Entendi",
    },
    contactSidebar: {
      title: "Contato",
      whatsapp: "WhatsApp",
      visitSite: "Visitar o site",
      instagram: "Instagram",
      call: "Ligar",
      email: "E-mail",
      waFallback: (name) => `Olá! Vim pelo site da Compras Paraguay e tenho interesse na ${name}.`,
      ariaInstagram: (name) => `Instagram de ${name}`,
      ariaPhone: (name) => `Telefone de ${name}`,
      ariaEmail: (name) => `E-mail de ${name}`,
    },
    nichePitch: {
      badge: "Recomendação Oficial",
      footer: "Recomendação exclusiva selecionada pela equipe da Compras Paraguay.",
      alt: (name, businessType, city) => `${name} — ${businessType} em ${city}`,
    },
  },
  en: {
    partnerCard: {
      ctaDefault: "Visit",
      viewMore: "See more details",
      prevImage: "Previous image",
      nextImage: "Next image",
    },
    nicheLinks: {
      eyebrow: "Guides by category",
      title: "Where to eat, drink and stay in Foz",
      subtitle: "Straight-to-the-point guides for every type of plan — with our team's recommendation in each one.",
    },
    relatedAttractions: {
      eyebrow: "Tourist attractions",
      title: "Must-see attractions in Foz do Iguaçu",
      subtitle: "Complete your itinerary with the region's main tourist spots.",
      prevLabel: "View previous attractions",
      nextLabel: "View next attractions",
    },
    attractionCard: {
      learnMore: "Learn more",
    },
    roteirosCta: {
      title: "Ready for your shopping plan?",
      text: "Tell us what you want to buy and a specialist in Ciudad del Este puts together the order of your day — stores, hours and the bridge crossing already sorted.",
      ctaPrincipal: "Get my shopping guide",
      ctaProntos: "See attractions and malls",
      ctaReserva: "Reserve a date",
      reservaSubject: "Shopping in Paraguay — Ciudad del Este",
      reservaSubjectSub:
        "A shopping day with a private car and an expert guide, leaving from your hotel in Foz do Iguaçu",
      footnote: "Takes less than 2 minutes",
    },
    attractionsSection: {
      eyebrow: "Tourist attractions",
      title: "Must-see attractions in the region",
      subtitle:
        "From the Falls to Itaipu — the main spots in Foz do Iguaçu and the Triple Frontier for your itinerary.",
      viewAllLabel: "See the Foz attractions guide",
    },
    atrativosDestaque: {
      eyebrow: "Tourist spots",
      title: "Featured attractions",
      titleDestaque: "Featured",
      subtitle:
        "Four experiences you can't miss: from Foz do Iguaçu's postcard to what usually escapes the obvious route.",
      inviteText:
        "These are just the beginning: the complete guide gathers dozens of attractions in Foz do Iguaçu and the Triple Frontier.",
      cta: "See all attractions",
    },
    cookieBanner: {
      ariaLabel: "Cookie notice",
      textBefore:
        "We use cookies and similar technologies to improve your experience and measure site performance. By continuing to browse, you agree to this — learn more in our ",
      linkLabel: "Legal Notice, Terms and Privacy",
      textAfter: ".",
      accept: "Got it",
    },
    contactSidebar: {
      title: "Contact",
      whatsapp: "WhatsApp",
      visitSite: "Visit the website",
      instagram: "Instagram",
      call: "Call",
      email: "Email",
      waFallback: (name) => `Hi! I came from the Compras Paraguay website and I'm interested in ${name}.`,
      ariaInstagram: (name) => `${name} on Instagram`,
      ariaPhone: (name) => `${name} phone`,
      ariaEmail: (name) => `${name} email`,
    },
    nichePitch: {
      badge: "Official Recommendation",
      footer: "Exclusive recommendation hand-picked by the Compras Paraguay team.",
      alt: (name, businessType, city) => `${name} — ${businessType} in ${city}`,
    },
  },
  es: {
    partnerCard: {
      ctaDefault: "Acceder",
      viewMore: "Ver más detalles",
      prevImage: "Imagen anterior",
      nextImage: "Imagen siguiente",
    },
    nicheLinks: {
      eyebrow: "Guías por categoría",
      title: "Dónde comer, beber y hospedarte en Foz",
      subtitle: "Guías directas al punto para cada tipo de plan — con la recomendación de nuestro equipo en cada una.",
    },
    relatedAttractions: {
      eyebrow: "Atractivos turísticos",
      title: "Atractivos imperdibles de Foz do Iguaçu",
      subtitle: "Completa tu itinerario con los principales puntos turísticos de la región.",
      prevLabel: "Ver atractivos anteriores",
      nextLabel: "Ver próximos atractivos",
    },
    attractionCard: {
      learnMore: "Saber más",
    },
    roteirosCta: {
      title: "¿Listo para tu plan de compras?",
      text: "Cuéntanos qué quieres comprar y un especialista en Ciudad del Este arma el orden de tu día — tiendas, horarios y el cruce del puente ya resueltos.",
      ctaPrincipal: "Quiero mi guía de compras",
      ctaProntos: "Ver atractivos y shoppings",
      ctaReserva: "Reservar fecha",
      reservaSubject: "Compras en Paraguay — Ciudad del Este",
      reservaSubjectSub:
        "Un día de compras con auto privado y guía especialista, saliendo desde tu hotel en Foz do Iguaçu",
      footnote: "Toma menos de 2 minutos",
    },
    attractionsSection: {
      eyebrow: "Atractivos turísticos",
      title: "Los atractivos imperdibles de la región",
      subtitle:
        "De las Cataratas a Itaipú — los principales puntos de Foz y la Triple Frontera para tu itinerario.",
      viewAllLabel: "Ver la guía de atractivos de Foz",
    },
    atrativosDestaque: {
      eyebrow: "Puntos turísticos",
      title: "Atractivos destacados",
      titleDestaque: "Atractivos",
      subtitle:
        "Cuatro experiencias infalibles: desde la postal de Foz do Iguaçu hasta lo que suele escapar de la ruta obvia.",
      inviteText:
        "Estos son solo el comienzo: la guía completa reúne decenas de atractivos de Foz do Iguaçu y la Triple Frontera.",
      cta: "Ver todos los atractivos",
    },
    cookieBanner: {
      ariaLabel: "Aviso de cookies",
      textBefore:
        "Usamos cookies y tecnologías similares para mejorar tu experiencia y medir el rendimiento del sitio. Al continuar navegando, aceptas esto — conoce más en nuestro ",
      linkLabel: "Aviso Legal, Términos y Privacidad",
      textAfter: ".",
      accept: "Entendido",
    },
    contactSidebar: {
      title: "Contacto",
      whatsapp: "WhatsApp",
      visitSite: "Visitar el sitio",
      instagram: "Instagram",
      call: "Llamar",
      email: "Email",
      waFallback: (name) => `¡Hola! Vine desde el sitio de Compras Paraguay y me interesa ${name}.`,
      ariaInstagram: (name) => `Instagram de ${name}`,
      ariaPhone: (name) => `Teléfono de ${name}`,
      ariaEmail: (name) => `Email de ${name}`,
    },
    nichePitch: {
      badge: "Recomendación Oficial",
      footer: "Recomendación exclusiva seleccionada por el equipo de Compras Paraguay.",
      alt: (name, businessType, city) => `${name} — ${businessType} en ${city}`,
    },
  },
};
