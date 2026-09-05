# Design System · §4 Espaçamento e Layout · §8 Padrões de Seção · §9 Utilidades Globais

> Parte de [`design-system.md`](../design-system.md). Abrir **junto com o núcleo** sempre que a
> tarefa montar ou alterar página/seção.

> ⚠️ O `CLAUDE.md` manda abrir este arquivo como regra dura antes de mexer no frontend, e o código
> cita §8-bis/§8-ter dezenas de vezes. Se este arquivo ficar vazio ou desatualizado de novo, cada
> seção nova volta a divergir em padding, escala de título, line-height e tracking — já aconteceu.
> **Manter sincronizado: mudou o layout, atualiza aqui.**

---

## 4. Espaçamento e Layout

### 4.1 Container

Toda seção usa `.section-container` (`app/globals.css`): `max-width: 1280px`, `margin: 0 auto`,
padding lateral `1.5rem` (`2rem` a partir de 640px). **Não** criar container próprio.

### 4.2 Respiro vertical de seção — valor único

`.rf-section` → `5rem` (80px) e `6rem` (96px) a partir de 640px.

⚠️ Nenhuma seção define `py-*` próprio. Antes disso conviviam `py-16 sm:py-20`, `py-20 sm:py-24` e
`py-20 sm:py-28` na mesma página.

⚠️ **O hero é a única exceção, e não usa `.rf-section`.** Ele ocupa a viewport
(`min-h-[100svh]` + `justify-center`, com `pt-16` compensando a navbar e `py-10` interno), porque a
altura dele é derivada da tela e não do ritmo vertical das seções. Regra completa, com o que já foi
reprovado nesse ponto, em `conventions/design.md` §7.6 — abrir antes de mexer em altura de hero.

### 4.3 Larguras de leitura

| Uso | Largura |
|---|---|
| Cabeçalho de seção (eyebrow + H2 + subtítulo) | `42rem` — vem de `.rf-head`, **não** declarar |
| Bloco de fechamento dentro de uma seção | `42rem` (`max-w-2xl`), o mesmo do cabeçalho |
| Lista de FAQ | `48rem` (`max-w-3xl`) |
| Grade de 3 colunas | `64rem` (`max-w-5xl`) |

⚠️ **Não colocar `max-w-*` em elemento DENTRO do `.rf-head`.** Um `max-w-lg` no subtítulo do CTA
final foi o que fez aquela seção parecer mais estreita que todas as outras. A largura é do bloco,
não de cada filho.

---

## 8. Padrões de Seção

### 8.1 Cabeçalho — estrutura única

```tsx
<section className="rf-section" style={{ background: /* Areia ou branco */ }}>
  <div className="section-container">
    <div className="rf-head">
      <p className="rf-eyebrow">Rótulo do tema</p>
      <h2 className="rf-title">Título da seção</h2>
      <p className="rf-sub">Uma frase que desenvolve o título.</p>
    </div>
    {/* conteúdo */}
  </div>
</section>
```

⚠️⚠️ **ESTILO INLINE VENCE CLASSE.** Ao usar estas classes, **não** declarar `fontSize`,
`fontWeight`, `fontFamily`, `color`, `letterSpacing` ou `lineHeight` inline no mesmo elemento —
a classe deixa de valer e a seção volta a divergir. Foi assim que o padrão se perdeu antes.

Exceções deliberadas, ambas documentadas no próprio componente:
- `CtaFinal` não tem eyebrow — é fechamento, não tema novo.
- `PilaresFoz` usa `.rf-eyebrow` mas **não** `.rf-head`: é faixa utilitária de linking interno
  (§8-bis), alinhada à esquerda, e `.rf-head` centraliza.

### 8.2 Fundo de seção — dois valores, só

Areia `hsl(40,33%,97%)` ou branco `hsl(0,0%,100%)`. **Nada além disso** — ver `design-system.md` §1
e §2. Sem fundo escuro, sem campo de cor inventado para "destacar" a seção.

### 8.3 `text-wrap` em título de seção

`.rf-title` usa **`pretty`**, nunca `balance`. `balance` equaliza o comprimento das linhas, e o
quanto ele encurta a primeira depende do texto — o que faz cada seção renderizar o título numa
largura diferente. Em título único de página (hero) `balance` continua adequado, porque ali é um
caso só.

### 8-bis. Subtração (regra citada 20 vezes no código)

> Escrita na R1 para consertar um rascunho poluído. É **especificação de subtração**: o que NÃO
> pode estar na seção.

- **UMA ideia por seção, desenvolvida** — não uma grade de cards equivalentes. Grade de cards
  iguais comunica "catálogo", que é o oposto do posicionamento (`conventions/posicionamento.md` §21.1).
- **UM CTA por seção.** Link de texto dentro da prosa não conta como CTA; botão preenchido, sim.
- **Teto de 5 seções na home.** `PilaresFoz` é faixa utilitária de linking interno e **não conta**.
  Não introduzir seção nova sem cortar outra.
- **Sem orbe, sem chips, sem "pill soup"** — pilhas de badges empilhados foram removidas do hero do
  wizard e do card de roteiro pelo mesmo motivo.
- **FAQ com filetes entre itens**, não caixa branca com borda por pergunta: oito retângulos
  idênticos leem como parede, não como lista de respostas.

⚠️ §8-bis é especificação de **subtração**, escrita contra excesso. Aplicá-la como *estética* produz
blandice — foi o que aconteceu na R9, quando o hero ficou "simples, estático, sem vida". Tirar o que
sobra não é o mesmo que não ter nada.

### 8-ter. Nitidez de imagem

Imagem exibida acima de ~1x da dimensão real do arquivo fica mole, e moleza lê como barato na hora.
**Conferir a dimensão real do asset antes de escolher a composição.** Imagem contida com margem,
nunca full-bleed (`design-system.md` §14).

⚠️ **`sizes` descreve o que o `object-fit` EXIGE, não a largura da caixa (regra dura).** Com
`object-cover`, uma fonte mais larga que a caixa é ampliada até o lado curto cobrir — a largura
efetiva fica MAIOR que a caixa. Fonte 3:2 em caixa 4:3 = 1,125x a caixa; fonte 4:3 em caixa
quadrada = ~1,33x. Some a isso DPR 2 e qualquer `scale` de hover/motion antes de escolher o número.

Como conferir, sem achismo:

1. Largura exigida = caixa x fator do `object-fit` x DPR (usar 2) x maior `scale` aplicado.
2. Ver o que o Next realmente serve: `curl -s localhost:3000/<rota> | grep -o 'srcSet="[^"]*<slug>[^"]*"'`.
3. O candidato escolhido tem de ser >= o exigido. Abaixo de 1x é o que produz o "blur".

⚠️ **Sem `sizes`, imagem de largura fixa recebe só `1x/2x`** — e o candidato 2x costuma ser 384,
que é insuficiente para caixas a partir de ~176px sob `object-cover`. Declarar `sizes` troca a
estratégia para descritores `w`, e aí o navegador escolhe pela conta acima.

⚠️ **Nem todo borrão é resolução.** Antes de mexer em `sizes`, comparar a nitidez da foto na
dimensão pintada contra as vizinhas — foto de plano aberto com estrutura fina (grades, cabos,
raios de roda gigante) aliasa em caixa pequena mesmo servida na resolução certa. Aí o conserto é
recorte mais fechado ou outra foto, não `sizes`.

---

## 9. Utilidades Globais (`app/globals.css`)

| Classe | Para quê |
|---|---|
| `.section-container` | Container padrão de toda seção |
| `.rf-section` | Respiro vertical de seção |
| `.rf-head` | Bloco de cabeçalho: 42rem, centralizado, com margem inferior |
| `.rf-eyebrow` | Rótulo do tema: 12px, 600, uppercase, `0.2em`, Verde Selva |
| `.rf-title` | H2: Fraunces 600, `clamp(1.875rem, 3.6vw, 2.75rem)`, lh 1.08, ls −0.025em |
| `.rf-sub` | Subtítulo: 17px, lh 1.65 |
| `.rf-grain` | Grão sobre fundo claro (`mix-blend-multiply`) |
| `.rf-rise` + `.rf-d1`…`.rf-d5` | Entrada escalonada — só onde o elemento está visível no load |
| `.rf-core-ring`, `.rf-ring-spin` | Motion da constelação do hero |
| `.rf-step-pulse` | Pulse do passo em destaque da segunda dobra |
| `.shadow-tef-sm/md/lg/xl` | Sombras do sistema (§6) |
| `.text-gradient-tef` | Gradiente de texto da marca |

⚠️ `.rf-rise` é animação de **mount**, não de scroll: numa seção abaixo da dobra ela roda enquanto
o elemento está fora da tela e o visitante nunca a vê. Usar só no topo da página.

⚠️ Toda animação nova entra no bloco `@media (prefers-reduced-motion: reduce)` do `globals.css`.
