// Filepath: \_docs-dev-coder/architecture/seo-design.md
// Parte de architecture.md (índice em ../architecture.md)

# ARCHITECTURE · SEO E ENTITY SEO/GEO

> Fonte única de verdade para caminhos, módulos e fronteiras.
> Cabeçalhos `###` PRESERVADOS do arquivo original — referências cruzadas continuam válidas.

---

### SEO técnico

- **`lib/seo.ts`** é o módulo central: `SITE_URL`, `SITE_NAME`, `BRAND_OG_IMAGE`,
  `FOZ_PRIMARY_KEYWORDS`, `SILO_KEYWORDS`, `pageMetadata` (helper de metadata padrão),
  `nichePillar`. Geradores de copy SEO por tipo de entidade: `attractionSeoTitle`/
  `attractionSeoDescription`/`attractionKeywords`/`attractionDefaultFaq`,
  `defaultRoteiroSeoTitle`/`defaultRoteiroSeoDescription`/`roteiroDefaultFaq`.
- **`attractionPlaceLabel(a)`** resolve o lugar a partir do dado (`country`/`city`): `"Foz do
  Iguaçu"` para BR, `"<cidade>, Argentina"` para AR, `"<cidade>, Paraguai"` para PY. Existe porque
  havia `alt` e título com `"Foz do Iguaçu"` fixo, afirmando que atrativo de Puerto Iguazú ou do
  Paraguai fica em Foz. Sempre que um texto precisar nomear onde o atrativo está, usar o helper —
  nunca literal.
- **JSON-LD** (`components/JsonLd.tsx` + geradores em `lib/seo.ts`): `organizationSchema`,
  `websiteSchema`, `fozDestinationSchema`, `itemListSchema`, `webPageSchema`, `breadcrumbSchema`,
  `partnerSchema`, `attractionSchema`, `roteiroTripSchema`, `faqSchema`, `articleSchema`. Cada
  página de ranqueamento monta o próprio conjunto — `FaqAccordion` (componente visual) **não** emite
  JSON-LD, para não duplicar `FAQPage` quando a página já emite o dela (ver
  `design-system/componentes.md` §7.7).
- **`webPageSchema`** cobre as institucionais, com `@type` variável: `WebPage` em `/aviso-legal`,
  `ContactPage` em `/contato`, `AboutPage` em `/sobre`.

#### ⛔ Duas ausências que são DECISÃO, não esquecimento

Ambas foram removidas de propósito. Quem ler o gerador vai achar que falta campo — não falta.

- **`attractionSchema` NÃO emite `offers`.** Emitia um `Offer` com `price` fabricado, e nós não
  vendemos ingresso nem sabemos o preço de nada (§21.7: preço não é assunto nosso; quem orça é a
  agência, depois do lead). Declarar preço falso em dado estruturado é o tipo de coisa que rende
  penalização manual, não ranking. **Não reintroduzir** — nem "só com `priceCurrency`", nem com
  `AggregateOffer`. Se um dia houver preço real e autorizado, é decisão de produto, não de SEO.
- **`websiteSchema` NÃO emite `potentialAction`/`SearchAction`.** Apontava para uma rota de busca
  **que não existe** no site. `SearchAction` só faz sentido com endpoint de busca real; sem ele o
  Google ignora na melhor hipótese e desconfia na pior.
- **Canonical:** toda página define `alternates.canonical` na própria metadata. Rotas com forma
  curta (`/o-que-fazer`, `/atrativos`, `/transfer`, `/triplice-fronteira`) são a única forma
  canônica — ver `architecture/rotas.md`. A home canoniza em `SITE_URL` **sem barra final**, e
  `app/sitemap.ts` declara a mesma string: sitemap e canonical não devem divergir nem em barra.
- **i18n e canônica:** o site serve pt/en/es por **cookie**, sem rota por locale. Logo não há
  `hreflang` nem URL alternativa: a canônica é única e `metadata`/JSON-LD ficam **sempre em pt**
  (`conventions/posicionamento.md` §21.8-2). O que traduz é o conteúdo visível, não o dado
  estruturado. O crawler vê o DOM em pt: o middleware não semeia `locale` para bots e o
  `LocaleProvider` resolve só por cookie (sem fallback de `navigator.language`), caindo em pt.
- **Sitemap e robots:** `app/sitemap.ts` e `app/robots.ts` — ver `architecture/rotas.md`, seção
  "Sitemap e robots".

### Entity SEO / GEO

- O produto se posiciona como **entidade única e consistente** (Compras Paraguay) em todo JSON-LD —
  `organizationSchema`/`websiteSchema` no layout raiz garantem que o nome, a URL e a descrição do
  site sejam sempre os mesmos, para mecanismos de busca e assistentes de IA tratarem o site como
  uma entidade coerente (não uma coleção de páginas soltas).
- Conteúdo original vs. fatos livres: o texto editorial (descrições de atrativos, guias por
  duração) é escrito para ser útil e específico, não paráfrase de agregador — ver
  `conventions/posicionamento.md` §21 para a voz. Dados objetivos e verificáveis (endereço,
  horário, distância) podem repetir o que é de conhecimento público; a interpretação/recomendação é
  original.
- Ver `conventions/seo.md` para o checklist obrigatório de SEO robusto em página nova de
  ranqueamento — este arquivo documenta o mecanismo técnico, aquele trava a regra de processo.
