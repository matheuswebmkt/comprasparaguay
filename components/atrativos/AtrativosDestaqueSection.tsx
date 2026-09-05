// Filepath: components/atrativos/AtrativosDestaqueSection.tsx
// Version: 1.1
// Nome da Versão: "Quarteto em destaque: entram By Night Argentina e Compras no Paraguai"
//
// Extraída do /o-que-fazer (estava inline na página). Quarteto de atrativos curados + convite para
// o guia completo (/atrativos). Padrão §8.1: `.rf-head` centralizado + grade de `AttractionCard`.
//
// ⚠️ FUNDO por prop (`fundo`): Areia ou branco — só os dois tons do §8.2. A página HOST decide
//    o tom conferindo a vizinha (§7.5):
//    · /o-que-fazer: a seção acima ("Quanto tempo você tem em Foz?") é branca → fundo="areia"
//    · home: a seção acima (RoteirosHomeSection) é Areia → fundo="branco"

"use client";

import Link from "next/link";
import AttractionCard from "@/components/AttractionCard";
import TituloComDestaque from "@/components/TituloComDestaque";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SHARED_UI } from "@/lib/i18n/shared";
import { attractions } from "@/app/data/attractions";
import type { Attraction } from "@/app/types";
import { internalUrl } from "@/lib/utm";

// Destaques — ordem curada, não derivada do dado.
// ⚠️ Só os QUATRO primeiros aparecem na tela (`slice(0, 4)` abaixo). O resto é fila de reserva
//    da curadoria: está no arquivo, não renderiza. Trocar o quarteto = reordenar ESTA lista.
// ⚠️ A lista vale para as TRÊS páginas que montam a seção (home, /o-que-fazer, hub /roteiros).
//    Não existe quarteto "da home" — mexer aqui muda as três de uma vez.
const DESTAQUE_SLUGS = [
  "compras-paraguai-ciudad-del-este",
  "by-night-argentina-puerto-iguazu",
  "duty-free-shop-puerto-iguazu-argentina",
  "cataratas-jl-shopping",
  "shopping-catuai-palladium",
];

export default function AtrativosDestaqueSection({
  source,
  fundo = "areia",
}: {
  /** Origem interna p/ UTM dos cards e do convite (dashboard: de qual página veio o clique). */
  source: string;
  /** Tom de fundo — só os dois sancionados pelo §8.2. Escolher conferindo a vizinha (§7.5). */
  fundo?: "areia" | "branco";
}) {
  const { locale } = useLocale();
  const t = SHARED_UI[locale].atrativosDestaque;
  const listItems: Attraction[] = DESTAQUE_SLUGS.slice(0, 4)
    .map((slug) => attractions.find((a) => a.slug === slug))
    .filter((a): a is Attraction => Boolean(a));

  if (listItems.length === 0) return null;

  return (
    <section
      id="atrativos-em-destaque"
      className="rf-section scroll-mt-24"
      style={{ background: fundo === "areia" ? "hsl(40,33%,97%)" : "hsl(0,0%,100%)" }}
    >
      <div className="section-container">
        <div className="rf-head">
          <p className="rf-eyebrow">{t.eyebrow}</p>
          <h2 className="rf-title">
            <TituloComDestaque texto={t.title} destaque={t.titleDestaque} />
          </h2>
          <p className="rf-sub">{t.subtitle}</p>
        </div>

        {/* Quarteto na mesma linha a partir de xl; 2×2 entre sm e xl. */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {listItems.map((a) => (
            <AttractionCard
              key={a.slug}
              attraction={a}
              source={source}
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 300px"
            />
          ))}
        </div>

        {/* Convite para o guia completo — link Verde Selva (ação secundária, §2);
            os botões dourados ficam só nos cards de atrativo. */}
        <div className="mt-10 text-center">
          <p className="text-base leading-relaxed" style={{ color: "hsl(210,25%,45%)" }}>
            {t.inviteText}
          </p>
          <Link
            href={internalUrl("/atrativos", source)}
            className="group mt-3 inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold underline decoration-1 underline-offset-4"
            style={{
              color: "hsl(152,47%,30%)",
              textDecorationColor: "hsla(152,40%,60%,0.5)",
            }}
          >
            {t.cta}
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
