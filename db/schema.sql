-- Filepath: db/schema.sql
-- Esquema do Neon Postgres — Roteiro Foz
-- Rode com:  pnpm db:migrate   (carrega .env.local)  OU cole no SQL editor do Neon.
-- Idempotente (create table/index if not exists).

-- =============================================================================
-- events — analytics 1st-party (pageviews + cliques de CTA)
-- =============================================================================
create table if not exists events (
  id           bigserial primary key,
  type         text not null,             -- 'pageview' | 'cta_click' | 'impression'
  path         text,                      -- caminho da página
  cta_type     text,                      -- posição/tipo do evento (hero, navbar, partner_card, partner_section...)
  item_slug    text,                      -- parceiro ou 'roda-gigante'
  destination  text,                      -- URL de destino do clique
  utm_source   text,
  utm_medium   text,
  utm_campaign text,
  utm_content  text,
  utm_term     text,
  referrer     text,
  user_agent   text,
  country      text,                      -- país (geo do Vercel: x-vercel-ip-country)
  city         text,                      -- cidade (geo do Vercel: x-vercel-ip-city)
  visitor_id   text,                      -- id anônimo (cookie/localStorage)
  session_id   text,
  created_at   timestamptz not null default now()
);

-- Colunas de geo (idempotente p/ tabelas criadas antes do geo):
alter table events add column if not exists country text;
alter table events add column if not exists city    text;

create index if not exists events_type_created_idx on events (type, created_at desc);
create index if not exists events_created_idx       on events (created_at desc);
create index if not exists events_path_idx          on events (path);
create index if not exists events_cta_type_idx      on events (cta_type);
create index if not exists events_item_slug_idx     on events (item_slug);
create index if not exists events_country_idx       on events (country);

-- =============================================================================
-- modal_events — funil granular do TicketOfferModal (jul/2026). UMA linha por PASSO
-- alcançado por ABERTURA (modal_id = UUID por open). Escreve ao vivo (sobrevive a fechar
-- sem enviar); o funil por-open é reconstruído com bool_or(step=...) agrupando por modal_id.
-- Ingestão: app/api/modal-track/route.ts (mesmo guard same-origin do /api/track). Ver conventions §6/§17.
-- steps: open, offer_shown, q_local_yes|no, q_infoz_yes|no, offer_check, agency_check,
--        field_name|email|phone, submit, success, success_cta_shown, success_cta.
-- =============================================================================
create table if not exists modal_events (
  id          bigserial primary key,
  modal_id    text        not null,      -- UUID por abertura do modal
  step        text        not null,      -- passo alcançado (ver lista acima)
  item_slug   text,                      -- parceiro (offer_shown / offer_check)
  cta_type    text,                      -- gatilho do open (hero/navbar/…) ou origem do card
  page_path   text,                      -- página onde o modal foi aberto
  visitor_id  text,
  session_id  text,
  created_at  timestamptz not null default now()
);
create index if not exists modal_events_modal_idx   on modal_events (modal_id);
create index if not exists modal_events_step_idx     on modal_events (step, created_at desc);
create index if not exists modal_events_created_idx  on modal_events (created_at desc);
create index if not exists modal_events_item_idx     on modal_events (item_slug);

-- =============================================================================
-- magic_tokens — autenticação por link mágico (consumido no Sprint 7)
-- =============================================================================
create table if not exists magic_tokens (
  id         bigserial primary key,
  token_hash text not null unique,        -- sha256 do token (nunca o token em claro)
  email      text not null,
  expires_at timestamptz not null,
  used_at    timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists magic_tokens_hash_idx on magic_tokens (token_hash);
create index if not exists magic_tokens_expires_idx on magic_tokens (expires_at);

-- purpose: 'admin' | 'visitor' (magic link do visitante — salvar roteiro)
alter table magic_tokens add column if not exists purpose text not null default 'admin';

-- =============================================================================
-- visitor_accounts + saved_roteiros — retenção (Sprint 7 Roteiro Foz)
-- =============================================================================
create table if not exists visitor_accounts (
  email       text primary key,
  name        text,
  whatsapp    text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists saved_roteiros (
  id              bigserial primary key,
  email           text not null references visitor_accounts(email) on delete cascade,
  slug            text,
  titulo          text not null,
  draft_json      jsonb,
  resumo          text,
  source          text,
  template_slug   text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists saved_roteiros_email_idx
  on saved_roteiros (email, updated_at desc);

-- =============================================================================
-- leads — captura de contatos via modal "Oferta de Ingresso" (O Cofre)
-- Auto-criada em runtime por app/api/leads/route.ts (create table if not exists).
-- Turbinada (jun/2026): atribuição de parceiro, consentimento LGPD, UTM completo,
-- join com `events` (session_id/visitor_id), geo, e event_id (dedupe Pixel↔CAPI).
-- =============================================================================
create table if not exists leads (
  id         bigserial primary key,
  nome       text,
  email      text,
  whatsapp   text        not null,
  cta_type   text,
  created_at timestamptz not null default now()
);

-- Reduz atrito: permite captura só-WhatsApp no futuro sem quebrar o banco.
alter table leads alter column nome drop not null;
-- Rascunho de abandono (jul/2026 — ver /api/leads/draft): pode salvar só com nome
-- (sem telefone ainda) — sem isso o INSERT do rascunho quebra com "null value in column whatsapp".
alter table leads alter column whatsapp drop not null;

-- Colunas táticas (idempotente p/ tabelas criadas antes deste upgrade):
alter table leads add column if not exists assigned_partner text;                    -- p/ quem o lead foi roteado (agência ativa no momento, ver app_settings.active_agency)
alter table leads add column if not exists lgpd_consent     boolean default true;     -- registro do aceite dos Termos
alter table leads add column if not exists page_path        text;                     -- página onde o modal foi aberto
alter table leads add column if not exists session_id       text;                     -- join com events (jornada completa)
alter table leads add column if not exists visitor_id       text;                     -- id anônimo persistente
alter table leads add column if not exists utm_source       text;
alter table leads add column if not exists utm_medium       text;
alter table leads add column if not exists utm_campaign     text;
alter table leads add column if not exists utm_content      text;
alter table leads add column if not exists utm_term         text;
alter table leads add column if not exists country          text;                     -- geo do Vercel (x-vercel-ip-country)
alter table leads add column if not exists city             text;                     -- geo do Vercel (x-vercel-ip-city)
alter table leads add column if not exists referrer         text;
alter table leads add column if not exists user_agent       text;
alter table leads add column if not exists event_id         text;                     -- dedupe Meta Pixel (browser) ↔ CAPI (servidor)

-- Telegram Mini-CRM (jul/2026): notificação no grupo de vendedores + "Assumir Lead" anti-colisão.
-- claimed_by/claimed_at gravados pelo webhook (app/api/telegram-webhook) via UPDATE atômico
-- (WHERE claimed_by IS NULL → primeiro clique vence). Ver conventions §12.
alter table leads add column if not exists telegram_message_id bigint;                 -- id da mensagem no grupo (auditoria)
alter table leads add column if not exists claimed_by           text;                   -- vendedor que assumiu (nome + @username do Telegram)
alter table leads add column if not exists claimed_by_id        bigint;                 -- user_id do Telegram de quem assumiu (TG-4: trava o wa.me no dono)
alter table leads add column if not exists claimed_at           timestamptz;            -- quando assumiu

-- Ação para parceiros (PA, jul/2026): qualificação do lead + trilha de roteamento por nicho. Ver conventions §15.
alter table leads add column if not exists is_local        boolean;                     -- morador de Foz? (qualificação do modal)
alter table leads add column if not exists already_in_foz  boolean;                     -- já está em Foz? (null quando morador)
alter table leads add column if not exists selected_offers text;                        -- slugs de oferta marcados no modal (csv) — trilha do roteamento
alter table leads add column if not exists modal_id        text;                        -- UUID da abertura do modal → cruza com modal_events (ex: clicou no CTA final do sucesso)
-- Transporte (cross-sell da agência oficial) — TRI-STATE, e o null é significativo:
--   true  = perguntamos e a pessoa QUER transporte
--   false = perguntamos e a pessoa RECUSOU (resposta explícita "Não" no modal)
--   null  = NÃO perguntamos (toggle de transporte desligado no admin quando o lead foi captado)
-- ⚠️ Nunca coagir null→false: isso faria a coluna afirmar "não quer" sobre quem ninguém perguntou, e
-- contaminaria o denominador de qualquer taxa de aceite. Quem decide "foi perguntado?" é o servidor
-- (`offer.transportOffer.enabled` em app/api/leads/route.ts), não o cliente.
-- ⓘ Linhas gravadas antes desta regra podem ter `false` onde hoje seria `null` — dado histórico, não retroativo.
-- ⓘ O wizard /montar-roteiro tem um passo de transfer PRÓPRIO (sim|nao|depois), independente deste
--    cross-sell: se o cross-sell estiver desligado, o lead do wizard fica com `wants_transport = null`
--    mesmo tendo respondido — a resposta crua (incl. "depois", que aqui não tem representação) vive em
--    `roteiro_transfer`. Duas perguntas diferentes, duas colunas; nada se perde.
alter table leads add column if not exists wants_transport boolean;
alter table leads add column if not exists wants_hotel boolean;                          -- lead pediu hotel (cross-sell no sucesso; turista ainda não em Foz)
alter table leads add column if not exists locale          text;                        -- idioma escolhido no modal (pt|en|es) → a agência inicia a conversa no idioma certo
-- itinerary_offers removido (jul/2026): bloco "Quer incluir experiências no seu roteiro?" tirado do modal.
alter table leads drop column if exists itinerary_offers;

-- Antiabuso (jul/2026): rate limit por IP + dedup por WhatsApp recente. Ver conventions.
alter table leads add column if not exists ip_hash text;                                 -- SHA-256 do IP (nunca o IP em claro) — só pra contar envios recentes, não é PII reversível

-- Roteiro (produto Roteiro Foz + wizard /montar-roteiro): contexto + qualificação estruturada. Ver conventions §20.
alter table leads add column if not exists lead_context      text;                        -- atrativo | roteiro | ingresso | …
alter table leads add column if not exists roteiro_slug      text;
alter table leads add column if not exists roteiro_titulo    text;
alter table leads add column if not exists roteiro_resumo    text;                        -- resumo legível (qualificação empacotada) → Telegram "Montagem"
-- roteiro_preference removido (jul/2026): pergunta Manter/Personalizar tirada do modal.
alter table leads drop column if exists roteiro_preference;
alter table leads add column if not exists roteiro_dias      text;                        -- wizard: dias (1..5+/undecided)
alter table leads add column if not exists roteiro_pessoas   text;                        -- wizard: pessoas
alter table leads add column if not exists roteiro_orcamento text;                        -- wizard: economica|equilibrada|maximo
alter table leads add column if not exists roteiro_perfil    text;                        -- wizard: csv (criancas,idosos,pne)
alter table leads add column if not exists roteiro_gastro    text;                        -- wizard: sim|depois
alter table leads add column if not exists roteiro_hotel     text;                        -- wizard: sim|tenho|depois
alter table leads add column if not exists roteiro_transfer  text;                        -- wizard: sim|nao|depois
alter table leads add column if not exists roteiro_vivencia  text;                        -- wizard: csv ("como quer viver Foz") — estruturado p/ a página do pedido não parsear o resumo

-- Calendário + quantidade (D5/D6): dia da visita/início (atrativo + roteiro pronto/personalizar, via modal
-- OU via wizard) e quantidade de ingressos (só atrativo, via modal). Fora da chave de dedup.
alter table leads add column if not exists visit_date date;
alter table leads add column if not exists ticket_qty int;

-- Persistência de lead + funil consolidado (jul/2026 — ver conventions §2/§17):
alter table leads add column if not exists abandoned         boolean not null default false; -- rascunho de abandono silencioso (/api/leads/draft) — nunca roteado/notificado
alter table leads add column if not exists cta_shown         boolean;                     -- CTA final da tela de sucesso foi EXIBIDO? (/api/leads/success)
alter table leads add column if not exists cta_clicked       boolean;                     -- CTA final foi CLICADO?
alter table leads add column if not exists success_cta_type  text;                        -- qual CTA: modal_central_whatsapp | modal_success_direct
alter table leads add column if not exists product_signature text;                        -- assinatura estável do produto pedido (dedup por produto, ver lib/known-lead.ts)

-- Reconciliação "um cliente, um card" (Sprint 6): reenvio do mesmo produto dentro da janela de dedup
-- reescreve o card pendente em vez de duplicar a fila. `superseded_by` aponta pro lead que herdou o card
-- (telegram_message_id migra pra lá) — cadeia sempre PLANA (nunca A→B→C, ver app/api/leads/route.ts).
alter table leads add column if not exists superseded_by bigint;

-- Página pública do pedido (/r/[token]) — o link curto que vai ao WhatsApp das duas pontas e ao card
-- do Telegram. `public_token` é aleatório e não enumerável; `item_slugs` guarda os SLUGS dos atrativos
-- (nunca os nomes: a página resolve pelo catálogo e ainda linka cada um). As três origens — modal com
-- ingressos extras, roteiro pronto/dias avulsos e a cesta do wizard — postam o MESMO campo já unificado,
-- em vez de o servidor re-derivar de `content_ids`/`item_slug`: derivação paralela é como as duas pontas
-- passam a discordar sobre o que foi pedido. Ver conventions/funil-modal.md.
alter table leads add column if not exists public_token text;
alter table leads add column if not exists item_slugs   text;                             -- csv de slugs de atrativo, na ordem em que foram escolhidos
create unique index if not exists leads_public_token_idx on leads (public_token);

create index if not exists leads_created_idx  on leads (created_at desc);
create index if not exists leads_session_idx  on leads (session_id);
create index if not exists leads_assigned_idx on leads (assigned_partner);
create index if not exists leads_ip_hash_idx  on leads (ip_hash);
create index if not exists leads_abandoned_session_idx on leads (session_id, abandoned);
create index if not exists leads_abandoned_created_idx on leads (abandoned, created_at desc);

-- =============================================================================
-- partner_settings — ativa/desativa parceiros na home sem redeploy
-- Auto-criada em runtime por lib/partner-settings.ts (create table if not exists).
-- Modelo opt-out: slug ausente = ativo por padrão.
-- =============================================================================
create table if not exists partner_settings (
  slug        text        primary key,
  enabled     boolean     not null default true,
  updated_at  timestamptz not null default now()
);

-- =============================================================================
-- niche_settings — atribuição DINÂMICA nicho↔parceiro (a "Recomendação Oficial" de cada
-- página de nicho, gerenciável no admin sem deploy). Auto-criada + seed idempotente em runtime
-- por lib/niche-settings.ts (a partir do estático Partner.niches). Ver conventions §14.
--   partner_slug = <slug>  → parceiro exclusivo do nicho (pitch)
--   partner_slug = NULL    → Empty State forçado
--   sem linha              → fallback estático (Partner.niches)
-- =============================================================================
create table if not exists niche_settings (
  niche_key    text        primary key,
  partner_slug text,
  updated_at   timestamptz not null default now()
);

-- =============================================================================
-- partner_lead_settings — "Ação para parceiros" no modal + roteamento de leads por nicho (PA).
-- Auto-criada + upsert em runtime por lib/partner-offers.ts. Keyed pelo slug (casa com activePartners).
-- SERVER-ONLY: telegram_chat_id/coupon/greeting_template NUNCA vão ao client (só o roteamento os lê).
-- Ver conventions §15.
--   enabled = true  → exibe o checkbox da oferta no modal (e habilita o roteamento pro grupo do nicho)
-- =============================================================================
create table if not exists partner_lead_settings (
  partner_slug      text        primary key,
  enabled           boolean     not null default false,
  show_checkbox     boolean     not null default true,   -- false = mostra o card do parceiro SEM checkbox (sugestão, sem coleta)
  telegram_chat_id  text,                                 -- grupo Telegram do nicho (id negativo)
  coupon            text,                                 -- ex: YUP15 (entra na saudação pronta)
  greeting_template text,                                 -- msg do wa.me que o parceiro envia (placeholders {nome} {cupom})
  checkbox_label    text,                                 -- rótulo do checkbox (ex: Quero 15% OFF na Pizzaria)
  copy              text,                                 -- copy curta do card
  cta_label         text,                                 -- override do texto do botão CTA principal (default: Partner.ctaLabel)
  image_path        text,                                 -- override da foto (default: partner.cover)
  badge             text,                                 -- selo/label no canto do card (ex: "15% OFF", cupom) — sobre a borda
  sort_order        integer     not null default 0,
  updated_at        timestamptz not null default now()
);
alter table partner_lead_settings add column if not exists show_checkbox     boolean not null default true;
alter table partner_lead_settings add column if not exists cta_label         text;
alter table partner_lead_settings add column if not exists badge             text;
-- show_in_itinerary removido (jul/2026): master switch + bloco "incluir experiências no roteiro" tirados do modal.
alter table partner_lead_settings drop column if exists show_in_itinerary;

-- i18n Fase 3 (jul/2026): checkbox_label/copy/cta_label/badge SEM sufixo continuam sendo o valor PT
-- (compatibilidade — nada do que já foi digitado se perde). en/es ganham colunas NOVAS.
alter table partner_lead_settings add column if not exists checkbox_label_en text;
alter table partner_lead_settings add column if not exists checkbox_label_es text;
alter table partner_lead_settings add column if not exists copy_en           text;
alter table partner_lead_settings add column if not exists copy_es           text;
alter table partner_lead_settings add column if not exists cta_label_en      text;
alter table partner_lead_settings add column if not exists cta_label_es      text;
alter table partner_lead_settings add column if not exists badge_en          text;
alter table partner_lead_settings add column if not exists badge_es          text;

-- =============================================================================
-- attraction_offer_settings — "Ingresso por atrativo": Modo (Direto/Agência) + Tem link +
-- URL, por atrativo. Auto-criada + upsert em runtime por lib/attraction-offers.ts. Keyed
-- pelo slug (casa com app/data/attractions.ts). SEM campos sensíveis — roteamento de lead
-- continua 100% global (seção Agência); esta tabela só decide o que a tela de sucesso do
-- modal mostra para aquele atrativo específico.
--   has_link = false → esse atrativo não tem ingresso/link (ex.: Compras Paraguai, Feirinha)
--   mode = 'direct'  → tela de sucesso sempre mostra official_url deste atrativo
--   mode = 'agency'  → tela de sucesso cai no modo de sucesso GLOBAL
--   no_link_mode     → só usado quando has_link=false: 'close' | 'whatsapp' (escolha PRÓPRIA do
--                       atrativo pra tela de sucesso — não herda o bucket global "Atrativos individuais")
-- =============================================================================
create table if not exists attraction_offer_settings (
  attraction_slug text        primary key,
  has_link        boolean     not null default true,
  mode            text        not null default 'direct',  -- 'direct' | 'agency'
  official_url    text,
  no_link_mode    text        not null default 'close',    -- 'close' | 'whatsapp'
  updated_at      timestamptz not null default now()
);
alter table attraction_offer_settings add column if not exists no_link_mode text not null default 'close';

-- =============================================================================
-- app_settings — configurações globais chave/valor (sem redeploy).
-- Auto-criada em runtime por lib/offer-settings.ts (e por lib/partner-settings/cta legado).
-- Chaves: offer_mode = 'direct' | 'queue' | 'central' (modo de operação do lead — ver conventions §2/§12),
--         central_whatsapp (nº central p/ o modo 'central'), partner_agency_name (nome exibido no modo 'queue').
--         cta_mode ('direct'|'modal') = valor LEGADO, ainda lido como fallback (modal→queue).
-- =============================================================================
create table if not exists app_settings (
  key        text        primary key,
  value      text        not null,
  updated_at timestamptz not null default now()
);

-- Limpeza de chaves de features REMOVIDAS (idempotente — `delete` de linha inexistente é no-op).
-- Diferente das colunas órfãs de `leads`, que são preservadas de propósito (dado histórico de lead
-- captado), estas são só CONFIGURAÇÃO de algo que não existe mais: manter polui o `app_settings` e
-- faz um leitor futuro achar que a feature ainda existe.
--   • modal_success_gastronomy_cta — CTA "onde comer" da tela de sucesso INTERNA do modal, que deixou
--     de existir quando todo submit passou a redirecionar pra /obrigado. A navegação pra onde-comer /
--     hospedagem / transfer vive nos cards da própria página de obrigado (components/obrigado/ObrigadoCards.tsx).
--   • agency_info_only_armed — marcador do "auto-arm" do modo SÓ INFO, mecanismo removido: o toggle
--     `agency_info_only_no_plan` é autoridade única (ver conventions/telegram.md §12-bis).
--   • agency_greeting* — a mensagem pronta do wa.me virou POR PRODUTO ("3b · Textos por produto",
--     `productCopies[kind].waGreeting`): a abertura de quem pediu ingresso de atrativo não serve pra
--     quem pediu roteiro sob medida, e a chave global dizia "ingressos ou roteiro" por não saber qual era.
--   • transport_offer_image / transport_offer_include_label* — o card de transporte perdeu a foto e o
--     rótulo de checkbox (virou pergunta Sim/Não, onde title é a pergunta e desc é o argumento).
--   • modal_whatsapp_text* — o texto pré-preenchido que o VISITANTE dispara no CTA da tela de sucesso
--     também virou POR PRODUTO (`productCopies[kind].waLeadText`). O NÚMERO (`modal_whatsapp_number`)
--     continua global, esse sim é o mesmo pros três.
delete from app_settings where key in (
  'modal_success_gastronomy_cta', 'modal_success_gastronomy_cta_en', 'modal_success_gastronomy_cta_es',
  'agency_info_only_armed',
  'agency_greeting', 'agency_greeting_en', 'agency_greeting_es',
  'transport_offer_image',
  'transport_offer_include_label', 'transport_offer_include_label_en', 'transport_offer_include_label_es',
  'modal_whatsapp_text', 'modal_whatsapp_text_en', 'modal_whatsapp_text_es',
  -- ago/2026: viraram campo POR PRODUTO (product_copy_{atrativo|roteiro|personalizar}_{campo}[_en|_es]).
  -- As chaves globais abaixo não são mais lidas por ninguém — o rótulo do botão e o aviso de reenvio
  -- precisam falar do produto certo ("meu ingresso" ≠ "meu roteiro").
  'modal_wa_button_label', 'modal_wa_button_label_en', 'modal_wa_button_label_es',
  'modal_duplicate_notice_title', 'modal_duplicate_notice_title_en', 'modal_duplicate_notice_title_es',
  -- ago/2026: idem, mas só pro produto ATRATIVO (product_copy_atrativo_*). O modo "Link direto" não
  -- existe em roteiro pronto/personalizado — eles não têm site oficial externo pra apontar.
  'modal_success_direct', 'modal_success_direct_en', 'modal_success_direct_es',
  'modal_direct_button_label', 'modal_direct_button_label_en', 'modal_direct_button_label_es'
);

-- ─────────────────────────────────────────────────────────────────────────────────────────────────
-- ago/2026 · EDITORES DE TEXTO DESATIVADOS → toda a copy do modal virou código
-- (`lib/offer-defaults.ts`, nos 3 idiomas). Decisão do dono do produto: o admin edita COMPORTAMENTO,
-- não texto. Ver `conventions/funil-modal.md` §2-bis.
--
-- ⚠️ Este DELETE não é opcional nem cosmético. A LEITURA (`getOfferConfig`) continua preferindo o valor
-- gravado ao default do código — é o que permite reativar a edição sem mudar mais nada. Enquanto essas
-- chaves existirem, elas VENCEM o texto novo: mexer em `offer-defaults.ts` não mudaria nada no site, e o
-- sintoma seria mudo (nenhum erro, só a copy velha continuando lá).
--
-- Idempotente, e o padrão cobre também os `product_copy_*` dos 3 produtos × 3 idiomas de uma vez.
-- ↩️ Reativando os editores: apagar este bloco, senão cada migração desfaz o que você digitou.
-- ─────────────────────────────────────────────────────────────────────────────────────────────────
delete from app_settings
 where key like 'product\_copy\_%'
    or key like 'transport\_offer\_title%'
    or key like 'transport\_offer\_desc%'
    or key in (
      'modal_title', 'modal_title_en', 'modal_title_es',
      'modal_subtitle', 'modal_subtitle_en', 'modal_subtitle_es',
      'modal_form_hint', 'modal_form_hint_en', 'modal_form_hint_es',
      'modal_submit_label', 'modal_submit_label_en', 'modal_submit_label_es',
      'modal_success_title', 'modal_success_title_en', 'modal_success_title_es',
      'modal_success_close', 'modal_success_close_en', 'modal_success_close_es',
      'modal_success_whatsapp', 'modal_success_whatsapp_en', 'modal_success_whatsapp_es',
      'modal_q_local', 'modal_q_local_en', 'modal_q_local_es',
      'modal_q_in_foz', 'modal_q_in_foz_en', 'modal_q_in_foz_es',
      'modal_qualify_title', 'modal_qualify_title_en', 'modal_qualify_title_es'
    );

-- Órfãs ANTERIORES a esta rodada: textos de blocos do modal já extintos (bloco "incluir experiências no
-- roteiro", oferta de parceiro no sucesso, recuperação, pular etapa, botão Fechar, checagem de parceiro).
-- Nenhum código lê nenhuma delas — apareceram no inventário quando as chaves de texto foram limpas.
-- ⚠️ NÃO incluir `modal_success_mode*` nem `modal_whatsapp_number` aqui: apesar do prefixo `modal_`,
-- são COMPORTAMENTO (modo de sucesso por bucket e o número do WhatsApp) e continuam em uso.
delete from app_settings
 where key like 'modal\_close\_label%'
    or key like 'modal\_itinerary\_%'
    or key like 'modal\_offers\_title%'
    or key like 'modal\_partner\_check\_%'
    or key like 'modal\_recovery\_%'
    or key like 'modal\_section\_%'
    or key like 'modal\_skip\_%'
    or key like 'modal\_success\_offers\_%';

-- =============================================================================
-- agencies — base de AGÊNCIAS (recebem os leads; ≠ partners/negócios locais).
-- Auto-criada + seeds em runtime por lib/agencies.ts. Ver conventions §13.
-- Relação: leads.assigned_partner guarda o slug da agência ATIVA no momento da captura
-- (app_settings.active_agency define quem é a ativa). Trocar de agência não apaga o histórico.
-- =============================================================================
create table if not exists agencies (
  slug         text        primary key,
  name         text        not null,
  city         text,
  country      text,                                   -- BR | AR | PY
  whatsapp     text,
  instagram    text,
  website      text,
  description  text,
  logo_path    text,
  created_at   timestamptz not null default now()
);

-- Seeds espelham app/data/agencies.ts (SSOT de perfil). Em runtime, lib/agencies.ensure()
-- re-sincroniza contatos/descrição a partir do catálogo (sem sobrescrever overrides manuais no DB).
insert into agencies (slug, name, city, country, whatsapp, instagram, website, description) values
  (
    'foz-falls',
    'Foz Falls',
    'Foz do Iguaçu',
    'BR',
    '5545999749860',
    'fozfallsturismo',
    'https://fozfallsturismo.com.br/',
    'A Foz Falls Turismo e Viagem é uma agência especializada em turismo privativo na Tríplice Fronteira, com equipe preparada e veículos executivos (carro e van) para transfers e passeios. Roteiros personalizados, ingressos e logística em Foz do Iguaçu, Argentina e Paraguai.'
  )
  on conflict (slug) do nothing;
insert into agencies (slug, name, city, country, description)
  values ('agencia-teste', 'Agência Teste', 'Foz do Iguaçu', 'BR', 'Agência de teste para validar o fluxo de atribuição de leads e as telas futuras. Não deve aparecer em páginas públicas.')
  on conflict (slug) do nothing;

-- =============================================================================
-- hotels — catálogo operacional de HOTÉIS (recomendação do nicho hospedagem).
-- Perfil SSOT = app/data/hotels.ts. Auto-criada + seed em runtime por lib/hotels.ts.
-- Ativa = app_settings.active_hotel (slug ou __none__).
-- =============================================================================
create table if not exists hotels (
  slug         text        primary key,
  name         text        not null,
  city         text,
  country      text,
  whatsapp     text,
  instagram    text,
  website      text,
  description  text,
  logo_path    text,
  created_at   timestamptz not null default now()
);

insert into hotels (slug, name, city, country, website, description) values
  (
    'hotel-teste',
    'Hotel Teste',
    'Foz do Iguaçu',
    'BR',
    'https://www.roteirofoz.com.br/',
    'Hotel de teste do portal Roteiro Foz. Serve para validar o fluxo de ativação no admin e a recomendação no nicho de hospedagem.'
  )
  on conflict (slug) do nothing;

-- =============================================================================
-- plan_entities / plan_period_events — plano mensal manual (sem Stripe).
-- Topo da hierarquia de exibição (parceiro/agência/hotel). Auto-criada em lib/plan-periods.ts.
-- =============================================================================
create table if not exists plan_entities (
  entity_type  text not null,              -- partner | agency | hotel
  entity_slug  text not null,
  period_start timestamptz,
  period_end   timestamptz,
  updated_at   timestamptz not null default now(),
  primary key (entity_type, entity_slug)
);
create index if not exists plan_entities_end_idx on plan_entities (period_end);

create table if not exists plan_period_events (
  id           bigserial primary key,
  entity_type  text not null,
  entity_slug  text not null,
  event_type   text not null,              -- start | renew
  period_start timestamptz not null,
  period_end   timestamptz not null,
  note         text,
  created_by   text,
  created_at   timestamptz not null default now()
);
create index if not exists plan_period_events_entity_idx
  on plan_period_events (entity_type, entity_slug, created_at desc);

alter table plan_entities add column if not exists paused_at timestamptz;

-- Observações do ciclo (shared = parceiro+admin; admin = só admin)
create table if not exists plan_period_notes (
  id           bigserial primary key,
  entity_type  text not null,
  entity_slug  text not null,
  period_start timestamptz not null,
  body         text not null,
  visibility   text not null default 'shared',
  created_by   text,
  created_at   timestamptz not null default now()
);
create index if not exists plan_period_notes_entity_idx
  on plan_period_notes (entity_type, entity_slug, period_start desc, created_at desc);

-- Notas internas da entidade (independentes do ciclo) — só admin
create table if not exists plan_entity_notes (
  id           bigserial primary key,
  entity_type  text not null,
  entity_slug  text not null,
  body         text not null,
  created_by   text,
  created_at   timestamptz not null default now()
);
create index if not exists plan_entity_notes_entity_idx
  on plan_entity_notes (entity_type, entity_slug, created_at desc);

-- =============================================================================
-- portal_accounts — login do painel de leitura (magic link por e-mail)
-- Sessão separada do admin (cookie rgf_portal_session). Auto-criada em lib/portal-auth.ts.
-- Tokens reutilizam magic_tokens; verify em /api/portal/verify.
-- =============================================================================
create table if not exists portal_accounts (
  entity_type   text not null,             -- partner | agency | hotel
  entity_slug   text not null,
  email         text not null,             -- e-mail que recebe o magic link
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  primary key (entity_type, entity_slug)
);
create unique index if not exists portal_accounts_email_uidx
  on portal_accounts (lower(email))
  where email is not null and email <> '';
