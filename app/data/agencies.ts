// Filepath: app/data/agencies.ts
// Version: 1.0
// Nome da Versão: "Catálogo estático de AGÊNCIAS — SSOT de perfil (Foz Falls + teste); espelha o padrão de partners.ts"
//
// ⚠️ AGÊNCIA ≠ PARTNER (conventions §13): partners = negócios locais (vitrine/SEO).
//    Agências = quem RECEBE os leads. Bases SEPARADAS.
//
// ⭐ ESTE ARQUIVO é a fonte única de verdade do PERFIL da agência (nome, contatos, copy,
//    mídia). Trocar/adicionar agência AQUI — o seed do Neon (`lib/agencies.ts`), defaults
//    do modal/transporte, labels de admin e a recomendação do nicho `transfer`
//    leem daqui. O Neon só guarda a relação lead↔slug + qual está ATIVA (admin).

export type AgencyCountry = "BR" | "AR" | "PY";

/**
 * Perfil público/operacional de uma agência (catálogo estático).
 * Campos de mídia/copy alimentam a recomendação de nicho e defaults de produto.
 * Campos de contato alimentam seed do Neon e CTAs públicos.
 */
export interface AgencyProfile {
  slug: string;
  /** Nome curto (notificações, labels, successClose). */
  name: string;
  /** Razão social / nome completo (SEO, pitch). */
  legalName?: string;
  businessType: string;
  tagline: string;
  /** Parágrafos curtos (admin, futuro pitch estendido). */
  description: string[];
  city: string;
  state: string;
  country: AgencyCountry;
  website?: string;
  /** Só dígitos, E.164 sem "+" (ex: 5545999749860). */
  whatsapp?: string;
  whatsappMessage?: string;
  instagram?: string; // handle sem @
  email?: string;
  /** Capa da recomendação de nicho. Sem cover → só gradiente no pitch. */
  cover?: string;
  logo?: string;
  highlights?: string[];
  /**
   * Se true, pode aparecer na recomendação pública do nicho `transfer`
   * quando for a agência ativa. Agência de teste = false (nunca vaza pro site).
   */
  isPublic: boolean;
  /** false = só operacional (seed/admin), sem pitch público. */
  status: "active" | "draft";
}

// =============================================================================
// SLUG OFICIAL — a agência parceira comercial "de produto" (defaults de modal,
// transporte, labels). Trocar AQUI quando a parceria oficial mudar; o admin
// `/agencia` controla só quem recebe leads + o que o nicho recomenda.
// =============================================================================
export const OFFICIAL_AGENCY_SLUG = "foz-falls";

/** Chave do nicho SEO cuja recomendação vem da agência ATIVA (não de niche_settings/partners). */
export const AGENCY_NICHE_KEY = "transfer";

// =============================================================================
// CATÁLOGO
// =============================================================================
export const agencies: AgencyProfile[] = [
  {
    slug: "foz-falls",
    name: "Foz Falls",
    legalName: "Foz Falls Turismo e Viagem",
    businessType: "Agência de turismo",
    tagline:
      "Especialistas em Foz do Iguaçu, Paraguai e Argentina — viagens e roteiros personalizados, transfers e ingressos com atendimento próximo.",
    description: [
      "A Foz Falls Turismo e Viagem é uma agência especializada em turismo privativo na Tríplice Fronteira, com equipe preparada e veículos executivos (carro e van) para transfers e passeios.",
      "Roteiros personalizados, ingressos e logística em Foz do Iguaçu, Argentina e Paraguai — para o turista aproveitar cada atrativo sem dor de cabeça.",
    ],
    city: "Foz do Iguaçu",
    state: "PR",
    country: "BR",
    website: "https://fozfallsturismo.com.br/",
    whatsapp: "5545999749860",
    whatsappMessage:
      "Olá, Foz Falls! Vim pelo site da Compras Paraguay e quero receber meu roteiro / tirar dúvidas sobre passeios e transfers.",
    instagram: "fozfallsturismo",
    email: "comercial@fozfallsturismo.com.br",
    cover: "/images/agencias/foz-falls/cover.webp",
    highlights: [
      "Turismo privativo",
      "Transfers",
      "Roteiros personalizados",
      "Ingressos",
      "Tríplice Fronteira",
    ],
    isPublic: true,
    status: "active",
  },
  {
    slug: "agencia-teste",
    name: "Agência Teste",
    businessType: "Agência de teste",
    tagline: "Agência de teste para validar o fluxo de atribuição de leads (nunca exibida no site).",
    description: [
      "Agência de teste para validar o fluxo de atribuição de leads e as telas do admin. Não deve aparecer em páginas públicas.",
    ],
    city: "Foz do Iguaçu",
    state: "PR",
    country: "BR",
    isPublic: false,
    status: "active",
  },
];

// =============================================================================
// HELPERS
// =============================================================================
export function getAgencyBySlug(slug: string): AgencyProfile | null {
  return agencies.find((a) => a.slug === slug) ?? null;
}

/** Agência oficial de produto (defaults de copy/labels). */
export function getOfficialAgency(): AgencyProfile {
  return getAgencyBySlug(OFFICIAL_AGENCY_SLUG) ?? agencies[0];
}

/** Nome curto da agência oficial — atalho p/ defaults e labels. */
export function officialAgencyName(): string {
  return getOfficialAgency().name;
}

/** Perfis que podem ser seedados no Neon (status active). */
export function seedableAgencies(): AgencyProfile[] {
  return agencies.filter((a) => a.status === "active");
}

/**
 * Perfil público p/ pitch (nicho). Só retorna se `isPublic` e status active.
 * Usado pela recomendação de `transfer` quando o slug ativo bate.
 */
export function getPublicAgencyProfile(slug: string | null | undefined): AgencyProfile | null {
  if (!slug) return null;
  const a = getAgencyBySlug(slug);
  if (!a || !a.isPublic || a.status !== "active") return null;
  return a;
}
