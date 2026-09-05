// Filepath: components/parceiros/ContactSidebar.tsx
// Version: 1.1
// Nome da Versão: "Instagram/Ligar/E-mail em azul médio fixo — `accent` fica só com o pin do endereço"
//
// Bloco de contato que existia dentro do modal de detalhe (logo, endereço, WhatsApp, site,
// Instagram, telefone, e-mail). Extraído para uso isolado: o mini modal de contato
// (ContactDetailModal) exibe APENAS este sidebar, sem o restante do modal gigante.

"use client";

import Image from "next/image";
import { MapPin, Globe, Instagram, MessageCircle, Phone, Mail, ExternalLink } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SHARED_UI } from "@/lib/i18n/shared";
import TrackedLink from "@/components/TrackedLink";
import type { Niche, Vertical } from "@/lib/tracking-taxonomy";

export interface ContactSidebarProps {
  name: string;
  slug: string;
  logo?: string;
  /** Endereço já montado em linha única (ex: "Av. X · Centro · Foz do Iguaçu/PR"). */
  address?: string;
  whatsapp?: string;
  whatsappMessage?: string;
  website?: string;
  instagram?: string;
  phone?: string;
  email?: string;
  /**
   * Acento de CATEGORIA da entidade (gastronomia dourado · hotelaria azul · turismo verde,
   * `partnerCategories` em app/data/partners.ts). ⚠️ Governa APENAS o pin do endereço. Os botões
   * contornados (Instagram/Ligar/E-mail) NÃO o usam: ver o comentário na linha deles.
   */
  accent: string;
  campaign: string;
  /**
   * Taxonomia do pixel — vem de FORA porque este bloco é genérico: o mesmo componente serve
   * parceiro (gastronomia), hotel (hotelaria) e agência (transporte). Quem sabe qual é o vertical é
   * quem resolve o perfil, não o sidebar. Ausente → params simplesmente omitidos (D8).
   * `slug` já é o `partner_slug`: nos três casos o produto É o negócio.
   */
  vertical?: Vertical;
  niche?: Niche;
}

export default function ContactSidebar({
  name,
  slug,
  logo,
  address,
  whatsapp,
  whatsappMessage,
  website,
  instagram,
  phone,
  email,
  accent,
  campaign,
  vertical,
  niche,
}: ContactSidebarProps) {
  /** WhatsApp e site são ponto de contato (`exit`); Instagram é navegação, só `CTAClick`. */
  const tax = { vertical, niche, partnerSlug: slug };
  const { locale } = useLocale();
  const t = SHARED_UI[locale].contactSidebar;
  const waMsg = whatsappMessage ?? t.waFallback(name);
  const waUrl = whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(waMsg)}` : null;
  const igUrl = instagram
    ? instagram.startsWith("http") ? instagram : `https://instagram.com/${instagram.replace(/^@/, "")}`
    : null;

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-tef-md" style={{ borderColor: "hsl(214,25%,90%)" }}>
      {logo && (
        <div className="mb-5 pb-5 border-b" style={{ borderColor: "hsl(214,25%,90%)" }}>
          <div className="relative h-14 mx-auto" style={{ maxWidth: "200px" }}>
            <Image src={logo} alt={`Logo ${name}`} fill sizes="200px" className="object-contain" />
          </div>
        </div>
      )}

      {address && (
        <div className="flex items-start gap-2 mb-5">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: accent }} aria-hidden="true" />
          <span className="text-sm" style={{ color: "hsl(210,25%,45%)" }}>
            {address}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {waUrl && (
          <TrackedLink
            href={waUrl}
            ctaType="whatsapp"
            itemSlug={slug}
            campaign={campaign}
            {...tax}
            exit
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white transition-all hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, hsl(152,47%,32%) 0%, hsl(152,50%,28%) 100%)" }}
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            {t.whatsapp}
          </TrackedLink>
        )}

        {website && (
          <TrackedLink
            href={website}
            ctaType="website"
            itemSlug={slug}
            campaign={campaign}
            {...tax}
            exit
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white transition-all hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)" }}
          >
            <Globe className="h-4 w-4" aria-hidden="true" />
            {t.visitSite}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </TrackedLink>
        )}

        {/* ⚠️ Instagram/Ligar/E-mail: texto em azul médio FIXO, nunca `accent`. Ligado à categoria,
            o mesmo botão saía escuro no hotel, verde na agência e dourado na gastronomia — três cores
            para a mesma ação, e a dourada mal se lia sobre o branco. O acento de categoria continua
            vivo no pin do endereço, que é onde ele identifica a entidade em vez de disputar leitura. */}
        <div className="flex gap-3">
          {igUrl && (
            <TrackedLink
              href={igUrl}
              ctaType="instagram"
              itemSlug={slug}
              campaign={campaign}
              {...tax}
              ariaLabel={t.ariaInstagram(name)}
              className="inline-flex flex-1 items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border transition-all hover:scale-[1.02]"
              style={{ color: "hsl(210,56%,23%)", borderColor: "hsl(214,25%,85%)", background: "white" }}
            >
              <Instagram className="h-4 w-4" aria-hidden="true" />
              {t.instagram}
            </TrackedLink>
          )}
          {phone && (
            <a
              href={`tel:${phone}`}
              aria-label={t.ariaPhone(name)}
              className="inline-flex flex-1 items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border transition-all hover:scale-[1.02]"
              style={{ color: "hsl(210,56%,23%)", borderColor: "hsl(214,25%,85%)", background: "white" }}
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {t.call}
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              aria-label={t.ariaEmail(name)}
              className="inline-flex flex-1 items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border transition-all hover:scale-[1.02]"
              style={{ color: "hsl(210,56%,23%)", borderColor: "hsl(214,25%,85%)", background: "white" }}
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              {t.email}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
