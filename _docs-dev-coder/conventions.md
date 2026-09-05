// Filepath: \_docs-dev-coder/conventions.md
// Índice temático — conteúdo dividido em conventions/*.md

# CONVENTIONS.MD — ÍNDICE DAS DECISÕES NÃO-NEGOCIÁVEIS

> Restrições duras do projeto. NÃO re-propor decisões já travadas aqui.
> ⚠️ O conteúdo foi dividido por tema em `conventions/`. Este arquivo é o MAPA.
> **Como usar:** leia este índice na entrada de sessão (context.md §1.1) e abra APENAS
> o(s) arquivo(s) do tema da tarefa em questão. Não carregue tudo sem necessidade.
> A numeração original das seções (§0…§21, incl. sufixos §13-bis/§13-ter/§21.1-bis) foi
> PRESERVADA dentro de cada arquivo — é numeração de índice, não linha do tempo.
> ⚠️ **Regra editorial (context.md):** ao atualizar uma seção, editar o texto dela no
> lugar — nunca criar uma seção nova (`-bis`, `-ter`) só para registrar uma mudança.
> Documentação é o estado atual travado, não um changelog.

---

## Mapa temático

| Arquivo | Seções | Do que trata |
|---|---|---|
| `conventions/produto.md` | §0, §1, §3 | Produto atual (Compras Paraguay), o modelo de negócio (curadoria → agência parceira), categorias fixas de parceiros |
| `conventions/funil-modal.md` | §2, §16, §17, §17-bis, §17-ter | Funil de captura — produto único (atrativo), textos do modal editáveis pt/en/es, anti-bot Turnstile + rate-limit/dedup, funil de tracking do modal (`modal_events`), página `/obrigado` (recriada) e ingressos por atrativo ("Tem link - NÃO") |
| `conventions/visibilidade-parceiros.md` | §13, §13-bis, §13-ter, §14 | Agências, planos mensais manuais (gate único de visibilidade global) e o cluster SEO de nichos (placement × visibilidade); hotéis documentados como entidade removida |
| `conventions/leads-capi-lgpd.md` | §11, §18 | Captura de leads endurecida, dedupe com Meta CAPI hasheado, e a página/consentimento de LGPD (`/aviso-legal`, `/contato`, banner de cookies) |
| `conventions/telegram.md` | §12, §12-bis, §12-ter, §12-quater | Telegram Mini-CRM "Assumir Lead": webhook serverless, anti-colisão atômica, modo Central/Confirmar, TG-4 (WhatsApp travado no dono), modo SÓ INFO + auto-arm, reconciliação "um cliente, um card", ping de lead pendente |
| `conventions/infra-seguranca-build.md` | §4, §5, §5-bis, §10 | Stack (Vercel/Neon/Resend), hardening de `/api/track`, segurança do admin (allowlist + gate de sessão) e qualidade de build |
| `conventions/tracking-metricas.md` | §6 | Tracking 1st-party e UTMs: disparo unificado Meta+Google, definição única de CTR, exclusão de `/comercial` das métricas |
| `conventions/seo.md` | §8, §19 | SEO/GEO: conteúdo original vs. fatos livres, Entity SEO do portal, e o checklist obrigatório de SEO para toda página nova de ranqueamento |
| `conventions/design.md` | §7 | Decisões de design travadas e armadilhas técnicas já pagas — complementa `design-system.md`, não substitui |
| `conventions/posicionamento.md` | §21 | **Voz e léxico do produto (governa TODA copy que o visitante lê):** arquitetura de mensagem em 4 camadas, regra de ouro do funil, reforço humano, gratuidade implícita, léxico usar/banir, SEO×posicionamento, proibição de preço, i18n (pt matriz de conteúdo, passada de tradução concluída) |

---

## Índice de seções (§ → arquivo)

- §0 Produto atual — Compras Paraguay → `conventions/produto.md`
- §1 Reposicionamento do produto (decisão estrutural) → `conventions/produto.md`
- §2 Funil de captura de lead — genérico por PRODUTO → `conventions/funil-modal.md`
- §3 Categorias de parceiros (fixas) → `conventions/produto.md`
- §4 Infraestrutura (travado) → `conventions/infra-seguranca-build.md`
- §5 Segurança do admin (regra dura) → `conventions/infra-seguranca-build.md`
- §5-bis Middleware: imports relativas + stub de testmode (regra dura) → `conventions/infra-seguranca-build.md`
- §6 Tracking e UTMs (1st-party) → `conventions/tracking-metricas.md`
- §7 Design → `conventions/design.md`
- §8 SEO → `conventions/seo.md`
- §10 Qualidade de build → `conventions/infra-seguranca-build.md`
- §11 Captura de leads + Meta CAPI → `conventions/leads-capi-lgpd.md`
- §12 Telegram Mini-CRM — "Assumir Lead" → `conventions/telegram.md`
- §13 Agências → `conventions/visibilidade-parceiros.md`
- §13-bis Hotéis (entidade removida) → `conventions/visibilidade-parceiros.md`
- §13-ter Planos mensais manuais (sem Stripe) → `conventions/visibilidade-parceiros.md`
- §14 Cluster SEO de nichos → `conventions/visibilidade-parceiros.md`
- §16 Anti-bot do modal — Cloudflare Turnstile → `conventions/funil-modal.md`
- §17 Funil do modal → `conventions/funil-modal.md`
- §17-bis Página de obrigado (`/obrigado`) — recriada (foco Compras PY) → `conventions/funil-modal.md`
- §17-ter Ingresso por atrativo — "Tem link - NÃO" → `conventions/funil-modal.md`
- §18 Proteção de Dados Pessoais — LGPD → `conventions/leads-capi-lgpd.md`
- §19 Checklist obrigatório de SEO robusto (regra dura) → `conventions/seo.md`
- §21 Posicionamento, voz e léxico (regra dura) → `conventions/posicionamento.md`
