// Filepath: app/r/[token]/copiar-button.tsx
// Version: 1.0
// Nome da Versão: "Botão 'Copiar informações' da página pública do pedido (client)"
//
// Copia para a área de transferência o resumo estruturado da página, pra a agência colar no WhatsApp.
// Requer contexto seguro (https ou localhost) para a Clipboard API; sem ela, a falha é silenciosa.

"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopiarButton({
  text,
  label,
  copiedLabel,
}: {
  text: string;
  label: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard indisponível (http/não seguro) — silencioso */
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
      style={{ background: "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)" }}
    >
      {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
      {copied ? copiedLabel : label}
    </button>
  );
}
