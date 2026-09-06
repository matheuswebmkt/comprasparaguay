// Filepath: components/footer.tsx
// Version: 5.2
// Nome da Versão: "Links do footer espelham o site atual (hub, transfer, tríplice) + social @roteirofoz"
//
// ⚠️ FUNDO AREIA. O footer era navy escuro (`linear-gradient(160deg, #0F2A47, #0A1C30)`) com texto
// branco. Não há mais fundo escuro no site público (design-system §1) — inverter o footer exigiu
// trocar TODA a escala de texto, borda e fundo de botão, não só o `background`.
//
// ⚠️ Space Grotesk foi REMOVIDA do projeto (design-system §3) e este arquivo ainda a referenciava em
// dois lugares. Como a fonte não é carregada, o `font-family` caía silenciosamente no fallback —
// ninguém percebia. Trocado por `var(--font-display)` (Fraunces) no título e pelo stack padrão no
// resto. NÃO reintroduzir Space Grotesk.
//
// ⚠️ O disclaimer é exigido por §18 (LGPD) e NOMEIA a agência parceira de propósito. Não é copy de
// marketing e não deve ser "limpo" pelo léxico de §21.

"use client";

import { Instagram, Facebook, MapPin } from "lucide-react";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { HOME_UI } from "@/lib/i18n/home";

/** Texto secundário do footer. 45% de lightness sobre Areia dá 4.68:1 — AA em 13–14px. */
const SECUNDARIO = "hsl(210,25%,45%)";
const BORDA = "hsl(214,25%,88%)";

const Footer = () => {
  const { locale } = useLocale();
  const t = HOME_UI[locale].footer;
  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background: "hsl(40,33%,97%)",
        borderTop: `1px solid ${BORDA}`,
      }}
    >
      {/* Filete em Verde Selva — a assinatura da marca (§1). Era dourado, mas o dourado é escasso
          por decreto e fica reservado aos CTAs; um filete que atravessa a largura toda da página é
          o oposto de escasso. */}
      <div
        className="h-[3px] w-full"
        style={{
          background: "linear-gradient(90deg, hsl(152,47%,32%), hsl(152,45%,46%))",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-12 lg:px-16">
        <div className="flex flex-col justify-between gap-12 md:flex-row md:items-start">
          <div className="max-w-sm">
            <h3
              className="text-2xl tracking-tight"
              style={{
                color: "hsl(210,60%,15%)",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
              }}
            >
              Compras Paraguay
              <br />
              {/* Era dourado `hsl(38,90%,60%)` — reprova AA como texto sobre claro (§2). */}
              <span style={{ color: "hsl(152,47%,32%)" }}>Foz do Iguaçu</span>
            </h3>
            <p className="mt-3 text-base" style={{ color: "hsl(210,25%,35%)" }}>
              {t.tagline}
            </p>
            <div className="mt-7 flex items-start gap-3">
              <MapPin
                className="mt-0.5 h-[18px] w-[18px] flex-none"
                style={{ color: "hsl(152,47%,32%)" }}
                aria-hidden="true"
              />
              <p className="text-sm leading-relaxed" style={{ color: SECUNDARIO }}>
                Foz do Iguaçu · Paraná · Tríplice Fronteira
                <br />
                Brasil · Argentina · Paraguai
              </p>
            </div>
          </div>

          <div className="md:text-right">
            <p
              className="mb-4 text-xs font-semibold uppercase tracking-[0.14em]"
              style={{ color: SECUNDARIO }}
            >
              {t.followUs}
            </p>
            <div className="flex items-center gap-3 md:justify-end">
              <a
                href="https://instagram.com/roteirosfoz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram @roteirosfoz"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border bg-white transition-colors hover:bg-[hsl(40,33%,95%)]"
                style={{ borderColor: BORDA }}
              >
                <Instagram
                  className="h-5 w-5"
                  style={{ color: "hsl(210,60%,15%)" }}
                />
              </a>
              <a
                href="https://www.facebook.com/roteirofoz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook @roteirofoz"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border bg-white transition-colors hover:bg-[hsl(40,33%,95%)]"
                style={{ borderColor: BORDA }}
              >
                <Facebook
                  className="h-5 w-5"
                  style={{ color: "hsl(210,60%,15%)" }}
                />
              </a>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 md:justify-end">
              {[
                { href: "/roteiros-de-compras/compras-paraguai-ciudad-del-este", label: t.roteirosLink },
                { href: "/roteiros-de-compras", label: t.roteirosHubLink },
                { href: "/transfer", label: t.transferLink },
                { href: "/triplice-fronteira", label: t.tripleLink },
                { href: "/sobre", label: t.aboutLink },
                { href: "/aviso-legal", label: t.legalLink },
                { href: "/contato", label: t.contactLink },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="border-b pb-0.5 text-sm transition-colors hover:text-[hsl(210,60%,15%)]"
                  style={{ color: SECUNDARIO, borderColor: BORDA }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div
          className="mt-11 flex flex-wrap justify-between gap-3 border-t pt-6"
          style={{ borderColor: BORDA }}
        >
          <p className="max-w-3xl text-[13px]" style={{ color: SECUNDARIO }}>
            {t.disclaimer}
          </p>
          <p className="text-[13px]" style={{ color: SECUNDARIO }}>
            {new Date().getFullYear()} Compras Paraguay · Foz do Iguaçu
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
