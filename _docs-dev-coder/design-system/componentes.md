// Filepath: \_docs-dev-coder/design-system/componentes.md
// Parte de design-system.md (núcleo em ../design-system.md)

# DESIGN SYSTEM · BORDER RADIUS, SOMBRAS E COMPONENTES DE INTERFACE

> Numeração das seções PRESERVADA do arquivo original (§N) — referências cruzadas continuam válidas.

> ⚠️ O conteúdo abaixo foi levantado do código (contagem real de uso), não inventado: é o padrão
> que o projeto já pratica, escrito para ser seguido. **Manter sincronizado: criou ou mudou
> componente, atualiza aqui.**

---

## 5. Border Radius

Uso real medido no projeto (ocorrências em `components/` e `app/`):

| Token | Valor | Ocorrências | Onde |
|---|---|---|---|
| `rounded-2xl` | 1rem | 137 | **Padrão de card e de botão grande** |
| `rounded-xl` | 0.75rem | 123 | Card menor, caixa de ícone, botão médio |
| `rounded-lg` | 0.5rem | 76 | Input, chip, badge retangular |
| `rounded-full` | — | 59 | Pill, avatar, badge circular, indicador |
| `rounded-3xl` | 1.5rem | 32 | Card grande com foto (ex.: `RoteiroCard`) |
| `rounded-md` | 0.375rem | 22 | Elemento denso de admin |

**Regra:** card usa `rounded-2xl`; card com foto de destaque usa `rounded-3xl`; input e chip usam
`rounded-lg`; qualquer pill usa `rounded-full`.

⚠️ Valor arbitrário (`rounded-[13px]`) só quando o elemento tem tamanho fixo e o token mais próximo
distorce a proporção — hoje existe **um** caso no projeto (miniatura de 44–54px da constelação do
hero). Não multiplicar.

---

## 6. Sombras

Definidas em `app/globals.css`. Todas em Azul Abismo (`15,42,71`) com alfa baixo — **nunca preto
puro**, que suja o Areia.

| Classe | Valor | Uso |
|---|---|---|
| `.shadow-tef-sm` | `0 2px 8px rgba(15,42,71,.06)` | Card em repouso |
| `.shadow-tef-md` | `0 4px 16px rgba(15,42,71,.08)` | Card destacado, hover de card pequeno |
| `.shadow-tef-lg` | `0 8px 32px rgba(15,42,71,.10)` | Hover de card |
| `.shadow-tef-xl` | `0 16px 48px rgba(15,42,71,.14)` | Hover de card grande, modal |
| `.shadow-tef-gold` | `0 8px 24px rgba(212,130,26,.35)` | CTA dourado em destaque |
| `.shadow-tef-blue` | `0 4px 14px rgba(15,42,71,.25)` | Botão primário azul |

**Pareamento de hover** — a elevação acompanha o tamanho do card:

| Card | Hover |
|---|---|
| pequeno / linha | `hover:-translate-y-0.5 hover:shadow-tef-sm` ou `-md` |
| padrão | `hover:-translate-y-1 hover:shadow-tef-lg` |
| grande com foto | `hover:-translate-y-1.5 hover:shadow-tef-xl` |

---

## 7. Componentes de Interface

### 7.1 Botão — CTA dourado (ação primária)

```tsx
className="inline-flex items-center justify-center gap-3 rounded-2xl px-8 py-4
           text-lg font-bold text-white transition-transform
           hover:-translate-y-0.5 active:translate-y-0"
style={{
  background: "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)",
}}
```

⚠️ **Sem `boxShadow`.** Botão não tem sombra — regra dura. Havia aqui uma sombra dourada de três
camadas, e mais de 30 variantes inline espalhadas pelo projeto, todas removidas. Ver `globals.css`,
bloco das sombras do sistema: os tokens `sm/md/lg/xl` são para SUPERFÍCIE (card, painel, modal).

⚠️⚠️ **Duas famílias, mesma forma** (`design-system.md` §2): seção/hero usa `text-lg font-bold
px-8 py-4`; inline/card usa `text-sm font-bold px-6 py-3`. As duas compartilham `gap-2` e
`hover:scale-[1.03] active:scale-[0.98]`. O raio é o único valor que difere — `rounded-3xl` na
seção, `rounded-2xl` na inline —, e difere justamente para a curva PARECER a mesma nas duas
altura (60px e 44px). Ver `design-system.md` §2.
⚠️ **O tamanho do rótulo é hierarquia visual, não acessibilidade.** O gradiente âmbar não passa
em AA com rótulo branco em tamanho nenhum (2.79 na ponta escura, 2.00 na clara) — dívida conhecida
e aceita por decisão do usuário, que priorizou a identidade da marca. Aumentar o rótulo não
conserta; ver `design-system.md` §2, inclusive a alternativa medida (rótulo em Azul Abismo).

### 7.2 Botão — ação secundária

Texto linkado, **nunca** um segundo botão preenchido (senão o dourado deixa de ser o único objeto
cheio da tela — `design-system.md` §1):

```tsx
className="group inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold
           underline decoration-1 underline-offset-4 transition-colors"
style={{ color: "hsl(152,47%,30%)", textDecorationColor: "hsla(152,40%,60%,0.5)" }}
```

### 7.3 Card

```tsx
className="rounded-2xl border bg-white p-6 transition-all duration-300
           hover:-translate-y-1 hover:shadow-tef-lg"
style={{ borderColor: "hsl(214,25%,90%)" }}
```

- Imagem em card: `object-cover` + `group-hover:scale-105`, dentro de wrapper com `overflow-hidden`.
- ⚠️ Selo/badge em offset negativo é **cortado** por ancestral com `overflow-hidden`. Manter o
  recorte só no elemento que precisa dele (a foto), não no wrapper.

### 7.4 Badge / pill

| Tipo | Tratamento |
|---|---|
| Sobre **foto** | vidro fosco: `hsla(0,0%,100%,0.18)` + `backdrop-filter: blur(12px) saturate(180%)` + rim `inset 0 0 0 1px hsla(0,0%,100%,0.42)` + texto branco com `text-shadow` |
| Sobre **fundo claro** | branco 80% + borda `hsl(152,30%,84%)` + texto Verde Selva `hsl(152,47%,28%)` |
| Status **ativo/publicado** | Verde Selva sobre Verde Pale |
| Status **pendente/rascunho** | Dourado escuro sobre Dourado Pale — ✅ único caso em que dourado é cor de texto (o fundo pale muda o contraste) |

Micro-tipografia de pill: `text-[11px]` (ou `9.5px` em miniatura), `font-bold`/`font-extrabold`,
`uppercase`, `tracking-wide` a `0.2em`, `rounded-full`.

⚠️ **Não empilhar badges** ("pill soup"). Um badge por card — foi removida do hero do wizard e do
`RoteiroCard` a pilha de badge + badge + 3 chips (`layout-secoes.md` §8-bis).

⚠️ **Em grade, contar o dourado multiplicado.** Um badge dourado num card isolado passa; o mesmo
badge em nove cards são nove objetos dourados na tela.

### 7.5 Input

```tsx
className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none
           focus:ring-2 focus:ring-[hsl(210,56%,23%)]/20"
style={{ borderColor: "hsl(214,25%,88%)", color: "hsl(210,60%,15%)", background: "white" }}
```

Estado de erro: borda `hsl(0,72%,51%)`, fundo `hsl(0,60%,95%)`, mensagem em `hsl(0,72%,50%)`.
⚠️ Placeholder usa `hsl(210,25%,65%)` — não escurecer para "melhorar contraste": placeholder escuro
demais é confundido com valor preenchido.

### 7.6 Info box

`rounded-xl` + fundo pale da cor do estado (Azul Névoa, Verde Névoa, Dourado Névoa) + ícone Lucide
`h-4 w-4` na cor âncora + texto em `hsl(210,25%,35%)`.

### 7.7 Acordeão (FAQ)

Componente único do projeto: `components/FaqAccordion.tsx`, **usado em 9 superfícies**.
`<details>`/`<summary>` nativos, filete `1px hsl(214,25%,88%)` entre itens, **sem** caixa por
pergunta — oito retângulos idênticos leem como parede. Indicador `+` em Verde Selva que rotaciona
45° no `group-open`.

⚠️ Ele **não** renderiza JSON-LD: isso é da página, senão sai `FAQPage` duplicado.

### 7.8 Estado vazio

Ícone Lucide + mensagem + **ação sugerida**. Estado vazio sem saída é beco sem saída
(`design-system.md` §14).
