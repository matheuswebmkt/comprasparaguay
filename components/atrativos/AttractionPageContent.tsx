// Filepath: components/atrativos/AttractionPageContent.tsx
// Version: 3.4
// Nome da Versão: "Página do dia de compras: bloco de relacionados com a copy dos destinos da fronteira"
"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import TicketOfferButton from "@/components/ticket-offer/TicketOfferButton";
import RoteirosCta from "@/components/RoteirosCta";
import RelatedAttractionsSection from "@/components/RelatedAttractionsSection";
import { Attraction } from "@/app/types";
import { attractionPlaceLabel } from "@/lib/seo";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { ATTRACTION_DETAIL_UI } from "@/lib/i18n/attraction-detail";
import { ATTRACTIONS_I18N, ATTRACTION_NAMES, attractionSubjectI18n } from "@/lib/i18n/attractions";
import { ATTRACTION_FAQS } from "@/lib/i18n/attraction-faqs";
import { TRANSFER_ATRATIVOS } from "@/lib/i18n/niches-content";
import { RESERVA_ATTRACTION_SLUG } from "@/components/ReservarDataCta";
import FaqAccordion from "@/components/FaqAccordion";

export default function AttractionPageContent({
  attraction: a,
  related,
  faq = [],
}: {
  attraction: Attraction;
  related: Attraction[];
  /** FAQ canônico (pt) — alinhado ao JSON-LD da page.tsx */
  faq?: { q: string; a: string }[];
}) {
  const { locale } = useLocale();
  const t = ATTRACTION_DETAIL_UI[locale];
  const nome = ATTRACTION_NAMES[locale][a.slug] ?? a.name;
  // FAQ visível: en/es vêm do dicionário; pt cai no dado (matriz, também usado no JSON-LD).
  const faqVisivel = ATTRACTION_FAQS[locale][a.slug] ?? faq;
  const ai = ATTRACTIONS_I18N[locale][a.slug] ?? {
    tagline: a.tagline,
    description: a.description,
    highlights: a.highlights,
    info: a.info ?? [],
  };

  // Endereço só em texto (sem link para Maps / concorrentes).
  const addressPlain =
    a.address?.trim() ||
    ai.info?.find((i) => /onde|local|fica|endereço|endereco/i.test(i.label))
      ?.value ||
    null;
  const infoWithoutAddress = (ai.info ?? []).filter(
    (i) => !/onde|local|fica|endereço|endereco/i.test(i.label),
  );

  return (
    <>
      <Navbar />
      <main style={{ background: "hsl(40,33%,97%)" }}>
        {/* ── HERO ───────────────────────────────────────────────────────────────
            Padrão do design system (design-system.md §3/§14; conventions §7.6):
            fundo Areia puro + grão, imagem CONTIDA com margem (nunca full-bleed),
            H1 na escala única (600, nunca font-black), breadcrumb fora da foto.

            ⚠️ ALTURA COMPACTA (como o hub /atrativos — conventions §7.6), NÃO
            `min-h-[100svh]` + `justify-center`. A hero de página de destino centra
            porque o conteúdo é curto e sempre cabe; aqui a foto (4/3 em tela única,
            ~500px+) faz o conteúdo flutuar em torno da altura da viewport, e o
            comprimento do nome/tagline cruza essa fronteira página a página —
            resultado: heróis que alternam entre "centrado/comprimido" e
            "expandido". Compacta = conteúdo ancorado no topo, determinístico em
            qualquer largura: o que varia é só o respiro abaixo.

            O CTA dourado preenchido da tela vive na sidebar de oferta, não aqui
            (§2 — um único objeto dourado). */}
        <section
          className="relative overflow-hidden pt-16"
          style={{ background: "hsl(40,33%,97%)" }}
        >
          <div
            className="rf-grain pointer-events-none absolute inset-0 opacity-[0.055]"
            style={{ mixBlendMode: "multiply" }}
            aria-hidden="true"
          />
          <div className="section-container relative z-10 pt-6 pb-20 sm:pt-8 sm:pb-24">
            <nav aria-label="Trilha" className="mb-8">
              <ol
                className="flex flex-wrap items-center gap-1.5 text-xs"
                style={{ color: "hsl(210,25%,55%)" }}
              >
                <li>
                  <Link
                    href="/"
                    className="transition-opacity hover:opacity-70"
                    style={{ color: "hsl(210,56%,35%)" }}
                  >
                    {t.breadcrumbHome}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href="/roteiros-de-compras"
                    className="transition-opacity hover:opacity-70"
                    style={{ color: "hsl(210,56%,35%)" }}
                  >
                    {t.breadcrumbIndex}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li
                  className="font-medium"
                  style={{ color: "hsl(210,60%,15%)" }}
                >
                  {nome}
                </li>
              </ol>
            </nav>

            {/* `items-center`: o bloco de texto (eyebrow + H1 + tagline) fica
                verticalmente centrado contra a foto. A foto define a altura da
                fileira (aspecto fixo) e por isso NÃO se move entre atrativos — o
                que varia é só o posicionamento do texto contra ela, que é o efeito
                pedido. */}
            <div className="grid items-center gap-11 lg:grid-cols-[minmax(0,48fr)_minmax(0,52fr)] lg:gap-14">
              <div>
                <p className="rf-eyebrow rf-rise rf-d1">{t.eyebrow}</p>
                <h1
                  className="rf-rise rf-d2"
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
                  {nome}
                </h1>
                <p
                  className="rf-rise rf-d3 mt-6 max-w-[46ch] text-[1.0625rem] leading-relaxed"
                  style={{ color: "hsl(210,25%,38%)" }}
                >
                  {ai.tagline}
                </p>
              </div>

              {/* Foto contida — a imagem é o produto, mas com margem (§14): nunca
                  full-bleed. Covers reais ~1083×719 (webp); exibida a ~52vw no
                  desktop, sem upscale (§8-ter nitidez). */}
              <div className="relative overflow-hidden rounded-3xl shadow-tef-lg">
                <div className="relative aspect-[4/3] lg:aspect-[16/10] w-full">
                  <Image
                    src={a.cover}
                    /* Lugar derivado do dado: com "Foz do Iguaçu" fixo, o alt afirmava que
                       atrativos de Puerto Iguazú e do Paraguai ficam em Foz. */
                    alt={`${nome} — ${attractionPlaceLabel(a)}`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 52vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTEÚDO: Sobre + sidebar de oferta ── */}
        <div className="section-container py-14 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
            <div>
              <h2 className="rf-title" style={{ marginTop: 0 }}>
                {t.about}
              </h2>
              <div className="mt-6 space-y-4">
                {ai.description.map((p, i) => (
                  <p
                    key={i}
                    className="text-base leading-relaxed"
                    style={{ color: "hsl(210,25%,35%)" }}
                  >
                    {p}
                  </p>
                ))}
              </div>

              {ai.highlights.length > 0 && (
                <div className="mt-10">
                  <h3
                    className="mb-4 text-lg font-bold"
                    style={{ color: "hsl(210,60%,15%)" }}
                  >
                    {t.highlights}
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ai.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5">
                        <CheckCircle2
                          className="h-5 w-5 mt-0.5 flex-shrink-0"
                          style={{ color: "hsl(152,47%,32%)" }}
                          aria-hidden="true"
                        />
                        <span
                          className="text-sm"
                          style={{ color: "hsl(210,25%,35%)" }}
                        >
                          {h}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar de oferta — sticky; abriga o ÚNICO objeto dourado preenchido
                da tela (CTA de ingresso, §2 escassez). */}
            <aside className="lg:sticky lg:top-28 h-fit">
              <div
                className="rounded-2xl border bg-white p-6 shadow-tef-md"
                style={{ borderColor: "hsl(214,25%,90%)" }}
              >
                {(addressPlain || infoWithoutAddress.length > 0) && (
                  <dl className="mb-5 space-y-3">
                    {addressPlain && (
                      <div>
                        <dt
                          className="text-xs font-semibold uppercase tracking-wide"
                          style={{ color: "hsl(210,25%,55%)" }}
                        >
                          {t.addressLabel}
                        </dt>
                        <dd
                          className="mt-0.5 text-sm leading-relaxed"
                          style={{ color: "hsl(210,25%,35%)" }}
                        >
                          {addressPlain}
                        </dd>
                      </div>
                    )}
                    {infoWithoutAddress.map((it) => (
                      <div key={it.label}>
                        <dt
                          className="text-xs font-semibold uppercase tracking-wide"
                          style={{ color: "hsl(210,25%,55%)" }}
                        >
                          {it.label}
                        </dt>
                        <dd
                          className="mt-0.5 text-sm leading-relaxed"
                          style={{ color: "hsl(210,25%,35%)" }}
                        >
                          {it.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}

                {/* ⚠️ Rótulo dourado ≥18px bold (text-lg) em TODO breakpoint — o
                    contraste 3.02:1 só passa como texto grande (design-system.md §2).
                    text-sm reprova WCAG AA. */}
                <TicketOfferButton
                  href={`/roteiros-de-compras/${a.slug}`}
                  ctaType="destino_reserva"
                  itemSlug={a.slug}
                  campaign="destinos-reserva"
                  context="atrativo"
                  subjectTitle={nome}
                  subjectImage={a.cover}
                  subjectSubtitle={ai.tagline}
                  /* As três versões — ver AttractionCard (o modal troca de idioma sem recarregar). */
                  subjectI18n={attractionSubjectI18n(a.slug, a)}
                  className="inline-flex w-full items-center justify-center gap-2 px-8 py-4 rounded-3xl font-bold text-lg text-white transition-all hover:scale-[1.03] active:scale-[0.98]"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)",
                  }}
                >
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  {t.ctaReserva}
                </TicketOfferButton>

              </div>
            </aside>
          </div>
        </div>

        {/* ── FAQ ────────────────────────────────────────────────────────────────
            Padrão único (§8.1): .rf-section + .rf-head centralizado + FaqAccordion
            em max-w-3xl (largura de leitura de FAQ, §4.3). Fundo BRANCO puro para a
            alternância: hero areia → conteúdo areia → FAQ branco → relacionados
            areia → RoteirosCta branco. */}
        {faqVisivel.length > 0 && (
          <section
            className="rf-section"
            style={{ background: "hsl(0,0%,100%)" }}
          >
            <div className="section-container">
              <div className="rf-head">
                <p className="rf-eyebrow">{t.faqEyebrow}</p>
                <h2 className="rf-title">{t.faqTitle}</h2>
              </div>
              <FaqAccordion items={faqVisivel} className="mx-auto max-w-3xl" />
            </div>
          </section>
        )}

        {/* ── OUTROS ATRATIVOS DE FOZ ───────────────────────────────────────────
            Componente COMPARTILHADO (RelatedAttractionsSection — a mesma seção de
            /onde-comer, /triplice-fronteira e nichos): máximo padrão. Passamos o
            `items` SEM o atrativo atual (o carrossel não repete a página em que se
            está) e fundo areia (alternância: FAQ branco → este areia → RoteirosCta
            branco). */}
        {/* ⚠️ Copy do bloco: só na página do PRODUTO (o dia de compras) ele vira "destinos da
            fronteira". `TRANSFER_ATRATIVOS` traz eyebrow, título e subtítulo nos 3 idiomas — o mesmo
            trio da seção equivalente do `/transfer`. Não mover para o padrão do dicionário
            (`relatedAttractions`): o bloco é compartilhado, e lá "destinos de compra" renomearia
            também as páginas de Cataratas, Itaipu e Parque das Aves. */}
        {related.length > 0 && (
          <RelatedAttractionsSection
            source={`relacionado-${a.slug}`}
            items={related}
            fundo="areia"
            {...(a.slug === RESERVA_ATTRACTION_SLUG ? TRANSFER_ATRATIVOS[locale] : {})}
          />
        )}

        {/* Fecho — RoteirosCta compartilhado (padrão aprovado, intacto nesta rodada) */}
        <RoteirosCta ctaType="atrativo_roteiros" />
      </main>
      <Footer />
    </>
  );
}
