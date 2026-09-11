"use client";

// Loader do modal de reserva (maior componente client do projeto). Monta no 1º "ticket-offer:open".
// `ssr: false` é seguro: o modal renderiza null enquanto fechado, então o HTML do servidor não muda.

import dynamic from "next/dynamic";
import DeferredEventMount from "@/components/lazy/DeferredEventMount";

const TicketOfferModal = dynamic(
  () => import("@/components/ticket-offer/TicketOfferModal"),
  { ssr: false },
);

export default function TicketOfferModalLazy() {
  return (
    <DeferredEventMount event="ticket-offer:open">
      {() => <TicketOfferModal />}
    </DeferredEventMount>
  );
}
