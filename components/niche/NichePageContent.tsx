// Filepath: components/niche/NichePageContent.tsx
// Version: 1.0
// Nome da Versão: "Conteúdo visível das páginas de nicho (client, i18n pt/en/es)"
//
// O JSON-LD, `metadata` e o FAQ canônico em pt ficam no NichePageTemplate (server, SEO canônico);
// este componente renderiza a parte VISÍVEL com o dicionário lib/i18n/niches-content.ts.
// O slot de recomendação (NicheRecommendation) é server (DB) e entra via `children`.

"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Compass, ArrowRight, CheckCircle2,
  Beer, ShieldCheck, Sunset, Flame, Ticket, Snowflake, Sparkles, Users,
  Wheat, Award, Heart, Star, Utensils, UtensilsCrossed, MapPin, Clock, Wine, BedDouble,
  Pizza, Fish, Beef, Sandwich, Map, Plane, Leaf, Waves, Sun, Truck, Salad, Soup, Hotel,
} from "lucide-react";
import type { ReactNode } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { NICHES_CONTENT, type NicheContentI18n, type NicheSectionI18n } from "@/lib/i18n/niches-content";
import { internalUrl } from "@/lib/utm";
import TituloComDestaque from "@/components/TituloComDestaque";
import TransferHero from "@/components/niche/TransferHero";
import TransferAtrativosSection from "@/components/niche/TransferAtrativosSection";
import RoteirosCta from "@/components/RoteirosCta";
import FaqAccordion from "@/components/FaqAccordion";
import type { Niche, NicheSection } from "@/app/data/niches";

// Ícones referenciados por nome (string) nos dados. Fallback seguro se ausente.
const ICONS: Record<string, LucideIcon> = {
  Beer, ShieldCheck, Sunset, Flame, Ticket, Snowflake, Sparkles, Users,
  Wheat, Award, Heart, Star, Utensils, UtensilsCrossed, MapPin, Clock, Wine, BedDouble, Compass,
  Pizza, Fish, Beef, Sandwich, Map, Plane, Leaf, Waves, Sun, Truck, Salad, Soup, Hotel,
};
const iconOf = (name?: string): LucideIcon => (name && ICONS[name]) || CheckCircle2;

/** Chrome pt (matriz) — usado quando o locale é pt e o conteúdo vem do dado. */
const PT_CHROME = {
  faqEyebrow: "Perguntas frequentes",
  faqTitle: (noun: string) => `Dúvidas sobre ${noun} em Foz do Iguaçu`,
  verAtrativosLabel: "Ver atrativos de Foz",
  heroHubLabel: (niche: Niche) =>
    niche.category === "gastronomia"
      ? "Ver guia de onde comer em Foz"
      : "Ver o que fazer em Foz do Iguaçu",
};

function ptFallback(niche: Niche): NicheContentI18n {
  return {
    eyebrow: niche.eyebrow,
    h1: niche.h1,
    h1Destaque: "sem complicação",
    heroLead: niche.heroLead,
    nicheNoun: niche.nicheNoun,
    faqEyebrow: PT_CHROME.faqEyebrow,
    faqTitle: PT_CHROME.faqTitle,
    heroHubLabel: PT_CHROME.heroHubLabel(niche),
    verAtrativosLabel: PT_CHROME.verAtrativosLabel,
    recEyebrow: niche.recommendationEyebrow ?? "A escolha da nossa equipe",
    recComingTitle: (noun: string) => `Nossa recomendação de ${noun} está chegando`,
    recComingBody:
      "Nossa equipe está testando os melhores estabelecimentos deste segmento em Foz do Iguaçu. Em breve, revelaremos aqui a nossa Recomendação Oficial exclusiva — escolhida a dedo para o seu roteiro.",
    sections: (niche.sections ?? []).map((s: NicheSection) => ({
      eyebrow: s.eyebrow,
      heading: s.heading,
      headingDestaque: s.headingDestaque,
      paragraphs: s.paragraphs,
      bullets: s.bullets?.map((b) => ({ icon: b.icon, title: b.title, text: b.text })),
      closing: s.closing,
    })),
    faq: niche.faq ?? [],
  };
}

function ContentSection({ section }: { section: NicheSectionI18n }) {
  return (
    <section className="rf-section">
      <div className="section-container">
        <div className="rf-head">
          {section.eyebrow && <p className="rf-eyebrow">{section.eyebrow}</p>}
          <h2 className="rf-title">
            {section.headingDestaque ? (
              <TituloComDestaque texto={section.heading} destaque={section.headingDestaque} />
            ) : (
              section.heading
            )}
          </h2>
          {section.paragraphs.length > 0 && <p className="rf-sub">{section.paragraphs[0]}</p>}
        </div>

        {section.paragraphs.length > 1 && (
          <div className="mx-auto max-w-3xl space-y-4">
            {section.paragraphs.slice(1).map((p, i) => (
              <p key={i} className="text-base leading-relaxed" style={{ color: "hsl(210,25%,35%)" }}>
                {p}
              </p>
            ))}
          </div>
        )}

        {section.bullets && section.bullets.length > 0 && (
          /* Conteúdo solto, SEM card (mesmo padrão da página de obrigado/onde-comer): divisórias verticais sutis
             entre os itens no lg; sm/mobile respiram pelo gap. */
          <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3 lg:gap-x-0 lg:divide-x lg:divide-[hsl(214,25%,92%)]">
            {section.bullets.map((b) => {
              const BIcon = iconOf(b.icon);
              return (
                <div key={b.title} className="px-5">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: "hsl(40,80%,93%)", color: "hsl(35,82%,40%)" }}
                  >
                    <BIcon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-bold" style={{ color: "hsl(210,60%,15%)" }}>
                    {b.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "hsl(210,25%,45%)" }}>
                    {b.text}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {section.closing && (
          /* Card sutil idêntico ao "Mais de 3 dias" do /o-que-fazer — mas em variação do próprio areia
             (hsl(40,33%,94%) contra o 97% do fundo): o branco ficou forte demais na seção areia, o
             usuário pediu só um destaque sutil. mt-16 restitui o respiro original (24px do py do card +
             40px do mt antigos). */
          <div
            className="mx-auto mt-16 flex max-w-2xl flex-col items-center rounded-2xl border p-6 text-center"
            style={{ borderColor: "hsl(214,25%,90%)", background: "hsl(40,33%,94%)" }}
          >
            <p className="text-sm italic leading-relaxed" style={{ color: "hsl(210,25%,35%)" }}>
              {section.closing}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default function NichePageContent({
  niche,
  children,
}: {
  niche: Niche;
  /** Slot de recomendação (server: NicheRecommendation) — entra na ordem certa da página. */
  children?: ReactNode;
}) {
  const { locale } = useLocale();
  const t = NICHES_CONTENT[locale][niche.key] ?? ptFallback(niche);
  const [firstSection, ...restSections] = t.sections;
  const heroHubHref = "/triplice-fronteira";
  const temRecomendacao = niche.key === "transfer";

  return (
    <main style={{ background: "hsl(40,33%,97%)" }}>
      {/* HERO — hospedagem e transfer têm hero dedicado (data-driven, Areia puro + grão);
          demais nichos seguem o hero editorial claro (genérico) localizado. */}
      {niche.key === "transfer" ? (
        <TransferHero niche={niche} />
      ) : (
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
            <div className="mx-auto max-w-2xl text-center">
              <p className="rf-eyebrow">{t.eyebrow}</p>
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
                <TituloComDestaque texto={t.h1} destaque={t.h1Destaque} />
              </h1>
              <div className="mt-6 space-y-4">
                {t.heroLead.map((p) => (
                  <p key={p} className="text-[1.0625rem] leading-relaxed" style={{ color: "hsl(210,25%,38%)" }}>
                    {p}
                  </p>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3">
                <Link
                  href={internalUrl(heroHubHref, "niche")}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all hover:gap-2.5 duration-200"
                  style={{ color: "hsl(210,56%,23%)" }}
                >
                  {t.heroHubLabel}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href={internalUrl("/roteiros-de-compras", "niche")}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all hover:gap-2.5 duration-200"
                  style={{ color: "hsl(152,47%,32%)" }}
                >
                  {t.verAtrativosLabel}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Seção exclusiva do /transfer — atrativos mais pedidos no transfer (logo abaixo do hero). */}
      {niche.key === "transfer" && <TransferAtrativosSection />}

      {/* 1ª seção + slot de recomendação — ordem estratégica (hosp/transfer: recomendação antes). */}
      {temRecomendacao ? (
        <>
          {children}
          {firstSection && <ContentSection section={firstSection} />}
        </>
      ) : (
        <>
          {firstSection && <ContentSection section={firstSection} />}
          {children}
        </>
      )}

      {/* Demais seções */}
      {restSections.map((section) => (
        <ContentSection key={section.heading} section={section} />
      ))}

      {/* FAQ — padrão único §8.1. */}
      <section
        className="rf-section"
        style={{
          background:
            "linear-gradient(180deg, hsl(0,0%,100%) 0%, hsl(40,33%,98%) 100%)",
        }}
      >
        <div className="section-container">
          <div className="rf-head">
            <p className="rf-eyebrow">{t.faqEyebrow}</p>
            <h2 className="rf-title">{t.faqTitle(t.nicheNoun)}</h2>
          </div>
          <FaqAccordion items={t.faq} className="mx-auto max-w-3xl" />
        </div>
      </section>

      <RoteirosCta ctaType={`niche_${niche.key}`} />
    </main>
  );
}
