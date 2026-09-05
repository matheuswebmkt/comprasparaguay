// Filepath: lib/i18n/config.ts
// Version: 1.0
// Nome da Versão: "Núcleo de i18n (cookie-based) — locales + detecção (Accept-Language + geo). EDGE-SAFE."
//
// Camada mínima de idioma SEM rota por locale (conventions i18n Fase 1): o middleware SEMEIA um cookie
// `locale` (detecta idioma no 1º acesso) e o LocaleProvider (client) lê esse cookie. Nada aqui importa
// Node/DB → pode rodar no Edge (middleware) e no client. Ver conventions §18.

export const LOCALES = ["pt", "en", "es"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "pt";
export const LOCALE_COOKIE = "locale";
export const LOCALE_MAX_AGE = 60 * 60 * 24 * 365; // 1 ano

export function isLocale(v: unknown): v is Locale {
  return typeof v === "string" && (LOCALES as readonly string[]).includes(v);
}

/** Países hispanofalantes (América Latina + Espanha) → espanhol por padrão. */
const ES_COUNTRIES = new Set([
  "AR", "PY", "UY", "CL", "BO", "PE", "CO", "VE", "EC", "MX",
  "CR", "PA", "GT", "HN", "NI", "SV", "DO", "CU", "ES",
]);
/** Países anglófonos → inglês por padrão. */
const EN_COUNTRIES = new Set(["US", "GB", "CA", "AU", "IE", "NZ", "ZA", "IN", "PH", "SG"]);
/** Países lusófonos → português. */
const PT_COUNTRIES = new Set(["BR", "PT", "AO", "MZ", "CV"]);

/**
 * Deriva o locale a partir do país (geo do Vercel) e do Accept-Language. Prioriza o país (turismo:
 * de onde a pessoa é > preferência do device); cai no Accept-Language; por fim, DEFAULT_LOCALE (pt).
 */
export function detectLocale(acceptLanguage: string | null, country: string | null): Locale {
  const c = (country ?? "").toUpperCase();
  if (PT_COUNTRIES.has(c)) return "pt";
  if (ES_COUNTRIES.has(c)) return "es";
  if (EN_COUNTRIES.has(c)) return "en";

  const al = (acceptLanguage ?? "").toLowerCase();
  if (al.startsWith("pt")) return "pt";
  if (al.startsWith("es")) return "es";
  if (al.startsWith("en")) return "en";

  return DEFAULT_LOCALE;
}

/** Rótulo + bandeira de cada idioma (para o seletor e o cofre de leads). */
export const LOCALE_META: Record<Locale, { label: string; flag: string; short: string }> = {
  pt: { label: "Português", flag: "🇧🇷", short: "PT" },
  en: { label: "English", flag: "🇺🇸", short: "EN" },
  es: { label: "Español", flag: "🇪🇸", short: "ES" },
};
