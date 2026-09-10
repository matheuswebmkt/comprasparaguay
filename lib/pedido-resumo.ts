// Filepath: lib/pedido-resumo.ts
// Version: 3.0
// Nome da Versão: "Mensagem wa.me limpa — só intro + link do resumo (/r/[token]); o detalhe vive na página"
//
// Módulo PURO (sem DB, sem catálogo): usado pelo client (modal, /obrigado) E pelo server (Telegram).
// Fonte única do link curto do pedido e da montagem da mensagem pronta de WhatsApp.
//
// ⚠️ A mensagem pronta do WhatsApp NÃO carrega resumo nem lista — intro + "Ver resumo: link".
// Todo o detalhe do pedido (data, pessoas, itens, transporte) está na página pública `/r/<token>`,
// que é renderizada no idioma do lead. O card do Telegram continua completo (é o briefing do
// vendedor) — suas linhas são montadas em lib/telegram.ts, não aqui.

import type { Locale } from "./i18n/config";

/** Base do site (mesma fonte de lib/seo.ts, sem importar nada pesado) — o link curto do pedido. */
const SITE_BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.comprasparaguay.online";

/** Rótulo do link de resumo na mensagem pronta, por idioma. */
const VER_RESUMO: Record<Locale, string> = {
  pt: "Ver resumo:",
  en: "See summary:",
  es: "Ver resumen:",
};

/** `{SITE_URL}/r/<token>` — null sem token (lead legado): a mensagem sai só com a introdução. */
export function pedidoLink(token: string | null | undefined): string | null {
  const t = (token ?? "").trim();
  return t ? `${SITE_BASE.replace(/\/+$/, "")}/r/${encodeURIComponent(t)}` : null;
}

/**
 * Mensagem final do wa.me: introdução → "Ver resumo: <link>". Nada mais — o detalhe do pedido
 * concentra na página `/r/<token>`.
 */
export function waMessageWithLink(
  intro: string,
  token: string | null | undefined,
  locale: Locale,
): string {
  const url = pedidoLink(token);
  return url ? `${intro}\n\n${VER_RESUMO[locale]} ${url}` : intro;
}
