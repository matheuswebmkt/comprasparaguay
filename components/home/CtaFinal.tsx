// Filepath: components/home/CtaFinal.tsx
// Version: 4.0
// Nome da Versão: "Fechamento só com o CTA de reserva: link secundário e a linha de rodapé saíram"
// Baseado na Versão: 3.3 ("fundo vira AREIA — a seção de transfer deslocou a alternância da home").
// Baseado na Versão: 3.2 ("fechamento converte pelo mesmo caminho do hero: 'Reservar data' abre o modal").
//
// Última seção da home: a promessa dita de frente, no registro do hero — NÓS levamos, com veículo
// privativo e guia especialista, e o retorno ao Brasil com as compras feitas. Antes este bloco era
// fechamento por PERDA ("não vá para a ponte sem um plano"); a copy atual não ameaça custo nenhum,
// ela nomeia o serviço. O encadeamento das outras seções segue: ganho (hero) → cenário (dores) →
// serviço (transfer, `autoridade`) → objeção (FAQ) → contrato final (aqui).
//
// ⚠️ FUNDO AREIA — um dos dois fundos padrão do projeto (o outro é branco). NÃO inventar cor de
// fundo aqui. Foram reprovados, nesta ordem: gradiente navy→verde escuro, verde-escuro de hue única
// e campo verde claro. A seção não precisa de fundo próprio — o CTA dourado já é o ponto focal.
// ⓘ É AREIA desde a v3.3: a home alterna rigorosamente, e a TransferPitchCard inserida no meio
// deslocou a cor de tudo que vem depois dela. Fechar em areia também deixa o Footer (escuro) tocar
// um fundo claro — era assim antes da v3.1.
//
// ⚠️ UM CTA, E SÓ ELE. Já houve aqui um link Verde Selva ("Ver atrativos e shoppings →") e uma linha
//    de reassurance ("Leva menos de 2 minutos"). Os dois saíram por decisão do usuário: o link oferecia
//    uma saída de leitura exatamente no ponto de conversão, e a linha prometia INSTANTE — §21.2 proíbe
//    vender canal e velocidade, e o tempo de preencher o modal não é promessa que a gente faça.
//    Não reintroduzir nenhum dos dois.

"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { HOME_UI } from "@/lib/i18n/home";
import ReservarDataCta from "@/components/ReservarDataCta";

export default function CtaFinal() {
  const { locale } = useLocale();
  const t = HOME_UI[locale].ctaFinal;
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
            volta a ter respiro diferente das outras. O CTA é `inline-flex`: o `text-center` do
            invólucro já centraliza, não precisa de flex próprio. */}
        <div className="text-center">
          {/* ⚠️ `text-lg font-bold` NÃO É OPCIONAL. O dourado do projeto com texto branco dá
              3.02:1: reprova WCAG AA para texto normal e só passa como texto GRANDE, cujo
              limiar é 3:1 — margem de 0.02. O tamanho do rótulo é o que sustenta o contraste
              sozinho (§2). Padrão idêntico ao do hero e ao da seção de transfer. */}
          <ReservarDataCta
            ctaType="home_cta_final_reserva"
            source="home-cta-final"
            className="inline-flex items-center justify-center rounded-3xl px-8 py-4 text-lg font-bold text-white transition-transform hover:scale-[1.03] active:scale-[0.98]"
            style={{
              background:
                "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
