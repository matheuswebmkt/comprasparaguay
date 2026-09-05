// Filepath: app/admin/dashboard/pagina/page.tsx
// Version: 1.0
// Nome da Versão: "Relatório individual de uma página (inicial / SEO / atrativo) por path"
// Baseado na Versão: N/A

import Link from "next/link";
import { BarChart3, LogOut, Eye, MousePointerClick, Users, Percent, ArrowLeft, ExternalLink } from "lucide-react";
import { getPageData, clampPeriod, pageLabel, countryName, clickRate, ctaTypeLabel } from "@/lib/metrics";
import {
  MetricCard, Panel, BarRow, SeriesChart, Notice, PeriodSelector, fmt, TITLE, MUTED,
} from "@/components/admin/dashboard-ui";
import RefreshButton from "@/components/admin/RefreshButton";

export const dynamic = "force-dynamic";

export default async function PageReport({
  searchParams,
}: {
  searchParams: Promise<{ p?: string; days?: string }>;
}) {
  const sp = await searchParams;
  const path = sp?.p && sp.p.startsWith("/") ? sp.p : "/";
  const days = clampPeriod(sp?.days);
  const label = pageLabel(path);

  const data = await getPageData(path, days);
  const { totals } = data;
  // Taxa de clique = visitantes únicos que clicaram um CTA da página ÷ visitantes únicos da página (máx. 100%).
  const ctr = clickRate(totals.clickers, totals.visitors);
  const hasData = totals.pageviews + totals.clicks > 0;

  const basePath = `/admin/dashboard/pagina?p=${encodeURIComponent(path)}`;

  return (
    <main className="min-h-screen" style={{ background: "hsl(40,33%,97%)" }}>
      <header className="px-6 py-4 flex items-center justify-between" style={{ background: "hsl(210,60%,15%)" }}>
        <Link href={`/admin/dashboard?days=${days}`} className="flex items-center gap-2 text-white text-sm font-semibold hover:opacity-80 transition-opacity">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Voltar ao painel
        </Link>
        <div className="flex items-center gap-2">
          <RefreshButton />
          <form action="/api/auth/logout" method="post">
            <button type="submit" className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-[1.03]" style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)" }}>
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              Sair
            </button>
          </form>
        </div>
      </header>

      <div className="section-container py-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-mono" style={MUTED}>{path}</p>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ ...TITLE, fontFamily: "var(--font-display)" }}>
              {label}
            </h1>
            <Link href={path} target="_blank" className="inline-flex items-center gap-1 text-xs font-semibold mt-1" style={{ color: "hsl(210,56%,35%)" }}>
              Ver página pública <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>
          <PeriodSelector basePath={basePath} current={days} />
        </div>

        {!data.configured ? (
          <Notice icon={<BarChart3 className="h-7 w-7" style={{ color: "hsl(210,56%,23%)" }} />} title="Banco não configurado" text="Defina DATABASE_URL para coletar e exibir métricas." />
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <MetricCard icon={<Eye className="h-5 w-5" />} label="Visualizações da página" value={fmt(totals.pageviews)} accent="hsl(210,56%,23%)" />
              <MetricCard icon={<MousePointerClick className="h-5 w-5" />} label="Cliques nos CTAs" value={fmt(totals.clicks)} accent="hsl(35,82%,47%)" />
              <MetricCard icon={<Users className="h-5 w-5" />} label="Visitantes únicos" value={fmt(totals.visitors)} accent="hsl(152,47%,32%)" />
              <MetricCard icon={<Percent className="h-5 w-5" />} label="Taxa de clique" value={`${ctr.toFixed(1)}%`} accent="hsl(210,56%,23%)" />
            </div>

            {hasData ? (
              <>
                <div className="mb-8"><SeriesChart series={data.series} /></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Panel title="Cliques por tipo de CTA">
                    {data.clicksByType.map((r) => (
                      <BarRow
                        key={r.cta_type}
                        label={ctaTypeLabel(r.cta_type)}
                        value={r.n}
                        max={data.clicksByType[0]?.n ?? 1}
                        color="hsl(35,82%,47%)"
                      />
                    ))}
                  </Panel>
                  <Panel title="Origem do tráfego (utm_source)">
                    {data.utmSources.map((r) => <BarRow key={r.label} label={r.label} value={r.n} max={data.utmSources[0]?.n ?? 1} color="hsl(210,56%,23%)" />)}
                  </Panel>
                  <Panel title="Países">
                    {data.countries.map((r) => <BarRow key={r.label} label={countryName(r.label)} value={r.n} max={data.countries[0]?.n ?? 1} color="hsl(152,47%,32%)" />)}
                  </Panel>
                  <Panel title="Cidades">
                    {data.cities.map((r) => <BarRow key={r.label} label={r.label} value={r.n} max={data.cities[0]?.n ?? 1} color="hsl(152,47%,32%)" />)}
                  </Panel>
                  <Panel title="Dispositivos">
                    {data.devices.map((r) => <BarRow key={r.label} label={r.label} value={r.n} max={data.devices[0]?.n ?? 1} color="hsl(210,56%,35%)" />)}
                  </Panel>
                  <Panel title="Navegadores">
                    {data.browsers.map((r) => <BarRow key={r.label} label={r.label} value={r.n} max={data.browsers[0]?.n ?? 1} color="hsl(210,56%,23%)" />)}
                  </Panel>
                </div>
                <p className="mt-4 text-xs" style={MUTED}>
                  Em <strong>utm_source</strong>, valores <code>interno-*</code> indicam acesso vindo de dentro do site
                  (ex.: <code>interno-foz-alem</code>, <code>interno-navbar</code>); o resto é externo (ig, direto…).
                  Fontes de IA conhecidas (ChatGPT, Perplexity, Copilot…) aparecem como <strong>Tráfego de IA · [nome]</strong>.
                </p>
              </>
            ) : (
              <Notice icon={<BarChart3 className="h-7 w-7" style={{ color: "hsl(210,56%,23%)" }} />} title="Ainda sem dados desta página no período" text="Quando houver visitas ou cliques aqui, os números aparecem. Tente o período 'Tudo'." />
            )}
          </>
        )}
      </div>
    </main>
  );
}
