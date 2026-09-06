// Filepath: app/roteiros-de-compras/page.tsx
// Version: 3.1
// Nome da Versão: "Hub e páginas individuais agora sob /roteiros-de-compras — a rota /atrativos saiu"
//
// Central do produto: os 5 destinos de compras do eixo compras/fronteira.
// As páginas individuais vivem em /roteiros-de-compras/[slug]. `/atrativos` era herança do projeto
// de conteúdo (atraivo = turismo = ingresso) e FOI; o caminho todo é roteiros/destinos de compras.

import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import AtrativosFozContent from "@/components/atrativos/AtrativosFozContent";
import { attractions } from "@/app/data/attractions";
import {
  BRAND_OG_IMAGE,
  breadcrumbSchema,
  faqSchema,
  articleSchema,
  itemListSchema,
  pageMetadata,
} from "@/lib/seo";

const URL_PATH = "/roteiros-de-compras";
const PUBLISHED_ISO = "2026-07-11";
const UPDATED_ISO = "2026-07-11";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "Roteiro de compras no Paraguai | Compras Paraguay",
  description:
    "Ciudad del Este, Duty Free de Puerto Iguazú, By Night e os shoppings Cataratas JL e Catuaí Palladium — o seu roteiro de compras na fronteira, organizado.",
  path: URL_PATH,
  silo: "compras",
  keywords: [
    "compras no Paraguai",
    "roteiro de compras Ciudad del Este",
    "duty free Puerto Iguazú",
    "Cataratas JL Shopping",
    "Shopping Catuaí Palladium",
    "compras em Foz do Iguaçu e Paraguai",
  ],
  imageAlt: "Roteiro de compras na fronteira — Compras Paraguay",
  type: "website",
});

const FAQ = [
  {
    q: "Como recebo o meu roteiro de compras pelo Compras Paraguay?",
    a: "Abra a página do atrativo (Ciudad del Este, Duty Free, By Night ou um dos shoppings) e clique no botão de interesse. Você preenche um formulário curto com a data e quantas pessoas são, e o retorno traz as condições e a melhor ordem para o seu dia de compras.",
  },
  {
    q: "O que inclui um roteiro de compras?",
    a: "O eixo de compras da fronteira: Ciudad del Este (Ponte da Amizade), Duty Free e By Night de Puerto Iguazú (Argentina) e os shoppings Cataratas JL e Catuaí Palladium, em Foz. Cada um tem o que é, onde fica, horários e dicas.",
  },
  {
    q: "Quantos atrativos de compras tem o guia?",
    a: `Ao todo são ${attractions.length} páginas próprias no eixo de compras/fronteira. Cada uma tem o que é, onde fica, horários e dicas para encaixar no seu roteiro.`,
  },
  {
    q: "Posso ver um atrativo sem seguir um roteiro pronto?",
    a: "Sim. Cada destino tem página própria em /roteiros-de-compras — você abre o que interessa e decide o dia.",
  },
  {
    q: "Quantos dias para as compras na fronteira?",
    a: "Um dia dá conta de Ciudad del Este (de manhã, enquanto o comércio abre) e o fim da tarde em Puerto Iguazú. Se quiser incluir os shoppings de Foz, dois dias ficam confortáveis.",
  },
  {
    q: "Duty Free e By Night são o mesmo passeio?",
    a: "Não. O Duty Free é o free shop de Puerto Iguazú (aberto de dia); o By Night é a experiência noturna de gastronomia e animação na Argentina. Dá para fazer os dois em momentos diferentes do dia.",
  },
];

export default function RoteirosDeComprasPage() {
  return (
    <>
      <JsonLd data={faqSchema(FAQ)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Roteiro de compras", url: URL_PATH },
        ])}
      />
      <JsonLd
        data={itemListSchema({
          name: "Roteiro de compras na fronteira",
          description:
            "Catálogo de compras em Ciudad del Este, Duty Free e shoppings da Tríplice Fronteira.",
          items: attractions.map((a) => ({
            name: a.name,
            url: `/roteiros-de-compras/${a.slug}`,
          })),
        })}
      />
      <JsonLd
        data={articleSchema({
          headline: "Roteiro de compras na fronteira: Ciudad del Este, Duty Free e shoppings",
          description:
            "Guia de compras na Tríplice Fronteira — páginas individuais, horários e dicas para montar o seu dia.",
          url: URL_PATH,
          datePublished: PUBLISHED_ISO,
          dateModified: UPDATED_ISO,
          image: BRAND_OG_IMAGE,
        })}
      />
      <AtrativosFozContent />
    </>
  );
}
