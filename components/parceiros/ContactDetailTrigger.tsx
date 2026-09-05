// Filepath: components/parceiros/ContactDetailTrigger.tsx
// Version: 1.0
// Nome da Versão: "Botão client que abre o mini modal de contato (ContactDetailModal) — só o sidebar"
//
// Dispara track de abertura (`detail_open` → clicksByType) e o CustomEvent que o ContactDetailModal
// escuta. Usado como "Ver mais detalhes" no pitch de hotel/agência/parceiro — o mini modal exibe
// APENAS o ContactSidebar, não o modal gigante com tudo repetido.

"use client";

import type { CSSProperties, ReactNode } from "react";
import { openContactDetail, type ContactKind } from "@/lib/contact-detail";
import { track } from "@/lib/track";

export default function ContactDetailTrigger({
  kind,
  slug,
  className,
  style,
  children,
}: {
  kind: ContactKind;
  slug: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        track({ type: "cta_click", ctaType: "detail_open", itemSlug: slug });
        openContactDetail(kind, slug);
      }}
      className={className}
      style={style}
    >
      {children}
    </button>
  );
}
