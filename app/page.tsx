// Filepath: app/page.tsx
// Version: 10.2
// Nome da Versão: "R3 — home fechada em 5 seções, com CTA final"
//
// Seções: hero (ganho) → DoresSection (dor/empatia) → AutoridadeSection (prova + mecanismo) →
// roteiros prontos (prova de produto) → AtrativosDestaque (curadoria) → FAQ (objeções) →
// CtaFinal (a perda: o custo de não planejar).
// `PilaresFoz` é faixa utilitária de linking interno e não conta.
// A sequência é deliberada: ganho → dor → prova → como → prova → curadoria → objeção → perda.
// ⚠️ O teto de 5 seções do §8-bis foi EXCEDIDO por decisão do usuário (aqui são 7).
// DoresSection/AutoridadeSection foram adicionadas pós-hero por decisão do usuário; os 3 passos
// do ComoFunciona (removido) foram migrados para a AutoridadeSection.
//
// Saíram na R3: `ExploreFoz` (grade de 4 cards com orbe — padrão catálogo, arquivo DELETADO),
// `RelatedAttractionsSection` (componente segue vivo, usado em nicho/onde-comer/tríplice) e o
// **bloco de parceiros** `HookHero` + `PartnerShowcase` (decisão do usuário: os parceiros ativos são
// todos de gastronomia e já têm `/onde-comer`; cada categoria hoje tem página própria —
// `/onde-comer`, `/hospedagem`, `/transfer`). Ver `conventions/visibilidade-parceiros.md`
// §13-ter: **a home deixou de ser superfície de parceiro.**
//
// ⓘ Sem `getVisiblePartnerSlugs()`, a home não lê mais o banco — virou totalmente estática.
// ⚠️ Não reintroduzir outra seção na home sem cortar uma — a exceção aberta foi
//    DoresSection/AutoridadeSection, por decisão explícita do usuário.

import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import RoteirosHero from "@/components/roteiros/RoteirosHero";
import DoresSection from "@/components/home/DoresSection";
import AutoridadeSection from "@/components/home/AutoridadeSection";
import PilaresFoz from "@/components/home/PilaresFoz";
import CtaFinal from "@/components/home/CtaFinal";
import FaqSection from "@/components/home/FaqSection";
import JsonLd from "@/components/JsonLd";
import {
  faqSchema,
  COMPRAS_PRIMARY_KEYWORDS,
} from "@/lib/seo";
import { HOME_UI } from "@/lib/i18n/home";

// Mantido por consistência com o resto do site (todo ponto equivalente declara revalidate
// explicitamente). Desde a R3 a home não consome mais dado de banco — o `getVisiblePartnerSlugs()`
// saiu junto com a vitrine de parceiros —, então isto é hoje inofensivo, não necessário.
export const revalidate = 60;

export const metadata: Metadata = {
  // ⚠️ A home mira "roteiro em Foz do Iguaçu" — NÃO "o que fazer em Foz do Iguaçu", que pertence ao
  // pilar /o-que-fazer. Até a R2 os dois disputavam o mesmo termo (canibalização).
  // Ver conventions/posicionamento.md §21.6.
  // ⚠️ Sem sufixo `| Compras Paraguay` AQUI, ao contrário dos outros hubs: "Roteiro" + "Foz do Iguaçu"
  // já É o nome da marca, e o sufixo seria a terceira repetição — custaria ~14 caracteres do teto
  // de 60 sem acrescentar termo nenhum. Ver conventions/seo.md §19.
  title: {
    absolute: "Roteiro de compras em Ciudad del Este — Compras Paraguay",
  },
  description:
    "Onde comprar em Ciudad del Este, horários da ponte, o que vale a pena levar e como organizar o seu dia de compras no Paraguai.",
  keywords: [...COMPRAS_PRIMARY_KEYWORDS],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Compras Paraguay",
    locale: "pt_BR",
    title: "Roteiro de compras em Ciudad del Este — Compras Paraguay",
    description:
      "Onde comprar em Ciudad del Este, horários da ponte, o que vale a levar e como organizar o seu dia de compras no Paraguai.",
    url: "/",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Roteiro de compras em Ciudad del Este — Compras Paraguay",
      },
    ],
  },
};

export default function Home() {
  return (
    <>
      {/* ⚠️ `websiteSchema()` NÃO entra aqui: o layout raiz já o emite, com o mesmo `@id`.
          Estava duplicado — dois nós WebSite idênticos no mesmo documento. */}
      {/* JSON-LD do FAQ sai da PÁGINA, nunca do componente (conventions/seo.md §19), em pt
          canônico — mesmo conteúdo que `FaqSection` mostra ao visitante. */}
      <JsonLd data={faqSchema(HOME_UI.pt.faq.items)} />
      <Navbar />
      <main style={{ background: "hsl(40,33%,97%)" }}>
        {/* Alternância de fundo §7.5: Hero areia → DoresSection branco →
            AutoridadeSection areia → FAQ branco → PilaresFoz areia → CtaFinal branco. */}
        <RoteirosHero />
        <DoresSection />
        <AutoridadeSection />
        <FaqSection />
        <PilaresFoz />
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}
