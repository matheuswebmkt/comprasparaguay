// Filepath: components/obrigado/ObrigadoContent.tsx
// Client: lê o handoff do lead (sessionStorage) e a query (?tipo= / ?lead_enviado=1) para
// montar a tela de confirmação. Copy mínima do foco Compras PY — produto único de roteiro
// de compras em Ciudad del Este.

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight, Home } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { OBRIGADO_UI } from "@/lib/i18n/obrigado";
import { LEAD_HANDOFF_KEY } from "@/lib/lead-success-handoff";
import { internalUrl } from "@/lib/utm";

export default function ObrigadoContent() {
  const { locale } = useLocale();
  const t = OBRIGADO_UI[locale];
  const params = useSearchParams();

  // Handoff em sessionStorage, se existir (o resumo é só metadados do pedido — sem PII).
  let resumo: string | null = null;
  if (typeof window !== "undefined") {
    try {
      const raw = window.sessionStorage.getItem(LEAD_HANDOFF_KEY);
      if (raw) {
        const h = JSON.parse(raw) as { resumo?: string | null };
        if (h?.resumo) resumo = h.resumo;
      }
    } catch {
      resumo = null;
    }
  }

  void params; // usada para manter a rota dinâmica com useSearchParams (Suspense na página)

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

        {resumo && (
          <div
            className="mt-6 rounded-2xl border bg-white p-5 text-left"
            style={{ borderColor: "hsl(214,25%,90%)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "hsl(210,25%,55%)" }}>
              {t.resumoLabel}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "hsl(210,25%,35%)" }}>
              {resumo}
            </p>
          </div>
        )}

        <p className="mt-6 text-sm" style={{ color: "hsl(210,25%,45%)" }}>
          {t.footer}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
          <Link
            href={internalUrl("/roteiros-de-compras/compras-paraguai-ciudad-del-este", "obrigado")}
            className="group inline-flex items-center gap-2 rounded-3xl px-8 py-4 text-lg font-bold text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
            style={{
              background:
                "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)",
            }}
          >
            {t.ctaCompras}
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
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