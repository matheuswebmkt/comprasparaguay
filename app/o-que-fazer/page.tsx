// Filepath: app/o-que-fazer/page.tsx
// Version: 4.2
// Nome da Versão: "Conteúdo visível extraído para OQueFazerContent (client, i18n)"
//
// Intenção de busca editorial. Catálogo canônico de atrativos = /atrativos.
// O conteúdo VISÍVEL vive em `components/o-que-fazer/OQueFazerContent.tsx` (i18n pt/en/es);
// este arquivo fica com metadata, JSON-LD e FAQ canônico em pt (SEO canônico).

import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import OQueFazerContent from "@/components/o-que-fazer/OQueFazerContent";
import {
  breadcrumbSchema,
  faqSchema,
  articleSchema,
  itemListSchema,
  pageMetadata,
  BRAND_OG_IMAGE,
} from "@/lib/seo";
import { attractions } from "@/app/data/attractions";
import type { Attraction } from "@/app/types";

const URL_PATH = "/o-que-fazer";
const PUBLISHED_ISO = "2026-07-10";
const UPDATED_ISO = "2026-07-11";

export const metadata: Metadata = pageMetadata({
  title: "O que fazer em Foz do Iguaçu: guia inteligente | Compras Paraguay",
  description:
    "Roteiros, ingressos, gastronomia e compras: recomendações do que realmente vale a pena nos seus dias em Foz do Iguaçu e região",
  path: URL_PATH,
  silo: "oQueFazer",
  keywords: [
    "o que fazer em foz do iguaçu",
    "o que fazer em foz do iguaçu em 3 dias",
    "o que fazer em foz do iguaçu em 2 dias",
    "o que fazer em foz do iguaçu em 1 dia",
    "o que fazer em foz do iguaçu em 4 dias",
    "o que fazer em foz do iguaçu em 5 dias",
    "passeios em foz do iguaçu",
    "pontos turísticos foz do iguaçu",
  ],
  image: BRAND_OG_IMAGE,
  imageAlt: "O que fazer em Foz do Iguaçu — Compras Paraguay",
  type: "article",
});

// FAQ fica em pt (canônico p/ SEO — usado só no JSON-LD). O texto exibido ao visitante vem do
// dicionário i18n (lib/i18n/o-que-fazer.ts), renderizado em OQueFazerContent.
const FAQ = [
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
    a: "No hub /atrativos — cada ponto tem página própria (Duty Free, Compras em Ciudad del Este, Cataratas JL Shopping, Shopping Catuaí Palladium, By Night Puerto Iguazú).",
  },
  {
    q: "Onde ficam as opções de compras?",
    a: "No hub /atrativos: Ciudad del Este fica a uma travessia da Ponte da Amizade, e os shoppings e duty free da região de Foz aparecem com horários e dicas no guia.",
  },
  {
    q: "O que é a Tríplice Fronteira e como encaixar?",
    a: "É o encontro de Brasil, Argentina e Paraguai em Foz. Guia dedicado em /triplice-fronteira: o que fazer em cada país e como atravessar sem estresse.",
  },
];

// Destaques da seção — ordem curada, não derivada do dado (usado no itemListSchema).
const DESTAQUE_SLUGS = [
  "cataratas-do-iguacu",
  "parque-das-aves",
  "marco-das-tres-fronteiras",
  "itaipu-binacional",
  "roda-gigante-yup-star",
  "compras-paraguai-ciudad-del-este",
  "duty-free-shop-puerto-iguazu-argentina",
  "dreams-park-show",
  "aquafoz",
];

export default function OQueFazerEmFozSeoPage() {
  // Exibe os 4 primeiros da curadoria (o quarteto clássico) — o resto fica no guia completo.
  const listItems: Attraction[] = DESTAQUE_SLUGS.slice(0, 4)
    .map((slug) => attractions.find((a) => a.slug === slug))
    .filter((a): a is Attraction => Boolean(a));

  return (
    <>
      <JsonLd data={faqSchema(FAQ)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "O que fazer em Foz do Iguaçu", url: URL_PATH },
        ])}
      />
      <JsonLd
        data={articleSchema({
          headline: "O que fazer em Foz do Iguaçu — guia completo do Compras Paraguay",
          description:
            "Guia de intenção: o que fazer em Foz em 1 a 7 dias, atrativos, fronteira e gastronomia.",
          url: URL_PATH,
          datePublished: PUBLISHED_ISO,
          dateModified: UPDATED_ISO,
          image: BRAND_OG_IMAGE,
        })}
      />
      <JsonLd
        data={itemListSchema({
          name: "Atrativos em destaque — o que fazer em Foz",
          description: "Pontos turísticos mais buscados em Foz do Iguaçu.",
          items: listItems.map((a) => ({
            name: a.name,
            url: `/atrativos/${a.slug}`,
          })),
        })}
      />
      <Navbar />
      <main style={{ background: "hsl(40,33%,97%)" }}>
        <OQueFazerContent />
      </main>
      <Footer />
    </>
  );
}
