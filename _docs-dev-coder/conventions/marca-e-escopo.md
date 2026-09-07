// Filepath: _docs-dev-coder/conventions/marca-e-escopo.md
// Version: 1.0
// Nome da Versão: "Identidade do domínio, escopo do eixo compras e o que saiu do projeto"

# CONVENTIONS — MARCA E ESCOPO

## 1 · Identidade

| Campo | Valor | Onde |
|---|---|---|
| `SITE_NAME` | `Compras Paraguay` | `lib/seo.ts` |
| `SITE_URL` | `https://www.comprasparaguay.online` (default; o `www` é o canônico — o projeto primário do deploy tem de ser o `www`, com o apex redirecionando) | `lib/seo.ts`, `NEXT_PUBLIC_SITE_URL` |
| Posicionamento | curadoria de **compras** na fronteira BR–PY–AR: Ciudad del Este, duty free de Puerto Iguazú, shoppings da região. Não somos vendedores diretos — capturamos demanda qualificada e entregamos à agência parceira | `/aviso-legal`, `lib/i18n/paginas.ts` |
| Monetização | plano mensal manual por entidade visível (`/admin/dashboard/planos`); **sem** comissão por venda e **sem** preço de produto no repositório | `lib/plan-periods.ts`, `conventions/tracking-metricas.md` §5 |

A intenção de busca primária é "compras no Paraguai", não "o que fazer em Foz". Copy, título e
keywords de silo seguem esse eixo; turismo generalista (gastronomia, hospedagem, passeios) não é a
promessa do domínio.

## 2 · O domínio não tem redes sociais — e é assim de propósito

`sameAs` do schema `organization` (`lib/seo.ts`) e os links do rodapé (`components/footer.tsx`)
apontam para os perfis do projeto irmão do mesmo grupo (`instagram.com/roteirosfoz`,
`facebook.com/roteirofoz`).

Não é descuido de rebrand e não deve ser "corrigido" para um perfil que não existe: `sameAs` é
declaração de identidade no schema, e citar conta inexistente é pior do que citar a conta do grupo
que de fato responde por aquele conteúdo. Ao criar redes próprias do domínio, atualizar `lib/seo.ts` e
`components/footer.tsx` **juntos** — são dois pontos da mesma afirmação.

## 3 · O que está fora do escopo no DADO

| Coisa | Estado |
|---|---|
| Gastronomia (bares, churrascaria, restaurante, pizzaria, shawarma, sushi, hamburgueria) | sem nicho, sem parceiro, sem página |
| Hotelaria | sem perfil de hotel no repositório |
| Parceiros cadastrados | lista vazia em `app/data/partners.ts` — os slots de "Recomendação Oficial" exibem o empty state |
| `PartnerCategory` | só `"turismo"` |
| Nichos ativos | um só: `transfer` (rota fixa `/transfer`) |

⚠️ **Isso vale para o dado deste repositório, não para o vocabulário do pixel.** Os enums de
`lib/tracking-taxonomy.ts` permanecem o superset do portfólio — ver `conventions/tracking-metricas.md`
§1. Enxugar dado é manutenção deste site; encolher enum é mexer no ativo dos três.

## 4 · Painel do parceiro não existe

Não há `/comercial/login` nem `/comercial/painel`, nem as APIs `/api/portal/*` e
`/api/admin/portal-account`, nem `lib/portal-auth.ts` / `lib/portal-session.ts`, nem guarda no
`middleware.ts`, nem `X-Robots-Tag` dedicado (não há árvore a cobrir).

O que continua existindo é o **controle de visibilidade**: plano vigente por entidade
(`plan_entities`, `plan_period_events`) gerido em `/admin/dashboard/planos`, que é o topo da
hierarquia — sem plano vigente (ou em carência) a entidade não aparece no site. Prestação de contas ao
parceiro sai das métricas próprias (`conventions/tracking-metricas.md` §10), não de um painel dele.

A tabela `portal_accounts` pode continuar existindo no Neon como resíduo; nada a cria nem lê.

## 5 · Domínio novo, nenhum redirect de legado

Não há `redirects()` em `next.config.ts`: as rotas canônicas já nascem corretas e não existe histórico
de URL a herdar. Quem chega por endereço antigo cai no `app/not-found.tsx`. Antes de criar um 301
"por garantia", confirmar que existe tráfego real a redirecionar — 301 de rota que nunca existiu é
ruído.

## 6 · Vocabulário da interface

| Usar | Não usar |
|---|---|
| **destino de compra** (o item do catálogo) | "atração turística" na copy |
| **reserva de data** (o produto) | "ingresso" — o site não vende ingresso, o atrativo não tem link de compra |
| **roteiro de compras** (o serviço da agência) | "roteiro turístico" |
| `LeadContext` do modal = sempre `"atrativo"` hoje | os valores `"roteiro"`/`"ingresso"` continuam no tipo como slot do portfólio (`lead_kind` `experience`), sem gatilho montado |

Trocar o rótulo visível é copy; trocar o `item_slug` enviado ao pixel é quebrar histórico — são eixos
diferentes (D11).
