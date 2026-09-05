// Filepath: components/home/FaqSectionContent.tsx
// Version: 3.2
// Nome da Versão: "Fundo vira AREIA — a seção de transfer deslocou a alternância (§7.5)"
// Baseado na Versão: 3.1 ("fundo branco puro — alternância atual, pedido do usuário").
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
//  1. FUNDO AREIA. A home alterna fundo de forma estrita, e entrar uma seção nova desloca a
//     paridade de tudo que vem abaixo: hero areia → Dores branco → Transfer areia → Autoridade
//     branco → esta AREIA → PilaresFoz branco → CtaFinal areia. (Já foi gradiente branco→Areia,
//     depois Areia puro, depois branco puro — o que não muda é a regra: só há dois fundos, e dois
//     fundos iguais nunca são vizinhos. §7.5.)
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
        background: "hsl(40,33%,97%)",
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
