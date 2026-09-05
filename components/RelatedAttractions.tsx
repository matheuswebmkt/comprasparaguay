// Filepath: components/RelatedAttractions.tsx
// Version: 2.1
// Nome da Versão: "Setas passam a aparecer também no mobile"
// Baseado na Versão: 2.0
//
// Consumido por `RelatedAttractionsSection` (/onde-comer, /triplice-fronteira, páginas de nicho)
// e direto por `AttractionPageContent`. Mudança aqui propaga para todos.
//
// ── POR QUE AS SETAS ─────────────────────────────────────────────────────────────────────────
// A única pista de que havia mais cards à direita era a barra de scroll — que no macOS só
// aparece durante o gesto e, num trilho que já começa com o último card cortado, o corte era o
// único sinal. As duas páginas compensavam isso com um texto ("Arraste para o lado →") que
// narrava a interface e ainda assumia arrasto, quando no desktop é roda ou seta. O texto saiu
// das duas; o controle real entrou aqui.
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Attraction } from "@/app/types";
import AttractionCard from "@/components/AttractionCard";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SHARED_UI } from "@/lib/i18n/shared";

/** `gap-5` do trilho, em px — entra no cálculo do passo de rolagem. */
const GAP = 20;

export default function RelatedAttractions({
  items,
  source,
}: {
  items: Attraction[];
  /** Origem interna p/ UTM (ex: "relacionado-parque-das-aves"). */
  source: string;
}) {
  const { locale } = useLocale();
  const t = SHARED_UI[locale].relatedAttractions;

  // Render inicial = ordem estável (casa com o SSR → sem hydration mismatch e bom p/ SEO).
  const [list, setList] = useState(items);

  // Após montar, embaralha (Fisher-Yates) — cada acesso vê uma ordem diferente.
  useEffect(() => {
    const a = [...items];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    setList(a);
  }, [items]);

  const trilhoRef = useRef<HTMLDivElement>(null);
  const [podeEsquerda, setPodeEsquerda] = useState(false);
  const [podeDireita, setPodeDireita] = useState(false);

  const medir = useCallback(() => {
    const el = trilhoRef.current;
    if (!el) return;
    /* Folga de 1px nos dois lados. `scrollLeft` volta fracionário com zoom do navegador ou
       DPR > 1, e a comparação exata deixaria a seta da direita acesa no fim do trilho — um
       botão que não faz nada é pior do que botão nenhum. */
    setPodeEsquerda(el.scrollLeft > 1);
    setPodeDireita(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = trilhoRef.current;
    if (!el) return;
    medir();
    el.addEventListener("scroll", medir, { passive: true });
    /* `ResizeObserver` e não `window.resize`: o trilho também muda de largura sem a janela
       mudar (abrir/fechar a barra lateral do navegador, mudança de zoom, fonte maior). */
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", medir);
      ro.disconnect();
    };
    // `list` na dependência: o embaralhamento troca os filhos e refaz a medida.
  }, [medir, list]);

  const rolar = (direcao: 1 | -1) => {
    const el = trilhoRef.current;
    if (!el) return;
    /* Passo = largura real do primeiro card + gap, MEDIDA em vez de cravada: o card muda de
       280px para 300px no `sm`, e um número fixo erraria o encaixe em um dos dois breakpoints.
       O `snap-start` do trilho corrige qualquer sobra. */
    const primeiro = el.firstElementChild as HTMLElement | null;
    const passo = primeiro ? primeiro.offsetWidth + GAP : el.clientWidth * 0.8;
    /* §10.3: quem pediu menos movimento recebe o salto direto, não o deslize. */
    const menosMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direcao * passo, behavior: menosMovimento ? "auto" : "smooth" });
  };

  /* ⓘ As setas aparecem em TODA largura, mobile incluído. No toque a rolagem lateral é natural,
     mas ela não ANUNCIA que há mais card à direita — e o corte do último card é sinal fraco numa
     tela estreita, onde cabe pouco mais de um card por vez.
     ⓘ Cor, borda e hover moram no `.rf-seta` (`globals.css`) — inclusive o porquê da borda.
     ⚠️ `opacity` + `pointer-events-none` em vez de desmontar ou `disabled`: manter o botão no
     DOM é o que permite a transição, e um `disabled` visível seria mobília morta na lateral. */
  const setaBase =
    "rf-seta absolute z-10 flex h-11 w-11 items-center justify-center rounded-full";
  const setaEstilo = {
    /* `-0.5rem` compensa o `pb-4` do trilho: sem isso a seta desce 8px e desalinha do card.
       Geometria em `style` e não em utilidade arbitrária do Tailwind — `top-[calc(...)]` com
       `-translate-y-[...]` já falhou silenciosamente neste projeto (classe no HTML, estilo
       computado inalterado). */
    top: "calc(50% - 0.5rem)",
    transform: "translateY(-50%)",
  } as const;

  /* METADE PARA DENTRO, METADE PARA FORA: o botão tem 44px, então `-22px` põe o centro dele
     exatamente na borda do trilho.
     ⚠️ Isso só é seguro porque o `.section-container` tem 24px de padding lateral no mobile
     (32px de `sm` pra cima) — a saliência de 22px cai dentro da calha, e nada vaza para fora da
     página. **O mobile é o caso apertado: 2px de folga.** Se aquele padding diminuir, ou se a
     seta crescer, este número precisa ser revisto junto, e o primeiro sintoma é scroll
     horizontal na página inteira, não uma seta cortada.
     ⚠️ Todo consumidor entra por `RelatedAttractionsSection`, que sempre renderiza dentro de um
     `.section-container` — é isso que garante a calha. Chamar este componente direto, fora
     daquele container, quebra a premissa.
     ⓘ Nenhum ancestral do carrossel tem `overflow-hidden`; se algum ganhar, a metade de fora
     é decapitada em silêncio. */
  const SALIENCIA = "-1.375rem";

  return (
    <div className="relative">
      <div
        ref={trilhoRef}
        className="flex gap-5 overflow-x-auto pb-4 snap-x"
        style={{ scrollbarWidth: "thin" }}
      >
        {list.map((x) => (
          <div key={x.slug} className="snap-start shrink-0 w-[280px] sm:w-[300px]">
            <AttractionCard attraction={x} source={source} />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => rolar(-1)}
        aria-label={t.prevLabel}
        className={`${setaBase} ${podeEsquerda ? "opacity-100" : "pointer-events-none opacity-0"}`}
        style={{ ...setaEstilo, left: SALIENCIA }}
      >
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={() => rolar(1)}
        aria-label={t.nextLabel}
        className={`${setaBase} ${podeDireita ? "opacity-100" : "pointer-events-none opacity-0"}`}
        style={{ ...setaEstilo, right: SALIENCIA }}
      >
        <ChevronRight className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}
