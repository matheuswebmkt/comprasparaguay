// Filepath: components/i18n/LanguageSwitcher.tsx
// Version: 2.0
// Nome da Versão: "Seletor de idioma INLINE (dentro do Navbar, à esquerda do CTA) — troca o cookie/contexto e faz refresh das páginas server"
// Baseado na Versão: 1.0 (era um botão flutuante fixo no canto inferior esquerdo)
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Globe, Check } from "lucide-react";
import { LOCALES, LOCALE_META, type Locale } from "@/lib/i18n/config";
import { useLocale } from "./LocaleProvider";

export default function LanguageSwitcher() {
  const { locale, setLocale, ready } = useLocale();
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fecha ao clicar fora.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const choose = (l: Locale) => {
    setOpen(false);
    if (l === locale) return;
    setLocale(l);
    router.refresh(); // atualiza páginas renderizadas no server que dependem do cookie (Fase 2+)
  };

  const current = LOCALE_META[locale];

  return (
    <div ref={boxRef} className="relative">
      {open && (
        <div
          className="absolute top-full left-0 z-[90] mt-2 w-44 rounded-2xl border bg-white shadow-xl overflow-hidden"
          style={{ borderColor: "hsl(214,25%,88%)" }}
          role="listbox"
          aria-label="Selecionar idioma"
        >
          {LOCALES.map((l) => {
            const m = LOCALE_META[l];
            const on = l === locale;
            return (
              <button
                key={l}
                type="button"
                role="option"
                aria-selected={on}
                onClick={() => choose(l)}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-semibold transition-colors hover:bg-[hsl(214,50%,97%)]"
                style={{ color: "hsl(210,60%,15%)" }}
              >
                <span className="text-base leading-none" aria-hidden="true">{m.flag}</span>
                <span className="flex-1 text-left">{m.label}</span>
                {on && <Check className="h-4 w-4" style={{ color: "hsl(152,47%,32%)" }} aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-xs font-bold transition-colors hover:bg-[hsl(214,50%,97%)] sm:gap-1.5 sm:px-3 sm:py-2"
        style={{ borderColor: "hsl(214,25%,86%)", color: "hsl(210,56%,23%)", background: "white" }}
        // O rótulo acessível PRECISA conter o texto visível (WCAG 2.5.3, label-in-name): o botão
        // mostra a sigla do idioma atual ("PT"/"EN"/"ES"), então ela entra no início do rótulo.
        aria-label={`Idioma: ${ready ? current.short : "PT"}`}
        aria-expanded={open}
      >
        <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
        {/* Só mostra a bandeira/sigla após ler o cookie no client (evita flash pt→outro) */}
        <span aria-hidden="true">{ready ? current.flag : ""}</span>
        <span>{ready ? current.short : "PT"}</span>
      </button>
    </div>
  );
}
