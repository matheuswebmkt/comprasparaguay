// Filepath: app/data/partners.ts
// Version: 4.0
// Nome da Versão: "Gastronomia fora do projeto — categoria única Turismo; lista de parceiros vazia"
//
// O Compras PY é só o eixo compras: o parceiro, quando existir, é quem OPERA o serviço
// recomendado (receptivo/transfer). A copy de cada parceiro ganha tradução via
// `lib/i18n/partners.ts` (mescla por slug); aqui ficam só os FATOS.

import { Partner, PartnerCategory, PartnerCategoryMeta } from "@/app/types";

// =============================================================================
// CATEGORIAS — uma única: Turismo (agências e receptivo da fronteira).
// =============================================================================
export const partnerCategories: PartnerCategoryMeta[] = [
  {
    slug: "turismo",
    name: "Turismo",
    iconName: "Compass",
    accent: "hsl(152, 47%, 32%)",
    description:
      "Agências de turismo locais que montam roteiros e passeios pela região.",
  },
];

export const getCategoryMeta = (slug: PartnerCategory): PartnerCategoryMeta =>
  partnerCategories.find((c) => c.slug === slug) ?? partnerCategories[0];

// =============================================================================
// PARCEIROS — vazio até cadastrar parceiros REAIS do eixo compras.
// Sem parceiros, os slots de recomendação (NicheRecommendation) exibem o empty state.
// `country`: "BR" (Foz do Iguaçu) | "AR" (Puerto Iguazú) | "PY" (Ciudad del Este).
// =============================================================================
export const partners: Partner[] = [];

/** Parceiros ativos (oculta rascunhos). */
export const activePartners = partners.filter((p) => p.status !== "draft");

export const getPartnerBySlug = (slug: string): Partner | undefined =>
  partners.find((p) => p.slug === slug);

export const getPartnersByCategory = (category: PartnerCategory): Partner[] =>
  activePartners.filter((p) => p.category === category);

/**
 * Parceiro EXCLUSIVO de um nicho (a "Recomendação Oficial" da página de nicho).
 * Retorna o primeiro parceiro ATIVO cujo `niches` inclui a chave — só deve existir um por nicho
 * (exclusividade comercial). NÃO considera o toggle do admin: quem intersecta com `getEnabledSlugs`
 * é o componente `NicheRecommendation` (para a página herdar a dependência de cache/tag).
 */
export const getPartnerForNiche = (nicheKey: string): Partner | undefined =>
  activePartners.find((p) => p.niches?.includes(nicheKey));
