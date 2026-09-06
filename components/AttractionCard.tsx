// Filepath: components/AttractionCard.tsx
// Version: 1.4
// Nome da Versão: "CTA sempre 'Reservar data' + calendário — a leitura de `hasLink` (config por atrativo) saiu"
// Baseado na Versão: 1.1

"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { Attraction } from "@/app/types";
import { internalUrl } from "@/lib/utm";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SHARED_UI } from "@/lib/i18n/shared";
import { ATTRACTIONS_I18N, ATTRACTION_NAMES, CARD_LABELS, attractionSubjectI18n } from "@/lib/i18n/attractions";
import { ATTRACTION_DETAIL_UI } from "@/lib/i18n/attraction-detail";
import TicketOfferButton from "@/components/ticket-offer/TicketOfferButton";
import CountryFlagBadge from "@/components/CountryFlagBadge";

/**
 * `sizes` da capa para uma grade de ATÉ 3 colunas — o caso da maioria dos consumidores.
 *
 * ⚠️ Isto é a largura que o `object-cover` EXIGE, não a da caixa (§8-ter). Quem usar o card numa
 * grade com outro número de colunas PRECISA passar o seu: pedir menos do que a célula ocupa faz
 * o navegador ampliar, e ampliação lê como "mole".
 */
const SIZES_ATE_3_COLUNAS = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

export default function AttractionCard({
  attraction,
  source,
  sizes = SIZES_ATE_3_COLUNAS,
}: {
  attraction: Attraction;
  /** Origem interna p/ UTM oculta (ex: "foz-alem", "relacionado"). */
  source?: string;
  /** Ver `SIZES_ATE_3_COLUNAS`. Só passar quando a grade hospedeira não for de até 3 colunas. */
  sizes?: string;
}) {
  const { locale } = useLocale();
  const t = SHARED_UI[locale].attractionCard;
  const td = ATTRACTION_DETAIL_UI[locale];
  // Label do card: camada própria CARD_LABELS (nome curto, por locale) → fallback ATTRACTION_NAMES
  // (nome oficial da página/H1/SEO — o CARD_LABELS nunca derruba essas superfícies).
  const nome = CARD_LABELS[locale][attraction.slug] ?? ATTRACTION_NAMES[locale][attraction.slug] ?? attraction.name;
  const tagline = ATTRACTIONS_I18N[locale][attraction.slug]?.tagline ?? attraction.tagline;
  const href = source
    ? internalUrl(`/roteiros-de-compras/${attraction.slug}`, source)
    : `/roteiros-de-compras/${attraction.slug}`;
  // CTA fixo: nenhum atrativo do catálogo vende ingresso — todos reservam data. A ramificação que
  // existia aqui lia `hasLink` no admin e trocava "Comprar ingresso"/Ticket por "Reservar data"/calendário;
  // o modo por atrativo foi extinto, sobrou a versão reserva.
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border bg-[hsl(40,33%,98.5%)] overflow-hidden shadow-tef-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-tef-lg"
      style={{ borderColor: "hsl(214,25%,90%)" }}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: "linear-gradient(150deg, hsl(152,47%,32%) 0%, hsl(210,60%,15%) 100%)" }}
          aria-hidden="true"
        >
          <MapPin className="h-10 w-10 text-white/25" />
        </div>
        <Image
          src={attraction.cover}
          alt={`${nome} — Foz do Iguaçu`}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Badge do país — destaque visual e identificação (bandeira SVG + nome por idioma). */}
        <CountryFlagBadge country={attraction.country} />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold leading-snug" style={{ color: "hsl(210,60%,15%)" }}>
          {nome}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed line-clamp-2" style={{ color: "hsl(210,25%,45%)" }}>
          {tagline}
        </p>
        <div className="mt-4 space-y-2">
          {/* Comprar ingresso — gold gradient, same size as Adicionar ao meu roteiro */}
          <TicketOfferButton
            href={`/roteiros-de-compras/${attraction.slug}`}
            ctaType="atrativo_ingresso"
            itemSlug={attraction.slug}
            campaign="atrativos-ingresso"
            context="atrativo"
            subjectTitle={nome}
            subjectImage={attraction.cover}
            subjectSubtitle={tagline}
            /* ⚠️ As TRÊS versões: o modal tem seletor de idioma próprio e o `detail` é um snapshot do
               clique — sem isto, trocar o idioma lá dentro não retraduzia o card do assunto. Quem
               carrega o dicionário (~230 KB) é esta página, nunca o modal. */
            subjectI18n={attractionSubjectI18n(attraction.slug, attraction, { cardLabel: true })}
            className="inline-flex w-full items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white transition-all hover:scale-[1.03] active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)",
            }}
          >
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            {td.ctaReserva}
          </TicketOfferButton>

          {/* Saber mais — centered below */}
          <div className="text-center">
            <span
              className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-2.5 duration-200"
              style={{ color: "hsl(210,56%,23%)" }}
            >
              {t.learnMore}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
