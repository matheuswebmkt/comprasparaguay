# AGENTS.md — Compras Paraguay

> Este arquivo é **ponteiro, não conteúdo**. Ele existe para garantir que as regras certas sejam
> abertas antes de escrever. Não copiar regra para cá — ela envelhece em dois lugares ao mesmo tempo.


## Verificação (executável, não opcional)

```bash
npx tsc --noEmit     # tipos
pnpm build           # build de produção
```

## Protocolo de sessão

`_docs-dev-coder/context.md` é a diretiva raiz (ordem de leitura na entrada de sessão, regras de
sincronização de documentação, protocolo de fechamento de sprint). Ele **sobrepõe** este arquivo em
caso de conflito.

## Comandos

```bash
pnpm dev · pnpm build · pnpm db:migrate
```
