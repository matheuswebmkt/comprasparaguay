// Filepath: lib/i18n/triplice-fronteira.ts
// Version: 1.0
// Nome da Versão: "Dicionário i18n da página /triplice-fronteira (pt/en/es)"
//
// Cobre só a parte VISÍVEL (client). JSON-LD e `metadata` continuam em pt no page.tsx (SEO canônico).
// Conteúdo próprio da página (não é dado de parceiro/atrativo de terceiro) — traduzido por completo.

import type { Locale } from "./config";
import type { RichPart } from "./home";

export interface TripliceFronteiraUI {
  hero: {
    eyebrow: string;
    h1: string;
    /** Trecho de `h1` destacado em Verde Selva. Ver `components/TituloComDestaque.tsx`. */
    h1Destaque: string;
    body: RichPart[];
  };
  countries: {
    label: string;
    city: string;
    text: string[];
    /**
     * Cada destaque aponta para um atrativo REAL de `app/data/attractions.ts` — o `slug` é a
     * chave, e a página resolve a capa e a URL a partir dele.
     *
     * ⚠️ `slug` É OBRIGATÓRIO DE PROPÓSITO. Antes isto era `string[]` e os destaques eram texto
     * solto, o que deixava entrar item sem contrapartida no site. Agora, se um `slug` não existir
     * em `attractions.ts`, a linha some silenciosamente na renderização (a página não inventa
     * miniatura) — então errar aqui custa conteúdo, e o tipo obriga a decidir.
     * ⓘ O `label` é editorial e pode divergir do `name` do atrativo: "Compras na fronteira"
     * aponta para "Compras Paraguai - Ciudad del Este". A moldura é da seção, o destino é o atrativo.
     */
    highlights: { slug: string; label: string }[];
  }[];
  seeDoTitle: string;
  crossings: {
    eyebrow: string;
    title: string;
    items: { from: string; to: string; via: string; note: string }[];
    tipBefore: string;
    tipText: string;
    /** CTA textual no fim da dica — "Veja nossa [recomendação]." com a palavra do meio linkada ao /transfer. */
    tipCtaBefore: string;
    tipCtaLink: string;
    tipCtaAfter: string;
  };
  finalCta: {
    title: string;
    text: string;
  };
}

export const TRIPLICE_FRONTEIRA_UI: Record<Locale, TripliceFronteiraUI> = {
  pt: {
    hero: {
      eyebrow: "Três países, um roteiro",
      h1: "A Tríplice Fronteira de Foz do Iguaçu",
      h1Destaque: "Tríplice Fronteira",
      body: [
        { text: "Brasil, Argentina e Paraguai se encontram em Foz do Iguaçu. " },
        { text: "No Marco das Três Fronteiras", strong: true },
        { text: " e nas pontes você entende a geografia; nos roteiros prontos, encaixa o dia a dia sem improviso." },
      ],
    },

    countries: [
      {
        label: "Brasil", city: "Foz do Iguaçu",
        text: [
          "O lado brasileiro é a base natural para explorar a região: Cataratas do Iguaçu, Parque das Aves, Itaipu e o Marco das Três Fronteiras.",
          "Foz concentra hospedagem e gastronomia, com fácil acesso aos dois países vizinhos.",
        ],
        /* ⓘ Foco compras: os dois shoppings de Foz entram como destaques do Brasil. */
        highlights: [
          { slug: "cataratas-jl-shopping", label: "Cataratas JL Shopping" },
          { slug: "shopping-catuai-palladium", label: "Shopping Catuaí Palladium" },
        ],
      },
      {
        label: "Argentina", city: "Puerto Iguazú",
        text: [
          "Do lado argentino, o Parque Nacional Iguazú oferece uma experiência diferente das Cataratas: passarelas que avançam sobre os rios e levam você à beira da imponente Garganta do Diabo, além do trem ecológico que cruza a mata.",
          "A poucos minutos, Puerto Iguazú é tranquila e charmosa, famosa pelas parrillas (a clássica carne argentina) e pelo seu próprio mirante das três fronteiras (Hito Tres Fronteras).",
        ],
        /* ⓘ Destques da Argentina: o Duty Free e o By Night (compras + noite argentina). */
        highlights: [
          { slug: "duty-free-shop-puerto-iguazu-argentina", label: "Duty Free Puerto Iguazú" },
          { slug: "by-night-argentina-puerto-iguazu", label: "By Night Puerto Iguazú" },
        ],
      },
      {
        label: "Paraguai", city: "Ciudad del Este",
        text: [
          "Ciudad del Este é o paraíso das compras da fronteira: eletrônicos, perfumes, cosméticos e importados a preços competitivos, concentrados logo após a Ponte da Amizade.",
          "Além do comércio, o lado paraguaio guarda o Salto Monday, uma queda d'água impressionante e bem menos concorrida que as Cataratas — uma boa surpresa para quem quer fugir do óbvio.",
        ],
        /* ⓘ SAIU "Ponte da Amizade" (decisão do usuário). Ela continua na seção de Logística
           logo abaixo, como `via` de uma travessia — que é o papel certo dela: é caminho, não
           destino de visita. */
        highlights: [
          { slug: "compras-paraguai-ciudad-del-este", label: "Compras na fronteira" },
          { slug: "saltos-del-monday", label: "Salto Monday" },
        ],
      },
    ],
    /* ⓘ Era "O que ver e fazer". Virou "Principais destaques" porque a lista deixou de ser
       exaustiva: são 2–3 atalhos escolhidos, com o "Ver todos os atrativos" logo abaixo fazendo
       o papel do resto. Prometer "o que ver e fazer" com três itens era prometer mais do que a
       seção entrega. */
    seeDoTitle: "Principais destaques",
    crossings: {
      eyebrow: "Logística",
      title: "Como circular entre os três países",
      items: [
        { from: "Brasil", to: "Paraguai", via: "Ponte da Amizade", note: "liga Foz do Iguaçu a Ciudad del Este — bem movimentada, principalmente em dias de compras." },
        { from: "Brasil", to: "Argentina", via: "Ponte Tancredo Neves", note: "liga Foz do Iguaçu a Puerto Iguazú, dando acesso ao lado argentino das Cataratas." },
      ],
      tipBefore: "Dica:",
      tipText: "leve um documento oficial com foto, atenção ao câmbio de cada país e, se for a primeira vez, considere ir com uma agência de turismo ou guia — as fronteiras costumam ser movimentadas.",
      tipCtaBefore: "Veja nossa",
      tipCtaLink: "recomendação",
      tipCtaAfter: ".",
    },
    /* ⚠️ O `text` anterior era "Escolha um plano pronto com a fronteira encaixada no dia certo e
       receba as condições da agência." — TRÊS problemas, e nenhum deles é pego pelo `check:copy`:
         1. "da agência" — §21.5 só admite nomear a agência na microcopy de LGPD e no disclaimer
            do rodapé. Em copy de marketing, não.
         2. "receba as condições" — §21.2, a regra de ouro: a copy pré-submit promete o RESULTADO,
            nunca o canal nem o instante. "Condições" antecipa justamente o que só existe depois
            do submit.
         3. "Escolha um plano pronto" descrevia o LINK SECUNDÁRIO. O CTA dourado leva ao wizard.
       ⓘ Este é o mesmo par de violações que o default de `shared.ts` já tinha corrigido — o
       override desta página escapou da limpeza. Ao criar override novo, conferir o default antes.
       ⓘ Estrutura copiada do default: pergunta rápida → resultado completo, com o ângulo da
       página no meio. Sem fecho de gratuidade — §21.4 proíbe as duas formas, a palavra direta
       e a construção "por nossa conta". */
    finalCta: {
      title: "Os três países no mesmo roteiro.",
      text: "Você define suas preferências e recebe o roteiro completo dos seus dias em Foz — com a travessia da fronteira no dia em que ela rende mais, sem atropelar o resto.",
    },
  },
  en: {
    hero: {
      eyebrow: "Three countries, one itinerary",
      h1: "The Triple Frontier of Foz do Iguaçu",
      h1Destaque: "Triple Frontier",
      body: [
        { text: "Brazil, Argentina and Paraguay meet in Foz do Iguaçu. At the " },
        { text: "Triple Frontier Landmark", strong: true },
        { text: " and the bridges you feel the geography — ready-made itineraries turn that into a day plan." },
      ],
    },

    countries: [
      {
        label: "Brazil", city: "Foz do Iguaçu",
        text: [
          "The Brazilian side is the natural base: Iguaçu Falls, Bird Park, Itaipu and the Triple Frontier Landmark.",
          "Foz has lodging and dining with easy access to both neighboring countries.",
        ],
        highlights: [
          { slug: "cataratas-jl-shopping", label: "Cataratas JL Shopping" },
          { slug: "shopping-catuai-palladium", label: "Shopping Catuaí Palladium" },
        ],
      },
      {
        label: "Argentina", city: "Puerto Iguazú",
        text: [
          "On the Argentine side, Iguazú National Park offers a different experience of the Falls: walkways that reach out over the rivers and take you right to the edge of the imposing Devil's Throat, plus an eco-train that runs through the forest.",
          "Just minutes away, Puerto Iguazú is quiet and charming, famous for its parrillas (classic Argentine grilled meat) and its own three-borders viewpoint (Hito Tres Fronteras).",
        ],
        highlights: [
          { slug: "duty-free-shop-puerto-iguazu-argentina", label: "Duty Free Puerto Iguazú" },
          { slug: "by-night-argentina-puerto-iguazu", label: "By Night Puerto Iguazú" },
        ],
      },
      {
        label: "Paraguay", city: "Ciudad del Este",
        text: [
          "Ciudad del Este is the border's shopping paradise: electronics, perfumes, cosmetics and imported goods at competitive prices, concentrated right after the Friendship Bridge.",
          "Beyond the shopping, the Paraguayan side is home to Salto Monday, an impressive waterfall that's much less crowded than the Falls — a nice surprise for those looking to skip the obvious.",
        ],
        highlights: [
          { slug: "compras-paraguai-ciudad-del-este", label: "Border shopping" },
          { slug: "saltos-del-monday", label: "Salto Monday" },
        ],
      },
    ],
    seeDoTitle: "Main highlights",
    crossings: {
      eyebrow: "Logistics",
      title: "How to get around the three countries",
      items: [
        { from: "Brazil", to: "Paraguay", via: "Friendship Bridge", note: "connects Foz do Iguaçu to Ciudad del Este — quite busy, especially on shopping days." },
        { from: "Brazil", to: "Argentina", via: "Tancredo Neves Bridge", note: "connects Foz do Iguaçu to Puerto Iguazú, giving access to the Argentine side of the Falls." },
      ],
      tipBefore: "Tip:",
      tipText: "bring an official photo ID, mind each country's exchange rate, and if it's your first time, consider going with a tour agency or guide — the borders tend to get busy.",
      tipCtaBefore: "See our",
      tipCtaLink: "recommendation",
      tipCtaAfter: ".",
    },
    finalCta: {
      title: "All three countries in one itinerary.",
      text: "You set your preferences and receive the complete itinerary for your days in Foz — with the border crossing on the day it pays off most, without rushing anything else.",
    },
  },
  es: {
    hero: {
      eyebrow: "Tres países, un itinerario",
      h1: "La Triple Frontera de Foz do Iguaçu",
      h1Destaque: "Triple Frontera",
      body: [
        { text: "Brasil, Argentina y Paraguay se encuentran en Foz do Iguaçu. En el " },
        { text: "Marco de las Tres Fronteras", strong: true },
        { text: " y en los puentes entiendes la geografía; en los itinerarios listos, lo conviertes en un plan del día." },
      ],
    },

    countries: [
      {
        label: "Brasil", city: "Foz do Iguaçu",
        text: [
          "El lado brasileño es la base natural: Cataratas del Iguazú, Parque de las Aves, Itaipú y el Marco de las Tres Fronteras.",
          "Foz concentra hospedaje y gastronomía, con fácil acceso a los dos países vecinos.",
        ],
        highlights: [
          { slug: "cataratas-jl-shopping", label: "Cataratas JL Shopping" },
          { slug: "shopping-catuai-palladium", label: "Shopping Catuaí Palladium" },
        ],
      },
      {
        label: "Argentina", city: "Puerto Iguazú",
        text: [
          "Del lado argentino, el Parque Nacional Iguazú ofrece una experiencia distinta de las Cataratas: pasarelas que avanzan sobre los ríos y te llevan al borde de la imponente Garganta del Diablo, además del tren ecológico que cruza la selva.",
          "A pocos minutos, Puerto Iguazú es tranquila y con encanto, famosa por sus parrillas (la clásica carne argentina) y por su propio mirador de las tres fronteras (Hito Tres Fronteras).",
        ],
        highlights: [
          { slug: "duty-free-shop-puerto-iguazu-argentina", label: "Duty Free Puerto Iguazú" },
          { slug: "by-night-argentina-puerto-iguazu", label: "By Night Puerto Iguazú" },
        ],
      },
      {
        label: "Paraguay", city: "Ciudad del Este",
        text: [
          "Ciudad del Este es el paraíso de las compras de la frontera: electrónicos, perfumes, cosméticos e importados a precios competitivos, concentrados justo después del Puente de la Amistad.",
          "Además del comercio, el lado paraguayo guarda el Salto Monday, una caída de agua impresionante y con mucho menos gente que las Cataratas — una buena sorpresa para quien quiere escapar de lo obvio.",
        ],
        highlights: [
          { slug: "compras-paraguai-ciudad-del-este", label: "Compras en la frontera" },
          { slug: "saltos-del-monday", label: "Salto Monday" },
        ],
      },
    ],
    seeDoTitle: "Principales destacados",
    crossings: {
      eyebrow: "Logística",
      title: "Cómo circular entre los tres países",
      items: [
        { from: "Brasil", to: "Paraguay", via: "Puente de la Amistad", note: "conecta Foz do Iguaçu con Ciudad del Este — bastante transitado, sobre todo en días de compras." },
        { from: "Brasil", to: "Argentina", via: "Puente Tancredo Neves", note: "conecta Foz do Iguaçu con Puerto Iguazú, dando acceso al lado argentino de las Cataratas." },
      ],
      tipBefore: "Consejo:",
      tipText: "lleva un documento oficial con foto, presta atención al tipo de cambio de cada país y, si es tu primera vez, considera ir con una agencia de turismo o guía — las fronteras suelen estar concurridas.",
      tipCtaBefore: "Mira nuestra",
      tipCtaLink: "recomendación",
      tipCtaAfter: ".",
    },
    finalCta: {
      title: "Los tres países en un mismo itinerario.",
      text: "Tú defines tus preferencias y recibes el itinerario completo de tus días en Foz — con la travesía de la frontera en el día en que más rinde, sin atropellar el resto.",
    },
  },
};
