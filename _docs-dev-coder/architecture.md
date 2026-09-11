// Filepath: _docs-dev-coder/architecture.md
// Version: 1.0
// Nome da Versão: "Índice do snapshot estrutural — mapa de temas, não conteúdo"

# ARCHITECTURE — ÍNDICE

> **Este arquivo é MAPA, não conteúdo** (`context.md` §1.1-bis). Ter lido o índice significa saber
> ONDE as regras moram, nunca O QUE elas são. Antes de editar, abrir o arquivo temático do tema da
> tarefa — executar a partir do índice é inválido.
>
> Regra de escrita (§4): conteúdo novo entra no **arquivo temático**. O índice muda só quando nasce
> um tema novo ou quando a descrição abaixo deixa de bater com o que o arquivo entrega.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind 3 · Neon Postgres (`@neondatabase/serverless`)
· Resend · Telegram (bot + webhook) · Vercel · pnpm.

## Mapa de temas

| Tema | Arquivo | O que responde |
|---|---|---|
| Rotas, superfícies expostas e fronteiras | [`architecture/rotas.md`](architecture/rotas.md) | quais rotas existem, quem é canônica, quem é noindex, o que o middleware protege, o que o sitemap/robots declaram |
| Componentes | [`architecture/componentes.md`](architecture/componentes.md) | carga preguiçosa dos modais globais (`components/lazy/`) e a corrida evento → chunk |

> Temas ainda sem arquivo não têm regra escrita: ao aparecer uma decisão de estrutura sobre um tema
> novo, criar `architecture/<tema>.md` e acrescentar a linha aqui (§4, "Growing the structure").

## Camadas

| Caminho | Papel |
|---|---|
| `app/` | App Router: páginas, layouts, `robots.ts`, `sitemap.ts`, APIs em `app/api/*` |
| `app/data/` | catálogos estáticos em código (dados, não CMS): destinos, nichos, parceiros, agências |
| `components/` | React; `components/ui/*` são primitivos shadcn, o resto é domínio |
| `lib/` | servidor e domínio: `db.ts`, `meta-capi.ts`, `tracking-taxonomy.ts`, `lead-value.ts`, `metrics.ts`, i18n em `lib/i18n/` |
| `db/schema.sql` | schema idempotente (`create table if not exists`) aplicado por `pnpm db:migrate` |
| `scripts/` | `migrate.mjs`, `telegram-setup.mjs` |
| `middleware.ts` | Edge: guarda `/admin/**` e semeia o cookie de idioma |
| `_docs-portfolio/` | **não é documentação deste repo** — contrato de pixel compartilhado, copiado verbatim nos projetos do portfólio |

## Dados

Não há CMS. O catálogo vive em `app/data/*.ts` e é lido direto nas páginas; o que é configurável pelo
admin vive no Neon (`app_settings`, `niche_settings`, `partner_settings`, `partner_lead_settings`,
`plan_entities`, `plan_period_events`, `agencies`, …) e é resolvido em `lib/offer-settings.ts`,
`lib/niche-settings.ts`, `lib/partner-settings.ts`, `lib/plan-periods.ts`.

Vocabulário de marca, escopo do projeto e o que foi removido dele:
[`conventions/marca-e-escopo.md`](conventions/marca-e-escopo.md).
