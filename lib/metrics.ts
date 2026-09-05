// Filepath: lib/metrics.ts
// Version: 2.5
// Nome da Versão: "Remove roteiro_preference do LeadRow/SELECT/leadContextChip (Manter/Personalizar extinto)"
// Baseado na Versão: 2.3

import { getSql } from "./db";
import { activePartners } from "@/app/data/partners";
import { attractions } from "@/app/data/attractions";
import { niches } from "@/app/data/niches";

// ------------------------------------------------------------------ Período
export type Period = 7 | 30 | 90 | "all";

export const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: 7, label: "7 dias" },
  { value: 30, label: "30 dias" },
  { value: 90, label: "90 dias" },
  { value: "all", label: "Tudo" },
];

export function clampPeriod(v: unknown): Period {
  if (v === "all") return "all";
  const n = Number(v);
  return n === 7 || n === 30 || n === 90 ? (n as Period) : 30;
}

function bounds(period: Period): { allTime: boolean; days: number } {
  return period === "all" ? { allTime: true, days: 30 } : { allTime: false, days: period };
}

/**
 * CTR verdadeiro (decisão do usuário jul/2026): visitantes ÚNICOS que clicaram ÷ visitantes únicos,
 * limitado a 100%. Numerador e denominador da MESMA população. Usado em TODA taxa de clique do painel.
 * Parceiro usa `reach` (quem viu o parceiro) como base; página/geral usam os visitantes do escopo.
 */
export const clickRate = (clickers: number, base: number): number =>
  base > 0 ? Math.min(100, (clickers / base) * 100) : 0;

// ------------------------------------------------------------------ Tipos
export type Row = { label: string; n: number };

export interface DashboardData {
  configured: boolean;
  totals: { pageviews: number; clicks: number; visitors: number; clickers: number };
  viewsByPath: { path: string; n: number }[];
  clicksByType: { cta_type: string; n: number }[];
  clicksByItem: { item_slug: string; n: number }[];
  utmSources: Row[];
  utmMediums: Row[];
  utmCampaigns: Row[];
  utmContents: Row[];
  countries: Row[];
  cities: Row[];
  devices: Row[];
  browsers: Row[];
  series: { day: string; pageviews: number; clicks: number }[];
}

export interface PartnerOverviewRow {
  slug: string;
  name: string;
  impressions: number; // vezes que o card/seção foi visto (dedup por sessão)
  reach: number;       // pessoas distintas que viram (count distinct visitor_id)
  views: number;
  clicks: number;
  visitors: number;
  ctr: number;
}

export interface PartnerMetrics {
  configured: boolean;
  totals: { pageviews: number; clicks: number; visitors: number; impressions: number; reach: number; clickers: number };
  series: { day: string; pageviews: number; clicks: number }[];
  clicksByType: { cta_type: string; n: number }[];
  utmSources: Row[];
  countries: Row[];
  cities: Row[];
  devices: Row[];
  browsers: Row[];
}

const EMPTY_DASHBOARD: DashboardData = {
  configured: false,
  totals: { pageviews: 0, clicks: 0, visitors: 0, clickers: 0 },
  viewsByPath: [],
  clicksByType: [],
  clicksByItem: [],
  utmSources: [],
  utmMediums: [],
  utmCampaigns: [],
  utmContents: [],
  countries: [],
  cities: [],
  devices: [],
  browsers: [],
  series: [],
};

// ------------------------------------------------------------------ Geral
export async function getDashboardData(period: Period): Promise<DashboardData> {
  const sql = getSql();
  if (!sql) return EMPTY_DASHBOARD;
  const { allTime, days } = bounds(period);

  // Filtro de período reutilizado: (allTime OR created_at recente). Admin é excluído por path.
  const [totals, viewsByPath, clicksByType, clicksByItem, utmSources, utmMediums, utmCampaigns, utmContents, countries, cities, devices, browsers, series] =
    await Promise.all([
      sql`
        select
          count(*) filter (where type = 'pageview')::int as pageviews,
          count(*) filter (where type = 'cta_click')::int as clicks,
          count(distinct visitor_id)::int as visitors,
          count(distinct visitor_id) filter (where type = 'cta_click')::int as clickers
        from events
        where (path is null or (path not like '/admin%' and path not like '/comercial%'))
          and (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
      `,
      sql`
        select coalesce(path, '(sem path)') as path, count(*)::int as n
        from events
        where type = 'pageview' and (path is null or (path not like '/admin%' and path not like '/comercial%'))
          and (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
        group by path order by n desc limit 12
      `,
      sql`
        select coalesce(cta_type, '(sem tipo)') as cta_type, count(*)::int as n
        from events
        where type = 'cta_click' and (path is null or (path not like '/admin%' and path not like '/comercial%'))
          and (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
        group by cta_type order by n desc
      `,
      sql`
        select coalesce(item_slug, '(sem item)') as item_slug, count(*)::int as n
        from events
        where type = 'cta_click' and (path is null or (path not like '/admin%' and path not like '/comercial%'))
          and (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
        group by item_slug order by n desc limit 12
      `,
      sql`
        select case
          when utm_source is null then '(direto)'
          when lower(utm_source) in ('chatgpt.com', 'chat.openai.com') then 'Tráfego de IA · ChatGPT'
          when lower(utm_source) = 'perplexity.ai' then 'Tráfego de IA · Perplexity'
          when lower(utm_source) = 'copilot.microsoft.com' then 'Tráfego de IA · Copilot'
          when lower(utm_source) in ('gemini.google.com', 'bard.google.com') then 'Tráfego de IA · Gemini'
          when lower(utm_source) = 'claude.ai' then 'Tráfego de IA · Claude'
          when lower(utm_source) = 'poe.com' then 'Tráfego de IA · Poe'
          else utm_source
        end as label, count(*)::int as n
        from events
        where type = 'pageview' and (path is null or (path not like '/admin%' and path not like '/comercial%'))
          and (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
        group by label order by n desc limit 10
      `,
      sql`
        select coalesce(utm_medium, '(direto)') as label, count(*)::int as n
        from events
        where type = 'pageview' and (path is null or (path not like '/admin%' and path not like '/comercial%'))
          and (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
        group by label order by n desc limit 10
      `,
      sql`
        select coalesce(utm_campaign, '(nenhuma)') as label, count(*)::int as n
        from events
        where type = 'cta_click' and (path is null or (path not like '/admin%' and path not like '/comercial%'))
          and (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
        group by label order by n desc limit 10
      `,
      sql`
        select coalesce(utm_content, '(nenhum)') as label, count(*)::int as n
        from events
        where type = 'pageview' and (path is null or (path not like '/admin%' and path not like '/comercial%'))
          and (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
        group by label order by n desc limit 10
      `,
      sql`
        select coalesce(nullif(country, ''), '(desconhecido)') as label, count(*)::int as n
        from events
        where type = 'pageview' and (path is null or (path not like '/admin%' and path not like '/comercial%'))
          and (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
        group by label order by n desc limit 12
      `,
      sql`
        select coalesce(nullif(city, ''), '(desconhecida)') as label, count(*)::int as n
        from events
        where type = 'pageview' and (path is null or (path not like '/admin%' and path not like '/comercial%'))
          and (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
        group by label order by n desc limit 12
      `,
      sql`
        select
          case
            when user_agent ilike '%ipad%' or user_agent ilike '%tablet%' then 'Tablet'
            when user_agent ilike '%mobi%' or user_agent ilike '%android%' or user_agent ilike '%iphone%' then 'Mobile'
            when user_agent is null or user_agent = '' then '(desconhecido)'
            else 'Desktop'
          end as label,
          count(*)::int as n
        from events
        where type = 'pageview' and (path is null or (path not like '/admin%' and path not like '/comercial%'))
          and (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
        group by label order by n desc
      `,
      sql`
        select
          case
            when user_agent ilike '%edg/%' then 'Edge'
            when user_agent ilike '%firefox%' then 'Firefox'
            when user_agent ilike '%chrome%' or user_agent ilike '%crios%' then 'Chrome'
            when user_agent ilike '%safari%' then 'Safari'
            when user_agent is null or user_agent = '' then '(desconhecido)'
            else 'Outro'
          end as label,
          count(*)::int as n
        from events
        where type = 'pageview' and (path is null or (path not like '/admin%' and path not like '/comercial%'))
          and (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
        group by label order by n desc
      `,
      sql`
        select to_char(d::date, 'YYYY-MM-DD') as day,
          coalesce(p.pageviews, 0)::int as pageviews,
          coalesce(p.clicks, 0)::int as clicks
        from generate_series(
          case when ${allTime}::boolean
               then coalesce((select min(created_at)::date from events where path is null or (path not like '/admin%' and path not like '/comercial%')), now()::date)
               else (now() - make_interval(days => ${days}::int))::date end,
          now()::date, interval '1 day'
        ) d
        left join (
          select date_trunc('day', created_at)::date as day,
            count(*) filter (where type = 'pageview') as pageviews,
            count(*) filter (where type = 'cta_click') as clicks
          from events
          where (path is null or (path not like '/admin%' and path not like '/comercial%'))
            and (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
          group by 1
        ) p on p.day = d::date
        order by day
      `,
    ]);

  return {
    configured: true,
    totals: (totals as DashboardData["totals"][])[0] ?? EMPTY_DASHBOARD.totals,
    viewsByPath: viewsByPath as DashboardData["viewsByPath"],
    clicksByType: clicksByType as DashboardData["clicksByType"],
    clicksByItem: clicksByItem as DashboardData["clicksByItem"],
    utmSources: utmSources as Row[],
    utmMediums: utmMediums as Row[],
    utmCampaigns: utmCampaigns as Row[],
    utmContents: utmContents as Row[],
    countries: countries as Row[],
    cities: cities as Row[],
    devices: devices as Row[],
    browsers: browsers as Row[],
    series: series as DashboardData["series"],
  };
}

// ------------------------------------------------------------------ Overview por parceiro
export async function getPartnersOverview(
  period: Period
): Promise<{ configured: boolean; rows: PartnerOverviewRow[] }> {
  const sql = getSql();
  if (!sql) return { configured: false, rows: [] };
  const { allTime, days } = bounds(period);
  // Parceiros vivem aninhados em /<slug>. Casa o pageview pela allowlist de paths reais (com/sem barra final).
  const partnerPaths = activePartners.flatMap((p) => [`/${p.slug}`, `/${p.slug}/`]);

  const [views, clicks, impressions] = await Promise.all([
    sql`
      select substring(path from '^/([^/?#]+)') as slug,
        count(*)::int as views,
        count(distinct visitor_id)::int as visitors
      from events
      where type = 'pageview' and path = any(${partnerPaths}::text[])
        and (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
      group by slug
    `,
    sql`
      select item_slug as slug,
        count(*)::int as clicks,
        count(distinct visitor_id)::int as clickers
      from events
      where type = 'cta_click' and item_slug is not null
        and (path is null or (path not like '/admin%' and path not like '/comercial%'))
        and (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
      group by item_slug
    `,
    // Impressões: quantos viram o card/seção do parceiro (em qualquer página). Dedup por sessão já
    // acontece no client → count(*) ≈ visitas que viram; distinct visitor_id = pessoas (alcance).
    sql`
      select item_slug as slug,
        count(*)::int as impressions,
        count(distinct visitor_id)::int as reach
      from events
      where type = 'impression' and item_slug is not null
        and (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
      group by item_slug
    `,
  ]);

  const vMap = new Map(
    (views as { slug: string; views: number; visitors: number }[]).map((r) => [r.slug, r])
  );
  const cMap = new Map(
    (clicks as { slug: string; clicks: number; clickers: number }[]).map((r) => [r.slug, r])
  );
  const iMap = new Map(
    (impressions as { slug: string; impressions: number; reach: number }[]).map((r) => [r.slug, r])
  );

  const rows: PartnerOverviewRow[] = activePartners
    .map((p) => {
      const v = vMap.get(p.slug);
      const i = iMap.get(p.slug);
      const c = cMap.get(p.slug);
      const views_ = v?.views ?? 0;
      const visitors_ = v?.visitors ?? 0;
      const clicks_ = c?.clicks ?? 0;
      const reach_ = i?.reach ?? 0;
      return {
        slug: p.slug,
        name: p.name,
        impressions: i?.impressions ?? 0,
        reach: reach_,
        views: views_,
        clicks: clicks_,
        visitors: visitors_,
        // CTR do parceiro = visitantes que clicaram um CTA do parceiro ÷ ALCANCE (quem viu o parceiro).
        // Mesma população → nunca passa de 100% (corrige o bug do cliques÷pageviews que dava 200%).
        ctr: clickRate(c?.clickers ?? 0, reach_),
      };
    })
    .sort((a, b) => b.reach - a.reach || b.views - a.views || b.clicks - a.clicks);

  return { configured: true, rows };
}

// ------------------------------------------------------------------ Detalhe por parceiro
export async function getPartnerData(slug: string, period: Period): Promise<PartnerMetrics> {
  const sql = getSql();
  if (!sql) return { configured: false, totals: { pageviews: 0, clicks: 0, visitors: 0, impressions: 0, reach: 0, clickers: 0 }, series: [], clicksByType: [], utmSources: [], countries: [], cities: [], devices: [], browsers: [] };
  const { allTime, days } = bounds(period);
  const pp = `/${slug}`;

  const [totals, series, clicksByType, utmSources, countries, cities, devices, browsers] = await Promise.all([
    sql`
      select
        count(*) filter (where type = 'pageview' and (path = ${pp} or path = ${pp} || '/'))::int as pageviews,
        count(*) filter (where type = 'cta_click' and item_slug = ${slug})::int as clicks,
        count(distinct visitor_id) filter (where type = 'pageview' and (path = ${pp} or path = ${pp} || '/'))::int as visitors,
        count(*) filter (where type = 'impression' and item_slug = ${slug})::int as impressions,
        count(distinct visitor_id) filter (where type = 'impression' and item_slug = ${slug})::int as reach,
        count(distinct visitor_id) filter (where type = 'cta_click' and item_slug = ${slug})::int as clickers
      from events
      where (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
        and (
          (type = 'pageview' and (path = ${pp} or path = ${pp} || '/'))
          or (type = 'cta_click' and item_slug = ${slug})
          or (type = 'impression' and item_slug = ${slug})
        )
    `,
    sql`
      select to_char(d::date, 'YYYY-MM-DD') as day,
        coalesce(p.pageviews, 0)::int as pageviews,
        coalesce(p.clicks, 0)::int as clicks
      from generate_series(
        case when ${allTime}::boolean
             then coalesce((select min(created_at)::date from events
                            where (type = 'pageview' and (path = ${pp} or path = ${pp} || '/'))
                               or (type = 'cta_click' and item_slug = ${slug})), now()::date)
             else (now() - make_interval(days => ${days}::int))::date end,
        now()::date, interval '1 day'
      ) d
      left join (
        select date_trunc('day', created_at)::date as day,
          count(*) filter (where type = 'pageview' and (path = ${pp} or path = ${pp} || '/')) as pageviews,
          count(*) filter (where type = 'cta_click' and item_slug = ${slug}) as clicks
        from events
        where (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
          and (
            (type = 'pageview' and (path = ${pp} or path = ${pp} || '/'))
            or (type = 'cta_click' and item_slug = ${slug})
          )
        group by 1
      ) p on p.day = d::date
      order by day
    `,
    sql`
      select coalesce(cta_type, '(sem tipo)') as cta_type, count(*)::int as n
      from events
      where type = 'cta_click' and item_slug = ${slug}
        and (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
      group by cta_type order by n desc
    `,
    sql`
      select case
        when utm_source is null then '(direto)'
        when lower(utm_source) in ('chatgpt.com', 'chat.openai.com') then 'Tráfego de IA · ChatGPT'
        when lower(utm_source) = 'perplexity.ai' then 'Tráfego de IA · Perplexity'
        when lower(utm_source) = 'copilot.microsoft.com' then 'Tráfego de IA · Copilot'
        when lower(utm_source) in ('gemini.google.com', 'bard.google.com') then 'Tráfego de IA · Gemini'
        when lower(utm_source) = 'claude.ai' then 'Tráfego de IA · Claude'
        when lower(utm_source) = 'poe.com' then 'Tráfego de IA · Poe'
        else utm_source
      end as label, count(*)::int as n
      from events
      where type = 'pageview' and (path = ${pp} or path = ${pp} || '/')
        and (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
      group by label order by n desc limit 10
    `,
    sql`
      select coalesce(nullif(country, ''), '(desconhecido)') as label, count(*)::int as n
      from events
      where type = 'pageview' and (path = ${pp} or path = ${pp} || '/')
        and (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
      group by label order by n desc limit 10
    `,
    sql`
      select coalesce(nullif(city, ''), '(desconhecida)') as label, count(*)::int as n
      from events
      where type = 'pageview' and (path = ${pp} or path = ${pp} || '/')
        and (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
      group by label order by n desc limit 10
    `,
    sql`
      select
        case
          when user_agent ilike '%ipad%' or user_agent ilike '%tablet%' then 'Tablet'
          when user_agent ilike '%mobi%' or user_agent ilike '%android%' or user_agent ilike '%iphone%' then 'Mobile'
          when user_agent is null or user_agent = '' then '(desconhecido)'
          else 'Desktop'
        end as label,
        count(*)::int as n
      from events
      where type = 'pageview' and (path = ${pp} or path = ${pp} || '/')
        and (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
      group by label order by n desc
    `,
    sql`
      select
        case
          when user_agent ilike '%edg/%' then 'Edge'
          when user_agent ilike '%firefox%' then 'Firefox'
          when user_agent ilike '%chrome%' or user_agent ilike '%crios%' then 'Chrome'
          when user_agent ilike '%safari%' then 'Safari'
          when user_agent is null or user_agent = '' then '(desconhecido)'
          else 'Outro'
        end as label,
        count(*)::int as n
      from events
      where type = 'pageview' and (path = ${pp} or path = ${pp} || '/')
        and (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
      group by label order by n desc
    `,
  ]);

  return {
    configured: true,
    totals: (totals as PartnerMetrics["totals"][])[0] ?? { pageviews: 0, clicks: 0, visitors: 0, impressions: 0, reach: 0, clickers: 0 },
    series: series as PartnerMetrics["series"],
    clicksByType: clicksByType as PartnerMetrics["clicksByType"],
    utmSources: utmSources as Row[],
    countries: countries as Row[],
    cities: cities as Row[],
    devices: devices as Row[],
    browsers: browsers as Row[],
  };
}

// ------------------------------------------------------------------ Páginas (não-parceiro)
export interface PageOverviewRow {
  path: string;
  label: string;
  views: number;
  clicks: number;
  visitors: number;
  ctr: number;
}

/** Rótulo amigável de uma página a partir do path. */
export function pageLabel(path: string): string {
  const clean = (path || "").replace(/\/$/, "") || "/";
  const STATIC: Record<string, string> = {
    "/": "Início (home)",
    "/atrativos": "Atrativos (hub + ingressos)",
    "/o-que-fazer": "O que fazer em Foz (SEO)",
    "/transfer": "Transfer",
    "/triplice-fronteira": "Tríplice Fronteira",
    // ⚠️ Rotas antigas — rotas removidas/renomeadas (jul/2026), mantidas só pra rotular pageviews
    // HISTÓRICOS gravados antes da mudança (ver architecture/rotas.md). Não usar como link.
    "/o-que-fazer-em-foz": "O que fazer em Foz (SEO) [rota antiga]",
    "/onde-comer-em-foz": "Onde comer em Foz [rota antiga]",
    "/hospedagem-em-foz-do-iguacu": "Hospedagem em Foz [rota antiga]",
    "/roteiro-de-1-dia-em-foz-do-iguacu": "SEO · Roteiro de 1 dia [rota antiga]",
    "/roteiro-de-2-dias-em-foz-do-iguacu": "SEO · Roteiro de 2 dias [rota antiga]",
    "/roteiro-de-3-dias-em-foz-do-iguacu": "SEO · Roteiro de 3 dias [rota antiga]",
    "/agencia-de-turismo-em-foz-do-iguacu": "Agência de turismo [rota antiga]",
    "/aviso-legal": "Aviso Legal",
    "/sobre": "Sobre",
    "/contato": "Contato",
  };
  if (STATIC[clean]) return STATIC[clean];

  const attraction = clean.match(/^\/atrativos\/(.+)$/);
  if (attraction) {
    const a = attractions.find((x) => x.slug === attraction[1]);
    return a ? `Ingresso · ${a.name}` : `Atrativo: ${attraction[1]}`;
  }

  const roteiro = clean.match(/^\/roteiros\/(.+)$/);
  if (roteiro && roteiro[1] !== "personalizar" && roteiro[1] !== "salvos") {
    return `Plano · ${roteiro[1]}`;
  }

  // Raiz: nichos ou parceiros
  const root = clean.match(/^\/([^/?#]+)$/);
  if (root) {
    const slug = root[1];
    const n = niches.find((x) => x.slug === slug);
    if (n) return `Nicho: ${n.navLabel}`;
    const p = activePartners.find((x) => x.slug === slug);
    if (p) return p.name;
  }
  return path || "(sem path)";
}

/** Rótulo amigável de cta_type (métricas / funil). */
export function ctaTypeLabel(cta: string): string {
  const t = (cta || "").trim();
  const MAP: Record<string, string> = {
    atrativo: "Ingresso · atrativo",
    atrativo_ingresso: "Ingresso · comprar",
    atrativo_endereco: "Atrativo · endereço (legado)",
    atrativo_roteiros: "Atrativo · CTA roteiros",
    roteiro_cta: "Roteiro · quero esse plano",
    roteiro_montar: "Roteiro · montar (wizard)",
    roteiro_personalizar: "Roteiro · personalizar",
    roteiro_especialista: "Roteiro · especialista 4–7d",
    atrativos_index_roteiros: "Hub atrativos · CTA",
    detail_open: "Ver mais detalhes · abertura",
  };
  if (MAP[t]) return MAP[t];
  if (t.startsWith("roteiro_")) return `Roteiro · ${t.replace(/^roteiro_/, "")}`;
  if (t.startsWith("atrativo")) return `Atrativo · ${t}`;
  if (t.startsWith("niche") || t.startsWith("nicho")) return `Nicho · ${t}`;
  return t || "(sem tipo)";
}

/** Agrupa cliques de CTA em buckets de produto (ingresso vs roteiro vs resto). */
export function groupCtaClicksByProduct(
  clicksByType: { cta_type: string; n: number }[],
): { key: string; label: string; n: number }[] {
  let ingresso = 0;
  let roteiro = 0;
  let outros = 0;
  for (const r of clicksByType) {
    const t = r.cta_type || "";
    if (
      t === "atrativo" ||
      t === "atrativo_ingresso" ||
      (t.startsWith("atrativo") && !t.includes("endereco") && !t.includes("roteiros"))
    ) {
      ingresso += r.n;
    } else if (t.startsWith("roteiro") || t.includes("personalizar")) {
      roteiro += r.n;
    } else {
      outros += r.n;
    }
  }
  return [
    { key: "ingresso", label: "Ingressos (atrativos)", n: ingresso },
    { key: "roteiro", label: "Roteiros / personalizar", n: roteiro },
    { key: "outros", label: "Outros CTAs", n: outros },
  ].filter((x) => x.n > 0);
}

/** Rótulo amigável do idioma escolhido no modal (locale salvo em leads.locale). */
export function localeLabel(code: string): string {
  const M: Record<string, string> = { pt: "Português", en: "Inglês", es: "Espanhol" };
  return M[code] ?? code;
}

// Converte código ISO de país (BR, PY, US…) em nome em pt-BR. NÃO altera o dado salvo (só exibição).
let _regionNames: Intl.DisplayNames | null = null;
export function countryName(code: string): string {
  if (!code || code.length !== 2) return code; // "(desconhecido)" etc. passa direto
  try {
    _regionNames ??= new Intl.DisplayNames(["pt-BR"], { type: "region" });
    return _regionNames.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

/** Overview por página (exclui admin e parceiros — esses têm seção própria). */
export async function getPagesOverview(
  period: Period
): Promise<{ configured: boolean; rows: PageOverviewRow[] }> {
  const sql = getSql();
  if (!sql) return { configured: false, rows: [] };
  const { allTime, days } = bounds(period);
  // Exclui as páginas de parceiro (têm seção própria) — aninhadas em /<slug> (com/sem barra).
  const partnerPaths = activePartners.flatMap((p) => [`/${p.slug}`, `/${p.slug}/`]);

  const rows = (await sql`
    select coalesce(path, '(sem path)') as path,
      count(*) filter (where type = 'pageview')::int as views,
      count(*) filter (where type = 'cta_click')::int as clicks,
      count(distinct visitor_id) filter (where type = 'pageview')::int as visitors,
      count(distinct visitor_id) filter (where type = 'cta_click')::int as clickers
    from events
    where (path is null or (path not like '/admin%' and path not like '/comercial%' and path <> all(${partnerPaths}::text[])))
      and (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
    group by path
    order by views desc, clicks desc
  `) as { path: string; views: number; clicks: number; visitors: number; clickers: number }[];

  return {
    configured: true,
    rows: rows.map((r) => ({
      path: r.path,
      label: pageLabel(r.path),
      views: r.views,
      clicks: r.clicks,
      visitors: r.visitors,
      // CTR = visitantes que clicaram um CTA da página ÷ visitantes únicos da página (limitado a 100%).
      ctr: clickRate(r.clickers, r.visitors),
    })),
  };
}

/** Relatório individual de uma página (por path). */
export async function getPageData(path: string, period: Period): Promise<PartnerMetrics> {
  const sql = getSql();
  if (!sql) return { configured: false, totals: { pageviews: 0, clicks: 0, visitors: 0, impressions: 0, reach: 0, clickers: 0 }, series: [], clicksByType: [], utmSources: [], countries: [], cities: [], devices: [], browsers: [] };
  const { allTime, days } = bounds(period);

  const [totals, series, clicksByType, utmSources, countries, cities, devices, browsers] = await Promise.all([
    sql`
      select
        count(*) filter (where type = 'pageview' and (path = ${path} or path = ${path} || '/'))::int as pageviews,
        count(*) filter (where type = 'cta_click' and (path = ${path} or path = ${path} || '/'))::int as clicks,
        count(distinct visitor_id) filter (where type = 'pageview' and (path = ${path} or path = ${path} || '/'))::int as visitors,
        count(distinct visitor_id) filter (where type = 'cta_click' and (path = ${path} or path = ${path} || '/'))::int as clickers
      from events
      where (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
        and (path = ${path} or path = ${path} || '/')
    `,
    sql`
      select to_char(d::date, 'YYYY-MM-DD') as day,
        coalesce(p.pageviews, 0)::int as pageviews,
        coalesce(p.clicks, 0)::int as clicks
      from generate_series(
        case when ${allTime}::boolean
             then coalesce((select min(created_at)::date from events where path = ${path} or path = ${path} || '/'), now()::date)
             else (now() - make_interval(days => ${days}::int))::date end,
        now()::date, interval '1 day'
      ) d
      left join (
        select date_trunc('day', created_at)::date as day,
          count(*) filter (where type = 'pageview') as pageviews,
          count(*) filter (where type = 'cta_click') as clicks
        from events
        where (path = ${path} or path = ${path} || '/')
          and (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
        group by 1
      ) p on p.day = d::date
      order by day
    `,
    sql`
      select coalesce(cta_type, '(sem tipo)') as cta_type, count(*)::int as n
      from events
      where type = 'cta_click' and (path = ${path} or path = ${path} || '/')
        and (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
      group by cta_type order by n desc
    `,
    sql`
      select case
        when utm_source is null then '(direto)'
        when lower(utm_source) in ('chatgpt.com', 'chat.openai.com') then 'Tráfego de IA · ChatGPT'
        when lower(utm_source) = 'perplexity.ai' then 'Tráfego de IA · Perplexity'
        when lower(utm_source) = 'copilot.microsoft.com' then 'Tráfego de IA · Copilot'
        when lower(utm_source) in ('gemini.google.com', 'bard.google.com') then 'Tráfego de IA · Gemini'
        when lower(utm_source) = 'claude.ai' then 'Tráfego de IA · Claude'
        when lower(utm_source) = 'poe.com' then 'Tráfego de IA · Poe'
        else utm_source
      end as label, count(*)::int as n
      from events
      where type = 'pageview' and (path = ${path} or path = ${path} || '/')
        and (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
      group by label order by n desc limit 10
    `,
    sql`
      select coalesce(nullif(country, ''), '(desconhecido)') as label, count(*)::int as n
      from events
      where type = 'pageview' and (path = ${path} or path = ${path} || '/')
        and (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
      group by label order by n desc limit 10
    `,
    sql`
      select coalesce(nullif(city, ''), '(desconhecida)') as label, count(*)::int as n
      from events
      where type = 'pageview' and (path = ${path} or path = ${path} || '/')
        and (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
      group by label order by n desc limit 10
    `,
    sql`
      select
        case
          when user_agent ilike '%ipad%' or user_agent ilike '%tablet%' then 'Tablet'
          when user_agent ilike '%mobi%' or user_agent ilike '%android%' or user_agent ilike '%iphone%' then 'Mobile'
          when user_agent is null or user_agent = '' then '(desconhecido)'
          else 'Desktop'
        end as label,
        count(*)::int as n
      from events
      where type = 'pageview' and (path = ${path} or path = ${path} || '/')
        and (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
      group by label order by n desc
    `,
    sql`
      select
        case
          when user_agent ilike '%edg/%' then 'Edge'
          when user_agent ilike '%firefox%' then 'Firefox'
          when user_agent ilike '%chrome%' or user_agent ilike '%crios%' then 'Chrome'
          when user_agent ilike '%safari%' then 'Safari'
          when user_agent is null or user_agent = '' then '(desconhecido)'
          else 'Outro'
        end as label,
        count(*)::int as n
      from events
      where type = 'pageview' and (path = ${path} or path = ${path} || '/')
        and (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
      group by label order by n desc
    `,
  ]);

  const t = (totals as { pageviews: number; clicks: number; visitors: number; clickers: number }[])[0];
  return {
    configured: true,
    // Páginas não têm impressão de parceiro — só o card/seção tem. Mantém 0 p/ satisfazer o tipo.
    totals: { pageviews: t?.pageviews ?? 0, clicks: t?.clicks ?? 0, visitors: t?.visitors ?? 0, impressions: 0, reach: 0, clickers: t?.clickers ?? 0 },
    series: series as PartnerMetrics["series"],
    clicksByType: clicksByType as PartnerMetrics["clicksByType"],
    utmSources: utmSources as Row[],
    countries: countries as Row[],
    cities: cities as Row[],
    devices: devices as Row[],
    browsers: browsers as Row[],
  };
}

// ------------------------------------------------------------------ Leads (cofre)
export interface LeadRow {
  id: number;
  nome: string | null;
  email: string | null;
  whatsapp: string;
  cta_type: string | null;
  assigned_partner: string | null;
  lgpd_consent: boolean | null;
  page_path: string | null;
  session_id: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  country: string | null;
  city: string | null;
  claimed_by: string | null; // vendedor que assumiu o lead no Telegram (null = ainda livre)
  is_local: boolean | null;        // morador de Foz? (qualificação)
  already_in_foz: boolean | null;  // já está em Foz? (null quando morador)
  wants_transport: boolean | null;  // pediu transporte (cross-sell da agência oficial)?
  locale: string | null;            // idioma escolhido no modal (pt|en|es)
  /** atrativo | roteiro | ingresso | … */
  lead_context: string | null;
  roteiro_slug: string | null;
  roteiro_titulo: string | null;
  roteiro_resumo: string | null;
  roteiro_dias: string | null;       // wizard /montar-roteiro (MR-9)
  roteiro_pessoas: string | null;
  roteiro_orcamento: string | null;
  roteiro_perfil: string | null;     // csv: criancas,idosos,pne
  roteiro_gastro: string | null;     // sim|depois
  roteiro_hotel: string | null;      // sim|tenho|depois
  roteiro_transfer: string | null;   // sim|nao|depois
  visit_date: string | null;  // dia da visita/início escolhido no calendário (D5/D6) — já formatado DD/MM/YYYY
  ticket_qty: number | null;  // quantidade de ingressos (só atrativo)
  cta_shown: boolean;   // o CTA final (link direto) foi EXIBIDO no sucesso? (cruza modal_id ↔ modal_events)
  cta_clicked: boolean; // o lead CLICOU no CTA final do sucesso?
  created_at: string; // já formatado em horário de Brasília (DD/MM/YY HH24:MI)
}

export interface LeadsData {
  configured: boolean;
  total: number;
  rows: LeadRow[];
}

/**
 * Lista os leads capturados no período (mais recentes primeiro) — visão em tempo real do admin.
 * `created_at` volta já formatado em America/Sao_Paulo para exibição direta.
 */
export async function getLeads(
  period: Period,
  limit = 200,
  agency?: string | null,
  profile?: "local" | "tourist" | null,
): Promise<LeadsData> {
  const sql = getSql();
  if (!sql) return { configured: false, total: 0, rows: [] };
  const { allTime, days } = bounds(period);
  const cap = Math.min(Math.max(Math.trunc(limit), 1), 500);
  const ag = agency && agency.trim() ? agency.trim() : null; // null = todas as agências
  const prof = profile === "local" || profile === "tourist" ? profile : null; // null = todos

  const [countRows, rows] = await Promise.all([
    sql`
      select count(*)::int as n
      from leads
      where abandoned = false
        and (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
        and (${ag}::text is null or assigned_partner = ${ag})
        and (${prof}::text is null or (${prof} = 'local' and is_local is true) or (${prof} = 'tourist' and is_local is false))
    `,
    sql`
      select id, nome, email, whatsapp, cta_type, assigned_partner, lgpd_consent,
             page_path, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term,
             country, city, claimed_by, is_local, already_in_foz, wants_transport, locale,
             lead_context, roteiro_slug, roteiro_titulo, roteiro_resumo,
             roteiro_dias, roteiro_pessoas, roteiro_orcamento, roteiro_perfil, roteiro_gastro, roteiro_hotel, roteiro_transfer,
             to_char(visit_date, 'DD/MM/YYYY') as visit_date, ticket_qty,
             coalesce(cta_shown, false)   as cta_shown,
             coalesce(cta_clicked, false) as cta_clicked,
             to_char(created_at at time zone 'America/Sao_Paulo', 'DD/MM/YY HH24:MI') as created_at
      from leads
      where abandoned = false
        and (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
        and (${ag}::text is null or assigned_partner = ${ag})
        and (${prof}::text is null or (${prof} = 'local' and is_local is true) or (${prof} = 'tourist' and is_local is false))
      order by created_at desc
      limit ${cap}
    `,
  ]);

  return {
    configured: true,
    total: (countRows as { n: number }[])[0]?.n ?? 0,
    rows: rows as LeadRow[],
  };
}

/** Chip de contexto do lead (ingresso / roteiro / …) para o painel. */
export function leadContextChip(l: Pick<LeadRow, "lead_context" | "cta_type">): {
  label: string;
  color: string;
  bg: string;
} {
  const ctx = (l.lead_context || "").toLowerCase();
  const cta = (l.cta_type || "").toLowerCase();
  if (ctx === "atrativo" || cta.includes("atrativo") || cta.includes("ingresso")) {
    return { label: "Ingresso", color: "hsl(35,82%,28%)", bg: "hsl(38,85%,92%)" };
  }
  if (cta.includes("personalizar")) {
    return { label: "Personalizar", color: "hsl(152,47%,28%)", bg: "hsl(152,40%,93%)" };
  }
  if (ctx === "roteiro" || cta.startsWith("roteiro")) {
    return { label: "Roteiro", color: "hsl(210,56%,28%)", bg: "hsl(214,50%,94%)" };
  }
  if (ctx === "ingresso") {
    return { label: "Ingresso", color: "hsl(35,82%,28%)", bg: "hsl(38,85%,92%)" };
  }
  return { label: ctx || cta || "Lead", color: "hsl(210,25%,40%)", bg: "hsl(214,30%,94%)" };
}

/** Contagem de leads por agência (slug → nº) no período. Alimenta a página /agencia. */
export async function getLeadCountsByAgency(period: Period): Promise<Record<string, number>> {
  const sql = getSql();
  if (!sql) return {};
  const { allTime, days } = bounds(period);
  try {
    const rows = (await sql`
      select coalesce(assigned_partner, '—') as slug, count(*)::int as n
      from leads
      where abandoned = false
        and (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
      group by assigned_partner
    `) as { slug: string; n: number }[];
    const out: Record<string, number> = {};
    for (const r of rows) out[r.slug] = r.n;
    return out;
  } catch {
    return {};
  }
}

// ------------------------------------------------------------------ Funil do modal (modal_events)
/**
 * Métricas do funil do TicketOfferModal (tabela `modal_events`, 1 linha por passo × abertura).
 * Abandono = abertura com `open` mas sem `submit`. Ver conventions §17.
 */
export interface ModalFunnel {
  configured: boolean;
  initiations: number;      // aberturas do modal
  localYes: number;         // respondeu "morador de Foz? Sim"
  localNo: number;          // ... "Não"
  infozYes: number;         // respondeu "já está em Foz? Sim"
  infozNo: number;          // ... "Não"
  filledName: number;
  filledEmail: number;
  filledPhone: number;
  transportChecked: number; // marcou "Incluir transporte" (cross-sell da agência oficial) — nível de abertura
  submitted: number;        // enviou o formulário (lead)
  reachedSuccess: number;   // chegou na tela de sucesso
  successCta: number;       // clicou no CTA da tela de sucesso
  // Abandono (open sem submit):
  abandoned: number;
  abOnlyOpen: number;         // abriu e não fez nada
  abAtQualification: number;  // respondeu morador, mas não preencheu campo
  abOnlyName: number;         // só o nome
  abNameEmail: number;        // nome + email (sem telefone)
  abWithPhone: number;        // preencheu o telefone mas não enviou
  abOfferOnly: number;        // só marcou oferta(s), sem preencher
  abAtSuccess: number;        // chegou no sucesso (havia CTA) e não clicou
  // Breakdown dos LEADS capturados (novos campos da tabela leads).
  leads?: {
    total: number;
    wantsTransport: number;                      // leads que pediram transporte (wants_transport = true)
    locales: { locale: string; n: number }[];    // idioma escolhido no modal (pt/en/es/(não informado))
  };
}

export async function getModalFunnel(period: Period): Promise<ModalFunnel> {
  const EMPTY: ModalFunnel = {
    configured: false, initiations: 0, localYes: 0, localNo: 0, infozYes: 0, infozNo: 0,
    filledName: 0, filledEmail: 0, filledPhone: 0, transportChecked: 0, submitted: 0, reachedSuccess: 0, successCta: 0,
    abandoned: 0, abOnlyOpen: 0, abAtQualification: 0, abOnlyName: 0, abNameEmail: 0, abWithPhone: 0,
    abOfferOnly: 0, abAtSuccess: 0,
  };
  const sql = getSql();
  if (!sql) return EMPTY;
  const { allTime, days } = bounds(period);

  try {
    // Funil geral — CONSOLIDADO (jul/2026 — ver conventions §17): derivado de
    // `leads` (submit real + rascunho de abandono, F2/F3) em vez do antigo passo-a-passo em `modal_events`.
    // Só "open" continua vindo de `modal_events` — é o único sinal que não dá pra tirar de `leads` sem colidir
    // com o rate limit de anti-abuso do rascunho (ver /api/leads/draft).
    const [openRows, leadRows] = await Promise.all([
      sql`
        select count(*)::int as n from modal_events
        where step = 'open' and (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
      `,
      sql`
        select
          count(*) filter (where is_local = true)::int        as local_yes,
          count(*) filter (where is_local = false)::int       as local_no,
          count(*) filter (where already_in_foz = true)::int  as infoz_yes,
          count(*) filter (where already_in_foz = false)::int as infoz_no,
          count(*) filter (where nome is not null and length(btrim(nome)) > 0)::int as filled_name,
          count(*) filter (where email is not null and length(btrim(email)) > 0)::int as filled_email,
          count(*) filter (where whatsapp is not null and length(btrim(whatsapp)) > 0)::int as filled_phone,
          count(*) filter (where wants_transport is true)::int as transport_checked,
          count(*) filter (where not abandoned)::int as submitted,
          count(*) filter (where not abandoned and cta_clicked is true)::int as success_cta,
          count(*) filter (where abandoned)::int as abandoned,
          count(*) filter (where abandoned and is_local is not null
              and (nome is null or length(btrim(nome)) = 0)
              and (email is null or length(btrim(email)) = 0)
              and (whatsapp is null or length(btrim(whatsapp)) = 0))::int as ab_at_qualification,
          count(*) filter (where abandoned
              and nome is not null and length(btrim(nome)) > 0
              and (email is null or length(btrim(email)) = 0)
              and (whatsapp is null or length(btrim(whatsapp)) = 0))::int as ab_only_name,
          count(*) filter (where abandoned
              and nome is not null and length(btrim(nome)) > 0
              and email is not null and length(btrim(email)) > 0
              and (whatsapp is null or length(btrim(whatsapp)) = 0))::int as ab_name_email,
          count(*) filter (where abandoned and whatsapp is not null and length(btrim(whatsapp)) > 0)::int as ab_with_phone,
          count(*) filter (where not abandoned and cta_shown is true and cta_clicked is not true)::int as ab_at_success
        from leads
        where (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
      `,
    ]);
    const o = (openRows as { n: number }[])[0];
    const l = (leadRows as Record<string, number>[])[0] ?? {};
    const general = {
      initiations: o?.n ?? 0,
      localYes: l.local_yes ?? 0,
      localNo: l.local_no ?? 0,
      infozYes: l.infoz_yes ?? 0,
      infozNo: l.infoz_no ?? 0,
      filledName: l.filled_name ?? 0,
      filledEmail: l.filled_email ?? 0,
      filledPhone: l.filled_phone ?? 0,
      transportChecked: l.transport_checked ?? 0,
      submitted: l.submitted ?? 0,
      successCta: l.success_cta ?? 0,
      abandoned: l.abandoned ?? 0,
      abAtQualification: l.ab_at_qualification ?? 0,
      abOnlyName: l.ab_only_name ?? 0,
      abNameEmail: l.ab_name_email ?? 0,
      abWithPhone: l.ab_with_phone ?? 0,
      abAtSuccess: l.ab_at_success ?? 0,
    };
    // "Abriu e não fez nada" sacrificado de propósito (herdado — ver conventions §17): aproxima por
    // aritmética (aberturas − submits − abandonos com sinal) em vez de um evento dedicado.
    const abOnlyOpen = Math.max(0, general.initiations - general.submitted - general.abandoned);

    // Breakdown dos LEADS capturados (novos campos: wants_transport, locale).
    // try/catch próprio: uma falha aqui NÃO zera o funil todo.
    let leads: ModalFunnel["leads"] | undefined;
    try {
      const [totRows, locRows] = await Promise.all([
        sql`
          select count(*)::int as total,
                 count(*) filter (where wants_transport is true)::int as wants_transport
          from leads
          where (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
        `,
        sql`
          select coalesce(nullif(locale, ''), '(não informado)') as locale, count(*)::int as n
          from leads
          where (${allTime}::boolean or created_at > now() - make_interval(days => ${days}::int))
          group by locale order by n desc
        `,
      ]);
      const t = (totRows as { total: number; wants_transport: number }[])[0];
      leads = {
        total: t?.total ?? 0,
        wantsTransport: t?.wants_transport ?? 0,
        locales: locRows as { locale: string; n: number }[],
      };
    } catch {
      leads = undefined;
    }

    return {
      configured: true,
      initiations: general.initiations,
      localYes: general.localYes,
      localNo: general.localNo,
      infozYes: general.infozYes,
      infozNo: general.infozNo,
      filledName: general.filledName,
      filledEmail: general.filledEmail,
      filledPhone: general.filledPhone,
      transportChecked: general.transportChecked,
      submitted: general.submitted,
      // Sucesso = mesmo instante do submit bem-sucedido (nosso v9.0 redireciona direto pro sucesso — não há
      // mais um passo "success" granular separado no modal pro usuário real, ver conventions §17).
      reachedSuccess: general.submitted,
      successCta: general.successCta,
      abandoned: general.abandoned,
      abOnlyOpen,
      abAtQualification: general.abAtQualification,
      abOnlyName: general.abOnlyName,
      abNameEmail: general.abNameEmail,
      abWithPhone: general.abWithPhone,
      // Estruturalmente impossível hoje: parceiros não aparecem mais no modal (ver LeadSuccessScreen) —
      // não dá pra "marcar oferta sem preencher contato" (herdado do modelo consolidado do doador).
      abOfferOnly: 0,
      abAtSuccess: general.abAtSuccess,
      leads,
    };
  } catch {
    return EMPTY;
  }
}
