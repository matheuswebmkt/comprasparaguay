// Filepath: _docs-dev-coder/conventions/tracking-metricas.md
// Version: 1.0
// Nome da Versão: "Convenções de pixel, value e telemetria própria — reescritas a partir do código vigente"

# CONVENTIONS — PIXEL, EVENTOS E MÉTRICAS

## 1 · Ponteiro duro: o pixel não é deste projeto 🔒

**Este projeto é um satélite plugado num pixel compartilhado.** A autoridade sobre o que é enviado ao
Meta não é daqui — é do portfólio:

| Arquivo | Papel |
|---|---|
| `_docs-portfolio/pixel-matrix.md` | **normativo**: dimensões, escada de eventos, escala de `value`, como plugar um projeto |
| `_docs-portfolio/pixel-decisions.md` | **fundamentos**: o porquê de cada decisão (`D1`…`D14`) e, principalmente, o que já foi **rejeitado** |
| `lib/tracking-taxonomy.ts` | **execução**: o bloco congelado idêntico em todos os repositórios plugados + o bloco local (`TRACKING_PROPERTY`) |

Consequências práticas, todas já pagas uma vez por alguém:

- Editar o tracking local sem abrir a matriz é divergir de boa-fé. **Nenhuma** mudança em evento,
  parâmetro, enum ou peso entra em vigor sem ler os dois arquivos acima.
- O bloco congelado é **byte a byte** igual nos três repositórios, inclusive os comentários. Dado
  local limpo ≠ enum local encolhido: o enum é o vocabulário do pixel, e um valor que este site não
  produz simplesmente nunca é enviado (regra de omissão, §3). Encolher o enum aqui não deixa de
  mandar nada — só quebra o `diff` que detecta divergência e, copiado verbatim, apaga vocabulário de
  quem ainda usa.
- Divergência entre repositórios se detecta comparando `TAXONOMY_VERSION` **e** `diff` do bloco. Um
  `TAXONOMY_VERSION` idêntico com bloco diferente é o pior estado possível: parece sincronia — foi
  exatamente assim que o `Property` deste repo perdeu `roteirofoz` (registrado como **D14**).
  O comando, e a única saída aceita por ele:

  ```bash
  diff --strip-trailing-cr ../RoteiroFoz/lib/tracking-taxonomy.ts lib/tracking-taxonomy.ts
  # única linha diferente autorizada: export const TRACKING_PROPERTY = "comprasparaguay";
  ```

  `--strip-trailing-cr` porque o *working tree* deste repo é CRLF e o dos vizinhos LF; o que vale é o
  blob commitado. `TAXONOMY_VERSION` em vigor: **`2026-09-v1`**.
- **Enum é aditivo (D14).** Plugar um projeto novo **soma** um valor em todos os repositórios; trocar o
  nome de um satélite existente pelo do projeto novo não é renomear este repo — é reescrever o
  vocabulário dos outros, porque o bloco é copiado verbatim. O mesmo vale para registro de validação do
  §0-bis da matriz: um `event_id` pertence ao repo onde o teste rodou, e copiá-lo fabrica um ✅ que
  nenhuma tela viu.
- Valor de evento **enviado não se apaga**. Slug de teste, placeholder ou enum quebrado que chegue ao
  Meta fica no histórico do pixel compartilhado para sempre.

## 2 · Onde cada coisa vive

| Arquivo | Responsabilidade |
|---|---|
| `lib/tracking-taxonomy.ts` | enums, `asNiche()`, `verticalOfPartnerCategory()`, `taxonomyParams()` (omissão), `VERTICALS_WITH_APPROVED_LEAD_VALUE`, `TRACKING_PROPERTY` |
| `lib/lead-value.ts` | módulo puro: pesos, `computeLeadValue`, `buildLeadEventParams`, `resolveJourneyStage` — consumido pelas **duas** pontas |
| `lib/analytics.ts` | funil do client: `CONVERSIONS`, `trackConversion` (injeta `property`), `pushDataLayer` |
| `lib/meta-capi.ts` | funil do server: `user_data` hasheado, `custom_data`, envio Graph |
| `components/ticket-offer/TicketOfferModal.tsx` | único funil real de `InitiateCheckout` → `Lead` → `Contact` |
| `components/analytics/ViewContentOnLoad.tsx` | `ViewContent` em página de item (nunca em hub) |
| `components/TrackedLink.tsx` | `CTAClick` + `Contact` em saídas |
| `app/api/track/route.ts` | allowlist do 1st-party (§9) |

## 3 · Omissão, nunca placeholder (G6)

Dimensão desconhecida ou inaplicável sai **fora** do payload. Proibido `""`, `"none"`, `"unknown"`,
`"n/a"`, `[]`.

Parâmetro ausente não atrapalha uma Conversão Personalizada; placeholder em volume dilui a regra e a
faz **parar de casar sem emitir erro** — o sintoma aparece semanas depois, como campanha ruim, e não
como bug. A travessia dado→enum é sempre por `asNiche()` / `verticalOfPartnerCategory()`, nunca por
cast: dado que o portfólio não conhece vira `undefined`, que vira omissão.

O servidor **recalcula** o `value` a partir dos sinais; nunca aceita um `value` pronto vindo do
cliente.

## 4 · Escada e gatilhos

| Evento | Gatilho neste projeto |
|---|---|
| `PageView` | script base do Pixel + `NavigationEvents` nas trocas de rota |
| `ViewContent` | `ViewContentOnLoad` em `/roteiros-de-compras/[slug]`; abertura de modal de item/agência. **Nunca** em página hub (lista é `view_item_list`, não `view_item`) |
| `InitiateCheckout` | **início do fluxo de conversão** — a abertura do modal de captura. É o início, não "a abertura do modal": onde houver saída direta para conversa com a agência, o evento continua sendo o mesmo |
| `Lead` | submit do formulário de captura — conversão principal, a única com `value` |
| `Contact` | saídas (WhatsApp, reserva de parceiro, redirect) — acontecem **depois** do `Lead` |
| `CTAClick` | telemetria granular de UI; não otimizar por ele |
| `Purchase` | **reservado** para receita real (§7) |

`content_name` não discrimina nada no `Lead` — não voltar a usá-lo. `ViewModalVIP` foi descartado e
não volta com outro nome: o que ele distinguia é parâmetro (`vertical`, `item_slug`, `cta_type`).

`item_slug` (produto de entrada, valor único) e `content_ids` (array — tudo que o pedido inclui)
convivem no mesmo evento. Aqui o bundle é o `pedidoItems` do modal: destino de entrada + extras
marcados. Nunca concatenar itens num `item_slug` só.

`item_slug` é sempre o identificador do **dado**, nunca o segmento da URL: renomear rota por SEO não
muda o param (D11).

## 5 · `value` é pontuação, não dinheiro

O que o `value` estima é quanto o lead vale **para quem o recebe** (a agência), não o que este site
fatura — o site não leva comissão por venda. Disso decorre: **não configurar meta de ROAS** (não há
receita atribuível a um lead); a métrica que importa é custo por lead qualificado.

Os pesos (`LEAD_VALUE_WEIGHTS`), o multiplicador e o `LEAD_VALUE_VERSION` são **contrato de
portfólio**, não ajuste local: existe uma única distribuição de valor dentro do pixel. Mudar peso é
re-baseline consciente, com aviso a quem roda campanha. Vertical sem peso aprovado não emite `Lead`.

## 6 · Espelho Pixel × CAPI no mesmo `event_id` (G1)

Pixel (navegador) e CAPI (servidor) mandam o **mesmo** `event_id`; o Meta deduplica e fica com uma
das duas versões. Parâmetro divergente entre as pontas não gera erro — gera metade dos Leads sem
segmentação, de forma não determinística.

Regra: as duas pontas chamam a **mesma** função (`buildLeadEventParams`) com os **mesmos** sinais, e o
servidor recebe os sinais brutos no corpo do POST, nunca o payload pronto. `vertical`, `partner_slug`
e `content_ids` do CAPI saem por `taxonomyParams`, igual ao client. Isso vale para todo sinal novo que
entra num evento — inclusive os extras de UI.

Armadilhas de validação manual: o evento do navegador **não** aparece na aba "Testar eventos" (o
`test_event_code` só vai ao servidor, então a comparação é cruzada); o código de teste **rotaciona**
(fixar no `.env`, não atualizar a aba); o token do Turnstile expira em ~5 min, então rodar o fluxo
inteiro de uma vez.

## 7 · Canais: cada um no seu trilho

- **Meta**: Pixel + CAPI ativos e simétricos. `NEXT_PUBLIC_META_PIXEL_ID` e `META_CAPI_TOKEN` têm
  default/override por env; sem token o envio server-side é no-op silencioso (o erro do Graph é
  logado — falha de token não pode ser invisível).
- **Google**: o canal é o **container do GTM do portfólio** (`NEXT_PUBLIC_GTM_ID`), montado por
  `components/analytics/GoogleTagManager.tsx` dentro do `ConsentGate`. A tag de configuração do GA4
  vive **dentro do container** — nenhum repositório do grupo conhece Measurement ID. Os eventos chegam
  pelo `dataLayer`: conversões por `pushDataLayer` (`view_item`, `begin_checkout`, `generate_lead`,
  `contact`, `cta_click`) e `page_view` de rota por `NavigationEvents`.
  🚫 **Não introduzir gtag.js direto com Measurement ID próprio**: isso cria um segundo canal apontando
  para uma propriedade diferente e o portfólio para de somar na mesma base. Se o GA4 parecer "mudo", a
  hipótese a checar primeiro é o `NEXT_PUBLIC_GTM_ID` ausente no deploy (variável protegida não chega a
  todos os ambientes), não o código.
  Diferença estrutural em relação ao Meta, útil para não esperar o errado: no GA4 o parâmetro só aparece
  em relatório se for registrado como dimensão/métrica personalizada, e sessões de domínios diferentes
  não se unem sozinhas (pedem cross-domain linker). O pooling que interessa a campanha é o do Meta.
- **Consentimento**: Pixel e GA4 só montam depois do aceite (`ConsentGate` + `CookieBanner`), sem CMP
  externo. É o que o `/aviso-legal` declara ao visitante.

## 8 · `property` e literais proibidos

`property` é injetado no funil (`trackConversion` / payload do CAPI), nunca nos ~20 pontos de chamada,
e vem **depois** do spread dos params: se um chamador mandar `property`, a taxonomia do repo vence. É
hardcoded de propósito — env errado mandaria a property errada para o pixel compartilhado.

Nenhum ponto de disparo escreve `"atrativos"` ou `"transfer"` à mão: importa `VERTICALS.*` /
`NICHE_KEYS.*`, que usam `satisfies` contra os types — acrescentar valor ao type sem acrescentar ao
objeto não compila. É o que impede a lista ficar velha em silêncio.

## 9 · Telemetria 1st-party: a allowlist manda

`app/api/track/route.ts` grava só o path que está na allowlist (`STATIC_PATHS` + regex dos destinos).
Rota fora dela é descartada com 204 — **sem erro, sem log**: o sintoma é um dashboard sem aquela
página. Ao criar rota estática, adicionar aqui **e** o rótulo em `lib/metrics.ts` (`pageLabel`).

A allowlist é explícita por motivo concreto: `/transfer` já entrou um dia só porque o slug do nicho
coincidia com a rota, e slug de URL muda por SEO enquanto a rota fica. O mesmo vale para os nomes de
`cta_type`, que alimentam o relatório "cliques por tipo".

Eventos em lote (o navegador acumula e manda ~20s ou a cada 20 eventos) → `recordEvents` faz **um**
INSERT por lote, não um por evento: cada round-trip acorda o compute do Neon.

## 10 · Impressão, CTR e prestação de contas

`ImpressionObserver` registra "viu o card" uma vez por parceiro por visita (dedupe em localStorage).
Impressão + `cta_click` com o mesmo slug de negócio = reach e CTR por parceiro, que é de onde sai a
prestação de contas a quem paga plano. **Não** sai do Meta: o parceiro rotaciona, e `partner_slug` é
atribuição, não segmentação — nunca fundar público ou Conversão Personalizada nele.

Páginas hub (lista de cards) ficam com `PageView` + impressões. Nunca `ViewContent` no load de um hub.

## 11 · `Lead` e o roteamento que o valida

O `Lead` do Meta afirma que a pessoa pediu algo; o banco guarda os sinais brutos (`wants_transport`,
`is_local`, `already_in_foz`, `item_slugs`, `visit_date`). Regra de produto que depende de sinal tem de
ler o **mesmo** campo nos dois lados — sinal que só existe na UI (ex.: resposta de qualificação de um
bloco que não chegou a renderizar) não pode carimbar o evento como se a pessoa o tivesse dado.

**Transporte é SEMPRE `transfer=true` no `Lead` (fato do produto, não sinal da pessoa).** Todo atrativo
do catálogo é reserva com transporte incluso: o modal NÃO pergunta Sim/Não, o mini-card do assunto
anuncia "Transporte já incluído" e a submissão vai com `wantsTransport: true` incondicional (pixel,
CAPI, banco e known-lead — o bônus transfer `+4` vale para todo lead, factualmente). Consequências
travadas: (a) o evento `cta_click "modal_transport_offer"` (vertical `transporte`) NÃO existe — sem
oferta exibida não há clique para contar, e dispará-lo por submit inflaria o vertical; (b) o passo de
funil `transport_check` não existe mais (nada é perguntado); (c) transporte NÃO é configurável: não
existe toggle no admin (as chaves `transport_offer_enabled`/`transport_no_agency_enabled` foram
deletadas do `app_settings` pelo migrate) nem copy editável — `OfferConfig.transportOffer` só carrega
o `agencySlug` (atribuição do pixel), e `/api/leads` grava `wants_transport` espelhando o corpo sem
gateway nenhum: o modal manda `true`, logo todo lead novo nasce `true` (nunca `false`/`null` por
configuração; `null`/`false` só existem em linhas anteriores à decisão).

## 12 · Chaves locais

`localStorage` e cookies de sessão usam o prefixo `cp_` (`cp_cookie_consent`, `cp_vid`, `cp_sid`,
`cp_imp`, `cp_known_lead`, `cp_lead_success_handoff`, `cp_ticket_offer_draft`, `cp_admin_session`).
Não introduzir prefixo de outro projeto: é vocabulário de satélite e aparece no DOM de quem inspeciona.

## 13 · Conversões Personalizadas e prioridade

Param primeiro, painel depois. Conversões Personalizadas são filtros **retroativos** — criar hoje ou
em três meses dá o mesmo resultado sobre os mesmos eventos; o que não é retroativo é o parâmetro no
evento enviado. Vale criá-las algumas semanas antes de ligar a campanha para enxergar volume acumulado
do filtro antes de gastar dinheiro descobrindo que o evento não tem massa.

Uma Conversão Personalizada opera sobre **um** evento (sem OR entre eventos); Público Personalizado
aceita OR.
