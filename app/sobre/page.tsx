// Filepath: app/sobre/page.tsx
// Version: 4.2
// Nome da Versão: "Metadata e JSON-LD na narrativa Compras PY (dia de compras na fronteira)"

import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import SobreContent from "@/components/sobre/SobreContent";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, webPageSchema, breadcrumbSchema } from "@/lib/seo";

// ⚠️ `title` sem `absolute` fazia o template do layout anexar a marca de novo — o resultado era
// "Sobre o Compras Paraguay | Compras Paraguay". `pageMetadata` usa título absoluto e ainda traz canonical,
// OG e robots, que faltavam por completo aqui.
export const metadata: Metadata = pageMetadata({
  title: "Sobre o Compras Paraguay — Guia especialista e logística",
  description:
    "Conheça o Compras Paraguay: curadoria de compras na tríplice fronteira, feita por quem vive Foz do Iguaçu — dias de compras em Ciudad del Este e Puerto Iguazú com guia especialista e logística de ida e volta.",
  path: "/sobre",
  keywords: [
    "Compras Paraguay",
    "quem é o Compras Paraguay",
    "curadoria de compras na fronteira",
    "guia especialista em Ciudad del Este",
  ],
  type: "website",
});

export default function SobrePage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          type: "AboutPage",
          name: "Sobre o Compras Paraguay",
          description:
            "Curadoria de compras na tríplice fronteira: dias de compras em Ciudad del Este e Puerto Iguazú conduzidos por guias especialistas, com atendimento da agência parceira.",
          url: "/sobre",
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Sobre", url: "/sobre" },
        ])}
      />
      <Navbar />
      <SobreContent />
      <Footer />
    </>
  );
}
