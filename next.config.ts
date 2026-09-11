// Filepath: next.config.ts
// Version: 4.1
// Nome da Versão: "Portal do parceiro removido do projeto — cai o noindex de /comercial*"
// Baseado na Versão: 4.0
//
// Domínio novo: nenhum 301 de migração SEO. Rotas canônicas já nascem corretas.

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Não anunciar o framework.
  poweredByHeader: false,

  // AVIF antes de WebP: mesmo sem mudança visual, corta dezenas de KB por imagem e melhora
  // LCP/FCP no mobile. O Next negocia pelo `Accept` do navegador e cai para WebP onde AVIF não
  // é suportado. Sem esta chave o padrão é só WebP.
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // `X-Robots-Tag: noindex` nas páginas privadas por header, além do `<meta name="robots">` que
  // elas já emitem. O header vale para respostas que o crawler busca cru (ex.: `/r/<token>`), onde
  // a meta tag sozinha é frágil — e é mais difícil de um proxy/CDN remover por acidente.
  async headers() {
    return [
      {
        source: "/r/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
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
};

export default nextConfig;
