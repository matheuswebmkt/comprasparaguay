"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function TogglePartnerButton({
  slug,
  initialEnabled,
}: {
  slug: string;
  initialEnabled: boolean;
}) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const toggle = () => {
    startTransition(async () => {
      const res = await fetch(`/api/admin/partner/${slug}/toggle`, { method: "POST" });
      if (res.ok) {
        const data = (await res.json()) as { enabled: boolean };
        setEnabled(data.enabled);
        router.refresh();
      }
    });
  };

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-60 hover:scale-[1.03] active:scale-[0.97]"
      style={
        enabled
          ? {
              background: "hsl(152,47%,88%)",
              color: "hsl(152,47%,20%)",
              border: "1px solid hsl(152,47%,68%)",
            }
          : {
              background: "hsl(0,72%,93%)",
              color: "hsl(0,60%,30%)",
              border: "1px solid hsl(0,72%,75%)",
            }
      }
      title={enabled ? "Clique para desativar na home" : "Clique para ativar na home"}
    >
      <span
        className="inline-block w-2 h-2 rounded-full flex-none"
        style={{ background: enabled ? "hsl(152,47%,32%)" : "hsl(0,72%,51%)" }}
      />
      {isPending ? "Atualizando…" : enabled ? "Ativo na home" : "Inativo na home"}
    </button>
  );
}
