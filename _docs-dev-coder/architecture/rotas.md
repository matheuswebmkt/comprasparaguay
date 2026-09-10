// Filepath: _docs-dev-coder/architecture/rotas.md
// Version: 1.0
// Nome da Versão: "Snapshot das rotas vivas do Compras Paraguay — públicas, admin, API e as que saíram"

# ROTAS E SUPERFÍCIES EXPOSTAS

Fonte de verdade das rotas. Conferir contra `pnpm build` (o manifest do build lista tudo) antes de
concluir qualquer mudança de estrutura.

## 1 · Público (canônicas)

| Rota | Geração | Função | Sitemap | Metadados |
|---|---|---|---|---|
| `/` | estática | Home do eixo de compras — a intenção primária do domínio | sim (prio 1) | title/template em `app/layout.tsx` |
| `/roteiros-de-compras` | estática (revalidate 60) | hub de destinos de compra | sim (0.98) | — |
| `/roteiros-de-compras/[slug]` | SSG, 5 slugs de `app/data/attractions.ts` | página do destino — única superfície com `ViewContent` de item | sim (0.82/0.9 featured) | `lastModified` só onde a data é real |
| `/transfer` | estática (revalidate 60) | vertical de transporte; renderiza `NichePageTemplate` com `getNiche("transfer")` | sim (0.88) | `buildNicheMetadata` |
| `/triplice-fronteira` | estática | BR / AR / PY | sim (0.93) | — |
| `/sobre` · `/contato` · `/aviso-legal` | estáticas | institucionais | sim (0.3–0.4) | — |
| `/obrigado` | estática | confirmação pós-envio — só título + confirmação + link "Ver resumo" para `/r/<token>` (do handoff); sem card de resumo | **não** | `noindex` |
| `/r/[token]` | dinâmica (force-dynamic) | página pública do pedido — o link curto que as mensagens prontas de WhatsApp carregam ("Ver resumo:"); renderiza no idioma do lead (`leads.locale`), sem PII | **não** | `noindex`; conteúdo em `lib/pedido.ts` + dicionário `lib/i18n/pedido.ts` |

⚠️ `/transfer` é página de **nicho**, não de destino: ela vem de `app/data/niches.ts` (o único nicho
vivo), enquanto os destinos vêm de `app/data/attractions.ts`. São dois catálogos e duas rotas — a
coincidência de slug (`transfer`) não é contrato, e é por isso que a allowlist de telemetria lista a
rota explicitamente (ver `conventions/tracking-metricas.md` §9).

## 2 · Admin (sessão própria, bloqueada no Edge)

`middleware.ts` exige sessão válida em tudo que começa com `/admin`, exceto `/admin/login`.

| Rota | Função |
|---|---|
| `/admin/login` | link mágico por e-mail |
| `/admin/dashboard` | visão geral das métricas 1st-party |
| `/admin/dashboard/leads` · `/pagina` | leads; relatório por página (`?p=<path>`) |
| `/admin/dashboard/oferta` · `/agencia` · `/nichos` · `/parceiro/[slug]` | modo de oferta, agência ativa, atribuição de nicho, parceiro |
| `/admin/dashboard/planos` | modelos de plano, períodos, valores e notas — topo da hierarquia de visibilidade |

## 3 · API

`/api/track` (lote 1st-party) · `/api/modal-track` (funil do modal) · `/api/leads` (grava, notifica,
dispara CAPI) · `/api/leads/draft` · `/api/leads/success` · `/api/contact` · `/api/visitor/me` ·
`/api/auth/{request,verify,logout}` · `/api/telegram-webhook` · `/api/cron/lead-alert` ·
`/api/admin/{active-agency,niche-assignment,offer-config,plan-notes,plan-period,plan-template,partner/[slug]/toggle}`.

As três APIs de escrita de telemetria (`/api/track`, `/api/modal-track`, `/api/leads/draft`) exigem
`isSameOriginRequest` (`lib/same-origin.ts` — hostname exato). Nenhuma delas é pública no sentido de
descoberta: `/api` está no `disallow` do `robots.ts`.

## 4 · Arquivos de superfície

| Arquivo | O que decide |
|---|---|
| `app/sitemap.ts` | só páginas vivas; omite `lastModified` quando a data não é real; `/obrigado` e admin fora |
| `app/robots.ts` | `disallow` só de `/admin` e `/api`; libera crawlers de IA (GEO) |
| `middleware.ts` | guarda `/admin/**`; semeia cookie de idioma **sem** redirecionar, e não o semeia para bots (o conteúdo i18n client-izado trocaria o DOM para o crawler sob um `<title>` em pt) |
| `next.config.ts` | stub do `experimental/testmode` no bundle do Edge; **não** há `redirects()` — o domínio é greenfield, nenhum 301 de migração |
| `lib/seo.ts` | `SITE_URL` (default `https://www.comprasparaguay.online`), `SITE_NAME`, schemas de `organization`/`website`/destino e keywords por silo |

## 5 · O que NÃO existe (e não deve voltar de meio de caminho)

Rotas de template que foram removidas junto com o escopo de turismo/gastronomia/hospedagem. Qualquer
referência a elas em código é morta — inclusive nas allowlists de telemetria:

`/atrativos`, `/atrativos/[slug]`, `/roteiros`, `/roteiros/[slug]`, `/roteiros/personalizar`,
`/roteiros/salvos`, `/montar-roteiro`, `/o-que-fazer`, `/o-que-fazer-em-foz`, `/onde-comer`,
`/onde-comer-em-foz`, `/hospedagem`, `/comercial/login`, `/comercial/painel`.

Consequências que ainda vivem no código: `lib/metrics.ts` mantém rótulos dessas rotas apenas para
rotular eventos históricos já gravados; `app/data/niches.ts` não gera mais páginas de nicho por slug
(o único nicho, `transfer`, tem rota fixa); o visitante que chega por link antigo cai no
`app/not-found.tsx`, que aponta para `/` e `/roteiros-de-compras`.

O painel do parceiro (`/comercial/*`) não existe neste projeto: sem páginas, o portal foi removido
junto com suas APIs, libs e guardas. Ver `conventions/marca-e-escopo.md`.
