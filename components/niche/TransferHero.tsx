// Filepath: components/niche/TransferHero.tsx
// Version: 1.0
// Nome da Versão: "Hero data-driven do nicho de transfer — Areia puro, copy protagonista"
//
// Hero dedicado do nicho de transfer (rendered by NichePageTemplate quando niche.key ===
// "transfer"). O copy vem 100% do `Niche` (app/data/niches.ts); a única string local é o
// rótulo do CTA, que é âncora interna (#recomendacao) para o slot de recomendação.
//
// Espelha o padrão aprovado do HospedagemHero:
//   1. FUNDO AREIA PURO + GRÃO (rf-grain). Substitui o gradiente+orbe do hero genérico do
//      template, que violava §8.2 (fundo de seção só Areia ou branco).
//   2. ALTURA PADRÃO DE HERO (conventions/design.md §7.6): `min-h-[100svh]` + `justify-center`
//      + `pt-16` (64px = navbar). Nada de padding calibrado à mão.
//   3. COLUNA ÚNICA CENTRALIZADA (max-w-2xl mx-auto text-center), ecoando o slot de
//      recomendação logo abaixo — o H1 anuncia a recomendação e o CTA leva até ela.
//   4. H1 NA ESCALA ÚNICA (design-system.md §3): clamp(2.7rem, 5.1vw, 4.9rem), peso 600
//      (nunca font-black), lh 0.98, ls -0.034em. Igual em TODA página de destino.
//   5. UM ÚNICO OBJETO DOURADO: o CTA (gradiente único §2). Eyebrow é Verde Selva
//      (escassez do dourado é o que faz ler premium).

"use client";

import type { Niche } from "@/app/data/niches";
import TituloComDestaque from "@/components/TituloComDestaque";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { NICHES_CONTENT } from "@/lib/i18n/niches-content";

export default function TransferHero({ niche }: { niche: Niche }) {
  const { locale } = useLocale();
  // pt cai no dado (matriz); en/es vêm do dicionário.
  const t = NICHES_CONTENT[locale][niche.key] ?? {
    eyebrow: niche.eyebrow,
    h1: niche.h1,
    h1Destaque: "sem complicação",
    heroLead: niche.heroLead,
    heroCta: niche.heroCta,
  };
  return (
    <section
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-16"
      style={{ background: "hsl(40,33%,97%)" }}
    >
      {/* Grão: dá textura ao Areia sem introduzir cor — impede o claro de ler como chapado. */}
      <div
        className="rf-grain pointer-events-none absolute inset-0 opacity-[0.055]"
        style={{ mixBlendMode: "multiply" }}
        aria-hidden="true"
      />

      <div className="section-container relative z-10 py-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="rf-eyebrow rf-rise rf-d1">{t.eyebrow}</p>

          <h1
            className="rf-rise rf-d2"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "clamp(2.7rem, 5.1vw, 4.9rem)",
              lineHeight: 0.98,
              letterSpacing: "-0.034em",
              color: "hsl(210,60%,15%)",
              textWrap: "balance",
            }}
          >
            <TituloComDestaque texto={t.h1} destaque={t.h1Destaque} />
          </h1>

          {t.heroLead.map((p, i) => (
            <p
              key={i}
              className="rf-rise rf-d3 mx-auto mt-6 max-w-[44ch] text-[1.0625rem] leading-relaxed"
              style={{ color: "hsl(210,25%,38%)" }}
            >
              {p}
            </p>
          ))}

          {/* CTA único, dourado (gradiente §2), âncora interna para o slot de recomendação.
              §21.6: CTA descreve o resultado — "Ver transfer" é o que a página entrega. */}
          <div className="rf-rise rf-d4 mt-8">
            <a
              href="#recomendacao"
              className="group inline-flex items-center gap-2 rounded-3xl px-8 py-4 text-lg font-bold text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
              style={{
                background:
                  "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)",
              }}
            >
              {t.heroCta}
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-y-0.5"
              >
                ↓
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
