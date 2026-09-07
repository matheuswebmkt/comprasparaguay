// Filepath: lib/meta-capi.ts
// Version: 1.3
// Nome da Versão: "Erro do CAPI passa a aparecer em produção (falha de token deixa de ser silenciosa)"
// Baseado na Versão: 1.2

import crypto from "node:crypto";
import { TRACKING_PROPERTY, taxonomyParams, VERTICALS } from "./tracking-taxonomy";
import { buildLeadEventParams, type LeadKind } from "./lead-value";

// Reusa o Pixel ID do front-end (default embutido + override por env — conventions §6).
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "283634370750714";
const CAPI_TOKEN = process.env.META_CAPI_TOKEN;
// Só para TESTE: quando setado, os eventos do servidor aparecem na aba "Testar eventos".
// NUNCA setar em produção (Vercel) — desvia os eventos para o modo de teste.
const CAPI_TEST_CODE = process.env.META_CAPI_TEST_CODE;
const GRAPH_VERSION = "v21.0";

/** Normaliza (trim + lowercase) e aplica SHA-256 — requisito do Meta para PII. */
function hashField(value?: string | null): string | undefined {
  const v = value?.trim().toLowerCase();
  if (!v) return undefined;
  return crypto.createHash("sha256").update(v).digest("hex");
}

/** Telefone: só dígitos (mantém o DDI), depois SHA-256. */
function hashPhone(value?: string | null): string | undefined {
  const digits = value?.replace(/\D/g, "");
  if (!digits) return undefined;
  return crypto.createHash("sha256").update(digits).digest("hex");
}

/** Cidade: lowercase + remove espaços (norma do Meta pra `ct`), depois SHA-256. */
function hashCity(value?: string | null): string | undefined {
  const v = value?.trim().toLowerCase().replace(/\s+/g, "");
  if (!v) return undefined;
  return crypto.createHash("sha256").update(v).digest("hex");
}

export interface CapiLeadInput {
  eventId: string; // MESMO event_id do Pixel (browser) → Meta deduplica
  email?: string | null;
  phone?: string | null;
  clientIp?: string | null;
  userAgent?: string | null;
  fbp?: string | null; // cookie _fbp
  fbc?: string | null; // cookie _fbc
  sourceUrl?: string | null; // URL da página onde ocorreu o evento
  partner?: string | null;
  /** `item_slug` da taxonomia — o MESMO valor que o Pixel mandou neste `event_id` (G1). */
  itemSlug?: string | null;
  /** `content_ids` — os slugs do bundle, idem. Array; nunca concatenar numa string (D7). */
  contentIds?: string[] | null;
  // EMQ (Event Match Quality) — identificadores extras, hasheados como em/ph. Não são taxonomia:
  // melhoram só o casamento do evento com a pessoa. ⚠️ NÃO duplicar em `custom_data`.
  visitorId?: string | null; // cp_vid → external_id
  city?: string | null;      // geo Vercel → ct
  country?: string | null;   // geo Vercel (ISO alpha-2) → country
  // Sinais do `value` — os MESMOS que o client passou a `buildLeadEventParams` (G1). O servidor
  // RECALCULA a partir deles; nunca aceita um `value` pronto do cliente (G6).
  leadKind?: LeadKind;
  isLocal?: boolean | null;
  alreadyInFoz?: boolean | null;
  wantsTransport?: boolean;
  locale?: string | null;
  ticketQty?: number | null;
  /**
   * `partner_slug` da taxonomia: a AGÊNCIA ATIVA, espelhando `offer.transportOffer.agencySlug` no
   * client. NÃO confundir com `partner` acima, que é o `assigned_partner` do roteamento interno e
   * só existe quando o lead foi de fato encaminhado.
   */
  agencySlug?: string | null;
}

/**
 * Envia o evento "Lead" para a Conversions API do Meta (server-side, à prova de
 * AdBlock/iOS). No-op silencioso se faltar META_CAPI_TOKEN. Nunca lança — qualquer
 * falha é logada apenas em desenvolvimento e NÃO bloqueia a resposta ao usuário.
 */
export async function sendLeadToCapi(input: CapiLeadInput): Promise<void> {
  if (!CAPI_TOKEN) return;

  const userData: Record<string, unknown> = {};
  const em = hashField(input.email);
  const ph = hashPhone(input.phone);
  if (em) userData.em = [em];
  if (ph) userData.ph = [ph];
  // EMQ: external_id/ct/country. Hasheados como o resto do `user_data` — nunca em `custom_data`.
  const extId = hashField(input.visitorId);
  if (extId) userData.external_id = [extId];
  const ct = hashCity(input.city);
  if (ct) userData.ct = [ct];
  const country = hashField(input.country);
  if (country) userData.country = [country];
  if (input.clientIp) userData.client_ip_address = input.clientIp;
  if (input.userAgent) userData.client_user_agent = input.userAgent;
  if (input.fbp) userData.fbp = input.fbp;
  if (input.fbc) userData.fbc = input.fbc;

  const payload = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        action_source: "website",
        ...(input.sourceUrl ? { event_source_url: input.sourceUrl } : {}),
        user_data: userData,
        custom_data: {
          // 🚫 `content_name: "Roteiro_Foz_Lead"` REMOVIDO (D9 + matriz §4): era idêntico em TODO
          // lead, então não discriminava nada, e colava o nome de um satélite num pixel de vários.
          // O espelho no client (TicketOfferModal) também não manda mais — G1.
          // Fonte ÚNICA com o Pixel (`lib/lead-value.ts`) — mesmos sinais, mesmo cálculo de `value`.
          // Se `leadKind` vier ausente (chamador sem contexto), cai no default `"ticket"`: nunca
          // quebra o envio, só perde o enriquecimento. `item_slug` sai DAQUI, não do `taxonomyParams`
          // abaixo, senão o param sairia duplicado no mesmo payload.
          ...buildLeadEventParams({
            leadKind: input.leadKind ?? "ticket",
            itemSlug: input.itemSlug,
            isLocal: input.isLocal,
            alreadyInFoz: input.alreadyInFoz,
            wantsTransport: input.wantsTransport ?? false,
            locale: input.locale,
            ticketQty: input.ticketQty,
          }),
          ...(input.partner ? { partner: input.partner } : {}),
          // ESPELHO do Pixel no mesmo `event_id` (G1 + matriz §8). Pixel e CAPI compartilham o
          // event_id e o Meta fica com UMA das duas versões: divergir aqui não gera erro nenhum,
          // só faz metade dos Leads chegar sem segmentação, de forma não-determinística.
          // `atrativos` é constante porque é o único vertical que emite `Lead` no RF (G4).
          ...taxonomyParams({
            vertical: VERTICALS.atrativos,
            partner_slug: input.agencySlug,
            content_ids: input.contentIds,
          }),
          property: TRACKING_PROPERTY,
        },
      },
    ],
    // Presente só em teste → roteia para a aba "Testar eventos" do Events Manager.
    ...(CAPI_TEST_CODE ? { test_event_code: CAPI_TEST_CODE } : {}),
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${CAPI_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    // ⚠️ Loga em PRODUÇÃO também — o gate de `development` que existia aqui tornava a falha mais
    // cara do sistema invisível: token vencido ou revogado devolve 4xx, e sem log nada denuncia.
    // Os leads continuam gravando no Neon e notificando no Telegram normalmente; só param de chegar
    // ao Meta. O sintoma só apareceria semanas depois, no painel, como campanha sem conversão —
    // longe demais da causa. Uma linha no log da Vercel troca isso por um erro que aparece na hora.
    //
    // 🚫 NUNCA logar a URL nem o objeto do request: o `access_token` viaja na query string
    // (`?access_token=…`). O que sai aqui é só o status e o CORPO da resposta de erro do Meta, que
    // não devolve o token. Continua sem `throw` — o envio ao Meta jamais bloqueia a resposta ao
    // visitante nem o roteamento do lead.
    if (!res.ok) {
      console.error("CAPI lead error:", res.status, await res.text());
    }
  } catch (err) {
    // Exceção de rede/DNS é tão silenciosa quanto o 4xx — mesmo motivo, mesmo tratamento.
    console.error("CAPI lead exception:", err);
  }
}
