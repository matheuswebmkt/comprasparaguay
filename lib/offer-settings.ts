// Filepath: lib/offer-settings.ts
// Version: 4.3
// Nome da Versão: "config de transporte extinta — transporte sempre incluído, sem toggle (§11); transportOffer só carrega agencySlug"
//
// Chaves independentes em app_settings (conventions §2/§12): captura + modal + bot + TEXTOS (agora por locale).
// Tipos/defaults ficam em lib/offer-defaults.ts (client-safe). Aqui só o acesso ao banco.
// Migração de leitura dos modos antigos (offer_mode/cta_mode) preservada.

import { unstable_cache } from "next/cache";
import { getSql } from "./db";
import { getAttractionCatalog } from "./attraction-catalog";
import { LOCALES, type Locale } from "./i18n/config";
import { officialAgencyName, getAgencyBySlug } from "@/app/data/agencies";
import {
  DEFAULT_OFFER,
  DEFAULT_TEXTS,
  DEFAULT_PRODUCT_COPIES,
  PRODUCT_COPY_KINDS,
  PRODUCT_COPY_FIELDS,
  productCopyKey,
  TEXT_KEYS,
  textKeyFor,
  PARTNER_ACTION_KEYS,
  type ModalTexts,
  type LocalizedTexts,
  type TransportOffer,
  type OfferConfig,
  type ProductCopies,
  type ProductCopyKind,
  type ProductLeadCopy,
} from "./offer-defaults";
import { getActiveAgencySlug } from "./agencies";

/** Tag de revalidação da config assada no HTML estático (invalidada ao salvar no admin). */
export const OFFER_CONFIG_TAG = "offer-config";

export type { OfferConfig, ModalTexts, ModalSuccessMode, RoteiroSuccessMode, BotMessageMode, TransportOffer } from "./offer-defaults";

/** Entrada extra do save (não faz parte do OfferConfig client — roteamento server-only). */
export type SaveOfferInput = {
  roteiroSuccessMode?: "close" | "whatsapp";
  atrativoSuccessMode?: "close" | "whatsapp";
  modalWhatsapp?: string;
  botMessageMode?: "assume" | "passive";
  texts?: Partial<Record<Locale, Partial<ModalTexts>>>;
  /** Textos por produto (ingresso / roteiro / personalizar). */
  productCopies?: Partial<
    Record<ProductCopyKind, Partial<Record<Locale, Partial<ProductLeadCopy>>>>
  >;
  agencyAcceptLocals?: boolean;
  agencyDefined?: boolean;
  agencyChatId?: string;
  agencyGroupNotifyEnabled?: boolean;
  agencyGreeting?: Partial<Record<Locale, string>>;
  /** Modo SÓ INFO: registra o lead no grupo (sem botão/WhatsApp) quando não há agência com plano vigente. */
  agencyInfoOnlyNoPlan?: boolean;
};

// Nome da agência oficial de produto (SSOT: app/data/agencies.ts) — default de successClose legado.
const DEFAULT_AGENCY = officialAgencyName();

const K = {
  // `modal_success_mode` (legado, único) foi split em dois — roteiro/personalizar não têm "site oficial"
  // próprio (produto nosso), então nunca podem usar "direct" (ver lib/offer-defaults.ts RoteiroSuccessMode).
  modalModeRoteiro: "modal_success_mode_roteiro",
  modalModeAtrativo: "modal_success_mode_atrativo",
  waNumber: "modal_whatsapp_number",
  botMode: "bot_message_mode",
  agency: "partner_agency_name", // legado: só compõe o DEFAULT de successClose (pt)
} as const;

type Sql = NonNullable<ReturnType<typeof getSql>>;

async function ensureTable(sql: Sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS app_settings (
      key        TEXT        PRIMARY KEY,
      value      TEXT        NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

async function upsert(sql: Sql, key: string, value: string) {
  await sql`
    INSERT INTO app_settings (key, value, updated_at)
    VALUES (${key}, ${value}, NOW())
    ON CONFLICT (key) DO UPDATE SET value = ${value}, updated_at = NOW()
  `;
}

type LegacyPreset = Partial<Pick<OfferConfig, "roteiroSuccessMode" | "atrativoSuccessMode" | "botMessageMode">>;
function legacyPreset(mode: string | undefined): LegacyPreset {
  const m = mode === "modal" ? "queue" : mode;
  // Legado "direct" (captura desligada, sem modal) não tem mais equivalente global — "link direto" só
  // existe por atrativo específico (seção 7, com URL própria). Cai em "close" (mensagem) nos dois lados.
  if (m === "direct") return { atrativoSuccessMode: "close", roteiroSuccessMode: "close" };
  if (m === "queue") return { roteiroSuccessMode: "close", atrativoSuccessMode: "close", botMessageMode: "assume" };
  if (m === "central") return { roteiroSuccessMode: "whatsapp", atrativoSuccessMode: "whatsapp", botMessageMode: "passive" };
  return {};
}

const asBool = (v: string | undefined) => (v === "true" ? true : v === "false" ? false : undefined);
const asStr = (v: string | undefined) => { const t = (v ?? "").trim(); return t.length ? t : null; };

/**
 * Versão CACHEADA (Data Cache + tag). Usada no root layout p/ ASSAR a config no HTML estático
 * → o CTA/modal nascem com a config certa, sem fetch no client, sem delay. Mantém as páginas
 * estáticas (o valor faz parte do build/ISR). `revalidateTag(OFFER_CONFIG_TAG)` (ao salvar no
 * admin) regenera o HTML com o novo valor em segundos, sem redeploy. Ver conventions §2.
 */
export const getOfferConfigCached = unstable_cache(
  () => getOfferConfig(),
  ["offer-config"],
  { tags: [OFFER_CONFIG_TAG] },
);

/** Config completa (componível + textos, todos os 3 idiomas). Sem DB → padrão seguro. Nunca lança. */
export async function getOfferConfig(): Promise<OfferConfig> {
  const sql = getSql();
  if (!sql) return { ...DEFAULT_OFFER };
  try {
    await ensureTable(sql);
    const rows = (await sql`SELECT key, value FROM app_settings`) as { key: string; value: string }[];
    const m = new Map(rows.map((r) => [r.key, r.value]));
    const preset = legacyPreset(m.get("offer_mode") ?? m.get("cta_mode"));

    // Default da mensagem de sucesso "close" (pt) respeita a agência legada (se houver).
    const legacyAgency = asStr(m.get(K.agency)) ?? DEFAULT_AGENCY;
    const defaultClosePt = `Para garantir seu atendimento VIP, a ${legacyAgency}, nossa agência oficial parceira, vai te chamar no WhatsApp em até 5 minutos para liberar suas vantagens!`;

    const texts = {} as LocalizedTexts;
    LOCALES.forEach((locale) => {
      const localeTexts = {} as ModalTexts;
      (Object.keys(TEXT_KEYS) as (keyof ModalTexts)[]).forEach((field) => {
        const stored = asStr(m.get(textKeyFor(field, locale)));
        const fallback = locale === "pt" && field === "successClose" ? defaultClosePt : DEFAULT_TEXTS[locale][field];
        localeTexts[field] = stored ?? fallback;
      });
      texts[locale] = localeTexts;
    });

    // Textos por produto Compras Paraguay (ingresso / plano / personalizar)
    // `as` amplo aqui porque `ProductCopies` é assimétrico (atrativo tem 2 campos a mais) e o loop é
    // genérico nos 3 kinds — o shape correto de cada um é garantido por `DEFAULT_PRODUCT_COPIES` logo
    // abaixo, que já vem tipado.
    const productCopies = {} as ProductCopies;
    const copiesByKind = productCopies as unknown as Record<
      ProductCopyKind,
      Record<Locale, ProductLeadCopy>
    >;
    for (const kind of PRODUCT_COPY_KINDS) {
      copiesByKind[kind] = {} as Record<Locale, ProductLeadCopy>;
      for (const locale of LOCALES) {
        const def = DEFAULT_PRODUCT_COPIES[kind][locale];
        const row = { ...def } as ProductLeadCopy;
        // Desde a v3.0 de `offer-defaults.ts` o produto atrativo não tem campo a mais: o modo
        // "Link direto" (e seus 2 textos) saiu. Uma lista de campos só.
        const fields = PRODUCT_COPY_FIELDS;
        for (const field of fields) {
          const stored = asStr(m.get(productCopyKey(kind, field, locale)));
          if (stored !== null && stored !== undefined && stored.length > 0) {
            (row as unknown as Record<string, string | undefined>)[field] = stored;
          }
        }
        copiesByKind[kind][locale] = row;
      }
    }

    const agencyAcceptLocals = asBool(m.get(PARTNER_ACTION_KEYS.agencyAcceptLocals)) ?? DEFAULT_OFFER.agencyAcceptLocals;
    // Plano manual: sem agência ATIVA em /admin/dashboard/agencia → "Definir agência" e transporte ficam off no modal.
    const activeAgencySlug = await getActiveAgencySlug();
    const agencyPlanActive = Boolean(activeAgencySlug);
    const agencyDefinedStored = asBool(m.get(PARTNER_ACTION_KEYS.agencyDefined)) ?? DEFAULT_OFFER.agencyDefined;
    const agencyDefined = agencyPlanActive && agencyDefinedStored;

    // Transporte é SEMPRE incluído — fato do produto, não configuração (conventions/tracking-metricas.md
    // §11): o modal não pergunta Sim/Não e não existe toggle de transporte no admin. O que sobrou aqui é
    // só o `agencySlug`, identificador de atribuição do pixel.
    const transportOffer: TransportOffer = {
      // CLIENT-SAFE e sem fallback para o catálogo oficial: `partner_slug` só faz sentido quando há
      // uma agência REAL com plano ativo. Sem ela o valor é `null` e o param sai do payload (D8),
      // em vez de virar um slug que não corresponde a ninguém recebendo lead.
      agencySlug: activeAgencySlug ?? null,
    };

    const attractionCatalog = getAttractionCatalog();

    return {
      roteiroSuccessMode: m.get(K.modalModeRoteiro) === "whatsapp" ? "whatsapp"
        : m.get(K.modalModeRoteiro) === "close" ? "close"
        : preset.roteiroSuccessMode ?? DEFAULT_OFFER.roteiroSuccessMode,
      atrativoSuccessMode: m.get(K.modalModeAtrativo) === "whatsapp" ? "whatsapp"
        : m.get(K.modalModeAtrativo) === "close" ? "close"
        : preset.atrativoSuccessMode ?? DEFAULT_OFFER.atrativoSuccessMode,
      modalWhatsapp: asStr(m.get(K.waNumber)),
      botMessageMode: m.get(K.botMode) === "passive" ? "passive"
        : m.get(K.botMode) === "assume" ? "assume"
        : preset.botMessageMode ?? DEFAULT_OFFER.botMessageMode,
      texts,
      productCopies,
      agencyAcceptLocals,
      agencyDefined,
      transportOffer,
      attractionCatalog,
    };
  } catch {
    return { ...DEFAULT_OFFER };
  }
}

/**
 * SERVER-ONLY (roteamento §15): a agência aceita lead de MORADOR local? (default false = só turista).
 * NÃO entra no OfferConfig client — o `/api/leads` lê direto. Sem DB → false.
 */
export async function getAgencyAcceptLocals(): Promise<boolean> {
  const sql = getSql();
  if (!sql) return false;
  try {
    await ensureTable(sql);
    const rows = (await sql`SELECT value FROM app_settings WHERE key = ${PARTNER_ACTION_KEYS.agencyAcceptLocals}`) as { value: string }[];
    return rows[0]?.value === "true";
  } catch {
    return false;
  }
}

/** Busca o `agency_chat_id` BRUTO salvo (ou migra o legado 1×) — sem aplicar o toggle de envio. Uso interno. */
async function fetchAgencyChatIdRaw(sql: Sql): Promise<string | null> {
  const rows = (await sql`SELECT value FROM app_settings WHERE key = ${PARTNER_ACTION_KEYS.agencyChatId}`) as { value: string }[];
  if (rows.length) {
    const v = (rows[0]?.value ?? "").trim();
    return v.length ? v : null; // admin definiu (ou limpou de propósito) → respeita
  }
  // Migração 1×: importa o TELEGRAM_CHAT_ID legado para o admin (fica editável no painel; env nunca mais é lido).
  const legacy = (process.env.TELEGRAM_CHAT_ID ?? "").trim();
  if (legacy) {
    await upsert(sql, PARTNER_ACTION_KEYS.agencyChatId, legacy.slice(0, 40));
    return legacy;
  }
  return null;
}

/**
 * SERVER-ONLY: valor BRUTO do `agency_chat_id` salvo no admin, IGNORANDO o toggle de envio — só pra
 * EXIBIR/editar o campo no painel (o admin precisa continuar vendo/editando o id mesmo com o envio
 * desligado). Para saber se o grupo será REALMENTE notificado, usar `getAgencyChatId()`. Sem DB → null.
 */
export async function getAgencyChatIdRaw(): Promise<string | null> {
  const sql = getSql();
  if (!sql) return null;
  try {
    await ensureTable(sql);
    return await fetchAgencyChatIdRaw(sql);
  } catch {
    return null;
  }
}

/**
 * SERVER-ONLY (roteamento §15): chat_id EFETIVO do grupo da agência — GERENCIADO 100% NO ADMIN
 * (`agency_chat_id`). NÃO entra no OfferConfig client. Sem DB → null.
 * ⚠️ Respeita `getAgencyGroupNotifyEnabled()` — desligado, retorna `null` MESMO com um chat_id salvo
 * (o admin quer manter o id guardado mas suspender o envio: controle de spam, teste A/B "só CTA" vs "grupo").
 * Usar `getAgencyChatIdRaw()` (acima) quando o objetivo for só EXIBIR o valor salvo (ex: admin).
 */
export async function getAgencyChatId(): Promise<string | null> {
  const sql = getSql();
  if (!sql) return null;
  try {
    await ensureTable(sql);
    const chatId = await fetchAgencyChatIdRaw(sql);
    if (!chatId) return null;
    return (await getAgencyGroupNotifyEnabled()) ? chatId : null;
  } catch {
    return null;
  }
}

/**
 * SERVER-ONLY: liga/desliga o ENVIO ao grupo da agência (admin: "Enviar lead ao grupo" Sim/Não), SEM apagar o
 * `agency_chat_id` salvo — diferente de esvaziar o campo (que perderia o id). Default `true` (preserva o
 * comportamento anterior: quem já tinha um chat_id salvo continua recebendo, a menos que desligue explicitamente).
 */
export async function getAgencyGroupNotifyEnabled(): Promise<boolean> {
  const sql = getSql();
  if (!sql) return true;
  try {
    await ensureTable(sql);
    const rows = (await sql`SELECT value FROM app_settings WHERE key = ${PARTNER_ACTION_KEYS.agencyGroupNotifyEnabled}`) as { value: string }[];
    return rows.length ? rows[0].value === "true" : true;
  } catch {
    return true;
  }
}

/**
 * SERVER-ONLY (admin): toggle "Registrar leads no grupo (sem WhatsApp/botão)" — vale só no cenário SEM
 * agência com plano vigente. Ligado, o lead recebido sem agência ativa ainda gera um card informativo
 * no grupo (sem botão "Assumir", sem link de WhatsApp) em vez de simplesmente não notificar ninguém.
 * Default `false` (opt-in).
 */
export async function getAgencyInfoOnlyWhenNoPlan(): Promise<boolean> {
  const sql = getSql();
  if (!sql) return false;
  try {
    await ensureTable(sql);
    const rows = (await sql`SELECT value FROM app_settings WHERE key = ${PARTNER_ACTION_KEYS.agencyInfoOnlyNoPlan}`) as { value: string }[];
    return rows[0]?.value === "true";
  } catch {
    return false;
  }
}

// ⛔ NÃO reintroduzir "auto-arm" (ligar o modo SÓ INFO sozinho na queda da agência). Existiu aqui e foi
// REMOVIDO por decisão do usuário: o valor que o admin deixou no toggle é a autoridade única, nos DOIS
// sentidos. O auto-arm só sabia fazer uma coisa — sobrescrever um "Não" por "Sim" no momento da queda —,
// porque com o toggle já em "Sim" o envio acontece lendo a chave direto (ver o ramo sem agência em
// app/api/leads/route.ts). Ou seja: sua única função era desrespeitar a definição do admin.
// ⚠️ Ele também não tinha como distinguir "o admin desligou de propósito" de "ninguém nunca mexeu": as
// duas coisas são `false` na mesma chave. Qualquer tentativa futura de ressuscitar isso esbarra nesse
// mesmo muro — o preço de acertar o esquecimento é ignorar a escolha deliberada.
// Consequência aceita e conhecida: com o toggle em "Não", um plano que vença em SILÊNCIO faz os leads
// não gerarem card nenhum no Telegram até alguém perceber. O aviso disso vive no próprio admin, ao lado
// do toggle (ver components/admin/OfferModeControl.tsx).

/**
 * SERVER-ONLY (TG-4): saudação pronta do wa.me disparado no Telegram ("Abrir WhatsApp do cliente" /
 * "Iniciar conversa"), no idioma do LEAD (`leads.locale`) — não de quem está no grupo.
 * ⚠️ Vem de "3b · Textos por produto" (`productCopies[kind][locale].waGreeting`), NÃO de uma chave
 * global: a abertura de quem pediu ingresso de atrativo é diferente da de quem pediu roteiro sob
 * medida. A chave global antiga (`agency_greeting`) dizia "ingressos ou roteiro" justamente por não
 * saber qual era, e ficava presa à seção Agência — mas a mensagem vale COM ou SEM agência definida.
 * Sem valor salvo → default do produto. NÃO entra no OfferConfig client.
 *
 * `field` escolhe a VOZ: `waGreeting` (portal, padrão) ou `waGreetingAgency` (agência ativa — ver
 * `getAgencyVoiceName`). O caller decide qual voz usar lendo o estado atual da agência.
 */
export async function getProductWaGreeting(
  kind: ProductCopyKind,
  locale: Locale,
  field: "waGreeting" | "waGreetingAgency" = "waGreeting",
): Promise<string> {
  const fallback = DEFAULT_PRODUCT_COPIES[kind][locale][field];
  const sql = getSql();
  if (!sql) return fallback;
  try {
    await ensureTable(sql);
    const rows = (await sql`SELECT value FROM app_settings WHERE key = ${productCopyKey(kind, field, locale)}`) as { value: string }[];
    const v = (rows[0]?.value ?? "").trim();
    return v.length ? v : fallback;
  } catch {
    return fallback;
  }
}

/**
 * SERVER-ONLY: NOME da agência que FALA no wa.me — ativo só quando existem as DUAS condições que
 * definem "agência definida/ativa": "Definir agência" ligado E plano vigente (a mesma condição
 * efetiva de `getOfferConfig().agencyDefined`; o slug já sai plan-gated de `getActiveAgencySlug`).
 * `null` = quem atende é o PORTAL (sem agência, plano vencido ou desativada): o wa.me abre em nome do
 * Compras Paraguay (`waGreeting`), nunca em nome de agência. O webhook usa isto pra escolher a voz da
 * saudação — o lead precisa saber quem está falando, pois o atendente muda.
 */
export async function getAgencyVoiceName(): Promise<string | null> {
  const sql = getSql();
  if (!sql) return null;
  try {
    await ensureTable(sql);
    const rows = (await sql`SELECT value FROM app_settings WHERE key = ${PARTNER_ACTION_KEYS.agencyDefined}`) as { value: string }[];
    if (rows[0]?.value !== "true") return null;
    const slug = await getActiveAgencySlug();
    if (!slug) return null;
    return getAgencyBySlug(slug)?.name ?? null;
  } catch {
    return null;
  }
}

/**
 * SERVER-ONLY: saudação pronta do wa.me com a VOZ resolvida (portal × agência) — fonte ÚNICA da
 * decisão para TODOS os montadores (webhook `greetingFor` e o card passivo em `/api/leads`):
 *   • agência definida + plano vigente → `waGreetingAgency`, com `{agencia}` já substituído pelo nome
 *     da agência ativa;
 *   • sem agência ativa → `waGreeting`, em nome do portal.
 * O estado é lido NO MOMENTO da chamada — quem embute o resultado em botão/card guarda a voz daquele
 * instante; os caminhos de clique re-resolvem no ato.
 */
export async function getWaGreetingFor(kind: ProductCopyKind, locale: Locale): Promise<string> {
  const agencia = await getAgencyVoiceName(); // null = portal fala; string = agência ativa fala
  if (agencia) {
    // `{agencia}` é pré-preenchido AQUI (e não no buildWaUrl): o template viaja dentro das mensagens do
    // Telegram (card/botão/DM) e não há motivo para os tipos intermediários carregarem o nome.
    const tpl = await getProductWaGreeting(kind, locale, "waGreetingAgency");
    return tpl.replace(/\{agencia\}/gi, agencia);
  }
  return getProductWaGreeting(kind, locale, "waGreeting");
}

/**
 * Desliga no app_settings a oferta de agência no modal (ao Desativar em /admin/dashboard/agencia).
 * Mantém textos/chat_id/saudação — só o plano (Definir agência). Transporte não se neutraliza:
 * é sempre incluído, independentemente de agência (§11).
 */
export async function neutralizeAgencyOfferInSettings(): Promise<void> {
  const sql = getSql();
  if (!sql) return;
  await ensureTable(sql);
  await upsert(sql, PARTNER_ACTION_KEYS.agencyDefined, "false");
}

/** Persiste os campos enviados (admin). Lança sem DB. Devolve a config resultante. */
export async function saveOfferConfig(p: SaveOfferInput): Promise<OfferConfig> {
  const sql = getSql();
  if (!sql) throw new Error("DB not configured");
  await ensureTable(sql);

  // Plano manual: não permite ligar agência no editor sem entidade ativa no admin.
  const activeAgency = await getActiveAgencySlug();
  const agencyPlanActive = Boolean(activeAgency);

  if (p.agencyDefined === true && !agencyPlanActive) p.agencyDefined = false;

  const ops: Promise<unknown>[] = [];
  if (p.roteiroSuccessMode !== undefined)
    ops.push(upsert(sql, K.modalModeRoteiro, p.roteiroSuccessMode === "whatsapp" ? "whatsapp" : "close"));
  if (p.atrativoSuccessMode !== undefined)
    ops.push(upsert(sql, K.modalModeAtrativo, p.atrativoSuccessMode === "whatsapp" ? "whatsapp" : "close"));
  if (p.modalWhatsapp !== undefined) ops.push(upsert(sql, K.waNumber, (p.modalWhatsapp ?? "").trim().slice(0, 40)));
  if (p.botMessageMode !== undefined)
    ops.push(upsert(sql, K.botMode, p.botMessageMode === "passive" ? "passive" : "assume"));

  if (p.agencyAcceptLocals !== undefined)
    ops.push(upsert(sql, PARTNER_ACTION_KEYS.agencyAcceptLocals, p.agencyAcceptLocals ? "true" : "false"));
  if (p.agencyDefined !== undefined)
    ops.push(upsert(sql, PARTNER_ACTION_KEYS.agencyDefined, p.agencyDefined ? "true" : "false"));
  // Idem: independente de agencyDefined — vale só sem agência com plano vigente.
  if (p.agencyInfoOnlyNoPlan !== undefined)
    ops.push(upsert(sql, PARTNER_ACTION_KEYS.agencyInfoOnlyNoPlan, p.agencyInfoOnlyNoPlan ? "true" : "false"));
  if (p.agencyChatId !== undefined)
    ops.push(upsert(sql, PARTNER_ACTION_KEYS.agencyChatId, (p.agencyChatId ?? "").trim().slice(0, 40)));
  if (p.agencyGroupNotifyEnabled !== undefined)
    ops.push(upsert(sql, PARTNER_ACTION_KEYS.agencyGroupNotifyEnabled, p.agencyGroupNotifyEnabled ? "true" : "false"));

  // ═══════════════════════════════════════════════════════════════════════════════════════════════
  // ⛔ GRAVAÇÃO DE TEXTO DESLIGADA (ago/2026) — os textos do modal vivem SÓ em `lib/offer-defaults.ts`.
  //
  // Decisão do dono do produto: o editor tinha virado dezenas de campos de texto × 3 idiomas, e manter
  // isso custava mais atenção do que valia. O que se edita no admin agora é COMPORTAMENTO (modo de
  // sucesso, agência, Telegram, link por atrativo); texto é código.
  //
  // ⚠️ Isto NÃO é redundante com ter comentado a UI no admin. Sem desligar aqui também, qualquer save
  // de OUTRA seção regravaria os textos a partir do rascunho do editor — congelando no `app_settings` os
  // valores do dia em que você salvou. Depois disso, mexer no texto em `offer-defaults.ts` não mudaria
  // nada no site (a leitura prefere o valor gravado), e o bug seria invisível: o admin mostraria o
  // comportamento certo e o site mostraria a copy velha.
  //
  // ↩️ Para reativar: descomente os dois blocos abaixo, descomente os blocos "3", "3b" e os campos de
  // texto do transporte em `components/admin/OfferModeControl.tsx`, e volte a mandar `texts`/
  // `productCopies` no payload de `buildPayload`. A LEITURA continua intacta em
  // `getOfferConfig` — chave que existir no banco ainda vence o default —, então nada mais precisa mudar.
  //
  // if (p.texts) {
  //   LOCALES.forEach((locale) => {
  //     const localeTexts = p.texts![locale];
  //     if (!localeTexts) return;
  //     (Object.keys(TEXT_KEYS) as (keyof ModalTexts)[]).forEach((field) => {
  //       const v = localeTexts[field];
  //       if (typeof v === "string") ops.push(upsert(sql, textKeyFor(field, locale), v.slice(0, 600)));
  //     });
  //   });
  // }
  //
  // if (p.productCopies) {
  //   for (const kind of PRODUCT_COPY_KINDS) {
  //     const byLocale = p.productCopies[kind];
  //     if (!byLocale) continue;
  //     for (const locale of LOCALES) {
  //       const block = byLocale[locale];
  //       if (!block) continue;
  //       // Mesma assimetria da leitura: só atrativo grava os 2 campos do modo "Link direto".
  //       const fields =
  //         kind === "atrativo"
  //           ? [...PRODUCT_COPY_FIELDS, ...ATRATIVO_ONLY_COPY_FIELDS]
  //           : PRODUCT_COPY_FIELDS;
  //       for (const field of fields) {
  //         const v = (block as Record<string, unknown>)[field];
  //         if (typeof v === "string") {
  //           const fallback = (DEFAULT_PRODUCT_COPIES[kind][locale] as unknown as Record<string, string>)[field] ?? "";
  //           ops.push(upsert(sql, productCopyKey(kind, field, locale), (v.trim() || fallback).slice(0, 800)));
  //         }
  //       }
  //     }
  //   }
  // }
  // ═══════════════════════════════════════════════════════════════════════════════════════════════

  await Promise.all(ops);
  return getOfferConfig();
}
