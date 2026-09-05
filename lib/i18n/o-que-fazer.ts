// Filepath: lib/i18n/o-que-fazer.ts
// Version: 1.0
// Nome da Versão: "Dicionário i18n da página /o-que-fazer (pt/en/es)"
//
// Cobre a parte VISÍVEL (client) da página /o-que-fazer. O JSON-LD e `metadata` continuam em
// pt no page.tsx (SEO canônico). Os CTAs de fechamento reutilizam `SHARED_UI.roteirosCta`.

import type { Locale } from "./config";

export interface OQueFazerUI {
  hero: {
    eyebrow: string;
    h1: string;
    h1Destaque: string;
    subtitle: string;
    cta: string;
  };
  quantoTempo: {
    eyebrow: string;
    title: string;
    subtitle: string;
    dayLabel: (d: number) => string;
    dayOptions: string[];
    dayCta: (d: number) => string;
    maisDiasLabel: string;
    maisDiasText: string;
  };
  gastro: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cards: { title: string; text: string }[];
    cta: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    items: { q: string; a: string }[];
  };
  closing: {
    title: string;
    subtitle: string;
  };
}

export const O_QUE_FAZER_UI: Record<Locale, OQueFazerUI> = {
  pt: {
    hero: {
      eyebrow: "Guia · Foz do Iguaçu",
      h1: "O que fazer em Foz do Iguaçu",
      h1Destaque: "fazer",
      subtitle:
        "Cataratas, Itaipu, natureza, fronteira com Argentina e Paraguai, compras e gastronomia de três países.",
      cta: "Explorar",
    },
    quantoTempo: {
      eyebrow: "Roteiros prontos e sob medida",
      title: "Quanto tempo você tem em Foz?",
      subtitle:
        "De 1 a 3 dias você já encontra um roteiro pronto, validado pela nossa curadoria local. Com mais tempo, um especialista em Foz do Iguaçu monta o seu roteiro, com a logística já resolvida.",
      dayLabel: (d) => `${d} ${d === 1 ? "dia" : "dias"}`,
      dayOptions: [
        "Cataratas e Parque das Aves, com o Marco ao fim do dia. O essencial sem correria.",
        "Cataratas com calma, Itaipu e um pedaço da fronteira — o clássico de fim de semana.",
        "A duração mais buscada: Cataratas, Itaipu e um dia de fronteira (Paraguai ou Argentina).",
      ],
      dayCta: (d) => `Ver roteiros de ${d} ${d === 1 ? "dia" : "dias"}`,
      maisDiasLabel: "Mais de 3 dias",
      maisDiasText:
        "A partir de 4 dias, plano pronto engessa: as combinações explodem. Um especialista em Foz do Iguaçu monta o seu roteiro, analisa cada atrativo e valida a logística do dia a dia.",
    },
    gastro: {
      eyebrow: "Onde comer em Foz",
      title: "Três países, uma só mesa",
      subtitle:
        "Em poucos quilômetros cabem a parrilla argentina, a comida árabe, o sushi, a pizza e o melhor da cozinha brasileira. O desafio não é achar opção — é escolher a certa.",
      cards: [
        { title: "Brasil", text: "Churrasco, pizza, sushi e a comida árabe que virou tradição local." },
        { title: "Argentina", text: "O vinho, a parrilla e a empanada a poucos minutos da cidade, como parte do passeio." },
        { title: "Paraguai", text: "Chipa, tereré e a cozinha guarani direto da mesa da fronteira." },
      ],
      cta: "Ver onde comer em Foz",
    },
    faq: {
      eyebrow: "Perguntas frequentes",
      title: "Dúvidas sobre Foz do Iguaçu",
      items: [
        {
          q: "O que fazer em Foz do Iguaçu em 1 dia?",
          a: "Foque no essencial: Cataratas do Iguaçu (lado brasileiro) e, se der tempo, Parque das Aves no mesmo corredor. À noite, Marco das Três Fronteiras ou jantar na cidade.",
        },
        {
          q: "O que fazer em Foz do Iguaçu em 2 dias?",
          a: "Dia 1: Cataratas + Parque das Aves. Dia 2: Itaipu e cultura/cidade, ou um dia de fronteira (Argentina ou Paraguai). Veja o catálogo em /atrativos para detalhar cada ponto.",
        },
        {
          q: "O que fazer em Foz do Iguaçu em 3 dias?",
          a: "No clássico: Cataratas + aves; Itaipu e cidade; um dia de fronteira (Paraguai ou Argentina). Com 3 dias você cobre o cartão-postal sem correr demais.",
        },
        {
          q: "O que fazer em Foz do Iguaçu em 4 ou 5 dias?",
          a: "Some o lado argentino das Cataratas, Duty Free/Feirinha, lazer temático, mais gastronomia e um segundo dia de compras ou natureza. Quanto mais dias, mais conforto entre corredores.",
        },
        {
          q: "Onde vejo a lista completa de atrativos?",
          a: "No hub /atrativos — cada ponto tem página própria (Cataratas, Itaipu, Duty Free, Feirinha, Macuco, etc.).",
        },
        {
          q: "Onde comer entre os passeios?",
          a: "No guia onde comer: churrascaria, sushi, pizza, shawarma, hambúrguer, bar e restaurante — por categoria, com curadoria da equipe.",
        },
        {
          q: "O que é a Tríplice Fronteira e como encaixar?",
          a: "É o encontro de Brasil, Argentina e Paraguai em Foz. Guia dedicado em /triplice-fronteira: o que fazer em cada país e como atravessar sem estresse.",
        },
      ],
    },
    closing: {
      title: "Você já sabe o que fazer em Foz. Falta a ordem certa.",
      subtitle:
        "Um especialista que vive em Foz monta o roteiro dos seus dias na cidade — com a ordem, os horários e os deslocamentos já resolvidos.",
    },
  },
  en: {
    hero: {
      eyebrow: "Guide · Foz do Iguaçu",
      h1: "What to do in Foz do Iguaçu",
      h1Destaque: "do",
      subtitle:
        "Falls, Itaipu, nature, the border with Argentina and Paraguay, shopping and three countries' food.",
      cta: "Explore",
    },
    quantoTempo: {
      eyebrow: "Ready-made and custom itineraries",
      title: "How much time do you have in Foz?",
      subtitle:
        "From 1 to 3 days you'll find a ready-made itinerary, vetted by our local curation. With more time, a specialist in Foz do Iguaçu builds your itinerary, with the logistics already sorted.",
      dayLabel: (d) => `${d} ${d === 1 ? "day" : "days"}`,
      dayOptions: [
        "Falls and Bird Park, with the Landmark at the end of the day. The essentials without rushing.",
        "Falls at a relaxed pace, Itaipu and a slice of the border — the classic weekend.",
        "The most searched duration: Falls, Itaipu and a border day (Paraguay or Argentina).",
      ],
      dayCta: (d) => `See ${d}-day itineraries`,
      maisDiasLabel: "More than 3 days",
      maisDiasText:
        "From 4 days on, a ready-made plan gets rigid: the combinations explode. A specialist in Foz do Iguaçu builds your itinerary, analyzes each attraction and validates the day-to-day logistics.",
    },
    gastro: {
      eyebrow: "Where to eat in Foz",
      title: "Three countries, one table",
      subtitle:
        "Within a few kilometers you'll find Argentine parrilla, Arab food, sushi, pizza and the best of Brazilian cuisine. The challenge isn't finding an option — it's choosing the right one.",
      cards: [
        { title: "Brazil", text: "Barbecue, pizza, sushi and the Arab food that became a local tradition." },
        { title: "Argentina", text: "Wine, parrilla and empanadas minutes from the city, as part of the outing." },
        { title: "Paraguay", text: "Chipa, tereré and Guarani cuisine straight from the border table." },
      ],
      cta: "See where to eat in Foz",
    },
    faq: {
      eyebrow: "Frequently asked questions",
      title: "Questions about Foz do Iguaçu",
      items: [
        {
          q: "What to do in Foz do Iguaçu in 1 day?",
          a: "Focus on the essentials: the Iguaçu Falls (Brazilian side) and, if there's time, the Bird Park in the same corridor. At night, the Three Borders Landmark or dinner in the city.",
        },
        {
          q: "What to do in Foz do Iguaçu in 2 days?",
          a: "Day 1: Falls + Bird Park. Day 2: Itaipu and city/culture, or a border day (Argentina or Paraguay). See the catalog at /atrativos for details on each spot.",
        },
        {
          q: "What to do in Foz do Iguaçu in 3 days?",
          a: "In the classic: Falls + birds; Itaipu and the city; a border day (Paraguay or Argentina). With 3 days you cover the postcard without rushing.",
        },
        {
          q: "What to do in Foz do Iguaçu in 4 or 5 days?",
          a: "Add the Argentine side of the Falls, Duty Free/Feirinha, themed leisure, more food and a second day of shopping or nature. The more days, the more comfort between corridors.",
        },
        {
          q: "Where do I see the full list of attractions?",
          a: "At the /atrativos hub — each spot has its own page (Falls, Itaipu, Duty Free, Feirinha, Macuco, etc.).",
        },
        {
          q: "Where to eat between outings?",
          a: "In the /onde-comer guide: steakhouse, sushi, pizza, shawarma, burger, bar and restaurant — by category, with the team's curation.",
        },
        {
          q: "What is the Triple Frontier and how does it fit in?",
          a: "It's where Brazil, Argentina and Paraguay meet in Foz. Dedicated guide at /triplice-fronteira: what to do in each country and how to cross without stress.",
        },
      ],
    },
    closing: {
      title: "You already know what to do in Foz. What's missing is the right order.",
      subtitle:
        "A specialist who lives in Foz builds the itinerary for your days in the city — with the order, timings and travel already sorted.",
    },
  },
  es: {
    hero: {
      eyebrow: "Guía · Foz do Iguaçu",
      h1: "Qué hacer en Foz do Iguaçu",
      h1Destaque: "hacer",
      subtitle:
        "Cataratas, Itaipú, naturaleza, la frontera con Argentina y Paraguay, compras y gastronomía de tres países.",
      cta: "Explorar",
    },
    quantoTempo: {
      eyebrow: "Itinerarios listos y a medida",
      title: "¿Cuánto tiempo tienes en Foz?",
      subtitle:
        "De 1 a 3 días ya encuentras un itinerario listo, validado por nuestra curaduría local. Con más tiempo, un especialista en Foz do Iguaçu arma tu itinerario, con la logística ya resuelta.",
      dayLabel: (d) => `${d} ${d === 1 ? "día" : "días"}`,
      dayOptions: [
        "Cataratas y Parque de las Aves, con el Marco al final del día. Lo esencial sin apuros.",
        "Cataratas con calma, Itaipú y un pedazo de la frontera — el clásico de fin de semana.",
        "La duración más buscada: Cataratas, Itaipú y un día de frontera (Paraguay o Argentina).",
      ],
      dayCta: (d) => `Ver itinerarios de ${d} ${d === 1 ? "día" : "días"}`,
      maisDiasLabel: "Más de 3 días",
      maisDiasText:
        "A partir de 4 días, el plan listo se vuelve rígido: las combinaciones explotan. Un especialista en Foz do Iguaçu arma tu itinerario, analiza cada atractivo y valida la logística del día a día.",
    },
    gastro: {
      eyebrow: "Dónde comer en Foz",
      title: "Tres países, una sola mesa",
      subtitle:
        "En pocos kilómetros caben la parrilla argentina, la comida árabe, el sushi, la pizza y lo mejor de la cocina brasileña. El desafío no es encontrar opción — es elegir la correcta.",
      cards: [
        { title: "Brasil", text: "Asado, pizza, sushi y la comida árabe que se volvió tradición local." },
        { title: "Argentina", text: "El vino, la parrilla y la empanada a pocos minutos de la ciudad, como parte del paseo." },
        { title: "Paraguay", text: "Chipa, tereré y la cocina guaraní directo de la mesa de la frontera." },
      ],
      cta: "Ver dónde comer en Foz",
    },
    faq: {
      eyebrow: "Preguntas frecuentes",
      title: "Dudas sobre Foz do Iguaçu",
      items: [
        {
          q: "¿Qué hacer en Foz do Iguaçu en 1 día?",
          a: "Céntrate en lo esencial: las Cataratas del Iguazú (lado brasileño) y, si da tiempo, el Parque de las Aves en el mismo corredor. De noche, el Marco de las Tres Fronteras o cena en la ciudad.",
        },
        {
          q: "¿Qué hacer en Foz do Iguaçu en 2 días?",
          a: "Día 1: Cataratas + Parque de las Aves. Día 2: Itaipú y cultura/ciudad, o un día de frontera (Argentina o Paraguay). Consulta el catálogo en /atrativos para detallar cada punto.",
        },
        {
          q: "¿Qué hacer en Foz do Iguaçu en 3 días?",
          a: "En el clásico: Cataratas + aves; Itaipú y ciudad; un día de frontera (Paraguay o Argentina). Con 3 días cubres la postal sin correr demasiado.",
        },
        {
          q: "¿Qué hacer en Foz do Iguaçu en 4 o 5 días?",
          a: "Suma el lado argentino de las Cataratas, Duty Free/Feirinha, ocio temático, más gastronomía y un segundo día de compras o naturaleza. Cuantos más días, más comodidad entre corredores.",
        },
        {
          q: "¿Dónde veo la lista completa de atractivos?",
          a: "En el hub /atrativos — cada punto tiene su propia página (Cataratas, Itaipú, Duty Free, Feirinha, Macuco, etc.).",
        },
        {
          q: "¿Dónde comer entre los paseos?",
          a: "En la guía /onde-comer: parrilla, sushi, pizza, shawarma, hamburguesa, bar y restaurante — por categoría, con curaduría del equipo.",
        },
        {
          q: "¿Qué es la Triple Frontera y cómo encaja?",
          a: "Es el encuentro de Brasil, Argentina y Paraguay en Foz. Guía dedicada en /triplice-fronteira: qué hacer en cada país y cómo cruzar sin estrés.",
        },
      ],
    },
    closing: {
      title: "Ya sabes qué hacer en Foz. Falta el orden correcto.",
      subtitle:
        "Un especialista que vive en Foz arma el itinerario de tus días en la ciudad — con el orden, los horarios y los trayectos ya resueltos.",
    },
  },
};
