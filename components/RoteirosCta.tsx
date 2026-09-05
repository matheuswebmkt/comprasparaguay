// Filepath: components/RoteirosCta.tsx
// Version: 2.0
// Nome da Versão: "Fechamento no padrão — dourado para o wizard, link para os prontos"
//
// Fechamento compartilhado por SETE páginas (/atrativos, atrativo individual, nichos, hotel,
// /onde-comer, parceiro, /triplice-fronteira). Qualquer mudança aqui propaga para todas.
//
// ── O QUE SAIU, E NÃO VOLTA ──────────────────────────────────────────────────────────────────
//  1. FUNDO `linear-gradient(180deg, azul 40% → verde 25%)` + `borderTop`. Campo de cor
//     inventado, e ainda com DUAS hues — §8.2 admite Areia ou branco, só.
//  2. DISCO COM ÍCONE `Route` de 64px no topo. Mobília; §8-bis subtrai. O fechamento de
//     `/roteiros` tinha um disco igual (com `Compass`) e saiu pelo mesmo motivo.
//  3. CTA em `hsl(38,90%,55%) → hsl(35,82%,47%)` com rótulo `text-base`: dourado com texto
//     branco dá 3.02:1 e REPROVA WCAG AA. Só passa como texto grande, que exige ≥18px bold
//     (design-system.md §2). Agora `text-lg font-bold`, que é o que sustenta o contraste.
//  4. `max-w-xl` e `text-2xl font-bold` próprios → `.rf-head` + `.rf-title` (§8.1).
//
// ── A INVERSÃO DE CTA (decisão do usuário) ───────────────────────────────────────────────────
// Antes havia UM botão dourado apontando para `/roteiros`. Agora o dourado leva ao wizard
// (`/montar-roteiro`, o caminho de conversão) e "Roteiros prontos de 1, 2 e 3 dias" fica como
// link de texto ao lado. Continua UM botão preenchido — §8-bis conta CTA por botão cheio, e
// link de texto na prosa não conta.

"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SHARED_UI } from "@/lib/i18n/shared";
import { internalUrl } from "@/lib/utm";
import TituloComDestaque from "@/components/TituloComDestaque";

export default function RoteirosCta({
  ctaType,
  title,
  text,
}: {
  ctaType: string;
  title?: string;
  text?: string;
}) {
  const { locale } = useLocale();
  const t = SHARED_UI[locale].roteirosCta;
  return (
    /* ⓘ Fundo BRANCO, cravado. Como este bloco fecha sete páginas diferentes, não dá para garantir
       o alternado do §7.5 aqui dentro — ao padronizar cada página, conferir o tom da seção
       imediatamente acima e resolver LÁ, invertendo a penúltima seção.
       ⚠️ Este arquivo já teve uma prop `fundo: "branco" | "areia"` para isso, e ela foi retirada.
       Não porque a ideia seja errada — porque ficou sem consumidor no mesmo dia em que nasceu.
       Ela existiu por uma cauda de `/triplice-fronteira` em que NENHUM tom servia para a
       penúltima seção (Areia colidia acima, branco colidia com este bloco, e o §8.2 não tem um
       terceiro); a remoção de uma seção dissolveu o impasse. Se outra página recriar essa
       situação — e é uma situação real, não hipotética — reintroduzir a prop é a saída certa. */
    <section
      className="rf-section relative overflow-hidden"
      style={{ background: "hsl(0,0%,100%)" }}
    >
      <div
        className="rf-grain pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-multiply"
        aria-hidden
      />

      <div className="section-container relative z-10">
        {/* Sem eyebrow: é fechamento, não tema novo — a exceção que o §8.1 documenta. */}
        <div className="rf-head">
          <h2 className="rf-title" style={{ marginTop: 0 }}>
            <TituloComDestaque texto={title ?? t.title} destaque="roteiro" />
          </h2>
          <p className="rf-sub">{text ?? t.text}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
          <Link
            href={internalUrl("/atrativos/compras-paraguai-ciudad-del-este", ctaType)}
            className="group inline-flex items-center gap-2 rounded-3xl px-8 py-4 text-lg font-bold text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
            style={{
              background:
                "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)",
            }}
          >
            {t.ctaPrincipal}
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>

          <Link
            href={internalUrl("/roteiros-de-compras", `${ctaType}-atrativos`)}
            className="group inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold underline decoration-1 underline-offset-4"
            style={{
              color: "hsl(152,47%,30%)",
              textDecorationColor: "hsla(152,40%,60%,0.5)",
            }}
          >
            {t.ctaProntos}
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
