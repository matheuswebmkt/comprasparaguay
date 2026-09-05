// Filepath: app/aviso-legal/page.tsx
// Version: 4.1
// Nome da Versão: "Conteúdo visível extraído para AvisoLegalContent (client, i18n)"

import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import AvisoLegalContent from "@/components/aviso-legal/AvisoLegalContent";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, webPageSchema, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Aviso Legal, Termos e Privacidade (LGPD) — Compras Paraguay",
  description:
    "Aviso legal, termos de uso e política de privacidade (LGPD) do Compras Paraguay: quais dados são coletados, para que servem e como exercer os seus direitos.",
  path: "/aviso-legal",
  type: "website",
});

export default function AvisoLegalPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          type: "WebPage",
          name: "Aviso Legal, Termos e Privacidade (LGPD)",
          description:
            "Termos de uso e política de privacidade do Compras Paraguay, conforme a LGPD.",
          url: "/aviso-legal",
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Aviso Legal", url: "/aviso-legal" },
        ])}
      />
      <Navbar />
      <AvisoLegalContent />
      <Footer />
    </>
  );
}
