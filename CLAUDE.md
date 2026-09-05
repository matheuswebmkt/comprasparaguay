# CLAUDE.md — Compras Paraguay

> Este arquivo é **ponteiro, não conteúdo**. Ele existe para garantir que as regras certas sejam
> abertas antes de escrever. Não copiar regra para cá — ela envelhece em dois lugares ao mesmo tempo.

## Regra dura: antes de escrever copy ou mexer no frontend

**Toda vez** que a tarefa envolver texto que o visitante lê (hero, CTA, FAQ, wizard, modal, e-mail,
`metadata`/`title`/`description`, dados em `app/data/*.ts`) **ou** layout de página/componente,
**abrir estes arquivos ANTES da primeira edição:**

| Abrir | O que governa |
|---|---|
| `_docs-dev-coder/conventions/posicionamento.md` **§21** | Voz e léxico: termos proibidos e o que usar no lugar, escopo (dentro de Foz), reforço humano, gratuidade implícita, proibição de preço, regra de ouro do funil, política de i18n |
| `_docs-dev-coder/design-system/layout-secoes.md` **§8-bis** | Estrutura: quantos elementos no hero, teto de seções, camada de composição visual |
| `_docs-dev-coder/design-system.md` | Paleta, tipografia, checklist de página nova |

Ler o índice (`conventions.md`) **não conta** — índice é mapa, não regra.

## Regra dura: auditar a ÁRVORE, não o arquivo

Ao verificar uma página, verificar **os componentes que ela renderiza**, não só o arquivo da rota.
Copy banida já foi encontrada escondida em componente-filho e em `app/data/*.ts` depois de a página
ter sido declarada limpa.

## Verificação (executável, não opcional)

```bash
pnpm check:copy      # léxico §21 no projeto inteiro
npx tsc --noEmit     # tipos
```

Nenhuma rodada de copy fecha sem os dois verdes. Há um hook `PostToolUse` em
`.claude/settings.json` que bloqueia o arquivo recém-escrito se ele contiver termo banido — é rede
de segurança, **não** substitui abrir os arquivos da tabela acima.

⚠️ O hook verifica **só o arquivo que você acabou de tocar**, porque o projeto tem violações
herdadas (91 na primeira medição) e uma checagem global travaria até as edições que estão
consertando o problema. A regra é: **não deixe um arquivo pior do que o encontrou.** Quando
`pnpm check:copy` zerar, promover o hook para checagem global.

## Protocolo de sessão

`_docs-dev-coder/context.md` é a diretiva raiz (ordem de leitura na entrada de sessão, regras de
sincronização de documentação, protocolo de fechamento de sprint). Ele **sobrepõe** este arquivo em
caso de conflito.

## Comandos

```bash
pnpm dev · pnpm build · pnpm db:migrate
```
