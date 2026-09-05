// Filepath: \_docs-dev-coder/architecture/i18n-portal.md
// Parte de architecture.md (índice em ../architecture.md)

# ARCHITECTURE · I18N E PORTAL DO PARCEIRO (/COMERCIAL)

> Fonte única de verdade para caminhos, módulos e fronteiras.
> Cabeçalhos `###` PRESERVADOS do arquivo original — referências cruzadas continuam válidas.

---

### i18n — pt/en/es
- **Sem rota por locale** (não é `/en/...`) — idioma vive em **cookie** (`locale`, 1 ano).
  `lib/i18n/config.ts` (Edge-safe): `LOCALES = ["pt","en","es"]`, `DEFAULT_LOCALE = "pt"`.
  `detectLocale()` prioriza **país** (geo do Vercel — de onde a pessoa É importa mais que o idioma
  do device) sobre `Accept-Language`.
- `middleware.ts` semeia o cookie 1× por visitante (sem redirect) — **exceto para bots** (UA contém
  bot/crawl/spider/bing/google/etc.): rastreador vem de IP dos EUA e a geo-detecção o rotularia
  como "en", re-renderizando o DOM client i18n-izado em inglês para o crawler (snippet EN sob
  título PT). `components/i18n/LocaleProvider.tsx` (client) resolve **só por cookie**, caindo em
  pt (default) sem cookie — sem fallback de `navigator.language`, pelo mesmo motivo;
  `components/i18n/LanguageSwitcher.tsx` troca.
- Conteúdo traduzido vive em `lib/i18n/*.ts`: `shared.ts`, `home.ts`, `modal.ts`, `attractions.ts`
  (inclui `ATTRACTION_NAMES`, nomes exibidos por slug), `attraction-detail.ts`, `attraction-faqs.ts`
  (FAQ por atrativo, 31 slugs), `partners.ts`, `partner-detail.ts`, `atrativos-foz.ts`,
  `triplice-fronteira.ts`, `niche-labels.ts`, `niches-content.ts` (páginas de nicho/transfer),
  `roteiros.ts` (hub/cards/lead block), `o-que-fazer.ts`,
  `paginas.ts` (/sobre, /contato, /aviso-legal), `entidades.ts` (dados de
  negócio de agências: name/businessType/tagline/highlights por slug).
  Padrão: `app/data/*.ts` continua a **matriz PT** de conteúdo (dados de negócio intactos em qualquer
  idioma); a camada i18n traduz o **chrome** (rótulos, microcopy) e o conteúdo editorial visível
  (FAQ, descrições por slug) — `pt` nos dicionários cai no dado via fallback (`??`).
- **Páginas server + conteúdo client:** o que o visitante lê sai de um componente client i18n-izado;
  o `page.tsx` fica com `metadata`/JSON-LD em **pt canônico** (SEO) e monta a página. Padrão usado em
  `/roteiros-de-compras` (`AtrativosFozContent`),
  `/atrativos/[slug]` (`AttractionPageContent`), nichos (`NichePageTemplate` = casca server +
  `NichePageContent` client; o slot de recomendação `NicheRecommendation` resolve no server/DB e
  renderiza `NichePitchCard`/`NicheEmptyState` no client),
  `/sobre` (`SobreContent`), `/contato` (`ContatoContent`),
  `/aviso-legal` (`AvisoLegalContent`), `/obrigado` (`ObrigadoContent`).
- ⚠️ **`metadata` e JSON-LD ficam em PT canônico** — ver `conventions/posicionamento.md` §21.8.
  Rotas por locale (hreflang) são decisão futura separada; sem URLs distintas, o Google só indexa a
  versão pt e metadata localizado por cookie fragmentaria o sinal (Googlebot rastreia de IP dos EUA).
- ⚠️ `RoteiroDiasSeoPage` + `app/data/roteiro-dias-seo.ts` foram REMOVIDOS (código morto — nenhum
  importador).
- `TicketOfferModal`/`OfferModeControl` também são multi-idioma (textos do modal por locale,
  colunas `_en`/`_es` em `app_settings`).

### `/comercial` — Portal do parceiro
- Mini-portal B2B com sessão própria: `lib/portal-session.ts` (HMAC Edge-safe, cookie separado do
  admin) + `lib/portal-auth.ts` (magic-link por e-mail, contas `partner | agency | hotel` — tabela
  `portal_accounts`) + `lib/plan-periods.ts` (pausa/notas de período — tabelas
  `plan_entities`/`plan_period_events`/`plan_period_notes`/`plan_entity_notes`).
- ⚠️ **Rotas reais confirmadas em `app/comercial/`: só `/comercial/login` e `/comercial/painel`**
  (autenticadas, protegidas pelo `middleware.ts`, sessão `portal-session` distinta de `/admin`).
  APIs: `/api/portal/{login,logout,verify}`. Toda a árvore `/comercial*` recebe
  `X-Robots-Tag: noindex, nofollow` (`next.config.ts`).
- Admin (lado interno, dentro de `/admin`): `components/admin/{ActiveHotelControl,ActiveAgencyControl,
  PlanTemplateManager,PortalAccessControl,PlanNotesPanel,PlanPeriodControl}.tsx`.
- ⚠️ **Conteúdo interno de `lib/portal-auth.ts`/`lib/plan-periods.ts` e das páginas do portal não foi
  lido linha a linha nesta passada de documentação** — este bloco documenta a topologia confirmada
  no código (rotas, tabelas, módulos existentes), não o comportamento interno de cada um. Ler o
  arquivo antes de alterar comportamento de autenticação ou de planos.
