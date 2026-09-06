// Filepath: components/analytics/GoogleAnalytics.tsx
// Version: 1.0
// Nome da Versão: "GA4 gtag.js direto (next/script) — substitui o GTM morto"
//
// O componente anterior (`GoogleTagManager`) lia `process.env.NEXT_PUBLIC_GTM_ID` — typo de
// `process.env` num container ID que nunca foi configurado: a tag nunca carregou. A medição do
// domínio é GA4 direto, no MESMO padrão do MetaPixel: ID público com default embutido +
// override opcional por env, montado dentro do `ConsentGate` (tag de marketing só após o aceite
// do banner — é o que /aviso-legal declara ao visitante).

"use client";

import Script from "next/script";

// Measurement ID é público (aparece no HTML). Default embutido + override opcional por env.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-1TLW6PM0Q8";

const GoogleAnalytics = () => {
  if (!GA_ID) return null;

  return (
    <>
      {/* GA4 base: loader assíncrono + config (as trocas de rota no App Router pedem page_view manual — ver NavigationEvents) */}
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
};

export default GoogleAnalytics;
