// Filepath: components/analytics/ViewContentOnLoad.tsx
// Version: 1.0
// Nome da Versão: "ViewContent no load de página de ITEM (SSG-safe)"
// Baseado na Versão: N/A
//
// Ponte entre as páginas ESTÁTICAS (generateStaticParams) e o pixel: a página é assada no build e
// não pode chamar `fbq`, então monta este componente, que não renderiza nada e só dispara o evento
// no cliente. Mesmo padrão do `ImpressionObserver` — que continua sendo outra coisa e NÃO deve ser
// convertido nisto: ele mede itens dentro de uma LISTA (`view_item_list`), este mede a página de UM
// item (`view_item`). Ver _docs-portfolio/pixel-matrix.md §1.5.
//
// 🚫 NÃO usar em página HUB (`/atrativos`, `/roteiros`, `/onde-comer`, `/hospedagem`, `/transfer`,
// `/o-que-fazer`): lista não é item, e inflar `ViewContent` com pageview de listagem estraga o
// público de retargeting — ele deixa de significar "olhou um produto" e passa a significar "passou
// pelo site". Só páginas de UM item: `/atrativos/[slug]` e `/roteiros/[slug]`.

"use client";

import { useEffect } from "react";
import { trackConversion, CONVERSIONS } from "@/lib/analytics";
import { taxonomyParams, type TaxonomyParams } from "@/lib/tracking-taxonomy";

/**
 * Dispara UM `ViewContent` por montagem. Sem `value`/`currency` de propósito (guardrail G3): valor
 * só existe no `Lead`, senão a distribuição que a otimização por valor aprende fica contaminada por
 * eventos de topo de funil, que são ordens de grandeza mais numerosos.
 */
export default function ViewContentOnLoad(props: TaxonomyParams) {
  const { vertical, niche, item_slug, partner_slug } = props;
  const contentIds = props.content_ids?.join(",");

  useEffect(() => {
    trackConversion(
      CONVERSIONS.viewContent,
      taxonomyParams({
        vertical,
        niche,
        item_slug,
        partner_slug,
        content_ids: contentIds ? contentIds.split(",") : null,
      })
    );
    // `content_ids` entra como string juntada: array literal muda de identidade a cada render e
    // faria o efeito redisparar, contando a mesma visualização várias vezes.
  }, [vertical, niche, item_slug, partner_slug, contentIds]);

  return null;
}
