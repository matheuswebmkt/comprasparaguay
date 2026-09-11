// Filepath: app/layout.tsx
// Version: 2.7
// Última mudança: "canal Google volta a ser o container do GTM do portfólio (era gtag direto com Measurement ID órfão)"
// Nome da Versão: "+ HotelDetailModal global (mesmo padrão do PartnerDetailModal — hotel nunca teve página própria e continua sem uma)"
// Baseado na Versão: 2.5

import MetaPixel from "@/components/analytics/MetaPixel";
import GoogleTagManager from "@/components/analytics/GoogleTagManager";
import ConsentGate from "@/components/analytics/ConsentGate";
import CookieBanner from "@/components/CookieBanner";
// ⚠️ Os três modais entram via loader preguiçoso (`components/lazy/*`), não import direto: eles
// montam no root layout, mas só baixam o chunk quando o CustomEvent que os abre dispara. Import
// direto aqui colocava o modal de reserva (maior client do projeto) no bundle inicial de toda
// página. O loader preserva a corrida evento-antes-do-chunk — ver `DeferredEventMount`.
import TicketOfferModalLazy from "@/components/lazy/TicketOfferModalLazy";
import EnvioOverlay from "@/components/ui/EnvioOverlay";
import PartnerDetailModalLazy from "@/components/lazy/PartnerDetailModalLazy";
import ContactDetailModalLazy from "@/components/lazy/ContactDetailModalLazy";
import { NavigationEvents } from "@/components/analytics/NavigationEvents"; // Importado
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Fraunces } from "next/font/google";
import { Suspense } from "react"; // Importado
import JsonLd from "@/components/JsonLd";
import CtaModeProvider from "@/components/cta-mode/CtaModeProvider";
import LocaleProvider from "@/components/i18n/LocaleProvider";
import { getOfferConfigCached } from "@/lib/offer-settings";
import {
  SITE_URL,
  SITE_NAME,
  COMPRAS_PRIMARY_KEYWORDS,
  organizationSchema,
  websiteSchema,
  fozDestinationSchema,
} from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

// Fonte display dos títulos (design-system.md §3). Alimenta var(--font-display).
// ⚠️ Fraunces (serifa suave variável) SUBSTITUIU Space Grotesk em jul/2026 — ver design-system.md §3
// e design-system/layout-secoes.md §8-ter. Space Grotesk é grotesca geométrica e lia como tech/SaaS,
// não como hospitalidade premium. Serifa de alto contraste é a convenção da categoria e traduz o
// "Refined Organic" de §1. NÃO reverter para sans sem revisar §3.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  // Itálico é carregado de propósito: o H1 usa romano + itálico na MESMA linha (design-system §3).
  // É a assinatura tipográfica da marca — sem ele o título perde o recurso e vira texto grande.
  style: ["normal", "italic"],
});

// --- METADADOS GLOBAIS (SEO) ---
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // Default só vale para página sem title próprio (raro). Identidade do domínio: a intenção primária
    // é "compras no Paraguai" — a marca entrega o serviço, não um guia generalista (§21.6).
    default: "Compras no Paraguai — Compras Paraguay",
    template: "%s | Compras Paraguay",
  },
  description:
    "Compre no Paraguai sem perrengue: dia de compras em Ciudad del Este com guia especialista, veículo privativo de ida e volta a partir do seu hotel em Foz do Iguaçu.",
  keywords: [...COMPRAS_PRIMARY_KEYWORDS],
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "pt_BR",
    url: SITE_URL,
    title: "Compras no Paraguai — Compras Paraguay",
    description:
      "Dia de compras em Ciudad del Este com guia especialista: veículo privativo de ida e volta, horários, câmbio e cota resolvidos — a partir do seu hotel em Foz do Iguaçu.",
    images: [
      {
        // OG padrão do site: `/og.jpg` na raiz de `public/`, JPG 1200×630 real.
        // ⚠️ JPG, não WebP: Facebook/LinkedIn não renderizam WebP de forma confiável no card, e a
        // capa de atrativo (proporções variadas, WebP) não serve como OG — ver `BRAND_OG_IMAGE`.
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dia de compras em Ciudad del Este com guia especialista — Compras Paraguay",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Compras no Paraguai — Compras Paraguay",
    description:
      "Dia de compras em Ciudad del Este com guia especialista: veículo privativo de ida e volta, horários, câmbio e cota resolvidos — a partir do seu hotel em Foz do Iguaçu.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/site.webmanifest",
  // ⓘ `app/favicon.ico` existe e é servido automaticamente pelo App Router (Next injeta o link
  // sozinho) — NÃO declarar de novo aqui. Os PNGs 16/32 + apple-touch-icon (180) cobrem o resto.
  icons: [
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
    { rel: "icon", type: "image/png", url: "/favicon-32x32.png", sizes: "32x32" },
    { rel: "icon", type: "image/png", url: "/favicon-16x16.png", sizes: "16x16" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Config da oferta ASSADA no HTML (cacheada + tag) → CTA/modal já corretos no 1º render, sem fetch/delay.
  const offer = await getOfferConfigCached();
  return (
    // Idioma do site atualizado para Português do Brasil
    // ⚠️ AS VARIÁVEIS DE FONTE FICAM NO <html>, NÃO NO <body> — e isso NÃO é estilo, é obrigatório.
    // `--font-display` é declarada em `:root` (globals.css) e referencia `var(--font-fraunces)`.
    // Custom property é resolvida no elemento onde é DECLARADA: com a variável só no <body>
    // (descendente), `--font-display` virava valor inválido e sumia — todo H1 do site caía no Geist
    // herdado. O projeto declarava fonte de títulos desde sempre e NUNCA aplicou nenhuma (valia
    // igual para a Space Grotesk anterior). Bug encontrado e corrigido em jul/2026 (R9).
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${fraunces.variable}`}
      suppressHydrationWarning
    >
      <body className={`${geistSans.className} antialiased`}>
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <JsonLd data={fozDestinationSchema()} />
        {/* Meta Pixel/GTM só carregam depois do aceite no CookieBanner (consentimento próprio, sem CMP externo). */}
        <ConsentGate>
          <MetaPixel />
          <GoogleTagManager />
        </ConsentGate>
        <Suspense fallback={null}>
          <NavigationEvents />
        </Suspense>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <LocaleProvider>
              <CtaModeProvider initial={offer}>
                {/* ⚠️ NO ROOT LAYOUT de propósito: é o que faz a cobertura de envio sobreviver
                    ao `router.push` e só sumir quando /obrigado renderiza. Dentro do modal ela
                    morreria no `setOpen(false)`, que é exatamente quando precisa aparecer. */}
                <EnvioOverlay />
                <TicketOfferModalLazy />
                <PartnerDetailModalLazy />
                <ContactDetailModalLazy />
                <CookieBanner />
                {children}
              </CtaModeProvider>
            </LocaleProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}