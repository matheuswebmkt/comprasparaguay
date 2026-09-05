// Filepath: components/o-que-fazer/OQueFazerContent.tsx
// Version: 1.0
// Nome da Versão: "Conteúdo visível de /o-que-fazer (client, i18n pt/en/es)"
//
// O JSON-LD, `metadata` e o FAQ canônico em pt ficam no page.tsx (SEO canônico); este
// componente renderiza a parte VISÍVEL com o dicionário lib/i18n/o-que-fazer.ts.

"use client";

import Link from "next/link";
import { Flame, Wine, UtensilsCrossed } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { O_QUE_FAZER_UI } from "@/lib/i18n/o-que-fazer";
import { SHARED_UI } from "@/lib/i18n/shared";
import { internalUrl } from "@/lib/utm";
import FaqAccordion from "@/components/FaqAccordion";
import TituloComDestaque from "@/components/TituloComDestaque";
import AtrativosDestaqueSection from "@/components/atrativos/AtrativosDestaqueSection";

// Ícones da gastronomia da fronteira — os três países na mesa (o texto vem do dicionário).
const GASTRO_ICONS = [Flame, Wine, UtensilsCrossed];

export default function OQueFazerContent() {
  const { locale } = useLocale();
  const t = O_QUE_FAZER_UI[locale];
  const cta = SHARED_UI[locale].roteirosCta;

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden pt-16"
        style={{ background: "hsl(40,33%,97%)" }}
      >
        <div
          className="rf-grain pointer-events-none absolute inset-0 opacity-[0.055]"
          style={{ mixBlendMode: "multiply" }}
          aria-hidden="true"
        />
        <div className="section-container relative z-10 py-20 sm:py-24">
          <div className="rf-head">
            <p className="rf-eyebrow">{t.hero.eyebrow}</p>
            <h1
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
              <TituloComDestaque texto={t.hero.h1} destaque={t.hero.h1Destaque} />
            </h1>
            <p className="rf-sub">{t.hero.subtitle}</p>

            <div className="mt-9">
              <a
                href="#quanto-tempo"
                className="group inline-flex items-center gap-2 rounded-3xl px-8 py-4 text-lg font-bold text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)",
                }}
              >
                {t.hero.cta}
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

      {/* ── QUANTO TEMPO VOCÊ TEM? ─────────────────────────────────────────── */}
      <section
        id="quanto-tempo"
        className="rf-section scroll-mt-24"
        style={{ background: "hsl(0,0%,100%)" }}
      >
        <div className="section-container">
          <div className="rf-head">
            <p className="rf-eyebrow">{t.quantoTempo.eyebrow}</p>
            <h2 className="rf-title">{t.quantoTempo.title}</h2>
            <p className="rf-sub">{t.quantoTempo.subtitle}</p>
          </div>

          {/* Conteúdo solto, SEM card (mesmo padrão da seção dos países): divisórias verticais sutis entre
              os dias no sm+, mobile empilha com respiro. Só os cards de 1-3 dias — o "Mais de 3 dias"
              abaixo mantém o card (decisão do usuário). */}
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-y-12 sm:grid-cols-3 sm:gap-x-0 sm:divide-x sm:divide-[hsl(214,25%,92%)]">
            {t.quantoTempo.dayOptions.map((text, i) => {
              const dias = i + 1;
              return (
                <Link
                  key={dias}
                  href={internalUrl("/atrativos", "oque-fazer-seo")}
                  className="group flex flex-col px-5"
                >
                  <p
                    className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: "hsl(152,47%,32%)" }}
                  >
                    {t.quantoTempo.dayLabel(dias)}
                  </p>
                  <p
                    className="mt-2 flex-1 text-sm leading-relaxed"
                    style={{ color: "hsl(210,25%,35%)" }}
                  >
                    {text}
                  </p>
                  <span
                    className="mt-4 inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold underline decoration-1 underline-offset-4"
                    style={{
                      color: "hsl(152,47%,30%)",
                      textDecorationColor: "hsla(152,40%,60%,0.5)",
                    }}
                  >
                    {t.quantoTempo.dayCta(dias)}
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>

          {/* mt-12 (não mt-6): o py-6 do card removido dos dias era o respiro vertical — sem ele, o mt-6
              original deixaria o card "Mais de 3 dias" colado no grid. mt-12 restitui os 48px de antes. */}
          <div
            className="mx-auto mt-12 flex max-w-2xl flex-col items-center rounded-2xl border p-6 text-center"
            style={{ borderColor: "hsl(214,25%,90%)", background: "hsl(40,33%,97%)" }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "hsl(152,47%,32%)" }}
            >
              {t.quantoTempo.maisDiasLabel}
            </p>
            <p
              className="mt-2 text-sm leading-relaxed"
              style={{ color: "hsl(210,25%,35%)" }}
            >
              {t.quantoTempo.maisDiasText}
            </p>
            <div className="mt-4">
              <Link
                href={internalUrl("/atrativos/compras-paraguai-ciudad-del-este", "oque-fazer-seo")}
                className="inline-flex items-center justify-center rounded-3xl px-8 py-4 text-lg font-bold text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)",
                }}
              >
                {cta.ctaPrincipal}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── ATRATIVOS EM DESTAQUE ───────────────────────────────────────────── */}
      <AtrativosDestaqueSection source="oque-fazer-seo" fundo="areia" />

      {/* ── ONDE COMER EM FOZ ──────────────────────────────────────────────── */}
      <section className="rf-section" style={{ background: "hsl(0,0%,100%)" }}>
        <div className="section-container">
          <div className="rf-head">
            <p className="rf-eyebrow">{t.gastro.eyebrow}</p>
            <h2 className="rf-title">{t.gastro.title}</h2>
            <p className="rf-sub">{t.gastro.subtitle}</p>
          </div>

          {/* Conteúdo solto, SEM card (mesmo padrão da página de obrigado — ObrigadoCards): divisórias
              verticais sutis entre os três países no sm+, no mobile empilham com respiro (gap-y-12). */}
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-y-12 sm:grid-cols-3 sm:gap-x-0 sm:divide-x sm:divide-[hsl(214,25%,92%)]">
            {t.gastro.cards.map((g, i) => {
              const Icon = GASTRO_ICONS[i] ?? Flame;
              return (
                <div key={g.title} className="px-5">
                  <div
                    className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ background: "hsl(152,40%,93%)", color: "hsl(152,47%,32%)" }}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-bold" style={{ color: "hsl(210,60%,15%)" }}>
                    {g.title}
                  </h3>
                  <p
                    className="mt-1.5 text-sm leading-relaxed"
                    style={{ color: "hsl(210,25%,45%)" }}
                  >
                    {g.text}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link
              href={internalUrl("/atrativos", "oque-fazer-seo")}
              className="group inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold underline decoration-1 underline-offset-4"
              style={{
                color: "hsl(152,47%,30%)",
                textDecorationColor: "hsla(152,40%,60%,0.5)",
              }}
            >
              {t.gastro.cta}
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

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section className="rf-section" style={{ background: "hsl(40,33%,97%)" }}>
        <div className="section-container">
          <div className="rf-head">
            <p className="rf-eyebrow">{t.faq.eyebrow}</p>
            <h2 className="rf-title">{t.faq.title}</h2>
          </div>

          <FaqAccordion items={t.faq.items} className="mx-auto max-w-3xl" />
        </div>
      </section>

      {/* ── FECHAMENTO ──────────────────────────────────────────────────────── */}
      <section
        className="rf-section relative overflow-hidden"
        style={{ background: "hsl(0,0%,100%)" }}
      >
        <div
          className="rf-grain pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-multiply"
          aria-hidden
        />

        <div className="section-container relative z-10">
          <div className="rf-head">
            <h2 className="rf-title" style={{ marginTop: 0 }}>
              {t.closing.title}
            </h2>
            <p className="rf-sub">{t.closing.subtitle}</p>
          </div>

          <div className="text-center">
            <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
              <Link
                href={internalUrl("/atrativos/compras-paraguai-ciudad-del-este", "oque-fazer-seo")}
                className="inline-flex items-center justify-center rounded-3xl px-8 py-4 text-lg font-bold text-white transition-transform hover:scale-[1.03] active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)",
                }}
              >
                {cta.ctaPrincipal}
              </Link>

              <Link
                href={internalUrl("/atrativos", "oque-fazer-seo-prontos")}
                className="group inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold underline decoration-1 underline-offset-4"
                style={{
                  color: "hsl(152,47%,30%)",
                  textDecorationColor: "hsla(152,40%,60%,0.5)",
                }}
              >
                {cta.ctaProntos}
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
            </div>

            <p className="mt-5 text-sm" style={{ color: "hsl(210,25%,45%)" }}>
              {cta.footnote}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
