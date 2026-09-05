// Filepath: components/CopyPixButton.tsx
// Version: 1.0
// Nome da Versão: "Botão de copiar chave PIX (client) — feedback de 'Copiado!'"
// Baseado na Versão: N/A
"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyPixButton({ pixKey }: { pixKey: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pixKey);
    } catch {
      // Fallback p/ navegadores sem Clipboard API (contexto não seguro).
      const el = document.createElement("textarea");
      el.value = pixKey;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      try { document.execCommand("copy"); } catch { /* no-op */ }
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className="mt-3 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm text-white transition-all hover:scale-[1.03] active:scale-[0.98]"
      style={{ background: "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)" }}
    >
      {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
      {copied ? "Chave copiada!" : "Copiar chave PIX"}
    </button>
  );
}
