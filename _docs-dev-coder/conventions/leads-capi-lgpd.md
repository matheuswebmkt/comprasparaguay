// Filepath: \_docs-dev-coder/conventions/leads-capi-lgpd.md
// Parte de conventions.md (índice em ../conventions.md)

# CONVENTIONS · CAPTURA DE LEADS, META CAPI E LGPD

> Restrições duras do projeto. NÃO re-propor decisões já travadas aqui.
> Numeração das seções PRESERVADA do arquivo original (§N) — referências cruzadas continuam válidas.

---

## 11. Captura de leads + Meta CAPI

- **`/api/leads` endurecido como o `/api/track`:** exige mesma-origem (`origin`/`referer` batendo
  com `host`, senão 403). Nenhuma rota de ingestão aceita POST anônimo direto. Sem DB → no-op
  silencioso (não quebra o usuário).
- **CAPI server-side é a fonte de verdade do Lead** (à prova de AdBlock/iOS): após o insert no Neon,
  `lib/meta-capi.sendLeadToCapi()` envia `Lead` ao Meta. **Dedupe obrigatório:** o `event_id` gerado
  no `TicketOfferModal` vai ao Pixel (`fbqTrack(..., { eventID })`) **e** ao CAPI — sem isso o Meta
  conta o lead 2×.
- **LGPD:** PII (`email`/`whatsapp`) é enviada ao Meta **hasheada (SHA-256)**, nunca em claro. No
  Neon fica em claro com `lgpd_consent` registrado (o aceite dos Termos está na cópia do modal).
  Telefone = só dígitos (com DDI) antes do hash.
- **Nomes de eventos Pixel são contrato com as campanhas — não renomear sem alinhar o Ads:**
  `ViewModalVIP` (custom, retargeting), `Lead` (padrão, alimenta Lookalike), `InitiateCheckout`
  (padrão, compra direta no skip).
- **`assigned_partner`** é carimbado no route handler com a agência ativa
  (`lib/agencies.getActiveAgencySlug`, ver §13) — prova para qual agência o lead foi roteado.
- **`META_CAPI_TOKEN`** é segredo (Events Manager → API de Conversões). Sem ele o envio server-side
  vira no-op; o Pixel front-end segue funcionando. Reutiliza `NEXT_PUBLIC_META_PIXEL_ID`.
- **`META_CAPI_TEST_CODE`** (opcional): quando setado, injeta `test_event_code` no payload — eventos
  do servidor aparecem na aba "Testar eventos". **Só local/teste — nunca na Vercel** (desvia os
  eventos reais).
- **Schema da `leads` é fonte de verdade em `db/schema.sql`** (alters idempotentes). O `create table`
  inline na rota é só rede de segurança para ambiente novo; mudança de coluna entra no `schema.sql`
  **e** roda `pnpm db:migrate` na prod.

## 18. Proteção de Dados Pessoais — LGPD

- **Compartilhamento de dados coberto:** o site captura PII (nome/WhatsApp/e-mail) via
  `TicketOfferModal` e a repassa (nome+WhatsApp) à agência de turismo parceira
  (`lib/telegram.notifyNewLead`/`notifyLeadLog`). `/aviso-legal` cobre isso explicitamente — antes
  cobria só "somos diretório sem afiliação", sem mencionar dados.
- **`/aviso-legal` é a página de Termos + Privacidade/LGPD** (`lib/i18n/paginas.ts`,
  `AVISO_LEGAL_UI`) — é para lá que o link fixo "Termos" do modal (`ui.lgpdTerms`,
  `lib/i18n/modal.ts`) aponta. Seção "Como tratamos seus dados pessoais (LGPD)" cobre: o que é
  coletado (nome/e-mail/WhatsApp/respostas de qualificação/preferências de roteiro/interesse em
  transporte/dia e quantidade escolhidos), a finalidade (viabilizar o atendimento da agência
  parceira) e a base legal (consentimento + legítimo interesse) do compartilhamento, e o canal de
  exercício de direitos do titular (`/contato`, genérico — não enumera cada direito do art. 18
  individualmente). A blindagem de não-responsabilidade (a agência é controladora independente do
  próprio tratamento a partir da entrega do contato) e o "o que o site não faz" (não vende/aluga a
  base, não processa pagamento) vivem na seção adjacente "Compras, reservas e responsabilidades",
  não na seção de LGPD em si.
- ⚠️ **Agência referenciada GENERICAMENTE** (evita manutenção): o texto legal nunca cita o nome de
  uma agência específica — sempre "agência de turismo parceira homologada". A agência ativa pode
  trocar (§13) sem exigir atualização desta página. Mesma regra vale para qualquer copy pública nova
  que mencione a agência.
- **Disclaimer institucional** (`lib/i18n/home.ts` `footer.disclaimer`, pt/en/es, texto de
  referência já aprovado): "portal independente de mídia de performance, curadoria turística e
  geração de demanda"; "sem vínculo societário ou representação oficial"; "transações, emissões de
  ingresso e roteiros operadas por agências parceiras homologadas"; marcas registradas pertencem aos
  detentores. Não reescrever essa entidade de novo sem motivo.
- ⚠️ **`/aviso-legal` segue só em PT** — não usa `useLocale`/`lib/i18n/*`. Não traduzir sem pedido
  explícito.
- ✅ **Microcopy fixa do modal** (`lgpdBefore/lgpdTerms/lgpdAfter`, `lib/i18n/modal.ts`, pt/en/es)
  cita explicitamente que nome e WhatsApp são compartilhados com a agência de turismo parceira e/ou
  os parceiros selecionados, para dar seguimento ao atendimento — reforça a base legal do
  consentimento (art. 7º I / 8º LGPD) descrita em `/aviso-legal`. Agência referenciada
  genericamente (nunca por nome). Continua **não editável no admin** (§2) — é texto fixo no código.
  ⚠️ O fechamento da frase é **positivo** ("…e liberar as vantagens exclusivas dessa parceria"),
  não neutro/negativo ("…dar continuidade ao seu atendimento" soa só-obrigação) — mesma substância
  legal (compartilhamento de nome/WhatsApp com agência/parceiros), desfecho como benefício,
  coerente com o tom de "vantagens exclusivas" do funil (§2). Não reintroduzir um fechamento
  neutro/negativo sem pedido do usuário.
- ✅ **Canal de contato/direitos LGPD = página `/contato`** — formulário próprio (não mailto), nos
  moldes do form de leads: `components/contact/ContactForm.tsx` (client) → `POST /api/contact`
  (same-origin guard + honeypot, mesmo padrão do `/api/leads`) → `lib/email.sendContactFormEmail`
  (Resend) → `contato@comprasparaguay.online` (constante `CONTACT_EMAIL` em `lib/email.ts`; o admin
  usa `admin@comprasparaguay.online` separado). Não é env nem editável no admin.
  `reply_to` do e-mail enviado = o e-mail do visitante que preencheu o form.
  ⚠️ **Sem persistência/rate-limit dedicado:** `/api/contact` não grava no Neon (só dispara o
  e-mail) e não tem rate-limit próprio (diferente do `/api/leads` §16) — honeypot + same-origin já
  cobrem bot básico; se o volume de spam justificar, adicionar depois.
  Link "Contato" no footer, ao lado de "Aviso Legal e Transparência" — `lib/i18n/home.ts` tem a
  chave `footer.contactLink` (pt/en/es). `/contato` também está em `sitemap.ts` e na allowlist
  `STATIC_PATHS` do `/api/track` (mesmo tratamento de `/aviso-legal`).
- ✅ **Banner de cookies próprio, sem CMP externo:** decisão deliberada — nada de dependência de
  terceiro (Cookiebot/OneTrust) para algo que dá para resolver com um componente + localStorage. Ver
  "Cookies — consentimento próprio" em `architecture/analytics-cookies.md`.
  - **Botão único "Entendi"** — não tem "recusar"/opt-out granular. É um banner de aviso (informa
    que o site usa cookies e o que carrega depois), não um mecanismo de escolha por categoria. Não
    adicionar um segundo botão "recusar" sem pedido explícito — mudaria a natureza do componente.
  - **O que é gateado pelo aceite:** só Meta Pixel e Google Tag Manager (`ConsentGate`, terceiros,
    cookies de marketing/anúncio). **O que não é gateado:** o analytics 1st-party (`/api/track`,
    `visitor_id`/`session_id` anônimos em local/sessionStorage, sem PII) — é essencial ao
    funcionamento do próprio site (dashboard, atribuição de UTM, funil do modal). Não gatear o
    1st-party sem decisão explícita (quebraria o dashboard para quem não aceita o banner).
  - **Consentimento vive em `localStorage`** (`rgf_cookie_consent`, `lib/cookie-consent.ts`), não em
    cookie HTTP — mais simples (sem middleware/SSR envolvido) e suficiente para o objetivo. Revogar
    = limpar dados de navegação do site (documentado em `/aviso-legal`, seção "Cookies e tecnologias
    semelhantes") — não existe botão de "gerenciar preferências".
