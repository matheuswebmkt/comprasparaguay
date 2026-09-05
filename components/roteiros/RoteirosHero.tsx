// Filepath: components/roteiros/RoteirosHero.tsx
// Version: 9.0
// Nome da Versão: "Constelação de roteiro — Areia puro, copy protagonista"
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
//   2. A DIREITA NÃO É UM RETÂNGULO. É uma constelação: o núcleo "você" emite um filamento por
//      vez até a miniatura de um atrativo, na ordem manhã → tarde → noite. Percurso, não lista.
//   3. O ATRATIVO NÃO É CARD. Foto de 54px, nome ao lado, turno abaixo — solto sobre o Areia.
//      Uma versão intermediária usou card de vidro com foto grande: reprovada por peso. O
//      atrativo é DETALHE DE APOIO; a copy é a protagonista.
//   4. UM ÚNICO OBJETO DOURADO na tela: o CTA. Filamentos, selos e badges são Verde Selva
//      (§2 — a escassez do dourado é o que faz ler premium).
//   5. DUAS AÇÕES, hierarquia por PESO. "Fazer meu roteiro" (dourado, cheio) e "Ver roteiros
//      prontos" (texto linkado, verde). O par existe para dar a escolha sob-medida vs. pronto; o
//      secundário NÃO pode virar botão preenchido, senão o dourado deixa de ser único.
//      ⓘ "Fazer" foi escolhido deliberadamente sobre "Montar": §21.1/§21.5/§21.6 proíbem
//      "montar ... roteiro" como promessa ("você monta" contradiz "você responde, a curadoria
//      recomenda"). "Fazer" não está em nenhuma lista de §21.5 e em PT-BR lê tanto como "fazer"
//      quanto como "ter feito" — a ambiguidade elegante que §21.2 pede. Não trocar por "Montar".
//
// ⚠️ SAÍRAM DAQUI POR DECISÃO DO USUÁRIO — não reintroduzir:
//   · o eyebrow "Roteiros de 1 a 7 dias";
//   · a faixa com os três ícones de turno + "Cada dia organizado por manhã, tarde e noite…"
//     (os ícones serão reaproveitados na SEGUNDA DOBRA);
//   · as lavagens de cor no fundo (duas verdes, uma dourada) e o campo luminoso verde atrás da
//     constelação. Se o claro voltar a ler como "chapado", a correção é o grão e a densidade dos
//     filamentos — NÃO campo de cor no fundo.
//
// ⚠️ REGRAS DE COPY QUE ESTE ARQUIVO JÁ VIOLOU E NÃO PODE VIOLAR DE NOVO:
//   · §21.1-bis — nunca "sua viagem" solto (o escopo é DENTRO de Foz).
//   · §21.6 — o H1 da home é sobre ROTEIRO; "o que fazer em Foz" pertence ao pilar dedicado.
//   · §21.1-ter — nada de "curadoria"/"especialista" como texto no hero (o eyebrow "Curadoria
//     local" foi reprovado na R2 e já foi reintroduzido por engano uma vez).
//   · "roteiro" no H1 E no CTA; "Foz do Iguaçu" no H1. UM CTA.
//   · "Organize" é deliberado e sancionado por §21.1-ter, que lista o que a pessoa "descobre,
//     ORGANIZA, economiza ou evita" como vocabulário de hero.

"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { HOME_UI } from "@/lib/i18n/home";
import { SHARED_UI } from "@/lib/i18n/shared";
import { internalUrl } from "@/lib/utm";
import RoteiroConstelacao from "@/components/home/RoteiroConstelacao";

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
      style={{ background: "hsl(40,33%,97%)" }}
    >
      {/* Grão: dá textura ao Areia sem introduzir cor. É o que impede o claro de
          ler como chapado, agora que não há mais lavagens nem foto. */}
      <div
        className="rf-grain pointer-events-none absolute inset-0 opacity-[0.055]"
        style={{ mixBlendMode: "multiply" }}
        aria-hidden="true"
      />

      <div className="section-container relative z-10 py-10">
        <div className="grid items-center gap-11 lg:grid-cols-[minmax(0,48fr)_minmax(0,52fr)] lg:gap-14">
          {/* ── ESQUERDA: a copy, sozinha ──────────────────────────────── */}
          <div className="min-w-0">
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
              className="rf-rise rf-d2 mt-6 max-w-[44ch] text-[1.0625rem] leading-relaxed"
              style={{ color: "hsl(210,25%,38%)" }}
            >
              {t.subtitle}
            </p>

            {/* Duas ações, LADO A LADO, com hierarquia por peso — não dois botões preenchidos.
                O secundário é texto linkado: dourado continua sendo o único objeto cheio na tela. */}
            <div className="rf-rise rf-d3 mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Link
                href={internalUrl("/atrativos/compras-paraguai-ciudad-del-este", "home-hero")}
                className="group inline-flex items-center gap-2 rounded-3xl px-8 py-4 text-lg font-bold text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)",
                }}
              >
                {cta.ctaPrincipal}
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>

              <Link
                href={internalUrl("/roteiros-de-compras", "home-hero-atrativos")}
                className="group inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold underline decoration-1 underline-offset-4 transition-colors"
                style={{ color: "hsl(152,47%,30%)", textDecorationColor: "hsla(152,40%,60%,0.5)" }}
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
          </div>

          {/* ── DIREITA: a constelação ─────────────────────────────────── */}
          {/* ⚠️ NÃO puxar o palco para cima com margem negativa. Já foi tentado (−128px, para
              alinhar o chip "Dia N de N" com o topo do H1) e REPROVADO: os anéis orbitais são
              a moldura visível da composição, e o `overflow-hidden` da seção decapitava o arco
              de cima. A opacidade baixa dos anéis (0.13–0.20) engana quem lê só o código — na
              tela eles aparecem, e cortá-los lê como bug. */}
          <div className="rf-rise rf-d4 min-w-0">
            <RoteiroConstelacao />
          </div>
        </div>
      </div>
    </section>
  );
}
