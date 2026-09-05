// Filepath: app/admin/dashboard/page.tsx
// Version: 4.3
// Nome da Versão: "Modal: + transporte no funil + painel de leads capturados (transporte/idioma)"
// Baseado na Versão: 4.2

import Link from "next/link";
import { cookies } from "next/headers";
import {
  BarChart3, LogOut, Eye, MousePointerClick, Users, Percent, Database, Inbox,
  SlidersHorizontal, Building2, Store, Rocket, Send, CalendarClock,
} from "lucide-react";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import {
  getDashboardData,
  getPartnersOverview,
  getPagesOverview,
  getModalFunnel,
  clampPeriod,
  countryName,
  clickRate,
  localeLabel,
  ctaTypeLabel,
  groupCtaClicksByProduct,
} from "@/lib/metrics";
import { officialAgencyName } from "@/app/data/agencies";
import {
  MetricCard, Panel, BarRow, SeriesChart, Notice, PeriodSelector,
  SectionTitle, GroupLabel, OverviewTable, PctRow, fmt, TITLE, MUTED,
} from "@/components/admin/dashboard-ui";
import RefreshButton from "@/components/admin/RefreshButton";

export const dynamic = "force-dynamic";

const BLUE = "hsl(210,56%,35%)";
const GOLD = "hsl(35,82%,47%)";
const GREEN = "hsl(152,47%,32%)";
const NAVY = "hsl(210,56%,23%)";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const secret = process.env.AUTH_SECRET;
  const email = token && secret ? await verifySessionToken(token, secret) : null;

  const days = clampPeriod((await searchParams)?.days);
  const [data, partners, pages, modal] = await Promise.all([
    getDashboardData(days),
    getPartnersOverview(days),
    getPagesOverview(days),
    getModalFunnel(days),
  ]);
  const { totals } = data;
  // Taxa de clique = visitantes únicos que clicaram ÷ visitantes únicos (limitado a 100%).
  const ctr = clickRate(totals.clickers, totals.visitors);
  const hasData = totals.pageviews + totals.clicks > 0;

  return (
    <main className="min-h-screen" style={{ background: "hsl(40,33%,97%)" }}>
      <header className="px-6 py-4 flex items-center justify-between" style={{ background: "hsl(210,60%,15%)" }}>
        <div className="flex items-center gap-2.5 text-white">
          <BarChart3 className="h-5 w-5" style={{ color: "hsl(38,90%,55%)" }} aria-hidden="true" />
          <span className="font-bold text-sm">Painel · Compras Paraguay</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/admin/dashboard/oferta"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-[1.03]"
            style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)" }}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
            Oferta
          </Link>
          <Link
            href={`/admin/dashboard/agencia?days=${days}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-[1.03]"
            style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)" }}
          >
            <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
            Agências
          </Link>
          <Link
            href="/admin/dashboard/planos"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-[1.03]"
            style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)" }}
          >
            <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
            Planos
          </Link>
          <Link
            href="/admin/dashboard/nichos"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-[1.03]"
            style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)" }}
          >
            <Store className="h-3.5 w-3.5" aria-hidden="true" />
            Nichos
          </Link>
          <Link
            href={`/admin/dashboard/leads?days=${days}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-[1.03]"
            style={{ background: "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)" }}
          >
            <Inbox className="h-3.5 w-3.5" aria-hidden="true" />
            Leads
          </Link>
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
            {email && <p className="text-xs" style={MUTED}>{email}</p>}
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ ...TITLE, fontFamily: "var(--font-display)" }}>
              Métricas gerais
            </h1>
          </div>
          <PeriodSelector basePath="/admin/dashboard" current={days} />
        </div>

        {!data.configured ? (
          <Notice icon={<Database className="h-7 w-7" style={{ color: NAVY }} />} title="Banco não configurado" text="Defina DATABASE_URL para coletar e exibir métricas." />
        ) : (
          <>
            {/* Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <MetricCard icon={<Eye className="h-5 w-5" />} label="Visualizações" value={fmt(totals.pageviews)} accent={NAVY} />
              <MetricCard icon={<MousePointerClick className="h-5 w-5" />} label="Cliques em CTA" value={fmt(totals.clicks)} accent={GOLD} />
              <MetricCard icon={<Users className="h-5 w-5" />} label="Visitantes únicos" value={fmt(totals.visitors)} accent={GREEN} />
              <MetricCard icon={<Percent className="h-5 w-5" />} label="Taxa de clique" value={`${ctr.toFixed(1)}%`} accent={NAVY} />
            </div>

            {hasData && (
              <div className="mb-10">
                <SeriesChart series={data.series} />
              </div>
            )}

            {/* Por página */}
            <SectionTitle>Por página</SectionTitle>
            <OverviewTable
              rows={pages.rows.map((p) => ({ key: p.path, label: p.label, views: p.views, clicks: p.clicks, visitors: p.visitors, ctr: p.ctr }))}
              firstColLabel="Página"
              hrefFor={(path) => `/admin/dashboard/pagina?p=${encodeURIComponent(path)}&days=${days}`}
              emptyText="Sem páginas com tráfego neste período."
            />
            <p className="mt-3 mb-2 text-xs" style={MUTED}>Clique em uma página (inicial, SEO ou atrativo) para ver o relatório individual.</p>

            {/* Por parceiro */}
            <div className="mt-10">
              <SectionTitle>Por parceiro</SectionTitle>
              <OverviewTable
                rows={partners.rows.map((p) => ({ key: p.slug, label: p.name, reach: p.reach, views: p.views, clicks: p.clicks, visitors: p.visitors, ctr: p.ctr }))}
                firstColLabel="Parceiro"
                showReach
                hrefFor={(slug) => `/admin/dashboard/parceiro/${slug}?days=${days}`}
                emptyText="Nenhum parceiro cadastrado."
              />
              <p className="mt-3 mb-2 text-xs" style={MUTED}>
                <strong>Alcance</strong> = pessoas que viram os cards/seções do parceiro pelo site (home e demais páginas), mesmo sem abrir a página dele.
              </p>
            </div>

            {/* Conteúdo */}
            <GroupLabel>Conteúdo · produto (ingresso vs roteiro)</GroupLabel>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Panel title="Cliques por produto">
                {(() => {
                  const buckets = groupCtaClicksByProduct(data.clicksByType);
                  const max = buckets[0]?.n ?? 1;
                  return buckets.length ? (
                    buckets.map((r) => (
                      <BarRow key={r.key} label={r.label} value={r.n} max={max} color={r.key === "ingresso" ? GOLD : r.key === "roteiro" ? NAVY : BLUE} />
                    ))
                  ) : (
                    <p className="text-xs" style={MUTED}>Sem cliques no período.</p>
                  );
                })()}
              </Panel>
              <Panel title="Cliques por tipo de CTA">
                {data.clicksByType.map((r) => (
                  <BarRow
                    key={r.cta_type}
                    label={ctaTypeLabel(r.cta_type)}
                    value={r.n}
                    max={data.clicksByType[0]?.n ?? 1}
                    color={GOLD}
                  />
                ))}
              </Panel>
              <Panel title="Cliques por item (slug)">
                {data.clicksByItem.map((r) => (
                  <BarRow key={r.item_slug} label={r.item_slug} value={r.n} max={data.clicksByItem[0]?.n ?? 1} color={GREEN} />
                ))}
              </Panel>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Panel title="Visualizações por página">
                {data.viewsByPath.map((r) => (
                  <BarRow key={r.path} label={r.path} value={r.n} max={data.viewsByPath[0]?.n ?? 1} color={BLUE} />
                ))}
              </Panel>
            </div>

            {/* Aquisição */}
            <GroupLabel>Aquisição · origem de entrada (UTM dos acessos)</GroupLabel>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Panel title="utm_source">
                {data.utmSources.map((r) => <BarRow key={r.label} label={r.label} value={r.n} max={data.utmSources[0]?.n ?? 1} color={NAVY} />)}
              </Panel>
              <Panel title="utm_medium">
                {data.utmMediums.map((r) => <BarRow key={r.label} label={r.label} value={r.n} max={data.utmMediums[0]?.n ?? 1} color={NAVY} />)}
              </Panel>
              <Panel title="utm_content">
                {data.utmContents.map((r) => <BarRow key={r.label} label={r.label} value={r.n} max={data.utmContents[0]?.n ?? 1} color={NAVY} />)}
              </Panel>
            </div>

            {/* Conversão */}
            <GroupLabel>Conversão · campanhas dos cliques de saída (utm_campaign)</GroupLabel>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Panel title="utm_campaign (cliques)">
                {data.utmCampaigns.map((r) => <BarRow key={r.label} label={r.label} value={r.n} max={data.utmCampaigns[0]?.n ?? 1} color={GOLD} />)}
              </Panel>
            </div>

            {/* Audiência */}
            <GroupLabel>Audiência · de onde e como acessam</GroupLabel>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Panel title="Países">
                {data.countries.map((r) => <BarRow key={r.label} label={countryName(r.label)} value={r.n} max={data.countries[0]?.n ?? 1} color={GREEN} />)}
              </Panel>
              <Panel title="Cidades">
                {data.cities.map((r) => <BarRow key={r.label} label={r.label} value={r.n} max={data.cities[0]?.n ?? 1} color={GREEN} />)}
              </Panel>
              <Panel title="Dispositivos">
                {data.devices.map((r) => <BarRow key={r.label} label={r.label} value={r.n} max={data.devices[0]?.n ?? 1} color={BLUE} />)}
              </Panel>
              <Panel title="Navegadores">
                {data.browsers.map((r) => <BarRow key={r.label} label={r.label} value={r.n} max={data.browsers[0]?.n ?? 1} color={NAVY} />)}
              </Panel>
            </div>

            {data.countries.length === 1 && data.countries[0]?.label === "(desconhecido)" && (
              <p className="mt-3 text-xs" style={MUTED}>
                País aparece como (desconhecido) em dev/local; em produção (Vercel) o país real é capturado automaticamente.
              </p>
            )}

            {/* Modal de captura — funil de leads (todas as páginas) */}
            <GroupLabel>Modal de captura · funil de leads</GroupLabel>
            {modal.initiations === 0 ? (
              <Notice icon={<Rocket className="h-7 w-7" style={{ color: NAVY }} />} title="Sem aberturas do modal neste período" text="Quando alguém abrir o modal de oferta, o funil (do 1º clique ao envio) aparece aqui. Tente o período 'Tudo'." />
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <MetricCard icon={<Rocket className="h-5 w-5" />} label="Iniciações do modal" value={fmt(modal.initiations)} accent={NAVY} />
                  <MetricCard icon={<Send className="h-5 w-5" />} label="Leads enviados" value={fmt(modal.submitted)} accent={GREEN} />
                  <MetricCard icon={<Percent className="h-5 w-5" />} label="Conversão do modal" value={`${clickRate(modal.submitted, modal.initiations).toFixed(1)}%`} accent={GOLD} />
                  <MetricCard icon={<MousePointerClick className="h-5 w-5" />} label="Cliques no CTA de sucesso" value={fmt(modal.successCta)} accent={GOLD} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Panel title="Etapas do funil (sobre as iniciações)">
                    <PctRow label="Abriu o modal" value={modal.initiations} total={modal.initiations} color={NAVY} />
                    <PctRow label="Respondeu “morador de Foz?”" value={modal.localYes + modal.localNo} total={modal.initiations} color={BLUE} />
                    <PctRow label="Preencheu o nome" value={modal.filledName} total={modal.initiations} color={BLUE} />
                    <PctRow label="Preencheu o email" value={modal.filledEmail} total={modal.initiations} color={BLUE} />
                    <PctRow label="Preencheu o telefone" value={modal.filledPhone} total={modal.initiations} color={BLUE} />
                    <PctRow label="Marcou “incluir transporte”" value={modal.transportChecked} total={modal.initiations} color={GOLD} />
                    <PctRow label="Enviou (lead)" value={modal.submitted} total={modal.initiations} color={GREEN} />
                    <PctRow label="Chegou no sucesso" value={modal.reachedSuccess} total={modal.initiations} color={GREEN} />
                    <PctRow label="Clicou no CTA de sucesso" value={modal.successCta} total={modal.initiations} color={GOLD} />
                  </Panel>
                  <Panel title="Qualificação dos leads">
                    <PctRow label="Morador de Foz" value={modal.localYes} total={modal.localYes + modal.localNo} color={NAVY} />
                    <PctRow label="Turista" value={modal.localNo} total={modal.localYes + modal.localNo} color={GOLD} />
                    <PctRow label="Turista · já em Foz" value={modal.infozYes} total={modal.infozYes + modal.infozNo} color={GREEN} />
                    <PctRow label="Turista · a caminho" value={modal.infozNo} total={modal.infozYes + modal.infozNo} color={BLUE} />
                  </Panel>
                </div>
                {modal.leads && modal.leads.total > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <Panel title={`Transporte (${officialAgencyName()}) · leads capturados`}>
                      <PctRow label="Pediram transporte" value={modal.leads.wantsTransport} total={modal.leads.total} color={GOLD} />
                    </Panel>
                    <Panel title="Idioma escolhido no modal (leads)">
                      {modal.leads.locales.map((l) => (
                        <PctRow key={l.locale} label={localeLabel(l.locale)} value={l.n} total={modal.leads!.total} color={BLUE} />
                      ))}
                    </Panel>
                  </div>
                )}
                <p className="mt-3 mb-2 text-xs" style={MUTED}>
                  Detalhamento de <strong>onde os leads abandonam</strong> no <a href={`/admin/dashboard/leads?days=${days}`} className="underline" style={{ color: "hsl(210,56%,35%)" }}>Cofre de leads</a>.
                </p>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}
