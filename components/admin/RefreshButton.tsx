// Filepath: components/admin/RefreshButton.tsx
// Version: 1.0
// Nome da Versão: "Botão de revalidar — router.refresh() (sem reload total)"
// Baseado na Versão: N/A
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

export default function RefreshButton() {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      onClick={() => start(() => router.refresh())}
      disabled={pending}
      aria-label="Atualizar métricas"
      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-[1.03] disabled:opacity-60"
      style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)" }}
    >
      <RefreshCw className={`h-3.5 w-3.5 ${pending ? "animate-spin" : ""}`} aria-hidden="true" />
      {pending ? "Atualizando…" : "Atualizar"}
    </button>
  );
}
