// Filepath: components/admin/PlanNotesPanel.tsx
// Version: 1.0
// Nome da Versão: "Notas do ciclo (shared/admin) + notas internas da entidade"
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { PlanEntityNote, PlanPeriodNote } from "@/lib/plan-periods";

export default function PlanNotesPanel({
  entityType,
  entitySlug,
  hasPeriod,
  periodNotes,
  legacyNote,
  entityNotes,
}: {
  entityType: "partner" | "agency";
  entitySlug: string;
  hasPeriod: boolean;
  periodNotes: PlanPeriodNote[];
  legacyNote: string | null;
  entityNotes: PlanEntityNote[];
}) {
  const [periodBody, setPeriodBody] = useState("");
  const [periodVis, setPeriodVis] = useState<"shared" | "admin">("shared");
  const [entityBody, setEntityBody] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();

  const addPeriod = () =>
    start(async () => {
      setErr(null);
      const res = await fetch("/api/admin/plan-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityType,
          entitySlug,
          scope: "period",
          body: periodBody,
          visibility: periodVis,
        }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        setErr(j?.error || "Falha ao salvar nota do período.");
        return;
      }
      setPeriodBody("");
      router.refresh();
    });

  const addEntity = () =>
    start(async () => {
      setErr(null);
      const res = await fetch("/api/admin/plan-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityType,
          entitySlug,
          scope: "entity",
          body: entityBody,
        }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        setErr(j?.error || "Falha ao salvar nota da entidade.");
        return;
      }
      setEntityBody("");
      router.refresh();
    });

  return (
    <div className="mt-5 space-y-5">
      {/* Período */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "hsl(210,15%,50%)" }}>
          Observações do período
        </p>
        <p className="text-[11px] mt-0.5 mb-2" style={{ color: "hsl(210,15%,50%)" }}>
          Ligadas a este ciclo. <b>Parceiro</b> = ambos veem · <b>Só eu</b> = só no admin.
        </p>

        {!hasPeriod && (
          <p className="text-xs" style={{ color: "hsl(210,15%,50%)" }}>
            Inicie um plano para registrar observações do ciclo.
          </p>
        )}

        {hasPeriod && (
          <div className="space-y-2 mb-2">
            {legacyNote && periodNotes.length === 0 && (
              <div
                className="rounded-lg border p-2.5 text-xs"
                style={{ borderColor: "hsl(214,25%,90%)", color: "hsl(210,30%,25%)" }}
              >
                <span
                  className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded mr-1"
                  style={{ background: "hsl(152,30%,93%)", color: "hsl(152,40%,28%)" }}
                >
                  Parceiro
                </span>
                {legacyNote}
              </div>
            )}
            {periodNotes.map((n) => (
              <div
                key={n.id}
                className="rounded-lg border p-2.5 text-xs"
                style={{ borderColor: "hsl(214,25%,90%)", color: "hsl(210,30%,25%)" }}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span
                    className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={
                      n.visibility === "admin"
                        ? { background: "hsl(280,40%,94%)", color: "hsl(280,40%,35%)" }
                        : { background: "hsl(152,30%,93%)", color: "hsl(152,40%,28%)" }
                    }
                  >
                    {n.visibility === "admin" ? "Só eu" : "Parceiro"}
                  </span>
                  <span className="text-[10px]" style={{ color: "hsl(210,15%,50%)" }}>{n.createdAt}</span>
                </div>
                <p className="whitespace-pre-wrap">{n.body}</p>
                {n.createdBy && (
                  <p className="text-[10px] mt-1" style={{ color: "hsl(210,15%,50%)" }}>por {n.createdBy}</p>
                )}
              </div>
            ))}
            {periodNotes.length === 0 && !legacyNote && (
              <p className="text-xs" style={{ color: "hsl(210,15%,50%)" }}>Nenhuma observação neste ciclo.</p>
            )}
          </div>
        )}

        {hasPeriod && (
          <div className="rounded-xl border p-2.5 space-y-2" style={{ borderColor: "hsl(214,25%,88%)", background: "hsl(40,33%,98%)" }}>
            <textarea
              rows={2}
              maxLength={2000}
              value={periodBody}
              onChange={(e) => setPeriodBody(e.target.value)}
              placeholder="Nova observação deste período…"
              className="w-full rounded-lg border px-2.5 py-2 text-xs resize-y bg-white"
              style={{ borderColor: "hsl(214,25%,85%)" }}
            />
            <div className="flex flex-wrap items-center gap-2 justify-between">
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setPeriodVis("shared")}
                  className="px-2 py-1 rounded-md text-[10px] font-bold border"
                  style={
                    periodVis === "shared"
                      ? { background: "hsl(152,40%,90%)", borderColor: "hsl(152,40%,70%)", color: "hsl(152,40%,25%)" }
                      : { background: "white", borderColor: "hsl(214,25%,88%)", color: "hsl(210,20%,45%)" }
                  }
                >
                  Parceiro
                </button>
                <button
                  type="button"
                  onClick={() => setPeriodVis("admin")}
                  className="px-2 py-1 rounded-md text-[10px] font-bold border"
                  style={
                    periodVis === "admin"
                      ? { background: "hsl(280,40%,94%)", borderColor: "hsl(280,40%,75%)", color: "hsl(280,40%,30%)" }
                      : { background: "white", borderColor: "hsl(214,25%,88%)", color: "hsl(210,20%,45%)" }
                  }
                >
                  Só eu
                </button>
              </div>
              <button
                type="button"
                onClick={addPeriod}
                disabled={pending || !periodBody.trim()}
                className="px-2.5 py-1 rounded-md text-[11px] font-bold text-white disabled:opacity-50"
                style={{ background: "hsl(210,60%,22%)" }}
              >
                {pending ? "…" : "Adicionar"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Entidade (só admin, sem ciclo) */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "hsl(210,15%,50%)" }}>
          Notas internas (entidade)
        </p>
        <p className="text-[11px] mt-0.5 mb-2" style={{ color: "hsl(210,15%,50%)" }}>
          Só você vê. Independentes de renovação/ciclo — histórico do negócio.
        </p>

        <div className="space-y-2 mb-2">
          {entityNotes.map((n) => (
            <div
              key={n.id}
              className="rounded-lg border p-2.5 text-xs"
              style={{ borderColor: "hsl(280,30%,90%)", background: "hsl(280,40%,98%)", color: "hsl(210,30%,25%)" }}
            >
              <div className="flex justify-between gap-2 mb-1">
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                  style={{ background: "hsl(280,40%,92%)", color: "hsl(280,40%,32%)" }}
                >
                  Interno
                </span>
                <span className="text-[10px]" style={{ color: "hsl(210,15%,50%)" }}>{n.createdAt}</span>
              </div>
              <p className="whitespace-pre-wrap">{n.body}</p>
              {n.createdBy && (
                <p className="text-[10px] mt-1" style={{ color: "hsl(210,15%,50%)" }}>por {n.createdBy}</p>
              )}
            </div>
          ))}
          {entityNotes.length === 0 && (
            <p className="text-xs" style={{ color: "hsl(210,15%,50%)" }}>Nenhuma nota interna ainda.</p>
          )}
        </div>

        <div className="rounded-xl border p-2.5 space-y-2" style={{ borderColor: "hsl(280,30%,88%)", background: "hsl(280,40%,98%)" }}>
          <textarea
            rows={2}
            maxLength={2000}
            value={entityBody}
            onChange={(e) => setEntityBody(e.target.value)}
            placeholder="Nota interna do negócio (só admin)…"
            className="w-full rounded-lg border px-2.5 py-2 text-xs resize-y bg-white"
            style={{ borderColor: "hsl(214,25%,85%)" }}
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={addEntity}
              disabled={pending || !entityBody.trim()}
              className="px-2.5 py-1 rounded-md text-[11px] font-bold text-white disabled:opacity-50"
              style={{ background: "hsl(280,35%,38%)" }}
            >
              {pending ? "…" : "Adicionar nota interna"}
            </button>
          </div>
        </div>
      </div>

      {err && (
        <p className="text-xs font-medium" style={{ color: "hsl(0,72%,45%)" }}>{err}</p>
      )}
    </div>
  );
}
