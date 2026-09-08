// Filepath: app/api/leads/route.ts
// Version: 2.5
// Nome da Versão: "Guarda same-origin migrada pra lib/same-origin.ts (Sprint 10 — hostname exato)"
// Baseado na Versão: 2.3

import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { getSql } from "@/lib/db";
import { sendLeadToCapi } from "@/lib/meta-capi";
import { notifyNewLead, notifyLeadLog, notifyLeadInfoOnly, editLeadCard, editInfoOnlyCard } from "@/lib/telegram";
import {
  getOfferConfig, getAgencyChatId, getAgencyChatIdRaw,
  getAgencyInfoOnlyWhenNoPlan, getWaGreetingFor,
} from "@/lib/offer-settings";
import { itensKind } from "@/lib/offer-defaults";
import { getActiveAgencySlug } from "@/lib/agencies";
import { verifyTurnstile } from "@/lib/turnstile";
import { atrativoNomes, isRoteiroLead, productKindOf } from "@/lib/lead-card";
import { resolveLeadKind, ticketQtyFromPessoas } from "@/lib/roteiro-lead";
import { LEAD_DEDUP_WINDOW_MIN } from "@/lib/lead-dedup";
import { resumoCurto } from "@/lib/pedido-resumo";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n/config";
import { isSameOriginRequest } from "@/lib/same-origin";

// Antiabuso (jul/2026 — ver conventions): protege contra spam MANUAL (humano preenchendo o form repetidas
// vezes) — Turnstile/honeypot só barram bot. Duas camadas independentes:
//  1) RATE LIMIT: no máx. RATE_LIMIT_MAX envios por RATE_LIMIT_WINDOW_MIN minutos, por visitor_id OU por IP
//     (hash) — bloqueia em SILÊNCIO (204, sem gravar) igual ao honeypot; não avisa o abusador.
//     ⚠️⚠️ A contagem é SÓ de envio real (`abandoned = false`). RASCUNHO DE ABANDONO NÃO CONSOME O TETO:
//     ele não notifica ninguém, não vai ao CAPI nem ao Telegram — é dado interno. Contá-lo punia quem
//     NAVEGOU, não quem abusou, e o caso era comum: `session_id` mora no sessionStorage (é por ABA),
//     então abrir três produtos em abas novas e fechar os modais gerava três rascunhos; o envio de
//     verdade em seguida batia no teto e sumia em silêncio, com a tela de sucesso na cara do visitante.
//     (Dentro de UMA aba isso nunca acontecia: o draft reaproveita a linha da mesma sessão.)
//  2) DEDUP: mesmo WhatsApp normalizado usado num lead recente (LEAD_DEDUP_WINDOW_MIN, ver lib/lead-dedup.ts —
//     também lida do CLIENT em lib/known-lead.ts) → o lead novo AINDA é
//     gravado (cofre/CAPI seguem normais), só a notificação Telegram da agência é pulada — "grava mas não
//     incomoda ninguém".
const RATE_LIMIT_WINDOW_MIN = 15;
const RATE_LIMIT_MAX = 3;

const hashIp = (ip: string | null): string | null =>
  ip ? crypto.createHash("sha256").update(ip).digest("hex") : null;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX = 256;
const clip = (v: unknown, n = MAX): string | null =>
  typeof v === "string" && v.trim().length > 0 ? v.trim().slice(0, n) : null;
// Calendário (D5/D6): só aceita ISO YYYY-MM-DD válido — qualquer outra coisa vira null (nunca lança).
const clipDate = (v: unknown): string | null =>
  typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null;
// Quantas PESSOAS (D5): clamp 1–999 no servidor. ⚠️ O MESMO teto do `QuantityStepper` — se os dois
// divergirem, Pixel e CAPI mandam números diferentes para o mesmo `event_id` (G1).
const clipQty = (v: unknown): number | null => {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) ? Math.min(999, Math.max(1, Math.trunc(n))) : null;
};
// Slugs dos itens escolhidos (página do pedido) — csv, sem duplicata, na ordem de escolha. Vem PRONTO do
// client: as três origens (modal + extras, roteiro pronto/dias avulsos, cesta do wizard) sabem o que foi
// pedido; re-derivar aqui de `content_ids`/`item_slug` criaria uma segunda regra para o mesmo dado.
const clipSlugs = (v: unknown): string | null => {
  if (!Array.isArray(v)) return null;
  const out = [...new Set(v.filter((s): s is string => typeof s === "string" && s.trim().length > 0))]
    .slice(0, 50)
    .map((s) => s.trim().slice(0, 128));
  return out.length ? out.join(",") : null;
};
/** Token do link público do pedido (`/r/[token]`). 12 chars url-safe: curto no WhatsApp e não enumerável. */
const newPublicToken = (): string => crypto.randomBytes(9).toString("base64url");

export async function POST(req: NextRequest) {
  // Defesa: a requisição precisa vir do próprio site — fonte única em lib/same-origin.ts (hostname
  // EXATO; a versão antiga, duplicada em cada rota, aceitava domínio sósia via endsWith/includes).
  if (!isSameOriginRequest(req)) return new NextResponse(null, { status: 403 });
  // `referer` segue sendo lido (fora do guard) só como origem da página, pro CAPI/cofre.
  const referer = req.headers.get("referer");

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  // Honeypot: campo-armadilha invisível. Preenchido = bot → dropa em SILÊNCIO (204, como sucesso; não avisa o bot) sem gravar/rotear.
  if (typeof body.honeypot === "string" && body.honeypot.trim().length > 0) {
    return new NextResponse(null, { status: 204 });
  }

  const nome = clip(body.nome, 80);
  const whatsapp = clip(body.whatsapp);
  if (!nome || !whatsapp) return new NextResponse(null, { status: 400 });
  const visitorId = clip(body.visitorId, 64);
  const sessionId = clip(body.sessionId, 64);

  // IP — extraído cedo (rate limit + Turnstile + CAPI usam). Vira HASH antes de qualquer persistência (nunca o IP em claro).
  const clientIp =
    clip(req.headers.get("x-forwarded-for")?.split(",")[0], 64) ??
    clip(req.headers.get("x-real-ip"), 64);
  const ipHash = hashIp(clientIp);

  const sql = getSql();

  // 1) RATE LIMIT — no máx. RATE_LIMIT_MAX envios por RATE_LIMIT_WINDOW_MIN min, por visitor_id OU IP.
  // Bloqueia em SILÊNCIO (204) ANTES do Turnstile (poupa a chamada externa pra quem já estourou o limite).
  // Fail-open: se a query falhar (ex: coluna nova ainda sem migração), não bloqueia ninguém por engano.
  if (sql && (visitorId || ipHash)) {
    try {
      const recent = (await sql`
        select count(*)::int as n from leads
        where abandoned = false
          and created_at > now() - make_interval(mins => ${RATE_LIMIT_WINDOW_MIN})
          and ((visitor_id is not null and visitor_id = ${visitorId}) or (ip_hash is not null and ip_hash = ${ipHash}))
      `) as { n: number }[];
      if ((recent[0]?.n ?? 0) >= RATE_LIMIT_MAX) {
        return new NextResponse(null, { status: 204 });
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") console.error("leads rate-limit check error:", err);
    }
  }

  const email = clip(body.email, 160);
  const eventId = clip(body.eventId, 64);
  const lgpdConsent = body.lgpdConsent === false ? false : true;
  // Idioma escolhido no modal (i18n Fase 1) — só aceita pt|en|es; senão null.
  const locale = ["pt", "en", "es"].includes(body.locale as string) ? (body.locale as string) : null;

  // Qualificação (morador de Foz / já está em Foz).
  const asBoolOrNull = (v: unknown): boolean | null => (v === true ? true : v === false ? false : null);
  const isLocal = asBoolOrNull(body.isLocal);
  const alreadyInFoz = asBoolOrNull(body.alreadyInFoz);
  const agencyOfferChecked = body.agencyOfferChecked === true;

  // Config da oferta + DECISÃO da agência (governa atribuição E roteamento). Agência ATIVA = "Definir agência".
  // O ingresso "querido" (`agencyOfferChecked`) já vem efetivo do modal (sempre `true` — item fixo "Incluído").
  const offer = await getOfferConfig();
  const agencyActive = offer.agencyDefined;
  const sendAgency = agencyActive && agencyOfferChecked && (isLocal === false || offer.agencyAcceptLocals);
  // ⓘ `transportWanted` é computado mais abaixo, depois de `leadContextCol`/`itemSlugCol` — ele
  //   depende dos dois para reconhecer o transporte AUTOMÁTICO.
  // Agência ATIVA — dois usos DIFERENTES, não confundir:
  //  • `assignedPartner` = roteamento interno. Atribui o lead à agência SÓ quando ela realmente o
  //    recebe; senão o lead não é dela → null.
  //  • `activeAgencySlug` = `partner_slug` da taxonomia do pixel. É o ESPELHO do que o client manda
  //    no mesmo `Lead` (`offer.transportOffer.agencySlug`), independente de o lead ter sido roteado
  //    ou não — G1 exige que as duas pontas mandem o mesmo valor no mesmo `event_id`.
  const activeAgencySlug = await getActiveAgencySlug();
  const assignedPartner = clip(body.assignedPartner, 64) ?? (sendAgency ? activeAgencySlug : null);

  // Contexto de produto (Compras Paraguay) — lido AQUI (antes do dedup) porque `product_signature` precisa dele.
  // Reaproveitado mais abaixo no INSERT e na notificação Telegram (sem duplicar `clip()`).
  const roteiroSlugCol = clip(body.roteiroSlug, 80);
  const roteiroTituloCol = clip(body.roteiroTitulo, 160);
  const leadContextCol = clip(body.leadContext, 32);
  const roteiroResumoCol = clip(body.roteiroResumo, 2000);
  const itemSlugCol = clip(body.itemSlug, 128);

  // Transporte — SEMPRE incluído (fato do produto, conventions/tracking-metricas.md §11): o modal não
  // pergunta Sim/Não, manda `wantsTransport: true` incondicional, e o servidor espelha o corpo sem
  // gateway nenhum — não existe mais toggle de transporte (nem com agência, nem sem), e a coluna
  // registra o fato junto com pixel/CAPI/known-lead. Vai em COLUNA própria (`wants_transport`), fora
  // da trilha de texto. `=== true` preserva o contrato tri-state da coluna: ausência de campo não é
  // coagida a "recusou" (viraria null, não false), e `false` hoje só existe em linhas antigas.
  const transportWanted: boolean | null = body.wantsTransport === true ? true : null;

  // Calendário + quantidade (D5/D6) — lidos aqui pelo mesmo motivo: reaproveitados no INSERT e na
  // notificação Telegram (buildWaUrl/visitDateLine/ticketQtyLine).
  const visitDateCol = clipDate(body.visitDate);
  const ticketQtyCol = clipQty(body.ticketQty);
  // Página pública do pedido: os itens escolhidos + o token do link curto.
  const itemSlugsCol = clipSlugs(body.itemSlugs);
  const publicToken = newPublicToken();
  // Lidos aqui (e não só dentro do INSERT) porque o resumo de uma linha da notificação usa os dois.
  const roteiroDiasCol = clip(body.roteiroDias, 16);
  const roteiroPessoasCol = clip(body.roteiroPessoas, 16);
  // Assinatura estável do produto pedido — MESMA regra do client (`lib/known-lead.ts` `productSignature`,
  // que usa `context`/`ctaType` pra derivar; aqui confiamos no `leadContext` já resolvido e enviado pelo
  // modal). Usada no dedup granular por produto (abaixo) e gravada na coluna `product_signature`.
  // ⚠️ EXCEÇÃO — wizard (/montar-roteiro): o "produto" é sempre o mesmo, então a assinatura leva a
  // CESTA em ordem canônica. Sem isso, dois roteiros personalizados DIFERENTES da mesma pessoa
  // (< 45 min, card anterior pendente) colidiam no dedup e o 2º subescrevia o 1º (§12-ter reconcilia
  // reenvio do MESMO produto — e no wizard cada cesta é um pedido próprio, não um reenvio).
  const wizardBasket = itemSlugsCol
    ? clip(itemSlugsCol.split(",").map((s) => s.trim()).filter(Boolean).sort().join(","), 2000)
    : null;
  const productSignatureCol =
    leadContextCol === "atrativo"
      ? `atrativo:${itemSlugCol ?? "generic"}`
      : leadContextCol === "roteiro"
        ? roteiroSlugCol === "montar-roteiro"
          ? `roteiro:montar-roteiro:${wizardBasket ?? "generic"}`
          : `roteiro:${roteiroSlugCol ?? "personalizar"}`
        : "ingresso:generic";

  // Geo do Vercel (produção; null em dev).
  let city: string | null = null;
  try {
    const c = req.headers.get("x-vercel-ip-city");
    city = c ? decodeURIComponent(c).slice(0, 80) : null;
  } catch {
    city = clip(req.headers.get("x-vercel-ip-city"), 80);
  }
  const country = clip(req.headers.get("x-vercel-ip-country"), 8);

  // UA/cookies — qualidade de match do CAPI (clientIp já extraído no topo, pro rate limit).
  const userAgent = clip(req.headers.get("user-agent"), 512);
  const sourceUrl = clip(referer, 1024);
  const fbp = clip(req.cookies.get("_fbp")?.value, 256);
  const fbc = clip(req.cookies.get("_fbc")?.value, 256);

  // Anti-bot (Cloudflare Turnstile) — no-op sem TURNSTILE_SECRET_KEY. Bloqueia o bot ANTES de gravar/CAPI/Telegram.
  const humanOk = await verifyTurnstile(clip(body.turnstileToken, 2048), clientIp);
  if (!humanOk) return new NextResponse(null, { status: 403 });

  let leadId: number | null = null;

  // 2) DEDUP → RECONCILIAÇÃO (Sprint 6, decisão do usuário — porta a correção real do RG) — mesmo
  // WhatsApp normalizado + MESMO PRODUTO, num lead REAL recente (LEAD_DEDUP_WINDOW_MIN)? O lead AINDA é
  // gravado (cofre/CAPI seguem normais). O que muda é o Telegram: card anterior ainda PENDENTE →
  // REESCRITO com os dados do envio novo (`editLeadCard`/`editInfoOnlyCard`, abaixo) — um item só na
  // fila, sempre com a informação mais recente. Já assumido/confirmado → card NOVO (decisão do usuário;
  // não se reescreve o que já foi respondido).
  // ⚠️ `abandoned = false` é essencial (bug real já corrigido): um RASCUNHO de abandono
  // (`/api/leads/draft`) nunca gerou notificação nenhuma, então não pode "consumir" a checagem de duplicidade
  // da primeira submissão real da mesma pessoa — sem esse filtro, preencher/abandonar e depois completar de
  // verdade faria o envio real ser tratado como duplicata e a notificação nunca sairia.
  // ⚠️ `is_local`/`already_in_foz` SAÍRAM do match (Sprint 6 — mesma correção do RG): antes, uma pessoa
  // reenviando o MESMO produto com uma resposta de qualificação DIFERENTE (ex.: "já está em Foz?" mudou)
  // não contava como duplicata — caía fora do dedup inteiro, sem gerar reconciliação nem pular notificação.
  // Agora esse reenvio conta como duplicata E é reconciliado (o card é reescrito com a qualificação nova).
  // `product_signature` continua no match: produto DIFERENTE é contexto novo pra agência, não repetição.
  type PriorLead = {
    id: number; telegram_message_id: number | null; claimed_by: string | null;
    created_at: string; assigned_partner: string | null;
  };
  let priorLead: PriorLead | null = null;
  if (sql) {
    try {
      const dup = (await sql`
        select id, telegram_message_id, claimed_by, created_at, assigned_partner from leads
        where abandoned = false
          and created_at > now() - make_interval(mins => ${LEAD_DEDUP_WINDOW_MIN})
          and regexp_replace(whatsapp, '\\D', '', 'g') = regexp_replace(${whatsapp}, '\\D', '', 'g')
          and product_signature is not distinct from ${productSignatureCol}
          and superseded_by is null
        order by created_at desc
        limit 1
      `) as PriorLead[];
      priorLead = dup[0] ?? null;
    } catch (err) {
      if (process.env.NODE_ENV === "development") console.error("leads dedup check error:", err);
    }
  }
  const isDuplicateRecent = priorLead !== null;

  // Persiste no Neon (no-op silencioso se DB não configurado).
  if (sql) {
    try {
      await sql`
        create table if not exists leads (
          id               bigserial primary key,
          nome             text,
          email            text,
          whatsapp         text not null,
          cta_type         text,
          assigned_partner text,
          lgpd_consent     boolean default true,
          page_path        text,
          session_id       text,
          visitor_id       text,
          utm_source       text,
          utm_medium       text,
          utm_campaign     text,
          utm_content      text,
          utm_term         text,
          country          text,
          city             text,
          referrer         text,
          user_agent       text,
          event_id         text,
          telegram_message_id bigint,
          claimed_by          text,
          claimed_by_id       bigint,
          claimed_at          timestamptz,
          created_at       timestamptz default now()
        )
      `;
      // Colunas de contexto de roteiro (idempotente em deploys antigos).
      await sql`alter table leads add column if not exists roteiro_slug text`;
      await sql`alter table leads add column if not exists roteiro_titulo text`;
      await sql`alter table leads add column if not exists lead_context text`;
      await sql`alter table leads add column if not exists roteiro_resumo text`;
      // Campos estruturados do wizard /montar-roteiro (MR-9).
      await sql`alter table leads add column if not exists roteiro_dias text`;
      await sql`alter table leads add column if not exists roteiro_pessoas text`;
      await sql`alter table leads add column if not exists roteiro_orcamento text`;
      await sql`alter table leads add column if not exists roteiro_perfil text`;
      await sql`alter table leads add column if not exists roteiro_gastro text`;
      await sql`alter table leads add column if not exists roteiro_hotel text`;
      await sql`alter table leads add column if not exists roteiro_transfer text`;
      await sql`alter table leads add column if not exists roteiro_vivencia text`;
      // Calendário (dia da visita/início) + quantidade de ingressos (D5/D6).
      await sql`alter table leads add column if not exists visit_date date`;
      await sql`alter table leads add column if not exists ticket_qty int`;
      // Persistência de lead + funil consolidado (jul/2026, idempotente em deploys antigos).
      await sql`alter table leads add column if not exists abandoned boolean not null default false`;
      await sql`alter table leads add column if not exists cta_shown boolean`;
      await sql`alter table leads add column if not exists cta_clicked boolean`;
      await sql`alter table leads add column if not exists success_cta_type text`;
      await sql`alter table leads add column if not exists product_signature text`;
      // Reconciliação "um cliente, um card" (Sprint 6) — ver db/schema.sql.
      await sql`alter table leads add column if not exists superseded_by bigint`;
      // Página pública do pedido (/r/[token]) — ver db/schema.sql.
      await sql`alter table leads add column if not exists public_token text`;
      await sql`alter table leads add column if not exists item_slugs text`;
      await sql`create unique index if not exists leads_public_token_idx on leads (public_token)`;
      // Rascunho de abandono (/api/leads/draft) pode salvar só com nome — relaxa o NOT NULL herdado (idempotente).
      await sql`alter table leads alter column whatsapp drop not null`;

      const roteiroOrcamentoCol = clip(body.roteiroOrcamento, 24);
      const roteiroPerfilCol = Array.isArray(body.roteiroPerfil)
        ? body.roteiroPerfil
            .filter((s): s is string => typeof s === "string")
            .map((s) => s.slice(0, 24))
            .slice(0, 10)
            .join(",") || null
        : null;
      const roteiroGastroCol = clip(body.roteiroGastro, 16);
      const roteiroHotelCol = clip(body.roteiroHotel, 16);
      const roteiroTransferCol = clip(body.roteiroTransfer, 16);
      // "Como quer viver Foz" (multi-escolha do 1º passo) em coluna própria: a página do pedido precisa
      // dela estruturada, e antes ela existia só dentro do texto do `roteiro_resumo`.
      const roteiroVivenciaCol = Array.isArray(body.roteiroVivencia)
        ? body.roteiroVivencia
            .filter((s): s is string => typeof s === "string")
            .map((s) => s.slice(0, 24))
            .slice(0, 10)
            .join(",") || null
        : null;

      const inserted = await sql`
        insert into leads (
          nome, email, whatsapp, cta_type, assigned_partner, lgpd_consent,
          page_path, session_id, visitor_id,
          utm_source, utm_medium, utm_campaign, utm_content, utm_term,
          country, city, referrer, user_agent, event_id,
          is_local, already_in_foz, modal_id, wants_transport, locale, ip_hash,
          roteiro_slug, roteiro_titulo, lead_context, roteiro_resumo,
          roteiro_dias, roteiro_pessoas, roteiro_orcamento, roteiro_perfil, roteiro_gastro, roteiro_hotel, roteiro_transfer, roteiro_vivencia,
          visit_date, ticket_qty,
          abandoned, product_signature, public_token, item_slugs
        ) values (
          ${nome}, ${email}, ${whatsapp}, ${clip(body.ctaType, 64)}, ${assignedPartner}, ${lgpdConsent},
          ${clip(body.pagePath)}, ${sessionId}, ${visitorId},
          ${clip(body.utmSource)}, ${clip(body.utmMedium)}, ${clip(body.utmCampaign)},
          ${clip(body.utmContent)}, ${clip(body.utmTerm)},
          ${country}, ${city}, ${sourceUrl}, ${userAgent}, ${eventId},
          ${isLocal}, ${alreadyInFoz}, ${clip(body.modalId, 64)}, ${transportWanted}, ${locale}, ${ipHash},
          ${roteiroSlugCol}, ${roteiroTituloCol}, ${leadContextCol}, ${roteiroResumoCol},
          ${roteiroDiasCol}, ${roteiroPessoasCol}, ${roteiroOrcamentoCol}, ${roteiroPerfilCol}, ${roteiroGastroCol}, ${roteiroHotelCol}, ${roteiroTransferCol}, ${roteiroVivenciaCol},
          ${visitDateCol}, ${ticketQtyCol},
          ${false}, ${productSignatureCol}, ${publicToken}, ${itemSlugsCol}
        )
        returning id
      `;
      leadId = (inserted as { id: number }[])[0]?.id ?? null;
      // Envio de verdade concluído — o(s) rascunho(s) de abandono desta sessão deixaram de fazer sentido (a
      // pessoa voltou e completou; ver conventions/funil-modal.md §17 §2-bis). Limpa pra não inflar "abandonado"
      // à toa nem confundir uma futura leitura de `known-lead`/dedup.
      if (leadId && sessionId) {
        try {
          await sql`delete from leads where abandoned = true and session_id = ${sessionId}`;
        } catch (err) {
          if (process.env.NODE_ENV === "development") console.error("leads draft cleanup error:", err);
        }
      }
    } catch (err) {
      // ⚠️ Log SEM guarda de ambiente, ao contrário dos demais desta rota (que são ruído de dev). Esta é
      // a única falha que perde um lead REAL sem ninguém perceber: a resposta é 204 e o modal mostra
      // sucesso — de propósito, ver conventions/funil-modal.md §16 —, então o visitante vai embora
      // achando que enviou e espera um contato que nunca vem. Sem este log, um Neon fora do ar é
      // invisível nas duas pontas. É observabilidade de servidor: não revela nada a quem ataca.
      console.error("leads insert error:", err);
      return new NextResponse(null, { status: 204 });
    }
  }

  // CAPI server-side (à prova de AdBlock/iOS). Mesmo event_id do Pixel → Meta deduplica.
  // No-op se faltar META_CAPI_TOKEN; nunca bloqueia a resposta ao usuário.
  if (eventId) {
    await sendLeadToCapi({
      eventId,
      email,
      phone: whatsapp,
      clientIp,
      userAgent,
      fbp,
      fbc,
      sourceUrl,
      partner: assignedPartner,
      // Taxonomia — espelho EXATO do Pixel no mesmo `event_id` (G1). `itemSlugCol` é o MESMO campo
      // que o client usou para montar o `item_slug` do evento, então as duas pontas não têm como
      // divergir por derivação.
      itemSlug: itemSlugCol,
      // `content_ids` — espelho do Pixel. Chega pronto do client (é ele quem sabe o bundle daquele
      // clique: roteiro pronto, dias avulsos ou cesta do wizard). Saneado a strings curtas e com
      // teto, porque vem do corpo da requisição.
      contentIds: Array.isArray(body.contentIds)
        ? body.contentIds
            .filter((s: unknown): s is string => typeof s === "string" && s.length > 0)
            .slice(0, 50)
            .map((s: string) => s.slice(0, 128))
        : null,
      agencySlug: activeAgencySlug,
      // EMQ — já estavam em escopo, só não iam adiante.
      visitorId,
      city,
      country,
      // Sinais do `value`, RECALCULADO aqui (G6 — o servidor nunca aceita valor pronto do cliente).
      // `leadKind` sai da MESMA função que o client usou, alimentada pelo MESMO `leadContext` que ele
      // postou — nada é re-derivado por caminho paralelo (G1).
      leadKind: resolveLeadKind(leadContextCol),
      isLocal,
      alreadyInFoz,
      // ⚠️ O valor POSTADO, não a coluna `transportWanted` — e a razão sobrevive mesmo agora que a
      // coluna passou a reconhecer o transporte automático. A coluna é TRI-STATE e pode ser `null`
      // ("não foi perguntado"); o param do pixel é booleano. Ler a coluna exigiria coagir `null` para
      // algum booleano AQUI, criando uma segunda regra de conversão que o client não tem — e é assim
      // que as duas pontas voltam a divergir. O client é a fonte do que ele mandou ao Pixel; o CAPI
      // apenas espelha (G1).
      wantsTransport: body.wantsTransport === true,
      locale,
      // Modal manda quantidade exata (`ticketQty`); o wizard manda a FAIXA de pessoas — que é a
      // mesma coisa (5 pessoas = 5 ingressos), convertida pelo piso da faixa. A conversão sai da
      // mesma função pura que o client usou, a partir do mesmo campo postado (G1).
      ticketQty: ticketQtyCol ?? ticketQtyFromPessoas(clip(body.roteiroPessoas, 16)),
    });
  }

  // Telegram Mini-CRM — grupo da AGÊNCIA. Só com lead persistido. No-op sem token/chat_id.
  // Nunca bloqueia a resposta (mas `await` — não-dangling na Vercel).
  if (leadId && sql) {
    // Contexto do produto Compras Paraguay: tag Telegram a partir do CTA de roteiro. Reaproveita as consts já
    // computadas mais acima (pro dedup/product_signature) — evita re-clipar o mesmo body 2x. Fica FORA
    // do `if (sendAgency...)` de propósito: o modo SÓ INFO (abaixo) também precisa desta tag.
    const roteiroSlug = roteiroSlugCol;
    const roteiroTitulo = roteiroTituloCol;
    const leadContext = leadContextCol;
    const ctaType = clip(body.ctaType, 64);
    const productCtx = { leadContext, roteiroSlug, roteiroTitulo, ctaType };
    const isRoteiroLeadFlag = isRoteiroLead(productCtx);

    const noticeBase = {
      leadId,
      nome,
      isLocal,
      alreadyInFoz,
      wantsTransport: transportWanted,
      locale,
      roteiroTitulo,
      roteiroSlug,
      // Rótulo da linha do assunto no card (`🎫 Ingressos` vs `🗺️ Roteiro:`). Sai da MESMA derivação
      // que escolhe a saudação do wa.me (`productKindOf`) — lib/telegram.ts é puro e não deriva
      // contexto de lead, senão haveria uma segunda regra para o mesmo dado.
      productKind: productKindOf(productCtx),
      // O card leva os NOMES (itemNames) e o wa.me leva o resumo + a lista "Para: …". O token segue
      // gravado (legado de /r/[token], página removida).
      pedidoToken: leadId ? publicToken : null,
      // Ingressos, reservas de data ou os dois (§17-ter): o rótulo do link no wa.me acompanha.
      itens: itensKind((itemSlugsCol ?? "").split(",").filter(Boolean)),
      // Nomes legíveis do pedido: a linha do card logo abaixo do assunto E a lista "Para: …" do wa.me
      // saem da MESMA fonte (`atrativoNomes`, lib/lead-card.ts) — nunca divergem entre si.
      itemNames: atrativoNomes((itemSlugsCol ?? "").split(",").filter(Boolean)),
      resumo: resumoCurto(
        {
          kind: productKindOf(productCtx),
          itemCount: (itemSlugsCol ?? "").split(",").filter(Boolean).length,
          wizardDias: roteiroDiasCol,
          visitDate: visitDateCol,
          pessoas: ticketQtyCol ?? roteiroPessoasCol,
          wantsTransport: transportWanted,
        },
        isLocale(locale) ? locale : DEFAULT_LOCALE,
        "agencia",
      ),
      visitDate: visitDateCol,
      ticketQty: ticketQtyCol,
    };

    // Card do envio anterior ainda PENDENTE na fila (ninguém assumiu)? Só nesse estado ele pode ser
    // reescrito — já assumido/confirmado cai no ramo "card novo" abaixo (reescrever algo já respondido
    // apagaria o "✅ Assumido por X" e o botão do dono).
    const pendingMessageId =
      priorLead && !priorLead.claimed_by && priorLead.telegram_message_id ? priorLead.telegram_message_id : null;

    let messageId: number | null = null;
    // Usa a decisão `sendAgency` já computada acima (agência ativa + ingresso querido + turista OU
    // aceitar morador local). Inativa/ingresso não-querido → não roteia (self-serve).
    if (sendAgency) {
      const agencyChat = await getAgencyChatId();
      // Item A: sucesso = botão central "Iniciar conversa" → exige Confirmar antes de liberar o WhatsApp.
      // Roteiro/personalizar e atrativo têm modos de sucesso independentes (ver lib/offer-defaults.ts).
      const confirmFlow = (isRoteiroLeadFlag ? offer.roteiroSuccessMode : offer.atrativoSuccessMode) === "whatsapp";
      const passive = offer.botMessageMode === "passive";

      if (priorLead && pendingMessageId) {
        // RECONCILIAÇÃO — reescreve o card que já está no grupo com os dados deste envio.
        const edited = await editLeadCard(
          {
            ...noticeBase,
            whatsapp,
            passive,
            confirmFlow,
            // Saudação com a voz corrente (portal × agência) — remonta o botão de atendimento do card
            // passivo a cada reconciliação.
            greetingTemplate: await getWaGreetingFor(productKindOf(productCtx), isLocale(locale) ? locale : DEFAULT_LOCALE),
            sentAt: new Date(priorLead.created_at),
          },
          agencyChat,
          pendingMessageId,
        );
        // ⚠️ NUNCA cair em notifyNewLead/notifyLeadLog quando `edited` for false (ver editLeadCard):
        // reenvio idêntico gera texto idêntico, o Telegram responde "message is not modified" e o card
        // CERTO já está no grupo — um fallback aqui recriaria a duplicata que isto existe pra evitar.
        if (edited) {
          try {
            // O card passa a pertencer ao lead NOVO (o botão já aponta pra ele).
            await sql`update leads set telegram_message_id = ${pendingMessageId} where id = ${leadId}`;
            // Cadeia SEMPRE PLANA (nunca A→B→C): quem resolver `superseded_by` depois precisa de UM salto só.
            await sql`
              update leads set telegram_message_id = null, superseded_by = ${leadId}
              where id = ${priorLead.id} or superseded_by = ${priorLead.id}
            `;
          } catch (err) {
            if (process.env.NODE_ENV === "development") console.error("leads reconcile error:", err);
          }
        }
      } else {
        messageId = passive
          ? await notifyLeadLog({
              ...noticeBase,
              whatsapp,
              confirmFlow,
              // O card passivo (sem "Iniciar conversa" no site) carrega o botão de atendimento — e o
              // wa.me dele sai da MESMA fonte de voz do webhook (portal × agência, `getWaGreetingFor`).
              greetingTemplate: await getWaGreetingFor(productKindOf(productCtx), isLocale(locale) ? locale : DEFAULT_LOCALE),
            }, agencyChat)
          : await notifyNewLead(noticeBase, agencyChat);
      }
    } else if (!agencyActive) {
      // Sem agência com plano vigente → modo SÓ INFO, se e SOMENTE SE o admin deixou o toggle ligado.
      // ⛔ Nada de ligar sozinho aqui: o valor que estava definido no momento da queda é a autoridade,
      // nos dois sentidos (um "Não" pré-queda continua sendo "Não"). Ver lib/offer-settings.ts.
      if (await getAgencyInfoOnlyWhenNoPlan()) {
        const infoChat = await getAgencyChatIdRaw();
        if (infoChat) {
          // O card sem agência leva o CTA de conversa liberado (ver `infoOnlyKeyboard` em lib/telegram.ts):
          // é o dono quem atende nesse período, então precisa do WhatsApp e da saudação do PRODUTO.
          const infoNotice = {
            ...noticeBase,
            whatsapp,
            // Mesma fonte de voz do webhook (portal × agência) — neste ramo não há agência ativa, então
            // resolve na voz do portal; se o plano voltar no meio, o próximo envio já sai na voz dela.
            greetingTemplate: await getWaGreetingFor(
              productKindOf(productCtx),
              isLocale(locale) ? locale : DEFAULT_LOCALE,
            ),
          };
          // Card anterior REESCREVÍVEL = existe, ninguém assumiu, e é um card SÓ INFO. Proxy exato (não
          // há coluna `info_only`): `assigned_partner is null && telegram_message_id is not null` — um
          // card de lead REAL (roteado quando o plano ainda valia) fica de fora de propósito, senão um
          // reenvio sem plano reescreveria com o layout informativo um card real, apagando o estado dele.
          const priorInfoCard =
            priorLead && pendingMessageId && !priorLead.assigned_partner ? pendingMessageId : null;

          if (priorLead && priorInfoCard) {
            // ⚠️ `infoNotice`, NUNCA `noticeBase`: o teclado deste card é remontado a cada edição a
            // partir de `whatsapp` + `greetingTemplate` (`infoOnlyKeyboard`), e `editMessageText` sem
            // `reply_markup` REMOVE o botão. Com o objeto errado, a reconciliação devolvia um card sem
            // o [📲 Iniciar conversa] — que aqui é o ÚNICO canal de atendimento (§12-bis).
            const edited = await editInfoOnlyCard(infoChat, priorInfoCard, {
              ...infoNotice,
              sentAt: new Date(priorLead.created_at),
              updated: true,
            });
            // ⚠️ Sem fallback quando `edited` for false — mesma regra do editLeadCard.
            if (edited) {
              try {
                await sql`update leads set telegram_message_id = ${priorInfoCard} where id = ${leadId}`;
                await sql`
                  update leads set telegram_message_id = null, superseded_by = ${leadId}
                  where id = ${priorLead.id} or superseded_by = ${priorLead.id}
                `;
              } catch (err) {
                if (process.env.NODE_ENV === "development") console.error("leads info-only reconcile error:", err);
              }
            }
          } else {
            // Sem card anterior reescrevível (1º envio, ou o anterior é card de lead real/assumido):
            // card informativo NOVO — mesmo desfecho do "já assumido → card novo" do caminho com agência.
            messageId = await notifyLeadInfoOnly(infoNotice, infoChat);
          }
        }
      }
    }
    if (messageId) {
      try {
        await sql`update leads set telegram_message_id = ${messageId} where id = ${leadId}`;
      } catch (err) {
        if (process.env.NODE_ENV === "development") console.error("leads tg msg id error:", err);
      }
    }
  }

  // Fallback pro LEAD (não só pra agência): quando o dedup pulou a notificação (mesmo WhatsApp, envio recente),
  // o front mostra um aviso elegante + o botão de falar com a agência AGORA (mesmo que a tela de sucesso
  // configurada seja "só mensagem") — o lead pode estar tentando corrigir/completar algo, e silenciar
  // completamente pareceria que o envio falhou. `sendAgency` garante que só avisamos quando o lead REALMENTE
  // seria roteado pra agência (senão a mensagem "estamos com sua solicitação" não faria sentido).
  // `pedidoToken` segue gravado como identificador do pedido (a página /r/[token] e o link no wa.me foram removidos).
  // Só existe quando o lead foi realmente gravado — sem banco não há pedido a mostrar, e o client
  // simplesmente omite o link em vez de oferecer uma página que responderia 404.
  return NextResponse.json(
    { duplicate: sendAgency && isDuplicateRecent, pedidoToken: leadId ? publicToken : null },
    { status: 200 },
  );
}
