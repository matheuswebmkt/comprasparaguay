// Filepath: components/analytics/MetaPixel.tsx
// Version: 1.0
// Nome da Versão: "Meta Pixel direto (next/script) — substitui o GTM"
// Baseado na Versão: N/A
"use client";

import Script from "next/script";

// Pixel ID é público (aparece no HTML). Default embutido + override opcional por env.
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "283634370750714";

const MetaPixel = () => {
  if (!PIXEL_ID) return null;

  return (
    <>
      {/* Código base do Meta Pixel: init + 1ª PageView (as trocas de rota são tratadas no NavigationEvents) */}
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
};

export default MetaPixel;
