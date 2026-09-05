// Filepath: lib/i18n/triplice-fronteira.ts
// Version: 2.0
// Nome da Versão: "Foco Compras PY — copys da página reescritas para o roteiro de compras"
//
// Cobre só a parte VISÍVEL (client). JSON-LD e `metadata` continuam em pt no page.tsx (SEO canônico).
// A página é o guia do roteiro de compras na Tríplice Fronteira: Ciudad del Este (PY), Duty Free e
// By Night (AR) e os shoppings de Foz (BR) — nenhum conteúdo de turismo geral (Cataratas, Itaipu,
// parques) aparece aqui.

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
     * ⓘ O `label` é editorial e pode divergir do `name` do atrativo: "Duty Free Puerto Iguazú"
     * aponta para "Compras Duty Free - Puerto Iguazú". A moldura é da seção, o destino é o atrativo.
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
  /** Cabeçalho da seção de cards do rodapé (os 5 destinos de compras do guia). */
  related: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
}

export const TRIPLICE_FRONTEIRA_UI: Record<Locale, TripliceFronteiraUI> = {
  pt: {
    hero: {
      eyebrow: "Compras na Tríplice Fronteira",
      h1: "A Tríplice Fronteira das compras",
      h1Destaque: "Tríplice Fronteira",
      body: [
        { text: "Brasil, Argentina e Paraguai se encontram em Foz do Iguaçu — e cada um tem um pedaço do seu roteiro de compras: " },
        { text: "Ciudad del Este", strong: true },
        { text: ", o duty free argentino e os shoppings de Foz, a poucos minutos de distância." },
      ],
    },

    countries: [
      {
        label: "Brasil", city: "Foz do Iguaçu",
        text: [
          "Foz do Iguaçu é a base do seu roteiro de compras: a cidade concentra os shoppings Cataratas JL e Catuaí Palladium e fica a poucos minutos das pontes para Argentina e Paraguai.",
          "Do centro de Foz, a Ponte da Amizade leva a Ciudad del Este e a Ponte Tancredo Neves leva a Puerto Iguazú — as duas rotas de compras cabem no mesmo dia quando você planeja a ordem.",
        ],
        /* ⓘ Foco compras: os dois shoppings de Foz são os destaques do Brasil. */
        highlights: [
          { slug: "cataratas-jl-shopping", label: "Cataratas JL Shopping" },
          { slug: "shopping-catuai-palladium", label: "Shopping Catuaí Palladium" },
        ],
      },
      {
        label: "Argentina", city: "Puerto Iguazú",
        text: [
          "Do lado argentino, Puerto Iguazú guarda o Duty Free — perfumes, eletrônicos e bebidas importadas a preço de free shop — e o By Night, a experiência de compras e gastronomia que esquenta a noite.",
          "A travessia pela Ponte Tancredo Neves é curta: dá para ir ao duty free de dia e voltar com as compras na mala no mesmo dia.",
        ],
        /* ⓘ Destaques da Argentina: Duty Free + By Night (compras + noite argentina). */
        highlights: [
          { slug: "duty-free-shop-puerto-iguazu-argentina", label: "Duty Free Puerto Iguazú" },
          { slug: "by-night-argentina-puerto-iguazu", label: "By Night Puerto Iguazú" },
        ],
      },
      {
        label: "Paraguai", city: "Ciudad del Este",
        text: [
          "Ciudad del Este é o coração das compras no Paraguai: eletrônicos, perfumes, cosméticos e importados concentrados logo depois da Ponte da Amizade.",
          "O comércio abre cedo e fecha no meio da tarde — por isso ele vai no começo do seu dia de compras, não no fim.",
        ],
        /* ⓘ Foco compras: o Paraguai tem um destaque único (Ciudad del Este). O Salto Monday saiu
           — é passeio de natureza, não roteiro de compras. */
        highlights: [
          { slug: "compras-paraguai-ciudad-del-este", label: "Compras na fronteira" },
        ],
      },
    ],
    /* ⓘ Era "O que ver e fazer". Virou "Onde comprar" porque a página é 100% roteiro de compras. */
    seeDoTitle: "Onde comprar",
    crossings: {
      eyebrow: "Logística",
      title: "Como circular entre as compras dos três países",
      items: [
        { from: "Brasil", to: "Paraguai", via: "Ponte da Amizade", note: "liga Foz do Iguaçu a Ciudad del Este — o comércio abre cedo e fecha no meio da tarde, então atravesse de manhã." },
        { from: "Brasil", to: "Argentina", via: "Ponte Tancredo Neves", note: "liga Foz do Iguaçu a Puerto Iguazú — acesso ao Duty Free argentino e ao By Night, a noite de compras e gastronomia." },
      ],
      tipBefore: "Dica:",
      tipText: "leve um documento oficial com foto, atenção ao câmbio de cada país e às cotas da Receita na volta — e, se for a primeira vez, considere ir com uma agência de turismo ou guia; as fronteiras costumam ser movimentadas.",
      tipCtaBefore: "Veja nossa",
      tipCtaLink: "recomendação",
      tipCtaAfter: ".",
    },
    finalCta: {
      title: "Compras nos três países, em um único roteiro.",
      text: "Você conta o que quer comprar e recebe o roteiro completo do seu dia de compras — a ordem das lojas, os horários da ponte e o que vale a pena levar, sem improviso.",
    },
    related: {
      eyebrow: "Os destinos de compras",
      title: "Os 5 roteiros de compras da região",
      subtitle: "Ciudad del Este, Duty Free, By Night e os shoppings de Foz — os cinco destinos do seu roteiro, com horários e dicas em cada página.",
    },
  },
  en: {
    hero: {
      eyebrow: "Shopping on the Triple Frontier",
      h1: "The Triple Frontier of shopping",
      h1Destaque: "Triple Frontier",
      body: [
        { text: "Brazil, Argentina and Paraguay meet in Foz do Iguaçu — and each one has a piece of your shopping plan: " },
        { text: "Ciudad del Este", strong: true },
        { text: ", the Argentine duty free and the malls of Foz, all minutes apart." },
      ],
    },

    countries: [
      {
        label: "Brazil", city: "Foz do Iguaçu",
        text: [
          "Foz do Iguaçu is the base of your shopping plan: the city is home to Cataratas JL Shopping and Shopping Catuaí Palladium, and it's minutes from the bridges to Argentina and Paraguay.",
          "From downtown Foz, the Friendship Bridge takes you to Ciudad del Este and the Tancredo Neves Bridge to Puerto Iguazú — both shopping routes fit in one day when you plan the order.",
        ],
        highlights: [
          { slug: "cataratas-jl-shopping", label: "Cataratas JL Shopping" },
          { slug: "shopping-catuai-palladium", label: "Shopping Catuaí Palladium" },
        ],
      },
      {
        label: "Argentina", city: "Puerto Iguazú",
        text: [
          "On the Argentine side, Puerto Iguazú holds the Duty Free — imported perfumes, electronics and drinks at free-shop prices — and By Night, the shopping-and-dining experience that heats up the evening.",
          "The crossing over the Tancredo Neves Bridge is short: hit the duty free by day and be back with your bags the same day.",
        ],
        highlights: [
          { slug: "duty-free-shop-puerto-iguazu-argentina", label: "Duty Free Puerto Iguazú" },
          { slug: "by-night-argentina-puerto-iguazu", label: "By Night Puerto Iguazú" },
        ],
      },
      {
        label: "Paraguay", city: "Ciudad del Este",
        text: [
          "Ciudad del Este is the heart of Paraguayan shopping: electronics, perfumes, cosmetics and imported goods right after the Friendship Bridge.",
          "Stores open early and close by mid-afternoon — that's why it goes first in your shopping day, not last.",
        ],
        highlights: [
          { slug: "compras-paraguai-ciudad-del-este", label: "Border shopping" },
        ],
      },
    ],
    seeDoTitle: "Where to shop",
    crossings: {
      eyebrow: "Logistics",
      title: "How to get around the three shopping stops",
      items: [
        { from: "Brazil", to: "Paraguay", via: "Friendship Bridge", note: "connects Foz do Iguaçu to Ciudad del Este — stores open early and close by mid-afternoon, so cross in the morning." },
        { from: "Brazil", to: "Argentina", via: "Tancredo Neves Bridge", note: "connects Foz do Iguaçu to Puerto Iguazú — access to the Argentine Duty Free and By Night, the shopping-and-dining night out." },
      ],
      tipBefore: "Tip:",
      tipText: "bring an official photo ID, mind each country's exchange rate and customs allowances on the way back — and if it's your first time, consider going with a tour agency or guide; borders tend to be busy.",
      tipCtaBefore: "See our",
      tipCtaLink: "recommendation",
      tipCtaAfter: ".",
    },
    finalCta: {
      title: "Shopping across all three countries in one plan.",
      text: "Tell us what you want to buy and get your complete shopping plan — the order of stores, bridge hours and what's worth bringing back, with no guesswork.",
    },
    related: {
      eyebrow: "Shopping destinations",
      title: "The 5 shopping guides in the region",
      subtitle: "Ciudad del Este, Duty Free, By Night and the malls of Foz — the five stops of your shopping plan, with hours and tips on each page.",
    },
  },
  es: {
    hero: {
      eyebrow: "Compras en la Triple Frontera",
      h1: "La Triple Frontera de las compras",
      h1Destaque: "Triple Frontera",
      body: [
        { text: "Brasil, Argentina y Paraguay se encuentran en Foz do Iguaçu — y cada uno tiene una parte de tu ruta de compras: " },
        { text: "Ciudad del Este", strong: true },
        { text: ", el duty free argentino y los shoppings de Foz, a pocos minutos de distancia." },
      ],
    },

    countries: [
      {
        label: "Brasil", city: "Foz do Iguaçu",
        text: [
          "Foz do Iguaçu es la base de tu ruta de compras: la ciudad reúne los shoppings Cataratas JL y Catuaí Palladium y queda a pocos minutos de los puentes hacia Argentina y Paraguay.",
          "Desde el centro de Foz, el Puente de la Amistad lleva a Ciudad del Este y el Puente Tancredo Neves a Puerto Iguazú — las dos rutas de compras caben en el mismo día cuando planificas el orden.",
        ],
        highlights: [
          { slug: "cataratas-jl-shopping", label: "Cataratas JL Shopping" },
          { slug: "shopping-catuai-palladium", label: "Shopping Catuaí Palladium" },
        ],
      },
      {
        label: "Argentina", city: "Puerto Iguazú",
        text: [
          "Del lado argentino, Puerto Iguazú guarda el Duty Free — perfumes, electrónicos y bebidas importadas a precio de free shop — y el By Night, la experiencia de compras y gastronomía que anima la noche.",
          "El cruce por el Puente Tancredo Neves es corto: ve al duty free de día y vuelve con las bolsas el mismo día.",
        ],
        highlights: [
          { slug: "duty-free-shop-puerto-iguazu-argentina", label: "Duty Free Puerto Iguazú" },
          { slug: "by-night-argentina-puerto-iguazu", label: "By Night Puerto Iguazú" },
        ],
      },
      {
        label: "Paraguay", city: "Ciudad del Este",
        text: [
          "Ciudad del Este es el corazón de las compras paraguayas: electrónicos, perfumes, cosméticos e importados justo después del Puente de la Amistad.",
          "El comercio abre temprano y cierra a media tarde — por eso va primero en tu día de compras, no al final.",
        ],
        highlights: [
          { slug: "compras-paraguai-ciudad-del-este", label: "Compras en la frontera" },
        ],
      },
    ],
    seeDoTitle: "Dónde comprar",
    crossings: {
      eyebrow: "Logística",
      title: "Cómo circular entre las compras de los tres países",
      items: [
        { from: "Brasil", to: "Paraguay", via: "Puente de la Amistad", note: "conecta Foz do Iguaçu con Ciudad del Este — el comercio abre temprano y cierra a media tarde, cruza por la mañana." },
        { from: "Brasil", to: "Argentina", via: "Puente Tancredo Neves", note: "conecta Foz do Iguaçu con Puerto Iguazú — acceso al Duty Free argentino y al By Night, la noche de compras y gastronomía." },
      ],
      tipBefore: "Consejo:",
      tipText: "lleva un documento oficial con foto, presta atención al tipo de cambio de cada país y a las cuotas de aduana a la vuelta — y si es tu primera vez, considera ir con una agencia de turismo o guía; las fronteras suelen estar concurridas.",
      tipCtaBefore: "Mira nuestra",
      tipCtaLink: "recomendación",
      tipCtaAfter: ".",
    },
    finalCta: {
      title: "Compras en los tres países en un solo plan.",
      text: "Cuéntanos qué quieres comprar y recibe tu plan completo de compras — el orden de las tiendas, los horarios del puente y qué vale la pena traer, sin improvisar.",
    },
    related: {
      eyebrow: "Los destinos de compras",
      title: "Las 5 guías de compras de la región",
      subtitle: "Ciudad del Este, Duty Free, By Night y los shoppings de Foz — las cinco paradas de tu plan, con horarios y consejos en cada página.",
    },
  },
};