// Filepath: components/admin/PlanPeriodControl.tsx
// Version: 4.0
// Nome da Versão: "Iniciar/renovar + pausar/retomar + interromper carência (com confirmação)"
"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import type { PlanStatus, PlanTemplate } from "@/lib/plan-periods";

function centsToBrlInput(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return "";
  return (cents / 100).toFixed(2).replace(".", ",");
}

function formatBrl(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return "—";
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function parseBrlClient(input: string): number | null {
  const t = input.trim().replace(/\s/g, "");
  if (!t) return null;
  let n: number;
  if (t.includes(",")) {
    n = Number(t.replace(/\./g, "").replace(",", "."));
  } else {
    n = Number(t);
  }
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100);
}

export type PlanPeriodControlDefaults = {
  templateSlug?: string | null;
  /** Último valor registrado nesta entidade (só pré-preenche se não houver valor no plano). */
  amountCents?: number | null;
  notes?: string | null;
};

export default function PlanPeriodControl({
  entityType,
  entitySlug,
  entityName,
  status,
  templates,
  defaults,
}: {
  entityType: "partner" | "agency";
  entitySlug: string;
  entityName: string;
  status: PlanStatus;
  templates: PlanTemplate[];
  defaults?: PlanPeriodControlDefaults;
}) {
  const [open, setOpen] = useState(false);
  const [interruptOpen, setInterruptOpen] = useState(false);
  const [interruptNote, setInterruptNote] = useState("");
  const [pauseOpen, setPauseOpen] = useState(false);
  const [pauseNote, setPauseNote] = useState("");
  const [pauseMode, setPauseMode] = useState<"pause" | "resume">("pause");
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const [interruptErr, setInterruptErr] = useState<string | null>(null);
  const [pauseErr, setPauseErr] = useState<string | null>(null);
  const router = useRouter();

  const activeTemplates = useMemo(
    () => templates.filter((t) => t.active),
    [templates],
  );

  const [templateSlug, setTemplateSlug] = useState("");
  const [amountBrl, setAmountBrl] = useState("");
  const [note, setNote] = useState("");

  const selected = useMemo(
    () => activeTemplates.find((t) => t.slug === templateSlug) ?? null,
    [activeTemplates, templateSlug],
  );

  // Ao abrir: plano já associado (ou o 1º), valor do modelo, obs anteriores
  useEffect(() => {
    if (!open) return;
    const preferred =
      (defaults?.templateSlug && activeTemplates.find((t) => t.slug === defaults.templateSlug)) ||
      activeTemplates[0] ||
      null;

    setTemplateSlug(preferred?.slug ?? "");
    // Valor: padrão do plano escolhido; se o plano não tem preço, usa o último da entidade
    const amount =
      preferred?.defaultAmountCents ??
      defaults?.amountCents ??
      null;
    setAmountBrl(centsToBrlInput(amount));
    setNote(defaults?.notes ?? "");
    setErr(null);
  }, [open, defaults, activeTemplates]);

  const onTemplateChange = (slug: string) => {
    setTemplateSlug(slug);
    const t = activeTemplates.find((x) => x.slug === slug);
    if (!t) return;
    // Só o valor do período acompanha o plano; duração/carência são do modelo
    setAmountBrl(centsToBrlInput(t.defaultAmountCents));
  };

  const actionLabel =
    status === "none" ? "Iniciar plano" :
    status === "expired" || status === "grace" || status === "paused" ? "Renovar plano" :
    "Renovar agora";

  const canPause = status === "active" || status === "expiring" || status === "grace";
  const canResume = status === "paused";

  const confirm = () =>
    start(async () => {
      setErr(null);
      if (!templateSlug) {
        setErr("Selecione um plano.");
        return;
      }

      let amountCents: number | null = null;
      if (amountBrl.trim() !== "") {
        amountCents = parseBrlClient(amountBrl);
        if (amountCents === null) {
          setErr("Valor inválido. Use formato 199,90");
          return;
        }
      }

      // Duração e carência vêm só do modelo no servidor (não reenviamos override).
      const res = await fetch("/api/admin/plan-period", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityType,
          entitySlug,
          templateSlug,
          amountCents,
          note: note.trim() || null,
        }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        setErr(j?.error || "Falha ao gravar. Tente de novo.");
        return;
      }
      setOpen(false);
      router.refresh();
    });

  const confirmInterrupt = () =>
    start(async () => {
      setInterruptErr(null);
      const res = await fetch("/api/admin/plan-period", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "interrupt_grace",
          entityType,
          entitySlug,
          note: interruptNote.trim() || null,
        }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        setInterruptErr(j?.error || "Falha ao interromper.");
        return;
      }
      setInterruptOpen(false);
      router.refresh();
    });

  const confirmPauseResume = () =>
    start(async () => {
      setPauseErr(null);
      const res = await fetch("/api/admin/plan-period", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: pauseMode,
          entityType,
          entitySlug,
          note: pauseNote.trim() || null,
        }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        setPauseErr(j?.error || "Falha ao atualizar pausa.");
        return;
      }
      setPauseOpen(false);
      router.refresh();
    });

  return (
    <>
      <div className="flex flex-col items-end gap-1.5">
        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={pending}
          className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-60"
          style={{
            background: status === "none" || status === "expired"
              ? "linear-gradient(135deg, hsl(152,47%,32%) 0%, hsl(152,50%,28%) 100%)"
              : "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)",
          }}
          title="Escolhe o plano e confirma antes de gravar"
        >
          {actionLabel}
        </button>

        {canPause && (
          <button
            type="button"
            onClick={() => {
              setPauseMode("pause");
              setPauseNote("");
              setPauseErr(null);
              setPauseOpen(true);
            }}
            disabled={pending}
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border transition-transform hover:scale-[1.02] disabled:opacity-60"
            style={{
              borderColor: "hsl(210,30%,75%)",
              color: "hsl(210,40%,30%)",
              background: "hsl(214,30%,97%)",
            }}
            title="Tira do site e congela o prazo até retomar"
          >
            Pausar
          </button>
        )}

        {canResume && (
          <button
            type="button"
            onClick={() => {
              setPauseMode("resume");
              setPauseNote("");
              setPauseErr(null);
              setPauseOpen(true);
            }}
            disabled={pending}
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg, hsl(210,56%,32%) 0%, hsl(210,50%,28%) 100%)",
            }}
            title="Retoma e devolve o tempo congelado ao prazo"
          >
            Retomar
          </button>
        )}

        {/* Só após o vencimento, enquanto ainda está no site pela carência */}
        {status === "grace" && (
          <button
            type="button"
            onClick={() => {
              setInterruptNote("");
              setInterruptErr(null);
              setInterruptOpen(true);
            }}
            disabled={pending}
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border transition-transform hover:scale-[1.02] disabled:opacity-60"
            style={{
              borderColor: "hsl(0,55%,70%)",
              color: "hsl(0,55%,38%)",
              background: "hsl(0,70%,97%)",
            }}
            title="Some do site imediatamente, sem esperar o fim da carência"
          >
            Interromper carência
          </button>
        )}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(15, 23, 42, 0.55)" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="plan-confirm-title"
          onClick={(e) => {
            if (e.target === e.currentTarget && !pending) setOpen(false);
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white shadow-xl border overflow-hidden"
            style={{ borderColor: "hsl(214,25%,88%)" }}
          >
            <div
              className="flex items-start justify-between gap-3 px-5 py-4"
              style={{ background: "hsl(210,60%,15%)" }}
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-white/70">
                  Confirmar {status === "none" ? "início" : "renovação"}
                </p>
                <h2 id="plan-confirm-title" className="text-base font-bold text-white mt-0.5">
                  {entityName}
                </h2>
                <p className="text-[11px] text-white/60 mt-0.5">{entitySlug}</p>
              </div>
              <button
                type="button"
                onClick={() => !pending && setOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:bg-white/10"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-5 py-4 space-y-3.5">
              <p className="text-xs" style={{ color: "hsl(210,20%,40%)" }}>
                Selecione o <b>plano</b> (duração e carência vêm do modelo). Se precisar de
                condições diferentes, crie outro plano e escolha-o aqui. Nada é gravado até{" "}
                <b>Confirmar</b>.
              </p>

              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "hsl(210,25%,35%)" }}>
                  Plano
                </span>
                <select
                  value={templateSlug}
                  onChange={(e) => onTemplateChange(e.target.value)}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-white"
                  style={{ borderColor: "hsl(214,25%,85%)" }}
                >
                  {activeTemplates.length === 0 && (
                    <option value="">Sem planos — crie um modelo acima</option>
                  )}
                  {activeTemplates.map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </label>

              {/* Resumo só-leitura do modelo escolhido */}
              {selected && (
                <div
                  className="rounded-xl border px-3.5 py-3 text-xs space-y-1"
                  style={{ borderColor: "hsl(214,30%,88%)", background: "hsl(214,40%,98%)", color: "hsl(210,25%,30%)" }}
                >
                  <p className="font-bold text-sm" style={{ color: "hsl(210,60%,15%)" }}>{selected.name}</p>
                  {selected.description && (
                    <p className="text-[11px]" style={{ color: "hsl(210,15%,45%)" }}>{selected.description}</p>
                  )}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="px-1.5 py-0.5 rounded font-semibold" style={{ background: "hsl(214,30%,93%)" }}>
                      {selected.defaultDays} dias
                    </span>
                    <span className="px-1.5 py-0.5 rounded font-semibold" style={{ background: "hsl(152,30%,93%)" }}>
                      {formatBrl(selected.defaultAmountCents)}
                    </span>
                    <span className="px-1.5 py-0.5 rounded font-semibold" style={{ background: "hsl(40,80%,93%)" }}>
                      carência {selected.defaultGraceDays}d
                      {selected.defaultGraceDays === 0 ? " (some no venc.)" : ""}
                    </span>
                  </div>
                </div>
              )}

              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "hsl(210,25%,35%)" }}>
                  Valor recebido neste período (R$)
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="ex.: 199,90"
                  value={amountBrl}
                  onChange={(e) => setAmountBrl(e.target.value)}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  style={{ borderColor: "hsl(214,25%,85%)" }}
                />
                <span className="text-[10px] mt-0.5 block" style={{ color: "hsl(210,15%,50%)" }}>
                  Pré-preenchido com o valor do plano; ajuste só se o pagamento deste ciclo for diferente.
                </span>
              </label>

              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "hsl(210,25%,35%)" }}>
                  Observação do período (visível ao parceiro)
                </span>
                <textarea
                  rows={2}
                  maxLength={500}
                  placeholder="Opcional — vira a 1ª nota compartilhada deste ciclo"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm resize-y"
                  style={{ borderColor: "hsl(214,25%,85%)" }}
                />
                <span className="text-[10px] mt-0.5 block" style={{ color: "hsl(210,15%,50%)" }}>
                  Mais notas (privadas ou compartilhadas) no painel lateral do detalhe.
                </span>
              </label>

              {err && (
                <p className="text-xs font-medium" style={{ color: "hsl(0,72%,45%)" }}>{err}</p>
              )}
            </div>

            <div
              className="flex items-center justify-end gap-2 px-5 py-3.5 border-t"
              style={{ borderColor: "hsl(214,25%,92%)", background: "hsl(40,33%,98%)" }}
            >
              <button
                type="button"
                onClick={() => !pending && setOpen(false)}
                disabled={pending}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold border bg-white disabled:opacity-60"
                style={{ borderColor: "hsl(214,25%,85%)", color: "hsl(210,25%,35%)" }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirm}
                disabled={pending || !templateSlug}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white disabled:opacity-60"
                style={{
                  background: "linear-gradient(135deg, hsl(152,47%,32%) 0%, hsl(152,50%,28%) 100%)",
                }}
              >
                {pending ? "Salvando…" : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: pausar / retomar */}
      {pauseOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(15, 23, 42, 0.55)" }}
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget && !pending) setPauseOpen(false);
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white shadow-xl border overflow-hidden"
            style={{ borderColor: "hsl(214,25%,88%)" }}
          >
            <div
              className="flex items-start justify-between gap-3 px-5 py-4"
              style={{ background: pauseMode === "pause" ? "hsl(210,40%,28%)" : "hsl(152,40%,28%)" }}
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-white/70">
                  {pauseMode === "pause" ? "Pausar plano" : "Retomar plano"}
                </p>
                <h2 className="text-base font-bold text-white mt-0.5">{entityName}</h2>
                <p className="text-[11px] text-white/60 mt-0.5">{entitySlug}</p>
              </div>
              <button
                type="button"
                onClick={() => !pending && setPauseOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:bg-white/10"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-5 py-4 space-y-3">
              <p className="text-xs" style={{ color: "hsl(210,20%,40%)" }}>
                {pauseMode === "pause" ? (
                  <>
                    A listagem <b>some do site</b> e o prazo <b>congela</b> (dias restantes preservados).
                    Use quando precisar resolver algo sem queimar o período. Nada é gravado até confirmar.
                  </>
                ) : (
                  <>
                    Retoma a contagem: o tempo pausado é <b>devolvido</b> ao prazo e a listagem volta
                    a poder aparecer no site (se o plano ainda estiver no período/carência). Confirme para aplicar.
                  </>
                )}
              </p>
              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "hsl(210,25%,35%)" }}>
                  Motivo (opcional)
                </span>
                <textarea
                  rows={2}
                  maxLength={500}
                  value={pauseNote}
                  onChange={(e) => setPauseNote(e.target.value)}
                  placeholder="ex.: aguardando documentação / disputa"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm resize-y"
                  style={{ borderColor: "hsl(214,25%,85%)" }}
                />
              </label>
              {pauseErr && (
                <p className="text-xs font-medium" style={{ color: "hsl(0,72%,45%)" }}>{pauseErr}</p>
              )}
            </div>
            <div
              className="flex items-center justify-end gap-2 px-5 py-3.5 border-t"
              style={{ borderColor: "hsl(214,25%,92%)", background: "hsl(40,33%,98%)" }}
            >
              <button
                type="button"
                onClick={() => !pending && setPauseOpen(false)}
                disabled={pending}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold border bg-white disabled:opacity-60"
                style={{ borderColor: "hsl(214,25%,85%)", color: "hsl(210,25%,35%)" }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmPauseResume}
                disabled={pending}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white disabled:opacity-60"
                style={{
                  background: pauseMode === "pause" ? "hsl(210,40%,32%)" : "hsl(152,47%,32%)",
                }}
              >
                {pending
                  ? "Salvando…"
                  : pauseMode === "pause"
                    ? "Confirmar pausa"
                    : "Confirmar retomada"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: interromper carência (só status grace) */}
      {interruptOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(15, 23, 42, 0.55)" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="plan-interrupt-title"
          onClick={(e) => {
            if (e.target === e.currentTarget && !pending) setInterruptOpen(false);
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white shadow-xl border overflow-hidden"
            style={{ borderColor: "hsl(214,25%,88%)" }}
          >
            <div
              className="flex items-start justify-between gap-3 px-5 py-4"
              style={{ background: "hsl(0,45%,32%)" }}
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-white/70">
                  Interromper carência
                </p>
                <h2 id="plan-interrupt-title" className="text-base font-bold text-white mt-0.5">
                  {entityName}
                </h2>
                <p className="text-[11px] text-white/60 mt-0.5">{entitySlug}</p>
              </div>
              <button
                type="button"
                onClick={() => !pending && setInterruptOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:bg-white/10"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-5 py-4 space-y-3">
              <p className="text-xs" style={{ color: "hsl(210,20%,40%)" }}>
                O plano já venceu e está no site só pela <b>carência</b>. Confirmar faz a
                listagem <b>sumir agora</b>, sem esperar o fim dos dias de graça. Isso não
                renova o plano — para voltar ao site, use <b>Renovar plano</b> depois.
              </p>
              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "hsl(210,25%,35%)" }}>
                  Motivo (opcional)
                </span>
                <textarea
                  rows={2}
                  maxLength={500}
                  value={interruptNote}
                  onChange={(e) => setInterruptNote(e.target.value)}
                  placeholder="ex.: cliente pediu remoção / inadimplência"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm resize-y"
                  style={{ borderColor: "hsl(214,25%,85%)" }}
                />
              </label>
              {interruptErr && (
                <p className="text-xs font-medium" style={{ color: "hsl(0,72%,45%)" }}>{interruptErr}</p>
              )}
            </div>

            <div
              className="flex items-center justify-end gap-2 px-5 py-3.5 border-t"
              style={{ borderColor: "hsl(214,25%,92%)", background: "hsl(40,33%,98%)" }}
            >
              <button
                type="button"
                onClick={() => !pending && setInterruptOpen(false)}
                disabled={pending}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold border bg-white disabled:opacity-60"
                style={{ borderColor: "hsl(214,25%,85%)", color: "hsl(210,25%,35%)" }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmInterrupt}
                disabled={pending}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white disabled:opacity-60"
                style={{ background: "hsl(0,55%,42%)" }}
              >
                {pending ? "Interrompendo…" : "Interromper agora"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
