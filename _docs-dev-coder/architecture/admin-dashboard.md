// Filepath: \_docs-dev-coder/architecture/admin-dashboard.md
// Parte de architecture.md (índice em ../architecture.md)

# ARCHITECTURE · DASHBOARD ADMIN

> Fonte única de verdade para caminhos, módulos e fronteiras.
> Cabeçalhos `###` PRESERVADOS do arquivo original — referências cruzadas continuam válidas.

---

### Dashboard
- `lib/metrics.ts` — `getDashboardData` (geral: totais, série, viewsByPath, cliques por CTA/item,
  utm_source/medium/content/campaign, países, dispositivos, navegadores),
  `getPartnersOverview`/`getPartnerData` (idem por parceiro), `getPagesOverview`/`getPageData`/
  `pageLabel` (relatórios por página; `pageLabel` rotula o cluster: nichos → "Nicho: X", hub →
  "Onde comer em Foz (hub)", detalhe de parceiro → nome), `getLeads` (lista do cofre de leads —
  `LeadRow`/`LeadsData`, `created_at` em BRT, cap 500; colunas incluem `wants_transport` (chip
  "🚐 Transporte" — não há mais coleta de ofertas de parceiro) e `visit_date`/`ticket_qty` (colunas
  Dia/Qtd, D5/D6, já formatadas). Períodos 7/30/90/`all`. **Exclui `/admin%` E `/comercial%`** de toda
  query (pageviews e cliques). Tipo unificado `Row {label,n}`.
- ⭐ **CTR único (`clickRate(clickers, base)`, exportado):** toda "Taxa de clique" =
  **visitantes únicos que clicaram ÷ visitantes únicos, cap 100%** — nunca `cliques ÷ pageviews`.
  Geral/página usam os visitantes do escopo; **parceiro usa `reach`** (quem viu o parceiro), o que
  evita CTR > 100% (numerador = cliques do parceiro em todo o site; denominador teria de ser só
  pageviews da página dele, populações diferentes). `clickers`
  (`count(distinct visitor_id) filter (cta_click)`) está em `DashboardData.totals`,
  `PartnerMetrics.totals` e nas overviews. Ver `conventions/tracking-metricas.md` §6.
- `app/api/track/route.ts` — `/comercial*` não está no `STATIC_PATHS`: pageviews e cliques de
  `/comercial` não são ingeridos (204).
- `components/ticket-offer/TicketOfferButton.tsx` — `track({type:"cta_click", ctaType, itemSlug,
  destination:"#", utm})` no clique que abre o modal — `destination:"#"` de propósito: o clique abre
  o modal, o visitante não vai a lugar nenhum; gravar a URL oficial inflaria "cliques" com aberturas
  de modal que nunca saíram do site. Funil 1st-party do modal em si (abertura → campos → submit) é
  `modal_events`, instrumentado à parte — ver `architecture/leads-modal-telegram.md`, "Funil do modal".
- `components/admin/dashboard-ui.tsx` — MetricCard, Panel, BarRow, SeriesChart, PeriodSelector,
  Notice, SectionTitle, GroupLabel, OverviewTable, `PctRow` (linhas de funil %).
  `components/admin/RefreshButton` (`router.refresh()`).
- Rotas: `/admin/dashboard` (geral + "Por página" + "Por parceiro" + painéis agrupados + "Modal de
  captura · funil de leads"), `/admin/dashboard/parceiro/[slug]` (sem participação no modal — o card
  de oferta de parceiro no modal foi removido; a página mostra só as métricas de tráfego/CTA do
  parceiro), `/admin/dashboard/pagina?p=<path>`, `/admin/dashboard/leads` (+ "Funil do modal · onde os
  leads abandonam" — o detalhamento granular).
- **Geo:** `events.country`/`events.city` capturados no `/api/track` via headers do Vercel.
- `NavigationEvents` não rastreia `/admin` (pageviews internos do dono).
