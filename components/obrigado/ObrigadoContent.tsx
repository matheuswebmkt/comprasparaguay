// Filepath: components/obrigado/ObrigadoContent.tsx
// Client: lê o handoff do lead (sessionStorage) e a query (?tipo= / ?lead_enviado=1) para
// montar a tela de confirmação. Copy mínima do foco Compras PY — produto único de roteiro
// de compras em Ciudad del Este.
//
// CTA "Iniciar conversa": a tela de sucesso DENTRO do modal só roda em preview/dedup — o submit
// real redireciona pra cá. O botão de WhatsApp do final do funil vive AQUI, renderizado quando o
// handoff trouxer `waUrl` (o modal só grava quando o modo de sucesso é "Iniciar conversa" — ou no
// fallback de dedup — e há número central). Eventos: `success`/`success_cta_shown` na exibição
// (1× por aba, gate `shownFired`) e `success_cta` + conversões Meta/Google no clique — o MESMO
// par que o modal dispararia (CTAClick `modal_central_whatsapp` + `Contact`).

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Home } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { OBRIGADO_UI } from "@/lib/i18n/obrigado";
import { LEAD_HANDOFF_KEY, type LeadSuccessHandoff } from "@/lib/lead-success-handoff";
import { listaPedidos } from "@/lib/pedido-resumo";
import { modalTrack } from "@/lib/modal-track";
import { trackConversion, CONVERSIONS } from "@/lib/analytics";
import { taxonomyParams, VERTICALS } from "@/lib/tracking-taxonomy";

export default function ObrigadoContent() {
  const { locale } = useLocale();
  const t = OBRIGADO_UI[locale];
  const params = useSearchParams();

  // Handoff em sessionStorage, se existir (o resumo é só metadados do pedido — sem PII). Lido em
  // effect (não no render) pra casar com os disparos de evento logo abaixo.
  const [handoff, setHandoff] = useState<LeadSuccessHandoff | null>(null);
  const firedRef = useRef(false); // dedupe inclusive contra o double-invoke de effects (dev)

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(LEAD_HANDOFF_KEY);
      if (raw) setHandoff(JSON.parse(raw) as LeadSuccessHandoff);
    } catch {
      // noop — sem handoff a página mostra o fallback genérico
    }
  }, []);

  // Funil 1st-party: chegou no sucesso (+ cta exibido, quando há botão) — 1× por aba. O modal não
  // dispara estes passos no submit real (a tela de sucesso interna dele só roda em preview/dedup),
  // então a página de obrigado é a fonte dos passos `success*` do funil.
  useEffect(() => {
    if (!handoff?.modalId || firedRef.current || handoff.shownFired) return;
    firedRef.current = true;
    const itemSlug = handoff.detail?.itemSlug ?? null;
    modalTrack("success", { modalId: handoff.modalId, itemSlug });
    if (handoff.waUrl) {
      modalTrack("success_cta_shown", {
        modalId: handoff.modalId,
        itemSlug,
        ctaType: "modal_central_whatsapp",
      });
    }
    try {
      // Persiste a marcação: o F5 reexibe o pedido sem re-disparar os eventos.
      window.sessionStorage.setItem(
        LEAD_HANDOFF_KEY,
        JSON.stringify({ ...handoff, shownFired: true }),
      );
    } catch {
      // noop
    }
  }, [handoff]);

  // Clique no CTA: mesmo par de conversões do modal (`handleCentralClick`) — CTAClick com cta_type
  // (telemetria de UI) + Contact (degrau de funil, D6), taxonomia reconstruída do handoff.
  const handleWaClick = () => {
    if (!handoff?.modalId) return;
    const itemSlug = handoff.detail?.itemSlug ?? null;
    modalTrack("success_cta", {
      modalId: handoff.modalId,
      itemSlug,
      ctaType: "modal_central_whatsapp",
    });
    const tax = taxonomyParams({
      vertical: VERTICALS.atrativos,
      item_slug: itemSlug,
      partner_slug: handoff.partnerSlug ?? null,
    });
    trackConversion(CONVERSIONS.ctaClick, { cta_type: "modal_central_whatsapp", ...tax });
    trackConversion(CONVERSIONS.contact, tax);
  };

  void params; // usada para manter a rota dinâmica com useSearchParams (Suspense na página)

  const lista = listaPedidos(handoff?.nomes ?? [], locale);

  return (
    <section
      className="relative flex min-h-[calc(100svh-64px)] flex-col items-center justify-center px-4 py-16"
      style={{ background: "hsl(40,33%,97%)" }}
    >
      <div
        className="rf-grain pointer-events-none absolute inset-0 opacity-[0.055]"
        style={{ mixBlendMode: "multiply" }}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: "hsl(152,40%,93%)" }}>
          <CheckCircle2 className="h-9 w-9" style={{ color: "hsl(152,47%,28%)" }} aria-hidden="true" />
        </div>

        <p className="rf-eyebrow mb-3">{t.eyebrow}</p>
        <h1
          className="rf-title"
          style={{
            marginTop: 0,
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "clamp(1.875rem, 3.6vw, 2.75rem)",
            lineHeight: 1.08,
            letterSpacing: "-0.025em",
            color: "hsl(210,60%,15%)",
            textWrap: "pretty",
          }}
        >
          {t.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed" style={{ color: "hsl(210,25%,38%)" }}>
          {t.subtitle}
        </p>

        {handoff?.resumo && (
          <div
            className="mt-6 rounded-2xl border bg-white p-5 text-left"
            style={{ borderColor: "hsl(214,25%,90%)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "hsl(210,25%,55%)" }}>
              {t.resumoLabel}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "hsl(210,25%,35%)" }}>
              {handoff.resumo}
            </p>
            {/* A MESMA lista "Incluído: …" que a mensagem de WhatsApp leva — uma fonte, três superfícies
                (card do Telegram, wa.me e aqui). */}
            {lista && (
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "hsl(210,25%,35%)" }}>
                {lista}
              </p>
            )}
          </div>
        )}

        {handoff?.waUrl && (
          <a
            href={handoff.waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWaClick}
            className="mt-6 inline-flex items-center justify-center gap-2 w-full rounded-2xl py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background:
                "linear-gradient(135deg, hsl(152,47%,32%) 0%, hsl(152,50%,26%) 100%)",
            }}
          >
            {t.ctaWhats}
          </a>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold underline decoration-1 underline-offset-4"
            style={{ color: "hsl(152,47%,30%)", textDecorationColor: "hsla(152,40%,60%,0.5)" }}
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            {t.ctaHome}
          </Link>
        </div>
      </div>
    </section>
  );
}
