"use client";

// Loader do modal de detalhe de parceiro. Monta no 1º "partner-detail:open".

import dynamic from "next/dynamic";
import DeferredEventMount from "@/components/lazy/DeferredEventMount";
import { PARTNER_DETAIL_EVENT } from "@/lib/partner-detail";

const PartnerDetailModal = dynamic(
  () => import("@/components/parceiros/PartnerDetailModal"),
  { ssr: false },
);

export default function PartnerDetailModalLazy() {
  return (
    <DeferredEventMount event={PARTNER_DETAIL_EVENT}>
      {() => <PartnerDetailModal />}
    </DeferredEventMount>
  );
}
