// Filepath: \_docs-dev-coder/conventions/visibilidade-parceiros.md
// Parte de conventions.md (índice em ../conventions.md)

# CONVENTIONS · VISIBILIDADE DE PARCEIROS (AGÊNCIAS, HOTÉIS, PLANOS, NICHOS)

> Restrições duras do projeto. NÃO re-propor decisões já travadas aqui.
> Numeração das seções PRESERVADA do arquivo original (§N) — referências cruzadas continuam válidas.
> ⚠️ Mecanismo técnico de agências/hotéis está em `architecture/entidades.md`. Esta seção trava as
> decisões de visibilidade e o gate de plano.

---

## 13. Agências

- **Uma agência ativa por vez, singleton** (`app_settings.active_agency`), não uma lista de agências
  visíveis simultaneamente — o site tem uma parceira operacional de cada vez, trocável no admin sem
  deploy.
- **Desativado é o default seguro** (`__none__`) — uma instalação nova do site não expõe agência
  nenhuma até o admin ativar explicitamente uma.
- **Agência NÃO aparece em superfície pública nenhuma (decisão de produto).** No nicho `transfer`,
  `NicheRecommendation` resolve SEMPRE para o card próprio do Compras Paraguay (`TransferPitchCard`:
  imagem neutra de van + CTA WhatsApp fixo) — independe de haver agência ativa; nem card de
  agência, nem empty state. A ativação/desativação no admin segue existindo para o fluxo
  comercial/portal, mas não muda nada na página pública.

## 13-bis. Hotéis — entidade removida

A entidade `Hotel` foi removida por completo: catálogo `app/data/hotels.ts`, `lib/hotels.ts`,
admin `/admin/dashboard/hotel`, rota `/hospedagem` e o modal global `HotelDetailModal` não existem
mais. `leads.wants_hotel` permanece como coluna órfã reversível no banco (dado preservado, feature
desligada — não dropar).

## 13-ter. Planos mensais manuais (sem Stripe)

- ⭐ **TOPO DA HIERARQUIA DE EXIBIÇÃO (regra dura).** O plano mensal vigente (`plan_entities`,
  `/admin/dashboard/planos`) é o **controle de visibilidade global**. Os três níveis:

  | Nível | Onde se mexe | O que decide |
  |---|---|---|
  | 1 · **PLANO** | `/admin/dashboard/planos` | **Se** a entidade aparece. Sem plano vigente → some de tudo |
  | 2 · **PLACEMENT** | `/nichos` (parceiro) · "Ativar" em `/agencia` e `/hotel` | **Onde** aparece / quem ocupa o slot do nicho |
  | 3 · **FUNÇÃO** | oferta em `/oferta` | Liga e configura a oferta. Só roda se o nível 1 permitir |

  O enforcement difere por entidade:
  - **Parceiro:** plano é o gate **ÚNICO**. Com plano e sem nicho, ele aparece nas demais superfícies —
    só não ocupa slot de recomendação. Com nicho e sem plano, some do site inteiro.
  - **Agência/Hotel:** plano **+** ser a entidade Ativa (`active_agency`/`active_hotel`). "Ativar" é
    placement — só um por vez ocupa o slot do nicho.
- **Gate único, sem cobrança automatizada.** `lib/plan-periods.ts`:
  `PlanEntityType = "partner" | "agency" | "hotel"`, `PlanStatus = "none" | "active" | "expiring" |
  "grace" | "paused" | "expired"`. `PLAN_DEFAULT_DAYS = 30`, `PLAN_EXPIRING_DAYS = 7` (janela de
  aviso antes de expirar). `isPlanCurrentlyActive(entityType, slug)` é a função única que decide se
  uma entidade está "com plano em dia" — qualquer feature que precise gatear por plano usa essa
  função, não reimplementa a lógica de data.
- ⚠️ **O gate de agência/hotel mora DENTRO da função-fonte.** `getActiveAgencySlug`/
  `getActiveHotelSlug` (e as versões `…Cached`) já checam `isPlanCurrentlyActive` e devolvem `null`
  quando o plano não está vigente — `Boolean(slug)` basta. **Não empilhar `isPlanCurrentlyActive`
  por cima de um slug que já veio dessas funções**: cada `ensure()` extra são ~20 round-trips ao
  Neon, e `getOfferConfig` roda síncrono no `/api/leads`, então a duplicação aparece como submit
  lento do modal. Placement puro (ignora plano) = `getActiveAgencySlugRaw`/`getActiveHotelSlugRaw`,
  só para distinguir "não ativada" de "plano interrompido" no admin.
- ⚠️ **Cache: dado BRUTO cacheado por tag, vencimento calculado FORA do cache.** `getPlanPeriodCached`
  e `cachedPartnerPlanRows`/`cachedAgencyPlanRows`/`cachedHotelPlanRows` guardam `period_end`/
  `grace_days`/`paused_at` com `unstable_cache` **só por tag** (muda apenas por ação admin, que já
  dispara `revalidateTag`); a comparação `visibilityEnd(...).getTime() > Date.now()` roda em JS puro
  a cada chamada. Sem essa separação, um plano que vence sozinho — sem nenhuma ação no painel
  naquele dia — nunca invalidaria o cache e a entidade ficaria visível para sempre em produção.
  **Nunca** cachear a resposta booleana inteira, e **não** resolver isso com `revalidate` por tempo
  (vira polling: query por rota a cada TTL, para um dado que muda em semanas).
- ⚠️ **`ensure()` é memoizado por processo** (`let ensured = false` em `lib/plan-periods.ts`). São
  ~20 DDLs idempotentes; rodar 1× por cold start basta. Se falhar no meio, `ensured` continua
  `false` e a próxima chamada tenta de novo.
- **Sem integração de pagamento** — o plano é iniciado/renovado/pausado manualmente no admin
  (`startOrRenewPlan`, `pausePlan`, `resumePlan`). É controle de relacionamento comercial, não
  cobrança automática. Não introduzir Stripe/gateway de pagamento para isso sem decisão explícita.
- **Notas de período** (`listPeriodNotes`/`addPeriodNote`, `listEntityNotes`/`addEntityNote`) com
  `NoteVisibility` — permitem registrar histórico de relacionamento (negociação, motivo de pausa)
  associado ao plano, visível conforme o nível configurado.

## 14. Cluster SEO de nichos (placement × visibilidade)

- ⚠️ **`/admin/dashboard/nichos` é PLACEMENT, não visibilidade (regra dura).** A atribuição
  (`niche_settings`) define APENAS em qual nicho o parceiro é a Recomendação Oficial. Quem decide se
  ele aparece é o plano (§13-ter). `getVisiblePartnerSlugs()` (`lib/niche-settings.ts`) =
  `activePartners` **∩** plano vigente — não cruza com atribuição. Toda superfície que lista parceiro
  intersecta com ela; `NicheRecommendation` cruza atribuição **×** `isPlanCurrentlyActive("partner", slug)`.
  ⛔ **Não reintroduzir o modelo `nichos ∩ plano`**: ele fazia um parceiro pago sumir do site por não
  ter nicho atribuído, e transformava o `/nichos` em gate global disfarçado.
- **8 chaves de nicho fixas** (`app/data/niches.ts`) — ver `architecture/dados.md`. Cada nicho
  aceita **um** parceiro atribuído por vez (`partnerSlug: string | null`), não uma lista.
  `partnerSlug = null` força Empty State (mensagem de "em breve"/vazio) mesmo que existam parceiros
  daquela categoria no catálogo.
- ⚠️ **Páginas de nicho na raiz são LEGADO e nunca existirão como rota (decisão de produto).**
  `n.slug` é identificador/âncora, não URL pública: a superfície viva de gastronomia é o hub
  `/onde-comer` — cards por nicho (âncora `#slug`) que abrem o modal do parceiro. Consequências
  obrigatórias: nenhum `<Link>`/JSON-LD/sitemap pode apontar para `/${slug}` (gera 404 — o painel
  `/admin/dashboard/nichos` já exibe "hub: /onde-comer#slug" em vez de link); gastronomia linka
  sempre como `/onde-comer#slug`. (O ramo `hospedagem` de `NicheClusterLinks` segue direto pro hub,
  que é página real.)
- ⚠️ **A superfície viva de gastronomia é o hub `/onde-comer`** — os nichos de gastronomia não têm
  página própria, então o ramo de parceiro do `NicheRecommendation` não é alcançado por eles hoje.
  `app/onde-comer/page.tsx` é quem tem de aplicar o gate de plano; corrigir só o `NicheRecommendation`
  não muda nada na tela.
- **Versão cacheada para o público, real-time para o admin:** `getVisiblePartnerSlugs` (tag
  `plan-periods`) para as páginas públicas (SSG/ISR); `getVisiblePartnerSlugsLive` (`force-dynamic`)
  para o admin, que precisa ver o efeito de uma mudança de plano/atribuição imediatamente, sem
  esperar a revalidação de cache.
