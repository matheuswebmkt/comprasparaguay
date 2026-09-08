// Filepath: _docs-dev-coder/conventions/telegram.md
// Parte de conventions.md (índice em ../conventions.md)

# CONVENTIONS · TELEGRAM MINI-CRM

> Restrições duras do projeto. NÃO re-propor decisões já travadas aqui.

## 1. Integração serverless

- **Comunicação 100% HTTP (Bot API) + webhook.** PROIBIDO long-polling / `node-telegram-bot-api` —
  não roda na Vercel. Toda a integração vive em `lib/telegram.ts` (fetch puro, no-op sem token,
  nunca lança).
- **Rotas com papéis separados:** saída = `/api/leads` (postagem do card, junto do CAPI); entrada =
  `/api/telegram-webhook` (callback_query + `/start lead_<id>`); saída agendada = `/api/cron/lead-alert`
  (scheduler EXTERNO, ex.: cron-job.org a cada 30 min, `?secret=CRON_SECRET`).
- **Segurança por segredo, não same-origin:** o webhook valida `X-Telegram-Bot-Api-Secret-Token`
  (definido no `setWebhook`); o cron valida `?secret=`. NÃO adicionar guard same-origin a esses dois.
- **Registro do webhook:** `pnpm telegram:setup` (1× por ambiente, ou ao trocar domínio/secret).
  `setWebhook` é GLOBAL por bot — registrar apontando para um túnel de dev sequestra o webhook de prod.
- **Envs:** `TELEGRAM_BOT_TOKEN` (secreto), `TELEGRAM_WEBHOOK_SECRET` (secreto, precisa ser IGUAL no
  local e na Vercel), `TELEGRAM_CHAT_ID` (migração 1× para `app_settings.agency_chat_id`; depois o
  grupo se gerencia SÓ no admin), `TELEGRAM_WEBHOOK_URL` (opcional), `TELEGRAM_TEST_CHAT_ID` (só
  desvia o PING do cron em dev — o card de lead NÃO é desviado), `CRON_SECRET`.
- **Sempre 200 ao Telegram** (exceto 401 de auth) — resposta não-2xx faz o Telegram reenviar em loop.

## 2. Anatomia do card do grupo

- Ordem travada: título fixo (`🟢 NOVA QUALIFICAÇÃO` com agência / `ℹ️ REGISTRO DE NOVA QUALIFICAÇÃO`
  sem) → linha em branco → assunto (`📅 <b>Reservas</b>`) → **NOMES dos itens escolhidos** → linha em
  branco → nome, contato (onde puder), perfil, idioma, dia, pessoas, transporte → `🕐 Enviado em: HH/MM`.
- **O card lista os NOMES dos atrativos** (`atrativoNomes`, `lib/lead-card.ts` — fonte única,
  `getAttractionBySlug`; slug órfão cai cru). Neste projeto a página de pedido `/r/[token]` NÃO existe
  (foi removida), então a lista no card é a única fonte do "o que foi pedido" — o vendedor precisa
  enxergar as escolhas sem perguntar. Vale para TODOS os montadores (`baseLines` é a fonte única):
  novo card, log, info-only e as edições pós-claim/confirm reconstroem a lista.
- Nenhuma edição pode encolher o card: as edições reescrevem a mensagem inteira com todas as linhas
  originais, trocando só o rodapé.
- **Modo passivo nunca deixa o lead sem canal** (`notifyLeadLog`/`editLeadCard`): com sucesso "Só
  mensagem", o card do grupo carrega o botão [📲 Iniciar conversa] — wa.me com voz corrente
  (`getWaGreetingFor`, portal × agência) — porque é o ÚNICO canal (o lead não ganha botão no site);
  com sucesso "Iniciar conversa", permanece o gate [✅ Confirmar] antes de liberar o botão. A copy
  dos cards passivos fala em nome de quem atende (agência ativa × portal) — nada de "Modo Central"/
  "número central", nomeação do cenário antigo.
- ⛔ Nunca envolver texto do card em `<pre>` (vira bloco de código no Telegram). `esc()` obrigatório
  em todo valor interpolado.
- Linha de transporte é só `🚐 Transporte: incluído` (sem nomear agência) — transporte é fato do
  produto (§11 de tracking-metricas), não escolha do lead.
- Rótulo de hora sempre `🕐 Enviado em:` (uma etiqueta só para o mesmo fato). `formatBRT` para data
  que não é "agora"; `nowBRT()` só para disparos do momento.

## 3. Mensagem wa.me (as três superfícies)

- Estrutura: introdução (por produto, código — `lib/offer-defaults.ts`) → resumo de uma linha → lista
  `"Incluído: <nomes>"` (prefixo "Incluído", não "Para" — o resumo já abre com "Para o dia"). Blocos
  separados por linha em branco. Fonte única: `buildWaMessage`
  (`lib/pedido-resumo.ts`); modal, webhook (pós-claim/confirm/DM) e página de obrigado usam a MESMA
  lista (`listaPedidos` + `atrativoNomes`).
- **A introdução tem VOZ CONDICIONAL** (`greetingFor`, webhook): com AGÊNCIA definida e plano vigente,
  `waGreetingAgency` — "Aqui é a agência {agencia}. Recebemos…" (`{agencia}` = nome da agência ativa,
  pré-preenchido no webhook); sem agência ativa, `waGreeting`, em nome do portal ("Aqui é do Compras
  Paraguay. Vi…"). Os resumos/lista seguintes são iguais nas duas vozes. Textos vivem em
  `DEFAULT_PRODUCT_COPIES` (editores de texto do admin desativados).
- **Resumo do atrativo NÃO tem contagem** ("5 atrativos" saiu — a lista de nomes conta por si) e a
  data vem com "Para o dia" embutido (`resumoCurto`). A frase de transporte é o FATO do produto —
  "Transporte incluído" — igual nas duas vozes ("lead" × "agencia", parâmetro mantido só como
  assinatura: /obrigado e wa.me mostram a mesma linha).
- **`{pedidos}` placeholder** nos textos por produto (`waGreeting`/`waGreetingAgency`/`waLeadText`,
  `lib/offer-defaults.ts`): vira "a reserva"/"as reservas" (pt), "the booking(s)" (en),
  "la(s) reserva(s)" (es) conforme o nº de itens — singular/plural obrigatório. Substituído por
  `fillPedidos` no momento da composição; texto sem placeholder sai intacto. Na voz agência existe
  também `{agencia}` (nome da agência ativa).
- **Vocabulário do produto é RESERVA, nunca "ingresso"**: os atrativos do catálogo são todos reserva
  de data. `itensKind` só existe como legado de rótulo no card.
