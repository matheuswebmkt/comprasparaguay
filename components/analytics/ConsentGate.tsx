// Filepath: components/analytics/ConsentGate.tsx
// Version: 1.0
// Nome da Versão: "Só monta os filhos (Meta Pixel/GTM) depois do aceite do CookieBanner"
// Baseado na Versão: N/A
"use client";

import { useEffect, useState } from "react";
import { hasCookieConsent, COOKIE_CONSENT_EVENT } from "@/lib/cookie-consent";

export default function ConsentGate({ children }: { children: React.ReactNode }) {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    setGranted(hasCookieConsent());
    const onGranted = () => setGranted(true);
    window.addEventListener(COOKIE_CONSENT_EVENT, onGranted);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onGranted);
  }, []);

  if (!granted) return null;
  return <>{children}</>;
}
