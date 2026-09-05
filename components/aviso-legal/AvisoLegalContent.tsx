// Filepath: components/aviso-legal/AvisoLegalContent.tsx
// Version: 1.0
// Nome da Versão: "Conteúdo visível de /aviso-legal (client, i18n pt/en/es)"
//
// Metadata continuam em pt no page.tsx (SEO canônico); o conteúdo vem de
// lib/i18n/paginas.ts (AVISO_LEGAL_UI). O texto em pt é a referência legal; en/es são
// tradução informativa da mesma política.

"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { AVISO_LEGAL_UI } from "@/lib/i18n/paginas";

const TITLE = { color: "hsl(210,60%,15%)" };
const BODY = { color: "hsl(210,25%,35%)" };

export default function AvisoLegalContent() {
  const { locale } = useLocale();
  const t = AVISO_LEGAL_UI[locale];

  return (
    <main
      className="pb-16 pt-28 sm:pt-32"
      style={{ background: "hsl(40,33%,97%)" }}
    >
      <div className="section-container">
        <div className="mx-auto max-w-3xl">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "hsl(35,82%,40%)" }}
          >
            {t.eyebrow}
          </p>
          <h1
            className="text-3xl font-black tracking-tight sm:text-4xl"
            style={{ ...TITLE, fontFamily: "var(--font-display)" }}
          >
            {t.h1}
          </h1>

          <div
            className="mt-8 space-y-5 rounded-2xl border bg-white p-7 sm:p-9"
            style={{ borderColor: "hsl(214,25%,90%)" }}
          >
            <p className="text-base leading-relaxed" style={BODY}>
              {t.intro}
            </p>

            {t.sections.map((s) => (
              <div key={s.title}>
                <h2 className="mb-2 text-lg font-bold" style={TITLE}>
                  {s.title}
                </h2>
                <div className="space-y-3 text-base leading-relaxed" style={BODY}>
                  {s.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
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
    </main>
  );
}
