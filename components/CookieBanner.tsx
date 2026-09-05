// Filepath: components/CookieBanner.tsx
// Version: 1.0
// Nome da Versão: "Banner de cookies próprio (sem CMP externo) — botão único 'Entendi'"
// Baseado na Versão: N/A
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SHARED_UI } from "@/lib/i18n/shared";
import { hasCookieConsent, grantCookieConsent } from "@/lib/cookie-consent";

export default function CookieBanner() {
  const { locale } = useLocale();
  const t = SHARED_UI[locale].cookieBanner;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Só decide no client (evita flash/hydration mismatch — o servidor não sabe o que está no localStorage).
    setVisible(!hasCookieConsent());
  }, []);

  if (!visible) return null;

  const onAccept = () => {
    grantCookieConsent();
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label={t.ariaLabel}
      className="fixed inset-x-0 bottom-0 z-[250] px-3 pb-3 sm:px-6 sm:pb-6 animate-in slide-in-from-bottom-4 fade-in duration-300"
    >
      <div
        className="mx-auto max-w-3xl rounded-2xl px-5 py-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 text-white"
        style={{
          background: "linear-gradient(160deg, #0F2A47 0%, #0A1C30 100%)",
          boxShadow: "0 16px 48px rgba(10,20,35,0.35)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Cookie className="h-6 w-6 flex-none hidden sm:block" style={{ color: "hsl(38,90%,60%)" }} aria-hidden="true" />
        <p className="text-sm leading-relaxed text-white/75 flex-1">
          {t.textBefore}{" "}
          <Link href="/aviso-legal" className="underline underline-offset-2 text-white/90">
            {t.linkLabel}
          </Link>
          {t.textAfter}
        </p>
        <button
          onClick={onAccept}
          className="flex-none inline-flex items-center justify-center rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.03] active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)",
          }}
        >
          {t.accept}
        </button>
      </div>
    </div>
  );
}
