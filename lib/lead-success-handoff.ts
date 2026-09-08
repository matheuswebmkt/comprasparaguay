// Filepath: lib/lead-success-handoff.ts
// Version: 1.3
// Última mudança: "chaves locais rgf_* → cp_* (vocabulário do satélite de origem — D9; domínio novo, custo zero)"
// Nome da Versão: "Handoff lido na página de obrigado /obrigado (era /o-que-fazer)"
// Baseado na Versão: 1.1 ("Adiciona transportChecked — Sprint 7")
//
// A tela de sucesso do modal foi removida (todo submit redireciona) — este é o contrato entre quem GRAVA
// (TicketOfferModal, logo antes do redirect) e quem LÊ (LeadSuccessScreen, em /obrigado).
// Sem PII: só metadados do CTA/produto (o mesmo `detail` que já circulava no CustomEvent
// `ticket-offer:open`) + o necessário pra decidir o que a tela de sucesso mostra (modo de sucesso, dedup).

import type { TicketOfferOpenDetail } from "@/lib/roteiro-lead";
import type { ItensKind } from "@/lib/offer-defaults";

export const LEAD_HANDOFF_KEY = "cp_lead_success_handoff";

/** Rota canônica do pós-submit (página de confirmação). Rota única para todos os produtos. */
export const OBRIGADO_PATH = "/obrigado";

export interface LeadSuccessHandoff {
  detail: TicketOfferOpenDetail | null;
  isLocal: boolean | null;
  alreadyInFoz: boolean | null;
  modalId: string;
  wasDuplicate: boolean;
  /** Token do pedido (`/r/[token]`) devolvido por `/api/leads` — a página de obrigado mostra o link e
   * a mensagem de WhatsApp o carrega. Ausente em lead que não chegou a ser gravado. */
  pedidoToken?: string | null;
  /** Resumo de UMA linha do pedido, já montado (`lib/pedido-resumo.ts`). Viaja pronto porque só o
   * modal tem os dados crus na mão — a página de obrigado não conhece extras nem transporte efetivo. */
  resumo?: string | null;
  /**
   * Qual fluxo gravou este handoff. ⚠️⚠️ EXISTE PARA IMPEDIR QUE UM PEDIDO MOSTRE OUTRO: o storage é
   * por aba e sobrevive entre envios, então sem este marcador a página de roteiro lia o handoff do
   * ingresso enviado antes — e exibia o link do pedido ERRADO. A página só aceita o handoff quando ele
   * casa com o DESTINO da URL. São três, não dois: `?tipo=pronto` e `?tipo=personalizado` levam à
   * mesma rota, e com um único valor "roteiro" o handoff de um roteiro PRONTO passava na conferência
   * de um envio do wizard — que não gravava handoff nenhum e herdava o anterior.
   */
  fluxo?: "atrativo" | "roteiro-pronto" | "roteiro-personalizado";
  /** Ingressos, reservas de data ou os dois (`itensKind`, §17-ter): decide o rótulo do link na tela
   * de sucesso e na mensagem de WhatsApp. Ausente = tratar como "ingressos". */
  itens?: ItensKind;
  /** Nomes legíveis dos itens do pedido — a lista "Incluído: …" do WhatsApp, exibida igual em
   * "O que você pediu" na página de obrigado. Ausente/vazia = sem lista (fluxo sem itens). */
  nomes?: string[];
  /** Link wa.me pronto (voz do LEAD, `centralWaUrl`) — gravado só quando a tela de sucesso mostra o
   * botão "Iniciar conversa" (modo whatsapp, ou fallback de dedup) e há número central. É o que faz
   * o botão existir na página de obrigado (a tela de sucesso dentro do modal só roda em preview). */
  waUrl?: string | null;
  /** Slug da agência ativa na oferta — alimenta `partner_slug` da taxonomia nos eventos de CTA
   * disparados pela página de obrigado (que não conhece a config da oferta). */
  partnerSlug?: string | null;
  /** CTA de sucesso já contabilizado nesta aba? Persistido de volta no storage — o F5 não re-dispara a
   * marcação (o handoff sobrevive ao F5 de propósito: a página de obrigado reexibe o pedido). */
  shownFired?: boolean;
}
// ⛔ Não voltar a carregar aqui a resposta de transporte (`transportChecked`/`transportFollowUpDone`).
// Isto é storage de SESSÃO e POR ABA — errado por construção pra um atributo da PESSOA. A resposta de
// transporte consolida em `lib/known-lead.ts` (`wantsTransport`, localStorage, cross-aba e cross-produto),
// e a pergunta vive no modal e no wizard. Ver conventions/tracking-metricas.md (known-lead).
