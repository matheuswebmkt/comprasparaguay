// Filepath: app/robots.ts
// Version: 3.1
// Nome da Versão: "Portal removido — só /admin e /api bloqueados; IA crawlers liberados (GEO)"

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

// `/admin` e `/api` ficam bloqueados: não têm header próprio e o acesso já é barrado por sessão
// (`middleware.ts`) — aqui é só economia de rastreio. Nada público entra no Disallow: bloquear por
// robots.txt impede o crawler de ler um `noindex` que ele nunca chega a ver.
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
