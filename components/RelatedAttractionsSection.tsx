// Filepath: components/RelatedAttractionsSection.tsx
// Version: 2.1
// Nome da Versão: "Seção de atrativos no padrão — .rf-section + .rf-head, fundo sancionado"
//
// Compartilhada por `/onde-comer`, `/triplice-fronteira` e as páginas de nicho. Mudança aqui
// propaga para as três.
//
// ── O QUE SAIU, E NÃO VOLTA ──────────────────────────────────────────────────────────────────
//  1. A prop `texture`, que pintava a seção com
//     `linear-gradient(180deg, hsl(152,30%,97%) → hsl(214,35%,97%))` — campo de cor inventado, e
//     ainda com DUAS hues (verde → azul). §8.2 admite Areia ou branco, só. No lugar dela entrou
//     `fundo`, que aceita apenas os dois tons sancionados.
//  2. `font-black` no H2 (§3: Fraunces é 600) e cabeçalho com `max-w-2xl` próprio, alinhado à
//     esquerda → `.rf-head` (§8.1).
//  3. O "Arraste para o lado →" colado no subtítulo: narrava a interface e assumia arrasto, que
//     no desktop é scroll ou seta. O carrossel já se anuncia sozinho pelo corte dos cards.

"use client";

import RelatedAttractions from "@/components/RelatedAttractions";
import TituloComDestaque from "@/components/TituloComDestaque";
import { attractions } from "@/app/data/attractions";
import type { Attraction } from "@/app/types";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SHARED_UI } from "@/lib/i18n/shared";

export default function RelatedAttractionsSection({
  source,
  eyebrow,
  title,
  subtitle,
  items = attractions,
  /**
   * Tom de fundo — só os dois sancionados pelo §8.2.
   * ⚠️ Escolher conferindo a seção IMEDIATAMENTE ACIMA na página host: §7.5 proíbe repetir o tom
   * da vizinha. Como este bloco é compartilhado por três páginas, não dá para decidir aqui.
   */
  fundo = "branco",
}: {
  /** Origem interna p/ UTM dos cards (dashboard: de qual página veio o clique). */
  source: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  items?: Attraction[];
  fundo?: "branco" | "areia";
}) {
  const { locale } = useLocale();
  const t = SHARED_UI[locale].relatedAttractions;
  if (!items.length) return null;
  return (
    <section
      className="rf-section"
      style={{
        background: fundo === "areia" ? "hsl(40,33%,97%)" : "hsl(0,0%,100%)",
      }}
    >
      <div className="section-container">
        <div className="rf-head">
          <p className="rf-eyebrow">{eyebrow ?? t.eyebrow}</p>
          <h2 className="rf-title">
            <TituloComDestaque texto={title ?? t.title} destaque={t.titleDestaque} />
          </h2>
          <p className="rf-sub">{subtitle ?? t.subtitle}</p>
        </div>
        <RelatedAttractions items={items} source={source} />
      </div>
    </section>
  );
}
