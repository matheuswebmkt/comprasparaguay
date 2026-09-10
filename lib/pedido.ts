// Filepath: lib/pedido.ts
// Version: 1.0
// Nome da Versão: "Resolver do pedido público — token → o que a pessoa escolheu (produto único: reserva de data)"
//
// SERVER-ONLY (lê o banco e o catálogo). Traduz o `public_token` de um lead na estrutura que a página
// /r/[token] renderiza.
//
// ⚠️⚠️ **NADA DE PII SAI DAQUI.** A página é pública para quem tem o link — nome, WhatsApp e e-mail do
// lead ficam de fora do tipo `Pedido` de propósito, não por esquecimento. O mesmo link é colado num
// grupo de vendedores e reencaminhado por WhatsApp. Não acrescentar campo de contato neste arquivo.

import { getSql } from "./db";
import { getOfferConfigCached } from "./offer-settings";
import { isLocale, DEFAULT_LOCALE, type Locale } from "./i18n/config";
import { getAttractionBySlug } from "@/app/data/attractions";

export interface PedidoItem {
  slug: string;
  name: string;
}

/** Resumo público de uma reserva de data (produto único do projeto — sem wizard, sem ingresso). */
export interface Pedido {
  locale: Locale;
  /** Slugs do pedido resolvidos pelo catálogo; slug órfão (atrativo removido) some da lista. */
  itens: PedidoItem[];
  /** ISO YYYY-MM-DD (a coluna `date` volta como Date no driver do Neon). */
  visitDate: string | null;
  ticketQty: number | null;
  /** `true` sempre nos pedidos atuais (o transporte é fato do produto); `false` só em linha antiga. */
  wantsTransport: boolean | null;
  /** Momento do submit do lead (`created_at`) — alimenta a linha "Enviado em" do resumo público. */
  createdAt: Date | null;
  /** Passo de identidade do modal (respostas de qualificação). */
  inFoz: boolean | null;
  isLocal: boolean | null;
  /** Sucesso do produto DESTE lead — decide se a página oferece o CTA de conversa. */
  successMode: "close" | "whatsapp";
  /** Número central; `null` desliga o CTA mesmo com `successMode = whatsapp`. */
  whatsapp: string | null;
}

type Row = {
  id: number;
  superseded_by: string | number | null;
  locale: string | null;
  item_slugs: string | null;
  visit_date: string | Date | null;
  ticket_qty: number | null;
  wants_transport: boolean | null;
  is_local: boolean | null;
  already_in_foz: boolean | null;
  created_at: string | Date | null;
};

const csv = (v: string | null): string[] =>
  (v ?? "").split(",").map((s) => s.trim()).filter(Boolean);

/** Data da coluna `date` → ISO. ⚠️ Getters UTC: o driver devolve meia-noite UTC e getters locais
 * mostrariam o DIA ANTERIOR em BRT (mesmo cuidado de `formatVisitDate` em lib/telegram.ts). */
function isoDate(v: string | Date | null): string | null {
  if (!v) return null;
  if (v instanceof Date) {
    if (Number.isNaN(v.getTime())) return null;
    const m = String(v.getUTCMonth() + 1).padStart(2, "0");
    const d = String(v.getUTCDate()).padStart(2, "0");
    return `${v.getUTCFullYear()}-${m}-${d}`;
  }
  return /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null;
}

/**
 * Slug → item resolvido pelo catálogo. Slug desconhecido (atrativo removido do catálogo depois do
 * pedido) some da lista em vez de virar linha órfã com o slug cru na tela.
 */
function toItem(slug: string): PedidoItem | null {
  const a = getAttractionBySlug(slug);
  if (!a) return null;
  return { slug, name: a.name };
}

/**
 * Pedido público a partir do token do link.
 *
 * ⚠️ **Segue `superseded_by` num salto**: um reenvio dentro da janela de dedup grava um lead NOVO, e o
 * link que a pessoa já tem em mãos aponta para o antigo. Sem este salto, ela reabriria o próprio link e
 * veria um pedido desatualizado. A cadeia é plana por construção, então um salto basta.
 */
export async function getPedido(token: string): Promise<Pedido | null> {
  const sql = getSql();
  if (!sql || !token) return null;

  let row: Row | undefined;
  try {
    const rows = (await sql`
      select id, superseded_by, locale, item_slugs, visit_date, ticket_qty, wants_transport,
             is_local, already_in_foz, created_at
        from leads where public_token = ${token} and abandoned = false limit 1
    `) as Row[];
    row = rows[0];
    if (row?.superseded_by != null) {
      const novo = (await sql`
        select id, superseded_by, locale, item_slugs, visit_date, ticket_qty, wants_transport,
               is_local, already_in_foz, created_at
          from leads where id = ${Number(row.superseded_by)} limit 1
      `) as Row[];
      row = novo[0] ?? row;
    }
  } catch {
    return null;
  }
  if (!row) return null;

  const offer = await getOfferConfigCached();

  return {
    locale: isLocale(row.locale) ? row.locale : DEFAULT_LOCALE,
    itens: csv(row.item_slugs).map(toItem).filter((i): i is PedidoItem => i !== null),
    visitDate: isoDate(row.visit_date),
    ticketQty: row.ticket_qty,
    wantsTransport: row.wants_transport,
    createdAt: row.created_at instanceof Date ? row.created_at : null,
    inFoz: row.already_in_foz,
    isLocal: row.is_local,
    successMode: offer.atrativoSuccessMode,
    whatsapp: offer.modalWhatsapp?.trim() ? offer.modalWhatsapp : null,
  };
}
