// Filepath: lib/i18n/niche-labels.ts
// Version: 1.0
// Nome da Versão: "Rótulos curtos dos 9 nichos (navLabel/breadcrumbLabel) — usados nos mini cards do NicheClusterLinks"
//
// `app/data/niches.ts` (SEO/copy completa das páginas de nicho) permanece só em pt — decisão do usuário
// de adiar essa frente (grande, exige converter as 9 páginas pro padrão client+dicionário). Este arquivo
// cobre SÓ os dois campos curtos (`navLabel`/`breadcrumbLabel`) usados nos mini cards do componente
// compartilhado `NicheClusterLinks` (que aparece em páginas JÁ traduzidas: home,
// /triplice-fronteira, /o-que-fazer-em-foz, /o-que-fazer-em-foz). Chave = `Niche.key` (estável).

import type { Locale } from "./config";

export interface NicheLabelI18n {
  navLabel: string;
  breadcrumbLabel: string;
}

export const NICHE_LABELS_I18N: Record<Locale, Record<string, NicheLabelI18n>> = {
  pt: {
    "bar-e-cervejaria": { navLabel: "Bar e cervejaria", breadcrumbLabel: "Bar e cervejaria em Foz do Iguaçu" },
    churrascaria: { navLabel: "Churrascaria", breadcrumbLabel: "Churrascaria em Foz do Iguaçu" },
    restaurante: { navLabel: "Restaurante", breadcrumbLabel: "Restaurante em Foz do Iguaçu" },
    pizzaria: { navLabel: "Pizzaria", breadcrumbLabel: "Pizzaria em Foz do Iguaçu" },
    shawarma: { navLabel: "Shawarma", breadcrumbLabel: "Shawarma em Foz do Iguaçu" },
    sushi: { navLabel: "Sushi", breadcrumbLabel: "Sushi em Foz do Iguaçu" },
    hamburgueria: { navLabel: "Hamburgueria", breadcrumbLabel: "Hamburgueria em Foz do Iguaçu" },
    transfer: { navLabel: "Transfer", breadcrumbLabel: "Transfer em Foz do Iguaçu" },
  },
  en: {
    "bar-e-cervejaria": { navLabel: "Bar & Brewery", breadcrumbLabel: "Bar & Brewery in Foz do Iguaçu" },
    churrascaria: { navLabel: "Churrascaria", breadcrumbLabel: "Churrascaria in Foz do Iguaçu" },
    restaurante: { navLabel: "Restaurant", breadcrumbLabel: "Restaurant in Foz do Iguaçu" },
    pizzaria: { navLabel: "Pizzeria", breadcrumbLabel: "Pizzeria in Foz do Iguaçu" },
    shawarma: { navLabel: "Shawarma", breadcrumbLabel: "Shawarma in Foz do Iguaçu" },
    sushi: { navLabel: "Sushi", breadcrumbLabel: "Sushi in Foz do Iguaçu" },
    hamburgueria: { navLabel: "Burger Joint", breadcrumbLabel: "Burger Joint in Foz do Iguaçu" },
    transfer: { navLabel: "Transfer", breadcrumbLabel: "Transfer in Foz do Iguaçu" },
  },
  es: {
    "bar-e-cervejaria": { navLabel: "Bar y cervecería", breadcrumbLabel: "Bar y cervecería en Foz do Iguaçu" },
    churrascaria: { navLabel: "Churrascaria", breadcrumbLabel: "Churrascaria en Foz do Iguaçu" },
    restaurante: { navLabel: "Restaurante", breadcrumbLabel: "Restaurante en Foz do Iguaçu" },
    pizzaria: { navLabel: "Pizzería", breadcrumbLabel: "Pizzería en Foz do Iguaçu" },
    shawarma: { navLabel: "Shawarma", breadcrumbLabel: "Shawarma en Foz do Iguaçu" },
    sushi: { navLabel: "Sushi", breadcrumbLabel: "Sushi en Foz do Iguaçu" },
    hamburgueria: { navLabel: "Hamburguesería", breadcrumbLabel: "Hamburguesería en Foz do Iguaçu" },
    transfer: { navLabel: "Transfer", breadcrumbLabel: "Transfer en Foz do Iguaçu" },
  },
};
