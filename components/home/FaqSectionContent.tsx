// Filepath: components/home/FaqSectionContent.tsx
// Version: 3.1
// Nome da Versão: "Fundo branco puro — alternância atual (pedido do usuário)"
//
// Parte VISÍVEL do FAQ da home (client, i18n). O JSON-LD em pt fica no `FaqSection` (server).
//
// ── O QUE MUDOU (passe de design) ─────────────────────────────────────────────────────────────
// A v1.0 empilhava 8 caixas brancas com borda e sombra. Oito retângulos iguais viram ruído: a
// pessoa vê uma parede, não uma lista de respostas. Trocado por filetes finos entre os itens —
// mesma informação, sem moldura. É o mesmo princípio de subtração de §8-bis.
// Tipografia: título em escala fluida; pergunta subiu para peso display e ganhou respiro.
//
// ── O QUE A v3.0 CORRIGIU ─────────────────────────────────────────────────────────────────────
//  1. FUNDO BRANCO PURO. Alternância atual da home: hero areia → Dores branco → Autoridade areia
//     → RoteirosHome branco → Atrativos areia → esta BRANCO → PilaresFoz areia → CtaFinal branco.
//     (Já foi gradiente branco→Areia e depois Areia puro; o usuário pediu branco para fechar a
//     alternância com o PilaresFoz, que é areia.)
//  2. Eyebrow deixou de ser dourado: `hsl(35,82%,40%)` sobre branco = 4.01:1 em 12px, REPROVA AA.
//     §2 — dourado é fundo de botão ou acento gráfico, nunca cor de texto.
//  3. H2 com peso 600, não `font-black`. §3: serifa display usa 600–700, NUNCA 900.

"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { HOME_UI } from "@/lib/i18n/home";
import FaqAccordion from "@/components/FaqAccordion";

export default function FaqSectionContent() {
  const { locale } = useLocale();
  const t = HOME_UI[locale].faq;

  return (
    <section
      className="rf-section"
      style={{
        background: "hsl(0,0%,100%)",
      }}
    >
      <div className="section-container">
        {/* ⚠️ Cabeçalho no padrão único (globals.css). Esta seção era a mais destoante: o H2 ia até
            48px contra 36px das demais, com line-height e letter-spacing próprios. Não devolver
            `fontSize`/`lineHeight`/`letterSpacing` inline — inline vence a classe. */}
        <div className="rf-head">
          <p className="rf-eyebrow">{t.eyebrow}</p>
          <h2 className="rf-title">{t.title}</h2>
        </div>

        <FaqAccordion items={t.items} className="mx-auto max-w-3xl" />
      </div>
    </section>
  );
}
