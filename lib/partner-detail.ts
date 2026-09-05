// Filepath: lib/partner-detail.ts
// Version: 1.0
// Nome da Versão: "Evento global de abertura do modal de detalhe do parceiro (substitui a página /[slug])"
//
// Mesmo padrão do `ticket-offer:open` (TicketOfferButton/TicketOfferModal): dispara um CustomEvent no
// `window` com o slug; o `PartnerDetailModal` (montado 1× no layout) escuta e resolve os dados via
// `getPartnerBySlug` (catálogo estático, client-safe) — evita prop drilling pelos vários lugares que
// hoje abrem o detalhe do parceiro (cards da home, hub de nichos, timeline de roteiro).

export const PARTNER_DETAIL_EVENT = "partner-detail:open";

export function openPartnerDetail(slug: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(PARTNER_DETAIL_EVENT, { detail: { slug } }));
}
