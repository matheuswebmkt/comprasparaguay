// Filepath: lib/lead-card.ts
// Version: 1.0
// Nome da Versão: "Resolver da tag de produto do card — fonte única (Sprint 6)"
//
// Deriva a tag `[NOVO LEAD: ...]`/`[ATRATIVO ...]` do card do Telegram a partir do contexto do lead
// (roteiro_titulo/roteiro_slug/lead_context/cta_type). Extraído de app/api/leads/route.ts: a
// reconciliação de reenvio precisa da MESMA derivação tanto a partir do corpo da requisição atual
// quanto (no telegram-webhook) a partir de uma linha já GRAVADA no banco — sem esta fonte
// única a 2ª cópia divergiria da 1ª, exatamente o padrão de bug que este arquivo existe pra evitar
// (ver lib/telegram.ts, que por ser puro nunca resolve isto sozinho).

import type { ProductCopyKind } from "@/lib/offer-defaults";

export interface LeadProductContext {
  leadContext: string | null;
  roteiroSlug: string | null;
  roteiroTitulo: string | null;
  ctaType: string | null;
}

/** É um lead de roteiro pronto ou personalizar? (orçamento OU personalização). */
export function isRoteiroLead(ctx: LeadProductContext): boolean {
  // ⚠️⚠️ O contexto EXPLÍCITO vence as heurísticas abaixo. O modal grava `roteiroTitulo` com o
  // `subjectTitle` do item — que num pedido de ingresso é o nome do ATRATIVO —, então o
  // `Boolean(ctx.roteiroTitulo)` lá embaixo classificava todo lead de atrativo como roteiro. Isso
  // vazava para três lugares ao mesmo tempo: o rótulo do card, a saudação do wa.me (bucket de
  // `productKindOf`) e o `confirmFlow` de `/api/leads`, que passava a ler `roteiroSuccessMode` e
  // ignorava o modo de sucesso configurado para atrativos.
  if (ctx.leadContext === "atrativo") return false;
  return (
    ctx.leadContext === "roteiro" ||
    ctx.leadContext === "roteiro_personalizar" ||
    Boolean(ctx.roteiroSlug) ||
    Boolean(ctx.roteiroTitulo) ||
    (ctx.ctaType?.startsWith("roteiro") ?? false)
  );
}

// ⛔ Aqui existia `roteiroTagOf` — a tag `[NOVO LEAD: ROTEIRO 3 DIAS — COMPRAS]` do título do card.
// REMOVIDA junto com `formatRoteiroLeadTag` (decisão do usuário): o título do card passou a ser fixo
// (`🟢 NOVA QUALIFICAÇÃO` / `ℹ️ REGISTRO DE NOVA QUALIFICAÇÃO`) porque o produto já aparece na linha
// do assunto logo abaixo — a tag fazia as duas primeiras linhas dizerem a mesma coisa. Não
// reintroduzir sem que o título volte a precisar do produto.

/**
 * Bucket de copy do modal (hoje: sempre `atrativo` — produto único na simplificação Compras PY).
 * `isRoteiroLead` continua existindo para o server tolerar linhas legadas com contexto de roteiro,
 * mas a copy cai no bucket único.
 */
export function productKindOf(_ctx: LeadProductContext): ProductCopyKind {
  return "atrativo";
}
