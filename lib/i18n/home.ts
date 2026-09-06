// Filepath: lib/i18n/home.ts
// Version: 3.17
// Nome da Versão: "Footer na narrativa Compras PY (tagline/disclaimer) + links hub, transfer e tríplice"
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
    roteirosHubLink: string;
    transferLink: string;
    tripleLink: string;
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
      tagline: "O seu dia de compras na tríplice fronteira, conduzido por quem vive Foz do Iguaçu.",
      followUs: "Siga-nos",
      roteirosLink: "Compras no Paraguai",
      roteirosHubLink: "Roteiros de compras",
      transferLink: "Transfer",
      tripleLink: "Tríplice Fronteira",
      aboutLink: "Sobre",
      legalLink: "Aviso Legal",
      contactLink: "Contato",
      disclaimer:
        "O Compras Paraguay é um portal independente de curadoria de compras na fronteira. Não somos vendedores diretos: não processamos pagamentos nem operamos diretamente o transporte ou as reservas. Marcas e destinos mencionados pertencem aos seus detentores; atendimento, reservas e emissões são conduzidos pela agência parceira e pelos estabelecimentos responsáveis.",
    },
    hero: {
      /* ⚠️ `h1Strong` cai dentro do `<em>` verde de `RoteirosHero` — é a KEYWORD EXATA que o H1
         lidera ("compras no Paraguai"), não um enfeite: mexer ali é decisão de SEO. `h1After` NÃO
         leva espaço inicial: o `{" "}` depois do `</em>` já vem no componente.
      /* H1 curto, em registro de promessa — o detalhe do serviço (ida e volta, hotel, guias) é do
         subtítulo. "Roteiro" está fora do hero por decisão do usuário: o que se contrata é o dia de
         compras conduzido por quem é da fronteira, não um planejamento teórico. */
      h1Before: "Suas ",
      h1Strong: "compras no Paraguai",
      h1After: "do jeito certo",
      subtitle:
        "Te levamos às compras no Paraguai — Ciudad del Este, com ida e volta a partir do seu hotel em Foz do Iguaçu. Segurança para você e suas compras com nossos guias especialistas.",
    },
    dores: {
      eyebrow: "O cenário",
      title: "Comprar no Paraguai é tentador. Organizar a logística é outra história.",
      titleDestaque: "Organizar a logística",
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
      /* ⚠️ ESTA SEÇÃO NASCE DA HERO, não de um raciocínio sobre "autoridade". A hero promete: te
         levamos às compras, ida e volta a partir do seu hotel, guia especialista. Aqui essa promessa
         vira mecanismo, em três movimentos: a data → o veículo privativo → o guia.
         ⛔ O que NÃO pode voltar: "montar", "planejar", "receber o roteiro", "dizer o que quer
         comprar". Não existe catálogo, nem venda online, nem lista de itens — o visitante contrata um
         dia conduzido, não um documento nem um carrinho.
         Os passos respondem, um a um, às dores da seção anterior: a logística que alguém tem que
         fazer, o transporte que come o tempo de comprar, e chegar sem saber a qual loja ir.
         §21.4 — nenhuma afirmação de gratuidade; §21.5 — "orçamento" é o DINHEIRO DO VISITANTE. */
      eyebrow: "Compras no Paraguai",
      title: "Faça suas compras e retorne ao Brasil com segurança.",
      titleDestaque: "com segurança",
      subtitle:
        "Logística, câmbio, loja certa, horário de cada uma, fila da ponte, tudo resolvido. Um dia de compras com quem conhece Ciudad del Este por dentro.",
      imgAlt: "Guia especialista da Compras Paraguay no dia de compras em Ciudad del Este",
      passos: [
        {
          n: "1",
          titulo: "Você escolhe a data",
          texto:
            "Você decide o dia e solicita a reserva.",
        },
        {
          n: "2",
          titulo: "Veículo privativo busca você no seu hotel",
          texto:
            "Ida e volta com um guia especialista a partir da sua hospedagem em Foz do Iguaçu.",
        },
        {
          n: "3",
          titulo: "Você faz suas compras no Paraguai",
          texto:
            "Quem conhece Ciudad del Este de verdade te leva às lojas, no horário de cada uma e orienta sobre suas compras pra voltar ao Brasil.",
        },
      ],
      afirma1: "Compras sem perrengue, da saída do hotel à volta — é o nosso compromisso.",
      afirma2: "Quem conduz o seu dia de compras é um guia especialista nesse serviço.",
      afirma3: "O dia respeita o seu orçamento — do câmbio ao valor que você planeja gastar.",
    },
    pilares: {
      eyebrow: "Explore a fronteira",
      items: [
        { href: "/roteiros-de-compras/compras-paraguai-ciudad-del-este", label: "Compras no Paraguai", hint: "Logística em Ciudad del Este" },
        { href: "/roteiros-de-compras", label: "Roteiros de compras", hint: "Duty Free, Argentina e mais" },
        { href: "/transfer", label: "Transfer", hint: "Privativo ida e volta" },
        { href: "/triplice-fronteira", label: "Tríplice Fronteira", hint: "Brasil, Argentina e Paraguai" },
      ],
    },
    ctaFinal: {
      /* Fechamento: o serviço dito de frente (quem leva, com o quê, e o retorno ao Brasil), no mesmo
         registro do hero. Não volta para aqui "plano", "roteiro", "receba o seu" — nada de documento,
         nada de canal (§21.2), nada de preço (§21.7). */
      title: "Nós levamos você às compras no Paraguai.",
      subtitle:
        "Sua logística de ida e volta com segurança, veículo privativo, guia especialista e retorno ao Brasil com as compras feitas.",
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
      tagline: "Your shopping day at the border, run by people who live in Foz do Iguaçu.",
      followUs: "Follow us",
      roteirosLink: "Shopping in Paraguay",
      roteirosHubLink: "Shopping itineraries",
      transferLink: "Transfer",
      tripleLink: "Triple Frontier",
      aboutLink: "About",
      legalLink: "Legal notice",
      contactLink: "Contact",
      disclaimer:
        "Compras Paraguay is an independent border shopping curation portal. We are not direct sellers: we don't process payments or directly run transport or bookings. Mentioned brands and destinations belong to their owners; service, bookings and issuances are handled by the partner agency and the responsible businesses.",
    },
    hero: {
      h1Before: "Your ",
      h1Strong: "shopping in Paraguay",
      h1After: "done right",
      subtitle:
        "We take you shopping in Paraguay — Ciudad del Este, round trip from your hotel in Foz do Iguaçu. You and your purchases stay safe with our expert guides.",
    },
    dores: {
      eyebrow: "The scenario",
      title: "Shopping in Paraguay is tempting. Organizing the logistics is another story.",
      titleDestaque: "Organizing the logistics",
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
      /* Tradução da matriz pt: o título espelha a hero ("Te levamos às compras..." → "We take you
         to..."), não é frase de autoridade solta. `titleDestaque` é substring EXATA do título. */
      eyebrow: "Shopping in Paraguay",
      title: "Do your shopping and get back to Brazil safely.",
      titleDestaque: "safely",
      subtitle:
        "Logistics, currency, the right store, opening hours, the queue at the bridge — all handled. A shopping day with someone who knows Ciudad del Este from the inside.",
      imgAlt: "Compras Paraguay specialist guide on the shopping day in Ciudad del Este",
      passos: [
        {
          n: "1",
          titulo: "You choose the date",
          texto:
            "You decide the day and request the reservation.",
        },
        {
          n: "2",
          titulo: "A private vehicle picks you up at your hotel",
          texto:
            "Round trip with a specialist guide from your accommodation in Foz do Iguaçu.",
        },
        {
          n: "3",
          titulo: "You do your shopping in Paraguay",
          texto:
            "Someone who truly knows Ciudad del Este takes you to the stores, at each one's hours, and advises on your purchases for the way back to Brazil.",
        },
      ],
      afirma1: "Stress-free shopping, from leaving the hotel to coming back — that's our commitment.",
      afirma2: "The one running your shopping day is a guide who specializes in this service.",
      afirma3: "The day respects your budget — from the exchange rate to what you plan to spend.",
    },
    pilares: {
      eyebrow: "Explore the frontier",
      items: [
        { href: "/roteiros-de-compras/compras-paraguai-ciudad-del-este", label: "Shopping in Paraguay", hint: "Logistics in Ciudad del Este" },
        { href: "/roteiros-de-compras", label: "Shopping guides", hint: "Duty free, Argentina and more" },
        { href: "/transfer", label: "Transfer", hint: "Private, round trip" },
        { href: "/triplice-fronteira", label: "Triple Frontier", hint: "Brazil, Argentina and Paraguay" },
      ],
    },
    ctaFinal: {
      title: "We take you shopping in Paraguay.",
      subtitle:
        "Your round trip taken care of, with safety: private vehicle, specialist guide and the return to Brazil with your purchases done.",
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
      tagline: "Tu día de compras en la frontera, conducido por gente que vive Foz do Iguaçu.",
      followUs: "Síguenos",
      roteirosLink: "Compras en Paraguay",
      roteirosHubLink: "Itinerarios de compras",
      transferLink: "Transfer",
      tripleLink: "Triple Frontera",
      aboutLink: "Sobre",
      legalLink: "Aviso legal",
      contactLink: "Contacto",
      disclaimer:
        "Compras Paraguay es un portal independiente de curaduría de compras en la frontera. No somos vendedores directos: no procesamos pagos ni operamos directamente el transporte o las reservas. Las marcas y destinos mencionados pertenecen a sus titulares; la atención, las reservas y las emisiones las realizan la agencia asociada y los establecimientos responsables.",
    },
    hero: {
      h1Before: "Tus ",
      h1Strong: "compras en Paraguay",
      h1After: "como deben ser",
      subtitle:
        "Te llevamos de compras por Paraguay — Ciudad del Este, con ida y vuelta desde tu hotel en Foz do Iguaçu. Seguridad para ti y tus compras con nuestros guías especialistas.",
    },
    dores: {
      eyebrow: "El escenario",
      title: "Comprar en Paraguay es tentador. Organizar la logística es otra historia.",
      titleDestaque: "Organizar la logística",
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
      /* Tradução da matriz pt. Título espelhando a hero ("Te llevamos hasta..."). O topônimo continua
         "Foz do Iguaçu" também no es — é assim que o resto do site em espanhol escreve a cidade. */
      eyebrow: "Compras en Paraguay",
      title: "Haz tus compras y vuelve a Brasil con seguridad.",
      titleDestaque: "con seguridad",
      subtitle:
        "Logística, cambio, la tienda correcta, el horario de cada una, la fila del puente, todo resuelto. Un día de compras con quien conoce Ciudad del Este por dentro.",
      imgAlt: "Guía especialista de Compras Paraguay en el día de compras en Ciudad del Este",
      passos: [
        {
          n: "1",
          titulo: "Eliges la fecha",
          texto:
            "Tú decides el día y solicitas la reserva.",
        },
        {
          n: "2",
          titulo: "Un vehículo privado te recoge en tu hotel",
          texto:
            "Ida y vuelta con un guía especialista desde tu alojamiento en Foz do Iguaçu.",
        },
        {
          n: "3",
          titulo: "Haces tus compras en Paraguay",
          texto:
            "Quien conoce Ciudad del Este de verdad te lleva a las tiendas, en el horario de cada una y te orienta sobre tus compras para volver a Brasil.",
        },
      ],
      afirma1: "Compras sin estrés, de salir del hotel a volver — es nuestro compromiso.",
      afirma2: "Quien conduce tu día de compras es un guía especialista en este servicio.",
      afirma3: "El día respeta tu presupuesto — del tipo de cambio al monto que planeas gastar.",
    },
    pilares: {
      eyebrow: "Explora la frontera",
      items: [
        { href: "/roteiros-de-compras/compras-paraguai-ciudad-del-este", label: "Compras en Paraguay", hint: "Logística en Ciudad del Este" },
        { href: "/roteiros-de-compras", label: "Guías de compras", hint: "Duty Free, Argentina y más" },
        { href: "/transfer", label: "Transfer", hint: "Privado, ida y vuelta" },
        { href: "/triplice-fronteira", label: "Triple Frontera", hint: "Brasil, Argentina y Paraguay" },
      ],
    },
    ctaFinal: {
      title: "Te llevamos de compras por Paraguay.",
      subtitle:
        "Tu logística de ida y vuelta con seguridad, vehículo privado, guía especialista y regreso a Brasil con las compras hechas.",
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
