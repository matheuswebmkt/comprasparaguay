// Filepath: components/home/CtaFinal.tsx
// Version: 3.1
// Nome da Versão: "Par no fechamento: CTA dourado + 'Roteiros prontos de 1, 2 e 3 dias' (link Verde Selva), como no /triplice-fronteira"
//
// 5ª e última seção da home. A ideia é a ÚNICA que ainda não estava na página: o **custo de não
// planejar**. O hero vende o ganho, a AutoridadeSection vende o mecanismo, os roteiros vendem a prova e o
// FAQ derruba objeção — falta a perda.
//
// ⚠️ FUNDO BRANCO — um dos dois fundos padrão do projeto (o outro é Areia). NÃO inventar cor de
// fundo aqui. Foram reprovados, nesta ordem: gradiente navy→verde escuro, verde-escuro de hue única
// e campo verde claro. A seção não precisa de fundo próprio — o CTA dourado já é o ponto focal.
//
// ⚠️ §21.2 — promete o resultado, nunca o canal nem o instante. "antes de comprar o primeiro
// ingresso" é o timing da DECISÃO da pessoa, não uma promessa de entrega nossa.

"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { HOME_UI } from "@/lib/i18n/home";
import { SHARED_UI } from "@/lib/i18n/shared";
import { internalUrl } from "@/lib/utm";

export default function CtaFinal() {
  const { locale } = useLocale();
  const t = HOME_UI[locale].ctaFinal;
  const cta = SHARED_UI[locale].roteirosCta;
  return (
    <section
      className="rf-section relative overflow-hidden"
      style={{ background: "hsl(0,0%,100%)" }}
    >
      {/* Mesmo grão do hero — textura sem introduzir cor. */}
      <div
        className="rf-grain pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-multiply"
        aria-hidden
      />

      <div className="section-container relative z-10">
        {/* ⚠️ Cabeçalho no padrão único (globals.css). Esta seção tinha o maior H2 da home (até
            52px contra 36px das outras) e o maior padding vertical. Não devolver `fontSize`/
            `lineHeight`/`letterSpacing` inline — inline vence a classe.
            Esta seção não tem eyebrow, e é a única assim: é o fechamento, não um tema novo. */}
        <div className="rf-head">
          <h2 className="rf-title" style={{ marginTop: 0 }}>
            {t.title}
          </h2>

          {/* ⚠️ Sem `max-w-*` próprio. A largura vem de `.rf-head` (42rem), igual às demais
              seções. Havia um `max-w-lg` (32rem) aqui, e era só isso que fazia esta seção parecer
              mais estreita que todas as outras. */}
          <p className="rf-sub">
            {t.subtitle}
          </p>
        </div>

        {/* O espaço acima vem da margem padrão de `rf-head` — sem `mt` próprio, senão esta seção
            volta a ter respiro diferente das outras. */}
        <div className="text-center">
          {/* ⚠️ `text-lg font-bold` NÃO É OPCIONAL. O dourado do projeto com texto branco dá
              3.02:1: reprova WCAG AA para texto normal e só passa como texto GRANDE, cujo
              limiar é 3:1 — margem de 0.02. O tamanho do rótulo é o que sustenta o contraste
              sozinho (§2). Padrão idêntico ao do hero e ao da AutoridadeSection. */}
          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
            <Link
              href={internalUrl("/atrativos/compras-paraguai-ciudad-del-este", "home-cta-final")}
              className="inline-flex items-center justify-center rounded-3xl px-8 py-4 text-lg font-bold text-white transition-transform hover:scale-[1.03] active:scale-[0.98]"
              style={{
                background:
                  "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)",
              }}
            >
              {cta.ctaPrincipal}
            </Link>

            {/* Ação secundária — link Verde Selva, nunca um segundo botão preenchido
                (§8-bis: o dourado tem de continuar o único objeto cheio). Mesmo par
                do /triplice-fronteira. */}
            <Link
              href={internalUrl("/roteiros-de-compras", "home-cta-final-prontos")}
              className="group inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold underline decoration-1 underline-offset-4"
              style={{
                color: "hsl(152,47%,30%)",
                textDecorationColor: "hsla(152,40%,60%,0.5)",
              }}
            >
              {cta.ctaProntos}
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
          </div>

          <p className="mt-5 text-sm" style={{ color: "hsl(210,25%,45%)" }}>
            {cta.footnote}
          </p>
        </div>
      </div>
    </section>
  );
}
