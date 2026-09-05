// Filepath: \_docs-dev-coder/conventions/tracking-metricas.md
// Parte de conventions.md (índice em ../conventions.md)

# CONVENTIONS · TRACKING E UTMs

> Restrições duras do projeto. NÃO re-propor decisões já travadas aqui.
> Numeração das seções PRESERVADA do arquivo original (§N) — referências cruzadas continuam válidas.

---

## 6. Tracking e UTMs (1st-party)

> ⚠️⚠️ **O pixel do Meta NÃO é ativo deste projeto — é de PORTFÓLIO.** Escada de eventos, nomes de
> parâmetro, valores de enum e a escala de `value` vivem em **`_docs-portfolio/pixel-matrix.md`**
> (normativo, o QUE) e **`_docs-portfolio/pixel-decisions.md`** (o PORQUÊ e o que já foi rejeitado),
> na raiz do repo. Os dois são copiados **verbatim** nos satélites que dividem o mesmo pixel;
> `lib/tracking-taxonomy.ts` é a execução em código.
>
> **Antes de mexer em qualquer disparo de Pixel ou CAPI, abrir os dois.** Esta seção governa só o
> que é específico do Compras Paraguay (UTM, 1st-party, CTR, exclusão de `/comercial`). Onde as duas
> falarem do mesmo assunto, **o contrato de portfólio vence** — mudar uma regra dele aqui é mudar o
> comportamento dos outros satélites sem que ninguém lá saiba.

- **Todo clique** em CTA de produto nosso (Compras Paraguay e parceiros) deve:
  1. Anexar **UTMs enriquecidas** à URL de destino.
  2. Registrar o clique na **API 1st-party** (`/api/track`) → Neon.
- **Meta Pixel direto** (`components/analytics/MetaPixel.tsx`, via `next/script`). Pixel ID com
  default embutido + override `NEXT_PUBLIC_META_PIXEL_ID`. Coexiste com o 1st-party. `lib/fbq.ts` →
  `fbqTrack()`. PageView: base (1ª) + `NavigationEvents` (trocas de rota).
- **GTM** (`components/analytics/GoogleTagManager.tsx`, env `NEXT_PUBLIC_GTM_ID`) é o caminho do GA4
  (a tag GA4 vive dentro do container, ouvindo o `dataLayer`). GTM ≠ destino; é encanamento. CAPI é
  server-side e **não** passa pelo GTM web (isso exigiria sGTM — fora de escopo).
- **Disparo unificado (regra dura):** todo evento de conversão passa por
  `lib/analytics.trackConversion(CONVERSIONS.x, …)`, que alimenta Meta (Pixel/CAPI) **e** Google
  (dataLayer→GTM→GA4) num só lugar. **Não** chamar `fbqTrack` direto para eventos de marketing (só
  dentro do próprio `analytics.ts`). Catálogo `CONVERSIONS`:
  `viewContent`/`initiateCheckout`/`lead`/`contact`/`ctaClick`, com nomes GA4 padrão
  (`view_item`/`begin_checkout`/`generate_lead`/`contact`/`cta_click`). `eventID` (dedupe) também vai
  ao dataLayer. ⚠️ A ORDEM da escada é contrato de portfólio (matriz §4), não preferência local:
  `InitiateCheckout` é o **início** do fluxo (abertura do modal, "Começar a montar") e as **saídas**
  são `Contact`, porque vêm depois do `Lead`. Inverter os dois torna a taxa de conversão do painel
  ficção. 🚫 `ViewModalVIP` foi descartado (D10) e não volta, nem com outro nome. ⚠️ Pageview: não duplicar — escolher GA4 Enhanced Measurement **ou** o push manual
  `page_view`, nunca os dois.
- ⭐ **Pixel e CAPI não podem divergir (regra dura).** Os dois mandam o MESMO `event_id` no `Lead` e o
  Meta fica com **uma** das versões — divergir não gera erro nenhum, só faz metade dos leads chegar
  com params ou `value` diferentes, de forma não-determinística. Por isso todo sinal do `Lead` passa
  por **função pura compartilhada**, chamada pelas duas pontas: `buildLeadEventParams`
  (`lib/lead-value.ts`), `resolveLeadKind` e `ticketQtyFromPessoas` (`lib/roteiro-lead.ts`),
  `attractionSlugsFromDays` (`lib/roteiro-content.ts`).
  ⚠️ **Não basta ser "equivalente na leitura" — tem que ser o MESMO valor.** O client manda ao
  servidor exatamente o que mandou ao Pixel (`itemSlug`, `contentIds`, `leadContext`,
  `wantsTransport`) em vez de o servidor re-derivar: derivação paralela é como a divergência volta.
  Corolário: o CAPI usa o valor **postado**, não a coluna gravada — `wants_transport` no banco é
  gateado por regra de gravação e não representa o que o visitante respondeu.
  ⚠️ **`partner_slug` é a exceção que exige atenção manual:** ele NÃO viaja no corpo do POST — o
  servidor o resolve por conta própria (`getActiveAgencySlug`) em TODO `Lead`, e o client o lê da
  config da oferta. São duas leituras da mesma fonte, não uma função compartilhada, então nada avisa
  quando uma tela nova esquece de mandá-lo. As DUAS telas que emitem `Lead` mandam: o modal por
  `offer.transportOffer.agencySlug`, o wizard pelo mesmo campo via `useOfferConfig()` (o
  `CtaModeProvider` envolve `{children}` no root layout). Tela nova que emita `Lead` sem ele manda
  metade dos eventos sem atribuição de agência — o Meta escolhe uma das duas versões do `event_id`.
- ⭐ **O dataLayer ACUMULA — toda chave da taxonomia que não veio no evento vai como `null`
  (regra dura).** O dataLayer do GTM não é fila de eventos independentes: cada `push` FUNDE com o
  estado anterior. Mandar só as chaves do evento atual deixa as do anterior vivas, a variável do GTM
  devolve o valor velho e nada acusa — o `begin_checkout` de um atrativo grava `item_slug`, e o
  `cta_click` seguinte, num parceiro de gastronomia, sai carimbado com aquele atrativo. `pushDataLayer`
  (`lib/analytics.ts`) preenche `DATALAYER_RESET_KEYS` com `null` para resolver isso. ⚠️ **Param novo
  em qualquer evento entra nessa lista também** — senão ele é o próximo a ficar velho. O problema não
  existe no Meta (cada `fbq('track')` carrega o próprio objeto), então é fácil esquecer que o caminho
  Google precisa disso à mão. Não é bump de `TAXONOMY_VERSION`: é transporte, não contrato.
- ⭐ **Toda superfície que abre detalhe de parceiro/hotel/agência dispara `ViewContent` na ABERTURA
  (regra dura).** Essas três entidades não têm rota própria — são card + modal —, então não existe
  page load onde disparar, e o evento morre se a superfície nova esquecer dele. Hoje são duas:
  `PartnerDetailModal` (hub `/onde-comer`) e `ContactDetailModal` (mini modal das páginas de nicho,
  que atende os três kinds). ⚠️ A taxonomia sai da MESMA resolução por kind que alimenta os CTAs de
  contato do próprio modal: se cada lado decidir o `vertical` por conta própria, o `ViewContent` e o
  `Contact` do mesmo negócio saem com dimensões diferentes e nada quebra — só a segmentação passa a
  mentir. Sem o primeiro degrau, hotelaria e gastronomia (cuja escada inteira é `ViewContent →
  Contact`) rendem público de "foi falar com o negócio" e nunca de "viu o negócio".
- ⭐ **Saída de parceiro/hotel dispara `Contact` (regra dura).** Em `gastronomia` e `hotelaria` não
  existe formulário, então a escada inteira é `ViewContent → Contact` (matriz §3): sem o `Contact`
  dá para montar público de "viu o parceiro", mas não de "foi falar com ele" — que é o que tem valor
  comercial. Mecanismo: a prop `exit` do `TrackedLink`, que dispara `Contact` junto do `CTAClick`.
  ⚠️ **`exit` só em ponto de contato** — WhatsApp, reserva/CTA principal, site, iFood. **Nunca** em
  rede social, mapa ou navegação interna: inflar `Contact` com clique informativo esvazia o público
  em silêncio.
- ⚠️ **`item_slug` do 1st-party ≠ `item_slug` do pixel em parceiro/hotel.** No 1st-party o `itemSlug`
  do card é o slug do NEGÓCIO — é ele que casa `cta_click` com o `ImpressionObserver` e produz
  reach/CTR por parceiro no dashboard, então não pode mudar. No pixel, porém, `item_slug` significa
  O QUE foi vendido e `partner_slug` QUEM entrega (matriz §1.4). Por isso o `TrackedLink` omite
  `item_slug` do pixel quando `partnerSlug === itemSlug`: ali o produto **é** o negócio. Misturar as
  duas dimensões foi um defeito real já encontrado no satélite irmão.
- ⚠️ **`leads.wants_transport` é TRI-STATE:** `true` quer · `false` recusou · **`null` não foi
  perguntado**. Quem decide se a pergunta existiu é o SERVIDOR, nunca o corpo da requisição — coagir
  `null` para `false` faria o banco afirmar "não quer" sobre quem ninguém perguntou e contaminaria o
  denominador de qualquer taxa de aceite. **O transporte AUTOMÁTICO conta como `true`**: no atrativo
  sem link de ingresso ("Tem link - NÃO") o modal não pergunta e assume transporte, então a coluna
  grava `true` — senão um lead que É de transporte sumiria de toda contagem feita por ela, enquanto
  o pixel o contava. ⚠️ Mesmo assim o CAPI usa o valor **postado**, não a coluna: a coluna é
  tri-state e o param é booleano; converter `null` no servidor criaria uma segunda regra que o client
  não tem, e é assim que as pontas voltam a divergir.
- ⚠️ **`assigned_partner` NÃO é `partner_slug`.** O primeiro é roteamento interno (só existe quando o
  lead foi encaminhado à agência); o segundo é atribuição do pixel e sai sempre que houver agência
  com plano ativo, espelhando `offer.transportOffer.agencySlug` no client. Campos diferentes, no
  mesmo evento.
- ⭐ **`content_ids` não é opcional neste projeto.** Aqui o produto **é** o bundle: roteiro pronto,
  dias avulsos e cesta do wizard mandam o array de slugs de atrativo junto do `item_slug` (que é o
  produto de ENTRADA). 🚫 Nunca concatenar os slugs numa string — o campo é array nativo do Meta, e
  concatenar quebra toda regra de painel.
- **Faixa → número: sempre o PISO.** O wizard coleta faixa de pessoas (`1-2`/`3+`), não quantidade
  exata, e pessoas = ingressos. A conversão usa o piso da faixa porque superestimar envenena a
  distribuição que a otimização por valor aprende — e o sintoma aparece semanas depois como campanha
  ruim, nunca como bug. Subestimar só deixa pontos na mesa; a assimetria é o motivo da regra.
- 🚫 **Sem `content_name`** em evento de conversão: era igual em todo lead, não discriminava nada e
  colava vocabulário de um satélite num pixel compartilhado. Quem identifica o produto é
  `item_slug`/`content_ids`; quem identifica o site é `property`.
- **Dimensão desconhecida é OMITIDA, nunca preenchida** (`""`, `"none"`, `"unknown"`, `"n/a"`).
  `taxonomyParams()` já aplica isso — usar sempre, em vez de espalhar objeto solto.
- **`value` só no `Lead`.** Nunca em `ViewContent`/`InitiateCheckout`/`Contact`/`CTAClick`: eventos de
  topo de funil são ordens de grandeza mais numerosos e contaminariam a distribuição aprendida.
- 🚫 **Silêncios DELIBERADOS — não "consertar":**
  • **`/r/[token]`** (página pública do pedido) não dispara `Contact` no botão de WhatsApp. O mesmo
  link é colado no grupo de vendedores da agência e reencaminhado, então o clique vem tanto do
  visitante quanto de quem vende — instrumentá-lo encheria o pixel de portfólio de clique interno,
  pelo mesmo motivo que tira `/comercial` de toda métrica. É Server Component, e continuar assim é a
  decisão.
  • **Não existe `AddToCart`** ao adicionar atrativo à cesta. A escada da matriz §4 não tem esse
  degrau; criar um evento novo exige entrada em `pixel-decisions.md` e bump do `TAXONOMY_VERSION` nos
  três repos. A cesta é medida por UTM interna granular (§20), não por evento.
  • **Rede social e mapa** (footer, sidebar, cards) levam no máximo `CTAClick`, nunca `exit`/`Contact`.
- **O modo `preview` do modal (admin) não dispara evento nenhum** — não regredir isso ao mexer nos
  pontos de disparo.
- Esquema base de UTM (padronizar em helper único):
  `utm_source=roteirofoz` · `utm_medium=site` · `utm_campaign=<contexto>` ·
  `utm_content=<tipo-de-cta>` · `utm_term=<slug-do-item>`.
- **UTM interna:** navegação interna usa `lib/utm.internalUrl(path, origem)` →
  `utm_source=interno-<origem>`. Origens granulares pela página de partida: `navbar-<página>`
  (navbar usa `usePathname`), `relacionado-<slug>` (card de sugestão), `atrativo-<slug>` ("ver
  tudo"), `home`, `foz-alem`, `triplice`. Permite, no dashboard, separar interno×externo e saber de
  qual página veio. O `canonical` (sem query) consolida o SEO. A limpeza da UTM interna roda fora do
  dedupe (cobre self-nav: clicar no link da própria página).
- **Não rastreia 404:** `app/not-found.tsx` renderiza `<span data-rgf-notfound>`; o
  `NavigationEvents` detecta o marcador e pula o pageview — probes de bots a caminhos inexistentes
  não poluem as métricas.
- **Sugestões de atrativo:** `components/RelatedAttractions` (client) — mostra todos os outros
  atrativos em scroll lateral, com ordem embaralhada por acesso (SSR estável para SEO; shuffle no
  `useEffect`).
- **Limpeza da UTM interna:** após capturar o pageview, `NavigationEvents` remove a UTM interna da
  URL via `history.replaceState` (sem reload nem pageview novo) — não polui ao copiar/compartilhar.
  Só limpa `interno-*` (a UTM externa de campanha é mantida). Dedupe por `pathname` evita contar
  pageview duplicado.
- ⭐ **CTR = definição única (regra dura):** toda "Taxa de clique" do painel é **visitantes únicos
  que clicaram ÷ visitantes únicos, limitada a 100%** — nunca `cliques ÷ pageviews`. Numerador e
  denominador da mesma população (por isso ≤ 100%). Fonte única: `lib/metrics.clickRate(clickers,
  base)`. Escopo do denominador: geral/página = visitantes únicos do escopo; parceiro = `reach`
  (visitantes que viram o card/seção do parceiro) — isso evita o CTR do parceiro dar > 100%
  (cliques do parceiro em todo o site ÷ pageviews só da página dele seriam populações diferentes).
  Ao criar nova métrica de taxa, usar `clickRate` — não reintroduzir `cliques ÷ pageviews`.
- ⭐ **`/comercial` fora de toda métrica (regra dura):** as rotas `/comercial*` são páginas 1:1 (não
  públicas, noindex, enviadas manualmente) e não devem coletar nem aparecer em métrica alguma. Duas
  camadas: (1) `/comercial*` não está no `STATIC_PATHS` do `/api/track` → pageviews e cliques de
  `/comercial` são ignorados (204, não gravados); (2) toda query de `lib/metrics.ts` exclui
  `path like '/comercial%'` (junto de `/admin%`), inclusive as agregações de `cta_click`. Ao mexer
  nessas queries, manter as duas exclusões (`/admin%` e `/comercial%`).
