// Filepath: \_docs-dev-coder/conventions/funil-modal.md
// Parte de conventions.md (índice em ../conventions.md)

# CONVENTIONS · FUNIL E MODAL

> Restrições duras do projeto. NÃO re-propor decisões já travadas aqui.
> Numeração das seções PRESERVADA do arquivo original (§N) — referências cruzadas continuam válidas.

---

## 2. Funil de captura de lead — genérico por PRODUTO

- **Um único modal (`TicketOfferModal`) serve os três contextos de produto**
  (`lib/roteiro-lead.ts`, `LeadContext = "ingresso" | "roteiro" | "atrativo"`), não uma cópia por
  tipo de produto. `isRoteiroLeadContext`/`isAtrativoLeadContext` derivam o contexto a partir do
  `detail` de abertura (`TicketOfferOpenDetail`). Ao adicionar um produto novo que capture lead,
  estender o `LeadContext` e os textos por contexto — não criar um segundo componente de modal.
- **Regra de ouro do funil** (a copy pré-submit nunca promete canal nem instante) está travada em
  `conventions/posicionamento.md` §21.2 — vale para os três contextos igualmente, não é regra
  exclusiva de um deles.
### 2-bis · O texto do modal é CÓDIGO, não configuração (ago/2026 — regra dura)

**Toda copy que o visitante lê no modal mora em `lib/offer-defaults.ts`**, nos 3 idiomas, e se edita
lá — não no admin. `/admin/dashboard/oferta` configura **comportamento**: modo de sucesso, agência,
Telegram, link por atrativo.

**Por quê:** o editor tinha chegado a dezenas de campos de texto × 3 idiomas. Revisar isso a cada
mudança custava mais atenção do que o ganho de poder editar sem deploy — e o dono do produto é a mesma
pessoa que mexe no código. Configuração só se justifica quando quem edita **não** pode fazer deploy.

⚠️ **Desligar a UI não basta — são TRÊS trancas, e faltar uma torna a mudança silenciosamente falsa:**

1. `OfferModeControl.save()` **não manda** `texts`/`productCopies`/`transportOffer.texts` no payload;
2. `saveOfferConfig` (`lib/offer-settings.ts`) **não grava** esses campos (blocos ⛔);
3. `db/schema.sql` **apaga** as chaves de texto do `app_settings` a cada migração.

A **leitura** continua intacta de propósito: chave que exista no banco ainda vence o default do
código. É isso que permite reativar a edição sem tocar em mais nada — e é exatamente por isso que (3)
é obrigatório. Com uma chave antiga viva, mexer em `offer-defaults.ts` não muda nada no site e o
sintoma é mudo: nenhum erro, só a copy velha continuando lá.

↩️ **Para reativar:** os blocos comentados no fim de `OfferModeControl.tsx` trazem o passo a passo.

⛔ **Ao escrever esses textos, `posicionamento.md` §21 vale igual** — não é copy "de sistema" por
morar em `lib/`. Em especial §21.5: **nenhum texto do visitante nomeia a agência nem diz "fale com a
agência"**. A relação é com o Compras Paraguay; o vocabulário é §21.3 ("um especialista em Foz do Iguaçu",
"quem vive na cidade"). "Agência parceira" só na microcopy de LGPD e no disclaimer do footer (§18),
onde é dever legal.

### 2-ter · Como a copy se organiza dentro de `offer-defaults.ts`

- ⚠️ **As duas mensagens têm a mesma anatomia:** introdução (o texto abaixo) → resumo de UMA linha,
  montadas por `buildWaMessage`/`resumoCurto` (`lib/pedido-resumo.ts`),
  compartilhadas pelo modal e pelo Telegram. ⛔ **A lista de itens não entra na
  mensagem** — ela vive no resumo. Por isso os textos abaixo terminam em dois-pontos: eles abrem o que
  vem em seguida.
- ⚠️ **As DUAS mensagens de WhatsApp são POR PRODUTO** (`ProductLeadCopy`), e são pontas opostas —
  não confundir uma com a outra:
  - `waGreeting` — o que **você** manda AO lead, disparado do **Telegram** ("Abrir WhatsApp do
    cliente" / "Iniciar conversa"). Tem `{nome}`.
  - `waLeadText` — o que **o lead** manda pra vocês, disparado do **site** (CTA de conversa na tela
    de sucesso). `buildPreferencesSummary` anexa o resumo depois dele.
  Nenhuma delas pode voltar a ser global: versões globais serviam a vários produtos ao mesmo tempo
  e por isso diziam "ingressos ou roteiro" — genérico pra todo mundo e específico pra ninguém.
  Hoje o modal é **produto único (atrativo)**; o **número** do WhatsApp continua global, esse é o mesmo.
- **`DEFAULT_PRODUCT_COPIES` é a matriz; `DEFAULT_TEXTS` é só fallback.** Todo CTA real define um
  contexto de produto, então quem manda na prática é o primeiro. `DEFAULT_TEXTS` só apareceria num CTA
  sem `detail` — por isso é genérico de propósito (não dá pra nomear o produto sem saber qual é), e as
  perguntas de qualificação vivem lá, que essas sim são iguais nos três.
- **`AtrativoLeadCopy` tem 2 campos a mais que `ProductLeadCopy`** — `successDirect` e
  `directButtonLabel`, do modo Link direto. A assimetria está no TIPO de propósito:
  `RoteiroSuccessMode` não admite `"direct"`, e a tela só renderiza esse modo com `detail.href` (o
  link oficial do atrativo), que roteiro pronto/personalizado não têm.
- **Contexto roteiro tem comportamento de sucesso diferente dos outros dois** (redireciona no
  submit em vez de mostrar tela de sucesso inline). Isso é uma exceção documentada, não o padrão
  do modal — o contexto atrativo/ingresso mantém a tela de sucesso completa dentro do próprio
  modal. ⚠️ O destino do redirect pós-submit (`/obrigado`, removido) está em definição.
- **Calendário (dia) e "Para quantas pessoas?" são campos do formulário, não perguntas de
  qualificação.** Os dois aparecem em TODO produto do modal — ingresso, reserva de data e roteiro
  pronto/personalizar. Ordem fixa dentro do bloco de gate: card do assunto →
  calendário → pessoas → qualificação → transporte → formulário. Dia bloqueia só o passado; a
  quantidade nunca bloqueia (sempre tem valor válido, clamp 1–999 client e server — o teto existe
  só contra digitação absurda; grupos grandes são reais).
  ⭐ **A pergunta é PESSOAS, nunca "quantos ingressos"** (decisão do usuário). O campo já existiu só
  para atrativo com ingresso, e isso tirava da agência o dado mais determinante do orçamento
  justamente no roteiro; na reserva de data (§17-ter), o errado era a pergunta, não o campo — aquele
  lugar não vende ingresso. É a mesma quantidade: 5 pessoas são 5 ingressos em cada atrativo, e é
  assim que o wizard já tratava (`ticketQtyFromPessoas`).
  ⓘ A coluna continua sendo `leads.ticket_qty` e o param do pixel continua `ticket_qty` — renomear
  quebraria o contrato de portfólio sem ganho; o que mudou foi a PERGUNTA, não a grandeza.
- ⚠️ **O DIA é preferência da PESSOA e persiste na jornada** (`lib/known-lead.ts` `visitDate`,
  localStorage) — quem já disse quando vai a Foz não redigita isso a cada atrativo ou roteiro que
  abrir. O wizard participa do mesmo campo (calendário do passo 1). **A QUANTIDADE não persiste**:
  é do pedido, não da pessoa.
  ⚠️ **O dia tem validade própria, e não é um TTL: a data VENCIDA não volta.**
  `loadKnownLeadContact()` devolve `null` quando o dia já passou. Sem isso o gate ficaria satisfeito
  com um valor que o calendário nem deixa reescolher (ele bloqueia o passado), e o lead seria enviado
  com um dia que já foi.
  ⓘ Isto reverte uma regra anterior ("o dia nunca vai pro known-lead, porque pré-preencher uma data
  semanas depois é pior que não preencher") — a preocupação era legítima e passou a ser endereçada
  pela regra de vencimento acima, em vez de por não persistir.
  ⚠️ **Depois de um envio, o modal precisa reabilitar a restauração** (`draftInitRef` volta a
  `false`). O modal vive no layout e sobrevive à navegação client-side: sem esse reset, a guarda
  ficava `true`, o bloco de restauração era pulado e o estado do produto ANTERIOR seguia em memória —
  enquanto uma remontagem abria tudo em branco. Era o que fazia o dia "às vezes persistir, às vezes
  não", conforme a navegação tivesse ou não recarregado a página.
- **A pergunta de transporte pode aparecer mesmo sem agência com plano vigente** (toggle dedicado no
  admin, independente do toggle "com agência" — nunca cruzar as duas chaves). Sem agência, responder
  "Sim" só registra o sinal de interesse (alimenta otimização de campanha); não roteia
  notificação nenhuma sozinho — isso é decidido à parte pelo modo SÓ INFO (ver `conventions/
  telegram.md` §12-bis).
- ⚠️ **O transporte vale para TODO produto, e o toggle do admin é a única autoridade.** Não gatear a
  visibilidade por contexto (`isAtrativoCtx &&`) nem por agência ativa (`agencyActive &&`) — as duas
  cópias já existiram e as duas causaram o mesmo tipo de bug: o admin marca "Exibir = Sim" e a
  pergunta não aparece. Quem pede um roteiro pronto precisa se locomover igual a quem compra um
  ingresso avulso; a logística que o roteiro embute é a ORDEM do dia, não o transporte.
- ⚠️ **Transporte é uma pergunta Sim/Não, não um checkbox — e BLOQUEIA o form até ser respondida.**
  Num roteiro com vários atrativos, saber que a pessoa **não** precisa de transporte vale tanto quanto
  saber que precisa, então a resposta é exigida dos dois lados (`transportDone = !transportVisible ||
  transportAnswered`). ⚠️ Isso só é aceitável **porque** existem dois botões: com o checkbox antigo,
  exigir resposta obrigava quem não queria a marcar e desmarcar pra seguir — se algum dia o controle
  voltar a ser um toggle único, o gate tem de cair junto.
- ⚠️ **O estado do transporte é TRI-STATE em toda a pilha** — cliente, storage e banco: `true` quer ·
  `false` recusou · `null` não foi perguntado. Não colapsar em booleano: "disse não" e "nunca
  perguntaram" são coisas diferentes, e confundi-las faz a pessoa que recusou ser perguntada de novo a
  cada modal que abre, além de contaminar o denominador de qualquer taxa de aceite. No cliente é um
  único estado (`transportWanted: boolean | null`) de propósito — dois booleanos separados ("marcado" +
  "respondeu") tornam o par inválido representável. Ver `db/schema.sql` (`wants_transport`).
- ⚠️ **A resposta de transporte consolida ENTRE PRODUTOS**, igual ao contato e ao "é morador?".
  Duas camadas, e as duas importam:
  - **rascunho de sessão** (`sessionStorage`, chave única sem escopo de produto) — grava a cada
    mudança, **sem depender de submit**: preencher no modal de um atrativo, desistir e fechar, e
    abrir o modal de um roteiro pronto depois tem de trazer tudo preenchido. Fechar sem enviar
    **não** apaga o rascunho (só o envio bem-sucedido apaga);
  - **lead conhecido** (`localStorage`, `lib/known-lead.ts` `wantsTransport`, tri-state) — atributo estável da
    PESSOA, sem TTL próprio (≠ `alreadyInFoz`, que expira em 1 dia), gravado no envio; cobre outra
    aba/outro dia. O wizard alimenta o mesmo campo pela pergunta de transfer dele.
  Consolidado (contato no card de resumo + transporte já **respondido**, seja "Sim" ou "Não"), o card
  de transporte **some** do form — a resposta segue visível na linha do resumo
  (`ui.summaryTransport`/`ui.summaryNoTransport`). ⚠️ O gate da consolidação chaveia por *respondido*,
  nunca por *marcado*: com `!transportChecked`, quem recusou reabriria o card pra sempre. Clicar em
  "Editar" reexibe o card, senão não haveria como trocar a resposta.

### 2-quater · Página pública do pedido (`/r/[token]`) — removida

A rota `app/r/[token]` e a página do pedido não existem mais (simplificação Compras PY).
`leads.public_token` e `item_slugs` permanecem no banco (dado preservado) e as mensagens de
WhatsApp/Telegram não geram mais o link. Se a página voltar algum dia, os princípios que valiam
permanecem: **sem PII** (nunca nome/telefone/e-mail), `noindex`, slugs em vez de nomes e respeito ao
modo de sucesso do admin.

## 16. Anti-bot do modal — Cloudflare Turnstile

- **Defesa em duas camadas, ambas antes de gravar/CAPI/Telegram:** Turnstile (`lib/turnstile.ts`,
  `verifyTurnstile`, fail-open sem `TURNSTILE_SECRET_KEY` ou em erro de rede — não bloquear
  submissão legítima por instabilidade do serviço) + honeypot (sempre ligado, custo zero: campo
  `name="website"` invisível; preenchido → drop silencioso em 204, sem revelar ao bot que foi
  pego). Ver mecanismo completo em `architecture/leads-modal-telegram.md`.
- **Rate-limit e dedup vivem em `lib/lead-dedup.ts`** (`LEAD_DEDUP_WINDOW_MIN=45`), fonte única lida
  tanto pelo server (`/api/leads`) quanto pelo client (`lib/known-lead.ts` — evita re-perguntar dado
  já capturado do mesmo visitante em janela curta).
- ⚠️⚠️ **O rate limit de envio conta SÓ envio real (`abandoned = false`) — rascunho de abandono nunca
  consome o teto.** O teto (3 por 15 min, por `visitor_id` OU `ip_hash`) existe contra spam MANUAL de
  formulário; rascunho não notifica ninguém, não vai ao CAPI nem ao Telegram, é dado interno de
  recuperação. Contá-lo punia quem NAVEGOU: `session_id` mora no `sessionStorage`, ou seja é por ABA,
  então abrir produtos em abas novas e fechar os modais gerava rascunhos — e o envio real
  seguinte era descartado em silêncio, com a tela de sucesso aparecendo mesmo assim. Dentro de uma aba
  só o problema não existia (o draft reaproveita a linha da mesma sessão, `/api/leads/draft`), o que
  torna o caso fácil de não reproduzir em teste. **Não reintroduzir a contagem de rascunhos.**
- ⚠️⚠️ **A UI mostra sucesso mesmo quando o envio foi RECUSADO — isto é deliberado, não um bug.**
  Rate limit e honeypot respondem 204 e o modal cai na tela de sucesso normalmente: avisar o abusador
  entregaria o teto e o funcionamento da armadilha, e ele ajustaria o ataque. O custo para um visitante
  real é desprezível — ninguém legítimo faz 3 envios em 15 minutos (e rascunho não conta mais para o
  teto, ver acima). **Não "consertar" isso mostrando erro.**
  ⓘ Turnstile expirado é outro caso e NÃO cai aqui: o `expired-callback` zera o token
  (`TurnstileWidget.tsx`) e o modal valida antes de enviar, então a pessoa vê erro no formulário. O 403
  do servidor só ocorre com token presente e inválido — aí é manipulação, e enganar é o certo.
  ⚠️ A ÚNICA exceção que não é anti-abuso: **falha de gravação no banco** também responde 204 e mostra
  sucesso. Não há atacante nesse caminho, e o visitante espera um contato que nunca virá — por isso o
  `catch` do insert loga SEM guarda de ambiente (`app/api/leads/route.ts`). O log é a única pista de
  que isso aconteceu; não remover a chamada nem escondê-la atrás de `NODE_ENV`.
- ⚠️ **Fail-open, não fail-closed, nas dependências externas do anti-bot.** Se o Turnstile ou a rede
  falharem, a submissão segue — perder um lead legítimo por instabilidade de terceiro é pior do que
  deixar passar um bot ocasional adicional (o honeypot + same-origin já filtram a maioria).

## 17. Funil do modal (`modal_events`)

- **Medir onde o lead abandona é uma tabela própria, não reaproveita `events`/`cta_click`.** Um
  funil bem instrumentado precisa de granularidade por passo (`modal_events`, 1 linha por passo
  alcançado por abertura) sem inflar as métricas gerais do site. Ver o schema e as queries em
  `architecture/leads-modal-telegram.md`, "Funil do modal".
- **O funil é sempre relativo à abertura (`modal_id`), não ao visitante.** Um mesmo visitante pode
  abrir o modal várias vezes; cada abertura é uma linha do funil, e as taxas de conclusão são
  calculadas por abertura, não por pessoa.
## 17-bis. Página de obrigado (`/obrigado`) — recriada no foco Compras PY

A rota `/obrigado` foi **recriada** como página única de confirmação pós-submit (noindex). Casca
server (`app/obrigado/page.tsx`) + `ObrigadoContent` client que lê o handoff em `sessionStorage`
(`lib/lead-success-handoff.ts`, campo `fluxo` = `atrativo`/`roteiro-pronto`/`roteiro-personalizado`)
e monta a confirmação. Regra que permanece: a tela de sucesso nunca deve "resolver" pela ausência
do handoff.

⛔ Não reintroduzir um "2º ponto de contato" de transporte no pós-submit: transporte é atributo da
pessoa (`known-lead`, localStorage, cross-aba) — a pergunta vive no modal.

## 17-ter. Ingresso por atrativo — "Tem link - NÃO" (lugares públicos não vendem ingresso)

- **A config vive em "5 · Ingresso por atrativo" no admin** (`attraction_offer_settings`, `hasLink`).
  Com **"Tem link - NÃO"** o atrativo é um **lugar/experiência pública**, não um negócio com venda
  (ex.: Compras Paraguai - Ciudad del Este, By Night Puerto Iguazú) — não existe "Comprar ingresso"
  nem "Ingressos pra quantas pessoas?" para ele.
- **Fonte única no client:** `offer.attractionOffers[slug].hasLink` (assada no servidor via
  `getAttractionOffersPublic` — default `true` para quem não tem linha salva).
- **CTA do card** (`AttractionCard`): com `hasLink=false` o rótulo vira **"Reservar data"**
  (`ctaNoLink` do dicionário `attraction-detail.ts`, pt/en/es) e o ícone vira calendário no lugar do
  ingresso — a captura continua abrindo o modal (reservar data também precisa do lead). Precedência:
  `attraction.ctaLabel` custom do dado vence os dois rótulos automáticos.
- ⭐ **O modal INTEIRO fala em RESERVA quando o atrativo não vende ingresso** (`isReservaCtx`):
  título "Reservar data" no lugar de "Comprar ingresso" e badge "Reserva / atrativo" no card do
  assunto. Sem isso o modal contradizia o próprio CTA que o abriu, que já diz "Reservar data".
  ⓘ As duas strings vivem no dicionário FIXO (`MODAL_UI.reservaTitle`/`reservaBadge`), não num 4º
  bucket de `ProductCopies`: o que muda é o ATRATIVO, não o produto — um bucket novo custaria tipos,
  defaults nos 3 idiomas e chaves de `app_settings` para duas linhas de texto.
  ⓘ O resto da copy do bucket atrativo já é neutro entre os dois casos: `submitLabel` é "Finalizar e
  continuar" e `subjectIncluded` é só "Incluído" — nenhum deles promete compra.
- **O bucket atrativo não tem `subtitle` nem `formHint`** (vazios de propósito, decisão do usuário): o
  título mais o card do assunto logo abaixo já dizem o que é, e o `qualifyTitle` global também saiu.
  ⚠️ O modal **não renderiza string vazia** — sem essa guarda sobra um buraco no espaçamento e uma
  divisória solta acima do formulário.
- **Modal** (`TicketOfferModal`): a pergunta "Para quantas pessoas?" **continua aparecendo** — o que o
  `hasLink=false` muda é o transporte (assumido automaticamente) e o CTA do card, não o número de
  pessoas, que a agência precisa saber igual para reservar. O restante do modal permanece (data da
  visita, contato, modo de sucesso close/whatsapp).
- **Pedido só de reserva** (nenhum item com ingresso): o link vira "Ver as reservas" e a página do
  pedido mostra `Transporte: incluído` — ali o transporte não foi perguntado, é parte do serviço.
- ⚠️ **A linha de transporte da página fala do PEDIDO, não do motivo:** `solicitado` / `não
  solicitado`. O modal pergunta "quer transporte para esse dia?", e um "não" ali não afirma que a
  pessoa tem veículo — pode já ter resolvido por fora, ou ir decidir depois. O motivo só existe no
  WIZARD, que tem a opção própria ("Tenho veículo"); por isso a linha SOME no roteiro personalizado,
  onde o transporte já aparece em "O que você respondeu" — as duas juntas repetiam o mesmo rótulo.
- **Wizard sem experiência escolhida** ("prefiro receber a recomendação"): a seção "Experiências
  escolhidas" continua na página, com a linha que explica a escolha. Seção vazia parece dado faltando.
- **Pedido MISTO** (ingresso e reserva de data juntos, escolhidos no mesmo modal): o título da
  página vira "Seus ingressos e reservas" e o rótulo do link, "Ver ingressos e reservas" — nas TRÊS
  pontas (tela de sucesso, WhatsApp do lead e WhatsApp da agência). Nomear só um dos dois deixaria
  metade do pedido fora, e os dois grupos já aparecem separados no corpo da página.
  ⓘ Quem classifica é `itensKind` (`lib/offer-defaults.ts`): três estados, fonte única das pontas.
- **FAQ e JSON-LD da página de atrativo:** com `hasLink=false` o bloco de perguntas de compra
  (`TICKET_FAQ` em `lib/seo.ts`) **não é anexado** — nem na FAQ visível, nem no `FAQPage`. A página
  resolve a flag via `getOfferConfigCached()` e passa `{ hasTicket }` para `attractionDefaultFaq`;
  `lib/seo.ts` continua puro (não lê banco). Sem isso, a mesma página exibia um CTA "Reservar data"
  e, logo abaixo, "Como comprar ingresso para …?" — duas respostas diferentes sobre o mesmo
  atrativo.
- **Card do Telegram:** o lead sai com `📅 Reserva de data para: <nome>` em vez de
  `🎫 Ingressos para: <nome>` (`conventions/telegram.md` §12). Um pedido que mistura os dois tipos
  mostra as duas linhas. O rótulo é montado no MODAL e gravado dentro de `leads.roteiro_resumo`,
  porque o webhook reescreve esse card no claim/confirm e não enxerga a config da oferta.
- ⚠️ **Esta flag é a fonte ÚNICA de "o atrativo tem ingresso".** Não criar campo equivalente no
  catálogo estático (`app/data/attractions.ts`): duas fontes divergem em silêncio — o admin
  desligaria o ingresso e o catálogo continuaria afirmando que existe. Quem precisar da informação
  em superfície nova lê `offer.attractionOffers[slug].hasLink`, com `!== false` como teste (o
  default de quem não tem linha salva é `true`, e é assim que o build sem banco se comporta).
