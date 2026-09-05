// Filepath: components/cta-mode/CtaModeProvider.tsx
// Version: 6.0
// Nome da Versão: "Config ASSADA no servidor (prop initial) — sem fetch no client, sem delay/race"
"use client";

import { createContext, useContext } from "react";
import { DEFAULT_OFFER, type OfferConfig } from "@/lib/offer-defaults";

const OfferConfigContext = createContext<OfferConfig>(DEFAULT_OFFER);

/** Config completa da oferta (consumida pelo TicketOfferModal e pelo TicketOfferButton). */
export const useOfferConfig = () => useContext(OfferConfigContext);

// A config vem PRONTA do root layout (server, cacheada) → já está correta no 1º render.
// Sem fetch, sem loading, sem race: o CTA/modal nascem com o comportamento certo.
export default function CtaModeProvider({
  initial,
  children,
}: {
  initial: OfferConfig;
  children: React.ReactNode;
}) {
  return <OfferConfigContext.Provider value={initial}>{children}</OfferConfigContext.Provider>;
}
