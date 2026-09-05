// Filepath: components/admin/NicheAssignmentControl.tsx
// Version: 1.0
// Nome da Versão: "Seletor do admin: define o parceiro EXCLUSIVO (Recomendação Oficial) de um nicho"
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function NicheAssignmentControl({
  nicheKey,
  current,
  partners,
}: {
  nicheKey: string;
  current: string | null; // slug atribuído (ou null = Empty State)
  partners: { slug: string; name: string }[];
}) {
  const [value, setValue] = useState(current ?? "");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const save = (next: string) => {
    setValue(next);
    setSaved(false);
    startTransition(async () => {
      const res = await fetch("/api/admin/niche-assignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nicheKey, partnerSlug: next || null }),
      });
      if (res.ok) {
        setSaved(true);
        router.refresh();
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={value}
        disabled={isPending}
        onChange={(e) => save(e.target.value)}
        className="h-9 flex-1 px-2.5 rounded-xl border text-sm outline-none transition-all focus:border-[hsl(210,56%,23%)] disabled:opacity-60"
        style={{ borderColor: "hsl(214,25%,88%)", color: "hsl(210,60%,15%)", background: "white" }}
        aria-label="Parceiro recomendado neste nicho"
      >
        <option value="">— Nenhum (Empty State) —</option>
        {partners.map((p) => (
          <option key={p.slug} value={p.slug}>
            {p.name}
          </option>
        ))}
      </select>
      <span className="text-xs w-14 shrink-0" style={{ color: isPending ? "hsl(35,82%,40%)" : "hsl(152,47%,32%)" }}>
        {isPending ? "Salvando…" : saved ? "Salvo ✓" : ""}
      </span>
    </div>
  );
}
