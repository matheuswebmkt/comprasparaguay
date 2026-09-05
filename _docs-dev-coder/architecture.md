// Filepath: \_docs-dev-coder/architecture.md
// Índice temático — conteúdo dividido em architecture/*.md

# ARCHITECTURE.MD — ÍNDICE DO SNAPSHOT ESTRUTURAL

> Fonte única de verdade para caminhos, módulos e fronteiras.
> ⚠️ O conteúdo foi dividido por tema em `architecture/`. Este arquivo é o MAPA.
> **Como usar:** leia este índice na entrada de sessão (context.md §1.1) e abra APENAS
> o(s) arquivo(s) do tema da tarefa. Não carregue tudo sem necessidade.
> ⚠️ Mudança estrutural → atualizar o arquivo temático correspondente E este índice, se
> um tema novo surgir (regra de sincronização: context.md §4.1).
> ⚠️ **Regra editorial (context.md):** ao atualizar um tema, editar a seção existente —
> nunca criar uma seção nova (`-bis`, `-ter`, "v2") para registrar uma mudança. Documentação
> é o estado atual do projeto, não uma linha do tempo de decisões.

---

## Mapa temático

| Arquivo | Do que trata |
|---|---|
| `architecture/stack.md` | Versões do stack (Next/React/TS/Tailwind, gerenciador pnpm), design tokens, `next.config.ts`. |
| `architecture/rotas.md` | Tabela de todas as rotas do App Router: páginas públicas, cluster de nichos, roteiros, comercial/institucional, admin, APIs, sitemap/robots. |
| `architecture/dados.md` | Fontes estáticas de dados (`app/data/*.ts`): agências, hotéis, parceiros, atrativos, roteiros, nichos, tipos (`app/types/index.ts`). |
| `architecture/componentes.md` | Inventário dos componentes-chave da home: hero (`RoteirosHero`), constelação, segunda dobra, vitrine de roteiros, FAQ, CTA final, footer. |
| `architecture/i18n-portal.md` | i18n pt/en/es (cookie de locale, `lib/i18n/*.ts`) e o portal do parceiro `/comercial` (sessão própria, `portal_accounts`, planos). |
| `architecture/analytics-cookies.md` | Banner de cookies próprio + `ConsentGate`, Meta Pixel/GTM/GA4, tracking client 1st-party (`utm.ts`/`track.ts`/`TrackedLink`). |
| `architecture/backend-auth.md` | Backend 1st-party (Neon, `events`) + autenticação do admin (magic link, sessão, Resend). |
| `architecture/leads-modal-telegram.md` | O núcleo do funil: captura de leads + Meta CAPI, modal de oferta (calendário/quantidade), Telegram Mini-CRM ("Assumir Lead", modo SÓ INFO, reconciliação, ping de pendente) e o funil do modal (`modal_events`). |
| `architecture/entidades.md` | A entidade parceira fora do catálogo de `partners.ts`: Agências (recebem leads), com fluxo de ativação/plano. Hotéis foram removidos. |
| `architecture/admin-dashboard.md` | Painel admin de métricas: `lib/metrics.ts`, overviews geral/parceiro/página, cofre de leads, CTR unificado. |
| `architecture/seo-design.md` | SEO técnico: JSON-LD, canonical, sitemap, robots. |

---

## Índice de seções (`###`/`##` → arquivo)

- Stack → `architecture/stack.md`
- Rotas → `architecture/rotas.md`
- Dados (estático) → `architecture/dados.md`
- Componentes-chave → `architecture/componentes.md`
- i18n — pt/en/es → `architecture/i18n-portal.md`
- `/comercial` — Portal do parceiro → `architecture/i18n-portal.md`
- Cookies — consentimento próprio → `architecture/analytics-cookies.md`
- Analytics → `architecture/analytics-cookies.md`
- Tracking client → `architecture/analytics-cookies.md`
- Design tokens → `architecture/stack.md`
- Backend 1st-party → `architecture/backend-auth.md`
- Auth admin → `architecture/backend-auth.md`
- Captura de leads + Meta CAPI → `architecture/leads-modal-telegram.md`
- Telegram Mini-CRM — "Assumir Lead" (SÓ INFO, reconciliação, ping de pendente) → `architecture/leads-modal-telegram.md`
- Funil do modal (`modal_events`) → `architecture/leads-modal-telegram.md`
- Agências → `architecture/entidades.md`
- Hotéis → `architecture/entidades.md`
- Dashboard → `architecture/admin-dashboard.md`
- SEO técnico → `architecture/seo-design.md`
