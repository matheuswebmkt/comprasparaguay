// Filepath: \_docs-dev-coder/architecture/rotas.md
// Parte de architecture.md (índice em ../architecture.md)

# ARCHITECTURE · ROTAS

> Fonte única de verdade para caminhos, módulos e fronteiras.
> ⚠️ Tabela gerada por varredura direta de `app/**/page.tsx` e `app/api/**/route.ts` — confira aqui
> antes de escrever um link novo, em vez de supor a forma da URL (context.md §2.4: o código é a
> verdade máxima).

---

### Rotas — páginas públicas

| Rota | Função |
|---|---|
| `/` | Home — foco Compras PY |
| `/roteiros-de-compras` | Hub de compras (ex-`/atrativos`) — 5 atrativos do eixo compras/fronteira |
| `/atrativos/[slug]` | Página individual de atrativo (5: Ciudad del Este, Duty Free, By Night, Cataratas JL, Catuaí Palladium) |
| `/triplice-fronteira` | Página BR/AR/PY |
| `/transfer` | Cluster de nicho — transfer (agência ativa) |
| `/obrigado` | Página de confirmação pós-submit (noindex, fora do sitemap) |
| `/sobre` | Institucional |
| `/aviso-legal` | Termos + Privacidade/LGPD |
| `/contato` | Formulário de contato |

> ⚠️ **Rotas removidas na simplificação Compras PY** (sem redirect): `/roteiros` + `/roteiros/[slug]`,
> `/montar-roteiro` (wizard), `/roteiros/salvos`, `/onde-comer`, `/hospedagem`, `/o-que-fazer`, `/r/[token]`
> (página pública do pedido — o token `leads.public_token` permanece no banco, mas as mensagens já
> não geram o link).

⚠️ **Os slugs são as formas curtas.** `/o-que-fazer-em-foz-do-iguacu`, `/onde-comer-em-foz`,
`/hospedagem-em-foz-do-iguacu` e `/transfer-em-foz-do-iguacu` **não são rotas reais** —
formas longas que já vazaram para copy e documentação por engano mais de uma vez. Não existe rota
`/roteiros/personalizar` (removida, sem redirect).

⚠️ **`/o-que-fazer/[slug]` também não existe mais** (removida em 08/08/2026). Era um
`permanentRedirect` para `/atrativos/[slug]`, criado quando as rotas foram renomeadas para a raiz
(commit `1a6cf96`), e gerava 32 páginas estáticas de redirect a cada build. Removida pelo mesmo
critério de `/roteiros/personalizar`: **nada foi indexado ainda** — o repo é de 12/07/2026 e o site
não foi a produção —, não havia link interno apontando para lá e a rota nunca esteve no sitemap.
Redirect legado só se justifica quando existe URL viva a preservar; sem isso é peso de build.

### Rotas — comercial e admin

| Rota | Função |
|---|---|
| `/comercial/login` | Login do portal do parceiro (sessão própria) |
| `/comercial/painel` | Painel autenticado do parceiro |
| `/admin/login` | Login do admin (magic link) |
| `/admin/dashboard` | Métricas gerais |
| `/admin/dashboard/agencia` | Agência ativa |
| `/admin/dashboard/leads` | Cofre de leads |
| `/admin/dashboard/nichos` | Atribuição de parceiro por nicho |
| `/admin/dashboard/oferta` | Editor do modal de captura ("Ação para parceiros" etc.) |
| `/admin/dashboard/pagina` | Métrica por página (`?p=<path>`) |
| `/admin/dashboard/parceiro/[slug]` | Métrica por parceiro |
| `/admin/dashboard/planos` | Planos mensais manuais |

⚠️ Toda a árvore `/comercial*` recebe `X-Robots-Tag: noindex, nofollow` (`next.config.ts`). Toda
`/admin*` é protegida por sessão via `middleware.ts` (exceto `/admin/login`).

### Rotas — API

Agrupadas por área; ver o arquivo de arquitetura correspondente para o comportamento de cada uma.

| Área | Rotas |
|---|---|
| Auth admin | `/api/auth/{logout,request,verify}` |
| Auth visitante | `/api/visitor/me` |
| Portal do parceiro | `/api/portal/{login,logout,verify}` |
| Leads | `/api/leads`, `/api/leads/draft`, `/api/leads/success` |
| Contato | `/api/contact` |
| Tracking | `/api/track`, `/api/modal-track` |
| Telegram | `/api/telegram-webhook`, `/api/cron/lead-alert` |
| Admin — parceiros/oferta | `/api/admin/{active-agency,attraction-offers,niche-assignment,offer-config,partner/[slug]/toggle}` |
| Admin — planos | `/api/admin/{plan-notes,plan-period,plan-template,portal-account}` |

### Sitemap e robots

- `app/sitemap.ts` gera: páginas estáticas vivas (home, `/roteiros-de-compras`,
  `/transfer`, `/triplice-fronteira`, `/sobre`, `/aviso-legal`, `/contato`) + uma
  entrada por atrativo do catálogo (5).
- `app/robots.ts` — `allow: "/"` para todos os agentes, com `disallow` para as rotas privadas
  (admin/comercial/API); regra própria e mais permissiva para bots de IA (`AI_BOTS`).
- Nenhuma rota de `/admin` ou `/comercial` entra no sitemap.
