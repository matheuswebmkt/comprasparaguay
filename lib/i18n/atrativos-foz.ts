// Filepath: lib/i18n/atrativos-foz.ts
// Version: 1.1
// Nome da Versão: "Dicionário i18n do hub /atrativos (pt/en/es)"
//
// Cobre só a parte VISÍVEL (client). JSON-LD (FAQ/ItemList/Breadcrumb/Article) e `metadata` continuam em
// pt no page.tsx (SEO canônico). Nomes de atrativos (app/data/attractions.ts) ficam intactos.

import type { Locale } from "./config";

export interface AtrativosFozUI {
  /* ⓘ Havia aqui um bloco `hero` (eyebrow, h1, p1, p2, chips). A página tinha DOIS cabeçalhos
     empilhados — essa hero e o cabeçalho da grade logo abaixo — dizendo a mesma coisa. O da
     grade subiu para a hero e este foi deletado, nos três locales.
     ⚠️ Não recriar: quem apresenta `/atrativos` é `grid`. */
  grid: {
    eyebrow: string;
    title: string;
    /** Trecho de `title` que recebe o destaque em Verde Selva na hero. Se a substring não
     *  existir em `title`, o título renderiza inteiro sem destaque — degrada sem quebrar. */
    titleDestaque: string;
    subtitle: string;
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
      eyebrow: "Pontos turísticos",
      title: "Os principais atrativos de Foz do Iguaçu",
      titleDestaque: "atrativos",
      subtitle: "Da natureza às compras: um guia direto dos lugares que valem a visita em Foz do Iguaçu e na Tríplice Fronteira.",
    },
    faq: {
      eyebrow: "Perguntas frequentes",
      title: "Dúvidas sobre os atrativos de Foz do Iguaçu",
      items: [
        { q: "Quais são os principais atrativos de Foz do Iguaçu?", a: "Os destaques são as Cataratas do Iguaçu (uma das Sete Maravilhas da Natureza), o Parque das Aves, a Usina de Itaipu e o Marco das Três Fronteiras. A cidade também tem parques como o Dreams Park Show e o Aquafoz, além de shoppings e uma gastronomia diversa." },
        { q: "O que fazer em Foz do Iguaçu além das Cataratas?", a: "Muita coisa: Parque das Aves, Itaipu e sua iluminação, Marco das Três Fronteiras, parques temáticos e shoppings. Em dias de chuva, opções cobertas ajudam. Monte a sequência no hub de roteiros do Compras Paraguay." },
        { q: "Quantos dias são necessários para conhecer Foz do Iguaçu?", a: "Para o essencial — Cataratas dos lados brasileiro e argentino, Parque das Aves, Itaipu e Marco das Três Fronteiras —, reserve de 3 a 4 dias. Com mais tempo, dá para incluir parques temáticos, compras no Paraguai e o pôr do sol na roda-gigante." },
        { q: "Quais atrativos de Foz do Iguaçu são bons para ir com crianças?", a: "O Parque das Aves, o Dreams Park Show (Vale dos Dinossauros) e o Aquafoz costumam agradar famílias. Monte a sequência no hub de roteiros (Clássico ou Aventura)." },
      ],
    },
  },
  en: {
    grid: {
      eyebrow: "Tourist spots",
      title: "The main attractions in Foz do Iguaçu",
      titleDestaque: "attractions",
      subtitle: "From nature to shopping: a straightforward guide to the places worth visiting in Foz do Iguaçu and the Tríplice Fronteira.",
    },
    faq: {
      eyebrow: "Frequently asked questions",
      title: "Questions about Foz do Iguaçu's attractions",
      items: [
        { q: "What are the main attractions in Foz do Iguaçu?", a: "The highlights are the Iguaçu Falls (one of the Seven Natural Wonders), the Bird Park, the Itaipu Dam and the Marco das Três Fronteiras. The city also has parks like Dreams Park Show and Aquafoz, plus malls and a diverse food scene." },
        { q: "What else is there to do in Foz do Iguaçu besides the Falls?", a: "Plenty: Bird Park, Itaipu, Triple Frontier Landmark, theme parks and malls. On rainy days, covered options help. Build the day plan in the itineraries hub." },
        { q: "How many days do you need to see Foz do Iguaçu?", a: "For the essentials — Falls, Bird Park, Itaipu and the Triple Frontier Landmark — set aside 3 to 4 days. With more time, add theme parks, border shopping and food. See 1–7 day plans on /roteiros." },
        { q: "Which Foz do Iguaçu attractions are good for kids?", a: "Bird Park, Dreams Park Show and Aquafoz are family favorites. Ready-made “with kids” itineraries are on the hub." },
      ],
    },
  },
  es: {
    grid: {
      eyebrow: "Puntos turísticos",
      title: "Los principales atractivos de Foz do Iguaçu",
      titleDestaque: "atractivos",
      subtitle: "De la naturaleza a las compras: una guía directa de los lugares que valen la visita en Foz do Iguaçu y la Tríplice Fronteira.",
    },
    faq: {
      eyebrow: "Preguntas frecuentes",
      title: "Dudas sobre los atractivos de Foz do Iguaçu",
      items: [
        { q: "¿Cuáles son los principales atractivos de Foz do Iguaçu?", a: "Los destacados son las Cataratas del Iguazú (una de las Siete Maravillas de la Naturaleza), el Parque de las Aves, la Represa de Itaipú y el Marco das Três Fronteiras. La ciudad también tiene parques como Dreams Park Show y Aquafoz, además de shoppings y una gastronomía diversa." },
        { q: "¿Qué hacer en Foz do Iguaçu además de las Cataratas?", a: "Mucho: Parque de las Aves, Itaipú, Marco de las Tres Fronteras, parques y shoppings. En días de lluvia, opciones cubiertas ayudan. Arma la secuencia en el hub de itinerarios de Compras Paraguay." },
        { q: "¿Cuántos días se necesitan para conocer Foz do Iguaçu?", a: "Para lo esencial — Cataratas del lado brasileño y argentino, Parque de las Aves, Itaipú y Marco das Três Fronteiras —, reserva de 3 a 4 días. Con más tiempo, puedes incluir parques temáticos, compras en Paraguay y el atardecer en la rueda gigante." },
        { q: "¿Qué atractivos de Foz do Iguaçu son buenos para ir con niños?", a: "El Parque de las Aves, Dreams Park Show y Aquafoz suelen gustar a las familias. Hay itinerarios listos en el perfil “Con niños” en el hub." },
      ],
    },
  },
};
