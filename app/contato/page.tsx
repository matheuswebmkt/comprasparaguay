// Filepath: app/contato/page.tsx
// Version: 2.2
// Nome da Versão: "Conteúdo visível extraído para ContatoContent (client, i18n)"

import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import ContatoContent from "@/components/contato/ContatoContent";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, webPageSchema, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contato — Compras Paraguay",
  description:
    "Fale com o Compras Paraguay: dúvidas sobre roteiros de compras na fronteira, atendimento da agência parceira, sugestões de conteúdo ou pedidos sobre os seus dados pessoais (LGPD).",
  path: "/contato",
  keywords: ["contato Compras Paraguay", "falar com o Compras Paraguay"],
  type: "website",
});

export default function ContatoPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          type: "ContactPage",
          name: "Contato — Compras Paraguay",
          description:
            "Canal de contato do Compras Paraguay para dúvidas, sugestões e pedidos relativos a dados pessoais.",
          url: "/contato",
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Contato", url: "/contato" },
        ])}
      />
      <Navbar />
      <ContatoContent />
      <Footer />
    </>
  );
}
