// Filepath: app/atrativos/[slug]/page.tsx
// Version: 4.1
// Nome da Versão: "FAQ sem bloco de ingresso — a leitura da config de oferta saiu da página"

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import ViewContentOnLoad from "@/components/analytics/ViewContentOnLoad";
import { VERTICALS } from "@/lib/tracking-taxonomy";
import AttractionPageContent from "@/components/atrativos/AttractionPageContent";
import { attractions, getAttractionBySlug } from "@/app/data/attractions";
import {
  attractionSchema,
  breadcrumbSchema,
  faqSchema,
  articleSchema,
  attractionSeoTitle,
  attractionSeoDescription,
  attractionKeywords,
  attractionDefaultFaq,
  pageMetadata,
} from "@/lib/seo";

export const revalidate = 60;

// Fallback para atrativo que ainda não tem data própria no catálogo. A data REAL de cada um vive
// em `publishedAt`/`updatedAt` no dado (`app/types/index.ts`) — antes, estas duas constantes eram
// a única fonte, e os 29 atrativos declaravam ao Google a mesma data de publicação e de
// modificação, que nunca mudava por mais que o conteúdo mudasse.
const PUBLISHED_FALLBACK_ISO = "2026-07-11";

type Params = { slug: string };

export function generateStaticParams() {
  return attractions.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = getAttractionBySlug(slug);
  if (!a) return { title: "Atrativo não encontrado | Compras Paraguay" };

  return pageMetadata({
    title: attractionSeoTitle(a),
    description: attractionSeoDescription(a),
    path: `/atrativos/${a.slug}`,
    keywords: attractionKeywords(a),
    silo: "atrativos",
    image: a.cover,
    imageAlt: `${a.name} — Foz do Iguaçu | Compras Paraguay`,
    type: "article",
  });
}

export default async function AttractionPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const a = getAttractionBySlug(slug);
  if (!a) notFound();

  const related = attractions.filter((x) => x.slug !== a.slug);

  // FAQ = editorial puro. O bloco de compra por atrativo saiu com a venda de ingresso (a página já
  // não precisa da config de oferta para nada: o CTA do conteúdo é o modal de reserva, que resolve o
  // comportamento sozinho).
  const faq = attractionDefaultFaq(a);

  return (
    <>
      <JsonLd data={attractionSchema(a)} />
      <JsonLd data={faqSchema(faq)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Roteiros de compras", url: "/roteiros-de-compras" },
          { name: a.name, url: `/atrativos/${a.slug}` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          headline: `${a.name}: ingresso e visita em Foz do Iguaçu`,
          description: attractionSeoDescription(a),
          url: `/atrativos/${a.slug}`,
          datePublished: a.publishedAt ?? PUBLISHED_FALLBACK_ISO,
          dateModified: a.updatedAt ?? a.publishedAt ?? PUBLISHED_FALLBACK_ISO,
          image: a.cover,
        })}
      />
      {/* Página de UM item → `ViewContent` (matriz §1.5). O hub `/atrativos` NÃO leva isto: lista é
          `view_item_list`, e inflar o evento com pageview de listagem estragaria o retargeting. */}
      <ViewContentOnLoad vertical={VERTICALS.atrativos} item_slug={a.slug} />
      <AttractionPageContent
        attraction={a}
        related={related}
        faq={faq}
      />
    </>
  );
}
