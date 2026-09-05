// Filepath: \_docs-dev-coder/conventions/produto.md
// Parte de conventions.md (índice em ../conventions.md)

# CONVENTIONS · PRODUTO

> Restrições duras do projeto. NÃO re-propor decisões já travadas aqui.
> Numeração das seções PRESERVADA do arquivo original (§N) — referências cruzadas continuam válidas.

---

## 0. Produto atual — Compras Paraguay

- **Marca do site:** **Compras Paraguay** (`comprasparaguay.online`). Não somos vendedores diretos: somos
  **curadores** das melhores experiências e roteamos leads qualificados para a **agência parceira**.
- **Modelo de negócio:** não vendemos passeios/ingressos diretamente (não processamos pagamento,
  não somos e-commerce). Publicamente nos posicionamos como "roteiro de compras", mas a operação
  real é **interceptar a intenção**: o clique abre o modal de captura (`TicketOfferModal`), e o lead
  qualificado é entregue via Telegram à **agência parceira**, que faz o atendimento 1:1. Compras
  Paraguay gera demanda qualificada; a agência converte.
- **Ecossistema de atrativos:** `app/data/attractions.ts` cataloga **5 atrativos do eixo
  compras/fronteira** (Compras em Ciudad del Este, Duty Free Puerto Iguazú, By Night Puerto Iguazú,
  Cataratas JL Shopping, Shopping Catuaí Palladium), todos no mesmo modelo neutro de SEO/CTA.

### Simplificação Compras PY (rodada atual)

- **Roteiros prontos e wizard removidos por completo**: `/roteiros`, `/roteiros/[slug]`,
  `/montar-roteiro` e `/roteiros/salvos` não existem; `app/data/roteiros.ts` deletado.
- **Funil único:** o produto de conversão é o **roteiro de compras em Ciudad del Este** (modal de
  lead → `/api/leads` → Telegram) com pós-submit em `/obrigado`. Os buckets "roteiro" e
  "personalizar" do modal foram **removidos** (product único `atrativo` em `offer-defaults.ts`);
  a copy de compras é rodada de conteúdo futura.
- **Pós-submit:** `/obrigado` é uma página única (noindex) que lê o handoff em `sessionStorage`.
- **Carrinho "Meu Roteiro" removido**: `lib/meu-roteiro.ts` e a cesta client-side não existem mais.
- **Slots/roteiro:** os tipos `Roteiro*` em `app/types/index.ts` permanecem (usados pelo funil), mas
  não há mais roteiros prontos nem wizard — o produto de conversão é o roteiro de compras no modal.
- **Domínio `comprasparaguay.online` é greenfield:** primeiro deploy da vida — sem redirects de migração
  SEO em nível de config (existem redirects pontuais de rota legada, ver `architecture/stack.md`).
- **Auth visitante (salvar roteiro):** magic-link próprio (`purpose=visitor` em `magic_tokens`),
  cookie `rf_visitor_session` (HMAC, `AUTH_SECRET`), tabelas `visitor_accounts` + `saved_roteiros`.
  Lead passivo em `leads` com `cta_type=save_roteiro` no request do link.
  ⚠️ **NÃO** introduzir NextAuth/Auth.js (ver §4).

---

## 1. Modelo de dados (decisão estrutural)

- O site é um **diretório de negócios locais de Foz do Iguaçu** (Refined Organic — ver
  `design-system.md`), evoluído para **portal de roteiros** (ver §0).
- O modelo de dados é `Partner/Business` + `Roteiro`. **Não** há `affiliateUrl` nem monetização por
  afiliado dos atrativos secundários.
- **Atrativos (`attractions.ts`) são neutros** (conteúdo SEO público). CTA → site oficial
  (rastreado). Parceiros reais são exibidos via curadoria (`niche_settings`) e slots de roteiro.
  ⚠️ A vitrine `PartnerPicks` foi removida do site (decisão do usuário) — o componente e sua chave
  i18n `partnerIntro` foram deletados; não reintroduzir sem nova decisão.

---

## 3. Categorias de parceiros (fixas)

`app/data/partners.ts` define exatamente **3 categorias**, cada uma com ícone Lucide e cor de
acento próprios (`partnerCategories`, `getCategoryMeta`):

| Slug | Nome | Ícone | Acento |
|---|---|---|---|
| `gastronomia` | Gastronomia e Culinária | `UtensilsCrossed` | `hsl(35,82%,47%)` (dourado) |
| `hotelaria` | Hotelaria | `Hotel` | `hsl(210,56%,23%)` (azul médio) |
| `turismo` | Turismo | `Compass` | `hsl(152,47%,32%)` (verde selva) |

Fixas por decisão de produto — não criar uma quarta categoria sem decisão explícita, é o eixo que
organiza o cluster de nichos inteiro (`conventions/visibilidade-parceiros.md` §14).
