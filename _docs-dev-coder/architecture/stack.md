// Filepath: \_docs-dev-coder/architecture/stack.md
// Parte de architecture.md (índice em ../architecture.md)

# ARCHITECTURE · STACK E DESIGN TOKENS

> Fonte única de verdade para caminhos, módulos e fronteiras.
> Cabeçalhos `###` PRESERVADOS do arquivo original — referências cruzadas continuam válidas.

---

### Stack
- Next.js `15.5.19` (App Router, Turbopack), React `19.2`, TypeScript `5.9`, Tailwind `3.4`. postcss `≥8.5.10` (override). 0 vulns.
- UI: Radix + shadcn (`components/ui/*`), Lucide icons, `motion`, `next-themes`.
- `next.config.ts`: **sem** `ignoreBuildErrors`. Domínio `comprasparaguay.online` é greenfield (primeiro
  deploy) — **sem** `redirects()` de nível de config nem redirects de página legados (rotas removidas
  nunca foram indexadas). `headers()` aplica `X-Robots-Tag: noindex, nofollow` em toda a
  árvore `/comercial*` (portal do parceiro, nunca deve ser indexado).
- Gerenciador: **pnpm** (`pnpm-lock.yaml`). Sem `package-lock.json`.
