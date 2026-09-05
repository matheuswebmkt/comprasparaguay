// Filepath: components/admin/dashboard-ui.tsx
// Version: 1.1
// Nome da Versão: "+ PctRow (linhas de funil % — seções do modal)"
// Baseado na Versão: N/A
//
// Componentes de servidor (sem hooks). Reutilizados pelo dashboard geral e pelo de parceiro.

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PERIOD_OPTIONS, type Period } from "@/lib/metrics";

export const TITLE = { color: "hsl(210,60%,15%)" };
export const MUTED = { color: "hsl(210,25%,45%)" };
export const BORDER = { borderColor: "hsl(214,25%,90%)" };

export function fmt(n: number): string {
  return new Intl.NumberFormat("pt-BR").format(n);
}

export function PeriodSelector({ basePath, current }: { basePath: string; current: Period }) {
  const sep = basePath.includes("?") ? "&" : "?";
  return (
    <div className="flex flex-wrap gap-2">
      {PERIOD_OPTIONS.map((opt) => {
        const active = opt.value === current;
        return (
          <Link
            key={String(opt.value)}
            href={`${basePath}${sep}days=${opt.value}`}
            className="inline-flex items-center px-3.5 py-2 rounded-full text-sm font-semibold border transition-all"
            style={
              active
                ? { background: "hsl(210,56%,23%)", color: "white", borderColor: "transparent" }
                : { background: "white", color: "hsl(210,56%,23%)", borderColor: "hsl(214,25%,85%)" }
            }
          >
            {opt.label}
          </Link>
        );
      })}
    </div>
  );
}

export function MetricCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5" style={BORDER}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: "hsl(214,50%,96%)", color: accent }}>
        {icon}
      </div>
      <p className="text-2xl sm:text-3xl font-black" style={{ ...TITLE, fontFamily: "var(--font-display)" }}>
        {value}
      </p>
      <p className="text-xs mt-0.5" style={MUTED}>
        {label}
      </p>
    </div>
  );
}

export function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  const items = Array.isArray(children) ? children.flat() : [children];
  const isEmpty = items.filter(Boolean).length === 0;
  return (
    <div className="rounded-2xl border bg-white p-6" style={BORDER}>
      <h2 className="text-base font-bold mb-4" style={TITLE}>
        {title}
      </h2>
      {isEmpty ? (
        <p className="text-sm" style={MUTED}>
          Sem dados neste período.
        </p>
      ) : (
        <div className="space-y-3">{children}</div>
      )}
    </div>
  );
}

export function BarRow({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-1">
        <span className="text-sm truncate" style={{ color: "hsl(210,25%,35%)" }} title={label}>
          {label}
        </span>
        <span className="text-sm font-bold tabular-nums" style={TITLE}>
          {fmt(value)}
        </span>
      </div>
      <div className="h-1.5 rounded-full" style={{ background: "hsl(214,25%,92%)" }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

/**
 * Linha de FUNIL: valor absoluto + percentual sobre `total` (a barra representa o %).
 * Usada nas seções do modal (etapas do funil + onde os leads abandonam).
 */
export function PctRow({
  label,
  value,
  total,
  color = "hsl(210,56%,35%)",
}: {
  label: string;
  value: number;
  total: number;
  color?: string;
}) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-1">
        <span className="text-sm truncate" style={{ color: "hsl(210,25%,35%)" }} title={label}>
          {label}
        </span>
        <span className="text-sm font-bold tabular-nums" style={TITLE}>
          {fmt(value)} <span className="font-normal" style={MUTED}>({pct.toFixed(1)}%)</span>
        </span>
      </div>
      <div className="h-1.5 rounded-full" style={{ background: "hsl(214,25%,92%)" }}>
        <div className="h-full rounded-full" style={{ width: `${Math.min(100, pct)}%`, background: color }} />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
      {label}
    </span>
  );
}

export function SeriesChart({ series }: { series: { day: string; pageviews: number; clicks: number }[] }) {
  const max = Math.max(1, ...series.map((s) => Math.max(s.pageviews, s.clicks)));
  return (
    <div className="rounded-2xl border bg-white p-6" style={BORDER}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold" style={TITLE}>
          Atividade diária
        </h2>
        <div className="flex items-center gap-4 text-xs" style={MUTED}>
          <Legend color="hsl(210,56%,35%)" label="Visualizações" />
          <Legend color="hsl(35,82%,47%)" label="Cliques" />
        </div>
      </div>
      <div className="flex items-end gap-1 h-44">
        {series.map((d) => (
          <div
            key={d.day}
            className="flex-1 flex items-end justify-center gap-0.5 h-full"
            title={`${d.day}: ${d.pageviews} visualizações, ${d.clicks} cliques`}
          >
            <div className="w-full max-w-[10px] rounded-t-sm" style={{ height: `${(d.pageviews / max) * 100}%`, background: "hsl(210,56%,35%)" }} />
            <div className="w-full max-w-[10px] rounded-t-sm" style={{ height: `${(d.clicks / max) * 100}%`, background: "hsl(35,82%,47%)" }} />
          </div>
        ))}
      </div>
      {series.length > 0 && (
        <div className="flex justify-between mt-2 text-[11px]" style={MUTED}>
          <span>{series[0]?.day}</span>
          <span>{series[series.length - 1]?.day}</span>
        </div>
      )}
    </div>
  );
}

export function Notice({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl border bg-white p-10 text-center" style={BORDER}>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "hsl(214,50%,93%)" }}>
        {icon}
      </div>
      <h2 className="text-lg font-bold" style={TITLE}>
        {title}
      </h2>
      <p className="mt-2 text-sm max-w-md mx-auto" style={MUTED}>
        {text}
      </p>
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-black tracking-tight mb-4" style={{ ...TITLE, fontFamily: "var(--font-display)" }}>
      {children}
    </h2>
  );
}

export function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-widest mb-3 mt-10" style={{ color: "hsl(35,82%,40%)" }}>
      {children}
    </p>
  );
}

export interface OverviewItem {
  key: string;
  label: string;
  reach?: number; // pessoas que viram o card/seção (só parceiros)
  views: number;
  clicks: number;
  visitors: number;
  ctr: number;
}

export function OverviewTable({
  rows,
  firstColLabel,
  hrefFor,
  emptyText,
  showReach = false,
}: {
  rows: OverviewItem[];
  firstColLabel: string;
  hrefFor: (key: string) => string;
  emptyText: string;
  /** Exibe a coluna "Alcance" (pessoas que viram o card/seção) — só faz sentido p/ parceiros. */
  showReach?: boolean;
}) {
  const COLS = showReach
    ? "grid grid-cols-[1fr_auto_auto_auto_auto_auto_auto] gap-3"
    : "grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-3";
  return (
    <div className="rounded-2xl border bg-white overflow-hidden" style={BORDER}>
      <div className={`${COLS} px-5 py-3 text-[11px] font-semibold uppercase tracking-wide`} style={{ ...MUTED, background: "hsl(214,50%,97%)" }}>
        <span>{firstColLabel}</span>
        {showReach && <span className="text-right w-14">Alcance</span>}
        <span className="text-right w-14">Views</span>
        <span className="text-right w-14">Cliques</span>
        <span className="text-right w-14">Visit.</span>
        <span className="text-right w-14">CTR</span>
        <span className="w-5" />
      </div>
      {rows.map((r) => (
        <Link
          key={r.key}
          href={hrefFor(r.key)}
          className={`${COLS} px-5 py-3.5 items-center border-t transition-colors hover:bg-[hsl(214,50%,97%)]`}
          style={BORDER}
        >
          <span className="text-sm font-semibold truncate" style={TITLE} title={r.label}>{r.label}</span>
          {showReach && <span className="text-sm text-right w-14 tabular-nums font-semibold" style={{ color: "hsl(152,47%,32%)" }}>{fmt(r.reach ?? 0)}</span>}
          <span className="text-sm text-right w-14 tabular-nums" style={{ color: "hsl(210,25%,35%)" }}>{fmt(r.views)}</span>
          <span className="text-sm text-right w-14 tabular-nums" style={{ color: "hsl(210,25%,35%)" }}>{fmt(r.clicks)}</span>
          <span className="text-sm text-right w-14 tabular-nums" style={{ color: "hsl(210,25%,35%)" }}>{fmt(r.visitors)}</span>
          <span className="text-sm text-right w-14 tabular-nums font-semibold" style={TITLE}>{r.ctr.toFixed(1)}%</span>
          <ChevronRight className="h-4 w-4 justify-self-end" style={{ color: "hsl(210,25%,55%)" }} aria-hidden="true" />
        </Link>
      ))}
      {rows.length === 0 && <p className="px-5 py-6 text-sm" style={MUTED}>{emptyText}</p>}
    </div>
  );
}
