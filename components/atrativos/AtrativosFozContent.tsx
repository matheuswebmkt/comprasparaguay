// Filepath: components/atrativos/AtrativosFozContent.tsx
// Version: 1.1
// Nome da Versão: "Parte VISÍVEL do hub /atrativos (client, i18n)"
"use client";

import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import AttractionsSection from "@/components/AttractionsSection";
import RoteirosCta from "@/components/RoteirosCta";
import TituloComDestaque from "@/components/TituloComDestaque";
import { useLocale } from "@/components/i18n/LocaleProvider";
import FaqAccordion from "@/components/FaqAccordion";
import { ATRATIVOS_FOZ_UI } from "@/lib/i18n/atrativos-foz";

export default function AtrativosFozContent() {
  const { locale } = useLocale();
  const t = ATRATIVOS_FOZ_UI[locale];

  return (
    <>
      <Navbar />
      <main style={{ background: "hsl(40,33%,97%)" }}>
        {/* ── HERO ───────────────────────────────────────────────────────────────
            ⚠️ A COPY DAQUI VEM DE `t.grid`, e isso é proposital. A página tinha DOIS
            cabeçalhos empilhados: esta hero (eyebrow + H1 + dois parágrafos + quatro chips) e,
            logo abaixo, o cabeçalho da própria grade — dizendo a mesma coisa com outras
            palavras. O de baixo era o bom: mais direto e sem prometer o que a página não faz.
            Ele subiu para cá; a hero antiga foi deletada, e a grade ficou só com os cards.

            ⚠️ NÃO REINTRODUZIR o que saiu junto:
              · o blob verde de 460px com `blur-[110px]` no canto — §8-bis nomeia "orbe/blob
                decorativo" como o que a seção NÃO pode ter;
              · o gradiente azul-névoa→areia e a borda inferior (§2/§8.2: Areia ou branco, sem
                campo de cor próprio; e cor diferente já delimita, sem precisar de filete);
              · os quatro chips de nomes de atrativo — mesma "pill soup" que já saiu da hero de
                `/roteiros`, e aqui ainda era redundante com a grade logo abaixo;
              · `font-black` (§3: Fraunces é 600) e `pt-28 sm:pt-32` (§7.6: a navbar tem 64px).

            Altura compacta, não `min-h-[100svh]`: a grade de atrativos é o conteúdo da página e
            precisa aparecer logo abaixo. Ver `conventions/design.md` §7.6. */}
        <section className="relative overflow-hidden pt-16" style={{ background: "hsl(40,33%,97%)" }}>
          <div
            className="rf-grain pointer-events-none absolute inset-0 opacity-[0.055]"
            style={{ mixBlendMode: "multiply" }}
            aria-hidden="true"
          />
          <div className="section-container relative z-10 pt-14 pb-10 sm:pt-16 sm:pb-12">
            <div className="rf-head">
              <p className="rf-eyebrow">{t.grid.eyebrow}</p>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  /* Escala única de hero (design-system.md §3) — os mesmos cinco valores da
                     home, de `/roteiros` e de `/roteiros/[slug]`. Ao mexer num, mexer em todos. */
                  fontWeight: 600,
                  fontSize: "clamp(2.7rem, 5.1vw, 4.9rem)",
                  lineHeight: 0.98,
                  letterSpacing: "-0.034em",
                  color: "hsl(210,60%,15%)",
                  textWrap: "balance",
                }}
              >
                <TituloComDestaque texto={t.grid.title} destaque={t.grid.titleDestaque} />
              </h1>
              <p className="rf-sub">{t.grid.subtitle}</p>

              {/* CTA de rolagem para a grade — mesmo padrão do "Roteiros prontos de 1, 2 e 3 dias" no hero
                  de `/roteiros`. Âncora interna (`<a href="#">`), não `<Link>`: navegação na
                  mesma página não passa pelo router. */}
              <div className="mt-9">
                <a
                  href="#atrativos"
                  className="group inline-flex items-center gap-2 rounded-3xl px-8 py-4 text-lg font-bold text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)",
                  }}
                >
                  {t.grid.cta}
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

        {/* Grade de atrativos — sem cabeçalho próprio: quem apresenta é a hero acima. */}
        <AttractionsSection source="atrativos-index" id="atrativos" />

        {/* ── FAQ ────────────────────────────────────────────────────────────────
            Mesmo padrão das FAQs da home, de `/roteiros` e de `/roteiros/[slug]`:
            `.rf-section` + `.rf-head` centralizado + lista em `max-w-3xl` (a largura de
            leitura de FAQ do §4.3).

            ⚠️ O H2 usava `font-black` — §3 proíbe peso 900 na Fraunces. A `.rf-title` já
            entrega os 600; não devolver `fontSize`/`fontWeight`/`color` inline por cima dela
            (§8.1: inline vence classe).

            ⓘ Fundo AREIA chapado, e não o gradiente branco→Areia das outras FAQs. Aquele
            gradiente existe onde a FAQ vem DEPOIS de uma seção Areia; aqui a grade de
            atrativos acima é branca, então começar branco repetiria o tom da vizinha (§7.5). */}
        <section className="rf-section" style={{ background: "hsl(40,33%,97%)" }}>
          <div className="section-container">
            <div className="rf-head">
              <p className="rf-eyebrow">{t.faq.eyebrow}</p>
              <h2 className="rf-title">{t.faq.title}</h2>
            </div>
            <FaqAccordion items={t.faq.items} className="mx-auto max-w-3xl" />
          </div>
        </section>

        {/* Curadoria de parceiros REMOVIDA desta página por decisão do usuário — os parceiros
            visíveis hoje são de gastronomia e não pertencem ao catálogo de atrativos. */}

        {/* ⚠️ Saiu daqui a seção "Onde comer, beber e se hospedar em Foz" (`NicheClusterLinks`) —
            a grade de cards de bar, cervejaria, hospedagem etc. Decisão do usuário: é legado, e
            a página de atrativo individual já tinha perdido essa mesma seção antes, pelo mesmo
            motivo. Não reintroduzir em `/atrativos`.
            ⓘ O COMPONENTE continua existindo, mas o último consumidor é `NichePageTemplate`.
            `/triplice-fronteira` também o perdeu depois — quando ela sair, o componente sai junto. */}

        {/* Fecho — ancoragem no ativo principal */}
        <RoteirosCta ctaType="atrativos_index_roteiros" />
      </main>
      <Footer />
    </>
  );
}
