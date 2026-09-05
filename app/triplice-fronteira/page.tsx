// Filepath: app/triplice-fronteira/page.tsx
// Version: 3.0
// Nome da Versão: "Pilar Tríplice Fronteira — SEO absoluto + FAQ + Article"

import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import TriplaFronteiraContent from "@/components/triplice-fronteira/TriplaFronteiraContent";
import {
  breadcrumbSchema,
  faqSchema,
  articleSchema,
  pageMetadata,
  BRAND_OG_IMAGE,
  itemListSchema,
} from "@/lib/seo";

const URL_PATH = "/triplice-fronteira";
const PUBLISHED_ISO = "2026-07-10";
const UPDATED_ISO = "2026-07-11";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  // ⚠️ Sem sufixo `| Compras Paraguay`: os três países SÃO a consulta desta página, e a marca só caberia
  // no lugar deles. Mesma exceção da home — ver conventions/seo.md §19.
  title: "Tríplice Fronteira em Foz: Brasil, Argentina e Paraguai",
  description:
    "Explore os principais atrativos em Foz do Iguaçu e região: Feirinha na Argentina, Compras no Paraguai, Cataratas dos dois lados e muito mais.",
  path: URL_PATH,
  silo: "triplice",
  keywords: [
    "tríplice fronteira",
    "tríplice fronteira foz do iguaçu",
    "marco das três fronteiras",
    "o que fazer tríplice fronteira",
    "fronteira brasil argentina paraguai",
    "compras no paraguai foz",
    "cataratas lado argentino",
  ],
  image: BRAND_OG_IMAGE,
  imageAlt: "Tríplice Fronteira — Foz do Iguaçu | Compras Paraguay",
  type: "article",
});

const FAQ = [
  {
    q: "O que é a Tríplice Fronteira?",
    a: "É o ponto em que Brasil, Argentina e Paraguai se encontram, na confluência dos rios Iguaçu e Paraná, em Foz do Iguaçu. Do Marco das Três Fronteiras dá para ver os três obeliscos — um em cada país.",
  },
  {
    q: "O que fazer na Tríplice Fronteira em Foz do Iguaçu?",
    a: "No Brasil: Cataratas, Parque das Aves, Itaipu, Marco e cidade. Na Argentina: Cataratas lado AR, Duty Free e Feirinha. No Paraguai: Compras Paraguai - Ciudad del Este. O ideal é combinar por corredor e dia, sem cruzar fronteira sem planejamento.",
  },
  {
    q: "Precisa de passaporte para ir à Argentina ou ao Paraguai?",
    a: "Brasileiros em geral entram na Argentina e no Paraguai com documento válido (RG em bom estado ou passaporte — confira regras atualizadas). Leve documento original; menores e veículos têm regras extras. Em dúvida, pergunte à agência ou consulado.",
  },
  {
    q: "Dá para conhecer os três países em um dia?",
    a: "É possível “tocar” os três, mas costuma ser corrido. O mais confortável é separar: um dia forte de Cataratas BR + natureza, um dia AR (Cataratas ou compras), e meio dia ou dia de Paraguai — ou encaixar o Marco ao fim de um dia no Brasil.",
  },
  {
    q: "Onde ver o encontro dos três países?",
    a: "No Marco das Três Fronteiras (lado brasileiro), com mirante, pôr do sol e shows culturais. Há marcos também nos lados argentino e paraguaio, cada um com experiência própria.",
  },
];

export default function TriplaFronteiraPage() {
  return (
    <>
      <JsonLd data={faqSchema(FAQ)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Tríplice Fronteira", url: URL_PATH },
        ])}
      />
      <JsonLd
        data={articleSchema({
          headline:
            "Tríplice Fronteira de Foz do Iguaçu: Brasil, Argentina e Paraguai",
          description:
            "Guia completo da Tríplice Fronteira: o que fazer em cada país, fronteiras e como montar o roteiro em Foz do Iguaçu.",
          url: URL_PATH,
          datePublished: PUBLISHED_ISO,
          dateModified: UPDATED_ISO,
          image: BRAND_OG_IMAGE,
        })}
      />
      <JsonLd
        data={itemListSchema({
          name: "Eixos da Tríplice Fronteira",
          description: "Países e experiências ligadas a Foz do Iguaçu.",
          items: [
            { name: "Brasil — Foz do Iguaçu", url: "/roteiros-de-compras" },
            { name: "Argentina — Cataratas e compras", url: "/roteiros-de-compras" },
            { name: "Paraguai — Ciudad del Este", url: "/roteiros-de-compras" },
          ],
        })}
      />
      {/* ⓘ Sem `partnerPicks`: a curadoria de parceiros saiu da página (decisão do usuário). Era
          a única razão de este Server Component injetar JSX no client — a busca ao banco vinha
          junto. Se voltar, volta pelo mesmo caminho: `<PartnerPicks />` como prop. */}
      <TriplaFronteiraContent />
    </>
  );
}
