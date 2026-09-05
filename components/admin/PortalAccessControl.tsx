// Filepath: components/admin/PortalAccessControl.tsx
// Version: 2.0
// Nome da Versão: "Admin: cadastrar e-mail do painel (magic link)"
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, X, Check } from "lucide-react";
import type { PlanEntityType } from "@/lib/plan-periods";

export type PortalAccountSummary = {
  email: string;
  active: boolean;
} | null;

export default function PortalAccessControl({
  entityType,
  entitySlug,
  entityName,
  account,
}: {
  entityType: PlanEntityType;
  entitySlug: string;
  entityName: string;
  account: PortalAccountSummary;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(account?.email ?? "");
  const [active, setActive] = useState(account?.active ?? true);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();

  const openModal = () => {
    setEmail(account?.email ?? "");
    setActive(account?.active ?? true);
    setErr(null);
    setOk(null);
    setOpen(true);
  };

  const save = () =>
    start(async () => {
      setErr(null);
      setOk(null);
      if (!email.trim() || !email.includes("@")) {
        setErr("Informe um e-mail válido.");
        return;
      }
      const res = await fetch("/api/admin/portal-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityType,
          entitySlug,
          email: email.trim(),
          active,
        }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        setErr(j?.error || "Falha ao salvar.");
        return;
      }
      setOk(
        account
          ? "E-mail atualizado. Login em /comercial/login (magic link)."
          : "Acesso criado. Envie /comercial/login — o parceiro usa este e-mail (magic link).",
      );
      router.refresh();
    });

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border"
        style={{
          borderColor: account ? "hsl(152,40%,70%)" : "hsl(214,25%,85%)",
          color: account ? "hsl(152,40%,28%)" : "hsl(210,25%,40%)",
          background: account ? "hsl(152,40%,96%)" : "white",
        }}
        title={account ? `Painel: ${account.email}` : "Liberar painel (e-mail + magic link)"}
      >
        <KeyRound className="h-3 w-3" />
        {account ? (account.active ? "Painel" : "Painel off") : "Acesso painel"}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(15, 23, 42, 0.55)" }}
          role="dialog"
          aria-modal="true"
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
                  Acesso ao painel
                </p>
                <h2 className="text-base font-bold text-white mt-0.5">{entityName}</h2>
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

            <div className="px-5 py-4 space-y-3">
              <p className="text-xs" style={{ color: "hsl(210,20%,40%)" }}>
                Login em <b>/comercial/login</b> só com <b>link mágico</b> (sem senha).
                Sessão separada do admin. noindex como as demais páginas comerciais.
              </p>

              <label className="block">
                <span className="text-[11px] font-bold uppercase" style={{ color: "hsl(210,25%,35%)" }}>
                  E-mail de acesso
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  style={{ borderColor: "hsl(214,25%,85%)" }}
                  placeholder="contato@parceiro.com"
                  autoComplete="off"
                />
              </label>

              <label className="inline-flex items-center gap-2 text-sm" style={{ color: "hsl(210,25%,30%)" }}>
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="rounded"
                />
                Acesso ativo
              </label>

              {err && <p className="text-xs font-medium" style={{ color: "hsl(0,72%,45%)" }}>{err}</p>}
              {ok && <p className="text-xs font-medium" style={{ color: "hsl(152,47%,32%)" }}>{ok}</p>}
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
                Fechar
              </button>
              <button
                type="button"
                onClick={save}
                disabled={pending}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-bold text-white disabled:opacity-60"
                style={{ background: "hsl(152,47%,32%)" }}
              >
                <Check className="h-3.5 w-3.5" />
                {pending ? "Salvando…" : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
