// Filepath: \_docs-dev-coder/architecture/backend-auth.md
// Parte de architecture.md (índice em ../architecture.md)

# ARCHITECTURE · BACKEND 1ST-PARTY E AUTH ADMIN

> Fonte única de verdade para caminhos, módulos e fronteiras.
> Cabeçalhos `###` PRESERVADOS do arquivo original — referências cruzadas continuam válidas.

---

### Backend 1st-party
- `lib/db.ts` — `getSql()` (Neon serverless, lazy; `null` sem `DATABASE_URL`) + `isDbConfigured()`.
- `lib/events.ts` — `recordEvent()`/`recordEvents()` (lote) + `EVENT_TYPES` (`pageview`/`cta_click`).
- `db/schema.sql` — schema completo (tabelas idempotentes). Migração: `scripts/migrate.mjs` /
  `pnpm db:migrate`.
- `app/api/track/route.ts` — `POST` de ingestão (nodejs, force-dynamic), no-op sem DB. Aceita lote
  de eventos (`{events:[], visitorId, sessionId}`), persiste com `recordEvents()` (1 INSERT via
  `unnest` para N linhas).
- `.env.example` — `DATABASE_URL`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_SITE_URL` + Resend/auth.

### Auth admin
- `lib/session.ts` — **Edge-safe** (Web Crypto): `createSessionToken`/`verifySessionToken` +
  `SESSION_COOKIE`. Importado pelo middleware.
- `lib/auth.ts` — **Node** (node:crypto + Neon): `isAllowedEmail`/`ADMIN_EMAIL` (allowlist de um
  único e-mail, default `admin@comprasparaguay.online`), `createMagicToken` (throttle 1/min),
  `consumeMagicToken` (uso único).
- `lib/email.ts` — Resend via fetch (`sendEmail`, aceita `replyTo` opcional) + `sendMagicLinkEmail`
  (template design-system `extras.md` §12) + `sendContactFormEmail` (e-mail do form de `/contato`
  para `CONTACT_EMAIL`, mesma caixa do `ADMIN_EMAIL` de login — unificação deliberada; `reply_to` =
  e-mail do visitante).
- `middleware.ts` (raiz) — protege `/admin/**`.
- Envs: `RESEND_API_KEY`, `ADMIN_EMAIL`, `AUTH_SECRET`, `EMAIL_FROM` (ver `.env.example`).
