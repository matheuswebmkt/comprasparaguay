// Filepath: app/admin/login/page.tsx
// Version: 1.0
// Nome da Versão: "Login admin por link mágico (design-system)"
// Baseado na Versão: N/A

"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";

function LoginForm() {
  const params = useSearchParams();
  const error = params.get("error");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      await fetch("/api/auth/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      /* resposta é sempre genérica; ignoramos erros de rede */
    }
    setStatus("sent");
  }

  return (
    <div
      className="rounded-3xl p-8 sm:p-10 w-full max-w-md"
      style={{ background: "white", boxShadow: "0 16px 48px rgba(15,42,71,0.14)" }}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: "hsl(214,50%,93%)" }}
      >
        <ShieldCheck className="h-6 w-6" style={{ color: "hsl(210,56%,23%)" }} aria-hidden="true" />
      </div>

      <h1 className="text-2xl font-black tracking-tight" style={{ color: "hsl(210,60%,15%)", fontFamily: "var(--font-display)" }}>
        Painel · Compras Paraguay
      </h1>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: "hsl(210,25%,45%)" }}>
        Acesso restrito. Informe seu e-mail para receber um link mágico de acesso.
      </p>

      {status === "sent" ? (
        <div
          className="mt-6 rounded-xl px-4 py-4 flex items-start gap-3"
          style={{ background: "hsl(152,40%,95%)", border: "1px solid hsl(152,40%,82%)" }}
        >
          <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: "hsl(152,47%,32%)" }} aria-hidden="true" />
          <p className="text-sm" style={{ color: "hsl(152,47%,28%)" }}>
            Se este e-mail tiver acesso, enviamos um link mágico. Verifique sua caixa de entrada (e o spam).
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-6">
          {error && (
            <div
              className="mb-4 rounded-xl px-4 py-3 text-sm"
              style={{ background: "hsl(0,60%,97%)", border: "1px solid hsl(0,72%,88%)", color: "hsl(0,72%,45%)" }}
            >
              {error === "config"
                ? "Configuração de autenticação ausente. Avise o administrador."
                : "Link inválido ou expirado. Solicite um novo."}
            </div>
          )}

          <label htmlFor="email" className="text-sm font-semibold" style={{ color: "hsl(210,60%,15%)" }}>
            E-mail
          </label>
          <div className="relative mt-1.5">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "hsl(210,25%,55%)" }} aria-hidden="true" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@exemplo.com"
              className="w-full h-11 pl-9 pr-3 rounded-xl border text-sm outline-none focus:ring-2 transition-all"
              style={{ borderColor: "hsl(214,25%,88%)", color: "hsl(210,60%,15%)" }}
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-5 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm text-white transition-all hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
            style={{
              background: "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)",
            }}
          >
            {status === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Enviando…
              </>
            ) : (
              "Enviar link mágico"
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 py-16"
      style={{
        background:
          "linear-gradient(160deg, hsl(210,60%,10%) 0%, hsl(210,56%,15%) 60%, hsl(152,50%,12%) 100%)",
      }}
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
