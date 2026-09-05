// Filepath: app/atrativos/page.tsx
// Version: 2.0
// Nome da Versão: "Hub canônico de atrativos — SEO absoluto + ItemList + FAQ + Article"
//
// Central do produto para atrativos individuais. /o-que-fazer-em-foz fica como pilar
// SEO de intenção (conteúdo editorial) e aponta para cá.

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

const URL_PATH = "/atrativos";
const PUBLISHED_ISO = "2026-07-11";
const UPDATED_ISO = "2026-07-11";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "Atrativos e ingressos em Foz do Iguaçu | Compras Paraguay",
  // ⚠️ A description anterior nomeava o parceiro comercial ("compre ingresso com a agência…"),
  // proibido por §21.5 em copy de marketing — e estava viva na SERP. O checker não pega esse caso
  // (§21.9), então a verificação aqui é leitura, não script.
  description:
    "Cataratas, Parque das Aves, Roda Gigante Yup Star, Compras Paraguai e outros passeios da Tríplice Fronteira. Ingresso e roteiro completo em Foz do Iguaçu.",
  path: URL_PATH,
  silo: "atrativos",
  keywords: [
    "atrativos de foz do iguaçu",
    "ingressos foz do iguaçu",
    "comprar ingresso foz",
    "pontos turísticos foz do iguaçu",
    "o que visitar em foz do iguaçu",
    "passeios em foz do iguaçu",
    "cataratas do iguaçu",
    "parque das aves",
    "itaipu binacional",
  ],
  imageAlt: "Atrativos e ingressos em Foz do Iguaçu — Compras Paraguay",
  type: "website",
});

const FAQ = [
  {
    q: "Como comprar ingresso dos atrativos pelo Compras Paraguay?",
    a: "Abra a página do atrativo e clique em “Comprar ingresso”. Você preenche um formulário curto com a data e quantas pessoas são, e o retorno traz disponibilidade e as opções de transporte — sem te mandar para sites externos no meio do caminho.",
  },
  {
    q: "Quais são os principais atrativos de Foz do Iguaçu?",
    a: "Os destaques são as Cataratas do Iguaçu, o Parque das Aves, a Usina de Itaipu e o Marco das Três Fronteiras. O catálogo também cobre Macuco Safari, lado argentino, compras no Paraguai, Duty Free, Feirinha, parques temáticos e lazer noturno.",
  },
  {
    q: "Quantos atrativos tem o guia do Compras Paraguay?",
    a: `Listamos dezenas de atrativos com página própria (atualmente ${attractions.length}), cobrindo Brasil, Argentina e Paraguai na região de Foz. Cada um tem o que é, onde fica e dicas para o roteiro.`,
  },
  {
    q: "Posso ver um atrativo sem seguir um roteiro pronto?",
    a: "Sim. Cada atrativo tem página em /atrativos. Os roteiros prontos (quando você for montar o plano) usam esses mesmos pontos em turnos manhã, tarde e noite.",
  },
  {
    q: "Quantos dias para conhecer Foz do Iguaçu?",
    a: "Para o essencial, 3 a 4 dias. Com 5 a 7 dias cabem Argentina, Paraguai, parques e gastronomia. Veja também o guia “o que fazer em Foz” e os planos em /roteiros.",
  },
  {
    q: "Duty Free e Feirinha são o mesmo atrativo?",
    a: "Não. São páginas e experiências separadas — você pode querer só o free shop, só a feirinha ou os dois no mesmo dia na Argentina.",
  },
  {
    q: "Onde fica o mapa mental dos passeios?",
    a: "Comece por este catálogo e pelo pilar Tríplice Fronteira. Para intenção de busca (“o que fazer em 3 dias”), use /o-que-fazer; para compras, o roteiro de Ciudad del Este está em /atrativos/compras-paraguai-ciudad-del-este.",
  },
];

export default function AtrativosIndexPage() {
  return (
    <>
      <JsonLd data={faqSchema(FAQ)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Atrativos de Foz do Iguaçu", url: URL_PATH },
        ])}
      />
      <JsonLd
        data={itemListSchema({
          name: "Atrativos de Foz do Iguaçu",
          description:
            "Catálogo de pontos turísticos e passeios em Foz do Iguaçu e Tríplice Fronteira.",
          items: attractions.map((a) => ({
            name: a.name,
            url: `/atrativos/${a.slug}`,
          })),
        })}
      />
      <JsonLd
        data={articleSchema({
          headline:
            "Atrativos de Foz do Iguaçu: catálogo completo do que visitar",
          description:
            "Guia dos atrativos de Foz do Iguaçu e da Tríplice Fronteira — páginas individuais, dicas e encaixe no roteiro.",
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
