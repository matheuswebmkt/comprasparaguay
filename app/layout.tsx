// Filepath: app/layout.tsx
// Version: 2.6
// Nome da Versão: "+ HotelDetailModal global (mesmo padrão do PartnerDetailModal — hotel nunca teve página própria e continua sem uma)"
// Baseado na Versão: 2.5

import MetaPixel from "@/components/analytics/MetaPixel";
import GoogleTagManager from "@/components/analytics/GoogleTagManager";
import ConsentGate from "@/components/analytics/ConsentGate";
import CookieBanner from "@/components/CookieBanner";
import TicketOfferModal from "@/components/ticket-offer/TicketOfferModal";
import EnvioOverlay from "@/components/ui/EnvioOverlay";
import PartnerDetailModal from "@/components/parceiros/PartnerDetailModal";
import ContactDetailModal from "@/components/parceiros/ContactDetailModal";
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
  FOZ_PRIMARY_KEYWORDS,
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
    // Default só vale para página sem title próprio (raro). Alinhado ao mapa de intenções (§21.6):
    // "O que fazer em Foz do Iguaçu" é intenção do pilar /o-que-fazer — a marca não disputa.
    default: "Roteiro em Foz do Iguaçu — Compras Paraguay",
    template: "%s | Compras Paraguay",
  },
  description:
    "Planeje seu roteiro em Foz do Iguaçu: a melhor sequência de atrativos, horários e recomendações para aproveitar seus dias na cidade.",
  keywords: [...FOZ_PRIMARY_KEYWORDS],
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "pt_BR",
    url: SITE_URL,
    title: "Roteiro em Foz do Iguaçu — Compras Paraguay",
    description:
      "Organize seus dias em Foz do Iguaçu com a melhor sequência de atrativos e horários — revisados por um especialista que vive em Foz.",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Roteiro em Foz do Iguaçu — Compras Paraguay",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Roteiro em Foz do Iguaçu — Compras Paraguay",
    description:
      "Organize seus dias em Foz do Iguaçu com a melhor sequência de atrativos e horários — revisados por um especialista que vive em Foz.",
    images: ["/og-image.webp"],
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
  // ⚠️ Não declarar `/favicon.ico`: NÃO existe arquivo .ico em `public/` — a entrada anterior
  // apontava para um nome com erro de digitação e dava 404 em toda navegação. Os PNGs 16/32 e o
  // apple-touch cobrem o caso. Se um .ico for desejado, adicionar o arquivo ANTES de declarar.
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
                <TicketOfferModal />
                <PartnerDetailModal />
                <ContactDetailModal />
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