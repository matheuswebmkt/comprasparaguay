// Filepath: app/sobre/page.tsx
// Version: 4.1
// Nome da Versão: "Conteúdo visível extraído para SobreContent (client, i18n)"

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
  title: "Sobre o Compras Paraguay — quem faz a curadoria em Foz do Iguaçu",
  // ⓘ "o seu orçamento" aqui é o DINHEIRO DO VISITANTE — sentido explicitamente permitido por
  // §21.5 (o banido é orçamento = cotação nossa). Não trocar numa varredura de léxico.
  description:
    "Conheça o Compras Paraguay: curadoria de roteiros em Foz do Iguaçu, feita por especialistas na cidade, para você aproveitar melhor o seu tempo e o seu orçamento.",
  path: "/sobre",
  keywords: [
    "Compras Paraguay",
    "quem é o Compras Paraguay",
    "curadoria de roteiros em Foz do Iguaçu",
    "guia local de roteiros em Foz do Iguaçu",
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
            "Curadoria de roteiros e experiências em Foz do Iguaçu, revisada por especialistas na cidade.",
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
