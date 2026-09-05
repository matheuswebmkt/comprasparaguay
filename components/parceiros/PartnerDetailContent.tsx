// Filepath: components/parceiros/PartnerDetailContent.tsx
// Version: 1.0
// Nome da Versão: "Conteúdo do detalhe do parceiro (ex-/[slug], migrado de PartnerPageContent.tsx) — renderizado DENTRO do PartnerDetailModal, sem Navbar/Footer/breadcrumb de página"
//
// Mesmo conteúdo que existia na página própria (/[slug], removida): banner, sobre, galeria, features/
// highlights, horários, sidebar de contato, prêmios, cardápio, eventos, fechamento, CTA de roteiros. A
// diferença é só o CONTAINER — antes página com Navbar/Footer/breadcrumb, agora miolo de um modal
// full-screen (chrome de abrir/fechar fica no PartnerDetailModal). Breadcrumb removido (não faz sentido
// dentro de um modal — não é "onde você está" na navegação).

"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, Compass, MapPin, Clock, Globe, Instagram, Facebook, MessageCircle,
  Phone, ExternalLink, ShoppingBag, CheckCircle2, ShieldCheck, Award,
} from "lucide-react";
import RoteirosCta from "@/components/RoteirosCta";
import CategoryIcon from "@/components/CategoryIcon";
import TrackedLink from "@/components/TrackedLink";
import { asNiche, verticalOfPartnerCategory } from "@/lib/tracking-taxonomy";
import { Partner, PartnerCategoryMeta } from "@/app/types";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { PARTNER_DETAIL_UI } from "@/lib/i18n/partner-detail";
import { localizedPartner } from "@/lib/i18n/partners";

export default function PartnerDetailContent({
  partner: rawPartner,
  meta,
  igUrl,
  hasPrimaryCta,
}: {
  partner: Partner;
  meta: PartnerCategoryMeta;
  igUrl: string | null;
  hasPrimaryCta: boolean;
}) {
  const { locale } = useLocale();
  const t = PARTNER_DETAIL_UI[locale];
  const partner = localizedPartner(rawPartner, locale);
  // wa.me montado no client (não no server) p/ a mensagem pré-pronta acompanhar o idioma do visitante.
  const waMsg = partner.whatsappMessage ?? `Olá! Vim pelo site da Compras Paraguay e tenho interesse na ${partner.name}.`;
  const waUrl = rawPartner.whatsapp ? `https://wa.me/${rawPartner.whatsapp}?text=${encodeURIComponent(waMsg)}` : null;
  /**
   * Taxonomia do pixel para todo CTA deste parceiro. Sai do DADO, não de string literal (G8):
   * a categoria vira `vertical` e a 1ª key de `niches` vira `niche` — as duas pelas pontes que
   * omitem o que o portfólio não conhece (D8), nunca deixando vazar valor órfão.
   * ⚠️ `partnerSlug` = `itemSlug` aqui de propósito: o produto É o negócio. O `TrackedLink` sabe
   * disso e manda só `partner_slug` ao pixel, sem duplicar em `item_slug` (matriz §1.4).
   */
  const partnerTax = {
    vertical: verticalOfPartnerCategory(rawPartner.category),
    niche: asNiche(rawPartner.niches?.[0]),
    partnerSlug: rawPartner.slug,
  };

  return (
    <div style={{ background: "hsl(40,33%,97%)" }}>
      {/* Banner de capa */}
      <section className="relative h-[42vh] min-h-[300px] overflow-hidden">
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: `linear-gradient(150deg, ${meta.accent} 0%, hsl(210,60%,12%) 100%)` }}
          aria-hidden="true"
        >
          <CategoryIcon name={meta.iconName} className="h-20 w-20 text-white/15" />
        </div>
        <Image
          src={partner.cover}
          alt={`${partner.name} — ${meta.name} em ${partner.city}`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(10,28,48,0.92) 0%, rgba(15,42,71,0.45) 55%, rgba(15,42,71,0.30) 100%)" }}
          aria-hidden="true"
        />

        <div className="section-container relative z-10 h-full flex flex-col justify-end pb-8 pt-16">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white w-fit mb-3"
            style={{ background: "rgba(15,42,71,0.55)", backdropFilter: "blur(4px)" }}
          >
            <CategoryIcon name={meta.iconName} className="h-3.5 w-3.5" />
            {partner.businessType ?? meta.name}
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>
            {partner.name}
          </h1>
          <p className="mt-2 max-w-2xl text-base sm:text-lg text-white/80 leading-relaxed">
            {partner.tagline}
          </p>
        </div>
      </section>

      {/* Conteúdo */}
      <div className="section-container py-14 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          <div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: "hsl(210,60%,15%)", fontFamily: "var(--font-display)" }}>
              {t.about}
            </h2>
            <div className="space-y-4">
              {partner.description.map((p, i) => (
                <p key={i} className="text-base leading-relaxed" style={{ color: "hsl(210,25%,35%)" }}>{p}</p>
              ))}
            </div>

            {partner.gallery && partner.gallery.length > 0 && (
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {partner.gallery.map((src, i) => (
                  <div key={src} className={`relative overflow-hidden rounded-2xl aspect-square ${i === 0 ? "col-span-2 sm:col-span-1" : ""}`}>
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ background: "linear-gradient(150deg, hsl(35,82%,47%) 0%, hsl(210,60%,15%) 100%)" }}
                      aria-hidden="true"
                    >
                      <CategoryIcon name={meta.iconName} className="h-10 w-10 text-white/20" />
                    </div>
                    <Image
                      src={src}
                      alt={`${partner.name} — ${meta.name} em ${partner.city} (${i + 1})`}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {partner.features && partner.features.length > 0 ? (
              <div className="mt-10">
                <h3 className="text-lg font-bold mb-5" style={{ color: "hsl(210,60%,15%)" }}>
                  {t.whyPrefix} {partner.name.split(" ").slice(-1)[0]}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {partner.features.map((f) => (
                    <div key={f.title} className="rounded-2xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-tef-sm" style={{ borderColor: "hsl(214,25%,90%)", background: "white" }}>
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3.5" style={{ background: "hsl(40,80%,94%)", color: "hsl(35,82%,42%)" }}>
                        <CategoryIcon name={f.iconName} className="h-5 w-5" />
                      </div>
                      <h4 className="text-sm font-black" style={{ color: "hsl(210,60%,15%)" }}>{f.title}</h4>
                      <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "hsl(210,25%,42%)" }}>{f.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              partner.highlights && partner.highlights.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-lg font-bold mb-4" style={{ color: "hsl(210,60%,15%)" }}>{t.highlights}</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {partner.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: "hsl(152,47%,32%)" }} aria-hidden="true" />
                        <span className="text-sm" style={{ color: "hsl(210,25%,35%)" }}>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}

            {partner.hours && partner.hours.length > 0 && (
              <div className="mt-10">
                <h3 className="text-lg font-bold mb-4" style={{ color: "hsl(210,60%,15%)" }}>{t.hours}</h3>
                <ul className="space-y-2">
                  {partner.hours.map((h) => (
                    <li key={h} className="flex items-center gap-2.5 text-sm" style={{ color: "hsl(210,25%,35%)" }}>
                      <Clock className="h-4 w-4" style={{ color: "hsl(210,56%,23%)" }} aria-hidden="true" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar de contato / CTA */}
          <aside className="h-fit">
            <div className="rounded-3xl border bg-white p-6 shadow-tef-md" style={{ borderColor: "hsl(214,25%,90%)" }}>
              {partner.logo && (
                <div className="mb-5 pb-5 border-b" style={{ borderColor: "hsl(214,25%,90%)" }}>
                  <div className="relative h-14 mx-auto" style={{ maxWidth: "200px" }}>
                    <Image src={partner.logo} alt={`Logo ${partner.name}`} fill sizes="200px" className="object-contain" />
                  </div>
                </div>
              )}

              {(partner.address || partner.neighborhood) && (
                <div className="flex items-start gap-2 mb-5">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: "hsl(210,56%,23%)" }} aria-hidden="true" />
                  <span className="text-sm" style={{ color: "hsl(210,25%,45%)" }}>
                    {[partner.address, partner.neighborhood, `${partner.city}/${partner.state}`].filter(Boolean).join(" · ")}
                  </span>
                </div>
              )}

              <div className="flex flex-col gap-3">
                {hasPrimaryCta && (
                  <TrackedLink
                    href={partner.ctaUrl}
                    ctaType="partner_cta"
                    itemSlug={partner.slug}
                    campaign="parceiros"
                    {...partnerTax}
                    exit
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm text-white transition-all hover:scale-[1.03] active:scale-[0.98]"
                    style={{ background: "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)" }}
                  >
                    {partner.ctaLabel ?? t.ctaDefault}
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </TrackedLink>
                )}

                {waUrl && (
                  <TrackedLink
                    href={waUrl}
                    ctaType="whatsapp"
                    itemSlug={partner.slug}
                    campaign="parceiros"
                    {...partnerTax}
                    exit
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white transition-all hover:scale-[1.02]"
                    style={{ background: "linear-gradient(135deg, hsl(152,47%,32%) 0%, hsl(152,50%,28%) 100%)"}}
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    {t.whatsapp}
                  </TrackedLink>
                )}

                {partner.ifood && (
                  <TrackedLink
                    href={partner.ifood}
                    ctaType="ifood"
                    itemSlug={partner.slug}
                    campaign="parceiros"
                    {...partnerTax}
                    exit
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm border transition-all hover:scale-[1.02]"
                    style={{ color: "hsl(210,56%,23%)", borderColor: "hsl(214,25%,85%)", background: "white" }}
                  >
                    <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                    {t.ifood}
                  </TrackedLink>
                )}

                {partner.website && (
                  <TrackedLink
                    href={partner.website}
                    ctaType="website"
                    itemSlug={partner.slug}
                    campaign="parceiros"
                    {...partnerTax}
                    exit
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm border transition-all hover:scale-[1.02]"
                    style={{ color: "hsl(210,56%,23%)", borderColor: "hsl(214,25%,85%)", background: "white" }}
                  >
                    <Globe className="h-4 w-4" aria-hidden="true" />
                    {t.website}
                  </TrackedLink>
                )}

                {/* Sociais e mapa levam a taxonomia, mas NÃO `exit`: rede social e rota são
                    navegação informativa, não ponto de contato. Marcar como `Contact` inflaria o
                    evento e esvaziaria o público de "foi falar com o parceiro" — que é o que tem
                    valor comercial. */}
                <div className="flex gap-3">
                  {igUrl && (
                    <TrackedLink
                      href={igUrl}
                      ctaType="instagram"
                      itemSlug={partner.slug}
                      campaign="parceiros"
                      {...partnerTax}
                      ariaLabel={`Instagram de ${partner.name}`}
                      className="inline-flex flex-1 items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border transition-all hover:scale-[1.02]"
                      style={{ color: "hsl(210,56%,23%)", borderColor: "hsl(214,25%,85%)", background: "white" }}
                    >
                      <Instagram className="h-4 w-4" aria-hidden="true" />
                      {t.instagram}
                    </TrackedLink>
                  )}
                  {partner.facebook && (
                    <TrackedLink
                      href={partner.facebook}
                      ctaType="facebook"
                      itemSlug={partner.slug}
                      campaign="parceiros"
                      {...partnerTax}
                      ariaLabel={`Facebook de ${partner.name}`}
                      className="inline-flex flex-1 items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border transition-all hover:scale-[1.02]"
                      style={{ color: "hsl(210,56%,23%)", borderColor: "hsl(214,25%,85%)", background: "white" }}
                    >
                      <Facebook className="h-4 w-4" aria-hidden="true" />
                      {t.facebook}
                    </TrackedLink>
                  )}
                  {partner.phone && (
                    <a
                      href={`tel:${partner.phone}`}
                      aria-label={`Telefone de ${partner.name}`}
                      className="inline-flex flex-1 items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border transition-all hover:scale-[1.02]"
                      style={{ color: "hsl(210,56%,23%)", borderColor: "hsl(214,25%,85%)", background: "white" }}
                    >
                      <Phone className="h-4 w-4" aria-hidden="true" />
                      {t.call}
                    </a>
                  )}
                </div>

                {partner.mapUrl && (
                  <TrackedLink
                    href={partner.mapUrl}
                    ctaType="map"
                    itemSlug={partner.slug}
                    campaign="parceiros"
                    {...partnerTax}
                    className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold transition-all hover:gap-2.5 duration-200 mt-1"
                    style={{ color: "hsl(210,56%,23%)" }}
                  >
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    {t.viewOnMap}
                  </TrackedLink>
                )}
              </div>
            </div>
          </aside>
        </div>

        {/* Premiações / autoridade */}
        {partner.awards && (
          <section className="mt-16 pt-12 border-t" style={{ borderColor: "hsl(214,25%,88%)" }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="relative aspect-[5/4] rounded-3xl overflow-hidden shadow-tef-md">
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ background: "linear-gradient(150deg, hsl(35,82%,47%) 0%, hsl(210,60%,15%) 100%)" }}
                  aria-hidden="true"
                >
                  <Award className="h-14 w-14 text-white/25" />
                </div>
                <Image
                  src={partner.awards.image}
                  alt={`Premiações da ${partner.name} — chope especial em ${partner.city}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              <div>
                <div className="inline-flex items-center gap-2 mb-3">
                  <Award className="h-4 w-4" style={{ color: "hsl(35,82%,47%)" }} aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: "hsl(35,82%,40%)" }}>{t.recognition}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: "hsl(210,60%,15%)", fontFamily: "var(--font-display)" }}>
                  {partner.awards.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed" style={{ color: "hsl(210,25%,38%)" }}>{partner.awards.text}</p>
                {partner.awards.points && partner.awards.points.length > 0 && (
                  <ul className="mt-6 space-y-3">
                    {partner.awards.points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: "hsl(35,82%,47%)" }} aria-hidden="true" />
                        <span className="text-sm sm:text-base font-semibold" style={{ color: "hsl(210,30%,25%)" }}>{p}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Cardápio */}
        {partner.menu && partner.menu.length > 0 && (
          <section className="mt-16 pt-12 border-t" style={{ borderColor: "hsl(214,25%,88%)" }}>
            <div className="flex items-center gap-2.5 mb-2">
              <span style={{ color: "hsl(35,82%,47%)" }}><CategoryIcon name={meta.iconName} className="h-5 w-5" /></span>
              <span className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: "hsl(35,82%,40%)" }}>{t.menuEyebrow}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2" style={{ color: "hsl(210,60%,15%)", fontFamily: "var(--font-display)" }}>
              {t.menuTitle}
            </h2>
            <p className="text-base leading-relaxed mb-8 max-w-xl" style={{ color: "hsl(210,25%,40%)" }}>
              {t.menuBodyBefore}{partner.name}{t.menuBodyMiddle}<strong>{t.menuBodyStrong}</strong>{t.menuBodyAfter}
            </p>

            <div className="space-y-10">
              {partner.menu.map((group) => (
                <div key={group.groupLabel}>
                  <h3 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: "hsl(210,56%,28%)" }}>{group.groupLabel}</h3>
                  <div className={`grid gap-4 sm:gap-5 ${group.items.every((it) => !it.name && !it.desc) ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2"} ${group.cols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
                    {group.items.map((item, i) => {
                      const hasText = Boolean(item.name || item.desc);
                      return (
                        <div
                          key={item.image ?? `${group.groupLabel}-${i}`}
                          className="group relative rounded-2xl border bg-white overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-tef-lg"
                          style={{ borderColor: "hsl(214,25%,90%)" }}
                        >
                          <div className="relative aspect-[4/3] overflow-hidden">
                            <div
                              className="absolute inset-0 flex items-center justify-center"
                              style={{ background: "linear-gradient(150deg, hsl(35,82%,47%) 0%, hsl(210,60%,15%) 100%)" }}
                              aria-hidden="true"
                            >
                              <CategoryIcon name={meta.iconName} className="h-10 w-10 text-white/25" />
                            </div>
                            {item.image && (
                              <Image
                                src={item.image}
                                alt={item.name ? `${item.name} — ${partner.name}` : `${partner.name} — ${meta.name} em ${partner.city}`}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            )}
                            {item.badge && (
                              <span className="absolute top-3 left-3 inline-flex px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm" style={{ background: "rgba(15,42,71,0.55)" }}>
                                {item.badge}
                              </span>
                            )}
                          </div>
                          {hasText && (
                            <div className="p-5 flex-1">
                              {item.name && <h4 className="text-base font-black leading-snug" style={{ color: "hsl(210,60%,15%)" }}>{item.name}</h4>}
                              {item.desc && <p className="mt-2 text-sm leading-relaxed" style={{ color: "hsl(210,25%,42%)" }}>{item.desc}</p>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {group.note && (
                    <p className="mt-4 text-sm italic" style={{ color: "hsl(210,25%,50%)" }}>{group.note}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
              {hasPrimaryCta && (
                <TrackedLink
                  href={partner.ctaUrl}
                  ctaType="partner_cta"
                  itemSlug={partner.slug}
                  campaign="parceiros"
                  {...partnerTax}
                  exit
                  className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm text-white transition-all hover:scale-[1.03] active:scale-[0.98]"
                  style={{ background: "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)" }}
                >
                  {partner.ctaLabel ?? t.menuCtaDefault}
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </TrackedLink>
              )}
              {waUrl && (
                <TrackedLink
                  href={waUrl}
                  ctaType="whatsapp"
                  itemSlug={partner.slug}
                  campaign="parceiros"
                  {...partnerTax}
                  exit
                  className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm text-white transition-all hover:scale-[1.03] active:scale-[0.98]"
                  style={{ background: "linear-gradient(135deg, hsl(152,47%,32%) 0%, hsl(152,50%,28%) 100%)"}}
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  {t.whatsapp}
                </TrackedLink>
              )}
            </div>
          </section>
        )}

        {/* Eventos */}
        {partner.serviceHighlight && (
          <section className="mt-16 pt-12 border-t" style={{ borderColor: "hsl(214,25%,88%)" }}>
            <div
              className={`relative rounded-3xl overflow-hidden grid grid-cols-1 ${partner.serviceHighlight.image ? "lg:grid-cols-2" : ""}`}
              style={{ background: "linear-gradient(150deg, hsl(210,56%,18%) 0%, hsl(210,60%,11%) 100%)" }}
            >
              {partner.serviceHighlight.image && (
                <div className={`relative ${partner.serviceHighlight.imageSquare ? "aspect-square" : "aspect-[16/10]"} lg:aspect-auto lg:h-full lg:order-2`}>
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: "linear-gradient(150deg, hsl(210,56%,20%) 0%, hsl(210,60%,11%) 100%)" }}
                    aria-hidden="true"
                  >
                    <CategoryIcon name={meta.iconName} className="h-12 w-12 text-white/20" />
                  </div>
                  <Image
                    src={partner.serviceHighlight.image}
                    alt={`${partner.name} — ${partner.serviceHighlight.title}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className={`${partner.serviceHighlight.imageSquare ? "object-contain" : "object-cover"} lg:object-cover`}
                  />
                </div>
              )}

              <div className="relative z-10 p-8 sm:p-10 lg:order-1">
                <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full opacity-20 blur-[80px] pointer-events-none" style={{ background: "hsl(38,90%,55%)" }} aria-hidden="true" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide mb-4" style={{ background: "rgba(255,255,255,0.10)", color: "hsl(38,90%,70%)" }}>
                    <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    {t.eventsBadge}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                    {partner.serviceHighlight.title}
                  </h2>
                  <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/75">
                    {partner.serviceHighlight.text}
                  </p>
                  {partner.serviceHighlight.items && partner.serviceHighlight.items.length > 0 && (
                    <ul className="mt-6 flex flex-wrap gap-2.5">
                      {partner.serviceHighlight.items.map((it) => (
                        <li key={it} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white" style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.16)" }}>
                          <CheckCircle2 className="h-3.5 w-3.5" style={{ color: "hsl(38,90%,62%)" }} aria-hidden="true" />
                          {it}
                        </li>
                      ))}
                    </ul>
                  )}
                  {((partner.serviceHighlight.ctaWhatsapp && waUrl) || hasPrimaryCta) && (
                    <TrackedLink
                      href={partner.serviceHighlight.ctaWhatsapp && waUrl ? waUrl : partner.ctaUrl}
                      ctaType={partner.serviceHighlight.ctaWhatsapp && waUrl ? "whatsapp" : "partner_cta"}
                      itemSlug={partner.slug}
                      campaign="parceiros"
                      {...partnerTax}
                      exit
                      className="mt-7 inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm text-white transition-all hover:scale-[1.03] active:scale-[0.98]"
                      style={{ background: "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)" }}
                    >
                      {partner.serviceHighlight.ctaLabel ?? partner.ctaLabel ?? t.eventsCtaDefault}
                      {partner.serviceHighlight.ctaWhatsapp && waUrl ? (
                        <MessageCircle className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      )}
                    </TrackedLink>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Fechamento */}
        {partner.closing && (
          <section className="mt-16 pt-12 border-t text-center" style={{ borderColor: "hsl(214,25%,88%)" }}>
            {partner.logo && (
              <div className="relative h-16 sm:h-20 mx-auto mb-6" style={{ maxWidth: "280px" }}>
                <Image src={partner.logo} alt={`Logo ${partner.name}`} fill sizes="240px" className="object-contain" />
              </div>
            )}
            <p className="max-w-2xl mx-auto text-lg sm:text-2xl font-bold leading-snug" style={{ color: "hsl(210,60%,15%)", fontFamily: "var(--font-display)" }}>
              {partner.closing.text}
            </p>
            <div className="mt-8 relative overflow-hidden rounded-3xl aspect-[16/9] sm:aspect-[16/6]">
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: "linear-gradient(150deg, hsl(35,82%,47%) 0%, hsl(210,60%,15%) 100%)" }}
                aria-hidden="true"
              >
                <CategoryIcon name={meta.iconName} className="h-14 w-14 text-white/20" />
              </div>
              <Image
                src={partner.closing.image}
                alt={`${partner.name} — ${meta.name} em ${partner.city}`}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </section>
        )}

        {/* Volta o visitante pro fluxo central de recomendações */}
        <section className="mt-16 pt-12 border-t" style={{ borderColor: "hsl(214,25%,88%)" }}>
          <div className="rounded-3xl border p-8 sm:p-10 text-center" style={{ borderColor: "hsl(214,25%,88%)", background: "white" }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: "hsl(152,45%,94%)", color: "hsl(152,47%,32%)" }}>
              <Compass className="h-7 w-7" aria-hidden="true" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: "hsl(210,60%,15%)", fontFamily: "var(--font-display)" }}>
              {t.backTitle}
            </h2>
            <p className="mt-3 max-w-lg mx-auto text-base leading-relaxed" style={{ color: "hsl(210,25%,40%)" }}>
              {t.backBody}
            </p>
            <Link
              href="/atrativos"
              className="mt-7 inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm text-white transition-all hover:scale-[1.03] active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, hsl(152,47%,32%) 0%, hsl(152,50%,28%) 100%)"}}
            >
              {t.backCta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>

      <RoteirosCta ctaType="partner_ticket" />
    </div>
  );
}
