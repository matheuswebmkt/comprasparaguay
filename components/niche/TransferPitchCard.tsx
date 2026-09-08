// Filepath: components/niche/TransferPitchCard.tsx
// Version: 2.3
// Nome da Versão: "na home o card fecha o bloco (4º) — fundo AREIA (ritmo branco→areia que fecha com o footer)"
//
// Card "nosso" do transfer — imagem de van neutra com a identidade do site, SEM nome nem marca de
// agência. Foi criado como o card de recomendação do nicho `transfer` (substituindo o card da
// agência) e hoje vive em DOIS lugares: `/transfer` e a home, logo depois da seção de dores.
//
// ⚠️ v2.0 — o CTA. Antes era um `TrackedLink` para `wa.me/<número>?text=<mensagem pronta>` com o
//    rótulo "Conversar no WhatsApp". Duas violações numa peça só: nomeava o CANAL antes do envio
//    (§21.2) e pulava a captura — o lead ia para uma conversa solta em vez de entrar no funil com a
//    data. Hoje é o `ReservarDataCta`: abre o modal, mesmo rótulo do hero ("Reservar data"), mesmo
//    caminho de conversão do resto do site. O número e a mensagem saíram do dicionário junto.
//
// ⚠️ `placement` existe por causa da ALTERNÂNCIA DE FUNDO (§7.5). O ritmo da home é
//    BRANCO→AREIA→BRANCO→AREIA→BRANCO→AREIA→BRANCO (hero a CtaFinal, fecha com o footer) e o card
//    é o 4º da sequência (4ª seção = areia): em `/transfer` ele é branco (como sempre foi). Fundo
//    só tem DOIS valores válidos — branco `hsl(0,0%,100%)` ou Areia `hsl(40,33%,97%)`.
//
// ⚠️ Sem nome de agência aqui, e sem copy de parceiro: a copy/SEO da página de nicho vive em
//    `app/data/niches.ts` e nunca menciona o recomendado (`NicheRecommendation`, §13).

"use client";

import Image from "next/image";
import { CalendarDays, Sparkles } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { TRANSFER_PITCH } from "@/lib/i18n/niches-content";
import { SHARED_UI } from "@/lib/i18n/shared";
import ImpressionObserver from "@/components/ImpressionObserver";
import ReservarDataCta from "@/components/ReservarDataCta";

/** Onde a seção está: decide o fundo (alternância) e os rótulos de telemetria. */
type Placement = "transfer" | "home";

const PLACEMENT = {
  transfer: {
    background: "hsl(0,0%,100%)",
    ctaType: "transfer_pitch_reserva",
    impressionType: "niche_recommendation",
    source: "transfer-card",
  },
  home: {
    background: "hsl(40,33%,97%)",
    ctaType: "home_transfer_reserva",
    impressionType: "home_transfer",
    source: "home-transfer",
  },
} as const;

export default function TransferPitchCard({ placement = "transfer" }: { placement?: Placement }) {
  const { locale } = useLocale();
  const p = TRANSFER_PITCH[locale];
  // Rótulo do CTA: o MESMO texto do hero e do CtaFinal — um produto, um verbo em todo o funil.
  const cta = SHARED_UI[locale].roteirosCta;
  const at = PLACEMENT[placement];

  return (
    <section id="recomendacao" className="rf-section" style={{ background: at.background }}>
      <div className="section-container">
        {/* Mesmo slot de impressão do card original (reach/CTR) — com slug próprio do Compras Paraguay. */}
        <ImpressionObserver
          slug={TRANSFER_PITCH.itemSlug}
          ctaType={at.impressionType}
          threshold={0.35}
        />

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Imagem: van neutra + identidade do site (gradiente como fallback enquanto o asset não existe). */}
          <div className="relative overflow-hidden rounded-3xl shadow-tef-lg">
            <div className="relative block aspect-[4/3] lg:aspect-[16/10] w-full overflow-hidden">
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: "linear-gradient(150deg, hsl(152,47%,32%) 0%, hsl(210,60%,15%) 100%)" }}
                aria-hidden="true"
              >
                <Sparkles className="h-14 w-14 text-white/30" />
              </div>
              <Image
                src={TRANSFER_PITCH.cover}
                alt={`${p.title} — Compras Paraguay`}
                fill
                sizes="(max-width: 1024px) 100vw, 520px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Conteúdo */}
          <div>
            <p className="rf-eyebrow mb-4">{p.eyebrow}</p>
            <h2 className="rf-title" style={{ marginTop: 0 }}>{p.title}</h2>
            <p className="rf-sub" style={{ marginTop: "0.75rem" }}>{p.description}</p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {p.tags.map((h) => (
                <span
                  key={h}
                  className="inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold"
                  style={{ background: "white", border: "1px solid hsl(214,25%,88%)", color: "hsl(210,56%,23%)" }}
                >
                  {h}
                </span>
              ))}
            </div>

            {/* CTA → modal de reserva. Dourado = único objeto cheio da seção; rótulo ≥ text-lg bold
                porque o contraste do dourado sobre branco só passa AA como texto grande (§2). */}
            <div className="mt-8">
              <ReservarDataCta
                ctaType={at.ctaType}
                source={at.source}
                className="inline-flex items-center gap-2 rounded-3xl px-8 py-4 text-lg font-bold text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)",
                }}
              >
                <CalendarDays className="h-5 w-5" aria-hidden="true" />
                {cta.ctaReserva}
              </ReservarDataCta>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
