// Filepath: next.config.ts
// Version: 4.0
// Nome da Versão: "Primeiro deploy comprasparaguay.online — sem redirects de legado"
// Baseado na Versão: 3.4
//
// Domínio novo: nenhum 301 de migração SEO. Rotas canônicas já nascem corretas.

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ⚠️ Middleware Edge: o Next 15.5.x embute no bundle do middleware o módulo interno
  // `experimental/testmode` (require estático no adapter), que referencia `node:async_hooks`
  // e `node:buffer` — e a validação da Vercel rejeita o deploy por isso. O runtime Node
  // também não serve: o adaptador da Vercel carrega o middleware como CJS e ele nasce ESM
  // (crash MIDDLEWARE_INVOCATION_FAILED). O stub abaixo esvazia o testmode no bundle;
  // o código só roda quando NEXT_PRIVATE_TEST_PROXY=true (nunca em produção).
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "next/dist/experimental/testmode/server-edge": false,
      "next/dist/experimental/testmode/context": false,
      "next/dist/experimental/testmode/fetch": false,
    };
    return config;
  },
  // Rotas PRIVADAS (envio manual 1:1, nunca públicas): /comercial*.
  // X-Robots-Tag no HTTP cobre toda a árvore — inclusive páginas futuras —
  // sem depender de cada page lembrar do robots noindex na metadata.
  // ⚠️ E é por isso que /comercial NÃO pode entrar no `disallow` de `app/robots.ts`: bloqueado
  // pelo robots.txt, o crawler não chega a ler este header e o noindex vira letra morta. Os dois
  // arquivos já se contradisseram — o comentário aqui dizia que não havia Disallow enquanto
  // `robots.ts` tinha um. Mexeu em um, confira o outro.
  async headers() {
    const noindex = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];
    return [
      { source: "/comercial", headers: noindex },
      { source: "/comercial/:path*", headers: noindex },
    ];
  },
};

export default nextConfig;
