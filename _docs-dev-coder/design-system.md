// Filepath: _docs-dev-coder/design-system.md
// Version: 1.0
// Nome da Versão: "Mapa dos tokens vigentes — reconstruído a partir de globals.css e tailwind.config.ts"

# DESIGN SYSTEM — "Refined Organic"

> Carregado **sob demanda**, só em tarefa que toque superfície visual (`context.md` §1.1-bis). Não
> editar um token sem ler onde ele mora fisicamente (tabela abaixo) — este arquivo é índice das regras,
> não cópia dos valores.
>
> ⚠️ Este arquivo descreve o que o CSS **faz hoje**. Números de seção de documentação antiga citados
> em comentários espalhados pelo código não implicam a existência de um documento anterior: quando o
> comentário contrariar o CSS, o CSS manda.

## 1 · Superfície

Fundo claro padrão (`sand`), texto escuro, sem fundo escuro em página pública. Fundo escuro aparece só
em hero/banner, com os azuis próprios da paleta.

## 2 · Cor

`tailwind.config.ts` → namespace **`tef.*`** (prefixo herdado de outro projeto; trocar o nome é
mudança em dezenas de classes, só com rodada visual dedicada):

| Token | HSL | Uso |
|---|---|---|
| `tef.night` / `tef.abyss` | `210 60% 10%` / `210 60% 15%` | heros escuros, âncora |
| `tef.blue` | `210 56% 23%` | botões e links |
| `tef.link` | `210 56% 35%` | texto corrido clicável |
| `tef.mist` / `tef.ice` | `214 50% 96%` / `97%` | fundo de seção / card |
| `tef.jungle` (`-dark`) | `152 47% 32%` | âncora verde |
| `tef.gold` (`gold-vivid`) | `35 82% 47%` (`38 90% 55%`) | CTA |
| `tef.sand` | `40 33% 97%` | fundo padrão |

Utilitários de marca em `app/globals.css`: `.text-gradient-tef` (azul→verde), `.partner-seal` (selo de
parceiro oficial), `.section-texture` (textura de pontos), `.section-container` (1280px, pad 24/32).

## 3 · Tipografia

**Fraunces** é a fonte de títulos e **exige itálico carregado** (o H1 mistura romano e itálico na mesma
linha — é a assinatura da marca). O token `--font-display` é declarado em `:root`
(`app/globals.css`) referenciando `var(--font-fraunces)`, aplicado via `fontFamily.display`.

⚠️ **A variável tem de ser declarada no elemento onde é referenciada.** Declarada só no `<body>`
(descendente), `--font-display` resolve inválido e **todo H1 cai na sans padrão** — sem erro visível no
build, só o site inteiro com a tipografia errada. O `<html>` de `app/layout.tsx` carrega as duas
`variable`.

Escala de hero: uma única escala para todos os hero do site (clamp único, peso 600), replicada nas
páginas — não inventar valor pontual por página.

## 4 · Contraste

Regra que já motivou correção no projeto: texto pequeno com contraste ~3:1 **reprova** WCAG AA. Contraste abaixo de
4.5:1 só é aceitável em texto grande; botão dourado com texto claro depende disso. Ao ajustar cor de
CTA, conferir o par concreto em vez de supor.

## 5 · Sombra

`.shadow-tef-sm|md|lg|xl` existem **para superfície** (card, painel, modal).

🚫 **Botão não tem sombra.** Regra dura: nada de sombra colorida em CTA — nem como token, nem inline.
A hierarquia do CTA vem de preenchimento e tamanho.

## 6 · Motion

Curva da casa: expo-out. Hover de card escala **2%** (foto 5%) — 1.02 é teto prático, acima disso a
borda de 1px e o texto ficam moles durante a transição.

⚠️ Curva e escala de hover ficam em CSS direto em `app/globals.css`, **não** em classe utilitária:
`ease-[cubic-bezier(...)]` e `hover:scale-[1.02]` já falharam em silêncio neste projeto (o JIT não
emitia a curva; a escala definia a variável sem compor o `transform`). Nenhum dos dois dá erro — só
não funciona.

Keyframe de "pulso" nunca usa `fill: forwards` em elemento que tem `hover:scale`: o último frame
passa a ser o controle do transform e o hover morre.

`prefers-reduced-motion` desativa transição decorativa, não informação (aparecer/sumir da seta que
indica conteúdo a mais continua).

## 7 · Dívida conhecida

Prefixos de outro satélite em utilitários (`*-tef-*`, `rf-*`) e em `tef.*` na paleta; e blocos de CSS
herdados de componentes que não existem mais (`RoteiroTimeline`, `MeuRoteiroDock`) ainda em
`app/globals.css`. A remoção exige revisão visual — não é cleanup automático.
