// Filepath: components/parceiros/PartnerDetailTrigger.tsx
// Version: 1.0
// Nome da Versão: "Botão client que abre o PartnerDetailModal — usado por Server Components (ex.: NicheRecommendation)"

"use client";

import type { CSSProperties, ReactNode } from "react";
import { openPartnerDetail } from "@/lib/partner-detail";

export default function PartnerDetailTrigger({
  slug,
  className,
  style,
  children,
}: {
  slug: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <button type="button" onClick={() => openPartnerDetail(slug)} className={className} style={style}>
      {children}
    </button>
  );
}
