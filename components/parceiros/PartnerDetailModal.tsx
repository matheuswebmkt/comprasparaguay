// Filepath: components/parceiros/PartnerDetailModal.tsx
// Version: 2.0
// Nome da Versão: "Diálogo centralizado (não mais full-screen) — padrão TicketOfferModal, com backdrop"
//
// Padrão do TicketOfferModal: overlay com backdrop escuro (clique fecha), diálogo centralizado
// `max-w-6xl` com canto arredondado, altura limitada (`max-h-[92svh]`) e scroll INTERNO no corpo.
// `max-w-6xl` preserva o grid 2 colunas do conteúdo (`lg:grid-cols-[1fr_360px]` precisa de ≥1024px).
// Escuta `partner-detail:open` (ver lib/partner-detail.ts) e resolve o parceiro via getPartnerBySlug
// (catálogo estático, client-safe). Fecha por ✕, ESC ou clique no backdrop; trava o scroll do body.
// ⚠️ z-[210] (> TicketOfferModal, z-[200]) DE PROPÓSITO: o "Saber mais" dentro do próprio TicketOfferModal
// abre este modal por cima do outro — os dois ficam montados ao mesmo tempo nesse fluxo.

"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import PartnerDetailContent from "@/components/parceiros/PartnerDetailContent";
import { getCategoryMeta, getPartnerBySlug } from "@/app/data/partners";
import { partnerSchema } from "@/lib/seo";
import { PARTNER_DETAIL_EVENT } from "@/lib/partner-detail";
import { trackConversion, CONVERSIONS } from "@/lib/analytics";
import { asNiche, taxonomyParams, verticalOfPartnerCategory } from "@/lib/tracking-taxonomy";

export default function PartnerDetailModal({
  onReady,
}: {
  /** Avisa o loader preguiçoso que o listener já está registrado — ver `architecture/componentes.md`. */
  onReady?: () => void;
} = {}) {
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ slug: string }>).detail;
      setSlug(detail?.slug ?? null);
    };
    window.addEventListener(PARTNER_DETAIL_EVENT, handler);
    onReady?.();
    return () => window.removeEventListener(PARTNER_DETAIL_EVENT, handler);
  }, [onReady]);

  const close = useCallback(() => setSlug(null), []);

  useEffect(() => {
    if (!slug) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [slug, close]);

  // `ViewContent` do parceiro (matriz §1.5): parceiro NÃO tem rota própria — é card em página hub e
  // o clique abre este modal. Logo, não existe page load onde disparar, e a ABERTURA é o único
  // momento possível. Sem isto o Meta fica cego para o parceiro inteiro: `partner_slug` é o único
  // canal desse dado até lá, e param não é retroativo (D5/D11).
  // 🚫 Sem `value`/`currency` — só o `Lead` os carrega (G3).
  useEffect(() => {
    if (!slug) return;
    const p = getPartnerBySlug(slug);
    if (!p) return;
    trackConversion(
      CONVERSIONS.viewContent,
      taxonomyParams({
        vertical: verticalOfPartnerCategory(p.category),
        // A ponte dado→enum: `Partner.niches` é `string[]` livre. Chave que o portfólio não conheça
        // devolve `undefined` e o param é OMITIDO (D8), nunca vaza string órfã pro pixel.
        niche: asNiche(p.niches?.[0]),
        partner_slug: p.slug,
      }),
    );
  }, [slug]);

  if (!slug) return null;
  const partner = getPartnerBySlug(slug);
  if (!partner) return null;

  const meta = getCategoryMeta(partner.category);
  const igUrl = partner.instagram
    ? partner.instagram.startsWith("http")
      ? partner.instagram
      : `https://instagram.com/${partner.instagram.replace(/^@/, "")}`
    : null;
  const hasPrimaryCta = Boolean(partner.ctaUrl);

  return (
    <div
      className="fixed inset-0 z-[210] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={partner.name}
    >
      <JsonLd data={partnerSchema(partner)} />

      {/* Backdrop — clique fecha (padrão TicketOfferModal) */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={close}
        aria-hidden="true"
      />

      <div
        className="relative z-10 flex max-h-[92svh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl shadow-2xl animate-in fade-in duration-200"
        style={{ background: "hsl(40,33%,97%)" }}
      >
        {/* Close — FORA do corpo rolável, fica sempre visível */}
        <button
          type="button"
          onClick={close}
          aria-label="Fechar"
          className="absolute top-3 right-3 z-20 p-2 rounded-full transition-colors hover:bg-black/10"
          style={{ background: "rgba(15,42,71,0.35)", backdropFilter: "blur(4px)" }}
        >
          <X className="h-5 w-5 text-white" aria-hidden="true" />
        </button>

        <div className="flex-1 overflow-y-auto">
          <PartnerDetailContent
            partner={partner}
            meta={meta}
            igUrl={igUrl}
            hasPrimaryCta={hasPrimaryCta}
          />
        </div>
      </div>
    </div>
  );
}
