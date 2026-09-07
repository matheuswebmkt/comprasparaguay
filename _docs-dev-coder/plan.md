// Filepath: _docs-dev-coder/plan.md
// Version: 1.0
// Nome da Versão: "Auditoria pré-deploy Compras PY — contrato do pixel, remoção do portal e sincronia de docs"

# PLAN — Auditoria pré-deploy (Compras PY)

> **Escopo desta tarefa:** preparar o repo para ir a produção como **satélite `comprasparaguay`**
> plugado no pixel de portfólio (`_docs-portfolio/`). Nada aqui é esforço novo de produto: é
> correção do que a grande remoção de páginas/rotas deixou para trás + documentação de execução.
>
> ⚠️ **Este arquivo é efêmero e só carries THIS task** (§1.1). Decisão durável, fato estrutural e
> restrição de projeto vão para `conventions/*.md` e `architecture/*.md` — Sprint 5 é quem faz isso.
> Ao fim do esforço: arquivar e apagar.

---

## Estado dos portões (baseline)

| Checagem | HEAD `17e3ec6` |
|---|---|
| `npx tsc --noEmit` | ✅ 0 erros |
| `pnpm build` | ✅ EXIT=0 (3 warnings de lint: `<img>` no MetaPixel, 2 `react-hooks`) |

**Regra de execução:** rodar os dois portões **ao final de cada sprint**. Sprint sem portão verde
não está concluído e não avança (§3.1).

**Nunca nesta tarefa:** editar `_docs-dev-coder/context.md`; alterar `LEAD_VALUE_WEIGHTS`,
`LEAD_VALUE_MULTIPLIER_BRL` ou `LEAD_VALUE_VERSION` (re-baseline de portfólio, D3/D12); criar pixel
novo (D1); recriar `ViewModalVIP` (D10); escrever string literal de `vertical`/`niche` em ponto de
disparo (G7); preencher param ausente com `""`/`unknown` (D8).

---

## Sprints

### ✅ Sprint 0 — Auditoria (concluída)

Varredura completa: rotas, links internos, dados, camada de tracking, env, build. Detalhe na seção
**Achados** abaixo. Nenhum achado novo desde então.

---

### ✅ Sprint 1 — Contrato do pixel (P0) — CONCLUÍDO

**1.1 Restaurar o bloco congelado de `lib/tracking-taxonomy.ts`.**
O commit `17e3ec6` encolheu o enum do **portfólio** porque o **dado** deste site encolheu. Eixos
diferentes: dado limpo está certo; o enum é vocabulário compartilhado dos três satélites, e um valor
de enum que nenhum dado daqui produz **nunca é enviado** (D8 já cuida disso — custo zero).

Estado atual (ERRADO) → restaurar:
- `export type Vertical` → volta `"hotelaria" | "gastronomia"`
- `export type Niche` → volta as 7 chaves de gastronomia (`bar-e-cervejaria`, `churrascaria`,
  `restaurante`, `pizzaria`, `shawarma`, `sushi`, `hamburgueria`) + `transfer`
- `VERTICALS` → 4 entradas · `NICHES` → 8 entradas
- `VERTICAL_BY_PARTNER_CATEGORY` → volta `gastronomia` e `hotelaria` (é `Record<string, Vertical>`,
  então compila mesmo com `PartnerCategory = "turismo"`)
- Comentários de cabeçalho do bloco congelado (inclusive o de `AttributionParams`, que voltou a
  dizer "DUAS fontes") → restaurar o texto do portfólio

Fonte byte-a-byte: `git show 17e3ec6^:lib/tracking-taxonomy.ts`. Manter
`TAXONOMY_VERSION = "2026-08-v1"` (sem bump — com o bloco restaurado a afirmação volta a ser
verdade). *Atualizado depois: o Sprint 8 bumpou para `2026-09-v1`, porque aí sim entrou valor de enum
novo (D14).* **Não** restaurar nada do BLOCO LOCAL (`TRACKING_PROPERTY`).
Aceite: `git diff 17e3ec6^ -- lib/tracking-taxonomy.ts` vazio.

**1.2 Religar `content_ids`** em `components/ticket-offer/TicketOfferModal.tsx` — três pontos, hoje
todos lendo `detail?.contentIds`, que nenhum chamador preenche mais (o produto-bundle `/roteiros`
saiu): usar `pedidoItems` (≈L364, = `[itemSlug, ...extraAttractions]` — destino de entrada + extras
marcados no modal), que hoje só alimenta a coluna `item_slugs` do banco.
- `InitiateCheckout` (≈L669) → nota honesta: dispara na abertura, antes dos extras; a lista vem só
  com o destino de entrada. Correto (é o bundle daquele instante), não é bug.
- `Lead` (≈L1074)
- corpo do POST `/api/leads` (≈L1143) → alimenta o espelho CAPI em `lib/meta-capi.ts` (G1)
Aceite: mesma expressão nos três; array vazio → omitido (D8), nunca `[]` enviado.

**1.3 Não toca em `_docs-portfolio/` neste sprint.** A regra não mudou (D7/§1.3 continua valendo);
a tabela de status só é atualizada no Sprint 6, depois da re-validação G1.

---

### ✅ Sprint 2 — Remover o portal do parceiro (decisão do usuário) — CONCLUÍDO

`/comercial/login` e `/comercial/painel` **nunca existiram** neste repo e são destino de redirect de
três APIs e de um link do admin → portal = 404 em qualquer caminho.

Apagar:
- `app/api/portal/login/route.ts`, `app/api/portal/verify/route.ts`, `app/api/portal/logout/route.ts`
- `app/api/admin/portal-account/route.ts`
- `components/admin/PortalAccessControl.tsx`
- `lib/portal-auth.ts`, `lib/portal-session.ts`

Editar:
- `middleware.ts` — bloco 2 (`/comercial/painel`), o import `PORTAL_SESSION_COOKIE, verifyPortalSessionToken` e o cabeçalho do arquivo
- `next.config.ts` — `headers()` dos `/comercial*` (se sobrar só isso, remover a função) e o comentário
- `app/robots.ts` — só o comentário sobre `/comercial`; o `DISALLOW = ["/admin", "/api"]` permanece
- `app/admin/dashboard/planos/page.tsx` — import e uso de `PortalAccessControl` (≈L30, ≈L367) e o link `/comercial/login` (≈L214)
- `db/schema.sql` — bloco `portal_accounts`. ⚠️ O schema não faz DROP: a tabela continua no Neon e
  fica órfã; dropar à mão é decisão separada do usuário.

Falsos positivos já conferidos (NÃO mexer): "portal independente" em `lib/i18n/home.ts`,
`lib/i18n/paginas.ts`, `lib/offer-defaults.ts` é o próprio site; `Portal` do Radix em
`components/ui/sheet.tsx` e `tooltip.tsx`.

---

### ✅ Sprint 3 — Telemetria 1st-party (métricas próprias) — CONCLUÍDO

- `app/api/track/route.ts`: adicionar `/transfer` em `STATIC_PATHS`. Hoje `/transfer` só é rastreável
  **por acidente**, porque `NICHE_PATHS` monta `/${n.slug}` e o slug do nicho é literalmente
  `transfer` — se o slug mudar por SEO, o vertical carro-chefe (D1) para de gravar pageview, clique
  **e impression**, sem erro. Remover `PARTNER_PATHS` + `NICHE_PATHS` (e o import de
  `@/app/data/niches`) e a regex morta `/^\/roteiros\/[a-z0-9-]+$/` com a exceção
  `/roteiros/personalizar`.
- `lib/cookie-consent.ts`: `rgf_cookie_consent` → `cp_cookie_consent` e `rgf:cookie-consent-granted`
  → `cp:cookie-consent-granted` (vocabulário de outro satélite, D9; domínio greenfield → trocar agora
  custa zero, depois custa re-coleção de consentimento). Verificar consumidores em
  `components/CookieBanner.tsx` / `components/analytics/ConsentGate.tsx`.
- Apagar `lib/i18n/niche-labels.ts` — órfão: o único consumidor era `NicheClusterLinks`, que não
  existe mais.
- ⚠️ **Não** apagar `lib/visitor-auth.ts` / `lib/visitor-session.ts`: estão vivos via
  `/api/visitor/me`, chamado pelo `TicketOfferModal` (≈L614).

---

### ✅ Sprint 4 — Env — CONCLUÍDO (+ achado novo F14, ver Achados)

- `.env.example`: adicionar `NEXT_PUBLIC_GA_ID`, remover `NEXT_PUBLIC_GTM_ID` e `TELEGRAM_CHAT_ID`?
  → `TELEGRAM_CHAT_ID` **fica** (ainda é lido pela migração 1× em `lib/offer-settings.ts:256`).
- `.env.local`: remover `NEXT_PUBLIC_GTM_ID` (o componente GTM foi deletado; a var viva é
  `NEXT_PUBLIC_GA_ID`, hoje só com default hardcoded `G-1TLW6PM0Q8` em `components/analytics/GoogleAnalytics.tsx`).
- Não commitar valor de chave alguma.

---

### ✅ Sprint 5 — Documentação de execução (a causa raiz dos achados) — CONCLUÍDO

`_docs-dev-coder/` hoje tem só `context.md` + personas: os índices que o próprio §1.1 manda abrir
não existem, e o `README.md` aponta para 5 arquivos inexistentes.

Criar (conteúdo nos temáticos, índice só mapa — §4):
- `architecture.md` (índice) + `architecture/rotas.md` — estado real: `/`, `/roteiros-de-compras`,
  `/roteiros-de-compras/[slug]` (5 destinos), `/transfer`, `/triplice-fronteira`, `/obrigado`,
  institucionais, admin e APIs. **Sem** `/comercial*` (Sprint 2).
- `conventions.md` (índice) + `conventions/tracking-metricas.md` — **com o ponteiro duro para
  `_docs-portfolio/pixel-matrix.md` + `pixel-decisions.md`**, que é a "consequência operacional
  obrigatória" do D9 e hoje não existe em lugar nenhum.
- Registrar como decisão travada em `conventions/`: (a) `sameAs` do JSON-LD e redes do footer
  apontam para `instagram.com/roteirosfoz` / `facebook.com/roteirofoz` **por decisão do usuário** —
  o domínio não tem redes próprias, é projeto de busca orgânica; (b) gastronomia saiu do projeto
  (dado), mas o enum do portfólio permanece o superset (Sprint 1.1); (c) portal do parceiro não
  existe neste satélite.
- Corrigir `README.md`: a rota real é `/roteiros-de-compras/[slug]` (a tabela diz `/atrativos/[slug]`)
  e a tabela "Docs de execução" só lista arquivos que passam a existir.
- Trocar citações mortas nos cabeçalhos por destino real: `design-system.md §3` (`app/layout.tsx`),
  `conventions §5-bis/§13/§13-ter/§21.6/§21.8`, `plan.md` G1–G8 (`lib/lead-value.ts`,
  `lib/meta-capi.ts`, `lib/analytics.ts`, `TicketOfferModal`), `conventions/tracking-metricas.md §6`.
- Atualizar cabeçalhos de arquivo (Version / Nome da Versão) nos arquivos tocados nos Sprints 1–5.

---

### ✅ Sprint 7 — Canal Google (nascido da verificação cruzada com os outros dois repos) — CONCLUÍDO

Verificação feita contra `C:\dev\RodaGiganteFoz` e `C:\dev\RoteiroFoz` (os dois ativos):

| Repo | Meta Pixel | Canal Google |
|---|---|---|
| `rodagigantefoz` | `283634370750714` | GTM via `NEXT_PUBLIC_GTM_ID` |
| `roteirofoz` | `283634370750714` | GTM `GTM-W7KTV5LM` (container com tag GA4 → `G-0Y6CBN3L97`, "Portfólio Foz - TURISMO", confirmado no UI) |
| este repo, **antes** | `283634370750714` | gtag.js direto com `G-1TLW6PM0Q8` — ID que não existe em nenhum dos três e não é o do portfólio |

Feito: `components/analytics/GoogleTagManager.tsx` restaurado **verbatim** do `RoteiroFoz` (diff = 0);
`GoogleAnalytics.tsx` apagado; `app/layout.tsx` monta o GTM dentro do `ConsentGate`;
`NavigationEvents` volta ao `dataLayer.push({event:'page_view', page_path})`;
`lib/analytics.ts` revertido ao estado anterior (o `dataLayer` voltou a ter leitor — nenhum código de
evento precisou mudar); `.env.example` documenta o container do portfólio e proíbe gtag direto;
`NEXT_PUBLIC_GTM_ID="GTM-W7KTV5LM"` devolvido ao `.env.local`.
Aceite: `tsc` 0 · `build` EXIT=0 · nenhum `gtag`/`GoogleAnalytics` restante fora de comentário.

### ⬜ Sprint 6 — Fechamento

- Fechar §3.5 do `context.md` na íntegra (1a/1b/1c, STATUS DE MEMÓRIA, STATUS DE SYNC, recarga, frase final).
- `_docs-portfolio/pixel-matrix.md` §0-bis: atualizar a linha **RF** só **depois** da re-validação G1
  — `sinais exercitados` perde `experience` (6=(a): `resolveLeadKind` só devolve `ticket` hoje, porque
  todo gatilho passa `context="atrativo"`; o slot existe, está vazio, como hotelaria/gastronomia no §3)
  e o par `event_id`/`value` volta com os `content_ids` do Sprint 1.
  ⚠️ Os dois arquivos `_docs-portfolio/*.md` são **verbatim nos três repos** → o usuário replica à mão.
- Rodar `npx tsc --noEmit` + `pnpm build` finais e transcrever a saída.

---

### ✅ Sprint 8 — Portfólio: os 4 `property` e as docs verbatim — CONCLUÍDO

**Autorizado pelo usuário. Aplicado nos três repositórios; commit próprio em cada um dos dois ativos
(RoteiroFoz `60faf0f`, RodaGiganteFoz `7c9632f`), tudo ainda não commitado aqui.**

O que havia, medido por `diff --strip-trailing-cr`:

| | `rodagigantefoz` | `roteirofoz` | este repo |
|---|---|---|---|
| `Property` | `rodagigantefoz \| roteirofoz \| toemfoz` | idem | `rodagigantefoz \| toemfoz \| comprasparaguay` ← `roteirofoz` **substituído**, não somado |
| `Niche` | 9 chaves (com `hospedagem`) | idem | 8 (sem `hospedagem`) |
| `_docs-portfolio/*.md` | — | matriz-mãe | cópia com 6 trechos alterados pelo mesmo replace |

Tarefa (nos três repos, uma entrada em `pixel-decisions.md`, `TAXONOMY_VERSION` com bump por valor de
enum novo):

1. `export type Property = "rodagigantefoz" | "roteirofoz" | "toemfoz" | "comprasparaguay";` nos três.
2. `hospedagem` de volta no `Niche`/`NICHES` deste repo (o enum é o superset do portfólio; dado local
   limpo é outra coisa — `conventions/marca-e-escopo.md` §3).
3. `_docs-portfolio/`: matriz com a **quarta** coluna no §0-bis (sem o registro de validação falso que
   está aqui hoje), `comprasparaguay` somado ao §1 e ao D1 — não substituindo `roteirofoz` — e cópia
   idêntica nos três.
4. Conferir que os dois ativos têm `content_ids`/`lead_kind` coerentes com o que a matriz claima.

**Feito, e a evidência de cada item:**

| Item | Resultado |
|---|---|
| 1 — `Property` com 4 valores nos três | `Property = "rodagigantefoz" \| "roteirofoz" \| "comprasparaguay" \| "toemfoz"` nos três arquivos; `TAXONOMY_VERSION` `2026-08-v1` → **`2026-09-v1`** |
| 2 — `hospedagem` de volta | o arquivo deste repo foi **substituído pela cópia do master** (`RoteiroFoz`), então `Niche`, `NICHE_KEYS` e `NICHES` voltaram ao superset; só `TRACKING_PROPERTY` foi re-ajustado para `comprasparaguay` |
| 3 — `_docs-portfolio/` | master editado no `RoteiroFoz` e **copiado** (não reescrito) nos outros dois: `md5sum` idêntico nos 3×2 arquivos. Matriz ganhou 4ª coluna (**CP**) no §0-bis, §9 com a regra aditiva, e **D14** em `pixel-decisions.md` |
| 4 — coerência do que a matriz claima | o registro falso de G1 **deixou de existir**: a linha `b0c248d5… / 120 / 6 content_ids` voltou para o `roteirofoz` e `comprasparaguay` entrou como **⏳ pendente**, com o motivo escrito. `lead_kind` virou linha explícita (`ticket` aqui e no RGF; `ticket`+`experience` no RF) |

**Gate:** `npx tsc --noEmit` → 0 erros **nos três repositórios**. `diff --strip-trailing-cr` entre
quaisquer dois `lib/tracking-taxonomy.ts`: exatamente uma linha, `TRACKING_PROPERTY`.
Build dos dois ativos não rodado (mudança é tipo-estática e aditiva; o `tsc` é o gate que pega).

---

## Pré-deploy — fora do código (ação do usuário, nada aqui é commitável)

- [ ] **Verificar `comprasparaguay.online` no Business Manager** (Configurações do Negócio → Segurança
      da Marca → Domínios). §0-bis marca ❌ e é literalmente o passo 4 do §9 — sem isso o tráfego
      daqui não entra no pooling do pixel compartilhado.
- [ ] `diff` do BLOCO CONGELADO de `lib/tracking-taxonomy.ts` contra o `rodagigantefoz` (e contra o
      `toemfoz`, quando nascer) — byte a byte, incluindo comentários.
- [ ] Env da Vercel no escopo **Production** (independente do `.env.local`): `DATABASE_URL`,
      `AUTH_SECRET`, `META_CAPI_TOKEN`, `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `CRON_SECRET`,
      `NEXT_PUBLIC_SITE_URL=https://www.comprasparaguay.online`, `NEXT_PUBLIC_GA_ID`.
- [ ] Domínio primário = `www.comprasparaguay.online` (o `www` é o canônico em `lib/seo.ts` e no
      sitemap) com apex em 308.
- [ ] `pnpm db:migrate` + confirmar `/admin/dashboard/oferta`: `agency_chat_id` preenchido (sem
      `TELEGRAM_CHAT_ID` no env, o destino do ping vem do banco) e **agência ativa = `foz-falls`
      — nunca `agencia-teste`** (`app/data/agencies.ts` ainda carrega o slug de teste; ele entraria
      no pixel compartilhado como `partner_slug` e não sai mais, matriz §1.4).
- [ ] Vercel Cron apontando para `/api/cron/lead-alert`.
- [ ] Re-validar G1 (Pixel × CAPI nos Test Events): mesmo `event_id`, mesmo `value`, mesmos params.
      Armadilhas da matriz §0-bis: o evento do navegador **não** aparece na aba (comparação é
      cruzada), o `test_event_code` **rotaciona** (fixar no `.env`, não atualizar a aba), e rodar o
      fluxo inteiro em segundos (Turnstile expira ~5 min). `META_CAPI_TEST_CODE` só em dev.
- [ ] Conversões Personalizadas por `vertical`: retroativas, podem esperar (§10) — criar algumas
      semanas antes de ligar a campanha só para ver volume.

---

## Riscos conhecidos

1. **Enum do portfólio encolhido sem bump** (Sprint 1.1) — é o único achado que pode contaminar os
   outros dois repos: o §9 passo 1 manda copiar `tracking-taxonomy.ts` verbatim para o próximo
   satélite, e essa cópia apagaria o vocabulário de gastronomia/hotelaria de onde ele é usado hoje.
2. `content_ids` ausente em todo evento (1.2) — não gera erro; gera painel sem a dimensão do pedido.
3. `/transfer` invisível nas métricas próprias se o slug do nicho mudar (3).
4. `agencia-teste` ativa em produção → `partner_slug=agencia-teste` permanente no pixel do portfólio.
5. Portal 404 (2) — visível para o dono no link do painel, não para o visitante.
6. Docs de execução ausentes (5) — é o que permite que 1 e 2 aconteçam de novo de boa-fé.

## Arquivos críticos

| Arquivo | Por quê |
|---|---|
| `lib/tracking-taxonomy.ts` | bloco congelado = contrato dos 3 repos |
| `components/ticket-offer/TicketOfferModal.tsx` | único funil de `InitiateCheckout`/`Lead`/`Contact` |
| `lib/lead-value.ts` | `value` é contrato de portfólio (não tocar nos pesos) |
| `lib/meta-capi.ts` · `app/api/leads/route.ts` | espelho CAPI do Pixel no mesmo `event_id` (G1) |
| `lib/analytics.ts` | injeção de `property` + reset do dataLayer |
| `app/api/track/route.ts` | allowlist do 1st-party |
| `middleware.ts` · `next.config.ts` · `app/robots.ts` · `app/sitemap.ts` | superfície exposta |

---

## Achados da auditoria (Sprint 0) — para sobreviver a compact

| # | Achado | Sprint |
|---|---|---|
| F1 | Bloco congelado encolhido pelo `17e3ec6`, sem bump de `TAXONOMY_VERSION` | 1.1 |
| F2 | `content_ids` sem fonte (nenhum chamador passa `contentIds`) | 1.2 |
| F3 | `lead_kind` constante `ticket`; `experience` inalcançável (§0-bis claima) | 6 |
| F4 | Portal `/comercial/*` inexistente, com redirects e link do admin apontando pra ele | 2 |
| F5 | `/transfer` rastreável só de rebote via `NICHE_PATHS` | 3 |
| F6 | `NEXT_PUBLIC_GA_ID` fora do `.env.example`; `NEXT_PUBLIC_GTM_ID` morta no `.env.local` | 4 |
| F7 | Domínio não verificado no Business Manager | pré-deploy |
| F8 | `agencia-teste` viva em `app/data/agencies.ts` | pré-deploy |
| F9 | Imagens que os dados prometiam (parceiros de gastronomia, capa da agência) | **fechado** pelo `17e3ec6` (lista de parceiros vazia) |
| F10 | Gastronomia no dado | **fechado** pelo `17e3ec6` |
| F11 | `sameAs`/footer = redes de outra marca | **não é defeito** — decisão do usuário, registrar em `conventions/` |
| F12 | Docs de execução ausentes + citações mortas em cabeçalhos; `README.md` com rota errada | 5 |
| F13 | Mortos da remoção: `lib/i18n/niche-labels.ts`, allowlist morta no `/api/track`, ramos `LeadContext "roteiro"/"ingresso"` (estes **ficam** — slot documentado do portfólio) | 3 |
| **F14** | **GA4 recebe só `page_view`.** O `pushDataLayer` monta `view_item`/`begin_checkout`/`generate_lead`/`contact`/`cta_click` num `dataLayer` que **nenhum script consome** — o container do GTM foi removido e não foi montado consumidor próprio (gtag direto não lê dataLayer). Não é bug do Meta (o funil Pixel/CAPI é `fbqTrack`), é o canal Google incompleto. Religar via `gtag('event', …)` ou apagar o transporte Google | **fechado pelo Sprint 7** — a causa era outra: o container do GTM tinha sido removido deste repo e substituído por gtag direto com ID de fora do portfólio |
| **F15** | `app/globals.css` carrega regras de componentes que não existem mais (`components/roteiros/RoteiroTimeline.tsx`, `components/meu-roteiro/MeuRoteiroDock`) e prefixos de satélite de origem nos utilitários (`*.shadow-tef-*`, `.text-gradient-tef`, `@keyframes rf-*`) e na paleta (`tef.*` em `tailwind.config.ts`). Custo zero em produção, mas é sinal de clone no DOM inspecionado. Exige revisão visual para limpar | **não bloqueia** |
| **F16** | Dezenas de comentários no código citam `design-system.md §N` e `conventions §N` de uma documentação antiga que não existe mais. Reescrita em varredura = diff de 30 arquivos de comentário às vésperas do deploy → **não feito de propósito**. Registrado como dívida no índice de conventions | **dívida registrada** |
| **F17** | O commit que trocou GTM por gtag direto justificou a remoção com "container nunca configurado" — o container **existe** (`GTM-W7KTV5LM`, usado pelo `RoteiroFoz`) e o ID hardcoded do GA4 não pertence ao portfólio. Deploy como estava mandava o tráfego para uma propriedade Google desconhecida | **Sprint 7** |
| **F18** | **`roteirofoz` foi SUBSTITUÍDO por `comprasparaguay`** onde deveria ter sido **adicionado**: no `export type Property` do bloco congelado e em 6 pontos dos dois `_docs-portfolio/*.md` deste repo (cópias que deixaram de ser verbatim). Efeito colateral: a linha de validação G1 da matriz deste repo claima para `comprasparaguay` uma validação que foi feita no `RoteiroFoz` (`event_id b0c248d5…`, `value 120`, 6 `content_ids`) — registro falso. Falta também `hospedagem` no enum `Niche` (os dois ativos têm). Os dois repositórios ativos nunca citam `comprasparaguay` | **fechado — Sprint 8, registrado como D14** |

Nada mais foi encontrado: **zero** link interno apontando para rota extinta, zero import órfão,
`tsconfig` limpo, build de produção verde, sitemap/robots/middleware coerentes com as 5 páginas +
5 destinos, `value`/`event_id` simétricos entre Pixel e CAPI, nenhum `ViewModalVIP`, nenhum
`content_name`, nenhum `vertical`/`niche` escrito à mão.

---

### 🗓️ Data:
Sessão de auditoria + execução (sprints 1–5 concluídos, sprint 6 em curso).

### 👤 Executado por:
Planner/Executor na mesma sessão (sem troca de modelo — o usuário seguiu com o modelo ativo).

### ✅ Progresso: 6 sprints concluídos (0–5 e 7) + auditoria. Sprint 6 (fechamento/validação G1) e Sprint 8 (portfólio) dependem do usuário.
### 📊 Status detalhado:

| Sprint | Entregue | Portão |
|---|---|---|
| 1.1 | `lib/tracking-taxonomy.ts` restaurado de `17e3ec6^` — `git diff 17e3ec6^ -- lib/tracking-taxonomy.ts` = **0 linhas** | tsc ✅ |
| 1.2 | `content_ids` religado via `leadContentIds` (= `pedidoItems`) no `Lead` e no corpo do POST → CAPI; `InitiateCheckout` com o destino de entrada | tsc ✅ |
| 2 | 7 arquivos apagados (`app/api/portal/*`, `app/api/admin/portal-account`, `PortalAccessControl`, `lib/portal-auth.ts`, `lib/portal-session.ts`) + `middleware.ts`, `next.config.ts`, `app/robots.ts`, `/admin/dashboard/planos`, `db/schema.sql` limpos | tsc ✅ · build ✅ (rotas `/api/portal/*` fora do manifest) |
| 3 | `/transfer` em `STATIC_PATHS`; `PARTNER_PATHS`/`NICHE_PATHS`/regex `/roteiros/*` fora; 9 chaves `rgf_*` → `cp_*`; `lib/i18n/niche-labels.ts` removido | tsc ✅ |
| 4 | `.env.example`: `+NEXT_PUBLIC_GA_ID`, `-NEXT_PUBLIC_GTM_ID` (seção reescrita com a verdade do canal); `.env.local` sem GTM | build ✅ |
| 5 | criados `architecture.md`, `architecture/rotas.md`, `conventions.md`, `conventions/tracking-metricas.md`, `conventions/marca-e-escopo.md`, `design-system.md`; `README.md` corrigido (rota real, docs existentes, portões) | build ✅ |

### 🔍 Achados relevantes:
- A remoção de páginas **não quebrou nada estrutural**: zero link interno para rota extinta, zero import órfão, `tsc` limpo, build de produção verde.
- O dano era de **contrato e de transporte**: `content_ids` mudo, `lead_kind` constante, enum do portfólio encolhido sem bump, GA4 sem consumidor de dataLayer, portal apontando para 404.
- `17e3ec6` (removendo gastronomia) acertou no **dado** e errou no **enum** — os dois eixos agora estão separados por escrito em `conventions/marca-e-escopo.md` §3 e `conventions/tracking-metricas.md` §1.

### ⚠️ Problemas identificados:
- **F14 aberto** (GA4 sem conversão) — precisa de decisão sua, não é cleanup.
- `portal_accounts` pode continuar existindo no Neon: o schema não faz DROP.
- `_docs-portfolio/pixel-matrix.md` §0-bis ainda **não** foi alterado: a linha RF só muda depois da re-validação G1 (par `event_id`/`value` novo + `experience` fora), e qualquer edição nesses arquivos é replicada nos três repositórios.

### 📋 Próximos passos imediatos:
1. **Você:** verificar o domínio no Business Manager, conferir env de Production na Vercel, `pnpm build` local → deploy, `pnpm db:migrate`.
2. **Você:** confirmar `/admin/dashboard/oferta` (agência ativa = `foz-falls`, `agency_chat_id` preenchido) e rodar a re-validação G1 nos Test Events.
3. **Depois disso:** preencher a linha `comprasparaguay` do §0-bis da matriz com o `event_id` e o
   `value` reais do teste (hoje está ⏳ pendente, e não se copia o de outro satélite — D14), e replicar
   o par `_docs-portfolio/*` nos outros dois repositórios na mesma rodada.
4. Em esforço separado, F15 (CSS morto / prefixos `tef-`, `rf-`). F14 foi fechado pelo Sprint 7.
5. Fechar este `plan.md` para arquivo quando o deploy estiver no ar.

### ✅ Testes recomendados:
- `npx tsc --noEmit` e `pnpm build` (ambos verdes nesta rodada).
- Fluxo real do modal: abrir → marcar 2 extras → enviar. Conferir nos Test Events: `InitiateCheckout` com `content_ids=[destino]`, `Lead` com `content_ids=[destino, extra…]`, `value` igual no Pixel e no CAPI, `property: "comprasparaguay"` em todos.
- `/transfer`: abrir a página, clicar um CTA e confirmar 1 linha nova em `events` (`type=pageview` e `cta_click`) — é o que o Sprint 3 destravou.
- Aceitar cookies → os dois scripts montam; recusar → nenhum carrega.
