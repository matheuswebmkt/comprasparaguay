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
  (scheduler EXTERNO, cron-job.org a cada 60 min, `?secret=CRON_SECRET`; régua do atraso:
  `LEAD_ALERT_MIN` = 2 min — com cadência horária, todo lead sem resposta é pingado no ciclo
  seguinte, e o webhook apaga o ping ao assumir/confirmar o último).
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

- Ordem travada: título fixo (`🔴 NOVA QUALIFICAÇÃO` com agência / `ℹ️ REGISTRO DE NOVA QUALIFICAÇÃO`
  sem) → linha em branco → assunto (`📅 <b>Reservas</b>`) → **NOMES dos itens escolhidos** → linha em
  branco → nome, perfil, idioma, dia, pessoas, transporte → `🕐 Enviado em: HH/MM`.
- **⛔ O número de WhatsApp NUNCA aparece no texto do card** — em nenhum cenário (novo, log, edição
  pós-claim/confirm). Ele só circula como BOTÃO: [📲 Iniciar conversa] (liberado ao Confirmar, ou já
  presente no modo passivo "Só mensagem" e no card sem agência) e [📲 Receber WhatsApp do cliente],
  que manda o número no PRIVADO de quem assumiu. Nenhum caminho de renderização aceita mais número
  no texto (`detailLines` nem tem o campo).
- **Abaixo do assunto do card vai o LINK do resumo**: `🔗 {SITE_URL}/r/<token>` (`pedidoLink`), em vez
  dos nomes dos atrativos — o detalhe do pedido abre na página `/r` (mesmo link das mensagens de
  WhatsApp). Sem token (lead legado anterior ao token), cai na lista de nomes (`atrativoNomes`,
  `lib/lead-card.ts`) pra não deixar o card sem fonte do "o que foi pedido". Vale para TODOS os
  montadores (`baseLines` é a fonte única): novo card, log, info-only e as edições pós-claim/confirm
  reconstroem a linha.
- Nenhuma edição pode encolher o card: as edições reescrevem a mensagem inteira com todas as linhas
  originais, trocando só o rodapé.
- **Modo passivo é SEMPRE gate [✅ Confirmar]** (`notifyLeadLog`/`editLeadCard`), independente do modo
  de sucesso do produto (mesma regra do RoteiroFoz): o WhatsApp do lead fica OCULTO até um vendedor
  tocar Confirmar — a edição então libera o botão [📲 Iniciar conversa] na voz corrente
  (`getWaGreetingFor`, portal × agência). No modo "Assumir" o botão é liberado SÓ pra quem assumiu
  (claim atômico; [📲 Receber WhatsApp do cliente] manda o número no privado do dono). O modo do bot
  governa SÓ a distribuição do card — não interfere no que o lead vê no site. A copy dos cards
  passivos fala em nome de quem atende (agência ativa × portal) — nada de "Modo Central"/
  "número central", nomeação do cenário antigo.
- ⛔ Nunca envolver texto do card em `<pre>` (vira bloco de código no Telegram). `esc()` obrigatório
  em todo valor interpolado.
- Linha de transporte é só `🚐 Transporte: incluído` (sem nomear agência) — transporte é fato do
  produto (§11 de tracking-metricas), não escolha do lead.
- Rótulo de hora sempre `🕐 Enviado em:` (uma etiqueta só para o mesmo fato). `formatBRT` para data
  que não é "agora"; `nowBRT()` só para disparos do momento.

## 3. Mensagem wa.me (as três superfícies)

- **Formato padronizado, LIMPO: introdução + `Ver resumo: <link>`** — nada mais. Sem resumo de uma
  linha, sem lista "Incluído: …", sem placeholder `{pedidos}`. Todo o detalhe do pedido (itens, data,
  pessoas, transporte) concentra na página pública `/r/<public_token>` (montada por `waMessageWithLink`,
  `lib/pedido-resumo.ts` — `{SITE_URL}/r/<token>`; a página renderiza no idioma do lead, sem PII,
  fonte `lib/pedido.ts` + dicionário `lib/i18n/pedido.ts`). A introdução é uma frase única e os TEXTOS
  vivem em `DEFAULT_PRODUCT_COPIES` (editores de texto do admin desativados):
  - `waGreeting` (voz do portal): "Olá {nome}! Aqui é do Compras Paraguay. Vou te passar as condições do seu pedido."
  - `waGreetingAgency` (agência ativa, `{agencia}` pré-preenchido no webhook): "Olá {nome}! Aqui é a agência {agencia}. Recebemos seu pedido feito no Compras Paraguay. Vou te passar as condições."
  - `waLeadText` (o que o LEAD manda ao clicar no CTA do site): "Olá! Vim pelo Compras Paraguay. Gostaria de receber as condições do meu pedido."
- **A introdução tem VOZ CONDICIONAL** (`greetingFor`, webhook): com AGÊNCIA definida e plano vigente,
  `waGreetingAgency`; sem agência ativa, `waGreeting` (voz do portal). Sem token (lead legado anterior
  ao token) a mensagem sai só com a introdução — `waMessageWithLink` omite a linha do link em vez de
  montar endereço quebrado.
- **O card do grupo NÃO mudou**: continua completo (nomes, dia, pessoas, transporte, horário) — é o
  briefing do vendedor. O handoff de /obrigado NÃO carrega resumo/lista: a página exibe só confirmação
  + link "Ver resumo" para `/r/<token>` (e o CTA de WhatsApp quando o modo de sucesso é "Iniciar
  conversa").
- **Vocabulário do produto é RESERVA, nunca "ingresso"**: os atrativos do catálogo são todos reserva
  de data. `itensKind` só existe como legado de rótulo no card.
