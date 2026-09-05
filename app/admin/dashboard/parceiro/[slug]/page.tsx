// Filepath: app/admin/dashboard/parceiro/[slug]/page.tsx
// Version: 1.4
// Nome da Versão: "Corrige header stale (Sprint 12) — 'Modal de captura' (participação do parceiro) foi removida no Sprint 2"
// Baseado na Versão: 1.3 ("CTR ÷reach + Dispositivos/Navegadores + 'Modal de captura' (participação + 4 CTAs por VISITANTE ÚNICO)")

import { notFound } from "next/navigation";
import Link from "next/link";
import {
  BarChart3, LogOut, Eye, MousePointerClick, Users, Percent, ArrowLeft, ExternalLink, BarChart2, Megaphone, Sparkles,
} from "lucide-react";
import { getPartnerData, clampPeriod, countryName, clickRate } from "@/lib/metrics";
import { getPartnerBySlug, getCategoryMeta } from "@/app/data/partners";
import { getVisiblePartnerSlugsLive } from "@/lib/niche-settings";
import CategoryIcon from "@/components/CategoryIcon";
import PartnerDetailTrigger from "@/components/parceiros/PartnerDetailTrigger";
import {
  MetricCard, Panel, BarRow, SeriesChart, Notice, PeriodSelector, fmt, TITLE,
} from "@/components/admin/dashboard-ui";
import RefreshButton from "@/components/admin/RefreshButton";

export const dynamic = "force-dynamic";

export default async function PartnerReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ days?: string }>;
}) {
  const { slug } = await params;
  const partner = getPartnerBySlug(slug);
  if (!partner) notFound();

  const meta = getCategoryMeta(partner.category);
  const days = clampPeriod((await searchParams)?.days);
  const [data, visibleSet] = await Promise.all([
    getPartnerData(slug, days),
    getVisiblePartnerSlugsLive(),
  ]);
  // Visibilidade global = PLANO vigente (/admin/dashboard/planos), topo da hierarquia. O /nichos é
  // placement: decide em QUAL nicho ele é a recomendação, não se ele aparece (conventions §14).
  const visible = visibleSet.has(slug);
  const { totals } = data;
  // CTR do parceiro = visitantes que clicaram um CTA do parceiro ÷ ALCANCE (quem viu o parceiro). Nunca > 100%.
  const ctr = clickRate(totals.clickers, totals.reach);
  const hasData = totals.pageviews + totals.clicks + totals.impressions > 0;

  const basePath = `/admin/dashboard/parceiro/${slug}`;

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
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-[1.03]"
              style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)" }}
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              Sair
            </button>
          </form>
        </div>
      </header>

      <div className="section-container py-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <span
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-semibold mb-2"
              style={{ color: "hsl(210,56%,28%)", background: "hsl(214,50%,93%)" }}
            >
              <CategoryIcon name={meta.iconName} className="h-3 w-3" />
              {meta.name}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ ...TITLE, fontFamily: "var(--font-display)" }}>
              {partner.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-1.5">
              <PartnerDetailTrigger
                slug={slug}
                className="inline-flex items-center gap-1 text-xs font-semibold"
                style={{ color: "hsl(210,56%,35%)" }}
              >
                Ver detalhe (modal) <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </PartnerDetailTrigger>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                style={
                  visible
                    ? { background: "hsl(152,47%,88%)", color: "hsl(152,47%,20%)", border: "1px solid hsl(152,47%,68%)" }
                    : { background: "hsl(0,72%,93%)", color: "hsl(0,60%,30%)", border: "1px solid hsl(0,72%,75%)" }
                }
                title={visible ? "Plano vigente — aparece em todo o site" : "Sem plano vigente — oculto no site inteiro (/admin/dashboard/planos)"}
              >
                <span className="inline-block w-2 h-2 rounded-full flex-none" style={{ background: visible ? "hsl(152,47%,32%)" : "hsl(0,72%,51%)" }} />
                {visible ? "Visível no site" : "Oculto"}
              </span>
              <Link
                href="/admin/dashboard/planos"
                className="inline-flex items-center gap-1 text-xs font-semibold"
                style={{ color: "hsl(210,56%,35%)" }}
              >
                Gerenciar exibição (Planos) →
              </Link>
            </div>
          </div>
          <PeriodSelector basePath={basePath} current={days} />
        </div>

        {!data.configured ? (
          <Notice
            icon={<BarChart2 className="h-7 w-7" style={{ color: "hsl(210,56%,23%)" }} />}
            title="Banco não configurado"
            text="Defina DATABASE_URL para coletar e exibir métricas."
          />
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <MetricCard icon={<Megaphone className="h-5 w-5" />} label="Alcance · pessoas que viram os cards/seções" value={fmt(totals.reach)} accent="hsl(152,47%,32%)" />
              <MetricCard icon={<Sparkles className="h-5 w-5" />} label="Impressões · visitas que viram" value={fmt(totals.impressions)} accent="hsl(35,82%,47%)" />
              <MetricCard icon={<Eye className="h-5 w-5" />} label="Visualizações da página" value={fmt(totals.pageviews)} accent="hsl(210,56%,23%)" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <MetricCard icon={<MousePointerClick className="h-5 w-5" />} label="Cliques nos CTAs" value={fmt(totals.clicks)} accent="hsl(35,82%,47%)" />
              <MetricCard icon={<Users className="h-5 w-5" />} label="Visitantes únicos (página)" value={fmt(totals.visitors)} accent="hsl(152,47%,32%)" />
              <MetricCard icon={<Percent className="h-5 w-5" />} label="Taxa de clique (dos que viram)" value={`${ctr.toFixed(1)}%`} accent="hsl(210,56%,23%)" />
            </div>

            {hasData ? (
              <>
                <div className="mb-8">
                  <SeriesChart series={data.series} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Panel title="Cliques por tipo de CTA">
                    {data.clicksByType.map((r) => (
                      <BarRow key={r.cta_type} label={r.cta_type} value={r.n} max={data.clicksByType[0]?.n ?? 1} color="hsl(35,82%,47%)" />
                    ))}
                  </Panel>
                  <Panel title="Origem do tráfego (utm_source de entrada)">
                    {data.utmSources.map((r) => (
                      <BarRow key={r.label} label={r.label} value={r.n} max={data.utmSources[0]?.n ?? 1} color="hsl(210,56%,23%)" />
                    ))}
                  </Panel>
                  <Panel title="Países">
                    {data.countries.map((r) => (
                      <BarRow key={r.label} label={countryName(r.label)} value={r.n} max={data.countries[0]?.n ?? 1} color="hsl(152,47%,32%)" />
                    ))}
                  </Panel>
                  <Panel title="Cidades">
                    {data.cities.map((r) => (
                      <BarRow key={r.label} label={r.label} value={r.n} max={data.cities[0]?.n ?? 1} color="hsl(152,47%,32%)" />
                    ))}
                  </Panel>
                  <Panel title="Dispositivos">
                    {data.devices.map((r) => (
                      <BarRow key={r.label} label={r.label} value={r.n} max={data.devices[0]?.n ?? 1} color="hsl(210,56%,35%)" />
                    ))}
                  </Panel>
                  <Panel title="Navegadores">
                    {data.browsers.map((r) => (
                      <BarRow key={r.label} label={r.label} value={r.n} max={data.browsers[0]?.n ?? 1} color="hsl(210,56%,23%)" />
                    ))}
                  </Panel>
                </div>
              </>
            ) : (
              <Notice
                icon={<BarChart3 className="h-7 w-7" style={{ color: "hsl(210,56%,23%)" }} />}
                title="Ainda sem dados deste parceiro no período"
                text="Quando alguém vir os cards/seções, visitar a página ou clicar nos CTAs deste parceiro, os números aparecem aqui. Tente o período 'Tudo'."
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}
