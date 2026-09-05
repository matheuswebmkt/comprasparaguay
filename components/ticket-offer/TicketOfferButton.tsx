// Filepath: components/ticket-offer/TicketOfferButton.tsx
// Version: 6.1
// Nome da Versão: "Clique no CTA passa a contar (Sprint 10 — track() nunca era chamado, só o CustomEvent)"
// Baseado na Versão: 6.0 ("Captura sempre ativa; link de sucesso resolvido por atrativo (ou global)")
"use client";

import React from "react";
import { buildTrackedUrl, type UtmParams } from "@/lib/utm";
import { track } from "@/lib/track";
import { useOfferConfig } from "@/components/cta-mode/CtaModeProvider";
import type { LeadContext, LeadIntent, TicketOfferOpenDetail } from "@/lib/roteiro-lead";

interface TicketOfferButtonProps {
  href: string;
  ctaType: string;
  itemSlug?: string;
  campaign?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  /** ingresso | roteiro | atrativo */
  context?: LeadContext;
  /** orcamento | personalizar (só faz sentido com context=roteiro) */
  intent?: LeadIntent;
  roteiroTitulo?: string;
  roteiroResumo?: string;
  /** `content_ids` do pixel — slugs de atrativo que o bundle inclui (matriz §1.3). */
  contentIds?: string[];
  /** Card do modal: título/imagem/subtítulo do item. */
  subjectTitle?: string;
  subjectImage?: string | null;
  subjectSubtitle?: string | null;
  /** Nome + tagline nos 3 idiomas — o modal troca de idioma sem recarregar (ver TicketOfferOpenDetail). */
  subjectI18n?: TicketOfferOpenDetail["subjectI18n"];
}

export default function TicketOfferButton({
  href,
  ctaType,
  itemSlug,
  campaign,
  className,
  style,
  children,
  context,
  intent,
  roteiroTitulo,
  roteiroResumo,
  contentIds,
  subjectTitle,
  subjectImage,
  subjectSubtitle,
  subjectI18n,
}: TicketOfferButtonProps) {
  const { attractionOffers } = useOfferConfig();
  const isAtrativo = context === "atrativo";
  const attractionSetting = isAtrativo ? attractionOffers?.[itemSlug ?? ""] : undefined;

  // Link direto só existe por atrativo específico, com URL própria (Modo="direct" + preenchido). Sem
  // fallback global — roteiro/personalizar nunca têm link, e atrativo em Modo="agency" (ou sem URL
  // própria preenchida) cai no modo de sucesso normal (mensagem/WhatsApp), sem link nenhum.
  const resolvedDirectUrl =
    isAtrativo && attractionSetting?.hasLink !== false && attractionSetting?.mode === "direct"
      ? (attractionSetting.officialUrl?.trim() || null)
      : null;

  const officialHref = resolvedDirectUrl ?? href;

  const utm: UtmParams = {
    campaign: campaign ?? itemSlug,
    content: ctaType,
    term: itemSlug,
  };
  const finalHref = buildTrackedUrl(officialHref, utm);
  const openModal = (e: React.MouseEvent) => {
    // Botão pode viver dentro de um <Link> (ex: AttractionCard, corpo inteiro clicável) — sem isso, o
    // clique bubbla pro <Link> e navega pro atrativo além de (ou em vez de) abrir o modal.
    e.preventDefault();
    e.stopPropagation();
    // "Cliques nos CTAs" (/admin/dashboard/pagina) só conta o que passa por `track()` — antes este botão
    // só disparava o CustomEvent abaixo (que abre o modal) e nunca chamava `track()`, então nenhum clique
    // aqui era contado. ⚠️ `destination: "#"`: o clique abre o MODAL, o visitante não vai a lugar nenhum
    // — gravar `finalHref` faria abertura de modal parecer saída real e inflaria a métrica (`opened` vs.
    // `redirected` já se separam por essa convenção em lib/metrics). `finalHref` continua indo só no
    // CustomEvent (o modal precisa dele pro link direto da tela de sucesso).
    track({ type: "cta_click", ctaType, itemSlug, destination: "#", utm });
    const isRoteiro =
      context === "roteiro" ||
      ctaType.startsWith("roteiro") ||
      intent === "personalizar";
    window.dispatchEvent(
      new CustomEvent("ticket-offer:open", {
        detail: {
          href: resolvedDirectUrl ? finalHref : "",
          ctaType,
          itemSlug,
          context: context ?? (isAtrativo ? "atrativo" : undefined),
          intent,
          roteiroTitulo,
          roteiroResumo,
          roteiroSlug: isRoteiro ? itemSlug : undefined,
          contentIds,
          subjectTitle: subjectTitle ?? roteiroTitulo,
          subjectImage: subjectImage ?? null,
          subjectSubtitle: subjectSubtitle ?? null,
          subjectI18n,
          attractionMode: isAtrativo ? (attractionSetting?.mode ?? "direct") : undefined,
          attractionNoLinkMode:
            isAtrativo && attractionSetting?.hasLink === false
              ? (attractionSetting.noLinkMode ?? "close")
              : undefined,
        },
      }),
    );
  };

  return (
    <button type="button" onClick={openModal} className={className} style={style}>
      {children}
    </button>
  );
}
