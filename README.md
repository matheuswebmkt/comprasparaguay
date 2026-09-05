# Compras Paraguay

Portal de **curadoria de compras e experiências** na fronteira Brasil–Paraguai — [comprasparaguay.online](https://www.comprasparaguay.online).

Foco em **Compras PY**: roteiro de compras em Ciudad del Este, duty free de Puerto Iguazú e shoppings da região. Não somos vendedores diretos: capturamos demanda qualificada e roteamos para a **agência parceira**.

## Stack

- Next.js 15 (App Router) · React 19 · TypeScript · Tailwind
- Neon Postgres · Resend · Telegram Mini-CRM
- Deploy: Vercel · pnpm

## Rotas principais (canônicas)

| Rota | Função |
|---|---|
| `/` | Home de compras — foco Compras PY |
| `/roteiros-de-compras` | Hub de compras (ex-`/atrativos`) — 5 atrativos do eixo compras/fronteira |
| `/atrativos/[slug]` | Página individual — Ciudad del Este, Duty Free, By Night, Cataratas JL, Catuaí Palladium |
| `/transfer` | Cluster de nicho — transfer (agência ativa) |
| `/triplice-fronteira` | BR / AR / PY |
| `/obrigado` | Página de confirmação pós-submit (noindex) |
| `/sobre` · `/aviso-legal` · `/contato` | Institucionais |

> Simplificação Compras PY (rodada de rebrand): removidos `/roteiros`, `/roteiros/[slug]`,
> `/montar-roteiro`, `/roteiros/salvos`, `/onde-comer`, `/hospedagem`, `/o-que-fazer` e
> `/r/[token]` (sem redirects — domínio greenfield). Ver `architecture/rotas.md`.

> ⓘ Tabela resumida. A lista completa — incluindo comercial, admin e APIs — está em
> `_docs-dev-coder/architecture/rotas.md`, que é a fonte de verdade.

## Docs de execução (AI / dev)

| Arquivo | Papel |
|---|---|
| `_docs-dev-coder/context.md` | Protocolo de sessão |
| `_docs-dev-coder/architecture.md` | Snapshot de rotas e módulos |
| `_docs-dev-coder/conventions.md` | Decisões travadas |
| `_docs-dev-coder/plan.md` | Backlog e sprints |
| `_docs-dev-coder/design-system.md` | Tokens e UI |

## Desenvolvimento

```bash
pnpm install
pnpm dev
pnpm db:migrate   # schema Neon (opcional local)
pnpm build
```

Env: `DATABASE_URL`, `AUTH_SECRET`, `RESEND_API_KEY`, `NEXT_PUBLIC_SITE_URL`, Telegram/Meta conforme `.env.example` se existir.

## Marca

- **SITE_NAME:** Compras Paraguay  
- **SITE_URL default:** `https://www.comprasparaguay.online`
