// Filepath: lib/contact-detail.ts
// Version: 1.0
// Nome da Versão: "Evento global de abertura do mini modal de contato — exibe só o sidebar (sem o modal gigante de detalhe)"
//
// O usuário pediu que "Ver mais detalhes" NÃO abra o modal gigante com tudo repetido — apenas o
// sidebar de contato (WhatsApp/site/Instagram/endereço). Este evento carrega o `kind` (agency,
// partner) + slug; o `ContactDetailModal` (montado 1× no layout) resolve o perfil e
// renderiza só o ContactSidebar.

export type ContactKind = "agency" | "partner";

export const CONTACT_DETAIL_EVENT = "contact-detail:open";

export function openContactDetail(kind: ContactKind, slug: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CONTACT_DETAIL_EVENT, { detail: { kind, slug } }));
}
