// Filepath: components/home/PilaresFoz.tsx
// Version: 2.2
// Nome da Versão: "Clique só no texto (Link inline-block) e grade de 4 trilhos para 4 pilares"
// Baseado na Versão: 2.0 ("faixa de pilares com presença tipográfica (R3)").
//
// Substitui `ExploreFoz` (grade de 4 cards com gradiente + orbe), que era o padrão "catálogo" que o
// posicionamento evita (§21.1) e estourava o teto de seções da home.
//
// FAIXA UTILITÁRIA, não seção (§8-bis): existe para preservar o linking interno da home para os
// pilares — exigência do checklist de SEO (`conventions/seo.md` §19) — sem gastar uma das 5 seções.
// Por isso: sem CTA, sem card, sem imagem. O que ela PODE ter é presença tipográfica; a v1.0 era uma
// fileira de links minúsculos e parecia rodapé perdido no meio da página.
//
// Os itens são links tipográficos com filete superior — deliberadamente NÃO são cards com fundo e
// borda, o que os devolveria ao padrão catálogo.
//
// ⚠️ Rotas na forma CURTA, conferidas em `app/`: /roteiros-de-compras, /transfer, /triplice-fronteira.
// NÃO usar as formas longas antigas (`/o-que-fazer-em-foz-do-iguacu` etc.) — dão 404.

"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { HOME_UI } from "@/lib/i18n/home";
import { internalUrl } from "@/lib/utm";

export default function PilaresFoz() {
  const { locale } = useLocale();
  const t = HOME_UI[locale].pilares;
  const PILARES = t.items;
  return (
    <div className="rf-section" style={{ background: "hsl(40,33%,97%)" }}>
      <div className="section-container">
        {/* Eyebrow no padrão único, mas alinhado à ESQUERDA: esta é faixa utilitária de linking
            interno (§8-bis), não seção de conteúdo — por isso não usa `rf-head` (que centraliza).
            A cor era cinza `hsl(210,25%,55%)`, destoando do Verde Selva das outras seções. */}
        <span className="rf-eyebrow">{t.eyebrow}</span>

        {/* `lg:grid-cols-4` porque SÃO 4 pilares. A grade era de 5 trilhos (sobrou do pilar que
            saiu da faixa): com 4 itens, o quinto trilho ficava vazio e cada coluna ficava ~20% mais
            estreita que o necessário — o texto curto de um item abria um vão visível antes do
            próximo. Entrar um pilar novo = voltar para 5; item a menos = voltar para 3. */}
        <nav className="mt-8 grid gap-px sm:grid-cols-2 lg:grid-cols-4">
          {PILARES.map((p) => (
            <div
              key={p.href}
              className="pt-5 lg:pr-6"
              style={{ borderTop: "1px solid hsl(214,25%,88%)" }}
            >
              {/* ⚠️ O INVÓLUCRO leva a régua e o respiro; o LINK é `inline-block` e passa a medir o
                  próprio texto. Com `block` na âncora, a célula inteira — régua, o vão à direita do
                  hint, tudo — virava área de clique, e o ponteiro mentia sobre o que era link. */}
              <Link href={internalUrl(p.href, "home-pilares")} className="group inline-block">
                <span
                  className="block text-lg font-bold leading-snug transition-colors group-hover:text-[hsl(152,47%,32%)]"
                  style={{
                    color: "hsl(210,60%,15%)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {p.label}
                </span>
                <span
                  className="mt-1.5 block text-sm"
                  style={{ color: "hsl(210,25%,55%)" }}
                >
                  {p.hint}
                </span>
              </Link>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
