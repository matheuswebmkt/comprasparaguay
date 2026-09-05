// Filepath: components/admin/PlanTemplateManager.tsx
// Version: 1.0
// Nome da Versão: "Criar / editar planos (templates) — duração, valor padrão, carência"
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Check, X } from "lucide-react";
import type { PlanTemplate } from "@/lib/plan-periods";

function centsToBrlInput(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return "";
  return (cents / 100).toFixed(2).replace(".", ",");
}

function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

function formatBrl(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return "—";
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

type FormState = {
  slug: string;
  name: string;
  description: string;
  defaultDays: string;
  defaultAmountBrl: string;
  defaultGraceDays: string;
  active: boolean;
};

const emptyForm = (): FormState => ({
  slug: "",
  name: "",
  description: "",
  defaultDays: "30",
  defaultAmountBrl: "",
  defaultGraceDays: "0",
  active: true,
});

export default function PlanTemplateManager({
  templates: initial,
}: {
  templates: PlanTemplate[];
}) {
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [slugLocked, setSlugLocked] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();

  const openNew = () => {
    setEditing("new");
    setForm(emptyForm());
    setSlugLocked(false);
    setErr(null);
  };

  const openEdit = (t: PlanTemplate) => {
    setEditing(t.slug);
    setForm({
      slug: t.slug,
      name: t.name,
      description: t.description ?? "",
      defaultDays: String(t.defaultDays),
      defaultAmountBrl: centsToBrlInput(t.defaultAmountCents),
      defaultGraceDays: String(t.defaultGraceDays),
      active: t.active,
    });
    setSlugLocked(true);
    setErr(null);
  };

  const cancel = () => {
    setEditing(null);
    setErr(null);
  };

  const save = () =>
    start(async () => {
      setErr(null);
      const name = form.name.trim();
      const slug = (slugLocked ? form.slug : form.slug || slugify(name)).trim();
      if (!name || !slug) {
        setErr("Nome e slug são obrigatórios.");
        return;
      }
      const res = await fetch("/api/admin/plan-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          name,
          description: form.description.trim() || null,
          defaultDays: Number(form.defaultDays) || 30,
          defaultAmountBrl: form.defaultAmountBrl,
          defaultGraceDays: Number(form.defaultGraceDays) || 0,
          active: form.active,
        }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        setErr(j?.error || "Falha ao salvar plano.");
        return;
      }
      setEditing(null);
      router.refresh();
    });

  return (
    <section className="rounded-2xl border bg-white p-5 mb-6" style={{ borderColor: "hsl(214,25%,88%)" }}>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-base font-black" style={{ color: "hsl(210,60%,15%)", fontFamily: "var(--font-display)" }}>
            Modelos de plano
          </h2>
          <p className="text-xs mt-1 max-w-2xl" style={{ color: "hsl(210,20%,45%)" }}>
            Crie um ou mais planos com duração, valor padrão e carência. Ao iniciar ou renovar
            a assinatura de um parceiro/agência, você associa o modelo e pode ajustar
            valor e carência individualmente.
          </p>
        </div>
        {editing === null && (
          <button
            type="button"
            onClick={openNew}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
            style={{ background: "hsl(210,60%,18%)" }}
          >
            <Plus className="h-3.5 w-3.5" /> Novo plano
          </button>
        )}
      </div>

      {/* Lista */}
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {initial.map((t) => (
          <div
            key={t.slug}
            className="rounded-xl border p-3.5 flex flex-col gap-1.5"
            style={{
              borderColor: "hsl(214,25%,90%)",
              opacity: t.active ? 1 : 0.55,
              background: editing === t.slug ? "hsl(214,50%,97%)" : "white",
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-bold" style={{ color: "hsl(210,60%,15%)" }}>{t.name}</p>
                <p className="text-[10px]" style={{ color: "hsl(210,15%,50%)" }}>{t.slug}</p>
              </div>
              {editing === null && (
                <button
                  type="button"
                  onClick={() => openEdit(t)}
                  className="p-1.5 rounded-md hover:bg-black/5"
                  title="Editar"
                >
                  <Pencil className="h-3.5 w-3.5" style={{ color: "hsl(210,25%,40%)" }} />
                </button>
              )}
            </div>
            {t.description && (
              <p className="text-[11px] line-clamp-2" style={{ color: "hsl(210,20%,40%)" }}>{t.description}</p>
            )}
            <div className="flex flex-wrap gap-1.5 mt-1">
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: "hsl(214,30%,95%)", color: "hsl(210,40%,30%)" }}>
                {t.defaultDays} dias
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: "hsl(152,30%,94%)", color: "hsl(152,40%,28%)" }}>
                {formatBrl(t.defaultAmountCents)}
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: "hsl(40,80%,94%)", color: "hsl(30,50%,30%)" }}>
                carência {t.defaultGraceDays}d
              </span>
              {!t.active && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: "hsl(0,60%,95%)", color: "hsl(0,50%,40%)" }}>
                  inativo
                </span>
              )}
            </div>
          </div>
        ))}
        {initial.length === 0 && editing !== "new" && (
          <p className="text-xs col-span-full py-2" style={{ color: "hsl(210,15%,50%)" }}>
            Nenhum plano ainda. Clique em “Novo plano”.
          </p>
        )}
      </div>

      {/* Form criar / editar */}
      {editing !== null && (
        <div
          className="mt-4 rounded-xl border p-4 space-y-3"
          style={{ borderColor: "hsl(214,40%,85%)", background: "hsl(214,40%,98%)" }}
        >
          <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "hsl(210,40%,30%)" }}>
            {editing === "new" ? "Novo plano" : `Editar · ${editing}`}
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-[11px] font-bold" style={{ color: "hsl(210,25%,35%)" }}>Nome</span>
              <input
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setForm((f) => ({
                    ...f,
                    name,
                    slug: slugLocked || editing !== "new" ? f.slug : slugify(name),
                  }));
                }}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-white"
                style={{ borderColor: "hsl(214,25%,85%)" }}
                placeholder="ex.: Mensal VIP"
              />
            </label>

            <label className="block">
              <span className="text-[11px] font-bold" style={{ color: "hsl(210,25%,35%)" }}>Slug</span>
              <input
                value={form.slug}
                onChange={(e) => {
                  setSlugLocked(true);
                  setForm((f) => ({ ...f, slug: e.target.value }));
                }}
                disabled={editing !== "new"}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-white disabled:opacity-60"
                style={{ borderColor: "hsl(214,25%,85%)" }}
                placeholder="mensal-vip"
              />
            </label>

            <label className="block">
              <span className="text-[11px] font-bold" style={{ color: "hsl(210,25%,35%)" }}>Valor padrão (R$)</span>
              <input
                value={form.defaultAmountBrl}
                onChange={(e) => setForm((f) => ({ ...f, defaultAmountBrl: e.target.value }))}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-white"
                style={{ borderColor: "hsl(214,25%,85%)" }}
                placeholder="199,90"
                inputMode="decimal"
              />
            </label>

            <label className="block">
              <span className="text-[11px] font-bold" style={{ color: "hsl(210,25%,35%)" }}>Duração (dias)</span>
              <input
                type="number"
                min={1}
                max={366}
                value={form.defaultDays}
                onChange={(e) => setForm((f) => ({ ...f, defaultDays: e.target.value }))}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-white"
                style={{ borderColor: "hsl(214,25%,85%)" }}
              />
            </label>

            <label className="block">
              <span className="text-[11px] font-bold" style={{ color: "hsl(210,25%,35%)" }}>Carência padrão (dias)</span>
              <input
                type="number"
                min={0}
                max={90}
                value={form.defaultGraceDays}
                onChange={(e) => setForm((f) => ({ ...f, defaultGraceDays: e.target.value }))}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-white"
                style={{ borderColor: "hsl(214,25%,85%)" }}
                title="0 = some do site no vencimento; 7 = permanece +7 dias"
              />
              <span className="text-[10px] mt-0.5 block" style={{ color: "hsl(210,15%,50%)" }}>
                0 = some no vencimento · 7 = +7 dias no site (sem cron)
              </span>
            </label>

            <label className="block sm:col-span-2">
              <span className="text-[11px] font-bold" style={{ color: "hsl(210,25%,35%)" }}>Descrição</span>
              <textarea
                rows={2}
                maxLength={500}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-white resize-y"
                style={{ borderColor: "hsl(214,25%,85%)" }}
                placeholder="Características deste plano…"
              />
            </label>

            <label className="inline-flex items-center gap-2 text-sm" style={{ color: "hsl(210,25%,30%)" }}>
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                className="rounded"
              />
              Ativo (disponível ao iniciar/renovar)
            </label>
          </div>

          {err && (
            <p className="text-xs font-medium" style={{ color: "hsl(0,72%,45%)" }}>{err}</p>
          )}

          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={cancel}
              disabled={pending}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border bg-white disabled:opacity-60"
              style={{ borderColor: "hsl(214,25%,85%)", color: "hsl(210,25%,35%)" }}
            >
              <X className="h-3.5 w-3.5" /> Cancelar
            </button>
            <button
              type="button"
              onClick={save}
              disabled={pending}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white disabled:opacity-60"
              style={{ background: "hsl(152,47%,32%)" }}
            >
              <Check className="h-3.5 w-3.5" /> {pending ? "Salvando…" : "Salvar plano"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
