// Filepath: app/sitemap.ts
// Version: 5.0
// Nome da Versão: "Foco Compras PY — sitemap das páginas vivas + 5 atrativos de compras"

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { attractions } from "@/app/data/attractions";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ⚠️ `lastModified` SÓ onde a data é real (atrativos). Onde a data não é conhecida, o campo é
  // OMITIDO — omitir é honesto, carimbar a data do build não é.
  // ⚠️ `/obrigado` (noindex) e `/admin`/`/api` ficam fora de propósito.

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/atrativos`, changeFrequency: "weekly", priority: 0.98 },
    { url: `${SITE_URL}/o-que-fazer`, changeFrequency: "weekly", priority: 0.97 },
    { url: `${SITE_URL}/transfer`, changeFrequency: "weekly", priority: 0.88 },
    { url: `${SITE_URL}/triplice-fronteira`, changeFrequency: "weekly", priority: 0.93 },
    { url: `${SITE_URL}/sobre`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/aviso-legal`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/contato`, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Atrativos: página canônica de cada ponto do catálogo (5, eixo compras/fronteira).
  const attractionPages: MetadataRoute.Sitemap = attractions.map((a) => {
    const iso = a.updatedAt ?? a.publishedAt;
    return {
      url: `${SITE_URL}/atrativos/${a.slug}`,
      ...(iso ? { lastModified: new Date(iso) } : {}),
      changeFrequency: "monthly" as const,
      priority: a.featured ? 0.9 : 0.82,
    };
  });

  return [...staticPages, ...attractionPages];
}