// Filepath: _docs-dev-coder/conventions.md
// Version: 1.0
// Nome da Versão: "Índice das decisões travadas — mapa de temas, não conteúdo"

# CONVENTIONS — ÍNDICE

> **Este arquivo é MAPA, não conteúdo** (`context.md` §1.1-bis). Abrir o arquivo temático do tema da
> tarefa antes de qualquer edição ou decisão técnica. Repropor decisão já registrada aqui é violação
> de protocolo (§2.3).
>
> Regra de escrita (§4): decisão nova entra no **arquivo temático**, estendendo a seção existente se o
> tema já existe, preservando o número original das seções (§N, inclusive sufixos como §13-bis) —
> referências cruzadas no código citam "conventions §N" e precisam continuar resolvendo. Sem
> renumeração, sem changelog, sem data no texto: aqui se escreve o que é verdade agora.

## Mapa de temas

| Tema | Arquivo | O que responde |
|---|---|---|
| Pixel, eventos, `value`, telemetria 1st-party | [`conventions/tracking-metricas.md`](conventions/tracking-metricas.md) | o que é enviado ao Meta, por quê, onde é injetado, o que é proibido, e como se mede com dados próprios |
| Marca, escopo do projeto e o que saiu dele | [`conventions/marca-e-escopo.md`](conventions/marca-e-escopo.md) | identidade do domínio, ausência de redes próprias, verticais fora do escopo, painel do parceiro removido |

Temas sem arquivo = tema sem regra escrita. Quando uma decisão sobre um tema novo aparecer, criar
`conventions/<tema>.md` com seções numeradas e acrescentar a linha acima.

> ⚠️ **Citações antigas em comentários de código.** Vários cabeçalhos e comentários ainda citam
> `conventions §N` de uma documentação que não existe mais (numeração antiga, não é a daqui). Enquanto
> o comentário descrever o comportamento que o código tem, ele é útil; quando contradisser o código,
> **o código manda** — e a seção correspondente deste índice, se existir, é a autoridade. Reescrever a
> citação ao tocar no arquivo, não em varredura à parte.

## Autoridades paralelas (não são conventions deste repo)

| Arquivo | Autoridade |
|---|---|
| `_docs-portfolio/pixel-matrix.md` + `pixel-decisions.md` | **contrato do pixel**, compartilhado e copiado verbatim nos projetos do portfólio. Sobrepõe qualquer convenção local de tracking — ver o ponteiro duro em `conventions/tracking-metricas.md` §1 |
| `design-system.md` | tokens e UI; carregado sob demanda, só em tarefa que toque superfície visual (§1.1-bis) |
