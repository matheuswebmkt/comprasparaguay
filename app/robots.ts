// Filepath: app/robots.ts
// Version: 3.0
// Nome da Versão: "Compras Paraguay — bloqueia admin/api/comercial; libera IA crawlers (GEO)"

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Amazonbot",
  "Bytespider",
  "Meta-ExternalAgent",
];

// ⚠️ `/comercial` NÃO entra aqui, e a razão é técnica, não só de discrição: a árvore inteira já
// recebe `X-Robots-Tag: noindex, nofollow` por header (`next.config.ts`). Disallow + noindex é
// contraproducente — bloqueado pelo robots.txt, o crawler nunca chega a LER o header noindex, e a
// URL pode acabar indexada mesmo assim, só que sem conteúdo. Sem o Disallow, o header funciona
// como pretendido. De quebra, o robots.txt é público e deixa de anunciar os endereços do portal.
// `/admin` e `/api` seguem bloqueados: não têm header próprio e o acesso já é barrado por sessão
// (`middleware.ts`), então aqui é só economia de rastreio.
const DISALLOW = ["/admin", "/api"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
      {
        userAgent: AI_BOTS,
        allow: "/",
        disallow: DISALLOW,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
