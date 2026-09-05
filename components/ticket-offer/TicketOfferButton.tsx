// Filepath: components/ticket-offer/TicketOfferButton.tsx
// Version: 7.0
// Nome da Versão: "Clique SEMPRE abre o modal — a saída pelo link oficial do atrativo (Modo Direto) morreu"
// Baseado na Versão: 6.0 ("Captura sempre ativa; link de sucesso resolvido por atrativo (ou global)")
"use client";

import React from "react";
import { buildTrackedUrl, type UtmParams } from "@/lib/utm";
import { track } from "@/lib/track";
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
  // Não há mais caminho por fora: `href` é a URL interna rastreada do próprio clique. O antigo
  // `resolvedDirectUrl` (Modo="direct" + URL própria no admin) a trocava pelo `officialUrl` do atrativo;
  // com o ingresso extinto, o clique abre o modal de reserva em TODO contexto.
  const utm: UtmParams = {
    campaign: campaign ?? itemSlug,
    content: ctaType,
    term: itemSlug,
  };
  const finalHref = buildTrackedUrl(href, utm);
  const openModal = (e: React.MouseEvent) => {
    // Botão pode viver dentro de um <Link> (ex: AttractionCard, corpo inteiro clicável) — sem isso, o
    // clique bubbla pro <Link> e navega pro atrativo além de (ou em vez de) abrir o modal.
    e.preventDefault();
    e.stopPropagation();
    // "Cliques nos CTAs" (/admin/dashboard/pagina) só conta o que passa por `track()` — antes este botão
    // só disparava o CustomEvent abaixo (que abre o modal) e nunca chamava `track()`, então nenhum clique
    // aqui era contado. ⚠️ `destination: "#"`: o clique abre o MODAL, o visitante não vai a lugar nenhum
    // — gravar `finalHref` faria abertura de modal parecer saída real e inflaria a métrica (`opened` vs.
    // `redirected` já se separam por essa convenção em lib/metrics). `finalHref` segue no CustomEvent
    // como destino registrado do clique — desde a v7.0 o modal não a usa como link de saída.
    track({ type: "cta_click", ctaType, itemSlug, destination: "#", utm });
    const isRoteiro =
      context === "roteiro" ||
      ctaType.startsWith("roteiro") ||
      intent === "personalizar";
    window.dispatchEvent(
      new CustomEvent("ticket-offer:open", {
        detail: {
          href: finalHref,
          ctaType,
          itemSlug,
          context,
          intent,
          roteiroTitulo,
          roteiroResumo,
          roteiroSlug: isRoteiro ? itemSlug : undefined,
          contentIds,
          subjectTitle: subjectTitle ?? roteiroTitulo,
          subjectImage: subjectImage ?? null,
          subjectSubtitle: subjectSubtitle ?? null,
          subjectI18n,
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
