// Filepath: components/admin/ActiveAgencyControl.tsx
// Version: 2.0
// Nome da Versão: "Ativar / desativar agência (leads + recomendação pública do nicho)"
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export default function ActiveAgencyControl({ slug, isActive }: { slug: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const post = (next: string | null) =>
    startTransition(async () => {
      const res = await fetch("/api/admin/active-agency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: next }),
      });
      if (res.ok) router.refresh();
    });

  if (isActive) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
          style={{ color: "hsl(152,47%,28%)", background: "hsl(152,40%,93%)" }}
        >
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Agência ativa
        </span>
        <button
          type="button"
          onClick={() => post(null)}
          disabled={isPending}
          className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors hover:bg-[hsl(0,70%,97%)] disabled:opacity-60"
          style={{ borderColor: "hsl(0,40%,85%)", color: "hsl(0,50%,40%)" }}
          title="Remove a recomendação pública e deixa de carimbar novos leads com esta agência"
        >
          {isPending ? "…" : "Desativar"}
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => post(slug)}
      disabled={isPending}
      className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors hover:bg-[hsl(214,50%,96%)] disabled:opacity-60"
      style={{ borderColor: "hsl(214,25%,85%)", color: "hsl(210,56%,23%)" }}
    >
      {isPending ? "Ativando…" : "Ativar"}
    </button>
  );
}
