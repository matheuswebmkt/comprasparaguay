// Filepath: \_docs-dev-coder/conventions/seo.md
// Parte de conventions.md (índice em ../conventions.md)

# CONVENTIONS · SEO

> Restrições duras do projeto. NÃO re-propor decisões já travadas aqui.
> Numeração das seções PRESERVADA do arquivo original (§N) — referências cruzadas continuam válidas.
> ⚠️ Mecanismo técnico (módulos, JSON-LD, sitemap) está em `architecture/seo-design.md`. Esta seção
> trava as regras de conteúdo e o checklist de processo.

---

## 8. SEO / GEO — conteúdo original vs. fatos livres

- **Conteúdo editorial é original** — descrições de atrativos, guias por duração e recomendações
  são escritos para o visitante deste site, não paráfrase de agregador ou de outro guia turístico.
  Dado objetivo e verificável (endereço, horário de funcionamento, distância entre pontos) pode
  coincidir com o que está publicamente disponível — a interpretação e a recomendação (o que fazer
  em qual ordem, o que vale a pena) é que precisa ser original.
- ⚠️ **Posicionamento não pode custar a intenção de busca** — ver
  `conventions/posicionamento.md` §21.6 para a divisão de função entre H1 (intenção + promessa),
  subtítulo/CTA (ganho concreto) e o mapa de termos por página (uma intenção por página, sem
  canibalizar o próprio pilar editorial).
- **Entity SEO:** o site se apresenta como entidade única e consistente (nome, URL, descrição)
  em todo JSON-LD, para mecanismos de busca e assistentes de IA tratarem o conjunto de páginas como
  um portal coerente, não páginas soltas. Ver `architecture/seo-design.md`.
- ⚠️ **O DADO É AUTORIDADE sobre o helper (regra dura).** `seoTitle`/`seoDescription` de um item de
  `app/data/*.ts` sempre vencem; os geradores de `lib/seo.ts` são **fallback**, para item que não
  tem valor próprio. **Nunca condicionar o valor do dado a um regex** ("só uso o título do dado se
  ele contiver tal palavra"). Um gate desses já existiu em `attractionSeoTitle`/
  `attractionSeoDescription`: nasceu razoável, quando o catálogo tinha títulos herdados fracos, e
  virou destrutivo depois que o catálogo foi reescrito — passou a descartar **todos** os títulos e
  quase todas as descrições, servindo um molde único em todas as páginas de atrativo. O modo de
  falha é silencioso: nada quebra, os tipos passam, o checker fica verde e a página parece certa
  até alguém comparar o dado com o HTML. Conteúdo fraco se conserta no dado.

## 19. Checklist obrigatório de SEO robusto (regra dura)

Toda página nova de ranqueamento (pilar editorial, hub, página individual de atrativo/roteiro/
parceiro) precisa, antes de publicar:

- [ ] `metadata` própria: `title`, `description`, `alternates.canonical` — nunca herdar do layout
      pai sem override.
- [ ] `keywords` no `metadata` cobrindo a intenção de busca real da página (conferir contra o mapa
      de termos por página, `conventions/posicionamento.md` §21.6, para não duplicar a intenção de
      outra página já existente).
- [ ] `openGraph` com título, descrição e imagem (`BRAND_OG_IMAGE` como fallback).
- [ ] Pelo menos um bloco de **JSON-LD** relevante ao tipo de conteúdo: `breadcrumbSchema` sempre;
      `faqSchema` se a página tem FAQ visível; `articleSchema`/`attractionSchema`/`roteiroTripSchema`
      conforme o tipo de entidade.
- [ ] FAQ visível usa `components/FaqAccordion.tsx` (não recriar a marcação) — e o JSON-LD do FAQ é
      emitido pela **página**, não por um componente **reusável** (evita `FAQPage` duplicado).
      ⚠️ O critério é a reusabilidade, não o tipo de arquivo: uma SEÇÃO entre várias de uma página
      (ex.: a FAQ da home) nunca emite, porque basta a página passar a emitir — ou um segundo lugar
      reusar a seção — para nascerem dois `FAQPage` no mesmo documento. Já um **template de página
      1:1 com a rota** (ex.: `NichePageTemplate`, que é o corpo inteiro de `/hospedagem` e
      `/transfer` e é renderizado uma única vez em cada) pode emitir: mover o JSON-LD dali só
      duplicaria o mesmo bloco em duas rotas, sem remover risco nenhum.
- [ ] Nenhum preço, faixa ou "a partir de" em copy pública (`conventions/posicionamento.md` §21.7).
- [ ] Copy passa por `pnpm check:copy` sem violação.
- [ ] A rota nova entra em `app/sitemap.ts` se for página pública indexável (conferir se já não é
      gerada automaticamente a partir de um catálogo de dados, como `attractions`/`roteiros`).

### Padrão de `title` e `description` — página de atrativo (regra dura)

O `title` de atrativo é espaço de **oferta**, não de geografia: marca, URL e breadcrumb já dizem
onde o site é. A forma canônica:

```
{Nome}: {modificador real} e roteiro [completo] [+ âncora de lugar]
```

- **Teto de 60 caracteres.** Acima disso o Google trunca.
- **Sem sufixo `| Compras Paraguay`.** Custa ~14 caracteres, repete a palavra "roteiro" que o próprio
  padrão já usa, e o nome do site é montado pelo buscador a partir de `og:site_name` +
  `WebSite` schema, que o layout raiz já emite. Home e hubs mantêm a marca — lá ela é o termo.
- **Estourou o teto → encurtar o NOME** (`Refúgio Biológico`, `Mesquita Árabe`,
  `Helisul Experience`). **Nunca** remover a âncora: o nome já é único, a âncora é o que repete e
  constrói o padrão. Âncora que aparece e some não é padrão, é inconsistência.
- **Âncora por país, sempre verdadeira:** `em Foz` (BR) · `em Puerto Iguazú` (AR) · `no Paraguai`
  (PY). ⛔ Nunca `em Foz do Iguaçu` num título de atrativo — 16 caracteres por uma informação já
  dada três vezes. E nunca localizar em Foz um atrativo de AR/PY: é erro factual e contradiz o
  `addressCountry` do JSON-LD da mesma página.
- **Modificador reflete o que o lugar é:** `ingresso` (bilhetado) · `visita` / `o que ver`
  (entrada pública) · `compras` · `jantar`/`show`. Prometer ingresso em lugar de entrada franca
  não casa com busca nenhuma e promete o que a página não entrega. Conferir contra a flag
  "Tem link" do atrativo (`conventions/funil-modal.md` §17-ter) — a flag manda.
- **Minúscula depois dos dois-pontos.**

⚠️ **Atrativo consolidado — quando o modificador vira o nome dos sub-passeios.** Quando UMA página
cobre vários produtos nomeados que são termos de busca por si só, esses nomes ocupam o slot do
modificador no lugar de `ingresso`. Caso vivo: `itaipu-binacional` reúne Panorâmica, Especial e
Iluminada numa URL só (decisão de produto: não multiplicar páginas para o mesmo atrativo), e o
título nomeia os três. A intenção de ingresso não se perde — ela fica na `description`, no corpo e
na FAQ. **Só vale quando os sub-nomes têm busca própria**; não é licença para trocar `ingresso` por
adjetivo bonito em atrativo comum.

⚠️ **Consolidar exige dar superfície a cada sub-produto dentro da mesma página**, senão ela fica
genérica e não ranqueia para nenhum deles: um parágrafo comparativo na descrição, o `info` como
tabela (horário e duração de cada um) e **uma pergunta de FAQ dedicada a cada sub-passeio** — que
entra no `FAQPage` do JSON-LD e é o que cobre o long-tail sem criar URL nova.

**Página de hub / editorial** (`/`, `/atrativos`, `/o-que-fazer`, `/roteiros`, `/onde-comer`,
`/triplice-fronteira`, `/hospedagem`, `/transfer`, institucionais) segue os mesmos limites — title
≤ 60, description até ~165 —, com uma diferença: **o sufixo `| Compras Paraguay` FICA**, porque ali o
termo de busca é genérico e a marca diferencia na SERP.

⚠️ **Exceção: o sufixo cai quando desloca um termo de busca real.** Só dois casos hoje, e os dois
pelo mesmo motivo — a marca ocuparia o lugar da consulta:
- **`/` (home):** "Roteiro" + "Foz do Iguaçu" já É o nome da marca; o sufixo seria a terceira
  repetição, custando ~14 caracteres do teto sem acrescentar termo.
- **`/triplice-fronteira`:** "Brasil, Argentina e Paraguai" É a consulta da página; com o sufixo,
  os três países não cabem.

Piso de description: **não existe**. O intervalo 128–165 é conforto de SERP, não regra — description
curta não é penalizada, só usa menos espaço. Não reescrever texto aprovado por 2 caracteres.

A `description` **vende, não orienta** — a função dela é ganhar o clique na SERP, não instruir.

- 128–165 caracteres.
- ⛔ **Fora:** duração ("2 a 3 horas", "meio período"), "ideal para X" (exclui quem não é X),
  dica, instrução ("reserve", "leve", "confirme") e enquadramento condicional ("bom plano B em dia
  de chuva" diz ao leitor que em dia de sol não presta). Tudo isso é conteúdo **de dentro da
  página**, onde é útil.
- ✅ **Dentro:** o que a pessoa vai ver ou sentir, o diferencial concreto do lugar, e o fecho fixo
  com a oferta — `Ingresso e roteiro completo em Foz do Iguaçu` (BR) ou
  `… a partir de Foz do Iguaçu` (AR/PY), que é a ponte honesta para quem busca partindo de Foz.
- ⚠️ Meta description **é copy lida pelo visitante** (na SERP). `posicionamento.md` §21 vale ali
  inteira — inclusive a proibição de antecipar canal ou instante (§21.2) e de nomear o parceiro
  comercial em copy de marketing (§21.5).

---

### Padrão de `title` e `description` — página de ROTEIRO PRONTO (regra dura)

Outro problema que o de atrativo: um roteiro é um **plano**, e o conteúdo dele muda. Por isso a
regra central aqui não é de comprimento, é de **durabilidade**.

⛔⛔ **NUNCA nomear atrativo na copy indexada de um roteiro.** Decisão do usuário, e ela conserta um
defeito real: o itinerário de um plano é reorganizado com o tempo, mas o que o Google indexou fica.
A versão anterior nomeava os atrativos e **mentia** — a description do roteiro de 1 dia prometia
Itaipu, que só entra a partir do de 2 dias. Copy que descreve conteúdo interno envelhece sozinha e
ninguém percebe, porque nada quebra.

✅ **O que pode entrar — só o permanente:**

| Eixo | Por que é durável |
|---|---|
| Duração (1, 2, 3 dias) | é o próprio slug |
| Perfil (clássico / aventura / compras) | é a taxonomia do produto |
| Países da fronteira | Brasil, Argentina e Paraguai não mudam |
| A promessa do produto | turnos definidos, sequência que poupa deslocamento, o que reservar antes |

O último é o que de fato vende: **a description vende o PLANO, não o conteúdo dele.** O que o
visitante compra aqui é a ordem já resolvida, não a lista de lugares — a lista ele acha em qualquer
portal.

**Onde a copy vive:** `SEO_DESCRIPTIONS` e `seoTitleFor()` em `app/data/roteiros.ts`, chaveados por
`${diasCount}-${profile}`. Não vive em `page.tsx` nenhum — `generateMetadata` só lê o dado.

⚠️ **`seoTitle` de roteiro NÃO leva a marca.** `app/layout.tsx` define
`title.template = "%s | Compras Paraguay"` e a anexa sozinho. A versão anterior já trazia
`| Roteiro Foz do Iguaçu` no valor e saía com a marca **duas vezes** (68 chars, acima do corte).
Mesmo bug que o `/sobre` teve — vale para qualquer título montado fora de um `page.tsx`.

### ⚠️ Varredura de duplicata: ler o HTML GERADO, não o código-fonte

Uma varredura de `title`/`description` que lê strings literais em `app/**/page.tsx` **não enxerga
metadata gerada em runtime**. Os 9 roteiros saem de `buildCatalog()`, então passaram inteiros por
uma auditoria que reportou "0 duplicatas" — enquanto serviam **3 descriptions para 9 páginas**.

A verificação válida é sobre `.next/server/app/**/*.html` depois do build:

```js
// title/description por rota, direto do HTML servido
(s.match(/<title>([^<]*)<\/title>/) || [])[1]
(s.match(/name="description" content="([^"]*)"/) || [])[1]
```

Vale para qualquer página cuja metadata venha de `generateMetadata` ou de catálogo gerado.
