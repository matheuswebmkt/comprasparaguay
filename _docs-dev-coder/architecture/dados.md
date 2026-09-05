// Filepath: \_docs-dev-coder/architecture/dados.md
// Parte de architecture.md (índice em ../architecture.md)

# ARCHITECTURE · DADOS (ESTÁTICO)

> Fonte única de verdade para caminhos, módulos e fronteiras.
> Cabeçalhos `###` PRESERVADOS do arquivo original — referências cruzadas continuam válidas.

---

### Dados (estático)

Fontes estáticas em `app/data/*.ts` — dado de negócio em TypeScript, não banco. `app/types/index.ts`
concentra os tipos compartilhados.

| Arquivo | Conteúdo |
|---|---|
| `attractions.ts` | Catálogo reduzido a **5 atrativos** do eixo compras/fronteira (`compras-paraguai-ciudad-del-este`, `by-night-argentina-puerto-iguazu`, `duty-free-shop-puerto-iguazu-argentina`, `cataratas-jl-shopping`, `shopping-catuai-palladium`) — `attractions`, `getAttractionBySlug`. Cada item tem `slug`/`name`/`tagline`/`description`/`highlights`/`cover`/`info`/`faq`/`seoTitle`/`seoDescription`. Sem preço (§21.7). |
| `partners.ts` | Parceiros locais (negócios reais). 3 categorias fixas (`partnerCategories`) — ver `conventions/produto.md` §3. `partners`, `activePartners`, `getPartnerBySlug`. |
| `agencies.ts` | Catálogo de agências de turismo (SSOT de perfil — ver `architecture/entidades.md`). `AgencyProfile`, `OFFICIAL_AGENCY_SLUG`. |
| `niches.ts` | Nichos do cluster SEO — 8 chaves: bar-e-cervejaria, churrascaria, restaurante, pizzaria, shawarma, sushi, hamburgueria, transfer. `niches`, `getNiche`, `getNicheByKey`, `buildNiche*`. Apenas a página dedicada transfer tem conteúdo editorial/seções/FAQ; os nichos de gastronomia carregam identidade + SEO (legado, sem página viva). Ver `conventions/visibilidade-parceiros.md` §14. |

### Tipos compartilhados (`app/types/index.ts`)

- `Attraction`, `AttractionLogistics`, `AttractionCorridor`, `AttractionWeight`, `AttractionRole`,
  `DayTurno` (`"manha" | "tarde" | "noite"`).
  - `Attraction.publishedAt`/`updatedAt` (ISO `YYYY-MM-DD`, opcionais) alimentam
    `datePublished`/`dateModified` do `articleSchema` da página **e** o `lastModified` do atrativo
    em `app/sitemap.ts`. `updatedAt` sobe quando o CONTEÚDO real muda (texto, FAQ, endereço), não
    em ajuste técnico. Sem valor, a rota cai num fallback e o sitemap omite o campo.
  - ⛔ **`Attraction` não tem coordenadas e não deve ganhar** (decisão do usuário): endereço em
    texto plano basta, com link opcional para o Google Maps. Não re-propor `geo`/`GeoCoordinates`.
  - ⛔ **Não adicionar campo de "tem ingresso"** aqui: a fonte única é a flag "Tem link" do admin
    (`attraction_offer_settings`) — ver `conventions/funil-modal.md` §17-ter.
- `Roteiro`, `RoteiroDiasCount` (`1 | 2 | 3 | 4 | 5 | 6 | 7` — o tipo permite até 7, mas o acervo
  pronto só gera 1–3; ver `conventions/produto.md` §0).
- `Partner`, `PartnerCategory`.

⚠️ **Preço não existe no dado que chega ao visitante.** `Roteiro.preco_base` está em remoção (ver
`conventions/produto.md` §0); enquanto existir no tipo, não renderizar. `Partner.priceRange`
(`$`/`$$`/`$$$`) é faixa qualitativa de restaurante, não preço de produto — esse é permitido.
