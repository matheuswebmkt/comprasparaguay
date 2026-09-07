// Filepath: lib/i18n/niche-labels.ts
// Version: 1.1
// Nome da Versão: "Rótulos reduzidos ao transfer — nichos de gastronomia saíram do cluster"
//
// `app/data/niches.ts` (SEO/copy completa da página de nicho) permanece só em pt — decisão do
// usuário. Este arquivo cobre SÓ os dois campos curtos (`navLabel`/`breadcrumbLabel`) usados nos
// mini cards do componente compartilhado `NicheClusterLinks` (que aparece em páginas já
// traduzidas). Chave = `Niche.key` (estável).

import type { Locale } from "./config";

export interface NicheLabelI18n {
  navLabel: string;
  breadcrumbLabel: string;
}

export const NICHE_LABELS_I18N: Record<Locale, Record<string, NicheLabelI18n>> = {
  pt: {
    transfer: { navLabel: "Transfer", breadcrumbLabel: "Transfer em Foz do Iguaçu" },
  },
  en: {
    transfer: { navLabel: "Transfer", breadcrumbLabel: "Transfer in Foz do Iguaçu" },
  },
  es: {
    transfer: { navLabel: "Transfer", breadcrumbLabel: "Transfer en Foz do Iguaçu" },
  },
};
