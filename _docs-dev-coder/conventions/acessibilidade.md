// Filepath: _docs-dev-coder/conventions/acessibilidade.md
// Version: 1.0
// Nome da Versão: "Contraste AA, texto nunca atenuado por opacity e label-in-name"

# CONVENTIONS — ACESSIBILIDADE

## 1 · Contraste de texto (WCAG AA)

Meta: **4,5:1** para texto normal e **3:1** para texto grande e para elementos gráficos (ícones).

- O dourado da marca (`hsl(35,82%,47%)` / `hsl(38,90%,55%)`) sobre fundo claro **reprova em AA**
  (~2,8:1). Uso permitido: preenchimento de botão grande e ícones decorativos. **Texto dourado
  pequeno usa `hsl(35,82%,30%)` ou mais escuro** (~5,6:1).
- O cinza-azulado secundário tem dois tons. **`hsl(210,25%,55%)` NÃO é cor de texto** sobre fundo
  claro (≈3,4:1, reprova): rótulos, breadcrumbs, hints e legendas usam `hsl(210,25%,42%)` no mínimo.
  `hsl(210,25%,45%)` (`SECUNDARIO`) é o piso para texto sobre branco; sobre areia pode não passar.
- Botões de CTA usam branco sobre gradiente dourado (≈2,8:1). O audit de contraste do Lighthouse não
  enxerga fundo em gradiente, mas o critério WCAG vale igual. É uma decisão de identidade visual do
  cliente: manter a marca e registrar a exceção, ou escurecer o gradiente até 3:1 — não trocar por
  conta própria.

## 2 · Atenuar texto com `opacity` reprova

Reduzir a opacidade de um elemento mistura a cor do texto com o fundo e derruba o contraste —
**nenhum tom de cinza salva** (a 0,45 sobre branco, um cinza escuro vira ~2:1). Destaque de item
ativo/inativo se faz pela **cor** do texto e do selo (que transicionam), nunca por `opacity` no
elemento que contém texto.

Caso vivo: os passos da `AutoridadeSection` tinham `opacity: 0.45` no `<li>` inativo e o Lighthouse
reprovava o contraste de todo texto não-ativo. O `opacity` ficou só no selo (número), onde não há
texto pequeno a ler.

## 3 · Label-in-name (WCAG 2.5.3)

O rótulo acessível de um controle **precisa conter o texto visível**. Um botão que mostra "PT" não
pode ter `aria-label="Selecionar idioma"` — o leitor de tela precisa ouvir algo que contenha "PT".
`aria-label` que substitui (em vez de conter) o texto visível quebra o comando por voz.

Caso vivo: `LanguageSwitcher` — o botão mostra a sigla do idioma; o `aria-label` é
`Idioma: ${sigla}`.

## 4 · Semântica e estrutura

- `<main>` uma vez por página; `<header>`/`<nav>`/`<section>`/`<footer>` no papel correto.
- **Um único `<h1>` por página.**
- Ícones decorativos levam `aria-hidden="true"`; ícone que é o único conteúdo do controle vai
  dentro do `aria-label` do controle.
