// Filepath: app/page.tsx
// Version: 10.3
// Nome da Versão: "TransferPitchCard entra na home depois das Dores, com CTA de reserva (8 seções)"
//
// Seções: hero (ganho) → DoresSection (dor/empatia) → TransferPitchCard (o produto como objeto: van,
// motorista, trajeto) → AutoridadeSection (prova + mecanismo) →
// roteiros prontos (prova de produto) → AtrativosDestaque (curadoria) → FAQ (objeções) →
// CtaFinal (a perda: o custo de não planejar).
// `PilaresFoz` é faixa utilitária de linking interno e não conta.
// A sequência é deliberada: ganho → dor → produto → prova → como → prova → curadoria → objeção → perda.
// ⚠️ O teto de 5 seções do §8-bis foi EXCEDIDO por decisão do usuário (aqui são 8).
// DoresSection/AutoridadeSection foram adicionadas pós-hero por decisão do usuário; os 3 passos
// do ComoFunciona (removido) foram migrados para a AutoridadeSection. A TransferPitchCard entrou
// depois, pelo mesmo motivo: é o único ponto da home em que o serviço aparece como coisa.
//
// Saíram na R3: `ExploreFoz` (grade de 4 cards com orbe — padrão catálogo, arquivo DELETADO),
// `RelatedAttractionsSection` (componente segue vivo, usado em nicho/tríplice) e o
// **bloco de parceiros** `HookHero` + `PartnerShowcase` (decisão do usuário: a home não é
// superfície de parceiro — cada parceiro vive no seu contexto de atendimento).
// Ver `conventions/visibilidade-parceiros.md` §13-ter.
//
// ⓘ Sem `getVisiblePartnerSlugs()`, a home não lê mais o banco — virou totalmente estática.
// ⚠️ Não reintroduzir outra seção na home sem cortar uma — a exceção aberta foi
//    DoresSection/AutoridadeSection, por decisão explícita do usuário.

import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import RoteirosHero from "@/components/roteiros/RoteirosHero";
import DoresSection from "@/components/home/DoresSection";
import TransferPitchCard from "@/components/niche/TransferPitchCard";
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
  // ⚠️ O `title` segue mirando "roteiro de compras em Ciudad del Este" — o comprador, não o piloto
  // editorial. Desde a v3.2 do hero, o H1 visível lidera "compras no Paraguai" e o title cobre a
  // segunda intenção: são duas funções complementares na mesma página, não duplicação.
  // Ver conventions/posicionamento.md §21.6.
  // ⚠️ Sem sufixo `| Compras Paraguay` na home: o título já carrega a marca — o sufixo seria
  // repetição. Ver conventions/seo.md §19.
  title: {
    absolute: "Guia especialista de Compras no Paraguai — Ciudad del Este",
  },
  description:
    "Onde comprar, horários das lojas, documentação, cota da Receita, sua logística com transporte e tudo organizado para o seu dia de compras no Paraguai ser ideal.",
  keywords: [...COMPRAS_PRIMARY_KEYWORDS],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Compras Paraguay",
    locale: "pt_BR",
    title: "Guia especialista de Compras no Paraguai — Ciudad del Este",
    description:
      "Onde comprar, horários das lojas, documentação, cota da Receita, sua logística com transporte e tudo organizado para o seu dia de compras no Paraguai ser ideal.",
    url: "/",
    images: [
      {
        url: "/images/atrativos/compras-paraguai-ciudad-del-este/cover.webp",
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
        {/* Alternância de fundo §7.5: Hero areia → DoresSection branco → TransferPitchCard areia →
            AutoridadeSection branco → FAQ areia → PilaresFoz branco → CtaFinal areia.
            ⓘ Inserir a seção de transfer deslocou a paridade de TODAS as demais: as quatro de baixo
            trocaram de cor na mesma leva. Mexer numa delas sozinho quebra o ritmo (§7.5). */}
        <RoteirosHero />
        <DoresSection />
        {/* O card é o mesmo do `/transfer`; `placement="home"` só troca o fundo e a telemetria. */}
        <TransferPitchCard placement="home" />
        <AutoridadeSection />
        <FaqSection />
        <PilaresFoz />
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}
