// Filepath: lib/utm.ts
// Version: 1.0
// Nome da Versão: "Helper de UTM — enriquecimento de saída + captura de entrada"
// Baseado na Versão: N/A

// Padrão de UTM (conventions.md §6).
export const UTM_DEFAULTS = { source: "comprasparaguay", medium: "site" } as const;

export interface UtmParams {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}

/**
 * Anexa UTMs a uma URL de destino. Só atua em URLs http(s);
 * destinos internos/âncoras/tel:/mailto: são retornados sem alteração.
 */
export function buildTrackedUrl(destination: string, utm: UtmParams = {}): string {
  if (!/^https?:\/\//i.test(destination)) return destination;
  try {
    const url = new URL(destination);
    const merged = { ...UTM_DEFAULTS, ...utm };
    if (merged.source) url.searchParams.set("utm_source", merged.source);
    if (merged.medium) url.searchParams.set("utm_medium", merged.medium);
    if (merged.campaign) url.searchParams.set("utm_campaign", merged.campaign);
    if (merged.content) url.searchParams.set("utm_content", merged.content);
    if (merged.term) url.searchParams.set("utm_term", merged.term);
    return url.toString();
  } catch {
    return destination;
  }
}

/**
 * Anexa UTM "oculta" de origem INTERNA a um caminho do próprio site.
 * Ex: internalUrl("/atrativos/cataratas", "foz-alem") →
 *     "/atrativos/cataratas?utm_source=interno-foz-alem&utm_medium=interno"
 * No dashboard, o painel de utm_source separa "interno-*" do tráfego externo (ig, direto).
 * O `canonical` (sem query) de cada página garante que o SEO consolida na URL limpa.
 */
export function internalUrl(path: string, source: string): string {
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}utm_source=interno-${source}&utm_medium=interno`;
}

/** Lê UTMs de entrada (como o visitante chegou) de uma query string. */
export function getInboundUtms(search?: string): UtmParams {
  const raw =
    search ?? (typeof window !== "undefined" ? window.location.search : "");
  const sp = new URLSearchParams(raw);
  const pick = (k: string) => sp.get(k) ?? undefined;
  return {
    source: pick("utm_source"),
    medium: pick("utm_medium"),
    campaign: pick("utm_campaign"),
    content: pick("utm_content"),
    term: pick("utm_term"),
  };
}
