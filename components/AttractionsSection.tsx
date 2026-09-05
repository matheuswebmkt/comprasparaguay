// Filepath: components/AttractionsSection.tsx
// Version: 2.0
// Nome da Versão: "Só a grade — o cabeçalho virou a hero de /atrativos"
//
// Grid de atrativos (`app/data/attractions.ts`). Consumidor único: o hub `/atrativos`.
// (As demais páginas usam `RelatedAttractionsSection`, que é outro componente.)
//
// ⚠️ ESTE COMPONENTE NÃO TEM MAIS CABEÇALHO. Ele tinha eyebrow + H2 + subtítulo próprios, e a
// página ainda trazia uma hero ACIMA com outro eyebrow, outro H1 e dois parágrafos — dois
// cabeçalhos empilhados dizendo a mesma coisa. O de baixo era o bom, então subiu para a hero
// (`components/atrativos/AtrativosFozContent.tsx`) e o de cima foi deletado.
// Não reintroduzir cabeçalho aqui: a seção é a GRADE, e quem a apresenta é a hero.
//
// ⚠️ Saiu também a prop `texture` (`.section-texture` = Azul Gelo com padrão de pontos). §8.2
// admite só Areia ou branco em fundo de seção; campo de cor próprio é proibido.

"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AttractionCard from "@/components/AttractionCard";
import { attractions } from "@/app/data/attractions";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SHARED_UI } from "@/lib/i18n/shared";

export default function AttractionsSection({
  source,
  /** Âncora da seção — alvo de CTA de rolagem na hero da página host. */
  id,
  /** Se definido, renderiza um link "ver tudo" abaixo do grid (ex: p/ a página-índice de atrativos). */
  viewAllHref,
  viewAllLabel,
}: {
  /** Origem da UTM interna nos cards (dashboard: de qual página veio o clique). */
  source: string;
  id?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}) {
  const { locale } = useLocale();
  const t = SHARED_UI[locale].attractionsSection;
  return (
    /* ⓘ `scroll-mt-24` compensa a navbar fixa (64px) quando a seção é alvo de âncora. */
    <section
      id={id}
      className="rf-section scroll-mt-24"
      style={{ background: "hsl(0,0%,100%)" }}
    >
      <div className="section-container">
        {/* ── 4 COLUNAS A PARTIR DE `xl` ─────────────────────────────────────────
            A quarta coluna entra em `xl` (1280px) e NÃO em `lg`. Em `lg` o container tem 976px
            úteis: dividido por 4, com `gap-6`, dá célula de ~226px — 20% mais estreita que os
            280px que o card foi desenhado para ocupar no carrossel, e é onde a tagline e o botão
            de ingresso começam a se espremer. Em `xl` o container já está no teto de 1280px
            (1232 úteis) e a célula fica em ~290px, dentro da faixa projetada.
            ⓘ `AttractionsSection` tem UM consumidor (`/atrativos`), então isto não vaza para
            outras telas — mas o `AttractionCard` é compartilhado, e por isso o `sizes` vai por
            prop em vez de mudar no card. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {attractions.map((a) => (
            <AttractionCard
              key={a.slug}
              attraction={a}
              source={source}
              /* Acima de 1280 o container está travado em 1280px, então a célula PARA de crescer:
                 são ~290px fixos, e `vw` passaria a pedir cada vez mais à toa (a 1920px, `33vw`
                 pediria 634px para uma caixa de 290). O último degrau é um valor absoluto. */
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 300px"
            />
          ))}
        </div>

        {viewAllHref && (
          <div className="mt-10 text-center">
            <Link
              href={viewAllHref}
              className="inline-flex items-center gap-1.5 text-sm font-bold transition-all hover:gap-2.5 duration-200"
              style={{ color: "hsl(210,56%,23%)" }}
            >
              {viewAllLabel ?? t.viewAllLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
