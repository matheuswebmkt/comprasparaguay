// Filepath: components/contact/ContactForm.tsx
// Version: 2.0
// Nome da Versão: "Inputs §7.5 (rounded-lg + ring azul) e CTA dourado text-lg bold (contraste §2)"
// Baseado na Versão: 1.1
"use client";

import { useRef, useState } from "react";
import { Mail, User, MessageSquare, Loader2, CheckCircle2 } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { CONTATO_UI } from "@/lib/i18n/paginas";

type Status = "idle" | "loading" | "sent" | "error";

const NOME_MAX = 80;
const EMAIL_MAX = 160;
const MENSAGEM_MAX = 1000;

function CharCount({ value, max }: { value: string; max: number }) {
  return (
    <span className="text-xs tabular-nums" style={{ color: "hsl(210,20%,55%)" }}>
      {value.length}/{max}
    </span>
  );
}

/* §7.5: input padrão — `rounded-lg`, ring azul/20 no foco (dourado no ring foi
   substituído; foco é estado de interface, não CTA). Ícones mantidos (pl-10). */
const inputBase =
  "w-full rounded-lg border pl-10 pr-3 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-[hsl(210,56%,23%)]/20";
const inputStyle = { borderColor: "hsl(214,25%,88%)", color: "hsl(210,60%,15%)", background: "white" };

export default function ContactForm() {
  const { locale } = useLocale();
  const t = CONTATO_UI[locale].form;
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const honeypotRef = useRef<HTMLInputElement>(null);

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const canSubmit = nome.trim().length >= 2 && isValidEmail(email.trim()) && mensagem.trim().length >= 5;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim(),
          mensagem: mensagem.trim(),
          honeypot: honeypotRef.current?.value ?? "",
        }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div
        className="rounded-2xl px-5 py-5 flex items-start gap-3"
        style={{ background: "hsl(152,40%,95%)", border: "1px solid hsl(152,40%,82%)" }}
      >
        <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: "hsl(152,47%,32%)" }} aria-hidden="true" />
        <p className="text-sm" style={{ color: "hsl(152,47%,28%)" }}>
          {t.success}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {/* Honeypot anti-bot — invisível para humanos */}
      <input
        ref={honeypotRef}
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", top: 0, width: 1, height: 1, opacity: 0 }}
      />

      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="nome" className="text-sm font-semibold" style={{ color: "hsl(210,60%,15%)" }}>
            {t.nameLabel}
          </label>
          <CharCount value={nome} max={NOME_MAX} />
        </div>
        <div className="relative mt-1.5">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "hsl(210,25%,55%)" }} aria-hidden="true" />
          <input
            id="nome"
            type="text"
            required
            maxLength={NOME_MAX}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder={t.namePlaceholder}
            className={inputBase}
            style={inputStyle}
          />
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="email" className="text-sm font-semibold" style={{ color: "hsl(210,60%,15%)" }}>
            {t.emailLabel}
          </label>
          <CharCount value={email} max={EMAIL_MAX} />
        </div>
        <div className="relative mt-1.5">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "hsl(210,25%,55%)" }} aria-hidden="true" />
          <input
            id="email"
            type="email"
            required
            maxLength={EMAIL_MAX}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.emailPlaceholder}
            className={inputBase}
            style={inputStyle}
          />
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="mensagem" className="text-sm font-semibold" style={{ color: "hsl(210,60%,15%)" }}>
            {t.messageLabel}
          </label>
          <CharCount value={mensagem} max={MENSAGEM_MAX} />
        </div>
        <div className="relative mt-1.5">
          <MessageSquare className="absolute left-3 top-3 h-4 w-4" style={{ color: "hsl(210,25%,55%)" }} aria-hidden="true" />
          <textarea
            id="mensagem"
            required
            maxLength={MENSAGEM_MAX}
            rows={5}
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            placeholder={t.messagePlaceholder}
            className="w-full rounded-lg border pl-10 pr-3 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-[hsl(210,56%,23%)]/20 resize-none"
            style={inputStyle}
          />
        </div>
      </div>

      {status === "error" && (
        <p className="text-xs" style={{ color: "hsl(0,72%,51%)" }}>
          {t.error}
        </p>
      )}

      {/* ⚠️ Rótulo dourado ≥18px bold (text-lg) em TODO breakpoint — o contraste 3.02:1
          só passa como texto grande (design-system.md §2). text-sm reprova WCAG AA. */}
      <button
        type="submit"
        disabled={!canSubmit || status === "loading"}
        className="mt-1 inline-flex items-center justify-center gap-2 w-full rounded-3xl py-4 text-lg font-bold text-white transition-transform hover:scale-[1.03] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
        style={{
          background: "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)",
        }}
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            {t.sending}
          </>
        ) : (
          t.submit
        )}
      </button>
    </form>
  );
}
