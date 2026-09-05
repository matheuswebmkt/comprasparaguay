// Filepath: app/api/admin/offer-config/route.ts
// POST protegido (admin): salva a config COMPONÍVEL do fluxo de lead (rascunho → Salvar).
// i18n Fase 3: texts/transportOffer.texts/modalWhatsappText vêm por locale
// ({ pt: {...}, en: {...}, es: {...} }). Devolve a config atualizada.

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { saveOfferConfig, OFFER_CONFIG_TAG, type SaveOfferInput } from "@/lib/offer-settings";
import {
  TEXT_KEYS,
  PRODUCT_COPY_KINDS,
  PRODUCT_COPY_FIELDS,
  type ModalTexts,
  type TransportOfferTexts,
  type ProductCopyKind,
  type ProductLeadCopy,
} from "@/lib/offer-defaults";
import { LOCALES, type Locale } from "@/lib/i18n/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const secret = process.env.AUTH_SECRET;
  if (!token || !secret) return false;
  return (await verifySessionToken(token, secret)) !== null;
}

const strOrUndef = (v: unknown): string | undefined => (typeof v === "string" ? v : undefined);

export async function POST(req: Request) {
  if (!(await isAdmin())) return new NextResponse(null, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const patch: SaveOfferInput = {};
  if (body.roteiroSuccessMode === "close" || body.roteiroSuccessMode === "whatsapp")
    patch.roteiroSuccessMode = body.roteiroSuccessMode;
  if (body.atrativoSuccessMode === "close" || body.atrativoSuccessMode === "whatsapp")
    patch.atrativoSuccessMode = body.atrativoSuccessMode;
  if (typeof body.modalWhatsapp === "string") patch.modalWhatsapp = body.modalWhatsapp;
  if (body.botMessageMode === "assume" || body.botMessageMode === "passive")
    patch.botMessageMode = body.botMessageMode;

  if (typeof body.agencyDefined === "boolean") patch.agencyDefined = body.agencyDefined;
  if (typeof body.agencyAcceptLocals === "boolean") patch.agencyAcceptLocals = body.agencyAcceptLocals;
  if (typeof body.agencyChatId === "string") patch.agencyChatId = body.agencyChatId;
  if (typeof body.agencyGroupNotifyEnabled === "boolean") patch.agencyGroupNotifyEnabled = body.agencyGroupNotifyEnabled;
  if (body.agencyGreeting && typeof body.agencyGreeting === "object") {
    const src = body.agencyGreeting as Record<string, unknown>;
    const out: Partial<Record<Locale, string>> = {};
    LOCALES.forEach((locale) => { const v = strOrUndef(src[locale]); if (v !== undefined) out[locale] = v; });
    if (Object.keys(out).length) patch.agencyGreeting = out;
  }
  if (body.transportOffer && typeof body.transportOffer === "object") {
    const tObj = body.transportOffer as Record<string, unknown>;
    const texts: Partial<Record<Locale, Partial<TransportOfferTexts>>> = {};
    if (tObj.texts && typeof tObj.texts === "object") {
      const src = tObj.texts as Record<string, unknown>;
      LOCALES.forEach((locale) => {
        if (!src[locale] || typeof src[locale] !== "object") return;
        const t = src[locale] as Record<string, unknown>;
        texts[locale] = { title: strOrUndef(t.title), desc: strOrUndef(t.desc) };
      });
    }
    patch.transportOffer = {
      enabled: tObj.enabled === true,
      texts,
    };
  }
  if (typeof body.transportNoAgencyEnabled === "boolean") patch.transportNoAgencyEnabled = body.transportNoAgencyEnabled;
  if (typeof body.agencyInfoOnlyNoPlan === "boolean") patch.agencyInfoOnlyNoPlan = body.agencyInfoOnlyNoPlan;

  // ⚠️ O parsing de `texts`/`productCopies` abaixo continua aqui, mas está INERTE desde ago/2026: o
  // admin não manda mais esses campos e `saveOfferConfig` não os grava (blocos ⛔ lá). Mantido de
  // propósito — é o que faz reativar a edição ser só descomentar, sem reescrever validação.
  // Textos do modal: aceita só chaves conhecidas, por locale, só strings.
  if (body.texts && typeof body.texts === "object") {
    const src = body.texts as Record<string, unknown>;
    const texts: Partial<Record<Locale, Partial<ModalTexts>>> = {};
    LOCALES.forEach((locale) => {
      if (!src[locale] || typeof src[locale] !== "object") return;
      const localeSrc = src[locale] as Record<string, unknown>;
      const localeTexts: Partial<ModalTexts> = {};
      (Object.keys(TEXT_KEYS) as (keyof ModalTexts)[]).forEach((field) => {
        if (typeof localeSrc[field] === "string") localeTexts[field] = localeSrc[field] as string;
      });
      if (Object.keys(localeTexts).length) texts[locale] = localeTexts;
    });
    if (Object.keys(texts).length) patch.texts = texts;
  }

  // Textos por produto (ingresso / roteiro / personalizar)
  if (body.productCopies && typeof body.productCopies === "object") {
    const src = body.productCopies as Record<string, unknown>;
    const out: SaveOfferInput["productCopies"] = {};
    for (const kind of PRODUCT_COPY_KINDS) {
      if (!src[kind] || typeof src[kind] !== "object") continue;
      const byLoc = src[kind] as Record<string, unknown>;
      const kindOut: Partial<Record<Locale, Partial<ProductLeadCopy>>> = {};
      LOCALES.forEach((locale) => {
        if (!byLoc[locale] || typeof byLoc[locale] !== "object") return;
        const t = byLoc[locale] as Record<string, unknown>;
        const block: Partial<ProductLeadCopy> = {};
        for (const field of PRODUCT_COPY_FIELDS) {
          if (typeof t[field] === "string") block[field] = t[field] as string;
        }
        if (Object.keys(block).length) kindOut[locale] = block;
      });
      if (Object.keys(kindOut).length) out[kind as ProductCopyKind] = kindOut;
    }
    if (Object.keys(out).length) patch.productCopies = out;
  }

  try {
    const config = await saveOfferConfig(patch);
    revalidateTag(OFFER_CONFIG_TAG); // regenera o HTML estático com o novo valor (propaga em segundos)
    return NextResponse.json(config);
  } catch {
    return new NextResponse(null, { status: 500 });
  }
}
