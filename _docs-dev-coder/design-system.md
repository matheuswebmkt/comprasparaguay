# Design System — ROTEIRO FOZ

**Uso:** Consultar antes de criar ou editar qualquer página, componente ou e-mail do projeto.

---

## Mapa temático

Este núcleo cobre o que toda página/componente/e-mail precisa (identidade, paleta, tipografia) e o checklist final. Para os demais temas, abra o arquivo filho correspondente quando a tarefa tocar naquele assunto:

| Arquivo | Seções | Quando abrir |
|---|---|---|
| **[design-system/componentes.md](./design-system/componentes.md)** | §5 Border Radius, §6 Sombras, §7 Componentes de Interface | Ao construir ou ajustar um componente: botão, badge, card, input, info box ou pill — inclui os snippets `tsx`/`style` prontos para copiar. |
| **[design-system/layout-secoes.md](./design-system/layout-secoes.md)** | §4 Espaçamento e Layout, §8 Padrões de Seção, §9 Utilidades Globais | Ao montar uma página ou seção nova: container, grid, cabeçalho de seção, ou ao mexer em `globals.css`. |
| **[design-system/extras.md](./design-system/extras.md)** | §10 Motion, §11 Iconografia, §12 Design de E-mail, §13 Identidade da Marca em Texto | Para temas especializados: animações/transições, escolha de ícone Lucide, template de e-mail transacional, grafia do logotipo em código. |
| **design-system.md (este arquivo)** | §1 Identidade, §2 Paleta de Cores, §3 Tipografia, §14 Checklist | Ponto de entrada obrigatório antes de qualquer página/componente: cores, fontes e o checklist final de conferência. |

---

## 1. Identidade e Direção Estética

Foz do Iguaçu é natureza extrema, água, selva, poder. O site **Compras Paraguay** não é um portal turístico comum — é a plataforma de **curadoria de roteiros** e experiências em Foz do Iguaçu. A identidade visual traduz isso em:

**Refined Organic** — orgânica como a natureza de Foz, refinada como uma marca de presença local premium. Não é turismo barato, é ecossistema de experiências e parceiros.

- Profundidade visual vem do azul das Cataratas
- Vitalidade vem do verde da Mata Atlântica
- Ação e conversão vêm do dourado como acento
- Respiro vem do branco e off-white

- **Claro é o default.** Foz é água, luz e névoa — não tem nada de escuro. Fundo padrão **Areia**
  (`hsl(40,33%,97%)`), nunca branco puro (clínico) nem slate.
- ⚠️⚠️ **NADA DE FUNDO ESCURO, EM SEÇÃO NENHUMA — regra dura.** Toda seção usa Areia ou branco.
  Duas tentativas de faixa escura de fechamento (gradiente navy→verde, verde-escuro de hue única)
  foram reprovadas: **o problema nunca foi qual escuro, era ser escuro.** Não propor fundo escuro.
- **O ritmo da página vem de alternar Areia e branco**, nunca de escurecer. Ver detalhe de aplicação
  em `design-system/layout-secoes.md` §8.2.
- **Azul Abismo é TIPOGRAFIA, não fundo.** É a cor de autoridade do texto.
- **Verde Selva é a assinatura.** Nenhum concorrente em Foz usa verde — todos usam azul-água ou
  laranja-CTA. Verde é Mata Atlântica, é legítimo e está livre. Doses pequenas, frequência alta.
- **Dourado é escasso por decreto.** Um único objeto dourado por tela — e em grade, a contagem
  multiplica pelo número de itens (um badge dourado por card, em 9 cards, são 9 objetos dourados).
  A escassez é o que faz ler premium.
- ⚠️ **Nitidez é requisito de premium.** Imagem exibida acima de ~1x do arquivo original fica mole, e
  moleza lê como barato instantaneamente. Conferir a dimensão real do asset antes de escolher a
  composição — ver `design-system/layout-secoes.md` §8-ter.

---

## 2. Paleta de Cores

### Pilares Cromáticos

| Nome | Referência | Hex | HSL | Uso |
|---|---|---|---|---|
| **Azul Abismo** | Profundidade das águas do Iguaçu | `#0F2A47` | `hsl(210, 60%, 15%)` | Tipografia de autoridade, sidebar admin |
| **Azul Médio** | Céu sobre as Cataratas | `#1A3A5C` | `hsl(210, 56%, 23%)` | Botões primários, links, badges |
| **Verde Selva** | Mata Atlântica do Parque Nacional | `#2D7A52` | `hsl(152, 47%, 32%)` | Sucesso, ativação, publicado, aprovado, acento de texto |
| **Dourado** | Luz do sol nas Cataratas | `#DA8816` | `hsl(35, 82%, 47%)` | CTAs (ponta escura do gradiente) e acento gráfico — ver a dívida de contraste em §2 |
| **Dourado Vivo** | Variante vibrante para gradientes | `#F4A825` | `hsl(38, 90%, 55%)` | Ponta clara do gradiente de CTA |

### Escalas de Apoio

**Azul (escala completa)**
```
hsl(210, 60%, 15%)   → Azul Abismo (#0F2A47) ← âncora
hsl(210, 56%, 23%)   → Azul Médio (botões, links)
hsl(210, 56%, 35%)   → Azul Link (links em texto corrido)
hsl(214, 62%, 55%)   → Azul Sidebar (textos em fundo escuro, telas internas de admin)
hsl(214, 50%, 93%)   → Azul Pale (badges, pills, backgrounds sutis)
hsl(214, 50%, 96%)   → Azul Névoa (fundos de seção, hover muito sutil)
hsl(214, 50%, 97%)   → Azul Gelo (alternativa ao white para cards)
```

**Verde (escala completa)**
```
hsl(152, 47%, 28%)   → Verde Escuro (badges de sucesso)
hsl(152, 47%, 32%)   → Verde Selva (#2D7A52) ← âncora
hsl(152, 40%, 40%)   → Verde Médio (textos em fundo verde claro)
hsl(152, 40%, 93%)   → Verde Pale (fundo de badges ATIVO, PUBLICADO)
hsl(152, 40%, 95%)   → Verde Névoa (fundo de success states)
```

**Dourado (escala completa)**
```
hsl(35, 82%, 40%)    → Dourado Escuro (texto em badges dourados sobre fundo pale dourado)
hsl(35, 82%, 47%)    → Dourado (#DA8816) ← âncora, ponta escura do gradiente de CTA
hsl(38, 90%, 55%)    → Dourado Vivo (#F4A825) ← ponta clara do gradiente de CTA
hsl(38, 80%, 93%)    → Dourado Pale (fundo de badges PENDENTE, RASCUNHO)
hsl(38, 80%, 95%)    → Dourado Névoa (fundo de warning states)
hsl(40, 33%, 97%)    → Areia (fundo padrão de páginas — alternativa ao branco puro)
```

**Neutros**
```
hsl(210, 60%, 15%)   → Título (textos de alta hierarquia)
hsl(210, 25%, 35%)   → Corpo (texto corrido longo)
hsl(210, 25%, 45%)   → Secundário (descrições, subtítulos)
hsl(210, 25%, 55%)   → Terciário (labels, hints, metadados)
hsl(210, 25%, 65%)   → Placeholder (campos de formulário)
hsl(214, 25%, 88%)   → Borda (dividers, bordas de card)
hsl(214, 25%, 92%)   → Borda Sutil (separadores internos)
hsl(214, 25%, 90%)   → Borda Padrão (bordas de componente)
```

**Feedback**
```
hsl(0, 72%, 50%)     → Erro / Vermelho
hsl(0, 60%, 95%)     → Fundo de Erro
hsl(0, 72%, 88%)     → Borda de Erro
```

### Regra de Uso das Cores

- **CTAs principais** → fundo dourado com texto branco — ⚠️ ver a regra de contraste abaixo
- **Botões de ação secundária** → texto linkado em Verde Selva, sublinhado — **nunca** um segundo
  botão preenchido na mesma tela (senão o dourado deixa de ser o único objeto cheio)
- **Sucesso / publicado / ativo** → verde selva (`hsl(152,47%,32%)`)
- **Pendente / rascunho / atenção** → dourado escuro em fundo pale dourado
- **Erro / rejeitado** → vermelho em fundo pale vermelho
- **Fundo de seção** → **Areia** `hsl(40,33%,97%)` ou **branco** `hsl(0,0%,100%)`. Nada além disso —
  nenhuma seção ganha cor de fundo própria, gradiente ou campo de cor inventado. Se uma seção
  parecer que "some", o remédio é hierarquia (escala do título, espaçamento, peso do CTA), nunca
  pintar o fundo.
- **Tipografia de alta hierarquia** → **Azul Abismo** `hsl(210,60%,15%)` sobre Areia = **13.3:1** (AAA folgado)
- **Gradiente de CTA dourado** → `linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)` — único, ver a regra de contraste abaixo
- **Gradiente de CARTÃO DE REFORÇO** → ver "Névoa de Marca", logo abaixo

### Névoa de Marca — o gradiente de cartão de reforço

Único gradiente CLARO do projeto. Serve o cartão que reforça uma informação dentro de uma seção
(faixa de ingressos incluídos na página de roteiro, upsell de gastronomia) — nunca fundo de seção.

```css
/* Verde → branco → Areia */
linear-gradient(160deg, hsl(152,30%,97%) 0%, white 55%, hsl(40,50%,97%) 100%)

/* Areia → branco → Verde (o mesmo, espelhado) */
linear-gradient(160deg, hsl(40,50%,97%) 0%, white 50%, hsl(152,30%,97%) 100%)
```

Acompanha sempre:

```css
border: 1px solid hsl(214,25%,88%);
box-shadow: 0 8px 28px rgba(15,42,71,0.06);
border-radius: 1.5rem; /* rounded-3xl */
```

**Por que funciona:** as duas pontas são as cores da marca em luminosidade 97% — Verde Selva e
Areia —, quase brancas. O branco no meio impede que virem "campo de cor", que §2 proíbe. A 160°, a
transição é quase vertical e some atrás do conteúdo; o olho lê profundidade, não pintura.

⚠️ **Não é fundo de seção.** A regra acima continua valendo: seção é Areia ou branco puro. Este
gradiente vive dentro de um cartão delimitado por borda, que é o que o separa de "pintar o fundo".

⚠️ **Não trocar a luminosidade das pontas.** Com 95% ou menos, o cartão vira campo de cor e briga
com o fundo da seção. Os 97% são o limite em que ainda lê como névoa.

ⓘ O ícone deste cartão vai em chip pale da MESMA família (`hsl(152,30%,92%)` com ícone
`hsl(152,47%,30%)`). Dourado aqui é violação de §1 quando a página já tem o CTA dourado — e ela
quase sempre tem.

### ⚠️ Contraste do dourado (regra dura — medida, não estimada)

**Gradiente único de CTA dourado, em todo o projeto:**

```
linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)
```

Sempre nesta direção. Já conviveram variantes (um escurecido e este mesmo invertido), e a diferença
era visível entre a navbar e o rodapé da mesma página.

**Medição das duas pontas contra o rótulo BRANCO** (limiares WCAG AA: 4.5:1 texto normal · 3:1 texto
grande, isto é ≥18px bold):

| Ponta | Hex | Contraste | Texto normal | Texto grande |
|---|---|---|---|---|
| `hsl(35,82%,47%)` | `#DA8816` | **2.79** | ❌ | ❌ |
| `hsl(38,90%,55%)` | `#F4A825` | **2.00** | ❌ | ❌ |

⚠️⚠️ **O CTA dourado com rótulo branco NÃO passa em WCAG AA — em nenhum tamanho de rótulo.** Isto é
uma **dívida conhecida e aceita por decisão explícita do usuário**, que priorizou a identidade da
marca (o âmbar) sobre a conformidade. Não é descuido e não deve ser "corrigido" por iniciativa de
quem passar por aqui: mexer no tom é decisão de marca, não de implementação.

⚠️ **Não repetir três enganos já pagos nesta seção:**

1. **Aumentar o rótulo não resolve.** A versão anterior desta seção afirmava 3.02:1 e uma "margem de
   0.02" que justificava a regra do "≥18px bold salva o contraste". Ela media `#D4821A`, que **não é
   a cor do projeto** — o token dá `#DA8816`, e 2.79 fica abaixo até do limiar de texto grande. O
   tamanho do rótulo passou a ser decisão de **hierarquia visual**, nunca de acessibilidade.
2. **Num gradiente quem manda é a pior ponta.** A clara (`55%`) dá 2.00 e é ela que define o pior
   caso. Ao medir qualquer tom novo, medir as DUAS.
3. **Escurecer o âmbar foi testado e REPROVADO na tela.** O par `hsl(35,82%,30%)` → `hsl(38,90%,33%)`
   passava com folga (6.06 e 4.69) e foi descartado por decisão do usuário: fica feio, perde o âmbar
   que é a identidade. Não reintroduzir sem pedido explícito.

ⓘ **O caminho que resolveria sem tocar no âmbar** (medido, disponível se o assunto voltar): trocar o
rótulo de branco para **Azul Abismo `hsl(210,60%,15%)`** dá **5.51:1** no pior caso — passa AA para
texto normal mantendo o gradiente exatamente como está. Azul Médio (`hsl(210,56%,23%)`) dá 4.13 e
não basta.

**Três famílias de CTA dourado, mesma linguagem de forma:**

| Família | Rótulo | Padding | Raio | Onde |
|---|---|---|---|---|
| **Seção / hero** | `text-lg font-bold` | `px-8 py-4` | `rounded-3xl` | hero, CTA final, hubs, nichos, wizard |
| **Inline / card** | `text-sm font-bold` | `px-6 py-3` | `rounded-2xl` | card de atrativo, cesta, sidebar de contato, banners |
| **Chrome de navegação** | `text-xs sm:text-sm font-bold` | `px-3 py-1.5 sm:px-4 sm:py-2` | `rounded-full` | CTA da navbar |

Forma comum às três: `gap-2` · `hover:scale-[1.03] active:scale-[0.98]` · ícone `h-5 w-5` na família
de seção e `h-4 w-4` nas demais.

⚠️ **O RAIO difere de propósito, porque raio é medida absoluta e as alturas não são iguais.** Com o
mesmo `rounded-2xl` (16px), um botão de 44px lê redondo (36% da altura) e um de 60px lê quadrado
(27%). Por isso: seção `rounded-3xl` (24px = 40%), inline `rounded-2xl` (16px = 36%). **Igualar o
token aqui produz aparência DIFERENTE** — é o oposto do que se espera.

⚠️ **A família de chrome é pílula por contexto, não por tamanho.** O CTA da navbar convive com o
indicador da cesta, o seletor de idioma e o botão de menu — todos `rounded-full`. Quadrá-lo o
alinharia com botões a meia página de distância e o desalinharia dos três que estão a 8px dele.
Some-se que a 28px de altura o `rounded-2xl` daria 57% do raio sobre a altura, ou seja **mais
redondo que a própria pílula**.

ⓘ **Variante de largura total dentro do menu mobile.** Abaixo de `lg` o CTA primário da navbar não
fica na barra — ele vive dentro do painel do hambúrguer, empilhado depois dos links. Ali ele mantém a
FORMA do chrome (`rounded-full`, porque continua sendo cromo da navbar) e toma o TAMANHO da família
inline: `w-full justify-center px-6 py-3 text-sm font-bold`. **O padding do chrome não sobe junto:**
`py-1.5` existe para um botão de largura natural entre controles pequenos numa barra de 64px; esticado
em largura total ele lê fino e frouxo. Regra geral: ao levar um CTA de chrome para largura total,
trocar o padding pelo da família inline e manter o raio.

- ❌ **Nunca dourado como COR DE TEXTO sobre fundo claro** — reprova em qualquer tamanho de corpo.
  Dourado é fundo de botão ou acento gráfico, não texto. A única exceção é texto sobre **fundo pale
  dourado** (badge PENDENTE/RASCUNHO), onde o par de cores dá contraste próprio.
- Verde Selva sobre Areia = **4.84:1** → passa AA para texto normal; é a alternativa quando o acento
  precisa estar em texto.

---

## 3. Tipografia

**Fraunces (display) + Geist Sans (corpo/UI)** — ambas via `next/font/google` no `app/layout.tsx`.

```tsx
const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const fraunces  = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
```

`--font-display` (em `globals.css`) resolve para **Fraunces**, com fallback para serifa do sistema.

> ⚠️ **Gotcha de CSS custom property + `next/font` — causa de fonte de título nunca aplicar.**
> `--font-display` é declarada em `:root` (`<html>`) e referencia `var(--font-fraunces)`. Se as
> variáveis do `next/font` forem aplicadas no `<body>` (um descendente de `<html>`), a variável
> `--font-fraunces` não existe no escopo onde `--font-display` é declarada — custom property resolve
> no elemento onde é **declarada**, não onde é usada. `--font-display` vira valor inválido e some;
> todo `fontFamily: "var(--font-display)"` cai silenciosamente no Geist herdado do `<body>`, sem erro
> visível.
>
> **A correção obrigatória:** as variáveis de fonte ficam no `<html>`:
> ```tsx
> <html className={`${geistSans.variable} ${fraunces.variable}`}>
>   <body className={`${geistSans.className} antialiased`}>
> ```
> **Como verificar em 5 segundos** (console do navegador, com a página aberta):
> ```js
> getComputedStyle(document.documentElement).getPropertyValue('--font-display')  // NÃO pode ser ""
> getComputedStyle(document.querySelector('h1')).fontFamily                      // tem de citar Fraunces
> ```

⚠️ **Não usar Space Grotesk.** Grotesca geométrica com detalhes idiossincráticos, desenhada para
marca de tecnologia — lê como startup/SaaS, não como hospitalidade premium, desalinhada com o
"Refined Organic" de §1.

**Por que serifa:** a alternância grosso/fino (alto contraste) é herança de tipografia impressa,
historicamente difícil de imprimir bem — por isso o olho a lê como cara. É a convenção da categoria
(Aman, Belmond, Six Senses, Condé Nast Traveler, Monocle). **Serifa no título + sans neutra no corpo**
é o pareamento editorial premium canônico.

**Por que Fraunces especificamente:** é variável e tem eixo de *softness* — orgânica sem ser rústica,
refinada sem ser fria. Traduz "Refined Organic" quase literalmente.

⚠️⚠️ **Peso da serifa: 600–700, NUNCA 900.** Em Fraunces, 900 fica pesado e destrói o refino que
motivou a escolha da fonte. Todos os níveis de título usam **600** — inclusive display/hero, apesar
de a convenção Tailwind associar `text-5xl/6xl` a `font-black`.

### Hierarquia de Tamanhos

| Nível | Tailwind | Peso | Uso |
|---|---|---|---|
| Display / Hero | `text-5xl` / `text-6xl` | **600** (nunca `font-black`) | Títulos de hero em páginas de destino |
| H1 de página | `text-3xl` / `text-4xl` | **600** | Título principal de cada página |
| H2 de seção | `text-2xl` / `text-3xl` | `font-bold` (700) | Títulos de seções internas |
| H3 de card | `text-xl` / `text-2xl` | `font-bold` (700) | Títulos de cards, modais |
| H4 / Label de seção | `text-base` | `font-bold` (700) | Subtítulos, labels de grupo |
| Corpo principal | `text-base` | `font-normal` (400) | Texto corrido longo |
| Corpo secundário | `text-sm` | `font-normal` (400) | Descrições, parágrafos de apoio |
| Label / Caption | `text-xs` | `font-medium` (500) | Labels de formulário, hints, metadados |
| Micro | `text-[10px]` | `font-semibold` (600) | Badges, pills, status chips |

⚠️ Display/Hero e H1 usam **600**, não 900 — a coluna "Peso" acima é a fonte da verdade; ignorar
qualquer `font-black` que apareça associado a `text-5xl+` por hábito de outra tipografia.

#### H1 de hero — escala ÚNICA, idêntica em toda página de destino (regra dura)

Toda hero de página de destino usa **exatamente** estes valores. Não existe "um degrau abaixo da
home" nem escala reduzida por a página ser secundária:

```tsx
fontFamily:    "var(--font-display)",
fontWeight:    600,
fontSize:      "clamp(2.7rem, 5.1vw, 4.9rem)",
lineHeight:    0.98,
letterSpacing: "-0.034em",
color:         "hsl(210,60%,15%)",
textWrap:      "balance",   // hero é título único de página — aqui `balance` vale (§8.3)
```

- **Por que fixo e não "a critério da página":** o visitante navega entre a home e uma página de
  destino em segundos, e duas escalas diferentes de H1 leem como dois sites. Hierarquia entre
  páginas se comunica por **conteúdo e densidade** — o que a página oferece, quantas seções tem —,
  nunca encolhendo o título.
- ⚠️ **O erro típico é achar que a home é "mais importante" e reduzir o resto.** A racionalização é
  sempre plausível ("é página secundária", "hierarquia entre páginas") e o resultado é sempre o
  mesmo: escalas divergentes, cada uma defendida por um comentário no código que apresenta a
  diferença como se fosse regra do design system. **Não é, e este parágrafo é a fonte da verdade.**
- **Verificação executável.** O conjunto de H1 de hero é o resultado de:
  ```bash
  grep -rnE 'fontSize: "clamp\([0-9.]+rem, [0-9.]+vw' components/ app/
  ```
  Toda linha que for H1 de página de destino tem de mostrar `clamp(2.7rem, 5.1vw, 4.9rem)`.
  Escalas menores no resultado são legítimas para H2, título de card e subtítulo — classificar
  caso a caso, nunca find-replace. Se o valor da hero mudar, muda em **todas** na mesma rodada.
- O **número de linhas** do H1 varia de página para página (o texto é outro) e isso é esperado —
  o que não pode variar é a escala. Consequência prática: a coluna de copy fica mais baixa numa
  página do que na outra, e num hero de duas colunas sob `items-center` isso muda a posição
  vertical do bloco. Ajustar pela peça da direita ou pelo padding, **nunca** pelo tamanho do H1
  (ver `conventions/design.md` §7.6).

### Regras Tipográficas

- `var(--font-display)` → resolve para **Fraunces**. Usar em todos os títulos H1/H2 de páginas públicas
- `leading-tight` (1.25) → headlines compactos, display type
- `leading-snug` (1.375) → títulos de card
- `leading-relaxed` (1.625) → corpo de texto, descrições
- `tracking-tight` → display / heroes
- `tracking-widest` + `text-xs` + `font-semibold` + `uppercase` → pills de contexto acima de títulos
- `text-wrap: pretty` em título de seção — **não** `balance`. `balance` equaliza o comprimento das
  linhas de um título de duas linhas, e o quanto encurta a primeira depende do texto: numa utility
  compartilhada por seções de tamanhos de título diferentes, isso faz cada seção renderizar numa
  largura visualmente diferente. `balance` continua adequado num título único de página (hero), onde
  não há comparação entre seções.

---

## 14. Checklist antes de criar uma página nova

Antes de escrever qualquer página ou componente, verificar:

- [ ] Hero usa `pt-20` (80px) — compensa a navbar fixa (`fixed inset-x-0 top-0`, `h-16` = 64px de
      borda inferior). Conferir `components/navbar/navbar.tsx` antes de confiar em qualquer número
      de compensação — a geometria da navbar já mudou uma vez e o checklist ficou desatualizado.
- [ ] Todas as seções usam `.section-container`
- [ ] Fundo de seção: Areia `hsl(40,33%,97%)` ou branco `hsl(0,0%,100%)` — nunca outra cor (§2)
- [ ] Cabeçalho de seção usa as classes padrão (`design-system/layout-secoes.md` §8) — não
      declarar `fontSize`/`fontWeight`/`color`/`letterSpacing`/`lineHeight` inline por cima delas
- [ ] Títulos H1/H2 têm `fontFamily: "var(--font-display)"` e peso **600**, não 900 (§3)
- [ ] H1 de hero usa a escala única `clamp(2.7rem, 5.1vw, 4.9rem)` / lh `0.98` / ls `-0.034em`
      (§3) — igual em TODA página de destino, sem "um degrau abaixo" para página secundária
- [ ] Imagem do hero é **contida com margem**, não full-bleed
- [ ] Dimensão real do asset confere com o tamanho de exibição (nitidez — §1)
- [ ] CTAs dourados usam o gradiente ÚNICO `hsl(35,82%,47%→38,90%,55%)` e uma das TRÊS famílias de §2 — seção/hero (`text-lg px-8 py-4 rounded-3xl`), inline/card (`text-sm px-6 py-3 rounded-2xl`) ou chrome (`text-xs sm:text-sm rounded-full`) — com `gap-2 hover:scale-[1.03] active:scale-[0.98]` nas três
- [ ] Ação secundária é texto linkado em Verde Selva, nunca um segundo botão preenchido
- [ ] Cards usam `rounded-2xl border` com `borderColor: "hsl(214,25%,90%)"`
- [ ] Hover em cards: elevação proporcional ao tamanho do card (`design-system/componentes.md` §6)
- [ ] Imagens em card têm `object-cover` e `group-hover:scale-105`
- [ ] Em grade, contar o dourado multiplicado pelo número de itens — não só por elemento isolado
- [ ] Estado vazio tem ícone Lucide + mensagem + ação sugerida
- [ ] `PageTracker`/`EventTracker` (tracking 1st-party + Pixel + GTM) adicionado
- [ ] `aria-hidden="true"` em elementos decorativos (orbes, gradientes, linhas de motion)
- [ ] `aria-label` em links de ícone sem texto visível
- [ ] Toda animação nova respeita `prefers-reduced-motion` (`design-system/extras.md` §10)
- [ ] Metadata (`title`, `description`, `alternates.canonical`) definida
