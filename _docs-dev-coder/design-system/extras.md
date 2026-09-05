# Design System · §10 Motion · §11 Iconografia · §12 E-mail · §13 Identidade em Texto

> Parte de [`design-system.md`](../design-system.md). Abrir quando a tarefa tocar em animação,
> escolha de ícone, e-mail transacional ou na grafia da marca.

> ⚠️ O conteúdo abaixo foi levantado do código e de `conventions/design.md` §7.2 — é o padrão que o
> projeto já pratica. **Manter sincronizado: criou animação, documenta aqui.**

---

## 10. Motion

### 10.1 Princípio

**O que faz motion parecer caro é a desaceleração, não a duração.** Curva de saída longa
(`cubic-bezier(0.16, 1, 0.3, 1)`, expo-out) em vez de animação rápida e linear. A exceção é
sincronia: animação que precisa chegar junto com um intervalo de JS usa `linear` obrigatoriamente,
porque qualquer easing adianta ou atrasa a chegada.

### 10.2 Inventário (`app/globals.css`)

| Classe | Onde | O que faz |
|---|---|---|
| `.rf-rise` + `.rf-d1`…`.rf-d5` | hero | Entrada escalonada, expo-out |
| `.rf-grain` | hero, CTA final | Grão em `multiply` sobre fundo claro |
| `.rf-core-ring` | constelação do hero | Anel pulsando atrás do "você" (dois em contratempo) |
| `.rf-ring-spin` | constelação do hero | Anéis orbitais, 110s |
| `.rf-step-pulse` | segunda dobra | Pulse do passo em destaque |

⚠️ **`.rf-rise` é animação de MOUNT, não de scroll.** Numa seção abaixo da dobra ela roda enquanto
o elemento está fora da tela e o visitante nunca a vê. Usar só no topo da página.

⚠️ **Escala de pulse é limitada pelo vizinho.** Num círculo de 48px, escalar além de ~1.6 invade o
item ao lado — por isso `.rf-step-pulse` (1.6) e `.rf-core-ring` (2.3) são keyframes separadas: no
hero há espaço, na grade de passos não.

### 10.3 Regras duras

- ⚠️ **Toda animação nova entra no bloco `@media (prefers-reduced-motion: reduce)`.** Sem exceção.
- ⚠️ **Animação que ESMAECE conteúdo precisa de uma forma de parar.** O destaque em loop da segunda
  dobra pausa no hover e no foco; sem isso, quem está lendo o último item vê o texto apagar no meio
  da leitura. E sob `reduced-motion` o esmaecimento também desliga: o destaque é reforço, nunca a
  única forma de acessar o conteúdo.
- ⚠️ **Movimento a mais compete com o conteúdo, não se soma a ele.** Numa seção onde o texto já
  pulsa entre destaque e recuo, uma segunda camada de movimento (a linha animada do trilho) foi
  removida por disputar atenção. Antes de animar um segundo elemento, perguntar o que ele acrescenta
  que o primeiro já não diz.

### 10.4 Armadilhas medidas (SVG e ciclo)

Todas custaram pelo menos uma rodada. Detalhamento em `conventions/design.md` §7.2.

1. **`stroke: url(#gradiente)` em traço quase reto NÃO PINTA.** `gradientUnits` no default
   `objectBoundingBox` + bbox degenerada (medida: 102×8px) = stroke invisível. Usar cor sólida.
2. **Não pendurar desenho de geometria em `requestAnimationFrame`.** Em aba oculta o rAF **pausa** e
   o `setTimeout` **continua**: o ciclo avança e nada é desenhado. Medir em `useLayoutEffect`
   (síncrono), iniciar o ciclo só com `document.hidden === false`, remontar no `visibilitychange`.
   O rAF fica só para animação por frame.
3. **Geometria se MEDE, não se deduz.** Uma fórmula de posição (`(2i+1)/2N`) supunha o círculo
   centralizado na coluna; ele era alinhado à esquerda. Usar `getBoundingClientRect` +
   `ResizeObserver`. Pior que o bug: o número errado virou justificativa para uma decisão de design
   errada, e as duas rodadas seguintes consertaram consequências.
4. **`stroke-dashoffset` só DESLOCA um padrão fixo, não o faz crescer.** Para um tracejado que se
   revela, reconstruir o `stroke-dasharray` a cada frame.
5. **`translateX` em `%` é relativo à largura DO PRÓPRIO ELEMENTO.** Uma faixa de 38% do trilho
   precisa de `100/38 ≈ 263%` para sair de vez pela direita.
6. **`animation-fill-mode: forwards`** em animação de passagem única — sem ele o elemento volta ao
   estilo base ao terminar e fica parado no lugar de partida.
7. **Restart de animação vem de `key={…}`, não de `transition`.**
8. **`transform-box: view-box`** é obrigatório para `transform-origin` em unidades de usuário dentro
   de SVG.

### 10.5 CSS órfão — deletar na hora, não listar

**Não manter lista de "CSS para limpar depois" neste documento.** Havia uma aqui, e ela contradizia
a regra editorial do `context.md` §4: estes arquivos descrevem o **estado atual**, não backlog. Pior,
não funcionava — dizia "limpar quando alguém passar por perto", e quem passava usava a lista como
motivo para adiar.

Achou classe sem uso? **Apaga.** O git guarda; não há nada a preservar num documento.

⚠️ **Mas "sem uso" se mede pelo VALOR, não pelo nome da classe.** `.shadow-tef-gold` chegou a ser
diagnosticada como órfã por não aparecer em nenhum `className` — e o valor dela estava redigitado à
mão **onze vezes** inline. Antes de apagar um token, procurar também pelo que ele declara.

---

## 11. Iconografia

**Lucide** (`lucide-react`), usada em ~53 componentes. Não misturar bibliotecas de ícone.

| Tamanho | Uso |
|---|---|
| `h-4 w-4` | Padrão — ao lado de texto, em eyebrow, em link (108 ocorrências) |
| `h-3.5 w-3.5` | Micro — dentro de badge ou pill |
| `h-5 w-5` | Ação — botão de ícone, redes sociais |
| `h-6 w-6` | Destaque pontual |

- `aria-hidden="true"` em ícone decorativo; `aria-label` no elemento pai quando o ícone é a única
  indicação da ação.
- ✅ **Dourado É permitido em ícone** — §2 autoriza dourado como *acento gráfico*. O que não pode é
  dourado como **cor de texto** sobre fundo claro.
- `stroke-width` padrão da Lucide (2) na maioria; 2.1–2.6 em ícones pequenos, onde o traço fino some.

---

## 12. Design de E-mail (`lib/email.ts`)

Envio por **Resend**. HTML de e-mail é outro meio: `<table role="presentation">` de 600px e
**estilo inline em tudo** — classes e CSS externo não sobrevivem à maioria dos clientes.

Estrutura dos dois transacionais (acesso ao painel e magic link de roteiro salvo):

| Faixa | Tratamento |
|---|---|
| Fundo da mensagem | `#F8FAFC` |
| Cartão | `#ffffff`, `border-radius:12px`, borda `#E2E8F0` |
| Cabeçalho | gradiente `#0F2A47 → #0A1F35` com a marca em branco + bullet dourado `#F4A623` |
| Corpo | texto `#475569`, título `#0F2A47` |
| CTA | fundo `#D4821A`, texto branco, `border-radius:10px` |
| Rodapé | `#F8FAFC`, texto `#94A3B8` |

⚠️ **Hex, não HSL** — vários clientes de e-mail não suportam `hsl()`.

ⓘ **Pendência de decisão:** o cabeçalho ainda usa o gradiente navy escuro, que foi aposentado do
site (`design-system.md` §1: nada de fundo escuro). E-mail é outro meio e a regra foi escrita para o
site — mas os dois deveriam parecer a mesma marca. Decidir numa passada de e-mail.

---

## 13. Identidade da Marca em Texto

**A marca se escreve `Compras Paraguay`**, com as duas iniciais maiúsculas. Fonte única em código:
`SITE_NAME` em `lib/seo.ts`.

- Nunca em caixa alta (`ROTEIRO FOZ`) fora de um eyebrow com `text-transform`.
- Nunca abreviar para "RF".
- ⚠️ Ao renomear qualquer coisa relacionada à marca, varrer **também** `lib/email.ts` e strings
  dentro de HTML — e-mail transacional é superfície que ninguém relê no dia a dia e escapa de busca
  por componente.
- Em `<title>` e OG, o padrão é `<Assunto> | Compras Paraguay`.
