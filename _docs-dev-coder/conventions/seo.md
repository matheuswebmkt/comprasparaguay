// Filepath: _docs-dev-coder/conventions/seo.md
// Version: 1.0
// Nome da Versão: "SEO técnico — OG em JPG, canonical www, favicon, robots/sitemap/llms e páginas privadas"

# CONVENTIONS — SEO TÉCNICO

> ⚠️ Comentários de código citam `conventions/seo.md §19` de uma numeração ANTIGA, que não é a
> destaqui. Quando o comentário descrever o comportamento atual, ele informa; quando contradisser o
> código, **o código manda**. Ver o aviso equivalente no índice `conventions.md`.

## 1 · Domínio canônico

`SITE_URL` (default `https://www.comprasparaguay.online`) é a única forma canônica. O `www` é o
canônico; o apex redireciona para ele. Todo ponto que emite URL absoluta — `metadataBase`,
`alternates.canonical`, `openGraph.url`, `sitemap.xml`, `robots.txt` (`Host`/`Sitemap`), `llms.txt` —
deve usar essa mesma origem. Divergência de origem entre esses pontos divide a sinalização de
autoridade entre duas versões do mesmo site.

O `SITE_URL` é lido de `NEXT_PUBLIC_SITE_URL`; o valor default é o canônico de produção. Nunca
hardcodar `www`/apex fora de `lib/seo.ts`.

## 2 · Favicon e ícones

- O favicon vive em **`app/favicon.ico`** (nome exato). O App Router serve em `/favicon.ico` e injeta
  o `<link rel="icon">` sozinho — **não** declarar o `.ico` à mão em `metadata.icons`. Um 404 no
  favicon faz Google/Bing caírem no ícone genérico de globo.
- Complementos declarados em `metadata.icons` (layout raiz): `apple-touch-icon` 180,
  `favicon-32x32`, `favicon-16x16`. Os PNGs 192/512 são declarados pelo `site.webmanifest`.
- O arquivo `.ico` deve conter 48×48 (múltiplo de 48 é o que o Google prefere). O globo pode
  persistir por dias/semanas no cache de busca mesmo com o favicon válido — isso é atraso do
  crawler, não sinal de configuração errada.

## 3 · Open Graph e Twitter — JPG 1200×630, nunca WebP

- A imagem OG da marca é **`public/og-image.jpg`**, JPG **1200×630** real, exportada em
  `BRAND_OG_IMAGE` (`lib/seo.ts`). Facebook e LinkedIn não renderizam WebP de forma confiável no
  card; a imagem de compartilhamento é um dos poucos lugares do site em que o formato importa mais
  que o peso.
- `width`/`height` declarados **têm que casar com o arquivo real**. Declarar 1200×630 sobre uma
  fonte de outra proporção quebra o card.
- **Capa de atrativo NÃO é imagem OG.** As capas do catálogo são WebP com proporção variada
  (832×495 a 1399×999) e servem ao conteúdo da página, não ao card. Página de atrativo herda a arte
  padrão da marca. Se um dia existir capa JPG 1200×630 por atrativo, ela pode ser passada em
  `pageMetadata({ image })`.
- ⚠️ **No Next, `openGraph` e `twitter` NÃO sofrem merge profundo com o layout.** Toda página que
  define `openGraph` precisa repetir `siteName`, `locale`, `images` (e `url`/`type`); toda página que
  define `twitter` precisa repetir `card`, `title`, `description`, `images`. O helper
  `pageMetadata()` (`lib/seo.ts`) já faz as duas coisas — preferir ele a montar `Metadata` à mão.

## 4 · Título, description e canonical por página

- `title` único por página. O layout define o template `%s | Compras Paraguay`; a home e a página
  `/r/<token>` usam `title: { absolute }` para não duplicar a marca. Título que já termina com
  "| Compras Paraguay" e passa pelo template vira marca repetida.
- `description` única por página (faixa útil ~150–160 chars; acima disso o SERP trunca).
- `canonical` relativo + `metadataBase` resolve para absoluto. Não emitir canonical cruzando
  domínio.

## 5 · robots, sitemap, llms.txt e manifest

- `app/robots.ts`: allow geral, `disallow` só de `/admin` e `/api`, `Sitemap:` absoluto. Crawlers de
  IA (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.) liberados — é sinal de GEO. Nada
  público entra em `disallow`: bloquear por robots impede o crawler de ler o `noindex` que ele nunca
  chega a ver.
- `app/sitemap.ts`: só páginas vivas; `lastModified` **só onde a data é real** — nunca `new Date()`
  por request (lastmod volátil é ignorado). Cada destino carrega `images` (image sitemap) com a capa.
  `/obrigado` e admin fora.
- `public/llms.txt`: resumo da entidade + links principais, para citação por buscadores/assistentes.
  Mantê-lo alinhado a `lib/seo.ts` (`SITE_URL`, `SITE_NAME`, temas) e às rotas canônicas.
- `public/site.webmanifest`: `id`, `scope`, `name`, `short_name`, `description`, `lang`, `start_url`
  e ícones 192/512.

## 6 · Páginas privadas e 404

- `/obrigado` e `/r/[token]` são `noindex, nofollow`. Admin já é bloqueado no `middleware.ts` e no
  `robots.txt`.
- `/r/[token]` também emite **`X-Robots-Tag: noindex, nofollow`** por header (`next.config.ts`),
  além da meta tag. Token inexistente responde **404 real** (`notFound()`), não 200 com aviso —
  soft 404 confunde ferramenta de webmaster.
- Rota inexistente responde 404 com `app/not-found.tsx`.

## 7 · JSON-LD (grafo de entidade)

- O layout emite `Organization` (`#organization`), `WebSite` (`#website`) e `TouristDestination`
  (`#foz-destino`). Nós de conteúdo referenciam esses `@id` — não repetir o objeto `Organization`
  inteiro.
- `sameAs` do `Organization` aponta para os perfis do grupo que respondem pelo conteúdo — o domínio
  não tem redes próprias. Ver `marca-e-escopo.md` §2.
- Não declarar `offers`/`price` quando não há oferta nem pagamento, nem `SearchAction` sem busca
  real: schema é afirmação sobre o que o site faz.
