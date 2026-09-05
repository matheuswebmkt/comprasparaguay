// Filepath: components/niche/NichePageTemplate.tsx
// Version: 2.0
// Nome da Versão: "Casca server — conteúdo visível extraído para NichePageContent (client, i18n)"
// Baseado na Versão: 1.0
//
// Monta a página de nicho a partir de um objeto `Niche` (app/data/niches.ts). O que o visitante
// LÊ vive em `components/niche/NichePageContent.tsx` (client, i18n pt/en/es via
// lib/i18n/niches-content.ts); este arquivo fica com o JSON-LD canônico em pt (SEO), Navbar e
// Footer. O slot de recomendação (`NicheRecommendation`) é server (DB) e entra como `children`
// do componente client, na posição estratégica que ele define.

import JsonLd from "@/components/JsonLd";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import NicheRecommendation from "@/components/niche/NicheRecommendation";
import NichePageContent from "@/components/niche/NichePageContent";
import type { Niche } from "@/app/data/niches";
import {
  breadcrumbSchema,
  faqSchema,
  articleSchema,
  BRAND_OG_IMAGE,
  nichePillar,
} from "@/lib/seo";

export default function NichePageTemplate({ niche }: { niche: Niche }) {
  const url = `/${niche.slug}`;
  const pillar = nichePillar(niche.category);

  return (
    <>
      <JsonLd data={faqSchema(niche.faq ?? [])} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: pillar.name, url: pillar.url },
          { name: niche.breadcrumbLabel, url },
        ])}
      />
      <JsonLd
        data={articleSchema({
          headline: niche.h1,
          description: niche.seoDescription,
          url,
          datePublished: niche.datePublished,
          dateModified: niche.dateModified,
          image: BRAND_OG_IMAGE,
        })}
      />

      <Navbar />
      <NichePageContent niche={niche}>
        {niche.key === "transfer" ? (
          <NicheRecommendation niche={niche} />
        ) : null}
      </NichePageContent>
      <Footer />
    </>
  );
}
