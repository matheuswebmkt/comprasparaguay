// Filepath: components/CategoryIcon.tsx
// Version: 1.0
// Nome da Versão: "Mapeia iconName (string da data) para ícone lucide-react"
// Baseado na Versão: N/A

import {
  UtensilsCrossed, Hotel, Compass, MapPin,
  Award, Truck, Snowflake, PartyPopper, Beer, Wheat, ShieldCheck, Sparkles,
  type LucideIcon,
} from "lucide-react";

// Mantém a data (partners.ts) desacoplada do React: a data guarda só o nome do ícone.
const ICONS: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Hotel,
  Compass,
  // Ícones de diferenciais (campo `features` / `serviceHighlight` do parceiro)
  Award,
  Truck,
  Snowflake,
  PartyPopper,
  Beer,
  Wheat,
  ShieldCheck,
  Sparkles,
};

export default function CategoryIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICONS[name] ?? MapPin;
  return <Icon className={className} aria-hidden="true" />;
}
