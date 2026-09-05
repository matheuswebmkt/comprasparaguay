// Filepath: \_docs-dev-coder/conventions/design.md
// Parte de conventions.md (índice em ../conventions.md)

# CONVENTIONS · DESIGN

> Restrições duras do projeto. NÃO re-propor decisões já travadas aqui.
> Numeração das seções PRESERVADA do arquivo original (§N) — referências cruzadas continuam válidas.

---

## 7. Design

> O autoritativo de paleta, tipografia e layout é `design-system.md` + `design-system/*.md`. O que
> entra aqui são **decisões travadas específicas de componentes** e **armadilhas técnicas já pagas**
> — coisas que um novo agente reintroduziria por não saber que foram testadas e reprovadas.

### 7.1 Hero da home — decisões travadas

O histórico completo de versões reprovadas, com o motivo de cada reprovação, está no cabeçalho de
`components/roteiros/RoteirosHero.tsx` e **não deve ser apagado** — é o que impede uma versão futura
de repetir um erro já feito.

Travado:

- **Sem foto de fundo.** Fundo é Areia puro + grão. Full-bleed lê como site de turismo genérico.
- **Sem lavagem de cor no fundo.** Se o claro ler como "chapado", a correção é grão e densidade dos
  elementos de motion — nunca campo de cor no fundo (`design-system.md` §1).
- **O atrativo não é card.** Foto pequena, nome ao lado, turno abaixo — solto sobre o Areia. Card de
  vidro com foto grande pesa demais: o atrativo é detalhe de apoio, a copy é a protagonista.
- **Duas ações, hierarquia por peso.** "Quero meu roteiro de compras" (dourado, preenchido, →
  `/atrativos/compras-paraguai-ciudad-del-este`) e "Ver atrativos e shoppings" (texto linkado em Verde
  Selva, → `/roteiros-de-compras`), lado a lado. O secundário **não pode** virar botão preenchido.
- **Um único objeto dourado na tela: o CTA.** Núcleo, filamentos, selos e badges são Verde Selva.
- **Fora do hero:** eyebrow de faixa de dias; ícones de turno soltos (foram para a segunda dobra).

### 7.2 A constelação do hero — núcleo, geometria e motion

O núcleo "você" é um **disco opaco com o rótulo dentro**, com dois anéis pulsando em contratempo
(`rf-core-ring`). Não é um ponto de luz com gradiente radial: um gradiente radial claro desloca a
percepção de cor (uma hue tecnicamente correta pode ler como um tom errado se o gradiente for muito
claro ou muito saturado) e o brilho competia com a sobriedade do resto da composição. Os anéis
pulsando ficam — são eles que dão vida ao centro.

**Disco, não pílula.** Com pílula, a interseção do filamento cai no retângulo, cujos cantos passam da
borda visível arredondada, e a linha parece descolada. Em disco, o filamento parte do centro e o
próprio disco opaco cobre a origem — a linha passa *por baixo*, leitura correta. O fundo do disco tem
de continuar opaco; translúcido deixa o traço aparecer atravessando o rótulo. Pela mesma razão, as
duas pontas do filamento ficam escondidas (começa no centro do disco, termina alguns pixels dentro da
foto) — nunca deixar folga visível na ponta.

**Distribuição em quadrantes, raio consistente.** Os três atrativos e o chip do dia ocupam quadrantes
diferentes ao redor do núcleo — manhã a nordeste, tarde a sudeste, noite a sudoeste (o trajeto do
sol, dando à sequência uma razão espacial e não só cronológica) — e o chip do dia ocupa o noroeste,
fechando os quatro quadrantes. Todos a raio consistente (variação ≤ 5px), senão os nós não leem como
uma órbita só. Ao mexer em posição, conferir colisão **numericamente** — nó × chip, nó × rótulo,
filamento × chip/rótulo —, nos dois breakpoints; a olho não se pega um filamento passando atrás de um
elemento translúcido.

**O tracejado se revela; não nasce inteiro.** `stroke-dashoffset` sozinho apenas *desloca* um padrão
fixo e faz a linha aparecer tracejada de uma vez. O `stroke-dasharray` precisa ser **reconstruído a
cada frame**: entram só os traços já percorridos, um vão final gigante esconde o resto. No instante
do selo, uma segunda fase cresce os traços e encolhe os vãos até zero — tracejado vira linha cheia,
que depois segue cheia a 0.38 de opacidade (recuo, não desaparecimento — 0.22 é invisível sobre
Areia). A alternativa canônica seria uma `<mask>` com reveal por dashoffset, mas máscara em traço
quase horizontal cai na mesma armadilha de bounding box degenerada descrita abaixo.

#### Armadilhas técnicas de SVG e motion (medidas, não estimadas — não reintroduzir)

1. **`stroke: url(#gradiente)` em traço quase reto não pinta de forma confiável.** Um
   `linearGradient` sem `gradientUnits="userSpaceOnUse"` usa o default `objectBoundingBox`. Um
   filamento quase horizontal tem bounding box degenerada (medida: 102×8px), e nessa caixa o
   gradiente simplesmente não pinta — a linha inteira fica invisível, sem erro no console. Usar
   **stroke sólido**: um traço fino não ganha nada visualmente com gradiente; a luminosidade vem do
   halo desfocado e da faísca animada.
2. **Não pendurar desenho de geometria em `requestAnimationFrame`.** Em aba oculta o rAF **pausa**
   mas o `setTimeout` **continua** — um ciclo baseado em `setInterval` avança enquanto os paths
   nunca são desenhados, e a peça trava vazia quando a aba volta ao foco. Medir e desenhar em
   `useLayoutEffect` (síncrono, antes do paint), iniciar o ciclo só com `document.hidden === false`,
   remontar limpo no evento `visibilitychange`. O rAF fica só para animação por frame (a faísca
   percorrendo a curva).
3. **Elemento em offset negativo é cortado por ancestral com `overflow:hidden`.** Manter o recorte só
   no elemento que precisa dele (ex.: a foto), não no wrapper que contém o selo.
4. **`transform-box: view-box` é obrigatório** para `transform-origin` em unidades de usuário dentro
   de SVG; sem ele o giro acontece em torno do canto do SVG, não do elemento.

### 7.3 Segunda dobra — destaque em loop

Padrão em `components/home/AutoridadeSection.tsx` (migrado do `ComoFunciona`, removido), reutilizável em qualquer sequência de passos. A
intenção é elevar o valor percebido, não animar por animar: o público-alvo lê capricho de execução
como sinal de qualidade do serviço.

- **Um item em destaque por vez, em loop.** O ativo ganha cor (Verde Selva), cresce ~10% e pulsa; os
  outros recuam para 0.45 de opacidade. Conduz o olho pela sequência em vez de deixar o leitor
  escolher onde começar.
- ⚠️ **O trilho de conexão é ESTÁTICO** — 1px, cinza, sem preenchimento e sem animação. O dinamismo
  da seção é só o destaque/apagamento dos passos; movimento na linha compete com o conteúdo em vez
  de somar. Numa seção onde o texto já pulsa entre destaque e recuo, uma segunda camada de movimento
  não se soma, ela disputa — não animar a linha sem pedido explícito.
- ⚠️ **O loop pausa no hover e no foco**, e apontar para um item o torna ativo. Regra dura: animação
  que esmaece conteúdo precisa de uma forma de parar — sem isso, quem está lendo o último item vê o
  texto apagar no meio da leitura.
- ⚠️ **`prefers-reduced-motion` desliga o ciclo E o esmaecimento** — todos os itens ficam legíveis ao
  mesmo tempo. O destaque é reforço, nunca a única forma de acessar o conteúdo.
- **Escala do pulse é limitada pelo vizinho.** Num círculo de 48px, escalar além de ~1.6 invade o
  item ao lado — por isso o pulse da segunda dobra (`rf-step-pulse`, 1.6) usa uma keyframe diferente
  da do núcleo do hero (`rf-core-ring`, 2.3), que tem mais espaço ao redor.

### 7.4 Dourado — escassez e contraste

Regra geral e limiares de contraste estão em `design-system.md` §1–§2; aqui ficam só os casos de
aplicação encontrados neste projeto.

- **Contar o dourado multiplicado em grade, não por elemento isolado.** Um badge dourado num card
  sozinho é aceitável; o mesmo badge repetido numa grade de N cards são N objetos dourados na
  mesma tela. Badge sobre foto usa vidro fosco (branco a ~18% + `backdrop-filter`) em vez de dourado
  sólido; marcação de destaque usa anel Verde Selva em vez de borda dourada.
- **Rótulo de CTA dourado precisa de `text-lg font-bold` em TODO breakpoint** (nunca
  `text-base sm:text-lg`), e o fundo usa o gradiente dourado único do projeto — ver a medição em
  `design-system.md` §2. Padrão único, igual nos três CTAs dourados da home (hero, segunda dobra,
  CTA final).
- **Dourado como cor de texto sobre fundo claro é sempre violação**, exceto texto sobre fundo pale
  dourado (badge de status). Varredura: `grep -rn 'hsl(35,82%,4[0-9]%)' components/ app/ | grep -i 'color\|text-\['`
  — mas o resultado precisa de classificação caso a caso (ícone e badge-sobre-pale são legítimos),
  nunca find-replace direto.
- **Acento de CATEGORIA não pinta texto de botão.** `partnerCategories[].accent` (gastronomia
  dourado · hotelaria azul · turismo verde) identifica a entidade — serve para ícone e moldura, não
  para o rótulo de um botão contornado sobre branco. Amarrar os dois faz o MESMO botão sair em três
  cores conforme quem é o recomendado, e a variante de gastronomia cai exatamente no caso proibido
  do item acima. Os botões de contato (Instagram/Ligar/E-mail) usam azul médio fixo
  (`hsl(210,56%,23%)`) em `ContactSidebar.tsx` e `PartnerDetailContent.tsx`; o acento continua no
  pin do endereço.
- ⚠️ Esta limpeza **não** depende do léxico executável (`copy-lexicon.mjs` verifica palavras, não
  cores) — pode acontecer a qualquer momento, sem pré-requisito.

### 7.5 Fundo de seção e ritmo da home

Regra dura em `design-system.md` §1–§2: seção usa Areia ou branco, e só. Ordem atual da home, que
deve ser preservada — nenhuma seção repete o tom da vizinha imediata:

| Seção | Fundo |
|---|---|
| `RoteirosHero` | Areia |
| `DoresSection` | branco |
| `AutoridadeSection` | Areia |
| `RoteirosHomeSection` | branco |
| `AtrativosDestaqueSection` | Areia |
| `FaqSection` | branco |
| `PilaresFoz` | Areia |
| `CtaFinal` | branco |

**Regra:** ao criar ou mexer em seção da home, conferir a cor da seção anterior e seguinte. E fundos
de cores diferentes não precisam de hairline entre eles — a própria cor delimita.

### 7.6 Altura do hero — derivada da viewport, nunca calibrada à mão (regra dura)

> Esta seção existe porque a altura do hero foi "consertada" com número fixo várias vezes seguidas,
> e cada correção quebrou outra coisa. **Altura de hero é RELAÇÃO, não constante.**

**A estrutura, idêntica em toda hero** (`components/roteiros/RoteirosHero.tsx`):

```tsx
<section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-16">
  <div className="section-container relative z-10 py-10">
    <div className="grid items-center gap-11 lg:grid-cols-[minmax(0,48fr)_minmax(0,52fr)] lg:gap-14">
```

- `min-h-[100svh]` + `justify-center` → a seção ocupa a viewport inteira **em qualquer tela** e o
  conteúdo se centra sozinho no espaço que houver. Sobra some porque não existe: o que sobrar vira
  respiro simétrico acima e abaixo.
- **`svh`, não `dvh`.** `dvh` muda quando a barra do navegador móvel esconde/aparece, e a hero
  inteira reflui durante o scroll.
- `pt-16` = 64px = altura real da navbar `fixed inset-x-0 top-0 h-16`. Conferir
  `components/navbar/navbar.tsx` antes de confiar neste número — a geometria já mudou uma vez sem o
  checklist acompanhar.

**A peça da coluna direita se dimensiona pela ALTURA disponível**, não por um `max-w` escolhido:

```
max-w-[min(<teto>, calc(100svh - 144px))]     // 144 = navbar 64 + py-10 da seção (80)
```

Quando a peça tem proporção fixa, a largura é a altura da linha do grid — então travar a largura é
travar a altura. O `calc` é a parte viva. O `<teto>` é legítimo **só** quando existe um limite real:
os filhos com largura fixa em px (cards de atrativo em `w-[190px]`) param de acompanhar a escala do
palco acima de certo tamanho e a composição se desfaz. Mudou a largura do filho, muda o teto junto.

#### Já tentado e REPROVADO — não repetir

- ❌ **`pb-*` calibrado à mão** para a seção "alcançar" uma altura. Só acerta numa altura de tela, e
  exige recalibração a cada mudança na peça da direita.
- ❌ **Margem negativa puxando a peça para cima** para alinhar o topo dela com o do H1. O
  `overflow-hidden` da seção decapita o que subir — no caso da constelação, o arco superior dos
  anéis. Opacidade baixa no código engana: na tela o elemento aparece.
- ❌ **`items-start` no grid** para subir a copy. Sobe só a coluna de texto; a peça da direita fica
  onde estava e o desalinhamento entre as duas colunas fica pior que o problema original.
- ⚠️ **Encolher a peça da direita** funciona, mas é troca, não solução: a relação é linear (menos
  altura = copy mais alta **e** mais vazio no rodapé). Se a peça não preenche o próprio quadro, o
  vazio é interno — a correção é fazer a composição preencher (ex.: raio dos anéis da constelação),
  não encolher o quadro.

#### Diagnóstico, quando o conteúdo parecer deslocado

**Medir as duas colunas antes de tocar em qualquer valor.** Sob `items-center`, uma coluna muito mais
alta que a outra centraliza a curta contra ela e cria vazio acima — quase sempre mais deslocamento do
que o padding causa, e o reflexo errado é mexer no padding. Ler opacidade e tamanho no código não
substitui abrir a página: mais de uma conclusão correta na aritmética partiu de premissa falsa sobre
o que estava visível.


### 7.7 Wizard `/montar-roteiro` — removido

O wizard `/montar-roteiro` (rota e passos) não existe mais. As regras gerais de CTA dourado e hierarquia
de herói continuam em `design-system.md` §2 e no restante desta seção §7.
