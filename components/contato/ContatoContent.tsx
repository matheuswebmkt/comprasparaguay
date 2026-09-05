// Filepath: components/contato/ContatoContent.tsx
// Version: 1.0
// Nome da Versão: "Conteúdo visível de /contato (client, i18n pt/en/es)"
//
// Metadata continuam em pt no page.tsx (SEO canônico); o conteúdo vem de
// lib/i18n/paginas.ts (CONTATO_UI). O formulário (ContactForm) é client e i18n-izado.

"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { CONTATO_UI } from "@/lib/i18n/paginas";
import ContactForm from "@/components/contact/ContactForm";

export default function ContatoContent() {
  const { locale } = useLocale();
  const t = CONTATO_UI[locale];

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
          </div>
        </div>
      </section>

      <div className="section-container pb-20 sm:pb-24">
        <div className="mx-auto max-w-xl">
          <div
            className="rounded-2xl border bg-white p-7 sm:p-9"
            style={{ borderColor: "hsl(214,25%,90%)" }}
          >
            <ContactForm />
          </div>

          <div className="mt-10">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all hover:gap-2.5 duration-200"
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
