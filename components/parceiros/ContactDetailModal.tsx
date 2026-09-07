// Filepath: components/parceiros/ContactDetailModal.tsx
// Version: 1.0
// Nome da Versão: "Mini modal de contato — exibe APENAS o ContactSidebar (sem o modal gigante de detalhe)"
//
// Escuta `contact-detail:open` (ver lib/contact-detail.ts). Resolve o perfil pelo kind (agency →
// getAgencyBySlug, partner → getPartnerBySlug) e renderiza SÓ o
// ContactSidebar — o bloco de contato que antes vivia dentro do modal de detalhe gigante.
// z-[210] — mesmo nível dos demais modais. Fecha por ✕, ESC ou clique no fundo.

"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SHARED_UI } from "@/lib/i18n/shared";
import ContactSidebar from "@/components/parceiros/ContactSidebar";
import { getAgencyBySlug } from "@/app/data/agencies";
import { getPartnerBySlug, getCategoryMeta } from "@/app/data/partners";
import { CONTACT_DETAIL_EVENT, type ContactKind } from "@/lib/contact-detail";
import { trackConversion, CONVERSIONS } from "@/lib/analytics";
import {
  asNiche,
  NICHE_KEYS,
  taxonomyParams,
  VERTICALS,
  verticalOfPartnerCategory,
  type TaxonomyParams,
} from "@/lib/tracking-taxonomy";

export default function ContactDetailModal() {
  const { locale } = useLocale();
  const t = SHARED_UI[locale].contactSidebar;
  const [open, setOpen] = useState<{ kind: ContactKind; slug: string } | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ kind: ContactKind; slug: string }>).detail;
      if (detail?.kind && detail?.slug) setOpen({ kind: detail.kind, slug: detail.slug });
    };
    window.addEventListener(CONTACT_DETAIL_EVENT, handler);
    return () => window.removeEventListener(CONTACT_DETAIL_EVENT, handler);
  }, []);

  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

  // `ViewContent` do recomendado (matriz §1.5). Parceiro, agência e hotel NÃO têm rota própria — são
  // card em página hub/de nicho e o clique abre este mini modal, então a ABERTURA é o único momento
  // em que o evento pode existir. Sem isto a escada `ViewContent → Contact` (matriz §3) do recomendado
  // fica só com o `Contact`: dá pra montar público de "foi falar com o negócio", mas
  // não de "viu o negócio" — e param não é retroativo (D5/D11).
  // 🚫 Sem `value`/`currency`: só o `Lead` os carrega (G3).
  const openKind = open?.kind;
  const openSlug = open?.slug;
  useEffect(() => {
    if (!openKind || !openSlug) return;
    // A taxonomia sai da MESMA resolução por kind que alimenta o `ContactSidebar` abaixo. Se cada
    // lado decidisse o vertical por conta própria, o `ViewContent` e o `Contact` do mesmo negócio
    // sairiam com dimensões diferentes e nada quebraria — só a segmentação passaria a mentir.
    // `slug` é o `partner_slug` nos três casos: aqui o produto É o negócio.
    let tax: TaxonomyParams | null = null;
    if (openKind === "agency") {
      // Agência entrega TRANSPORTE — o vertical é o produto (o deslocamento), não o tipo de
      // fornecedor. Mesma razão do D13, que renomeou a key para `transfer`.
      if (getAgencyBySlug(openSlug))
        tax = { vertical: VERTICALS.transporte, niche: NICHE_KEYS.transfer, partner_slug: openSlug };
    } else {
      const p = getPartnerBySlug(openSlug);
      // A ponte dado→enum: `Partner.niches` é `string[]` livre. Chave que o portfólio não conheça
      // devolve `undefined` e o param é OMITIDO (D8), nunca vaza string órfã pro pixel compartilhado.
      if (p)
        tax = {
          vertical: verticalOfPartnerCategory(p.category),
          niche: asNiche(p.niches?.[0]),
          partner_slug: p.slug,
        };
    }
    if (!tax) return;
    trackConversion(CONVERSIONS.viewContent, taxonomyParams(tax));
  }, [openKind, openSlug]);

  if (!open) return null;

  const { kind, slug } = open;

  // Resolve o perfil e monta o ContactSidebar — o MESMO bloco que vivia no modal gigante.
  // `name` alimenta o título do modal (nome do recomendado abaixo do eyebrow "Contato").
  let sidebar: React.ReactNode = null;
  let name = "";
  if (kind === "agency") {
    const agency = getAgencyBySlug(slug);
    if (agency) {
      name = agency.legalName ?? agency.name;
      sidebar = (
        <ContactSidebar
          name={agency.name}
          slug={agency.slug}
          logo={agency.logo}
          address={`${agency.city}/${agency.state}`}
          whatsapp={agency.whatsapp}
          whatsappMessage={agency.whatsappMessage}
          website={agency.website}
          instagram={agency.instagram}
          email={agency.email}
          accent="hsl(152, 47%, 32%)"
          campaign="agencias"
          // Agência entrega TRANSPORTE — o vertical é o produto (o deslocamento), não o tipo de
          // fornecedor. Mesma razão do D13, que renomeou a key para `transfer`.
          vertical={VERTICALS.transporte}
          niche={NICHE_KEYS.transfer}
        />
      );
    }
  } else {
    const partner = getPartnerBySlug(slug);
    if (partner) {
      const meta = getCategoryMeta(partner.category);
      name = partner.name;
      sidebar = (
        <ContactSidebar
          name={partner.name}
          slug={partner.slug}
          logo={partner.logo}
          address={[partner.address, partner.neighborhood, `${partner.city}/${partner.state}`].filter(Boolean).join(" · ")}
          whatsapp={partner.whatsapp}
          whatsappMessage={partner.whatsappMessage}
          website={partner.website}
          instagram={partner.instagram}
          phone={partner.phone}
          email={undefined}
          accent={meta.accent}
          campaign="parceiros"
          // Do DADO, nunca literal (G8): categoria → vertical, 1ª key de `niches` → niche. As duas
          // pontes omitem o que o portfólio não conhece (D8) em vez de vazar valor órfão.
          vertical={verticalOfPartnerCategory(partner.category)}
          niche={asNiche(partner.niches?.[0])}
        />
      );
    }
  }

  if (!sidebar) return null;

  return (
    <div
      className="fixed inset-0 z-[210] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={close}
    >
      <div className="absolute inset-0" style={{ background: "rgba(15,42,71,0.45)", backdropFilter: "blur(4px)" }} aria-hidden="true" />
      <div
        className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-tef-xl animate-in fade-in zoom-in-95 duration-200"
        style={{ background: "hsl(40,33%,97%)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Fechar"
          className="absolute top-3 right-3 z-10 p-2 rounded-full transition-colors hover:bg-black/10"
          style={{ background: "rgba(15,42,71,0.35)", backdropFilter: "blur(4px)" }}
        >
          <X className="h-5 w-5 text-white" aria-hidden="true" />
        </button>

        <p className="rf-eyebrow mb-2 pr-8 text-center">{t.title}</p>
        <h2 className="rf-title pr-8 text-center" style={{ marginTop: 0, fontSize: "clamp(1.125rem, 3vw, 1.375rem)" }}>
          {name}
        </h2>
        <div className="mt-5">{sidebar}</div>
      </div>
    </div>
  );
}
