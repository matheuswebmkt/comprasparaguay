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
      whatToDo: "Roteiros de compras",
      transfer: "Transfer",
      tripleFrontier: "Tríplice Fronteira",
      cta: "Fazer meu roteiro",
      openMenu: "Abrir menu",
      closeMenu: "Fechar menu",
    },
    faq: {
      eyebrow: "Perguntas frequentes",
      title: "Suas dúvidas sobre as compras na fronteira",
      items: [
        {
          q: "O que dá para comprar em Ciudad del Este?",
          a: "Eletrônicos, perfumes, cosméticos, óculos, relógios, brinquedos e importados em geral, concentrados nos primeiros quarteirões depois da Ponte da Amizade. O comércio abre cedo e fecha no meio da tarde — por isso ele precisa ser a manhã do seu dia.",
        },
        {
          q: "Preciso de passaporte para ir ao Paraguai ou à Argentina?",
          a: "Brasileiros em geral entram com documento válido (RG em bom estado ou passaporte). Leve o documento original e atenção à cota da Receita na volta; menores e veículos têm regras extras.",
        },
        {
          q: "Dá para fazer Ciudad del Este e a Argentina no mesmo dia?",
          a: "Dá. A travessia da Ponte da Amizade leva à Ciudad del Este e a Ponte Tancredo Neves a Puerto Iguazú — os dois eixos de compras cabem no mesmo dia quando você planeja a ordem e respeita os horários de cada lado.",
        },
        {
          q: "O que é o Duty Free e o By Night em Puerto Iguazú?",
          a: "O Duty Free é o free shop argentino — perfumes, eletrônicos e bebidas importadas — aberto de dia. O By Night é a experiência de compras e gastronomia da noite argentina. Os dois ficam na mesma região e combinam no mesmo roteiro.",
        },
        {
          q: "Quais são os horários da Ponte da Amizade?",
          a: "A ponte funciona 24h, mas o comércio de Ciudad del Este abre por volta das 7h–8h e fecha entre 15h e 16h (sábado até o meio-dia; domingo quase tudo fechado). O horário de pico tem fila de carros — cruzar cedo faz diferença.",
        },
        {
          q: "Como funciona a cota de compras da Receita?",
          a: "Na volta ao Brasil vale a cota de compras da Receita Federal (por via terrestre, US$ 300 por pessoa em 2025 — confira sempre a regra atual). É bom ter as notas das compras à mão e declarar o que passar do limite.",
        },
        {
          q: "Quanto custa o meu roteiro de compras?",
          a: "O roteiro em si não tem tabela genérica: ele é montado em cima do que você quer comprar, do seu orçamento e dos dias disponíveis. Você recebe as condições e a melhor ordem para o seu dia de compras — sem surpresa na fronteira.",
        },
        {
          q: "Como recebo meu roteiro de compras?",
          a: "Deixe seus dados na página de qualquer destino de compras — leva menos de dois minutos. Um especialista que conhece a fronteira revisa suas escolhas e monta a versão final do seu dia: lojas, horários e a travessia certa.",
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
      title: "Comprar no Paraguai é tentador. Planejar a compra é outra história.",
      titleDestaque: "Planejar a compra",
      subtitle: "Quem faz compras na fronteira por conta própria conhece cada um desses momentos:",
      items: [
        "Horas de pesquisa entre lojas, câmbio e cota",
        "Dezenas de galerias em Ciudad del Este — por onde começar?",
        "Lojas que fecham no meio da tarde — e a fila da ponte",
        "Reais, pesos e guaranis: quanto vai custar de verdade?",
        "Cota da Receita e declaração — descobrir só na volta",
        "Perder a hora e voltar sem o que veio buscar",
        "A travessia e o transporte comem o tempo que seria de comprar",
        "Chegar sem saber qual loja tem o que você quer",
      ],
      bridge: "É para resolver exatamente isso que o Compras Paraguay existe.",
    },
    autoridade: {
      eyebrow: "A nossa resposta",
      title: "Nada é automático. É um roteiro de compras feito por especialistas na fronteira.",
      titleDestaque: "especialistas na fronteira",
      subtitle:
        "Qualquer site te joga no meio das galerias de Ciudad del Este. O que ninguém automatiza é um especialista olhando para o que você quer comprar.",
      imgAlt: "Especialista em compras na fronteira da Compras Paraguay",
      passos: [
        {
          n: "1",
          titulo: "Você conta o que quer comprar",
          texto:
            "Eletrônicos, perfumes, câmbio, orçamento — e o quanto você pode trazer dentro da cota.",
        },
        {
          n: "2",
          titulo: "Um especialista na fronteira monta o roteiro",
          texto:
            "Quem conhece Ciudad del Este de verdade define lojas, horários e a ordem do seu dia de compras.",
        },
        {
          n: "3",
          titulo: "Você recebe seu roteiro de compras",
          texto:
            "Onde cada coisa fica, quanto tempo levar e o que evitar — antes de cruzar a ponte.",
        },
      ],
      afirma1: "Compras sem perrengue, da travessia à volta — é o nosso compromisso.",
      afirma2: "Revisado por um especialista que conhece as lojas e os horários da fronteira. Nada aqui é gerado automático.",
      afirma3: "O roteiro respeita o seu orçamento — do câmbio ao valor que você planeja gastar.",
    },
    pilares: {
      eyebrow: "Explore a fronteira",
      items: [
        { href: "/atrativos/compras-paraguai-ciudad-del-este", label: "Compras no Paraguai", hint: "O que comprar e horários" },
        { href: "/roteiros-de-compras", label: "Roteiros de compras", hint: "Ciudad del Este, duty free e shoppings" },
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
      whatToDo: "Shopping guides",
      transfer: "Transfer",
      tripleFrontier: "Triple Frontier",
      cta: "Make my itinerary",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    faq: {
      eyebrow: "Frequently asked questions",
      title: "Your border-shopping questions",
      items: [
        {
          q: "What can you buy in Ciudad del Este?",
          a: "Electronics, perfumes, cosmetics, sunglasses, watches, toys and imports in general, concentrated in the first blocks after the Friendship Bridge. Stores open early and close by mid-afternoon — that's why it has to be the morning of your day.",
        },
        {
          q: "Do I need a passport for Paraguay or Argentina?",
          a: "Brazilians usually enter with a valid ID (good-condition RG or passport). Bring the original document and keep an eye on customs allowance on the way back; children and vehicles have extra rules.",
        },
        {
          q: "Can I do Ciudad del Este and Argentina on the same day?",
          a: "Yes. The Friendship Bridge crossing takes you to Ciudad del Este and the Tancredo Neves Bridge to Puerto Iguazú — both shopping axes fit in one day when you plan the order and respect each side's hours.",
        },
        {
          q: "What are the Duty Free and By Night in Puerto Iguazú?",
          a: "Duty Free is the Argentine free shop — perfumes, electronics and imported drinks — open by day. By Night is the shopping-and-dining experience of the Argentine evening. They're in the same area and pair well in one plan.",
        },
        {
          q: "What are the Friendship Bridge hours?",
          a: "The bridge runs 24h, but Ciudad del Este's stores open around 7–8am and close between 3pm and 4pm (Saturday until noon; Sunday almost everything is closed). Peak hours bring car queues — crossing early makes a difference.",
        },
        {
          q: "How does the customs allowance work?",
          a: "On the way back to Brazil, the Federal Revenue customs allowance applies (by land, US$ 300 per person in 2025 — always check the current rule). It's good to keep your receipts handy and declare anything over the limit.",
        },
        {
          q: "How much does my shopping plan cost?",
          a: "The plan itself has no generic price tag: it's built around what you want to buy, your budget and the days you have. You receive the conditions and the best order for your shopping day — no surprises at the border.",
        },
        {
          q: "How do I receive my shopping plan?",
          a: "Leave your details on any shopping destination page — it takes less than two minutes. A specialist who knows the border reviews your choices and puts together the final version of your day: stores, hours and the right crossing.",
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
      title: "Shopping in Paraguay is tempting. Planning it is another story.",
      titleDestaque: "Planning it",
      subtitle: "Anyone who shops the border on their own knows each of these moments:",
      items: [
        "Hours of research across stores, exchange rates and allowances",
        "Dozens of galleries in Ciudad del Este — where to start?",
        "Stores that close by mid-afternoon — and the bridge queue",
        "Reais, pesos and guaranis: what will it really cost?",
        "Customs allowance and declaration — finding out only on the way back",
        "Losing track of time and coming back without what you came for",
        "The crossing and transport eat up the time meant for shopping",
        "Arriving without knowing which store has what you want",
      ],
      bridge: "It's exactly this that Compras Paraguay exists to solve.",
    },
    autoridade: {
      eyebrow: "Our answer",
      title: "Nothing is automatic. It's a shopping plan built by border specialists.",
      titleDestaque: "border specialists",
      subtitle:
        "Any website can drop you in the middle of Ciudad del Este's galleries. What no one automates is a specialist looking at what you want to buy.",
      imgAlt: "Compras Paraguay border-shopping specialist",
      passos: [
        {
          n: "1",
          titulo: "You tell us what you want to buy",
          texto:
            "Electronics, perfumes, currency, budget — and how much you can bring back within the allowance.",
        },
        {
          n: "2",
          titulo: "A border specialist builds the plan",
          texto:
            "Someone who really knows Ciudad del Este sets the stores, hours and order of your shopping day.",
        },
        {
          n: "3",
          titulo: "You receive your shopping plan",
          texto:
            "Where each thing is, how long to take and what to skip — before you cross the bridge.",
        },
      ],
      afirma1: "Stress-free shopping, from the crossing to the way back — that's our commitment.",
      afirma2: "Reviewed by a specialist who knows the border's stores and hours. Nothing here is auto-generated.",
      afirma3: "The plan respects your budget — from the exchange rate to the amount you plan to spend.",
    },
    pilares: {
      eyebrow: "Explore the frontier",
      items: [
        { href: "/atrativos/compras-paraguai-ciudad-del-este", label: "Shopping in Paraguay", hint: "What to buy and hours" },
        { href: "/roteiros-de-compras", label: "Shopping guides", hint: "Ciudad del Este, duty free and malls" },
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
      transfer: "Transfer",
      tripleFrontier: "Triple Frontera",
      cta: "Hacer mi itinerario",
      openMenu: "Abrir menú",
      closeMenu: "Cerrar menú",
    },
    faq: {
      eyebrow: "Preguntas frecuentes",
      title: "Tus dudas sobre las compras en la frontera",
      items: [
        {
          q: "¿Qué se puede comprar en Ciudad del Este?",
          a: "Electrónicos, perfumes, cosméticos, anteojos, relojes, juguetes e importados en general, concentrados en las primeras cuadras después del Puente de la Amistad. El comercio abre temprano y cierra a media tarde — por eso tiene que ser la mañana de tu día.",
        },
        {
          q: "¿Necesito pasaporte para ir a Paraguay o Argentina?",
          a: "Los brasileños generalmente entran con documento válido (RG en buen estado o pasaporte). Lleva el documento original y atención a la cuota de la aduana a la vuelta; menores y vehículos tienen reglas extra.",
        },
        {
          q: "¿Puedo hacer Ciudad del Este y Argentina el mismo día?",
          a: "Sí. El cruce del Puente de la Amistad lleva a Ciudad del Este y el Puente Tancredo Neves a Puerto Iguazú — los dos ejes de compras caben en un mismo día cuando planificas el orden y respetas los horarios de cada lado.",
        },
        {
          q: "¿Qué son el Duty Free y el By Night en Puerto Iguazú?",
          a: "El Duty Free es el free shop argentino — perfumes, electrónicos y bebidas importadas — abierto de día. El By Night es la experiencia de compras y gastronomía de la noche argentina. Están en la misma zona y combinan bien en la misma ruta.",
        },
        {
          q: "¿Cuáles son los horarios del Puente de la Amistad?",
          a: "El puente funciona 24h, pero el comercio de Ciudad del Este abre entre las 7h y 8h y cierra entre las 15h y 16h (sábado hasta el mediodía; domingo casi todo cerrado). La hora pico tiene fila de autos — cruzar temprano hace la diferencia.",
        },
        {
          q: "¿Cómo funciona la cuota de compras de la aduana?",
          a: "A la vuelta a Brasil vale la cuota de compras de la Receita Federal (por vía terrestre, US$ 300 por persona en 2025 — consulta siempre la regla actual). Conviene tener las facturas a mano y declarar lo que supere el límite.",
        },
        {
          q: "¿Cuánto cuesta mi ruta de compras?",
          a: "La ruta en sí no tiene una tabla genérica: se arma sobre lo que quieres comprar, tu presupuesto y los días disponibles. Recibes las condiciones y el mejor orden para tu día de compras — sin sorpresas en la frontera.",
        },
        {
          q: "¿Cómo recibo mi ruta de compras?",
          a: "Deja tus datos en la página de cualquier destino de compras — toma menos de dos minutos. Un especialista que conoce la frontera revisa tus elecciones y arma la versión final de tu día: tiendas, horarios y el cruce correcto.",
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
      title: "Comprar en Paraguay es tentador. Planear la compra es otra historia.",
      titleDestaque: "Planear la compra",
      subtitle: "Quien compra en la frontera por su cuenta conoce cada uno de estos momentos:",
      items: [
        "Horas de investigación entre tiendas, cambio y cuota",
        "Decenas de galerías en Ciudad del Este — ¿por dónde empezar?",
        "Tiendas que cierran a media tarde — y la fila del puente",
        "Reales, pesos y guaraníes: ¿cuánto costará de verdad?",
        "Cuota de la aduana y declaración — descubrirlo solo a la vuelta",
        "Perder la hora y volver sin lo que viniste a buscar",
        "El cruce y el transporte se comen el tiempo que sería de comprar",
        "Llegar sin saber qué tienda tiene lo que quieres",
      ],
      bridge: "Es exactamente para resolver esto que existe Compras Paraguay.",
    },
    autoridade: {
      eyebrow: "Nuestra respuesta",
      title: "Nada es automático. Es una ruta de compras hecha por especialistas en la frontera.",
      titleDestaque: "especialistas en la frontera",
      subtitle:
        "Cualquier sitio web te suelta en medio de las galerías de Ciudad del Este. Lo que nadie automatiza es un especialista mirando lo que quieres comprar.",
      imgAlt: "Especialista en compras en la frontera de Compras Paraguay",
      passos: [
        {
          n: "1",
          titulo: "Nos cuentas qué quieres comprar",
          texto:
            "Electrónicos, perfumes, cambio, presupuesto — y cuánto puedes traer dentro de la cuota.",
        },
        {
          n: "2",
          titulo: "Un especialista en la frontera arma la ruta",
          texto:
            "Quien conoce Ciudad del Este de verdad define tiendas, horarios y el orden de tu día de compras.",
        },
        {
          n: "3",
          titulo: "Recibes tu ruta de compras",
          texto:
            "Dónde está cada cosa, cuánto tiempo llevar y qué evitar — antes de cruzar el puente.",
        },
      ],
      afirma1: "Compras sin estrés, del cruce a la vuelta — es nuestro compromiso.",
      afirma2: "Revisado por un especialista que conoce las tiendas y los horarios de la frontera. Nada aquí es generado automáticamente.",
      afirma3: "La ruta respeta tu presupuesto — del tipo de cambio al monto que planeas gastar.",
    },
    pilares: {
      eyebrow: "Explora la frontera",
      items: [
        { href: "/atrativos/compras-paraguai-ciudad-del-este", label: "Compras en Paraguay", hint: "Qué comprar y horarios" },
        { href: "/roteiros-de-compras", label: "Guías de compras", hint: "Ciudad del Este, duty free y shoppings" },
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
