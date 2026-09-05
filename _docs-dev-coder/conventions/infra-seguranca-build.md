// Filepath: \_docs-dev-coder/conventions/infra-seguranca-build.md
// Parte de conventions.md (índice em ../conventions.md)

# CONVENTIONS · INFRAESTRUTURA, SEGURANÇA DO ADMIN E QUALIDADE DE BUILD

> Restrições duras do projeto. NÃO re-propor decisões já travadas aqui.
> Numeração das seções PRESERVADA do arquivo original (§N) — referências cruzadas continuam válidas.

---

## 4. Infraestrutura (travado)

- **Deploy:** Vercel. **Banco:** Neon Postgres serverless (`lib/db.ts`, lazy, `null` sem
  `DATABASE_URL` — todo o site funciona no-op sem banco configurado, nunca quebra a navegação).
  **E-mail transacional:** Resend (`lib/email.ts`).
- **Configurações do projeto na Vercel (travado):** `framework: nextjs` e `nodeVersion: 22.x`,
  definidos explicitamente nas Project Settings. Nunca deixar `framework: null`: com detecção
  automática + Node 24.x, o deploy trafega por um caminho de build que gera deployments
  malformados (páginas ausentes → 404 em todo o site) e middleware empacotado fora do padrão.
- **Gerenciador de pacotes: pnpm**, `pnpm-lock.yaml` é a fonte de verdade — não introduzir
  `package-lock.json`/`yarn.lock`.
- **Domínio `comprasparaguay.online` é greenfield** (primeiro deploy). Sem `redirects()` de migração
  SEO em nível de config no `next.config.ts` — mas existem redirects pontuais em nível de página
  (rota legada de catálogo, ver `architecture/stack.md`). Não confundir os dois.
- **Same-origin guard como padrão de toda rota de ingestão pública** (`/api/track`, `/api/leads`,
  `/api/contact`): exige `origin`/`referer` batendo com `host`, senão 403. Exceção única e
  deliberada: `/api/telegram-webhook`, que é chamado pelos servidores do Telegram — ali a defesa é
  o `secret_token` (ver `conventions/telegram.md`). Nenhuma outra rota de ingestão deve aceitar
  POST anônimo direto sem guard.

## 5. Segurança do admin (regra dura)

- **Allowlist de um único e-mail** (`lib/auth.ts`, `ADMIN_EMAIL`, default `admin@comprasparaguay.online`,
  override por env) — não é sistema de múltiplos admins. `isAllowedEmail()` é o único ponto de
  decisão.
- **Sessão via magic link** (`createMagicToken`, throttle 1/min; `consumeMagicToken`, uso único) +
  cookie de sessão HMAC (`lib/session.ts`, **Edge-safe**, Web Crypto — importado pelo
  `middleware.ts`).
- **Gate no middleware, não em cada página:** `middleware.ts` protege toda a árvore `/admin/**`
  (exceto `/admin/login`) checando o cookie de sessão. Uma página nova sob `/admin` herda a
  proteção automaticamente, sem precisar de guard próprio.
- **Painel do parceiro (`/comercial/painel`) usa sessão separada** (`lib/portal-session.ts`,
  cookie distinto) — não compartilhar sessão entre admin e portal do parceiro.
- ⚠️ **Nunca introduzir NextAuth/Auth.js.** A autenticação é própria, deliberadamente simples
  (magic link + cookie HMAC), para um número pequeno e conhecido de contas.

## 5-bis. Middleware: imports relativas + stub de testmode (regra dura)

- **`middleware.ts` NÃO usa aliases `@/*`: só imports relativas** (`./lib/session`, `./lib/portal-session`,
  `./lib/i18n/config`). O empacotador de Edge Function da Vercel não resolve os paths do tsconfig — ele
  gera a função a partir do FONTE transpilado de `middleware.ts` e resolve cada import na hora; alias
  `@/` vira erro "referencing unsupported modules" no deploy (o build passa verde — falha depois, em
  "Deploying outputs"). As libs importadas precisam ser Edge-safe e não puxar nada além de Web Crypto.
- **NÃO usar `runtime: "nodejs"` no config do middleware como alternativa:** o adaptador da Vercel
  carrega o middleware Node como CJS enquanto o Next gera ESM — crash `MIDDLEWARE_INVOCATION_FAILED`
  em TODAS as rotas em produção (o matcher do middleware cobre o site inteiro).
- **Stub no `next.config.ts`** (`webpack(config)` → `resolve.alias` com `false` para os três módulos
  `next/dist/experimental/testmode/*`): o Next embute um require estático de testmode no bundle Edge
  clássico do middleware, que referencia `node:async_hooks`. O código stubado só roda com
  `NEXT_PRIVATE_TEST_PROXY=true` (nunca em produção). Manter como defesa para o caminho de bundling
  clássico.
- **Imports profundas do next, nunca o barrel `next/server`:** o barrel puxa eager `spec-extension/user-agent`
  → `next/dist/compiled/ua-parser-js`, que executa `__dirname` no escopo do módulo — inexistente no Edge
  (crash `MIDDLEWARE_INVOCATION_FAILED` em toda requisição, com build 100% verde). Importar direto:
  `NextResponse` de `next/dist/server/web/spec-extension/response`; `NextRequest` como `import type`
  de `.../request` (é só tipo — some em runtime). O pacote `next` não tem exports map, deep import é
  permitido. Antes de trocar essas imports, validar a cadeia transitiva contra `__dirname`.
- Sintoma de regressão: build verde na Vercel + "referencing unsupported modules" listando caminhos
  `@/...` → alguém reintroduziu alias em import dentro do middleware ou das libs que ele importa;
  crash de import ESM/CJS em produção → runtime Node reativado.

## 10. Qualidade de build

- **`next.config.ts` não usa `ignoreBuildErrors`** — erro de tipo quebra o build de propósito, não
  é silenciado.
- **`tsc --noEmit` limpo é o piso de qualquer mudança** — rodar antes de considerar uma mudança
  pronta. Validação de runtime (dev server/build completo) é mais cara e roda com menos frequência.
- ⚠️ **`pnpm check:copy` foi removido** (scripts apagados na simplificação Compras PY): a revisão de
  léxico é manual, conforme `conventions/posicionamento.md` §21.9.
- **`pnpm build` é validação cara** — não rodar por hábito a cada mudança pequena; reservar para o
  fim de uma iniciativa ou quando o `tsc` sozinho não é suficiente (ex.: mudança que afeta geração
  estática/SSG).
