// Filepath: lib/i18n/entidades.ts
// Version: 1.0
// Nome da Versão: "Dados de negócio de hotéis e agências (name/businessType/tagline/highlights) — en/es"
//
// O `pt` é a matriz e vive em `app/data/hotels.ts` e `app/data/agencies.ts`; aqui só en/es
// (consumidores usam `ENTIDADES_I18N[locale][slug] ?? dado`). Consumidores: card de recomendação
// de nicho (hospedagem/transfer), tela de sucesso pós-submit e demais superfícies que exibem a
// entidade. Chave = slug do dado.

import type { Locale } from "./config";

export interface EntidadeI18n {
  name: string;
  businessType: string;
  tagline: string;
  highlights?: string[];
}

export const ENTIDADES_I18N: Record<Locale, Record<string, EntidadeI18n>> = {
  // pt é a matriz: fallback no dado.
  pt: {},
  en: {
    "hotel-teste": {
      name: "Hotel Test",
      businessType: "Hotel",
      tagline:
        "Example accommodation for validating the official hotel recommendation — replace it with the real partner hotel once the partnership is official.",
      highlights: ["Test hotel", "Downtown", "Flow validation", "Replace with the real one"],
    },
    "foz-falls": {
      name: "Foz Falls",
      businessType: "Tour agency",
      tagline:
        "Specialists in Foz do Iguaçu, Paraguay and Argentina — custom tours and itineraries, transfers and tickets with close-knit service.",
      highlights: ["Private tours", "Transfers", "Custom itineraries", "Tickets", "Triple Frontier"],
    },
    "agencia-teste": {
      name: "Test Agency",
      businessType: "Test agency",
      tagline: "Test agency for validating the lead assignment flow (never shown on the site).",
    },
  },
  es: {
    "hotel-teste": {
      name: "Hotel Test",
      businessType: "Hotel",
      tagline:
        "Hospedaje de ejemplo para validar la recomendación oficial de hoteles — reemplázalo por el hotel socio real cuando la alianza se oficialice.",
      highlights: ["Hotel de prueba", "Centro", "Validación de flujo", "Reemplazar por el real"],
    },
    "foz-falls": {
      name: "Foz Falls",
      businessType: "Agencia de turismo",
      tagline:
        "Especialistas en Foz do Iguaçu, Paraguay y Argentina — viajes e itinerarios personalizados, transfers y entradas con atención cercana.",
      highlights: ["Turismo privado", "Transfers", "Itinerarios personalizados", "Entradas", "Triple Frontera"],
    },
    "agencia-teste": {
      name: "Agencia de prueba",
      businessType: "Agencia de prueba",
      tagline: "Agencia de prueba para validar el flujo de asignación de leads (nunca se muestra en el sitio).",
    },
  },
};
