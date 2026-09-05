// Filepath: components/triplice-fronteira/TriplaFronteiraContent.tsx
// Version: 1.1
// Nome da Versão: "No mobile, o link do Marco desce para baixo da foto do Marco"
// Baseado na Versão: 1.0 — "Parte VISÍVEL de /triplice-fronteira (client, i18n), extraída do page.tsx"
"use client";

import Link from "next/link";
import Image from "next/image";
/* `ArrowLeftRight` sobreviveu só como separador ENTRE origem e destino nos cards de travessia,
   onde é informação (o sentido é de ida e volta). As cópias decorativas dele, do `Route` e do
   `MapPin` saíram junto com os eyebrows e o CTA que decoravam. O `CheckCircle2` saiu depois:
   os destaques de cada país trocaram o ícone de lista pela FOTO do atrativo. */
import { ArrowLeftRight } from "lucide-react";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import RelatedAttractionsSection from "@/components/RelatedAttractionsSection";
import RoteirosCta from "@/components/RoteirosCta";
import TituloComDestaque from "@/components/TituloComDestaque";
import CountryFlag from "@/components/CountryFlag";
import { attractions } from "@/app/data/attractions";
import { internalUrl } from "@/lib/utm";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { TRIPLICE_FRONTEIRA_UI } from "@/lib/i18n/triplice-fronteira";

const COUNTRY_CODES = ["BR", "AR", "PY"] as const;

/* Capa por slug, montada UMA vez no módulo — não por render e não por item. `attractions` tem
   ~31 entradas e cada país renderiza 2–4 destaques: um `.find()` por linha percorreria a lista
   inteira toda vez, e o resultado nunca muda dentro de uma sessão. */
const CAPA_POR_SLUG = new Map(attractions.map((a) => [a.slug, a.cover]));

/* Link secundário para a página do Marco (§7.2: texto linkado em Verde Selva, nunca um segundo
   botão preenchido). Extraído porque é renderizado DUAS vezes na seção `elo`, alternadas por
   breakpoint — ver o comentário na fileira de botões. Href, cor e seta ficam num lugar só; com
   o JSX duplicado, as duas cópias divergem na primeira vez que alguém mexe numa delas.
   ⓘ O `className` traz o display (`inline-flex`) porque é ele que muda entre as duas. */
function LinkMarco({ label, className }: { label: string; className: string }) {
  return (
    <Link
      href={internalUrl("/atrativos", "triplice")}
      className={`group items-center gap-1.5 text-[0.9375rem] font-semibold underline decoration-1 underline-offset-4 ${className}`}
      style={{
        color: "hsl(152,47%,30%)",
        textDecorationColor: "hsla(152,40%,60%,0.5)",
      }}
    >
      {label}
      <span
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:translate-x-0.5"
      >
        →
      </span>
    </Link>
  );
}

export default function TriplaFronteiraContent() {
  const { locale } = useLocale();
  const t = TRIPLICE_FRONTEIRA_UI[locale];
  const countries = t.countries.map((c, i) => ({ ...c, country: COUNTRY_CODES[i] }));

  return (
    <>
      <Navbar />
      <main style={{ background: "hsl(40,33%,97%)" }}>
        {/* ── HERO ───────────────────────────────────────────────────────────────
            ⚠️⚠️ ESTA HERO ERA ESCURA — gradiente `hsl(210,60%,10%) → hsl(210,56%,15%) →
            hsl(152,50%,12%)`, navy virando verde-escuro, com o H1 em branco. É a violação mais
            dura do design system: §1 diz "NADA DE FUNDO ESCURO, EM SEÇÃO NENHUMA", e registra
            que duas tentativas de faixa escura já foram reprovadas — **o problema nunca foi
            qual escuro, era ser escuro**. Foz é água, luz e névoa; claro é o default.
            NÃO reintroduzir fundo escuro aqui nem propor variante "só nesta página".

            ⚠️ Saíram junto: o blob DOURADO de 560px com `blur-[120px]` (§8-bis nomeia
            "orbe/blob decorativo"), o eyebrow e o ícone em dourado, `font-black` (§3) e
            `pt-28 sm:pt-32` (§7.6: a navbar tem 64px).

            ⓘ As bandeiras FICAM: são conteúdo, não enfeite — dizem quais países se encontram,
            que é a informação central da página. Diferente dos chips que saíram de `/atrativos`
            e `/onde-comer`, que só repetiam títulos de seções abaixo. */}
        <section className="relative overflow-hidden pt-16" style={{ background: "hsl(40,33%,97%)" }}>
          <div
            className="rf-grain pointer-events-none absolute inset-0 opacity-[0.055]"
            style={{ mixBlendMode: "multiply" }}
            aria-hidden="true"
          />
          <div className="section-container relative z-10 py-20 sm:py-24">
            <div className="rf-head">
              <p className="rf-eyebrow">{t.hero.eyebrow}</p>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  /* Escala única de hero (design-system.md §3) — os mesmos cinco valores da
                     home, de `/roteiros`, `/roteiros/[slug]`, `/atrativos` e `/onde-comer`. */
                  fontWeight: 600,
                  fontSize: "clamp(2.7rem, 5.1vw, 4.9rem)",
                  lineHeight: 0.98,
                  letterSpacing: "-0.034em",
                  color: "hsl(210,60%,15%)",
                  textWrap: "balance",
                }}
              >
                <TituloComDestaque texto={t.hero.h1} destaque={t.hero.h1Destaque} />
              </h1>
              <p className="rf-sub">
                {t.hero.body.map((part, i) =>
                  part.strong ? <strong key={i}>{part.text}</strong> : <span key={i}>{part.text}</span>,
                )}
              </p>

              <div className="mt-6 flex items-center justify-center gap-2">
                <CountryFlag country="BR" className="h-5 w-7" />
                <CountryFlag country="AR" className="h-5 w-7" />
                <CountryFlag country="PY" className="h-5 w-7" />
              </div>

              {/* CTA de rolagem — mesmo padrão de `/atrativos`, `/onde-comer` e
                  `/roteiros/[slug]`. Âncora interna, não `<Link>`. */}
              <div className="mt-9">
                <a
                  href="#a-fronteira"
                  className="group inline-flex items-center gap-2 rounded-3xl px-8 py-4 text-lg font-bold text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)",
                  }}
                >
                  Entender a fronteira
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-y-0.5"
                  >
                    ↓
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* O ELO
            ⓘ `id` + `scroll-mt-24`: alvo do CTA da hero. Fundo BRANCO porque a hero acima é
            Areia (§7.5) — antes esta seção não declarava fundo e herdava o Areia do `<main>`,
            colando as duas.
            ⚠️ O CONTEÚDO desta seção ainda não passou pelo padrão (`font-black`, eyebrow em
            dourado como texto, chips). Só o invólucro foi ajustado. */}
        <section
          id="a-fronteira"
          className="rf-section scroll-mt-24"
          style={{ background: "hsl(0,0%,100%)" }}
        >
          <div className="section-container">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                {/* ⚠️ Eyebrow em Verde Selva. Estava em `hsl(35,82%,40%)` com ícone em
                    `hsl(35,82%,47%)` — dourado como COR DE TEXTO sobre fundo claro é violação em
                    qualquer tamanho (§2/§7.4). O ícone saiu junto: os eyebrows do projeto são
                    texto puro.
                    ⓘ `.rf-eyebrow` sem `.rf-head` porque esta coluna é alinhada à ESQUERDA — a
                    classe é só tipografia; quem centraliza é o `.rf-head` (§8.1, mesma exceção
                    documentada para `PilaresFoz`). */}
                <p className="rf-eyebrow mb-4">{t.elo.eyebrow}</p>
                {/* ⚠️ `font-black` (900) com Fraunces é proibido pelo §3, e a escala própria
                    (`text-2xl sm:text-3xl md:text-4xl`) divergia de todos os H2 do projeto.
                    `.rf-title` entrega os 600 e a escala única; `marginTop: 0` porque aqui ela
                    vem logo abaixo do eyebrow, não de um bloco de cabeçalho. */}
                <h2 className="rf-title" style={{ marginTop: 0 }}>
                  {t.elo.title}
                </h2>
                <p className="mt-5 text-base leading-relaxed" style={{ color: "hsl(210,25%,35%)" }}>
                  {t.elo.p1.map((part, i) => (part.strong ? <strong key={i}>{part.text}</strong> : <span key={i}>{part.text}</span>))}
                </p>
                <p className="mt-4 text-base leading-relaxed" style={{ color: "hsl(210,25%,35%)" }}>
                  {t.elo.p2.map((part, i) => (part.strong ? <strong key={i}>{part.text}</strong> : <span key={i}>{part.text}</span>))}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-2.5">
                  {t.elo.tags.map((s) => (
                    <span key={s} className="inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold" style={{ background: "white", border: "1px solid hsl(214,25%,88%)", color: "hsl(210,56%,23%)" }}>
                      {s}
                    </span>
                  ))}
                </div>
                {/* ⓘ O CTA dourado usa a família de seção (`text-lg px-8 py-4 rounded-3xl`, §2).
                    O tamanho do rótulo é decisão de HIERARQUIA, não de acessibilidade: o gradiente
                    âmbar com rótulo branco não passa em AA em tamanho nenhum (2.79 na ponta escura,
                    2.00 na clara) — dívida conhecida e aceita, ver design-system.md §2, inclusive
                    os três enganos já pagos ali. Aumentar o rótulo NÃO conserta contraste.
                    ⓘ O secundário é link Verde Selva, não um segundo botão preenchido (§7.2).

                    ⚠️ O LINK DO MARCO SÓ APARECE AQUI DE `lg` PRA CIMA. Abaixo disso ele é
                    renderizado embaixo da FOTO do Marco, na outra célula do grid — o destino do
                    link é aquela foto, e no mobile a coluna única já põe as duas coisas juntas.
                    As duas instâncias são o mesmo `LinkMarco`, alternado por breakpoint.

                    ⚠️ NO DESKTOP OS DOIS FICAM NA MESMA LINHA, e isso é restrição de LARGURA, não
                    de estilo: a coluna do grid tem ~588px (`section-container` 1216 ÷ 2, menos
                    `gap-10`). Com o rótulo antigo do botão ("Ver roteiros com a fronteira") o par
                    pedia ~655px e o link caía para a linha de baixo. O rótulo virou "Ver roteiros
                    prontos" — o mesmo de `shared.ts`, usado em todo o resto do projeto — e o par
                    passou a caber com ~20px de folga.
                    → Ao mexer em `t.elo.cta` ou `t.elo.link`, conferir que ainda cabem. O
                      `flex-wrap` fica: na faixa 1024–1340 a coluna aperta e empilhar é o
                      comportamento correto. */}
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                  <Link
                    href={internalUrl("/atrativos/compras-paraguai-ciudad-del-este", "triplice")}
                    className="group inline-flex items-center gap-2 rounded-3xl px-8 py-4 text-lg font-bold text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)",
                    }}
                  >
                    {t.elo.cta}
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                  <LinkMarco label={t.elo.link} className="hidden lg:inline-flex" />
                </div>
              </div>
              {/* ⓘ Wrapper: a célula do grid deixou de ser o cartão da foto e passou a ser
                  foto + link do Marco (este último só abaixo de `lg`). De `lg` pra cima o link
                  é `display:none`, então a altura da célula continua sendo a do cartão e o
                  `items-center` do grid alinha exatamente como antes. */}
              <div>
                <div className="overflow-hidden rounded-3xl border shadow-tef-lg" style={{ borderColor: "hsl(214,25%,88%)" }}>
                  <div className="relative aspect-[4/3]">
                    <Image
                      src="/images/atrativos/marco-das-tres-fronteiras/cover.webp"
                      alt="Marco das Três Fronteiras — encontro de Brasil, Argentina e Paraguai em Foz do Iguaçu"
                      fill
                      /* ⚠️ `sizes` descreve o que o `object-cover` EXIGE, não a largura da caixa.
                         A fonte é 16:9 e a caixa é 4:3: o navegador escala pela ALTURA e corta a
                         largura, então precisa de mais pixels horizontais do que a caixa tem.
                         Coluna ≈ 588px → caixa 588×441 → altura 441 sobre fonte de 720 dá fator
                         0.61 → largura renderizada ≈ 784px. Com `600px` o Next servia menos que
                         isso e a foto era ampliada ~1.3× (o "mole" do §8-ter).
                         900px faz o Next escolher 1080 do `deviceSizes`, com folga para DPR>1 —
                         e ele nunca serve acima da largura do arquivo original. */
                      sizes="(max-width: 1024px) 100vw, 900px"
                      className="object-cover"
                    />
                  </div>
                </div>
                <LinkMarco
                  label={t.elo.link}
                  className="mt-5 inline-flex lg:hidden"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── UMA SEÇÃO POR PAÍS ─────────────────────────────────────────────────
            Três irmãs geradas pelo mesmo `map`, em zigue-zague (coluna de texto troca de lado a
            cada iteração via `order-2`). Mesmo tratamento que "O ELO" recebeu logo acima.

            ⚠️ A PARIDADE DOS FUNDOS FOI INVERTIDA. Era `i % 2 === 0 ? white : areia`, o que punha
            a primeira delas em BRANCO logo depois de "O ELO", que também é branco — duas seções
            coladas sem fronteira visível (§7.5). Agora a série começa em Areia e alterna
            areia → branco → areia. O card de destaques usa sempre o tom OPOSTO ao da sua seção,
            então a expressão dele inverteu junto: as duas paridades são espelho uma da outra e
            precisam mudar em par.
            → Consequência para quem for padronizar a seção seguinte ("como circular", ainda com
              `.section-texture`): ela agora encosta em AREIA, não em branco.

            ⓘ `.rf-eyebrow`/`.rf-title` soltos, sem `.rf-head`: a coluna é alinhada à esquerda e
            o `.rf-head` centraliza (§8.1) — mesma exceção já documentada em "O ELO". */}
        {countries.map((c, i) => (
          <section
            key={c.country}
            className="rf-section"
            style={{ background: i % 2 === 0 ? "hsl(40,33%,97%)" : "white" }}
          >
            <div className="section-container">
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                <div>
                  {/* ⓘ A BANDEIRA FICA, e isso não contradiz o "eyebrow é texto puro" aplicado em
                      "O ELO". Lá o glifo era decorativo e o eyebrow se explicava sozinho; aqui a
                      bandeira é a identidade do país — o assunto da página são três deles, e é o
                      único sinal que diferencia as três seções à primeira vista. Reduzida de
                      `h-6 w-9` para `h-5 w-7`: 24px de altura dominava um rótulo de 12px. */}
                  <div className="mb-4 flex items-center gap-3">
                    <CountryFlag country={c.country} className="h-5 w-7 flex-none" />
                    {/* ⚠️ Era cinza `hsl(210,25%,55%)` com `tracking-[0.16em]` próprio — escala e
                        cor inventadas. `.rf-eyebrow` entrega o Verde Selva e o 0.2em de todos os
                        eyebrows do projeto. */}
                    <span className="rf-eyebrow">{c.label}</span>
                  </div>
                  {/* ⚠️ `font-black` (900) é proibido pelo §3 na Fraunces, e o
                      `text-2xl sm:text-3xl` era uma quarta escala de H2 na mesma página.
                      `marginTop: 0` porque o título vem colado no eyebrow, não de um `.rf-head`. */}
                  <h2 className="rf-title" style={{ marginTop: 0 }}>
                    {c.city}
                  </h2>
                  <div className="mt-5 space-y-4">
                    {c.text.map((p, j) => (
                      <p key={j} className="text-base leading-relaxed" style={{ color: "hsl(210,25%,35%)" }}>{p}</p>
                    ))}
                  </div>
                </div>
                {/* ── DESTAQUES: LISTA MORTA → ATALHO PARA O ATRATIVO ─────────────────
                    Era `CheckCircle2` + texto solto: quatro nomes que o visitante lia e não
                    podia seguir. Agora cada linha é um `<Link>` para o atrativo real, com a
                    miniatura da capa — o mesmo vocabulário dos mini-cards da hero da home e da
                    timeline de `/roteiros`.

                    ⓘ LADO A LADO em grade de 3 (decisão do usuário), foto em cima e rótulo
                    embaixo — não a linha horizontal miniatura+texto da timeline. Numa coluna de
                    ~530px úteis, três células de ~169px não comportam foto E texto na horizontal.
                    Por isso os cards passaram a ter no máximo 3 destaques.
                    ⓘ SEM card por item. O card externo já tem borda e fundo; dar borda+sombra a
                    cada célula recriaria a caixa-dentro-de-caixa que a `RoteiroTimeline` acabou
                    de perder. O hover é que separa os itens.
                    ⓘ `.rf-slot`/`.rf-slot-foto` vêm do `globals.css` e são só `transform` — por
                    isso dá para reusá-las aqui sem herdar nenhum estilo de caixa da timeline.
                    Não reescrever como utilidade Tailwind: `ease-[cubic-bezier(...)]` e
                    `hover:scale-[...]` já falharam SILENCIOSAMENTE duas vezes neste projeto (a
                    classe sai no HTML, o estilo computado não muda) — o motivo está no
                    `globals.css`, junto da regra, com o bloco de `prefers-reduced-motion` (§10.3).
                    ⓘ Caixa `aspect-[4/3]`, que é a proporção NATIVA das capas: aqui o
                    `object-cover` não corta nada e o `sizes` pode ser a largura real da célula —
                    ao contrário da timeline e da constelação, onde a caixa é quadrada e o §8-ter
                    obriga a pedir o dobro para não ampliar. */}
                <div className="rounded-3xl border p-7" style={{ borderColor: "hsl(214,25%,90%)", background: i % 2 === 0 ? "hsl(40,33%,98.5%)" : "hsl(40,33%,97%)" }}>
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-wide" style={{ color: "hsl(210,56%,23%)" }}>
                    {t.seeDoTitle}
                  </h3>
                  <ul className="grid grid-cols-3 gap-3">
                    {c.highlights.map((h) => {
                      const capa = CAPA_POR_SLUG.get(h.slug);
                      /* Slug sem atrativo não vira célula sem foto: some. Um item de texto no
                         meio de uma grade ilustrada lê como imagem quebrada, e o destino não
                         existiria de qualquer jeito. */
                      if (!capa) return null;
                      return (
                        <li key={h.slug}>
                          <Link
                            href={internalUrl(`/atrativos/${h.slug}`, "triplice")}
                            className="rf-slot block"
                          >
                            <span className="relative block aspect-[4/3] overflow-hidden rounded-xl bg-[hsl(214,50%,96%)]">
                              <Image
                                src={capa}
                                alt=""
                                fill
                                sizes="(max-width: 1023px) 33vw, 200px"
                                className="rf-slot-foto object-cover"
                              />
                            </span>
                            <span className="mt-2 block text-[0.8125rem] font-semibold leading-snug" style={{ color: "hsl(210,56%,23%)" }}>
                              {h.label}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  {/* Fecho do card: leva ao índice completo. Recupera, num lugar mais útil, o
                      destino do CTA que saiu junto com a seção "Um dia, três países".
                      Link Verde Selva, não botão — §8-bis conta CTA por botão cheio, e três
                      botões (um por país) competiriam com o dourado de "O ELO". */}
                  <Link
                    href={internalUrl("/atrativos", "triplice")}
                    className="group mt-5 inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold underline decoration-1 underline-offset-4"
                    style={{ color: "hsl(152,47%,30%)", textDecorationColor: "hsla(152,40%,60%,0.5)" }}
                  >
                    {t.seeAllAttractions}
                    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* ── LOGÍSTICA: COMO CIRCULAR ───────────────────────────────────────────
            ⚠️ Saiu o `.section-texture` (Azul Gelo + trama de pontos): §8.2 admite Areia ou
            branco, e um terceiro campo de cor no meio da página quebrava a alternância que a
            série de países acabou de estabelecer. BRANCO porque a vizinha de cima é o país
            nº 3, que é Areia (§7.5).
            ⚠️ Saiu o eyebrow DOURADO (`hsl(35,82%,40%)` + ícone em `hsl(35,82%,47%)`): dourado
            como cor de texto sobre fundo claro é violação em qualquer tamanho (§7.4). O ícone
            saiu junto — eyebrow decorado é o mesmo caso já corrigido em "O ELO".
            ⓘ Cabeçalho agora CENTRALIZADO (`.rf-head`, que já traz o `max-w` e o `margin-bottom`).
            Diferente de "O ELO" e dos países, aqui embaixo não há coluna de imagem: o que vem é
            uma grade de largura inteira, e o padrão do projeto para esse caso é centralizar. */}
        <section className="rf-section" style={{ background: "hsl(0,0%,100%)" }}>
          <div className="section-container">
            <div className="rf-head">
              <p className="rf-eyebrow">{t.crossings.eyebrow}</p>
              <h2 className="rf-title">{t.crossings.title}</h2>
            </div>
            {/* Conteúdo solto, SEM card (mesmo padrão das outras seções): divisórias verticais sutis
                entre as duas travessias no sm+ (2 colunas = 1 filete, simétrico); mobile empilha. */}
            <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-0 sm:divide-x sm:divide-[hsl(214,25%,92%)]">
              {t.crossings.items.map((c) => (
                <div key={c.via} className="px-5">
                  <div className="flex items-center gap-2 mb-2 text-sm font-bold" style={{ color: "hsl(210,60%,15%)" }}>
                    {c.from} <ArrowLeftRight className="h-4 w-4" style={{ color: "hsl(210,25%,55%)" }} aria-hidden="true" /> {c.to}
                  </div>
                  <p className="text-sm" style={{ color: "hsl(210,25%,45%)" }}>
                    <strong style={{ color: "hsl(210,56%,23%)" }}>{c.via}</strong> — {c.note}
                  </p>
                </div>
              ))}
            </div>
            {/* mt-12 (não mt-6): o py-6 do card removido era o respiro — sem ele, a dica ficaria colada no
                grid (mesmo caso do "Mais de 3 dias" no /o-que-fazer). Fundo em variação do areia
                (hsl(40,33%,94%)) como no card de fechamento de /hospedagem; texto em itálico text-sm —
                decisões do usuário. O dourado escuro do texto mantém contraste próprio sobre o areia
                claro (escuro o suficiente para AA). */}
            <div className="mt-12 rounded-xl px-4 py-3" style={{ background: "hsl(40,33%,94%)", border: "1px solid hsl(214,25%,90%)" }}>
              <p className="text-sm italic" style={{ color: "hsl(35,82%,30%)" }}>
                <strong>{t.crossings.tipBefore}</strong> {t.crossings.tipText}{" "}
                {t.crossings.tipCtaBefore}{" "}
                <Link
                  href={internalUrl("/transfer", "triplice")}
                  className="underline underline-offset-4 transition-opacity hover:opacity-75"
                  style={{ color: "hsl(152,47%,30%)" }}
                >
                  {t.crossings.tipCtaLink}
                </Link>
                {t.crossings.tipCtaAfter}
              </p>
            </div>
          </div>
        </section>

        {/* ── TRÊS SEÇÕES SAÍRAM DAQUI ───────────────────────────────────────────────────────
            1. "Onde comer, beber e se hospedar em Foz" (`NicheClusterLinks`) — a grade de bar,
               cervejaria, hospedagem etc. Terceira página a perdê-la: `/atrativos` e a página de
               atrativo individual já tinham saído antes. O componente fica: `NichePageTemplate`
               é o último consumidor.
            2. `PartnerPicks` (curadoria de parceiros). Saiu inclusive a PROP `partnerPicks` desta
               componente e o `<PartnerPicks />` do `page.tsx` — sem consumidor, a prop era só um
               furo na API. Ele continua nas outras telas que o usam.
            3. "Um dia, três países" — a lista numerada que propunha cruzar as três fronteiras num
               único dia, com CTA azul para `/atrativos`. Motivo do usuário: a sugestão é
               IMPRATICÁVEL, e recomendar um roteiro que não se cumpre queima a confiança da
               página inteira. Não é problema de design — não readequar, não reescrever em outra
               forma. As chaves `itinerary` saíram do `lib/i18n/triplice-fronteira.ts` junto, nos
               três locales.

            ── RITMO DE FUNDO DA CAUDA (§7.5) ─────────────────────────────────────────────────
            Com a "Um dia, três países" (Areia) fora, quem encosta nos atrativos passou a ser a
            "Logística", que é BRANCA. Daí `fundo="areia"` aqui e o CTA final de volta ao branco
            (o default). A cadeia fecha alternando: … → Logística (branco) → Atrativos (Areia) →
            CTA final (branco).
            ⓘ Na versão anterior desta cauda o CTA final precisou de `fundo="areia"` — havia uma
            seção a mais no meio e o branco fixo dele tornava a página insolúvel. A remoção
            dissolveu essa restrição, então a prop voltou a não ser passada por ninguém e FOI
            RETIRADA do `RoteirosCta`. Se uma cauda futura recriar o impasse, é ela que volta. */}
        <RelatedAttractionsSection source="triplice" fundo="areia" />

        <RoteirosCta ctaType="triplice_roteiros" title={t.finalCta.title} text={t.finalCta.text} />
      </main>
      <Footer />
    </>
  );
}
