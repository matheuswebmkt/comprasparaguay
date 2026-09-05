// Filepath: \_docs-dev-coder/architecture/analytics-cookies.md
// Parte de architecture.md (índice em ../architecture.md)

# ARCHITECTURE · COOKIES, ANALYTICS E TRACKING CLIENT

> Fonte única de verdade para caminhos, módulos e fronteiras.
> Cabeçalhos `###` PRESERVADOS do arquivo original — referências cruzadas continuam válidas.

---

### Cookies — consentimento próprio
- **Banner próprio (sem CMP externo)** — `components/CookieBanner.tsx` (client, montado 1× no root
  layout, fixo no rodapé): mostra na 1ª visita (checa `lib/cookie-consent.hasCookieConsent`,
  localStorage `rgf_cookie_consent`) com texto curto + link para `/aviso-legal` + botão único
  **"Entendi"** (`grantCookieConsent` grava o aceite e dispara `COOKIE_CONSENT_EVENT`). Sem opção
  "recusar" — é banner de aviso, não opt-out granular por categoria.
- **`components/analytics/ConsentGate.tsx`** (client) — só monta os filhos quando
  `hasCookieConsent()` é `true`; ouve `COOKIE_CONSENT_EVENT` para liberar sem recarregar a página.
  No root layout, envolve `<MetaPixel/>` + `<GoogleTagManager/>` — esses dois só carregam **depois**
  do aceite. O analytics 1st-party (`/api/track`, `lib/track.ts` — visitor/session ID anônimos em
  local/sessionStorage) **não é gateado** (essencial ao funcionamento, sem PII) — só Pixel e GTM
  (terceiros) esperam o consentimento.
- `lib/cookie-consent.ts` — `hasCookieConsent`/`grantCookieConsent`/`COOKIE_CONSENT_EVENT`. Fail-safe:
  sem `localStorage` (modo privado/quota), trata como sem consentimento (banner reaparece, nunca
  quebra).

### Pixel de portfólio — contrato compartilhado
- ⚠️ **`_docs-portfolio/`** (raiz do repo, FORA de `_docs-dev-coder/`) — `pixel-matrix.md`
  (normativo) + `pixel-decisions.md` (fundamentos e rejeições). **Não pertence a este projeto:** é
  copiado verbatim nos satélites que dividem o mesmo pixel do Meta (`rodagigantefoz`, `roteirofoz`,
  `toemfoz`). Editar aqui é editar o contrato dos outros. Divergência se detecta pelo
  `TAXONOMY_VERSION`, não arquivo a arquivo.
- `lib/tracking-taxonomy.ts` — os enums em código (`Property`, `Vertical`, `Niche`, `VERTICALS`,
  `NICHE_KEYS`, `asNiche`, `verticalOfPartnerCategory`, `taxonomyParams`). O arquivo é **bloco
  congelado**, idêntico byte a byte nos satélites; a única linha local é
  `TRACKING_PROPERTY = "roteirofoz"`. `TAXONOMY_VERSION` atual: **`2026-08-v1`** — param novo, valor
  de enum novo ou evento novo exigem entrada em `pixel-decisions.md` **e** bump nos satélites
  plugados. `LEAD_VALUE_VERSION` (`lib/lead-value.ts`) é o par disso para a tabela de pesos:
  `2026-07-v1`, e mexer em peso é re-baseline consciente, não cleanup.
- **Onde cada evento nasce** (a escada é contrato — `pixel-matrix.md` §4):

  | Evento | Origem no RF |
  |---|---|
  | `ViewContent` | `/atrativos/[slug]` (via `ViewContentOnLoad`) · abertura do `PartnerDetailModal` e do `ContactDetailModal` |
  | `InitiateCheckout` | abertura do `TicketOfferModal` |
  | `Lead` | submit do `TicketOfferModal` — **único evento com `value`** |
  | `Contact` | as saídas do funil de roteiro (WhatsApp central no modal — caminho normal e de lead duplicado — e ingresso direto) **+ as saídas de parceiro** (WhatsApp, reserva, site, iFood) via a prop `exit` do `TrackedLink` |
  | `CTAClick` | todo `TrackedLink` + CTAs do modal. Custom, telemetria de UI — **não** é degrau do funil |

- `components/TrackedLink.tsx` — além do `CTAClick`, aceita a taxonomia (`vertical`/`niche`/
  `partnerSlug`, tipadas contra o enum) e a prop **`exit`**, que marca o link como saída do funil e
  dispara `Contact`. Os usos do projeto (parceiro, o sidebar de contato genérico e a foto
  do card de agência no `NichePitchCard`, que leva ao site dela) levam taxonomia; parte são `exit`.
  Ficam de fora, de propósito: Instagram, Facebook e mapa — navegação informativa não é ponto de
  contato.
- `property` é injetado no **funil**, não nos pontos de chamada: `lib/analytics.trackConversion`
  (Pixel + dataLayer) e o `custom_data` de `lib/meta-capi.ts`.
- `TransportOffer.agencySlug` (`lib/offer-defaults.ts`, resolvido em `lib/offer-settings.ts`) —
  slug da agência ATIVA, computado no server e client-safe. **Não é exibido:** existe só para
  alimentar o `partner_slug` da taxonomia nos eventos de transfer/agência. `null` sem plano ativo →
  param omitido.
- `components/analytics/ViewContentOnLoad.tsx` — client component que não renderiza nada e dispara
  UM `ViewContent` por montagem. Ponte entre as páginas ESTÁTICAS e o pixel. Montado em
  `/atrativos/[slug]`. 🚫 **Nunca em hub** (`/roteiros-de-compras`, `/transfer`): lista é
  `view_item_list`, não `view_item`. `components/ImpressionObserver.tsx` continua sendo outra coisa (item dentro de lista)
  e **não** deve virar `ViewContent`.
- **Os modais de detalhe disparam `ViewContent` na ABERTURA** — parceiro e agência não têm rota
  própria, então não existe page load onde disparar. São DUAS superfícies vivas, e as duas precisam do
  evento: `PartnerDetailModal` (aberto pelo `PartnerDetailTrigger`, usado no detalhe de roteiro e no
  admin) e `ContactDetailModal` (mini modal só com o `ContactSidebar`, aberto pelo `NichePitchCard`
  nas páginas de nicho, para os dois kinds — `agency` → transporte/transfer, `partner` →
  `verticalOfPartnerCategory` + `asNiche`). ⚠️ Quem abrir uma superfície nova de detalhe leva o
  `ViewContent` junto: sem o primeiro degrau sobra só público de "foi falar com o negócio", nunca de
  "viu o negócio" — e param não é retroativo.
- ⓘ Os componentes de hotel (`HotelDetailModal` + `HotelDetailTrigger` + `HotelDetailContent`) foram
  removidos junto com a entidade.
- `lib/lead-value.ts` — módulo PURO (sem DB/React/`window`), fonte ÚNICA do payload do `Lead`:
  `buildLeadEventParams()` roda no client (modal) **e** no server (CAPI). `value` é
  **pontuação de qualidade, não dinheiro** (D12); pesos e `LEAD_VALUE_VERSION` são contrato de
  portfólio. `lib/roteiro-lead.resolveLeadKind()` é a ponte `LeadContext` → `LeadKind`, também
  chamada pelas duas pontas.
- `lib/roteiro-content.ts` foi **removido** junto com o mundo de roteiros prontos. O `content_ids` do
  pixel vem do catálogo atual (5 atrativos) — cada item é `{ slug }`; **o array leva SLUG de atrativo,
  nunca o nome exibido:** o nome é
  traduzido (`lib/i18n/attractions.ts` `ATTRACTION_NAMES`), e mandá-lo faria o mesmo atrativo virar
  3 valores diferentes no pixel compartilhado, um por idioma.
- **Cobertura de `content_ids` por origem** — as ausências são corretas, não pendências:

  | Origem | `ViewContent` | `InitiateCheckout` | `Lead` |
  |---|---|---|---|
  | Atrativo (`/atrativos/[slug]`) | ✅ | ✅ | ✅ |
  | Roteiro de compras (modal, produto roteiro) | — não é página de item | ✅ | ✅ |
- **Falha do CAPI é logada em PRODUÇÃO** (`lib/meta-capi.ts`), não só em dev: token vencido/revogado
  devolve 4xx e, sem log, nada denuncia — os leads seguem gravando e notificando, só param de chegar
  ao Meta. 🚫 Nunca logar a URL nem o objeto do request: o `access_token` viaja na query string.
- **G1 — Pixel e CAPI não podem divergir:** os dois compartilham o `event_id` e o Meta fica com UMA
  das versões. Todo param novo no `Lead` do client precisa do espelho em `lib/meta-capi.ts`, via
  `app/api/leads/route.ts`. Por isso a origem posta `itemSlug` no corpo: é a mesma string que ela
  manda ao Pixel, para o servidor não ter que re-derivar (derivação paralela é como a divergência
  volta). ⚠️ `assigned_partner` (roteamento do lead) **não é** `partner_slug` (atribuição do pixel).
  ⚠️ O `partner_slug` também é simétrico: o servidor resolve `activeAgencySlug` em TODO `Lead`, então
  a tela que emite `Lead` (modal) precisa mandá-lo ao Pixel por `offer.transportOffer.agencySlug`,
  lido do `CtaModeProvider` (`useOfferConfig`), que envolve `{children}` no root layout. Faltando,
  o Meta fica com uma das duas versões do evento e a atribuição da agência some em metade dos leads,
  sem erro nenhum.

### Analytics
- **Meta Pixel** (`components/analytics/MetaPixel.tsx`, `lib/fbq.ts`) — via `next/script`. Só carrega
  após o aceite do `CookieBanner` (`ConsentGate`).
- **GTM** (`components/analytics/GoogleTagManager.tsx`) — carrega só se `NEXT_PUBLIC_GTM_ID` setado
  **e** o cookie banner foi aceito. É o caminho do GA4 (a tag GA4 vive dentro do container GTM,
  ouvindo o `dataLayer`).
- **`lib/analytics.ts` — disparo unificado** (`trackConversion` + `CONVERSIONS`): cada evento de
  conversão alimenta Meta (Pixel/CAPI) **e** Google (dataLayer→GTM→GA4) num só lugar. Catálogo:
  `viewContent` (`ViewContent`/`view_item`) · `initiateCheckout` (`begin_checkout`) · `lead`
  (`generate_lead`) · `contact` (`Contact`) · `ctaClick` (custom, telemetria de UI). A escada é o
  contrato de portfólio (`_docs-portfolio/pixel-matrix.md` §4): `InitiateCheckout` marca o INÍCIO do
  fluxo (abertura do modal) e as SAÍDAS (WhatsApp central, ingresso
  direto) são `Contact`, porque acontecem depois do `Lead`.
- `components/analytics/NavigationEvents.tsx` — `pageview` 1st-party + Pixel `PageView` + `dataLayer`
  `page_view`.
- `types/global.d.ts` — tipagem de `window.fbq` + `window.dataLayer`.

### Tracking client
- `lib/utm.ts` — `buildTrackedUrl()` (UTM em http(s)) + `getInboundUtms()` + `UTM_DEFAULTS` +
  `internalUrl(path, origem)` → `utm_source=interno-<origem>`. Origens granulares pela página de
  partida (`navbar-<página>`, `relacionado-<slug>`, `home`, etc.) — permite, no dashboard, separar
  interno×externo e saber de qual página veio. O `canonical` (sem query) consolida o SEO.
- `lib/track.ts` — `track()` não manda 1 request por evento: enfileira em memória e envia em LOTE
  para o mesmo `/api/track` a cada 20s, 20 eventos na fila, ou saída de página
  (`pagehide`/`visibilitychange`). Payload `{events:[], visitorId, sessionId}` — os dois IDs vão 1×
  por lote, não por evento.
- `app/api/track/route.ts` — aceita o lote (`MAX_EVENTS_PER_REQUEST=50`); persiste com
  `lib/events.ts` `recordEvents()`.
- `components/TrackedLink.tsx` — `<a>` que anexa UTM + `cta_click` 1st-party + `trackEvent` GTM.
- `lib/fbq.ts` — `fbqTrack()` (Meta Pixel).
- **Não rastreia 404:** `app/not-found.tsx` renderiza um marcador; `NavigationEvents` detecta e pula
  o pageview — probes de bots a caminhos inexistentes não poluem as métricas.
- **UTM interna é removida da URL** após capturar o pageview (`history.replaceState`, sem reload)
  — não polui ao copiar/compartilhar. Só limpa `interno-*` (UTM externa de campanha é mantida).
- Consumidores: hero, navbar, páginas de parceiro (CTAs externos), `NavigationEvents`.
- 1st-party: ver `architecture/backend-auth.md` ("Backend 1st-party").
