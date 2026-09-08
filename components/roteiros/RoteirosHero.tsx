// Filepath: components/roteiros/RoteirosHero.tsx
// Version: 12.1
// Nome da Versão: "Subtítulo do hero a 48rem — a última linha não pode ficar com uma palavra só"
//
// ── CINCO REPROVAÇÕES ANTES DESTA. LER ANTES DE MEXER. ───────────────────────────────────────
//   v4.0  foto full-bleed + véu ESCURO NAVY, tipo médio        → genérico (é o que toda OTA faz)
//   v5.0  texto esquerda + foto direita                        → "wireframe limpo"
//   v6.x  o mesmo + vidro, sombra e lavagens                   → "simples, estático, sem vida"
//   v7.0  o mesmo + card animado à direita                     → "widget", "design pobre"
//   v8.0  foto em tela cheia + faixa de nomes alternando       → "parece site de turismo", a
//                                                                animação de nomes é "fraca demais"
//
// ⚠️ O PADRÃO DAS v4–v7: o MESMO esqueleto (coluna de texto à esquerda, retângulo à direita), só
// mudando o conteúdo do retângulo. A v8.0 fugiu disso indo para foto em tela cheia — e caiu no
// oposto: virou cartaz de turismo, com a imagem cobrindo tudo.
//
// ── O QUE ESTA VERSÃO FAZ DE DIFERENTE ───────────────────────────────────────────────────────
//   1. NÃO HÁ FOTO DE FUNDO. Fundo é Areia puro (`hsl(40,33%,97%)`) + grão. Isto REALINHA o hero
//      com o design system, que sempre pediu imagem contida e nunca full-bleed (§14); a v8.0
//      ignorava essa regra por exceção autorizada — a exceção acabou.
//   2. UMA COLUNA, CENTRADA. A copy É o hero: não há nada à direita. A grade `48fr/52fr` e a
//      constelação que a habitava foram REMOVIDAS por decisão do usuário (v11.0) — com o produto
//      reposicionado como serviço reservável, a animação virou ruído: ela contava uma história de
//      "dia organizado" que a copy conta melhor, e disputava o olhar com o CTA.
//   3. MEDIDA DO TÍTULO ≠ MEDIDA DA LEITURA. O bloco abre em 64rem para o display respirar (duas
//      linhas em vez de três no H1) e o subtítulo volta a 48rem com `mx-auto`. As DUAS são medidas
//      documentadas em §4.3; o salto 42→48rem tem um objetivo só: tirar a última palavra sozinha da
//      linha final do subtítulo (viúva). Se ela voltar com outra copy, a correção é `textWrap:
//      "pretty"` no parágrafo, não mais largura.
//   4. UM ÚNICO OBJETO DOURADO na tela: o CTA. Os detalhes restantes são Verde Selva (§2 — a escassez
//      do dourado é o que faz ler premium).
//   5. UMA ÚNICA AÇÃO: o dourado "Reservar data". O par com link de texto saiu (v12.0) — §8-bis pede
//      UM CTA por seção, e a home já tem o seu segundo ponto de conversão lá embaixo, no `CtaFinal`.
//      ⓘ O dourado não é um `<Link>`: é o `ReservarDataCta`, que abre o modal direto no calendário.
//      Um botão que diz "reservar" e leva a uma página de conteúdo é a promessa e a tela desalinhadas
//      (§21.2). O rótulo nomeia o resultado — a data —, nunca o canal nem o instante.
//
// ⚠️ SAÍRAM DAQUI POR DECISÃO DO USUÁRIO — não reintroduzir:
//   · a CONSTELAÇÃO da direita (`components/home/RoteiroConstelacao.tsx`, DELETADO na v11.0, junto
//     das chaves `HOME_UI.*.constelacao`): núcleo "você" + filamentos até a miniatura de um atrativo.
//     Vivia numa segunda coluna de grade; hoje o hero é uma coluna centrada só. Não trocar o espaço
//     vazio por card, mapa, foto ou "palco" de atrativo — o pedido foi o contrário: menos coisa.
//   · o eyebrow "Roteiros de 1 a 7 dias";
//   · o link Verde Selva "Ver atrativos e shoppings" ao lado do CTA (v12.0). Não voltar a parear o
//     dourado com uma segunda ação: com um produto só, duas saídas no mesmo nível só diluem a que
//     converte. `/roteiros-de-compras` continua linkada no `CtaFinal`, nos hubs e no `RoteirosCta`.
//   · a faixa com os três ícones de turno + "Cada dia organizado por manhã, tarde e noite…"
//     (os ícones serão reaproveitados na SEGUNDA DOBRA);
//   · as lavagens de cor no fundo (duas verdes, uma dourada) e o campo luminoso verde que havia
//     atrás da animação da direita. Se o claro voltar a ler como "chapado", a correção é o grão e o
//     ritmo tipográfico da coluna — NÃO campo de cor no fundo.
//
// ⚠️ REGRAS DE COPY QUE ESTE ARQUIVO JÁ VIOLOU E NÃO PODE VIOLAR DE NOVO:
//   · §21.1-bis — nunca "sua viagem" solto: o serviço sai do hotel em Foz do Iguaçu e volta a Foz.
//   · §21.1-ter — o hero é sobre o VISITANTE. O guia entra aqui porque É parte do que se contrata
//     (carro + guia + data), não como credencial nossa: "curadoria", "especialista" solto e "nosso
//     time" continuam proibidos neste ponto (o eyebrow "Curadoria local" já foi reprovado na R2).
//   · §21.2 — o CTA promete o resultado (a data), nunca o canal nem o instante.
//   · ⚠️ "roteiro" SAIU do H1 e do CTA por decisão explícita do usuário: o que se contrata é o dia de
//     compras com carro privativo e guia, não um planejamento teórico. O H1 lidera pela keyword
//     "compras no Paraguai" e nomeia o serviço; "Foz do Iguaçu" passou ao subtítulo, que é onde o carro
//     de fato começa.
//   · UM CTA dourado no hero — o secundário é texto linkado, nunca segundo botão cheio.

"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { HOME_UI } from "@/lib/i18n/home";
import { SHARED_UI } from "@/lib/i18n/shared";
import ReservarDataCta from "@/components/ReservarDataCta";

export default function RoteirosHero() {
  const { locale } = useLocale();
  const t = HOME_UI[locale].hero;
  const cta = SHARED_UI[locale].roteirosCta;
  return (
    // ⚠️⚠️ A ALTURA DA HERO É RELAÇÃO, NÃO CONSTANTE. `min-h-[100svh]` + `justify-center`:
    // a seção SEMPRE ocupa a viewport inteira e o conteúdo se centra sozinho no espaço que
    // existir. Não há mais `pb-*` calibrado à mão para "chegar" numa altura.
    //
    // ⚠️ NÃO voltar a padding fixo de rodapé. A versão anterior somava `pt-20` + altura do
    // palco + `pb-20` e torcia para bater com a viewport: em qualquer tela de altura diferente
    // sobrava faixa vazia embaixo ou o conteúdo estourava, e cada edição no palco exigia
    // recalibrar o padding na mão. O que fecha a conta agora é o `justify-center`.
    //
    // ⓘ `svh` e não `dvh`: `dvh` muda quando a barra do navegador móvel esconde/aparece, e a
    // hero inteira reflui durante o scroll. `svh` é estável.
    //
    // ⓘ `pt-16` (64px) = exatamente a altura da navbar `fixed top-0 h-16`. Isto é a única
    // constante legítima aqui, porque espelha uma geometria real de outro componente —
    // conferir `components/navbar/navbar.tsx` antes de mudar.
    <section
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-16"
      style={{ background: "hsl(0,0%,100%)" }}
    >
      {/* Grão: dá textura ao fundo sem introduzir cor. É o que impede o claro de
          ler como chapado, agora que não há mais lavagens nem foto. */}
      <div
        className="rf-grain pointer-events-none absolute inset-0 opacity-[0.055]"
        style={{ mixBlendMode: "multiply" }}
        aria-hidden="true"
      />

      <div className="section-container relative z-10 py-10">
        {/* 64rem para o display; o subtítulo volta a 48rem logo abaixo (§4.3). */}
        <div className="mx-auto max-w-[64rem] text-center">
          <h1
            className="rf-rise rf-d1"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "clamp(2.7rem, 5.1vw, 4.9rem)",
              lineHeight: 0.98,
              letterSpacing: "-0.034em",
              color: "hsl(210,60%,15%)",
              textWrap: "balance",
            }}
          >
            {t.h1Before}
            <em style={{ fontStyle: "italic", fontWeight: 500, color: "hsl(152,47%,30%)" }}>
              {t.h1Strong}
            </em>{" "}
            {t.h1After}
          </h1>

          <p
            className="rf-rise rf-d2 mx-auto mt-6 max-w-[46rem] text-[1.0625rem] leading-relaxed"
            style={{ color: "hsl(210,25%,38%)" }}
          >
            {t.subtitle}
          </p>

          {/* A ÚNICA ação da seção: o dourado cheio. Nada ao lado — §8-bis, um CTA por seção. */}
          <div className="rf-rise rf-d3 mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
            <ReservarDataCta
              ctaType="home_hero_reserva"
              source="home-hero"
              className="group inline-flex items-center gap-2 rounded-3xl px-8 py-4 text-lg font-bold text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
              style={{
                background:
                  "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)",
              }}
            >
              {cta.ctaReserva}
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </ReservarDataCta>
          </div>
        </div>
      </div>
    </section>
  );
}
