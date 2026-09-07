// Filepath: lib/i18n/partners.ts
// Version: 2.0
// Nome da Versão: "Dicionário esvaziado — lista de parceiros hoje vazia"
//
// `app/data/partners.ts` guarda os FATOS/estrutura (slug, name, address, whatsapp, urls, imagens)
// e `name` (nome da marca) fica intacto lá, inclusive para SEO (metadata da página do parceiro é
// sempre pt). Aqui só o TEXTO de marketing/copy do parceiro (tagline, descrição, destaques,
// mensagens) ganha versão por locale.

import type { Locale } from "./config";
import type { Partner } from "@/app/types";

export interface PartnerMenuItemI18n {
  name?: string;
  desc?: string;
  badge?: string;
}
export interface PartnerMenuGroupI18n {
  groupLabel: string;
  note?: string;
  items: PartnerMenuItemI18n[];
}
export interface PartnerI18n {
  businessType?: string;
  tagline: string;
  description: string[];
  ctaLabel?: string;
  whatsappMessage?: string;
  highlights?: string[];
  hours?: string[];
  features?: { title: string; text: string }[];
  serviceHighlight?: { title: string; text: string; items?: string[]; ctaLabel?: string };
  menu?: PartnerMenuGroupI18n[];
  awards?: { title: string; text: string; points?: string[] };
  closing?: { text: string };
}

export const PARTNERS_I18N: Record<Locale, Record<string, PartnerI18n>> = {
  pt: {},
  en: {},
  es: {},
};

/**
 * Mescla o parceiro (fatos: nome/endereço/urls/imagens) com o texto de marketing traduzido do
 * dicionário acima. Sem entrada no dicionário (parceiro futuro sem tradução ainda) → devolve os
 * campos originais de `partners.ts` (pt) sem quebrar. Imagens/ícones/URLs sempre vêm do dado original.
 */
export function localizedPartner(partner: Partner, locale: Locale): Partner {
  const i18n = PARTNERS_I18N[locale]?.[partner.slug];
  if (!i18n) return partner;
  return {
    ...partner,
    businessType: i18n.businessType ?? partner.businessType,
    tagline: i18n.tagline,
    description: i18n.description,
    ctaLabel: i18n.ctaLabel ?? partner.ctaLabel,
    whatsappMessage: i18n.whatsappMessage ?? partner.whatsappMessage,
    highlights: i18n.highlights ?? partner.highlights,
    hours: i18n.hours ?? partner.hours,
    features: partner.features?.map((f, i) => ({
      ...f,
      title: i18n.features?.[i]?.title ?? f.title,
      text: i18n.features?.[i]?.text ?? f.text,
    })),
    serviceHighlight: partner.serviceHighlight
      ? { ...partner.serviceHighlight, ...i18n.serviceHighlight }
      : partner.serviceHighlight,
    menu: partner.menu?.map((g, gi) => ({
      ...g,
      groupLabel: i18n.menu?.[gi]?.groupLabel ?? g.groupLabel,
      note: i18n.menu?.[gi]?.note ?? g.note,
      items: g.items.map((it, ii) => ({
        ...it,
        name: i18n.menu?.[gi]?.items?.[ii]?.name ?? it.name,
        desc: i18n.menu?.[gi]?.items?.[ii]?.desc ?? it.desc,
        badge: i18n.menu?.[gi]?.items?.[ii]?.badge ?? it.badge,
      })),
    })),
    awards: partner.awards && i18n.awards ? { ...partner.awards, ...i18n.awards } : partner.awards,
    closing: partner.closing && i18n.closing ? { ...partner.closing, ...i18n.closing } : partner.closing,
  };
}
