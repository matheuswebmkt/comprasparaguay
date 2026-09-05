// Filepath: \_docs-dev-coder/conventions/telegram.md
// Parte de conventions.md (índice em ../conventions.md)

# CONVENTIONS · TELEGRAM MINI-CRM

> Restrições duras do projeto. NÃO re-propor decisões já travadas aqui.
> Numeração das seções PRESERVADA do arquivo original (§N) — referências cruzadas continuam válidas.

---

## 12. Telegram Mini-CRM — "Assumir Lead"

- **Serverless puro (regra dura):** a comunicação com o Telegram é estritamente HTTP (Bot API) +
  webhook. **PROIBIDO** long-polling / `node-telegram-bot-api` / `.on('message')` — não roda na
  Vercel (trava o serverless). Toda a integração vive em `lib/telegram.ts` (fetch puro, no-op sem
  token, nunca lança) — espelha `lib/meta-capi.ts`.
- **Rotas com papéis separados, não misturar:** (1) saída = `/api/leads` (após o insert, junto do
  CAPI); (2) entrada = `/api/telegram-webhook` escuta o clique (`callback_query`); (3) saída agendada
  = `/api/cron/lead-alert` (ping de lead pendente, §12-quater abaixo — chamado por um scheduler
  externo, não pelo site).
- ⚠️ **Segurança do webhook ≠ same-origin** (exceção à regra do §4): `/api/track` e `/api/leads`
  exigem mesma-origem, mas `/api/telegram-webhook` é chamado pelos **servidores do Telegram** —
  o guard same-origin o quebraria. A defesa correta é o `secret_token` do Telegram: definido no
  `setWebhook` e reenviado no header `X-Telegram-Bot-Api-Secret-Token`; a rota rejeita (401) quem
  não bater. **Não** adicionar same-origin aqui. Mesma lógica pro ping (`/api/cron/lead-alert`): quem
  chama é um scheduler externo, não o navegador — a defesa é `?secret=CRON_SECRET` via query (não dá
  pra configurar headers customizados no scheduler gratuito), não same-origin.
- ⚠️ **Anti-colisão no banco:** o "Assumir" é um **UPDATE atômico**
  `set claimed_by=?, claimed_at=now() where id=? and claimed_by is null returning ...`. O Postgres
  serializa cliques concorrentes → só o primeiro recebe a linha (assume); os demais recebem vazio e
  um alerta "já assumido por X". A prevenção é real (banco), não só visual.
- ⚠️ **O WhatsApp do turista não aparece na mensagem do grupo** (senão qualquer vendedor copiaria o
  número e furaria a colisão). O número só é revelado, via botão URL `wa.me`, ao vendedor que
  assumiu (no `editMessageText`). O grupo é privado (vendedores) — expor o número ali, após o claim,
  é OK.
  ⚠️⚠️ **EXCEÇÃO deliberada: o cenário SEM AGÊNCIA** (§12-bis). Ali o card já nasce com o botão
  `[📲 Iniciar conversa]` liberado, sem claim. A regra acima existe pra impedir que **dois vendedores**
  atropelem o mesmo lead — e sem agência definida não existem dois vendedores: quem atende é o dono do
  site, sozinho. Sem o botão, todo lead capturado nesse período viraria um registro que ninguém
  consegue responder. **Não "consertar" isso de volta**: com agência ativa o comportamento anterior
  segue intacto (Assumir/Confirmar, número escondido até o claim).
- **Entrega do link = botão no grupo:** ao assumir, a mensagem é editada para "✅ Assumido por X" +
  botão `[📲 Abrir WhatsApp do cliente]` (`wa.me/<turista>?text=<saudação>`). Não usar DM privada
  (exigiria o vendedor ter dado `/start` no bot antes). O `wa.me` usa a mesma lógica do cofre
  (`whatsapp.replace(/\D/g,"")`, mantém DDI).
- **Casa com o funil de interceptação (§2):** capturamos o turista e repassamos ao vendedor da
  agência parceira para atendimento 1:1 — o `wa.me` abre o WhatsApp DO VENDEDOR já apontando para o
  número do turista. Zero risco de ban (o bot nunca manda mensagem ao turista; quem inicia é o
  humano no WhatsApp dele) + log organizado (`claimed_by` no cofre).
- **Sempre 200 ao Telegram** (exceto 401 de auth): resposta não-2xx faz o Telegram reenviar o update
  em loop.
- **Registro do webhook:** `pnpm telegram:setup` (`scripts/telegram-setup.mjs`) → `setWebhook` com
  `secret_token`, `allowed_updates:["callback_query","message"]` (o `message` é exigido pelo fluxo
  de DM do TG-4). Rodar 1× por ambiente (ou ao trocar domínio/secret).
- **Envs:** `TELEGRAM_BOT_TOKEN` (BotFather, secreto), `TELEGRAM_CHAT_ID` (grupo, id **negativo**),
  `TELEGRAM_WEBHOOK_SECRET` (secreto, `openssl rand -hex 32`), `TELEGRAM_WEBHOOK_URL` (opcional),
  `TELEGRAM_TEST_CHAT_ID` (opcional, destino de teste do ping de lead pendente em dev — §12-quater),
  `CRON_SECRET` (segredo do scheduler externo do ping). Sem token → tudo vira no-op (o site e a
  captura de lead seguem funcionando normalmente). Na Vercel: Project → Settings → Environment
  Variables. ⚠️ Grupo promovido a supergrupo muda o `chat_id` (o de envio passa a começar com
  `-100…`; o `getChat` ainda resolve o antigo).
- ⚠️ **Bifurcação por `bot_message_mode`:** o disparo no `/api/leads` respeita
  `getOfferConfig().botMessageMode` (independente do modal — ver §2): `assume` → `notifyNewLead`
  (fila, botão Assumir, WhatsApp oculto até o claim); `passive` → `notifyLeadLog` (log, mostra
  nome+WhatsApp, sem botão — ou com botão `[✅ Confirmar]` quando `confirmFlow`, ver "Modo Central +
  Passivo" abaixo). O webhook (`/api/telegram-webhook`) trata `claim:<id>` (só existe no modo
  `assume`) E `confirm:<id>` (só existe no modo `passive`+`confirmFlow`) — não é exclusivo de um
  modo só, cada callback existe no seu modo correspondente.
- ✅ **TG-4 — link `wa.me` travado no dono:** o botão de WhatsApp após o claim não é um botão URL
  (sem visibilidade por-usuário no Telegram) — é um botão **callback** `wa:<id>`. Fluxo: (1) o claim
  grava `leads.claimed_by_id` (user_id do Telegram do dono); (2) qualquer um pode clicar em
  "📲 Receber WhatsApp do cliente", mas o webhook autoriza só o dono (`from.id===claimed_by_id`;
  não-dono → alerta de negado). Dono → tenta DM direto (`sendPrivateWa` no privado dele): se der
  certo (já iniciou o bot antes), o `wa.me` cai direto no privado sem `/start` (o chat privado vira
  o log por vendedor); só na 1ª vez (DM falha, nunca deu Start) cai no deep-link
  `t.me/<bot>?start=lead_<id>` → o dono manda `/start lead_<id>` → o webhook trata o `message`,
  reautoriza e envia o `wa.me`. Exige `allowed_updates` incluir `message` e o username do bot (via
  `getMe`, cacheado). Legado (lead sem `claimed_by_id`) é tratado como aberto. O modo `passive`
  (central) não tem botão — não é afetado.
- ⚠️ **Saudação do `wa.me` é editável POR PRODUTO e por idioma do LEAD:** a mensagem pré-preenchida
  nos botões "📲 Abrir WhatsApp do cliente" / "📲 Iniciar conversa" (`buildWaUrl`) vive em
  **"3b · Textos por produto"** (`productCopies[kind].waGreeting`, `kind` = atrativo | roteiro |
  personalizar), nos 3 idiomas. Vai no idioma que o **lead** escolheu no modal (`leads.locale`), não
  no de quem está no Telegram — quem lê a mensagem é o turista.
  ⚠️ **Por produto, não global.** Existiu uma chave única (`agency_greeting`) presa à seção Agência:
  ela precisava servir a todos os produtos ao mesmo tempo e por isso dizia "ingressos ou roteiro",
  genérica para todo mundo. Além disso, morar na seção Agência sugeria que a mensagem só valia com
  agência — e ela vale **com ou sem**. Não recriar uma saudação global.
  `getProductWaGreeting(kind, locale)` (server-only, `lib/offer-settings.ts`) resolve; sem valor
  salvo → default do produto. Placeholder `{nome}` (primeiro nome do lead).
  `app/api/telegram-webhook/route.ts` seleciona `leads.locale` **e** o contexto de produto
  (`lead_context`/`roteiro_slug`/`cta_type`) e chama `productKindOf` (`lib/lead-card.ts`) antes de
  montar o `wa.me`, nos três caminhos que enviam (`wa:<id>`, `confirm:<id>` e `/start lead_<id>`).
- ⚠️ **Anatomia do card — ordem travada (decisão do usuário):** título → *(linha em branco)* → linha do
  assunto (`🗺️ Roteiro: <título>` ou `🎫 Ingressos`) → linha do link (`🔗 …/r/<token>`) →
  *(linha em branco)* → nome, contato e qualificação → horário → rodapé/CTA.
  ⛔ **O card NÃO lista os itens.** A lista vive na página do pedido; aqui entra só o link. O vendedor
  vai assumir o lead de qualquer jeito — é o trabalho dele —, então a lista não decidia nada e crescia
  com o tamanho do roteiro. O topo responde **"que pedido é este"**, e só depois "de quem":
  quem lê o grupo bate o olho no produto para decidir se pega o lead, e com o nome espremido entre
  título e assunto as três primeiras linhas viravam um bloco só, sem nada em destaque.
  ⚠️ **O `👤 Nome:` NÃO fica no cabeçalho** — ele ABRE o bloco informativo, junto do contato e da
  qualificação, que é onde é usado.
  `baseLines(opts)` monta o cabeçalho e `detailLines(n, {whatsapp})` monta o corpo; as duas são fonte
  ÚNICA e valem para `notifyNewLead` (assume), `notifyLeadLog` (passive), `notifyLeadInfoOnly` (sem
  agência), `editLeadCard`/`editInfoOnlyCard` (reconciliação) e `editClaimedMessage`/
  `editConfirmedMessage` (pós-claim/confirm). O WhatsApp entra por `detailLines`, logo após o nome, e
  só onde pode aparecer — quem deve ocultá-lo simplesmente não passa o parâmetro.
  ⛔ **Os títulos são FIXOS, dois** (`leadHeadline`): `"🟢 NOVA QUALIFICAÇÃO"` com agência e
  `"ℹ️ REGISTRO DE NOVA QUALIFICAÇÃO"` sem — este visualmente distinto de propósito, porque não é um
  lead pra "Assumir", é registro. **Não voltar a interpolar o produto no título**
  (`[NOVO LEAD: ROTEIRO 3 DIAS — COMPRAS]`): ele já aparece na linha do assunto logo abaixo, e a tag
  fazia as duas primeiras linhas repetirem a mesma informação. Foi por isso que `roteiroTagOf`
  (`lib/lead-card.ts`) e `formatRoteiroLeadTag` (`lib/roteiro-lead.ts`) foram REMOVIDAS — o título
  não depende mais do produto. Ao adicionar uma notificação nova, reusar as duas funções de montagem —
  não inventar título nem reescrever a sequência de linhas.
- ⚠️⚠️ **NENHUMA edição pode encolher o card — ele é o BRIEFING do vendedor, não um recibo.** As duas
  edições pós-clique (`editClaimedMessage` no Assumir, `editConfirmedMessage` no Confirmar) reescrevem
  a mensagem INTEIRA, então precisam reconstruir todas as linhas da notificação original — assunto,
  link do pedido, perfil, idioma, dia, pessoas, transporte, horário — e trocar só o rodapé. Já
  aconteceu de o card assumido virar três linhas (título genérico + nome + "Assumido por X"): o
  vendedor recebia o lead e perdia exatamente o que precisava para abrir a conversa. Por isso o
  `returning` do UPDATE atômico do claim traz as colunas do card, não só o nome — e por isso as linhas
  informativas saem de `detailLines()`, fonte única: o bloco esteve copiado em cinco montadores e foi
  assim que uma cópia ficou para trás enquanto as outras eram corrigidas.
  ⚠️ Isto **não** revoga o esconderijo do WhatsApp: o card assumido continua sem o número no texto
  (§12, anti-colisão) — ele só chega ao dono pelo botão.
- ⚠️ **A linha do assunto depende do `productKind`** (bucket de `productKindOf`, `lib/lead-card.ts`,
  passado pelo chamador — `lib/telegram.ts` é puro e **não** deriva contexto de lead, senão existiriam
  duas regras para o mesmo dado): roteiro/personalizar viram `🗺️ Roteiro: <título>`; atrativo vira o
  rótulo do que o pedido CONTÉM — `🎫 Ingressos`, `📅 Reservas` ou `🎫 Ingressos e reservas`
  (`itensKind`). Nome de atrativo não entra: com extras, nenhum deles representa o pedido. A lista
  separada por grupo aparece na PÁGINA do pedido.
- ⚠️⚠️ **`isRoteiroLead` respeita o contexto EXPLÍCITO antes de qualquer heurística.** O modal grava
  `roteiroTitulo` com o `subjectTitle` do item — que num ingresso é o nome do ATRATIVO —, e a
  heurística `Boolean(roteiroTitulo)` classificava todo lead de atrativo como roteiro. O estrago era
  silencioso e triplo: rótulo errado no card, saudação do wa.me no bucket `roteiro` e `confirmFlow`
  lendo `roteiroSuccessMode`, de modo que o modo de sucesso configurado para ATRATIVOS nunca decidia
  nada. Por isso `leadContext === "atrativo"` retorna `false` na primeira linha da função. Ao mexer
  ali, o contexto declarado vence sempre — heurística é para lead legado, que não o declara.
- ⛔ **Nunca envolver texto do card em `<pre>`:** o Telegram renderiza a tag como BLOCO DE CÓDIGO —
  monoespaçada, com fundo próprio e uma barra de "copy"/menu/copiar por cima. É informação para ler,
  não código para copiar. As quebras de linha já sobrevivem no texto normal do `parse_mode: HTML`,
  então a tag não servia nem ao motivo pelo qual foi posta ali. `esc()` continua obrigatório em todo
  valor interpolado.
- ⚠️ **As DUAS mensagens de WhatsApp têm a mesma anatomia:** introdução → resumo de uma linha → link do
  pedido, montadas por `buildWaMessage` (`lib/pedido-resumo.ts`), que é fonte ÚNICA das três
  superfícies (modal, tela de sucesso e Telegram). A introdução vem do bucket de produto
  (`waGreeting` para a agência, `waLeadText` para o lead); o resumo, de `resumoCurto`, que muda só a
  voz do transporte ("quero" × "com"). ⛔ **Não voltar a listar os itens na mensagem** — foi para isso
  que a página do pedido existe, e mensagem que cresce com o tamanho do roteiro ninguém lê.
  ⚠️ **O rótulo do link segue o PEDIDO, não a superfície:** pedido de atrativo é classificado em
  ingressos / reservas / misto (`itensKind`, `lib/offer-defaults.ts` — fonte única das três pontas), e o
  rótulo acompanha: "Ver os ingressos", "Ver as reservas" ou "Ver ingressos e reservas". O webhook resolve isso lendo `getOfferConfigCached` a partir de
  `leads.item_slugs`, e não de um flag gravado: assim uma correção de `hasLink` no admin passa a valer
  inclusive para um pedido antigo.
  ⚠️ O `roteiro_resumo` continua sendo gravado (é dado do lead), mas **não alimenta mais card nem
  mensagem** — quem descreve o pedido é `item_slugs` + as colunas, pela página.
- ⛔ **A linha de transporte NÃO nomeia a agência** — é só `🚐 Transporte: solicitado`. O nome vinha de
  `officialAgencyName()`, um slug FIXO do catálogo, e mentia em dois cenários: afirmava a agência
  oficial quando quem recebeu o lead é outra do rodízio, e nomeava uma agência inteira no card SEM
  AGÊNCIA, onde ninguém está atendendo. Mesmo defeito que o `content_name: "Foz_Falls_transporte"` teve
  no pixel. Quem entrega já está em `assigned_partner`; o card só registra que o transporte foi pedido.
- ⚠️ **Modo Central + Passivo → fluxo "Confirmar":** quando `bot_message_mode = passive` **e** o
  modo de sucesso do produto do lead é `whatsapp` (o sucesso do modal já oferece o botão central
  "Falar com a Agência Agora") — modo de sucesso é **por produto**, não único:
  `offer.roteiroSuccessMode` (roteiro pronto/personalizar) e `offer.atrativoSuccessMode` (atrativo)
  são independentes, e o chamador escolhe qual checar conforme o contexto do lead
  (`isRoteiroLead`/`lib/lead-card.ts`) —, `notifyLeadLog`/`editLeadCard` recebem `confirmFlow: true`
  e mudam de comportamento: o WhatsApp do lead fica **oculto** no texto e a mensagem ganha um botão
  `[✅ Confirmar]` (`callback_data: confirm:<id>`) em vez do log puro sem teclado. O webhook trata
  `confirm:<id>`
  chamando `editConfirmedMessage`: edita a mensagem para "✅ Confirmado por <vendedor>" + um botão
  URL `[📲 Iniciar conversa]` já com o `wa.me` + saudação da agência. ⚠️ **Sem claim atômico aqui**
  (decisão deliberada): qualquer vendedor pode clicar Confirmar (não há `WHERE claimed_by IS NULL`)
  — é o mesmo número central para todos, e quem confirma cai na conversa já iniciada. Não replicar
  o padrão de exclusividade do `claim:<id>` aqui — são semânticas diferentes de propósito (fila
  exclusiva vs. log confirmável). `editConfirmedMessage` mantém todos os campos da notificação
  original (`isLocal`/`alreadyInFoz`/`wantsTransport`/`locale`/`visitDate`/`ticketQty`) + `sentAt`
  (horário ORIGINAL do envio, não o do clique em Confirmar) — a mensagem serve de log do lead, então
  precisa manter tudo visível, só trocando o rodapé.
- ⚠️ **Toggle "Enviar lead ao grupo"** — desliga o ENVIO sem apagar o `agency_chat_id`:
  `agency_group_notify_enabled` em `app_settings` (default `true`, preserva quem já usava), Sim/Não
  dedicado no admin logo abaixo do campo de id. Desligado, `getAgencyChatId()` retorna `null` mesmo
  com um id salvo (usado por `/api/leads` para decidir se notifica) — mas o admin continua
  vendo/editando o id normalmente (`getAgencyChatIdRaw()`, ignora o toggle, só para exibição). Caso
  de uso: cortar spam para o grupo sem perder a config, ou testar se só o CTA de WhatsApp converte
  melhor que notificar o grupo.
- **Rótulo do horário:** sempre `🕐 Enviado em: 09/07, 15:18` (nunca a hora sem contexto), em TODOS os
  montadores — `notifyNewLead`/`notifyLeadLog`/`notifyLeadInfoOnly` a partir de `nowBRT()`, e
  `editLeadCard`/`editInfoOnlyCard`/`editClaimedMessage`/`editConfirmedMessage` a partir do `sentAt`
  (o `created_at` do lead, nunca a hora do clique). ⚠️ **Uma etiqueta só para o mesmo fato:** houve um
  "🕐 Recebido em:" nas edições, e ter dois nomes para a mesma hora fazia quem lê o grupo comparar
  cards e supor uma diferença que não existe. `nowBRT()` é um wrapper de
  `formatBRT(date)` (exportada) — usar `formatBRT` sempre que precisar formatar uma data que NÃO
  seja "agora" (ex.: `created_at` de um lead já existente), `nowBRT()` só para os casos de
  "disparando agora".

## 12-bis. Sem agência com plano vigente — o dono atende

- **Sem agência com plano vigente, o lead vira card no grupo COM o CTA de conversa já liberado.**
  Toggle dedicado (`agency_info_only_no_plan`, bloco "Sem agência com plano ativo" no admin, rotulado
  "Receber os leads no grupo e atender você mesmo") — opt-in, default desligado. Ligado:
  `notifyLeadInfoOnly` manda o card com um botão URL `[📲 Iniciar conversa]` (`wa.me` do lead +
  saudação do produto). **Sem claim, sem "Assumir", sem "Confirmar"** — não há fila a disputar.
  **Por que o contato é exposto aqui:** a captura não para quando não há contrato. O dono atende
  pessoalmente e repassa a uma agência depois; sem o botão, o lead vira registro morto. É a exceção
  ao §12 documentada lá em cima — vale SÓ neste cenário.
  ⓘ Isto já se chamou "modo SÓ INFO" (card sem WhatsApp e sem botão). O nome morreu junto com o
  comportamento; o que restou é o cenário "sem agência".
- ⚠️ **O gatilho é `offer.agencyDefined`, NÃO `getActiveAgencySlug()`.** `getActiveAgencySlug()`
  enxerga só o placement + plano — é CEGO ao toggle "Definir agência" da seção 4 do admin. Com o
  toggle desligado e o plano ainda vigente, `getActiveAgencySlug()` continuaria achando que há
  agência, e o lead cairia no vazio entre os dois ramos (nem roteado normalmente, nem registrado
  como SÓ INFO). `agencyDefined` já é o valor EFETIVO (plano vigente **e** toggle ligado) — é a
  definição real de "a agência atende agora".
- ⚠️⚠️ **O toggle é a autoridade ÚNICA, nos dois sentidos — e nada o liga sozinho.** O valor que
  estiver definido no momento em que a agência sai do ar é o que vale: "Sim" → o próximo lead já gera
  card informativo (inclusive num vencimento **silencioso**, porque o ramo do `/api/leads` lê a chave
  a cada lead, sem depender de ninguém ter clicado em nada no admin); "Não" → não gera, e **continua**
  não gerando, porque a definição era "Não".
  ⛔ **Não reintroduzir "auto-arm"** (ligar o toggle sozinho na queda). Existiu aqui, portado do RG, e
  foi removido por decisão do usuário. Dois motivos, e o segundo é estrutural:
  1. Com o toggle em "Sim" o envio já acontece lendo a chave direto — a ÚNICA coisa que o auto-arm
     fazia era sobrescrever um "Não" por "Sim" na queda. A função dele era desrespeitar o admin.
  2. Ele não tem como distinguir **"o admin desligou de propósito"** de **"ninguém nunca mexeu"**: as
     duas coisas são `false` na mesma chave. Qualquer versão futura esbarra nesse mesmo muro — o preço
     de proteger contra o esquecimento é ignorar a escolha deliberada.
  **Consequência aceita:** com "Não", um plano que vença em silêncio faz os leads não gerarem card
  nenhum até alguém religar. O aviso disso é dado onde a decisão é tomada — ao lado do próprio toggle
  no editor de Oferta (`components/admin/OfferModeControl.tsx`), não em documentação.
- ⚠️ **`notifyLeadInfoOnly` TEM de gravar `telegram_message_id`.** Sem isso o card do lead sem
  agência fica sem referência, e a reconciliação de reenvio (§12-ter) não tem o que reescrever —
  cada reenvio empilharia um card novo.
- ⚠️ `notifyLeadInfoOnly` **não reusa** `notifyLeadLog`: aquele injeta `reply_markup` de
  Assumir/Confirmar, que aqui não fazem sentido (não há fila nem dono a definir). O botão daqui é URL
  direto, montado por `infoOnlyKeyboard`.
- ⚠️ **`editInfoOnlyCard` TEM de reenviar o teclado.** `editMessageText` sem `reply_markup` REMOVE o
  botão: uma reconciliação deixaria o card reescrito sem o CTA que o original tinha.

## 12-ter. Reconciliação "um cliente, um card"

- **Reenvio do MESMO produto dentro da janela de dedup reescreve o card pendente, em vez de
  empilhar um segundo.** Cenário real: a mesma pessoa reenvia o formulário (perdeu o lead
  conhecido/trocou de aparelho) minutos depois do primeiro envio — o card antigo ainda está
  pendente na fila; reescrevê-lo com o contexto mais recente entrega a informação atualizada à
  agência sem duplicar a fila.
  ⚠️ **No wizard (`/montar-roteiro`) a assinatura de dedup leva a CESTA** (`roteiro:montar-roteiro:<slugs
  ordenados>`, `:generic` para cesta vazia): o "produto" do wizard é sempre o mesmo, e sem a cesta
  dois roteiros personalizados DIFERENTES da mesma pessoa colidiam — o 2º subescrevia o 1º (cada
  cesta é um pedido próprio, não um reenvio). Cesta igual dentro da janela continua reconciliando;
  cesta diferente, card novo. Duas cestas VAZIAS ("prefiro a recomendação") ainda colidem entre si —
  mesmo pedido vago, aceito como reenvio.
- ⚠️ **A chave de dedup NÃO inclui `is_local`/`already_in_foz`.** Mesmo produto + qualificação
  DIFERENTE ainda conta como o mesmo pedido (reconciliável) — não como contexto novo. É essa
  remoção que faz a reconciliação cobrir o caso real que a motivou: a pessoa muda de resposta entre
  o 1º e o 2º envio, e o card precisa refletir a resposta mais recente, não gerar um card
  duplicado nem ficar comparando qualificação antiga com nova.
- **Card reescrevível = existe, PENDENTE (`claimed_by is null`)** — já assumido/confirmado NUNCA é
  reescrito (apagaria "✅ Assumido por X" e o botão do dono); nesse caso o reenvio vira card NOVO,
  pelo caminho normal.
- ⚠️⚠️ **Como saber se um card pendente é SÓ INFO** (pra não reescrever com o layout errado): não
  existe coluna `info_only`. Proxy exato: `assigned_partner is null && telegram_message_id is not
  null`. `assigned_partner` só é preenchido quando o lead é roteado de verdade (ramo `sendAgency`);
  o ramo SÓ INFO nunca preenche esse campo. Sem essa checagem, um reenvio sem plano poderia
  reescrever com o layout informativo um card de lead REAL roteado enquanto o plano ainda valia,
  apagando o estado e o botão do dono dele.
- **`superseded_by`:** o lead antigo, ao ser reconciliado, tem `telegram_message_id` zerado e
  `superseded_by` apontando pro lead novo — a cadeia é sempre PLANA (nunca A→B→C). Qualquer
  resolvedor de "onde está o card de verdade" faz `coalesce(l.superseded_by, l.id)` e precisa de um
  salto só.
- ⚠️ **Sem fallback quando a edição falha** (decisão deliberada): reenvio idêntico gera texto
  idêntico, o Telegram responde "message is not modified" e o card certo já está no grupo — mandar
  uma mensagem nova nesse caso recriaria exatamente a duplicata que a reconciliação existe pra
  evitar.

## 12-quater. Ping de lead pendente

- **Objetivo:** avisar o grupo quando há lead(s) sem "Assumir"/"Confirmar" há muito tempo, sem
  depender de alguém abrir o painel pra notar. `LEAD_ALERT_MIN` (minutos) é a régua única usada
  tanto pra DISPARAR o ping (cron) quanto pra APAGAR (claim/confirm bem-sucedido) — um lead recém-
  chegado (dentro da janela) não impede o aviso de sumir nem de aparecer fora de hora.
- **Candidato a "atrasado":** `assigned_partner is not null and telegram_message_id is not null and
  claimed_at is null`, há mais de `LEAD_ALERT_MIN` minutos. Os dois primeiros filtros excluem, de
  graça, os cards SÓ INFO (`assigned_partner` null — ninguém tem como assumir um card sem botão) e
  os leads superados pela reconciliação (`telegram_message_id` zerado ao migrar pro lead novo).
- **Nunca duplica o ping:** o cron guarda só o `message_id` do ping ATUALMENTE vivo
  (`app_settings.pending_alert_message_id`) — apaga o anterior antes de mandar um novo. Estado
  mínimo, sem tabela nova, sem chat_id novo (reusa `agency_chat_id`).
- **Só dentro do horário de atendimento** (06h–23h, America/Sao_Paulo) — fora disso, no-op (exceto
  com `?force=1`, só pra teste manual, ainda exigindo o secret certo).
- **Protegido por `?secret=` (`CRON_SECRET`), não same-origin** — mesma razão do webhook: quem
  chama é um scheduler externo, não o navegador.
- **Apagado em dois pontos:** o cron (ciclo seguinte) E o webhook, logo após qualquer
  claim/confirm bem-sucedido (`clearPendingAlertIfAllDone`, best-effort, nunca lança) — sem o
  segundo ponto, o aviso ficaria visível por até `LEAD_ALERT_MIN` minutos depois de já resolvido.
- **Env `TELEGRAM_TEST_CHAT_ID` (opcional, dev):** manda o ping pra este chat em vez do grupo real
  quando `NODE_ENV !== "production"` — protege o grupo de produção de testes locais (o banco
  segue o mesmo, só o DESTINO da mensagem muda).
