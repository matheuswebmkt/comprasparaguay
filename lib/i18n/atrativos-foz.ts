// Filepath: lib/i18n/atrativos-foz.ts
// Version: 2.0
// Nome da Versão: "Foco Compras PY — dicionário do hub /roteiros-de-compras reescrito"
//
// Cobre só a parte VISÍVEL (client). JSON-LD (FAQ/ItemList/Breadcrumb/Article) e `metadata` continuam em
// pt no page.tsx (SEO canônico). A página é o hub do roteiro de compras: Ciudad del Este, Duty Free,
// By Night e os shoppings de Foz — nenhum conteúdo de turismo geral (Cataratas, Itaipu, parques) aqui.

import type { Locale } from "./config";

export interface AtrativosFozUI {
  /* ⓘ Havia aqui um bloco `hero` (eyebrow, h1, p1, p2, chips). A página tinha DOIS cabeçalhos
     empilhados — essa hero e o cabeçalho da grade logo abaixo — dizendo a mesma coisa. O da
     grade subiu para a hero e este foi deletado, nos três locales.
     ⚠️ Não recriar: quem apresenta `/roteiros-de-compras` é `grid`. */
  grid: {
    eyebrow: string;
    title: string;
    /** Trecho de `title` que recebe o destaque em Verde Selva na hero. Se a substring não
     *  existir em `title`, o título renderiza inteiro sem destaque — degrada sem quebrar. */
    titleDestaque: string;
    subtitle: string;
    /** Rótulo do CTA de rolagem para a grade (âncora interna `#atrativos`). */
    cta: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    items: { q: string; a: string }[];
  };
}

export const ATRATIVOS_FOZ_UI: Record<Locale, AtrativosFozUI> = {
  pt: {
    grid: {
      eyebrow: "Roteiro de compras",
      title: "Os 5 destinos de compras da fronteira",
      titleDestaque: "compras",
      subtitle:
        "Ciudad del Este, Duty Free e By Night de Puerto Iguazú e os shoppings de Foz — cada um com horários, dicas e a melhor ordem para o seu dia de compras.",
      cta: "Ver destinos de compras",
    },
    faq: {
      eyebrow: "Perguntas frequentes",
      title: "Dúvidas sobre o roteiro de compras",
      items: [
        { q: "Quais são os destinos de compras da fronteira?", a: "São cinco: Compras em Ciudad del Este (Paraguai), Duty Free e By Night de Puerto Iguazú (Argentina) e os shoppings Cataratas JL e Catuaí Palladium, em Foz do Iguaçu. Cada um tem página própria com horários e dicas." },
        { q: "Qual a melhor ordem para o roteiro de compras?", a: "Comece por Ciudad del Este, enquanto o comércio está aberto (as lojas fecham no meio da tarde), e volte pelo Brasil. Encaixe o duty free argentino no meio da tarde e, se quiser, a noite no By Night. Os shoppings de Foz entram nos momentos que sobram do dia." },
        { q: "Dá para fazer Ciudad del Este e a Argentina no mesmo dia?", a: "Dá. A travessia da Ponte da Amizade leva à Ciudad del Este e a Ponte Tancredo Neves a Puerto Iguazú — os dois eixos de compras cabem no mesmo dia quando você planeja a ordem e respeita os horários de cada lado." },
        { q: "Qual a diferença entre o Duty Free e o By Night?", a: "O Duty Free é o free shop de Puerto Iguazú — perfumes, eletrônicos e bebidas importadas — aberto de dia. O By Night é a experiência de compras e gastronomia da noite argentina. Os dois ficam na mesma região e combinam bem no mesmo roteiro." },
        { q: "Como recebo o meu roteiro de compras?", a: "Na página de qualquer um dos cinco destinos, clique no botão e deixe seus dados. Um especialista revisa as suas escolhas e entra em contato com as condições e a melhor ordem para o seu dia de compras." },
      ],
    },
  },
  en: {
    grid: {
      eyebrow: "Shopping plan",
      title: "The 5 border shopping destinations",
      titleDestaque: "shopping",
      subtitle:
        "Ciudad del Este, Puerto Iguazú's Duty Free and By Night, and the Foz malls — each with hours, tips and the best order for your shopping day.",
      cta: "See shopping destinations",
    },
    faq: {
      eyebrow: "Frequently asked questions",
      title: "Questions about the shopping plan",
      items: [
        { q: "What are the border's shopping destinations?", a: "There are five: shopping in Ciudad del Este (Paraguay), Duty Free and By Night in Puerto Iguazú (Argentina), and the Cataratas JL and Catuaí Palladium malls in Foz do Iguaçu. Each has its own page with hours and tips." },
        { q: "What's the best order for the shopping plan?", a: "Start in Ciudad del Este while stores are open (they close by mid-afternoon), then head back through Brazil. Fit the Argentine duty free in mid-afternoon and, if you like, the By Night evening. Foz's malls fill the spare moments of the day." },
        { q: "Can I do Ciudad del Este and Argentina on the same day?", a: "Yes. The Friendship Bridge crossing takes you to Ciudad del Este and the Tancredo Neves Bridge to Puerto Iguazú — both shopping axes fit in one day when you plan the order and respect each side's hours." },
        { q: "What's the difference between Duty Free and By Night?", a: "Duty Free is Puerto Iguazú's duty-free shop — perfumes, electronics and imported drinks — open by day. By Night is the shopping-and-dining experience of the Argentine evening. They're in the same area and pair well in one plan." },
        { q: "How do I get my shopping plan?", a: "On any of the five destination pages, click the button and leave your details. A specialist reviews your choices and gets in touch with the conditions and the best order for your shopping day." },
      ],
    },
  },
  es: {
    grid: {
      eyebrow: "Ruta de compras",
      title: "Los 5 destinos de compras de la frontera",
      titleDestaque: "compras",
      subtitle:
        "Ciudad del Este, Duty Free y By Night de Puerto Iguazú y los shoppings de Foz — cada uno con horarios, consejos y el mejor orden para tu día de compras.",
      cta: "Ver destinos de compras",
    },
    faq: {
      eyebrow: "Preguntas frecuentes",
      title: "Dudas sobre la ruta de compras",
      items: [
        { q: "¿Cuáles son los destinos de compras de la frontera?", a: "Son cinco: compras en Ciudad del Este (Paraguay), Duty Free y By Night de Puerto Iguazú (Argentina) y los shoppings Cataratas JL y Catuaí Palladium, en Foz do Iguaçu. Cada uno tiene su propia página con horarios y consejos." },
        { q: "¿Cuál es el mejor orden para la ruta de compras?", a: "Empieza por Ciudad del Este mientras el comercio está abierto (las tiendas cierran a media tarde) y vuelve por Brasil. Encaja el duty free argentino en la media tarde y, si quieres, la noche en el By Night. Los shoppings de Foz entran en los momentos que sobran del día." },
        { q: "¿Puedo hacer Ciudad del Este y Argentina el mismo día?", a: "Sí. El cruce del Puente de la Amistad lleva a Ciudad del Este y el Puente Tancredo Neves a Puerto Iguazú — los dos ejes de compras caben en un mismo día cuando planificas el orden y respetas los horarios de cada lado." },
        { q: "¿Cuál es la diferencia entre el Duty Free y el By Night?", a: "El Duty Free es el free shop de Puerto Iguazú — perfumes, electrónicos y bebidas importadas — abierto de día. El By Night es la experiencia de compras y gastronomía de la noche argentina. Están en la misma zona y combinan bien en la misma ruta." },
        { q: "¿Cómo recibo mi ruta de compras?", a: "En la página de cualquiera de los cinco destinos, haz clic en el botón y deja tus datos. Un especialista revisa tus elecciones y se comunica contigo con las condiciones y el mejor orden para tu día de compras." },
      ],
    },
  },
};