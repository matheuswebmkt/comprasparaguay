// Filepath: components/niche/NicheRecommendation.tsx
// Version: 9.0
// Nome da Versão: "Resolução server/DB — card e empty state renderizados no client (i18n)"
// Baseado na Versão: 8.0
//
// ⚠️ SEPARATION OF CONCERNS: este é o ÚNICO ponto da página de nicho que cita parceiro/agência.
//    A copy/SEO da página (app/data/niches.ts) nunca menciona o recomendado.
// ⚠️ SELF-CONTAINED:
//    • partners → `getNicheAssignmentsCached` (tag niche-settings)
//    • agência (key `transfer`) → active-agency + app/data/agencies
//
// ⚠️ v9.0 — a PARTE VISÍVEL (card + empty state) migrou para `components/niche/NichePitchCard.tsx`
//    (client, i18n pt/en/es via lib/i18n/entidades.ts + lib/i18n/niches-content.ts). Este arquivo
//    fica só com a resolução (DB/cache) e a montagem do `PitchSubject` serializável.
// ⚠️ v8.0 — "Ver mais detalhes" abre o ContactDetailModal (mini modal) que exibe APENAS o
//    ContactSidebar (WhatsApp/site/Instagram/endereço). Nada do modal gigante com as infos repetidas.

import type { Niche } from "@/app/data/niches";
import { activePartners, getCategoryMeta } from "@/app/data/partners";
import { AGENCY_NICHE_KEY } from "@/app/data/agencies";
import { getNicheAssignmentsCached } from "@/lib/niche-settings";
import { isPlanCurrentlyActive } from "@/lib/plan-periods";
import NichePitchCard, { NicheEmptyState, type PitchSubject } from "@/components/niche/NichePitchCard";
import TransferPitchCard from "@/components/niche/TransferPitchCard";
import type { Partner } from "@/app/types";

function partnerToPitch(partner: Partner): PitchSubject {
  const meta = getCategoryMeta(partner.category);
  return {
    kind: "partner",
    slug: partner.slug,
    name: partner.name,
    tagline: partner.tagline,
    businessType: partner.businessType ?? meta.name,
    city: partner.city,
    neighborhood: partner.neighborhood,
    country: partner.country,
    cover: partner.cover,
    highlights: partner.highlights,
    whatsapp: partner.whatsapp,
    whatsappMessage: partner.whatsappMessage,
    ctaUrl: partner.ctaUrl,
    ctaLabel: partner.ctaLabel,
    website: partner.website,
    accent: meta.accent,
    iconName: meta.iconName,
  };
}

export default async function NicheRecommendation({ niche }: { niche: Niche }) {
  // Nicho transfer (agência): card PRÓPRIO do site, SEMPRE — independe de haver agência
  // ativa. Nem card de agência, nem empty state (decisão de produto; conventions §13).
  if (niche.key === AGENCY_NICHE_KEY) {
    return <TransferPitchCard />;
  }

  let subject: PitchSubject | null = null;

  // Demais nichos: parceiro exclusivo via /nichos + plano mensal vigente (topo da hierarquia).
  const assignments = await getNicheAssignmentsCached();
  const assignedSlug = assignments[niche.key];
  if (assignedSlug && (await isPlanCurrentlyActive("partner", assignedSlug))) {
    const partner = activePartners.find((p) => p.slug === assignedSlug) ?? null;
    if (partner) subject = partnerToPitch(partner);
  }

  if (!subject) {
    return <NicheEmptyState niche={niche} />;
  }

  return <NichePitchCard subject={subject} />;
}
