// Filepath: components/niche/TransferAtrativosSection.tsx
// Version: 2.0
// Nome da Versão: "Seção do /transfer usa o AttractionCard compartilhado (4 atrativos)"
//
// Mostra, logo abaixo do hero, os 4 atrativos que mais se pedem no transfer em Foz.
// Todos são `Attraction` reais (com página própria) e usam o `AttractionCard` compartilhado —
// capa, bandeira, CTA de ingresso/reserva e "Adicionar ao roteiro". A ordem vem de
// `TRANSFER_ATRATIVOS_SLUGS` (lib/i18n/niches-content.ts).
//
// §8.2: fundo AREIA (sem background próprio — flui do hero, também areia). O slot de recomendação
// (branco) e a seção "Como escolher" (areia) seguem a alternância.

"use client";

import AttractionCard from "@/components/AttractionCard";
import { attractions } from "@/app/data/attractions";
import type { Attraction } from "@/app/types";
import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  TRANSFER_ATRATIVOS,
  TRANSFER_ATRATIVOS_SLUGS,
} from "@/lib/i18n/niches-content";

export default function TransferAtrativosSection() {
  const { locale } = useLocale();
  const t = TRANSFER_ATRATIVOS[locale];
  const items = TRANSFER_ATRATIVOS_SLUGS.map((slug) =>
    attractions.find((a) => a.slug === slug),
  ).filter((a): a is Attraction => Boolean(a));

  return (
    <section className="rf-section">
      <div className="section-container">
        <div className="rf-head">
          <p className="rf-eyebrow">{t.eyebrow}</p>
          <h2 className="rf-title">{t.title}</h2>
          <p className="rf-sub">{t.subtitle}</p>
        </div>

        {/* 4 colunas a partir de `xl` — mesmo `sizes` da AttractionsSection (§8-ter).
            Abaixo de 1280 cai para 3 (lg) → 2 (sm) → 1. */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((a) => (
            <AttractionCard
              key={a.slug}
              attraction={a}
              source="transfer-atrativos"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 300px"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
