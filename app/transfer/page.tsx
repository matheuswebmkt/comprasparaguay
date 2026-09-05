// Filepath: app/transfer/page.tsx
// Rota estática do nicho de transfer. Conteúdo/SEO em app/data/niches.ts (a isca). A recomendação
// (NicheRecommendation, dentro de NichePageTemplate) já não abre modal nem página própria — CTA externo (site) se houver.

import { getNiche, buildNicheMetadata } from "@/app/data/niches";
import NichePageTemplate from "@/components/niche/NichePageTemplate";

const niche = getNiche("transfer")!;

export const revalidate = 60;
export const metadata = buildNicheMetadata(niche);

export default function TransferPage() {
  return <NichePageTemplate niche={niche} />;
}
