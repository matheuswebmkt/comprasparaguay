// Filepath: components/niche/NichePitchCard.tsx
// Version: 1.0
// Nome da Versão: "Card de recomendação de nicho (client, i18n pt/en/es)"
//
// Parte VISÍVEL do slot de recomendação (hospedagem/transfer): o card do recomendado
// (hotel/agência/parceiro) e o empty state. O `NicheRecommendation` (server/DB) resolve o
// recomendado e renderiza estes componentes; os dados de negócio (name/businessType/tagline/
// highlights) ganham versão en/es em lib/i18n/entidades.ts (pt = dado).

"use client";

import Image from "next/image";
import { Sparkles, ArrowRight, Search } from "lucide-react";
import type { Niche } from "@/app/data/niches";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SHARED_UI } from "@/lib/i18n/shared";
import { NICHES_CONTENT } from "@/lib/i18n/niches-content";
import { ENTIDADES_I18N } from "@/lib/i18n/entidades";
import CategoryIcon from "@/components/CategoryIcon";
import CountryFlag from "@/components/CountryFlag";
import ImpressionObserver from "@/components/ImpressionObserver";
import ContactDetailTrigger from "@/components/parceiros/ContactDetailTrigger";
import TransferPitchCard from "@/components/niche/TransferPitchCard";

/** Shape unificado do pitch (parceiro local, agência ou hotel) — resolvido no server. */
export type PitchSubject = {
  kind: "partner" | "agency";
  slug: string;
  name: string;
  tagline: string;
  businessType: string;
  city: string;
  neighborhood?: string;
  country: "BR" | "AR" | "PY";
  cover?: string;
  highlights?: string[];
  whatsapp?: string;
  whatsappMessage?: string;
  ctaUrl?: string;
  ctaLabel?: string;
  website?: string;
  accent: string;
  iconName: string;
};

/** Empty state em pt (matriz) — usado quando não há entrada no dicionário. */
const PT_EMPTY = {
  recComingTitle: (noun: string) => `Nossa recomendação de ${noun} está chegando`,
  recComingBody:
    "Nossa equipe está testando os melhores estabelecimentos deste segmento em Foz do Iguaçu. Em breve, revelaremos aqui a nossa Recomendação Oficial exclusiva — escolhida a dedo para o seu roteiro.",
};

export function NicheEmptyState({ niche }: { niche: Niche }) {
  const { locale } = useLocale();
  const c = NICHES_CONTENT[locale][niche.key];
  const eyebrow = c?.recEyebrow ?? niche.recommendationEyebrow ?? "A escolha da nossa equipe";
  const recComingTitle = c?.recComingTitle ?? PT_EMPTY.recComingTitle;
  const recComingBody = c?.recComingBody ?? PT_EMPTY.recComingBody;

  return (
    <section id="recomendacao" className="rf-section section-texture">
      <div className="section-container">
        <div className="rf-head">
          <p className="rf-eyebrow">{eyebrow}</p>
          <h2 className="rf-title">{recComingTitle(niche.nicheNoun)}</h2>
        </div>
        <div
          className="mx-auto max-w-2xl rounded-3xl border-2 border-dashed bg-white/60 px-6 py-10 sm:px-10 sm:py-12"
          style={{ borderColor: "hsl(214,25%,82%)" }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: "hsl(40,80%,93%)", color: "hsl(35,82%,40%)" }}
          >
            <Search className="h-7 w-7" aria-hidden="true" />
          </div>
          <p className="text-center text-base leading-relaxed" style={{ color: "hsl(210,25%,40%)" }}>
            {recComingBody}
          </p>
        </div>
      </div>
    </section>
  );
}

function PitchMedia({ subject, t }: { subject: PitchSubject; t: { badge: string; alt: (n: string, b: string, c: string) => string } }) {
  return (
    <>
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ background: `linear-gradient(150deg, ${subject.accent} 0%, hsl(210,60%,15%) 100%)` }}
        aria-hidden="true"
      >
        <CategoryIcon name={subject.iconName} className="h-14 w-14 text-white/30" />
      </div>
      {subject.cover && (
        <Image
          src={subject.cover}
          alt={t.alt(subject.name, subject.businessType, subject.city)}
          fill
          sizes="(max-width: 1024px) 100vw, 520px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <span
        className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white"
        style={{ background: "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)" }}
      >
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        {t.badge}
      </span>
      <span
        className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white backdrop-blur-sm"
        style={{ background: "rgba(15,42,71,0.55)" }}
      >
        <CountryFlag country={subject.country} className="h-3.5 w-5" />
        {subject.neighborhood ?? subject.city}
      </span>
    </>
  );
}

export default function NichePitchCard({ subject }: { subject: PitchSubject }) {
  const { locale } = useLocale();

  // Niche `transfer` (kind === "agency"): card PRÓPRIO do Compras Paraguay, sem agência.
  // Hospedagem (hotel) e parceiros (partner) seguem aqui, intocados.
  if (subject.kind === "agency") {
    return <TransferPitchCard />;
  }

  const t = SHARED_UI[locale].nichePitch;
  const viewMore = SHARED_UI[locale].partnerCard.viewMore;
  // Dados de negócio de agência: en/es vêm do dicionário; pt cai no dado. Parceiro segue com o
  // dado (copy do próprio parceiro).
  const ent = subject.kind !== "partner" ? ENTIDADES_I18N[locale][subject.slug] : undefined;
  const name = ent?.name ?? subject.name;
  const businessType = ent?.businessType ?? subject.businessType;
  const tagline = ent?.tagline ?? subject.tagline;
  const highlights = ent?.highlights ?? subject.highlights;


  return (
    <section id="recomendacao" className="rf-section" style={{ background: "hsl(0,0%,100%)" }}>
      <div className="section-container">
        <ImpressionObserver slug={subject.slug} ctaType="niche_recommendation" threshold={0.35} />

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="relative overflow-hidden rounded-3xl shadow-tef-lg">
            <ContactDetailTrigger
              kind={subject.kind}
              slug={subject.slug}
              className="relative block aspect-[4/3] lg:aspect-[16/10] w-full overflow-hidden group text-left"
            >
              <PitchMedia subject={{ ...subject, name, businessType }} t={t} />
            </ContactDetailTrigger>
          </div>

          <div>
            <p className="rf-eyebrow mb-4">{businessType}</p>
            <h2 className="rf-title" style={{ marginTop: 0 }}>{name}</h2>
            <p className="rf-sub" style={{ marginTop: "0.75rem" }}>{tagline}</p>

            {highlights && highlights.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2.5">
                {highlights.slice(0, 5).map((h) => (
                  <span
                    key={h}
                    className="inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold"
                    style={{ background: "white", border: "1px solid hsl(214,25%,88%)", color: "hsl(210,56%,23%)" }}
                  >
                    {h}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-8">
              <ContactDetailTrigger
                kind={subject.kind}
                slug={subject.slug}
                className="group inline-flex items-center gap-2 rounded-3xl px-8 py-4 text-lg font-bold text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)",
                }}
              >
                {viewMore}
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
              </ContactDetailTrigger>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-xs" style={{ color: "hsl(210,25%,55%)" }}>
          {t.footer}
        </p>
      </div>
    </section>
  );
}
