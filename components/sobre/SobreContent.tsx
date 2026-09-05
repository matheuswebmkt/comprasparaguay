// Filepath: components/sobre/SobreContent.tsx
// Version: 1.0
// Nome da Versão: "Conteúdo visível de /sobre (client, i18n pt/en/es)"
//
// Metadata/JSON-LD continuam em pt no page.tsx (SEO canônico); o conteúdo vem de
// lib/i18n/paginas.ts (SOBRE_UI).

"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SOBRE_UI } from "@/lib/i18n/paginas";

const TITLE = { color: "hsl(210,60%,15%)" };
const BODY = { color: "hsl(210,25%,35%)" };

export default function SobreContent() {
  const { locale } = useLocale();
  const t = SOBRE_UI[locale];

  return (
    <main style={{ background: "hsl(40,33%,97%)" }}>
      <section
        className="relative overflow-hidden pt-16"
        style={{ background: "hsl(40,33%,97%)" }}
      >
        <div
          className="rf-grain pointer-events-none absolute inset-0 opacity-[0.055]"
          style={{ mixBlendMode: "multiply" }}
          aria-hidden="true"
        />
        <div className="section-container relative z-10 pt-20 sm:pt-24 pb-12 sm:pb-14">
          <div className="rf-head" style={{ marginBottom: 0 }}>
            <p className="rf-eyebrow">{t.eyebrow}</p>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "clamp(2.7rem, 5.1vw, 4.9rem)",
                lineHeight: 0.98,
                letterSpacing: "-0.034em",
                color: "hsl(210,60%,15%)",
                textWrap: "balance",
              }}
            >
              {t.h1}
            </h1>
            <p className="rf-sub">
              <strong>{t.lead}</strong>
            </p>
            <p className="rf-sub">{t.intro}</p>
          </div>
        </div>
      </section>

      <section className="rf-section" style={{ background: "hsl(0,0%,100%)" }}>
        <div className="section-container">
          <div className="mx-auto max-w-3xl space-y-10">
            {t.sections.map((s) => (
              <div key={s.title}>
                <h2
                  className="mb-3 text-xl font-semibold"
                  style={{ ...TITLE, fontFamily: "var(--font-display)" }}
                >
                  {s.title}
                </h2>
                <div className="text-base leading-relaxed" style={BODY}>
                  {s.paragraphs.map((p) => (
                    <p key={p} className="mb-3 last:mb-0">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            <div className="pt-4">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 hover:gap-2.5"
                style={{ color: "hsl(210,56%,23%)" }}
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {t.backLink}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
