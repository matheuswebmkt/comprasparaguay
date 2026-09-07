// Filepath: components/TrackedLink.tsx
// Version: 3.1
// Nome da Versão: "+ taxonomia de portfólio opcional (vertical/niche/partnerSlug) no CTAClick"
// Baseado na Versão: 3.0

"use client";

import React from "react";
import { buildTrackedUrl, type UtmParams } from "@/lib/utm";
import { track } from "@/lib/track";
import { trackConversion, CONVERSIONS } from "@/lib/analytics";
import { taxonomyParams, type Niche, type Vertical } from "@/lib/tracking-taxonomy";

interface TrackedLinkProps {
  href: string;
  /** Tipo/posição do CTA: hero, navbar, partner_cta, whatsapp, website, instagram, map... */
  ctaType: string;
  itemSlug?: string;
  /**
   * Taxonomia do pixel de portfólio (`_docs-portfolio/pixel-matrix.md`). **Opcionais de propósito:**
   * o `TrackedLink` é usado em CTA de navegação e de produto, e dimensão que não se aplica é
   * OMITIDA (D8) — nunca preenchida com placeholder. Tipadas contra o enum, então não há como
   * passar uma string livre que o painel não saiba segmentar (G8).
   */
  vertical?: Vertical;
  niche?: Niche;
  /** Quem entrega: slug de `partners.ts` / `agencies.ts` / `hotels.ts` (matriz §1.4). */
  partnerSlug?: string | null;
  /**
   * Este link é uma **SAÍDA do funil**: leva ao ponto de contato do negócio (WhatsApp, reserva,
   * site, pedido). Quando `true`, além do `CTAClick` dispara **`Contact`** com a mesma taxonomia.
   *
   * Por que importa: na escada de parceiro não existe formulário, então a escada inteira é
   * `ViewContent → Contact` (matriz §3). Sem isto dá para montar um público de "viu o parceiro", mas
   * não de "foi falar com o parceiro" — que é o que tem valor comercial.
   *
   * 🚫 **Não usar em navegação interna, rede social ou mapa.** `Contact` precisa significar "foi ao
   * ponto de contato"; inflá-lo com clique informativo esvazia o público de retargeting em silêncio.
   */
  exit?: boolean;
  campaign?: string;
  /** utm_content (default = ctaType). */
  content?: string;
  /** utm_term (default = itemSlug). */
  term?: string;
  /** Abre em nova aba (default true). */
  external?: boolean;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
  children: React.ReactNode;
}

export default function TrackedLink({
  href,
  ctaType,
  itemSlug,
  vertical,
  niche,
  partnerSlug,
  exit,
  campaign,
  content,
  term,
  external = true,
  className,
  style,
  ariaLabel,
  children,
}: TrackedLinkProps) {
  const utm: UtmParams = {
    campaign: campaign ?? itemSlug,
    content: content ?? ctaType,
    term: term ?? itemSlug,
  };
  const finalHref = buildTrackedUrl(href, utm);

  const handleClick = () => {
    // sendBeacon sobrevive à navegação → não precisamos de preventDefault/delay.
    track({ type: "cta_click", ctaType, itemSlug, destination: finalHref, utm });
    // Conversão: Meta Pixel + GA4 (dataLayer) num disparo só.
    // ⚠️ `itemSlug` serve a DOIS consumidores com significados diferentes:
    //  • 1st-party (Neon): é a chave de atribuição do card/CTA — em parceiro e hotel ela é o slug do
    //    NEGÓCIO, e é isso que casa `cta_click` com o `ImpressionObserver` para dar reach/CTR por
    //    parceiro no dashboard. Não pode mudar.
    //  • pixel: `item_slug` significa O QUE foi vendido e `partner_slug` significa QUEM entrega
    //    (matriz §1.4). Mandar o slug do negócio como `item_slug` é exatamente o defeito que o RG
    //    encontrou no `modal_partner_reservation` — mistura as duas dimensões.
    // Por isso: quando o chamador declara `partnerSlug` igual ao `itemSlug`, o pixel recebe só
    // `partner_slug`. Quando o negócio É o produto (sem item de catálogo), não há item — só parceiro.
    const pixelItemSlug = partnerSlug && partnerSlug === itemSlug ? undefined : itemSlug;
    const tax = taxonomyParams({ vertical, niche, item_slug: pixelItemSlug, partner_slug: partnerSlug });
    trackConversion(CONVERSIONS.ctaClick, { cta_type: ctaType, destination: finalHref, ...tax });
    // SAÍDA → `Contact` (matriz §4). `cta_type`/`destination` ficam só no `CTAClick`: aquilo é
    // telemetria de UI, e o `Contact` é degrau de funil. Sem `value` (G3).
    if (exit) trackConversion(CONVERSIONS.contact, tax);
  };

  return (
    <a
      href={finalHref}
      onClick={handleClick}
      className={className}
      style={style}
      aria-label={ariaLabel}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
