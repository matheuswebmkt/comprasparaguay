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
| `/roteiros-de-compras` | Hub do eixo compras/fronteira — 5 destinos |
| `/roteiros-de-compras/[slug]` | Página do destino — Ciudad del Este, Duty Free, By Night, Cataratas JL, Catuaí Palladium |
| `/transfer` | Vertical de transporte (agência ativa) |
| `/triplice-fronteira` | BR / AR / PY |
| `/obrigado` | Página de confirmação pós-submit (noindex) |
| `/sobre` · `/aviso-legal` · `/contato` | Institucionais |

> O domínio é novo: **nenhum redirect de legado**. Rotas antigas do template (`/roteiros`,
> `/montar-roteiro`, `/roteiros/salvos`, `/onde-comer`, `/hospedagem`, `/o-que-fazer`, `/r/[token]`,
> `/comercial/*`) não existem e não voltam — ver
> [`_docs-dev-coder/architecture/rotas.md`](_docs-dev-coder/architecture/rotas.md) §5.

> ⓘ Tabela resumida. A lista completa — páginas, admin, APIs e o que decide sitemap/robots/middleware —
> está em `_docs-dev-coder/architecture/rotas.md`, que é a fonte de verdade.

## Docs de execução (AI / dev)

| Arquivo | Papel |
|---|---|
| `_docs-dev-coder/context.md` | Protocolo de sessão (diretiva raiz) |
| `_docs-dev-coder/architecture.md` | **índice** do snapshot estrutural → `architecture/*.md` |
| `_docs-dev-coder/conventions.md` | **índice** das decisões travadas → `conventions/*.md` |
| `_docs-dev-coder/design-system.md` | Tokens e UI — aberto só em tarefa visual |
| `_docs-dev-coder/plan.md` | Backlog e sprints — **opcional e efêmero**, existe só enquanto dura um esforço |
| `_docs-portfolio/pixel-matrix.md` · `pixel-decisions.md` | **contrato do pixel**, compartilhado com os outros projetos do portfólio — não é doc deste repo |

## Desenvolvimento

```bash
pnpm install
pnpm dev
pnpm db:migrate   # schema Neon (opcional local)

npx tsc --noEmit  # tipos
pnpm build        # build de produção
```

Env: `DATABASE_URL`, `AUTH_SECRET`, `RESEND_API_KEY`, `NEXT_PUBLIC_SITE_URL`, Telegram/Meta conforme `.env.example`.

## Marca

- **SITE_NAME:** Compras Paraguay  
- **SITE_URL default:** `https://www.comprasparaguay.online`
