// Filepath: app/triplice-fronteira/page.tsx
// Version: 4.0
// Nome da Versão: "Foco Compras PY — metadata/FAQ/JSON-LD do pilar reescritos para o roteiro de compras"

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
  title: "Compras na Tríplice Fronteira: Paraguai, Argentina e Brasil",
  description:
    "Roteiro de compras na Tríplice Fronteira: Ciudad del Este no Paraguai, Duty Free e By Night na Argentina e os shoppings de Foz do Iguaçu — horários, pontes e o que vale a pena levar.",
  path: URL_PATH,
  silo: "triplice",
  keywords: [
    "compras na tríplice fronteira",
    "compras no paraguai foz",
    "compras em Ciudad del Este",
    "duty free puerto iguazú",
    "by night puerto iguazú",
    "shopping catuaí palladium",
    "cataratas jl shopping",
    "ponte da amizade compras",
  ],
  image: BRAND_OG_IMAGE,
  imageAlt: "Compras na Tríplice Fronteira — Compras Paraguay",
  type: "article",
});

const FAQ = [
  {
    q: "O que é a Tríplice Fronteira?",
    a: "É o ponto em que Brasil, Argentina e Paraguai se encontram, na confluência dos rios Iguaçu e Paraná, em Foz do Iguaçu. Para o roteiro de compras, a Tríplice Fronteira é uma vantagem rara: três eixos de compras (Ciudad del Este, duty free argentino e shoppings de Foz) a poucos minutos um do outro.",
  },
  {
    q: "Onde ficam as compras de cada país?",
    a: "No Paraguai: Ciudad del Este, logo depois da Ponte da Amizade — eletrônicos, perfumes e importados. Na Argentina: o Duty Free de Puerto Iguazú e o By Night, a noite de compras e gastronomia. No Brasil: os shoppings Cataratas JL e Catuaí Palladium, em Foz do Iguaçu.",
  },
  {
    q: "Precisa de passaporte para ir à Argentina ou ao Paraguai?",
    a: "Brasileiros em geral entram na Argentina e no Paraguai com documento válido (RG em bom estado ou passaporte — confira regras atualizadas). Leve documento original e atenção à cota de compras da Receita na volta; menores e veículos têm regras extras.",
  },
  {
    q: "Dá para fazer as compras dos três países em um dia?",
    a: "O mais confortável é um dia para Ciudad del Este (o comércio abre cedo e fecha no meio da tarde) e o fim de tarde/noite na Argentina (Duty Free + By Night). Os shoppings de Foz encaixam como base do roteiro, de manhã ou antes de atravessar.",
  },
  {
    q: "Qual a melhor ordem para o roteiro de compras?",
    a: "Comece por Ciudad del Este, enquanto as lojas estão abertas, e volte pelo Brasil no meio da tarde. À noite, atravesse para Puerto Iguazú: Duty Free + By Night na mesma ida. Deixe os shoppings de Foz para os momentos que sobrarem do dia ou para um segundo dia mais leve.",
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
            "Compras na Tríplice Fronteira: Paraguai, Argentina e Brasil",
          description:
            "Roteiro de compras na Tríplice Fronteira: Ciudad del Este, Duty Free e By Night na Argentina e os shoppings de Foz do Iguaçu.",
          url: URL_PATH,
          datePublished: PUBLISHED_ISO,
          dateModified: UPDATED_ISO,
          image: BRAND_OG_IMAGE,
        })}
      />
      <JsonLd
        data={itemListSchema({
          name: "Eixos de compras da Tríplice Fronteira",
          description: "Onde comprar em cada país da Tríplice Fronteira.",
          items: [
            { name: "Brasil — Shoppings de Foz", url: "/roteiros-de-compras" },
            { name: "Argentina — Duty Free e By Night", url: "/roteiros-de-compras" },
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