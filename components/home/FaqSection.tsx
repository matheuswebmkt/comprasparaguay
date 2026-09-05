// Filepath: components/home/FaqSection.tsx
// Version: 2.0
// Nome da Versão: "FAQ JSON-LD alinhado a roteiros"

import FaqSectionContent from "@/components/home/FaqSectionContent";

// ⚠️ Este componente NÃO emite JSON-LD (conventions/seo.md §19: quem emite `FAQPage` é a PÁGINA).
// Ele já emitiu, e funcionava por acaso — só porque a home era a única a usá-lo e não emitia o
// dela. Bastava a página passar a emitir, ou um segundo lugar reusar esta seção, para nascerem
// dois `FAQPage` no mesmo documento. O schema da home agora sai de `app/page.tsx`, a partir da
// MESMA fonte (`HOME_UI.pt.faq.items`).

export default function FaqSection() {
  return <FaqSectionContent />;
}
