// Filepath: \_docs-dev-coder/architecture/leads-modal-telegram.md
// Parte de architecture.md (índice em ../architecture.md)

# ARCHITECTURE · CAPTURA DE LEADS, MODAL, TELEGRAM

> Fonte única de verdade para caminhos, módulos e fronteiras.
> Cabeçalhos `###` PRESERVADOS do arquivo original — referências cruzadas continuam válidas.

---

### Captura de leads + Meta CAPI
- **Fluxo de operação do lead (componível, textos editáveis):**
  - **`lib/offer-defaults.ts` (client-safe):** tipos (`OfferConfig`/`ModalTexts`/`RoteiroSuccessMode`/
    `BotMessageMode`/`ProductCopies`/`TransportOffer`/`AttractionOfferPublic`) + `DEFAULT_OFFER`/
    `DEFAULT_PRODUCT_COPIES`/`TEXT_KEYS`/`PARTNER_ACTION_KEYS` (registro central das chaves de
    `app_settings`). Sem import de DB — usado no client (provider/modal) sem puxar o Neon.
  - **`lib/offer-settings.ts` (server):** importa dos defaults e adiciona o DB
    (`getOfferConfig`/`saveOfferConfig`/`getOfferConfigCached`, `app_settings`). Getters BRUTOS
    (`getTransportEnabledRaw`, `getTransportNoAgencyEnabled`, `getAgencyChatIdRaw`) sempre distintos
    do valor EFETIVO que `getOfferConfig` monta — cada toggle lê/grava a própria chave; nunca cruzar.
    Captura é **sempre ativa** (não há mais toggle "captura ligada/desligada").
  - `TicketOfferButton` sempre abre o modal (`window.dispatchEvent("ticket-offer:open", detail)`) e
    chama `track({type:"cta_click", ctaType, itemSlug, destination:"#", utm})` — `destination:"#"` de
    propósito (o clique abre o modal, não navega a lugar nenhum).
  - `CtaModeProvider` (`useOfferConfig`) recebe a config **assada** do root layout como prop
    `initial`, sem fetch/delay/race no client.
  - **Config assada no SSG:** `getOfferConfigCached` (`unstable_cache`, tag `offer-config`) é lida no
    root layout → a config entra no HTML estático; CTA e modal já nascem corretos no 1º render. Ao
    salvar no admin, `revalidateTag('offer-config')` regenera em segundos, sem redeploy. Páginas de
    SEO seguem estáticas.
  - **Um único fluxo de modal, form no final** — não existe mais variante A/B nem tela de sucesso
    inline no modal em si (a "tela de sucesso" vive na página, ver `LeadSuccessScreen` abaixo). O
    `TicketOfferModal` (dentro do provider) renderiza, nesta ordem, com gate sequencial (cada bloco
    só aparece depois do anterior respondido): card do assunto (roteiro/atrativo) → calendário
    (`DayCalendar`, atrativo + roteiro pronto/personalizar) → "Para quantas pessoas?"
    (`QuantityStepper`, TODO produto do modal) → qualificação (morador/já-em-Foz) → transporte (se
    visível) → formulário
    (nome/e-mail/WhatsApp). Todos os textos vêm de `offer.texts`/`offer.productCopies` (produto único:
    atrativo). Não editáveis (fixos): microcopy de Termos/LGPD e placeholders.
  - **Contexto do produto:** `lib/roteiro-lead.ts` — `LeadContext = "ingresso" | "roteiro" |
    "atrativo"`, derivado do `detail` de abertura (`isRoteiroLeadContext`/`isAtrativoLeadContext`).
  - **Calendário + pessoas (D5/D6):** `components/ticket-offer/DayCalendar.tsx` (extraído — usado
    pelo modal E pelo wizard, ver abaixo), `QuantityStepper` (clamp 1–999; a pergunta é PESSOAS e vale
    para todo produto — ver `conventions/funil-modal.md` §2-ter). ⚠️ O teto do stepper e o do `clipQty`
    do servidor têm de coincidir: divergindo, Pixel e CAPI mandam números diferentes no mesmo
    `event_id` (G1). Dia
    bloqueia só o passado; quantidade nunca bloqueia o gate (sempre tem valor válido). Persistência
    no `known-lead` (localStorage) pro DIA — é preferência da pessoa na jornada, com regra de
    vencimento (data passada não volta); a QUANTIDADE fica só no rascunho de sessão.
  - ⚠️ **O wizard `/montar-roteiro` não existe mais** (rota removida): todo submit de lead passa
    pelo modal (`/api/leads`).
  - Admin: `components/admin/OfferModeControl` (editor rascunho→Salvar, seções: bloco topo "Sem
    agência com plano ativo" [transporte sem agência + "atender você mesmo"] → 1 Modal (modo de sucesso
    + pré-visualização só-leitura) → 2 Bot Telegram → 4 Agência (nº de WhatsApp, grupo, transporte) →
    5 Ingresso por atrativo) → `POST /api/admin/offer-config`. Mora em `/admin/dashboard/oferta`.
  - ⚠️ **O admin não edita TEXTO** (ago/2026). Toda a copy do modal, nos 3 idiomas, vive em
    `lib/offer-defaults.ts`. As seções 3 e 3b foram desativadas e estão comentadas no fim do
    `OfferModeControl.tsx` com o passo a passo de reativação. São **três** trancas (payload, gravação
    no server, DELETE no `schema.sql`) e a leitura segue intacta — o porquê de cada uma está em
    `conventions/funil-modal.md` §2-bis, que é onde essa regra mora.
  - **Transporte — `transportVisible = offer.transportOffer.enabled`, e nada mais.** Sem gate por
    produto (`isAtrativoCtx &&`) nem por agência (`agencyActive &&`): aparece em ingresso de atrativo,
    roteiro pronto e personalizar igualmente. É uma **pergunta Sim/Não** (`SimNao`, o mesmo componente
    da qualificação) e **bloqueia** o form até ser respondida — o estado é tri-state
    (`transportWanted: boolean | null`), e a recusa é uma resposta guardada como qualquer outra. Sem
    agência com plano vigente ele ainda pode aparecer
    (`transportNoAgencyEnabled`, chave independente de `transportOffer.enabled` — nunca cruzar as
    duas): marcar só registra o sinal (`wants_transport`), não roteia notificação sozinho — quem
    decide isso é o toggle "atender você mesmo", abaixo. A resposta consolida entre produtos (rascunho de sessão +
    `known-lead.wantsTransport`) e, uma vez consolidada, o card some do form e vira uma linha do card
    de resumo. Ver `conventions/funil-modal.md` §2.
  - **Ingresso por atrativo (seção 5 do admin):** `lib/attraction-offers.ts` — 3 modos por atrativo
    (`direct` = link oficial de verdade, independente da captura de lead; `agency` = cai no fluxo de
    lead normal; `capture` = modal adaptado ao atrativo, foto+nome, sem cabeçalho, sucesso com botão
    de continuar pro site do atrativo). `attractionOffers: Record<slug, AttractionOfferPublic>` no
    `OfferConfig`, sempre completo pro catálogo inteiro.
- **`app/api/leads/route.ts`:** nodejs/force-dynamic. Same-origin guard (`lib/same-origin.ts`,
  hostname exato — fonte única, ver mais abaixo), rate limit (visitor_id/ip_hash),
  dedup→reconciliação (ver Telegram Mini-CRM abaixo), payload rico (UTM completo,
  `session_id`/`visitor_id`, `lgpd_consent`, `page_path`, geo Vercel, `event_id`, `visit_date`/
  `ticket_qty`), insert no Neon (no-op sem DB) e chamada ao CAPI. Auto-cria/migra `leads` com o
  schema completo (rede de segurança, idempotente).
- **`lib/meta-capi.ts`:** `sendLeadToCapi()` — POST para Graph API `/{pixel}/events`, evento `Lead`,
  PII (`em`/`ph`) hasheada SHA-256, `fbp`/`fbc`/IP/UA, `event_id` casado com o Pixel (dedupe). No-op
  sem `META_CAPI_TOKEN`.
- **Eventos:** a escada do modal (`InitiateCheckout` na abertura → `Lead` no submit, com `eventID`
  para dedupe Pixel↔CAPI → `Contact` nas saídas) e a tabela de **onde cada evento nasce** vivem em
  `architecture/analytics-cookies.md`, seção "Pixel de portfólio" — fonte única, não duplicar aqui.
  Cada disparo vai a Meta **e** GA4 (`lib/analytics.trackConversion`).
- **Tabela `leads` (`db/schema.sql`):** `nome`/`whatsapp` nullable (rascunho de abandono pode ter só
  nome) + `assigned_partner` (carimbado com a agência ativa quando o lead é roteado a ela,
  `lib/agencies.getActiveAgencySlug`), `lgpd_consent`, `page_path`, `session_id`, `visitor_id`, UTM
  completo, `country`/`city`, `referrer`, `user_agent`, `event_id`,
  `telegram_message_id`/`claimed_by`/`claimed_by_id`/`claimed_at` (Telegram Mini-CRM),
  `superseded_by` (reconciliação, ver abaixo), `abandoned`/`cta_shown`/`cta_clicked`/
  `success_cta_type`/`product_signature`, `is_local`/`already_in_foz`, `lead_context`/`roteiro_slug`/
  `roteiro_titulo`/`roteiro_resumo`, colunas estruturadas do wizard
  (`roteiro_dias/pessoas/orcamento/perfil/gastro/hotel/transfer`), `visit_date`/`ticket_qty` (D5/D6).
  `selected_offers`/`wants_hotel` seguem na tabela como colunas órfãs reversíveis (features
  removidas do funil de lead, dado preservado por decisão do usuário — não dropar). Migração:
  `pnpm db:migrate`.
- **Pedido público — `leads.public_token` (12 chars
  url-safe, único, sem expiração) e `leads.item_slugs` (csv de SLUGS) ainda existem no banco, mas a
  rota `app/r/[token]` foi removida e as mensagens de WhatsApp/Telegram **não geram mais o link**
  (simplificação Compras PY). Caso a página do pedido volte, os campos seguem preservados.
  url-safe, único, sem expiração) e `leads.item_slugs` (csv de SLUGS de atrativo, nunca nomes — a
  página resolve pelo catálogo e linka cada um) alimentam a página do pedido. `roteiro_vivencia` ganhou
  coluna própria pelo mesmo motivo: a página precisa da resposta estruturada, e ela só existia dentro do
  texto do `roteiro_resumo`. `/api/leads` gera o token no insert e o devolve como `pedidoToken`.
  ⚠️ `getPedido()` segue `superseded_by` num salto (§12-ter): sem isso, o link que a pessoa já tem
  mostraria um pedido superado depois de um reenvio.
  ⚠️ **`item_slugs` vem PRONTO do client** nas duas origens (modal + ingressos extras, roteiro
  pronto/dias avulsos). O servidor não re-deriva de `content_ids`/`item_slug` — seria
  uma segunda regra para o mesmo dado, o padrão de divergência que G1 existe para impedir.
- **Env:** `META_CAPI_TOKEN` (secreto, Events Manager). Reusa `NEXT_PUBLIC_META_PIXEL_ID`.
- **Guarda same-origin — `lib/same-origin.ts`:** fonte única (`isSameOriginRequest(req)`), usada por
  `/api/leads`, `/api/leads/draft`, `/api/leads/success`, `/api/track`,
  `/api/modal-track`, `/api/contact`. Compara o **hostname parseado** do `origin`/`referer` contra o `host`, exato e
  case-insensitive — não `endsWith`/`includes` (aceitava domínio sósia). Continua valendo se `origin`
  **ou** `referer` casar (sendBeacon nem sempre manda os dois); sem nenhum dos dois → bloqueia.
- **Anti-bot do modal — Cloudflare Turnstile:** `lib/turnstile.ts` (`verifyTurnstile`, no-op sem
  `TURNSTILE_SECRET_KEY`, fail-open em erro de rede) + `components/ticket-offer/TurnstileWidget.tsx`
  (client, no-op sem `NEXT_PUBLIC_TURNSTILE_SITE_KEY`). O modal carrega o script, renderiza o widget
  antes do submit, exige o token e o `/api/leads` valida **antes** de gravar/CAPI/Telegram (bot →
  403). `window.turnstile` tipado em `types/global.d.ts`. **+ Honeypot** (sempre ligado): input
  invisível; se preenchido, o `/api/leads` dropa em silêncio (204) antes de tudo.
- **Persistência + dedupe → reconciliação:** `lib/lead-dedup.ts` (`LEAD_DEDUP_WINDOW_MIN`,
  client-safe) é a fonte única lida por `app/api/leads/route.ts` (server) e `lib/known-lead.ts`
  (client, lead conhecido em `localStorage`, TTL 90d — pré-preenchimento entre produtos/páginas;
  carrega contato + `isLocal` + `wantsTransport` como atributos estáveis da pessoa, e `alreadyInFoz`
  com TTL próprio de 1 dia).
  `app/api/leads/draft/route.ts` grava rascunho de abandono (`leads.abandoned=true`) via
  `sendBeacon` no fechar do modal/`pagehide`, idempotente por `session_id`; o submit real exige
  `abandoned=false` no match e, ao gravar, deleta os rascunhos da mesma sessão. Reenvio do MESMO
  produto dentro da janela → ver "Reconciliação" na seção Telegram abaixo (não é mais um simples
  "pula a notificação"). `app/api/leads/success/route.ts` marca `cta_shown`/`cta_clicked`/
  `success_cta_type` na linha do lead, localizado por `modal_id` — chamado por
  `components/obrigado/ObrigadoContent.tsx`.

### Telegram Mini-CRM — "Assumir Lead", cenário sem agência, reconciliação
- **Objetivo:** ao capturar um lead, avisar o grupo de vendedores no Telegram e deixar um vendedor
  "assumir" o lead 1:1 sem colisão — ou, sem agência pra atender, ainda registrar o lead como card
  informativo. Serverless puro: só HTTP/webhook, sem long-polling.
- **`lib/telegram.ts`:** módulo puro (sem DB, sem `app/data/*`) sobre a Bot API via `fetch`. No-op
  sem `TELEGRAM_BOT_TOKEN`; nunca lança. Exports principais:
  - `notifyNewLead` (modo `assume`: botão "Assumir Lead", `callback_data=claim:<id>`, WhatsApp
    oculto) · `notifyLeadLog` (modo `passive`: log com WhatsApp visível, sem botão — ou com botão
    `[✅ Confirmar]` quando `confirmFlow`) · `notifyLeadInfoOnly` (cenário SEM AGÊNCIA: card com o
    botão URL `[📲 Iniciar conversa]` já liberado, via `infoOnlyKeyboard` — usa
    `baseLines(..., {infoOnly:true})`, headline distinto `ℹ️ REGISTRO DE NOVA QUALIFICAÇÃO`).
  - `editLeadCard`/`editInfoOnlyCard` (reconciliação — reescrevem o card pendente com os dados do
    reenvio, ver abaixo) · `editClaimedMessage`/`editConfirmedMessage` (edições pós-claim/confirm).
  - `deleteMessage`/`sendPendingAlert`/`formatWait` (ping de lead pendente, ver abaixo).
  - `formatClaimer`, `buildWaUrl`, `getBotUsername`, `buildStartDeepLink`, `answerCallbackUrl`,
    `sendPrivateText`, `sendPrivateWa` (DM). Mensagens em `parse_mode:HTML`.
  - `baseLines(opts)`/`leadHeadline(infoOnly)` montam o cabeçalho — título fixo + a linha do assunto
    (`🎫 Ingressos` ou `🗺️ Roteiro: <título>`) + a linha do LINK do pedido (`🔗 …/r/<token>`). O card
    não lista itens: a lista vive na página. `detailLines(n, {whatsapp})` monta o corpo na ordem fixa
    nome → contato → perfil →
    idioma → dia → ingressos → transporte. São a fonte ÚNICA das duas coisas (a ordem completa do card
    está em `conventions/telegram.md` §12): reusar ao adicionar uma notificação nova, nunca
    duplicar a construção de linhas (foi copiando esse bloco que o card do "Assumir" ficou para trás
    das correções aplicadas aos outros — ver `conventions/telegram.md` §12).
  - `productKind` (bucket de `productKindOf`, `lib/lead-card.ts`) vem do CHAMADOR: este módulo é puro
    e não deriva contexto de lead.
- **`lib/lead-card.ts`:** `isRoteiroLead`/`productKindOf` — derivam, a partir do contexto do lead
  (`leadContext`/`roteiroSlug`/`roteiroTitulo`/`ctaType`), se é lead de roteiro (escolhe o modo de
  sucesso a checar) e qual bucket de produto ele usa (rótulo da linha do assunto no card + saudação do
  wa.me). Existe porque `/api/leads` (corpo da requisição atual) E `/api/telegram-webhook` (linha já
  gravada no banco) precisam da MESMA derivação — fonte única.
- **`app/api/leads/route.ts` — três ramos de notificação**, todos alimentados pelo mesmo
  `noticeBase` (computado uma vez, fora do `if`):
  1. **`sendAgency` true** (agência com plano vigente + ingresso "querido" + turista ou aceita
     morador): reenvio do MESMO produto com card ainda PENDENTE (`claimed_by is null`) →
     `editLeadCard` reescreve aquele card (`🔄 Atualizado em:`); senão → `notifyLeadLog`/
     `notifyNewLead` normal (card novo).
  2. **Sem agência com plano vigente** (`!agencyActive`, onde `agencyActive = offer.agencyDefined`,
     já plan-gated): **se** o toggle "atender você mesmo" estiver ligado, reescreve um card sem-agência pendente
     existente (`editInfoOnlyCard`) ou manda um novo (`notifyLeadInfoOnly`). A leitura do toggle é
     por lead, então cobre também o vencimento silencioso — sem nada "armar" nada.
  3. Nenhuma das duas: só grava, sem Telegram.
- **Reconciliação "um cliente, um card" (Sprint 6):** reenvio do MESMO produto dentro da janela de
  dedup (`product_signature`, SEM `is_local`/`already_in_foz` no match — uma pessoa mudando de
  resposta de qualificação ainda conta como o mesmo pedido) **reescreve** o card que já está no
  grupo em vez de empilhar um segundo. Card anterior reescrevível = existe, PENDENTE
  (`claimed_by is null`) e — no ramo sem agência — `assigned_partner is null` (proxy exato de "é um card
  sem agência", já que não existe coluna `info_only`: `assigned_partner` só é preenchido quando o lead é
  roteado de verdade). Ao reconciliar: `telegram_message_id` migra pro lead NOVO; o lead ANTIGO é
  marcado com `superseded_by = <id do novo>` e tem `telegram_message_id` zerado — a cadeia fica
  sempre PLANA (nunca A→B→C; qualquer resolvedor de `superseded_by` precisa de um salto só). **Sem
  fallback** pra `sendMessage` quando a edição falha (reenvio idêntico gera texto idêntico, o
  Telegram responde "message is not modified", e o card certo já está no grupo — um fallback
  recriaria a duplicata que a reconciliação existe pra evitar). Já assumido/confirmado → não
  reescreve, cai no card novo normal (reescrever apagaria o "✅ Assumido por X" e o botão do dono).
- **Sem agência com plano vigente — o dono atende (Sprint 5, revisto):** `agency_info_only_no_plan`
  (toggle no admin, bloco "Sem agência com plano ativo", rotulado "Receber os leads no grupo e
  atender você mesmo", default `false`/opt-in). Ligado, o lead vira card no grupo **com o CTA de
  conversa liberado** (`wa.me` + saudação do produto) — sem claim, porque não há fila a disputar.
  É exceção deliberada à anti-colisão do §12, válida SÓ aqui: ver `conventions/telegram.md`.
  **O toggle é autoridade única e nada o altera automaticamente** — o valor definido no momento da
  queda vale nos dois sentidos, inclusive um "Não". Como `/api/leads` lê a chave a cada lead, o
  vencimento **silencioso** (sem ação no admin) é coberto sem mecanismo extra. ⛔ Houve um "auto-arm"
  (portado do RG) que ligava o toggle sozinho na queda; foi removido por decisão do usuário — ver
  `conventions/telegram.md` §12-bis para o motivo estrutural de não ressuscitá-lo.
- ⛔ **Não existe "2º ponto de contato" de transporte.** Houve uma rota `/api/leads/transport` + uma
  pergunta pós-envio na página de obrigado (Sprint 7); as duas foram REMOVIDAS por decisão do
  usuário. Motivo conceitual, não de implementação: transporte é atributo **da PESSOA** (consolidado
  em `lib/known-lead.ts` `wantsTransport`, localStorage, cross-aba e cross-produto), e o pós-submit
  só enxerga **uma submissão** — o handoff dela é `sessionStorage`, por aba. Na prática a
  mesma pessoa era perguntada de novo noutra aba, e o clique não voltava pro `known-lead`, então o
  modal reabria contradizendo a resposta. A pergunta vive no modal. Ver
  `conventions/funil-modal.md` §17-bis.
- **Ping de lead pendente (Sprint 11):** `lib/lead-alerts.ts` — `LEAD_ALERT_MIN=30`,
  `countOverdueLeads`/`getOverdueLeads` (leads com `assigned_partner is not null and
  telegram_message_id is not null and claimed_at is null`, há mais de `LEAD_ALERT_MIN` minutos — os
  dois filtros já excluem de graça os cards sem agência, `assigned_partner is null`, e os leads
  superados pela reconciliação, `telegram_message_id` zerado). `app/api/cron/lead-alert/route.ts`
  (GET/POST, protegido por `?secret=CRON_SECRET`, chamado por um scheduler externo a cada ~30min, só
  dentro do horário 06h–23h BRT) apaga o ping anterior e manda um novo com nome+tempo de espera de
  cada atrasado (`sendPendingAlert`/`formatWait`), ou apaga se não sobrar nenhum. `app/api/
  telegram-webhook/route.ts` também chama `clearPendingAlertIfAllDone()` depois de qualquer
  claim/confirm bem-sucedido — apaga o ping na hora, não só no próximo ciclo de cron. Estado mínimo
  em `app_settings` (`pending_alert_message_id`), sem tabela nova.
- **`app/api/telegram-webhook/route.ts`:** autentica por `secret_token` do Telegram (401 se não
  bater); sempre responde 200 (exceto 401). Trata `callback_query` e `message`: `claim:<id>` =
  **UPDATE atômico** (`set claimed_by=?, claimed_at=now() where id=? and claimed_by is null
  returning ...`); `confirm:<id>` = sem claim atômico (mesmo WhatsApp central pra todos, qualquer
  vendedor confirma); `wa:<id>` = só o dono (`from.id===claimed_by_id`). Dono → DM direto
  (`sendPrivateWa`); só na 1ª vez cai no deep-link `t.me/<bot>?start=lead_<id>`.
- **`scripts/telegram-setup.mjs` / `pnpm telegram:setup`:** registra o webhook (`setWebhook` com
  `secret_token`, `allowed_updates:["callback_query","message"]`, `drop_pending_updates`).
- **Dashboard:** `/admin/dashboard/leads` mostra "Assumido por", "Transporte" (chip 🚐), "Dia" e
  "Qtd".
- ⚠️ **Segurança do webhook ≠ same-origin:** `/api/telegram-webhook` é chamado pelos servidores do
  Telegram (origem externa) — a defesa é o `secret_token`, não `lib/same-origin.ts`.
- **Envs:** `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` (migração 1×; grupo se administra no admin
  depois), `TELEGRAM_WEBHOOK_SECRET`, `TELEGRAM_WEBHOOK_URL` (opcional), `TELEGRAM_TEST_CHAT_ID`
  (opcional, destino de teste do ping em dev), `CRON_SECRET` (segredo do scheduler externo do ping).
  Ver `conventions/telegram.md`.
- **Toggle "Enviar lead ao grupo"** (`agency_group_notify_enabled`, default `true`): desliga o ENVIO
  sem apagar `agency_chat_id`. Desligado, `getAgencyChatId()` retorna `null` mesmo com id salvo; o
  admin continua vendo/editando o id via `getAgencyChatIdRaw()` (ignora o toggle, só exibição) —
  esta é a MESMA função usada pelo ramo sem agência (que ignora `agency_group_notify_enabled` de
  propósito: são dois controles independentes).

### Funil do modal (`modal_events`)
- **Objetivo:** medir o `TicketOfferModal` do 1º clique ao envio (e onde os leads abandonam) sem
  poluir a tabela `events` nem os totais de `cta_click`. Modelo: 1 linha por PASSO alcançado por
  ABERTURA (`modal_id` = UUID por open) → o funil por-open é reconstruído com `bool_or(step=...)`
  agrupando por `modal_id`.
- **`db/schema.sql`:** tabela `modal_events (id, modal_id, step, item_slug, cta_type, page_path,
  visitor_id, session_id, created_at)` + índices.
- **`lib/modal-track.ts` (client):** `newModalId()` + `modalTrack(step, {...})` via `sendBeacon`
  (fallback fetch keepalive); reusa `getVisitorId`/`getSessionId` de `lib/track`.
- **`app/api/modal-track/route.ts`:** ingestão dedicada — same-origin guard (`lib/same-origin.ts`) +
  allowlist de `step` + `clip`; insere em `modal_events`; no-op sem DB.
- **`lib/metrics.getModalFunnel(period)`:** CTE `per_open` (flags por `bool_or`) → contagens
  (iniciações, morador Sim/Não, já-em-Foz, campos, enviados, sucesso, cta) + buckets de abandono +
  `transportChecked` + `leads:{total, wantsTransport, locales[]}`. Sem parâmetro por parceiro (o
  modal não tem mais card de oferta de parceiro pra medir participação individual).
- **Dashboard geral + Cofre de leads:** o funil tem a etapa "Marcou incluir transporte" e um painel
  "Leads capturados · transporte e idioma".
