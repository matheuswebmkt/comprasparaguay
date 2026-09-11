// Filepath: components/ticket-offer/DayCalendar.tsx
// Calendário do dia da visita/início — mês por vez, navegação prev/next, seleção única. Bloqueia só o
// passado. `value`/`onChange` em ISO `YYYY-MM-DD` (sem fuso — dia civil, não instante). Sem lib externa.
//
// Compartilhado por TicketOfferModal (ingresso de atrativo, roteiro pronto, personalizar via CTA
// "especialista") e MontarRoteiroWizard (personalizar via wizard, passo "dias") — vive em arquivo
// próprio pra nenhum dos dois importar o outro só por causa deste subcomponente.

"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";

export default function DayCalendar({ value, onChange, locale, disabled }: {
  value: string | null; onChange: (iso: string) => void; locale: Locale; disabled?: boolean;
}) {
  const today = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; })();
  const [viewYear, setViewYear] = useState(() => (value ? Number(value.slice(0, 4)) : today.getFullYear()));
  const [viewMonth, setViewMonth] = useState(() => (value ? Number(value.slice(5, 7)) - 1 : today.getMonth()));
  const localeTag = locale === "en" ? "en-US" : locale === "es" ? "es-ES" : "pt-BR";
  const monthLabel = new Intl.DateTimeFormat(localeTag, { month: "long", year: "numeric" }).format(new Date(viewYear, viewMonth, 1));
  const weekdayLabels = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(2024, 0, 7 + i); // 2024-01-07 é domingo — base estável pra rótulo curto por locale
    return new Intl.DateTimeFormat(localeTag, { weekday: "narrow" }).format(d);
  });
  const firstDow = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();
  const toIso = (day: number) => `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const goPrev = () => { if (isCurrentMonth) return; const d = new Date(viewYear, viewMonth - 1, 1); setViewYear(d.getFullYear()); setViewMonth(d.getMonth()); };
  const goNext = () => { const d = new Date(viewYear, viewMonth + 1, 1); setViewYear(d.getFullYear()); setViewMonth(d.getMonth()); };
  return (
    <div className="rounded-2xl border p-3" style={{ borderColor: "hsl(214,25%,88%)", background: "white" }}>
      <div className="flex items-center justify-between mb-2">
        <button type="button" onClick={goPrev} disabled={disabled || isCurrentMonth} aria-label="Mês anterior"
          className="h-7 w-7 rounded-lg border flex items-center justify-center font-bold disabled:opacity-30"
          style={{ borderColor: "hsl(210,20%,82%)", color: "hsl(210,60%,15%)" }}>‹</button>
        <span className="text-sm font-bold capitalize" style={{ color: "hsl(210,60%,15%)" }}>{monthLabel}</span>
        <button type="button" onClick={goNext} disabled={disabled} aria-label="Próximo mês"
          className="h-7 w-7 rounded-lg border flex items-center justify-center font-bold disabled:opacity-30"
          style={{ borderColor: "hsl(210,20%,82%)", color: "hsl(210,60%,15%)" }}>›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekdayLabels.map((w, i) => (
          <div key={i} className="text-center text-[11px] font-semibold uppercase" style={{ color: "hsl(210,25%,42%)" }}>{w}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;
          const iso = toIso(day);
          const cellDate = new Date(viewYear, viewMonth, day);
          const isPast = cellDate < today;
          const selected = value === iso;
          return (
            <button
              key={i}
              type="button"
              disabled={disabled || isPast}
              onClick={() => onChange(iso)}
              aria-pressed={selected}
              className="h-8 rounded-lg text-xs font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              style={selected
                ? { background: "hsl(210,56%,23%)", color: "white" }
                : { color: "hsl(210,60%,15%)" }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
