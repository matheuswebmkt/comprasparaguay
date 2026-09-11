// Filepath: _docs-dev-coder/architecture/componentes.md
// Version: 1.0
// Nome da Versão: "Padrão de carga preguiçosa dos modais globais (DeferredEventMount)"

# ARQUITETURA — COMPONENTES

## 1 · Modais globais sob demanda (`components/lazy/`)

Os três modais que vivem no root layout — reserva (`TicketOfferModal`), detalhe de parceiro e
contato — são componentes client grandes. Importá-los direto em `app/layout.tsx` coloca o chunk no
bundle inicial de **todas** as páginas, mesmo nas visitas que nunca abrem modal.

Eles entram por um loader em `components/lazy/`:

| Arquivo | Evento que monta | Componente |
|---|---|---|
| `TicketOfferModalLazy.tsx` | `ticket-offer:open` | `components/ticket-offer/TicketOfferModal` |
| `PartnerDetailModalLazy.tsx` | `partner-detail:open` | `components/parceiros/PartnerDetailModal` |
| `ContactDetailModalLazy.tsx` | `contact-detail:open` | `components/parceiros/ContactDetailModal` |

Cada loader usa `next/dynamic(..., { ssr: false })` — seguro porque os modais renderizam `null`
enquanto fechados, então o HTML do servidor não muda.

### 1.1 A corrida evento → chunk e o `DeferredEventMount`

`next/dynamic` cria uma janela: o botão que abre o modal dispara o CustomEvent global **sempre**, e
se o clique chegar antes de o chunk montar, o listener do modal ainda não existe e a abertura se
perde.

`components/lazy/DeferredEventMount.tsx` resolve em três passos:

1. escuta o evento em **fase de captura** enquanto o pesado não montou;
2. enfileira o `detail` e dispara o import;
3. quando o filho monta, o efeito do **pai** roda **depois** dos efeitos do filho (React executa
   efeitos de baixo para cima) — logo o listener do filho já está registrado — e reemite o(s)
   evento(s) enfileirado(s) via `window.dispatchEvent`.

⚠️ **Não reordenar isso.** A garantia depende de o efeito do pai rodar depois do efeito do filho.
Não usar `useLayoutEffect` no pai para reemitir nem reemitir fora do efeito de `mounted`.
`stopPropagation` ocorre só enquanto o pesado não está pronto; depois disso o evento segue o
caminho normal.

### 1.2 O que NÃO entra neste padrão

`EnvioOverlay` e `CookieBanner` continuam com import direto no root layout: precisam aparecer no
primeiro render (o overlay cobre o `router.push`; o banner pede consentimento), e adiar causaria
salto de layout ou atraso de consentimento. O padrão é para o que só monta sob demanda, não para
tudo que é client.
