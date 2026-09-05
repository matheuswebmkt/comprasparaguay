// Filepath: components/niche/TransferPitchCard.tsx
// Version: 1.0
// Nome da Versão: "Card de recomendação PRÓPRIO do /transfer (sem agência)"
//
// Substitui o card da agência no nicho `transfer`: nada de nome/imagem de agência. Mostra um
// card "nosso", do transfer — imagem de van neutra com identidade visual do site (asset a
// fornecer), título "Transfers e Transporte turístico" e um CTA que abre o WhatsApp
// diretamente (número fixo + mensagem pronta).
//
// ⚠️ Só o nicho `transfer` (kind === "agency"). Hospedagem (kind === "hotel") e parceiros
// (kind === "partner") continuam no `NichePitchCard` original.

"use client";

import Image from "next/image";
import { MessageCircle, Sparkles } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { TRANSFER_PITCH } from "@/lib/i18n/niches-content";
import ImpressionObserver from "@/components/ImpressionObserver";
import TrackedLink from "@/components/TrackedLink";
import { NICHE_KEYS, VERTICALS } from "@/lib/tracking-taxonomy";

export default function TransferPitchCard() {
  const { locale } = useLocale();
  const p = TRANSFER_PITCH[locale];
  const waUrl = `https://wa.me/${TRANSFER_PITCH.whatsapp}?text=${encodeURIComponent(p.message)}`;

  return (
    <section id="recomendacao" className="rf-section" style={{ background: "hsl(0,0%,100%)" }}>
      <div className="section-container">
        {/* Mesmo slot de impressão do card original (reach/CTR) — com slug próprio do Compras Paraguay. */}
        <ImpressionObserver
          slug={TRANSFER_PITCH.itemSlug}
          ctaType="niche_recommendation"
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

            {/* CTA → WhatsApp (abre direto, mensagem pronta). CTA dourado = único objeto dourado (§2). */}
            <div className="mt-8">
              <TrackedLink
                href={waUrl}
                ctaType="whatsapp"
                itemSlug={TRANSFER_PITCH.itemSlug}
                campaign="transfer"
                vertical={VERTICALS.transporte}
                niche={NICHE_KEYS.transfer}
                exit
                className="inline-flex items-center gap-2 rounded-3xl px-8 py-4 text-lg font-bold text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)",
                }}
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                {p.cta}
              </TrackedLink>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
