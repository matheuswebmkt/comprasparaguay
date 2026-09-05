// Filepath: lib/i18n/home.ts
// Version: 3.1
// Nome da Versão: "CTA da navbar alinhado ao rótulo único de /montar-roteiro em en/es — §21.8"
//
// Só strings de UI fixa. `exploreFoz` e `buyTicketButton` não existem: o primeiro morreu junto com
// o componente `ExploreFoz` (virou `PilaresFoz`), o segundo era chave morta.

import type { Locale } from "./config";

export interface RichPart {
  text: string;
  strong?: boolean;
}

export interface HomeUI {
  navbar: {
    brand: string;
    home: string;
    whatToDo: string;
    oQueFazer: string;
    whereToEat: string;
    itinerary: string;
    transfer: string;
    tripleFrontier: string;
    cta: string;
    openMenu: string;
    closeMenu: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    items: { q: string; a: string }[];
  };
  partnerSection: {
    ctaDefault: string;
    viewMore: string;
  };
  footer: {
    tagline: string;
    followUs: string;
    roteirosLink: string;
    aboutLink: string;
    legalLink: string;
    contactLink: string;
    disclaimer: string;
  };
  hero: {
    h1Before: string;
    h1Strong: string;
    h1After: string;
    subtitle: string;
  };
  constelacao: {
    coreLabel: string;
    dayChip: (cur: number, total: number) => string;
    /** Legenda do dia na constelação da home. ⚠️ É ESTE array que aparece na tela — o campo
     *  `tema` do `RoteiroConstelacao` é só `key` do React. Os dois precisam contar a MESMA
     *  história do roteiro `3-dias-classico`; mexeu num, confira o outro. */
    themes: string[];
    turnos: { manha: string; tarde: string; porDoSol: string; noite: string };
    pickDayLabel: string;
    pickDayAria: (n: number, tema: string) => string;
  };
  dores: {
    eyebrow: string;
    title: string;
    titleDestaque: string;
    subtitle: string;
    items: string[];
    bridge: string;
  };
  autoridade: {
    eyebrow: string;
    title: string;
    titleDestaque: string;
    subtitle: string;
    imgAlt: string;
    passos: { n: string; titulo: string; texto: string }[];
    afirma1: string;
    afirma2: string;
    afirma3: string;
  };
  pilares: {
    eyebrow: string;
    items: { href: string; label: string; hint: string }[];
  };
  ctaFinal: {
    title: string;
    subtitle: string;
  };
  roteirosHome: {
    eyebrow: string;
    title: string;
    titleDestaque: string;
    subtitle: string;
    countLine: (n: number) => string;
    or: string;
    ctaFazer: string;
  };
}

export const HOME_UI: Record<Locale, HomeUI> = {
  pt: {
    navbar: {
      brand: "Compras Paraguay",
      home: "Início",
      whatToDo: "Atrativos",
      oQueFazer: "O que fazer",
      whereToEat: "Onde comer",
      itinerary: "Compras",
      transfer: "Transfer",
      tripleFrontier: "Tríplice Fronteira",
      cta: "Fazer meu roteiro",
      openMenu: "Abrir menu",
      closeMenu: "Fechar menu",
    },
    faq: {
      eyebrow: "Perguntas frequentes",
      title: "Roteiros e Foz do Iguaçu",
      items: [
        {
          q: "O que fazer em Foz do Iguaçu em 3 dias?",
          a: "No Clássico: Cataratas + Parque das Aves, Itaipu e Marco, e um dia de fronteira/compras. Há também Aventura & Natureza (Macuco, Argentina) e Compras & Gastronomia — três ritmos no hub de roteiros.",
        },
        {
          q: "Quantos dias preciso em Foz do Iguaçu?",
          a: "Três dias cobrem o essencial sem correria: Cataratas, Itaipu, Parque das Aves e um dia de fronteira. Com um ou dois dias dá para aproveitar muito, desde que a ordem das atrações seja bem resolvida — é justamente isso que o roteiro define.",
        },
        {
          q: "Os roteiros incluem ingressos e transporte?",
          a: "Sim, entram no planejamento. Seu roteiro considera ingressos, deslocamentos e transfer quando fizerem sentido para os seus dias, junto com horários e a ordem que evita atravessar a cidade sem necessidade.",
        },
        {
          q: "Posso ajustar um roteiro pronto?",
          a: "Pode. Os roteiros prontos são o ponto de partida — duração, ritmo, fronteiras e quem viaja com você são ajustados no seu.",
        },
        {
          q: "O que fazer em Foz além das Cataratas?",
          a: "Parque das Aves, Itaipu, Marco das Três Fronteiras, parques, shoppings e gastronomia local. O hub de atrativos e os roteiros encaixam tudo por turno do dia.",
        },
        {
          q: "Dá para visitar os três países?",
          a: "Sim. Foz faz parte da Tríplice Fronteira: em poucos minutos você acessa Puerto Iguazú (Argentina) e Ciudad del Este (Paraguai). Há roteiros de Compras & Gastronomia para isso.",
        },
        {
          q: "Quanto custa conhecer Foz do Iguaçu?",
          a: "Depende de quantos dias você fica, de quais atrações entram e de quando você vai — ingressos, câmbio e alta temporada mudam bastante a conta. Por isso o valor não sai de uma tabela genérica: ele é fechado em cima do roteiro montado para os seus dias.",
        },
        {
          q: "Como recebo meu roteiro?",
          a: "Responda às perguntas do roteiro — leva menos de dois minutos. Um especialista que vive em Foz revisa suas respostas, ajusta a logística e monta a versão final dos seus dias na cidade.",
        },
      ],
    },
    partnerSection: {
      ctaDefault: "Acessar",
      viewMore: "Ver mais detalhes",
    },
    footer: {
      tagline: "Planejamento de roteiros e experiências em Foz do Iguaçu.",
      followUs: "Siga-nos",
      roteirosLink: "Compras no Paraguai",
      aboutLink: "Sobre",
      legalLink: "Aviso Legal",
      contactLink: "Contato",
      disclaimer:
        "O Compras Paraguay é um portal independente de curadoria turística. Não somos vendedores diretos de roteiros, transfers, hospedagens ou ingressos nem processamos pagamentos. Marcas e atrativos mencionados pertencem aos seus detentores. Orçamentos, reservas e emissões são operados por agências e parceiros homologados.",
    },
    hero: {
      h1Before: "Seu ",
      h1Strong: "roteiro de compras",
      h1After: " em Ciudad del Este",
      subtitle:
        "Onde comprar, horários da ponte, dicas de fronteira e o que vale a pena levar — organizado por quem entende de compras no Paraguai.",
    },
    constelacao: {
      coreLabel: "você",
      dayChip: (cur, total) => `Dia ${cur} de ${total}`,
      themes: ["Compras no Paraguai", "Shoppings da fronteira", "Compras, duty free e noite"],
      turnos: { manha: "Manhã", tarde: "Tarde", porDoSol: "Pôr do sol", noite: "Noite" },
      pickDayLabel: "Escolher o dia do roteiro",
      pickDayAria: (n, tema) => `Dia ${n} — ${tema}`,
    },
    dores: {
      eyebrow: "O cenário",
      title: "Foz é incrível. Mas planejar Foz é outra história.",
      titleDestaque: "planejar",
      subtitle: "Quem planeja Foz por conta própria conhece cada um desses momentos:",
      items: [
        "Diversas abas abertas, horas de pesquisa",
        "Dezenas de atrativos — por onde começar?",
        "Perder o melhor horário de cada lugar",
        "Quanto gastar? O que cabe no seu orçamento",
        "Cotas no Paraguai, peso argentino, Duty Free",
        "Descobrir o que reservar antes só na fila",
        "A logística toma o tempo do passeio",
        "Voltar de Foz sem ter visto o essencial",
      ],
      bridge: "É para resolver exatamente isso que o Compras Paraguay existe.",
    },
    autoridade: {
      eyebrow: "A nossa resposta",
      title: "Nada é automático. É feito por especialistas em Foz.",
      titleDestaque: "especialistas",
      subtitle:
        "Qualquer site gera um roteiro em segundos. O que ninguém automatiza é um especialista em Foz olhando para as suas respostas.",
      imgAlt: "Especialista em Foz do Iguaçu da Compras Paraguay",
      passos: [
        {
          n: "1",
          titulo: "Você define suas preferências",
          texto:
            "Quantos dias tem, com quem viaja, o ritmo que prefere e o que não pode ficar de fora.",
        },
        {
          n: "2",
          titulo: "Um especialista em Foz revisa",
          texto:
            "Alguém de verdade confere a logística real da cidade e ajusta a ordem das atrações.",
        },
        {
          n: "3",
          titulo: "Você recebe seu roteiro planejado",
          texto:
            "O que vale a pena, quanto tempo reservar em cada atração e o que deixar de fora.",
        },
      ],
      afirma1: "Atendimento personalizado de máxima qualidade — é o nosso compromisso.",
      afirma2: "Revisado por um especialista em Foz do Iguaçu. Nada aqui é gerado automático.",
      afirma3: "O roteiro é montado para o seu orçamento — feito com suas preferências.",
    },
    pilares: {
      eyebrow: "Explore a fronteira",
      items: [
        { href: "/atrativos/compras-paraguai-ciudad-del-este", label: "Compras no Paraguai", hint: "O que comprar e horários" },
        { href: "/atrativos", label: "Compras e shoppings", hint: "Ciudad del Este e duty free" },
        { href: "/o-que-fazer", label: "O que fazer", hint: "Foz e a Tríplice Fronteira" },
        { href: "/transfer", label: "Transfer", hint: "Chegar e voltar" },
        { href: "/triplice-fronteira", label: "Tríplice Fronteira", hint: "Brasil, Argentina e Paraguai" },
      ],
    },
    ctaFinal: {
      title: "Não vá para a ponte sem um plano.",
      subtitle:
        "Um roteiro de compras bem organizado economiza seu tempo e seu dinheiro em Ciudad del Este. Receba o seu com as melhores lojas e os horários que importam.",
    },
    roteirosHome: {
      eyebrow: "Roteiros prontos",
      title: "Escolha o roteiro ideal para o tempo que você tem em Foz.",
      titleDestaque: "roteiro ideal",
      subtitle:
        "Roteiros feitos sob medida para 1, 2 ou 3 dias, organizados em diferentes ritmos para você aproveitar melhor Foz do Iguaçu.",
      countLine: (n) => `São ${n} recomendações prontas pra você escolher.`,
      or: "ou",
      ctaFazer: "fazer o seu roteiro",
    },
  },
  en: {
    navbar: {
      brand: "Compras Paraguay",
      home: "Home",
      whatToDo: "Attractions",
      oQueFazer: "What to do",
      whereToEat: "Where to eat",
      itinerary: "Shopping",
      transfer: "Transfer",
      tripleFrontier: "Triple Frontier",
      cta: "Make my itinerary",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    faq: {
      eyebrow: "Frequently asked questions",
      title: "Itineraries and Foz do Iguaçu",
      items: [
        {
          q: "What to do in Foz do Iguaçu in 3 days?",
          a: "In the Classic: Falls + Bird Park, Itaipu and the Landmark, and a border/shopping day. There's also Adventure & Nature (Macuco, Argentina) and Shopping & Food — three paces on the itineraries hub.",
        },
        {
          q: "How many days do I need in Foz do Iguaçu?",
          a: "Three days cover the essentials without rushing: the Falls, Itaipu, the Bird Park and a border day. With one or two days you can still enjoy a lot, as long as the order of attractions is well sorted — that's exactly what the itinerary defines.",
        },
        {
          q: "Do the itineraries include tickets and transport?",
          a: "Yes, they're part of the planning. Your itinerary takes into account tickets, travel and transfers when they make sense for your days, along with timings and an order that avoids crossing the city unnecessarily.",
        },
        {
          q: "Can I adjust a ready-made itinerary?",
          a: "Yes. The ready-made itineraries are the starting point — duration, pace, borders and who travels with you are adjusted in yours.",
        },
        {
          q: "What to do in Foz besides the Falls?",
          a: "The Bird Park, Itaipu, the Three Borders Landmark, parks, malls and local food. The attractions hub and the itineraries fit everything into day turns.",
        },
        {
          q: "Can I visit all three countries?",
          a: "Yes. Foz is part of the Triple Frontier: within minutes you can reach Puerto Iguazú (Argentina) and Ciudad del Este (Paraguay). There are Shopping & Food itineraries for that.",
        },
        {
          q: "How much does it cost to visit Foz do Iguaçu?",
          a: "It depends on how many days you stay, which attractions are included and when you go — tickets, exchange rates and high season change the bill a lot. That's why the price doesn't come from a generic table: it's closed based on the itinerary built for your days.",
        },
        {
          q: "How do I receive my itinerary?",
          a: "Answer the itinerary questions — it takes less than two minutes. A specialist who lives in Foz reviews your answers, adjusts the logistics and puts together the final version of your days in the city.",
        },
      ],
    },
    partnerSection: {
      ctaDefault: "Access",
      viewMore: "See more details",
    },
    footer: {
      tagline: "Itinerary planning and experiences in Foz do Iguaçu.",
      followUs: "Follow us",
      roteirosLink: "Shopping in Paraguay",
      aboutLink: "About",
      legalLink: "Legal notice",
      contactLink: "Contact",
      disclaimer:
        "Compras Paraguay is an independent tourism curation portal. We are not direct sellers of itineraries, transfers, accommodation or tickets, nor do we process payments. Mentioned brands and attractions belong to their owners. Quotes, bookings and issuances are operated by accredited agencies and partners.",
    },
    hero: {
      h1Before: "Your ",
      h1Strong: "shopping guide",
      h1After: " for Ciudad del Este",
      subtitle:
        "Where to shop, bridge hours, border tips and what's worth bringing back — organized by people who know shopping in Paraguay.",
    },
    constelacao: {
      coreLabel: "you",
      dayChip: (cur, total) => `Day ${cur} of ${total}`,
      themes: ["Nature and sunset", "Itaipu and dinner", "Temple, aquarium and parks"],
      turnos: { manha: "Morning", tarde: "Afternoon", porDoSol: "Sunset", noite: "Evening" },
      pickDayLabel: "Choose the itinerary day",
      pickDayAria: (n, tema) => `Day ${n} — ${tema}`,
    },
    dores: {
      eyebrow: "The scenario",
      title: "Foz is incredible. Planning Foz is another story.",
      titleDestaque: "Planning",
      subtitle: "Anyone who plans Foz on their own knows each of these moments:",
      items: [
        "Several tabs open, hours of research",
        "Dozens of attractions — where to start?",
        "Missing the best time of day at every place",
        "How much to spend? What fits your budget",
        "Quotas in Paraguay, Argentine pesos, Duty Free",
        "Finding out what to book in advance only in line",
        "Logistics eats up the time of the outing",
        "Leaving Foz without seeing the essentials",
      ],
      bridge: "It's exactly this that Compras Paraguay exists to solve.",
    },
    autoridade: {
      eyebrow: "Our answer",
      title: "Nothing is automatic. It's made by specialists in Foz.",
      titleDestaque: "specialists",
      subtitle:
        "Any website can generate an itinerary in seconds. What no one automates is a specialist in Foz looking at your answers.",
      imgAlt: "Compras Paraguay specialist in Foz do Iguaçu",
      passos: [
        {
          n: "1",
          titulo: "You set your preferences",
          texto:
            "How many days you have, who you travel with, the pace you prefer and what can't be left out.",
        },
        {
          n: "2",
          titulo: "A specialist in Foz reviews it",
          texto:
            "A real person checks the city's actual logistics and adjusts the order of the attractions.",
        },
        {
          n: "3",
          titulo: "You receive your planned itinerary",
          texto:
            "What's worth it, how long to spend at each attraction and what to leave out.",
        },
      ],
      afirma1: "Personal service of the highest quality — that's our commitment.",
      afirma2: "Reviewed by a specialist in Foz do Iguaçu. Nothing here is auto-generated.",
      afirma3: "The itinerary is built around your budget — made with your preferences.",
    },
    pilares: {
      eyebrow: "Explore the frontier",
      items: [
        { href: "/atrativos/compras-paraguai-ciudad-del-este", label: "Shopping in Paraguay", hint: "What to buy and hours" },
        { href: "/atrativos", label: "Shopping & malls", hint: "Ciudad del Este and duty free" },
        { href: "/o-que-fazer", label: "What to do", hint: "Foz and the Triple Frontier" },
        { href: "/transfer", label: "Transfer", hint: "Getting there and back" },
        { href: "/triplice-fronteira", label: "Triple Frontier", hint: "Brazil, Argentina and Paraguay" },
      ],
    },
    ctaFinal: {
      title: "Don't cross the bridge without a plan.",
      subtitle:
        "A well-organized shopping guide saves your time and money in Ciudad del Este. Get yours with the best stores and the hours that matter.",
    },
    roteirosHome: {
      eyebrow: "Ready-made itineraries",
      title: "Choose the ideal itinerary for the time you have in Foz.",
      titleDestaque: "ideal itinerary",
      subtitle:
        "Itineraries made to measure for 1, 2 or 3 days, organized in different paces so you can make the most of Foz do Iguaçu.",
      countLine: (n) => `There are ${n} ready-made recommendations for you to choose from.`,
      or: "or",
      ctaFazer: "make your own itinerary",
    },
  },
  es: {
    navbar: {
      brand: "Compras Paraguay",
      home: "Inicio",
      whatToDo: "Atractivos",
      oQueFazer: "Qué hacer",
      whereToEat: "Dónde comer",
      itinerary: "Compras",
      transfer: "Transfer",
      tripleFrontier: "Triple Frontera",
      cta: "Hacer mi itinerario",
      openMenu: "Abrir menú",
      closeMenu: "Cerrar menú",
    },
    faq: {
      eyebrow: "Preguntas frecuentes",
      title: "Itinerarios y Foz do Iguaçu",
      items: [
        {
          q: "¿Qué hacer en Foz do Iguaçu en 3 días?",
          a: "En el Clásico: Cataratas + Parque de las Aves, Itaipú y el Marco, y un día de frontera/compras. También hay Aventura & Naturaleza (Macuco, Argentina) y Compras & Gastronomía — tres ritmos en el hub de itinerarios.",
        },
        {
          q: "¿Cuántos días necesito en Foz do Iguaçu?",
          a: "Tres días cubren lo esencial sin apuros: Cataratas, Itaipú, Parque de las Aves y un día de frontera. Con uno o dos días se puede aprovechar mucho, siempre que el orden de los atractivos quede bien resuelto — justamente eso es lo que define el itinerario.",
        },
        {
          q: "¿Los itinerarios incluyen entradas y transporte?",
          a: "Sí, entran en la planificación. Tu itinerario considera entradas, trayectos y transfer cuando tienen sentido para tus días, junto con horarios y un orden que evita cruzar la ciudad sin necesidad.",
        },
        {
          q: "¿Puedo ajustar un itinerario listo?",
          a: "Sí. Los itinerarios listos son el punto de partida — la duración, el ritmo, las fronteras y quién viaja contigo se ajustan en el tuyo.",
        },
        {
          q: "¿Qué hacer en Foz además de las Cataratas?",
          a: "Parque de las Aves, Itaipú, el Marco de las Tres Fronteras, parques, shoppings y gastronomía local. El hub de atractivos y los itinerarios encajan todo por turno del día.",
        },
        {
          q: "¿Se pueden visitar los tres países?",
          a: "Sí. Foz forma parte de la Triple Frontera: en pocos minutos accedes a Puerto Iguazú (Argentina) y Ciudad del Este (Paraguay). Hay itinerarios de Compras & Gastronomía para eso.",
        },
        {
          q: "¿Cuánto cuesta conocer Foz do Iguaçu?",
          a: "Depende de cuántos días te quedes, qué atractivos entren y cuándo vayas — las entradas, el tipo de cambio y la temporada alta cambian bastante la cuenta. Por eso el valor no sale de una tabla genérica: se cierra sobre el itinerario armado para tus días.",
        },
        {
          q: "¿Cómo recibo mi itinerario?",
          a: "Responde las preguntas del itinerario — toma menos de dos minutos. Un especialista que vive en Foz revisa tus respuestas, ajusta la logística y arma la versión final de tus días en la ciudad.",
        },
      ],
    },
    partnerSection: {
      ctaDefault: "Acceder",
      viewMore: "Ver más detalles",
    },
    footer: {
      tagline: "Planificación de itinerarios y experiencias en Foz do Iguaçu.",
      followUs: "Síguenos",
      roteirosLink: "Compras en Paraguay",
      aboutLink: "Sobre",
      legalLink: "Aviso legal",
      contactLink: "Contacto",
      disclaimer:
        "Compras Paraguay es un portal independiente de curaduría turística. No somos vendedores directos de itinerarios, transfers, alojamientos ni entradas, ni procesamos pagos. Las marcas y atractivos mencionados pertenecen a sus titulares. Los presupuestos, reservas y emisiones son operados por agencias y socios acreditados.",
    },
    hero: {
      h1Before: "Tu ",
      h1Strong: "guía de compras",
      h1After: " en Ciudad del Este",
      subtitle:
        "Dónde comprar, horarios del puente, consejos de frontera y qué vale la pena llevar — organizado por quienes saben de compras en Paraguay.",
    },
    constelacao: {
      coreLabel: "tú",
      dayChip: (cur, total) => `Día ${cur} de ${total}`,
      themes: ["Naturaleza y atardecer", "Itaipú y cena", "Templo, acuario y parques"],
      turnos: { manha: "Mañana", tarde: "Tarde", porDoSol: "Atardecer", noite: "Noche" },
      pickDayLabel: "Elegir el día del itinerario",
      pickDayAria: (n, tema) => `Día ${n} — ${tema}`,
    },
    dores: {
      eyebrow: "El escenario",
      title: "Foz es increíble. Planear Foz es otra historia.",
      titleDestaque: "Planear",
      subtitle: "Quien planea Foz por su cuenta conoce cada uno de estos momentos:",
      items: [
        "Varias pestañas abiertas, horas de investigación",
        "Decenas de atractivos — ¿por dónde empezar?",
        "Perder el mejor horario de cada lugar",
        "¿Cuánto gastar? Lo que cabe en tu presupuesto",
        "Cuotas en Paraguay, peso argentino, Duty Free",
        "Descubrir qué reservar antes recién en la fila",
        "La logística se come el tiempo del paseo",
        "Volver de Foz sin haber visto lo esencial",
      ],
      bridge: "Es exactamente para resolver esto que existe Compras Paraguay.",
    },
    autoridade: {
      eyebrow: "Nuestra respuesta",
      title: "Nada es automático. Está hecho por especialistas en Foz.",
      titleDestaque: "especialistas",
      subtitle:
        "Cualquier sitio web genera un itinerario en segundos. Lo que nadie automatiza es un especialista en Foz mirando tus respuestas.",
      imgAlt: "Especialista en Foz do Iguaçu de Compras Paraguay",
      passos: [
        {
          n: "1",
          titulo: "Tú defines tus preferencias",
          texto:
            "Cuántos días tienes, con quién viajas, el ritmo que prefieres y lo que no puede faltar.",
        },
        {
          n: "2",
          titulo: "Un especialista en Foz lo revisa",
          texto:
            "Una persona real comprueba la logística real de la ciudad y ajusta el orden de los atractivos.",
        },
        {
          n: "3",
          titulo: "Recibes tu itinerario planificado",
          texto:
            "Lo que vale la pena, cuánto tiempo reservar en cada atractivo y qué dejar fuera.",
        },
      ],
      afirma1: "Atención personalizada de máxima calidad — es nuestro compromiso.",
      afirma2: "Revisado por un especialista en Foz do Iguaçu. Nada aquí es generado automáticamente.",
      afirma3: "El itinerario se arma para tu presupuesto — hecho con tus preferencias.",
    },
    pilares: {
      eyebrow: "Explora la frontera",
      items: [
        { href: "/atrativos/compras-paraguai-ciudad-del-este", label: "Compras en Paraguay", hint: "Qué comprar y horarios" },
        { href: "/atrativos", label: "Compras y shoppings", hint: "Ciudad del Este y duty free" },
        { href: "/o-que-fazer", label: "Qué hacer", hint: "Foz y la Triple Frontera" },
        { href: "/transfer", label: "Transfer", hint: "Ir y volver" },
        { href: "/triplice-fronteira", label: "Triple Frontera", hint: "Brasil, Argentina y Paraguay" },
      ],
    },
    ctaFinal: {
      title: "No cruces el puente sin un plan.",
      subtitle:
        "Una guía de compras bien organizada ahorra tu tiempo y tu dinero en Ciudad del Este. Recibe la tuya con las mejores tiendas y los horarios que importan.",
    },
    roteirosHome: {
      eyebrow: "Itinerarios listos",
      title: "Elige el itinerario ideal para el tiempo que tienes en Foz.",
      titleDestaque: "itinerario ideal",
      subtitle:
        "Itinerarios hechos a medida para 1, 2 o 3 días, organizados en diferentes ritmos para que aproveches mejor Foz do Iguaçu.",
      countLine: (n) => `Hay ${n} recomendaciones listas para que elijas.`,
      or: "o",
      ctaFazer: "hacer tu propio itinerario",
    },
  },
};
