// Filepath: components/CountryFlag.tsx
// Version: 1.0
// Nome da Versão: "Bandeiras SVG inline (BR/AR/PY) — confiável cross-platform"
// Baseado na Versão: N/A

type Country = "BR" | "AR" | "PY";

export const COUNTRY_LABEL: Record<Country, string> = {
  BR: "Brasil",
  AR: "Argentina",
  PY: "Paraguai",
};

export default function CountryFlag({
  country,
  className = "h-4 w-6",
}: {
  country: Country;
  className?: string;
}) {
  return (
    <span
      className={`inline-block overflow-hidden rounded-[3px] ring-1 ring-black/10 ${className}`}
      role="img"
      aria-label={`Bandeira: ${COUNTRY_LABEL[country]}`}
    >
      <svg viewBox="0 0 30 20" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        {country === "BR" && (
          <>
            <rect width="30" height="20" fill="#009C3B" />
            <polygon points="15,2.5 27.5,10 15,17.5 2.5,10" fill="#FFDF00" />
            <circle cx="15" cy="10" r="4.1" fill="#002776" />
          </>
        )}
        {country === "AR" && (
          <>
            <rect width="30" height="20" fill="#74ACDF" />
            <rect y="6.67" width="30" height="6.66" fill="#fff" />
            <circle cx="15" cy="10" r="2.1" fill="#F6B40E" />
          </>
        )}
        {country === "PY" && (
          <>
            <rect width="30" height="20" fill="#D52B1E" />
            <rect y="6.67" width="30" height="6.66" fill="#fff" />
            <rect y="13.33" width="30" height="6.67" fill="#0038A8" />
          </>
        )}
      </svg>
    </span>
  );
}
