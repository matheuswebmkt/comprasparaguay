// Filepath: components/CountryFlagBadge.tsx
// Badge de país sobre a FOTO do card de atrativo (AttractionCard): bandeira SVG inline + nome do país
// por idioma. ⚠️ Emojis de bandeira NÃO renderizam no Windows (mostram "BR"/"AR"/"PY") — por isso SVG.
// Padrão do §7.4 (badge sobre foto): vidro fosco + rim + texto branco com text-shadow.
// Bandeiras simplificadas (sem os detalhes finos — num badge de 12px eles somem de qualquer jeito).

"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import type { Locale } from "@/lib/i18n/config";

export type CountryCode = "BR" | "AR" | "PY";

const COUNTRY_NAME: Record<Locale, Record<CountryCode, string>> = {
  pt: { BR: "Brasil", AR: "Argentina", PY: "Paraguai" },
  en: { BR: "Brazil", AR: "Argentina", PY: "Paraguay" },
  es: { BR: "Brasil", AR: "Argentina", PY: "Paraguay" },
};

function FlagBR() {
  return (
    <svg viewBox="0 0 24 16" className="h-3 w-[18px]" aria-hidden="true">
      <rect width="24" height="16" fill="#009C3B" />
      <polygon points="12,2 22,8 12,14 2,8" fill="#FFDF00" />
      <circle cx="12" cy="8" r="3.5" fill="#002776" />
    </svg>
  );
}

function FlagAR() {
  return (
    <svg viewBox="0 0 24 16" className="h-3 w-[18px]" aria-hidden="true">
      <rect width="24" height="16" fill="#74ACDF" />
      <rect y="5.33" width="24" height="5.33" fill="#FFFFFF" />
      <circle cx="12" cy="8" r="2.1" fill="#F6B40E" />
    </svg>
  );
}

function FlagPY() {
  return (
    <svg viewBox="0 0 24 16" className="h-3 w-[18px]" aria-hidden="true">
      <rect width="24" height="16" fill="#D52B1E" />
      <rect y="5.33" width="24" height="5.33" fill="#FFFFFF" />
      <rect y="10.66" width="24" height="5.33" fill="#0038A8" />
    </svg>
  );
}

export default function CountryFlagBadge({ country }: { country: CountryCode }) {
  const { locale } = useLocale();
  const nome = COUNTRY_NAME[locale][country];
  return (
    <span
      className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
      style={{
        background: "hsla(0,0%,100%,0.18)",
        backdropFilter: "blur(12px) saturate(180%)",
        boxShadow: "inset 0 0 0 1px hsla(0,0%,100%,0.42)",
        textShadow: "0 1px 2px rgba(0,0,0,0.25)",
      }}
    >
      {country === "BR" ? <FlagBR /> : country === "AR" ? <FlagAR /> : <FlagPY />}
      <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "#fff" }}>
        {nome}
      </span>
    </span>
  );
}
