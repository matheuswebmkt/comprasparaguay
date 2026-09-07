// Filepath: \_docs-portfolio/pixel-matrix.md
// Version: 1.2
// Nome da Versão: "+ satélite `comprasparaguay` (4º domínio no pixel único) — enum é aditivo, ver D14"
// TAXONOMY_VERSION: 2026-09-v1

# MATRIZ DO PIXEL — DOCUMENTO DE PORTFÓLIO

> ⚠️ **ESTE ARQUIVO NÃO PERTENCE A ESSE REPOSITÓRIO.**
> Ele é copiado **verbatim** em todos os repositórios plugados. Cada repositório é um satélite —
> hoje `rodagigantefoz`, `roteirofoz` e `comprasparaguay`, com `toemfoz` no caminho — e nenhum deles
> é núcleo, base, nem tem precedência. Alterar esta matriz é alterar o contrato de todos ao mesmo
> tempo.
>
> **Normativo (o QUE).** O porquê de cada decisão, e o que foi rejeitado, está em
> `pixel-decisions.md`. Não altere uma regra daqui sem uma entrada correspondente lá.
> A execução em código está em `lib/tracking-taxonomy.ts` (mesmo `TAXONOMY_VERSION`).

---

## 0 · Regra zero

**Existe UM pixel para todos os domínios do portfólio.** Não se cria pixel por projeto, por vertical,
por parceiro ou por campanha. A separação é feita por **parâmetro** + **Conversão
Personalizada** no painel do Meta — nunca por pixel novo. Ver decisão D1 (e D14, sobre plugar um
satélite novo).

---

## 0-bis · Estado da implementação

> ⚠️ **ESTA MATRIZ DESCREVE O ALVO.** Ela é normativa (é o contrato). Esta seção — e **só** ela —
> diz quanto de cada satélite já chegou lá. O resto do arquivo não fala de projeto nenhum.
>
> Colunas: **RGF** = `rodagigantefoz` · **RF** = `roteirofoz` · **CP** = `comprasparaguay` ·
> **TEF** = `toemfoz`.
> `—` = a superfície não existe naquele satélite (decisão de produto, não pendência).

**No código:**

| | RGF | RF | CP | TEF |
|---|---|---|---|---|
| Contrato + enums (`lib/tracking-taxonomy.ts`) | ✅ | ✅ | ✅ | ❌ |
| `property` injetado no funil de disparo | ✅ | ✅ | ✅ | ❌ |
| `vertical` / `niche` / `partner_slug` nos eventos | ✅ | ✅ | ✅ | ❌ |
| `InitiateCheckout` no início do fluxo; saídas → `Contact` | ✅ | ✅ | ✅ | ❌ |
| `ViewModalVIP` fora do código | ✅ | ✅ | ✅ | ❌ |
| `content_name` hardcoded fora do `Lead` | ✅ | ✅ | ✅ | ❌ |
| `ViewContent` em página/modal de item | ✅ | ✅ | ✅ | ❌ |
| `value` no `Lead` (`lib/lead-value.ts`) | ✅ | ✅ | ✅ | ❌ |
| `content_ids` no bundle (§1.3) | — produto não é bundle | ✅ | ✅ — bundle = destino de entrada + extras marcados no modal | ❌ |
| `transfer` no 2º ponto de contato | ✅ | — tela não existe | — tela não existe | ❌ |
| `lead_kind` emitido (§1.4) | ✅ só `ticket` | ✅ `ticket` + `experience` | ✅ só `ticket` — o slot `experience` existe, nenhum gatilho o dispara ainda | ❌ |

**Fora do código — depende do painel do Meta, e nada disso é retroativo em termos de otimização:**

| | RGF | RF | CP | TEF |
|---|---|---|---|---|
| Domínio verificado no Business Manager | ✅ | ❌ | ❌ | ❌ |
| Conversões Personalizadas por `vertical` (§10) | ❌ | ❌ | ❌ | ❌ |
| Validação manual Pixel×CAPI (mesmo `event_id`, mesmo `value`) nos Test Events | ✅ | ✅ | ⏳ pendente | ❌ |

> As Conversões Personalizadas seguem pendentes em todos os satélites — são filtros **retroativos**
> e podem esperar.
>
> ✅ **G1 validado nos satélites abaixo.** Cada validação prova a simetria do CÓDIGO daquele
> repo, por isso não se herda — um satélite recém-plugado, ou um com o funil alterado, precisa da
> própria.
>
> | Satélite | `event_id` | `value` | Sinais exercitados |
> |---|---|---|---|
> | `rodagigantefoz` | `408080e0…` | 135 | ingresso, transfer, planning, 3 ingressos |
> | `roteirofoz` | `b0c248d5…` | 120 | roteiro (`experience`), transfer, planning, **6 `content_ids`** |
>
> ⏳ **Pendente:** `comprasparaguay`. O código está plugado e a simetria é a mesma função
> (`buildLeadEventParams` nas duas pontas), mas a validação é do código **daquele** repo: sem rodar,
> a linha não pode ser preenchida — e um `event_id` copiado de outro satélite é um registro falso.
>
> Nos dois casos o payload do Pixel foi capturado instrumentando o `fbq` no navegador e o do CAPI
> lido na aba Testar eventos — os 10 params bateram um a um.
>
> **Três armadilhas de método, para quem for repetir:**
>
> 1. ⚠️ **O evento do NAVEGADOR não aparece na aba de teste.** O `test_event_code` é adicionado só no
>    servidor (`lib/meta-capi.ts`); o `fbq` do client não o carrega, então o evento dele segue para o
>    fluxo normal do pixel. A comparação é CRUZADA. Sem saber disso, a conclusão errada é "o Pixel
>    não disparou".
> 2. ⚠️ **O `test_event_code` ROTACIONA.** Atualizar a página do Test Events pode gerar um código
>    novo, e aí os eventos carimbados com o anterior não aparecem mais. Fixar o código no `.env`,
>    reiniciar o servidor e **não atualizar a aba** durante o teste.
> 3. ⚠️ **Rodar o fluxo inteiro em segundos.** O token do Turnstile expira em ~5 min; um teste
>    fatiado em passos lentos falha no anti-bot sem que nada esteja quebrado.

> ⛔ **O AEM SAIU DO PAINEL (constatado jul/2026, na interface).** A tela "Mensuração de eventos
> agregados" — onde se escolhia um domínio verificado e se priorizava até 8 eventos por causa do
> ATT/iOS 14 — **foi removida pelo Meta**. A agregação para usuário com rastreamento restrito passou
> a ser automática (modelagem estatística), sem priorização manual e **sem o limite de 8 eventos**.
>
> **O que continua valendo:** verificar o domínio (Configurações do Negócio → Segurança da Marca →
> Domínios) e manter Pixel + CAPI enviando limpo.
>
> ⚠️ Isto **enfraquece um dos três argumentos do D10** (o "gasta um slot de AEM"). A decisão de
> descartar o `ViewModalVIP` **permanece de pé** pelos outros dois, que não dependem do AEM: evento
> custom não é cidadão de primeira classe no painel, e o nome era vocabulário do RGF dentro de um
> pixel de portfólio (D9). Não reabrir a decisão por causa disto.

Atualize estas tabelas na mesma rodada em que implementar cada item — tabela de status
desatualizada é pior que não ter tabela. E atualize **em todos os repositórios plugados, na mesma
rodada**: o arquivo é copiado verbatim, então uma tabela que só um satélite enxerga não é status, é
boato.

---

## 1 · As dimensões

Dividem-se em dois grupos, e a diferença de tipagem é deliberada:

**Segmentação — ENUM FECHADO.** São as dimensões nas quais se funda regra de painel. Valor
livre é proibido: uma regra de Conversão Personalizada que deixa de casar **não emite erro** —
ela apenas passa a retornar menos, em silêncio, e você descobre pelo resultado ruim da campanha
semanas depois.

| Param | Responde | Valores | Origem |
|---|---|---|---|
| `property` | onde aconteceu | `rodagigantefoz` · `roteirofoz` · `comprasparaguay` · `toemfoz` | domínio sem TLD |
| `vertical` | qual dos 4 produtos | `atrativos` · `transporte` · `hotelaria` · `gastronomia` | ver §1.1 |
| `niche` | sub-tipo dentro do vertical | `Niche.key` (ver §1.2) | `app/data/niches.ts` |

**Atribuição — STRING LIVRE.** Identificam o item ou o negócio. Não são enum porque **nunca
fundam regra** (D5) — tipá-las seria manutenção infinita por benefício zero, já que o catálogo
de parceiros e atrativos muda o tempo todo.

| Param | Responde | Valores | Origem |
|---|---|---|---|
| `item_slug` | **O QUÊ** — o produto vendido | slug do atrativo/experiência | `attractions.ts` · `experiences.ts` |
| `content_ids` | **array** — tudo que o pacote inclui | slugs (combos/roteiros) | idem, ver §1.3 |
| `partner_slug` | **QUEM** entrega/monetiza | slug do negócio | 3 fontes, ver §1.4 |

⚠️ **`item_slug` e `partner_slug` não são alternativas — convivem no mesmo evento.** Uma
experiência vendida pela agência sai com `item_slug=roda-gigante-cataratas` **e**
`partner_slug=foz-falls`. Um diz o que foi vendido; o outro, quem entrega.

### 1.1 `vertical` × `PartnerCategory` — NÃO é 1:1

O projeto já tem `PartnerCategory` (`gastronomia` · `hotelaria` · `turismo`, fixas por
convenção). O mapeamento para `vertical` é:

| `PartnerCategory` | `vertical` |
|---|---|
| `gastronomia` | `gastronomia` |
| `hotelaria` | `hotelaria` |
| `turismo` | `transporte` |
| *(não existe)* | `atrativos` |

Duas divergências deliberadas:

- **`turismo` → `transporte`**: a categoria `turismo` agrupa agências/receptivos, cujo
  produto que monetizamos é o transfer. "Transfer" e "transporte" são a mesma coisa no
  vocabulário do negócio; o padrão usa `transporte` porque é o slug que já existe na rota.
- **`atrativos` não tem categoria de parceiro** porque não é produto de parceiro — é produto
  próprio (roda gigante, ingressos, experiências, combos, roteiros).

### 1.2 Valores de `niche` — usar `Niche.key`, NUNCA `Niche.slug`

`Niche` tem **dois** identificadores e eles são diferentes:

- `slug` = segmento de URL (`pizzaria-em-foz-do-iguacu`) — **não usar no pixel**
- `key` = chave estável de match com `Partner.niches` (`pizzaria`) — **é esta**

Valores atuais de `key`: `bar-e-cervejaria` · `churrascaria` · `restaurante` · `pizzaria` ·
`shawarma` · `sushi` · `hamburgueria` · `hospedagem` · `transfer`

Adicionar um nicho novo é ato deliberado (editar `niches.ts`) — o enum cresce junto, sem
entrada em `pixel-decisions.md`. Trocar o **significado** de uma key existente, não.
**Renomear o valor** de uma key existente também não: exige entrada aqui e nos satélites, com
bump do `TAXONOMY_VERSION` — foi o que o D13 fez com `agencia-de-turismo` → `transfer`.

⚠️ **A travessia dado→enum é feita por `asNiche()`**, nunca por cast. `Partner.niches` é
`string[]` livre: se o catálogo do projeto ganhar uma key que o portfólio ainda não conhece,
`asNiche` devolve `undefined` e o param é **omitido** (D8). Sem essa ponte, uma key nova vazaria
para o pixel compartilhado como valor órfão — e valor órfão no histórico não se apaga.
O par equivalente para categoria é `verticalOfPartnerCategory()`.

⚠️ **Nenhum ponto de disparo escreve o valor à mão** — importa de `VERTICALS.*` / `NICHE_KEYS.*`
(G7). Os dois objetos usam `satisfies` contra os types, então acrescentar um valor ao type sem
acrescentar ao objeto **não compila**: é impossível a lista ficar desatualizada em silêncio.

### 1.3 Identificação do item

| Param | Cardinalidade | Para quê |
|---|---|---|
| `item_slug` | valor único | o produto de entrada (`roda-gigante`, `cataratas`, …) |
| `content_ids` | **array** | tudo que o pacote inclui — combos, experiências, roteiros |

Um combo envolve vários atrativos ao mesmo tempo e `item_slug` sozinho não expressa isso.
`content_ids` é campo nativo do Meta e aceita array. **Proibido concatenar**
(`item_slug: "cataratas-rodagigante-aves"`) — isso quebra toda regra de painel.

No Roteiro Foz o produto **é** o bundle: lá `content_ids` deixa de ser opcional.

### 1.4 `partner_slug` — TRÊS fontes, um param

Não sai só de `partners.ts`. São três arquivos alimentando o mesmo parâmetro:

| Fonte | Campo | Slugs hoje (RGF) |
|---|---|---|
| `app/data/partners.ts` | `Partner.slug` | `patanegra-cervejaria`, `cantina-la-gregoria` |
| `app/data/agencies.ts` | `AgencyProfile.slug` | `foz-falls`, `agencia-teste` |
| `app/data/hotels.ts` | `HotelProfile.slug` | `doubletree-by-hilton-foz-do-iguacu`, `hotel-teste` |

⚠️ **Nada no código impede colisão de slug entre os três arquivos.** Hoje não colidem; ao
cadastrar um negócio novo, confira os três.

⚠️ **Existem slugs de TESTE no dado** (`agencia-teste`, `hotel-teste`). Se algum ficar ativo
por engano, o slug de teste entra no pixel de portfólio e **não sai mais** — evento enviado
não se apaga.

### 1.5 Slug de DADO ≠ slug de ROTA (regra dura)

**O que vai ao pixel é sempre o identificador do dado, nunca a URL.** Ver decisão D11.

- **Parceiro, agência e hotel não têm rota própria** — são cards nas páginas hub, e o clique
  abre um modal. Decisão de manutenção do produto: evita criar centenas de páginas e ter que
  gerenciar 301/308 + reindexação no Search Console a cada troca de parceiro.
- **Atrativos e experiências têm rota** (`/atrativos-foz/roda-gigante`) — mas isso é
  coincidência de roteamento, não o significado do param.

🔒 **Renomear uma rota por SEO NÃO muda o `item_slug`.** Quebrar histórico de pixel para
ganhar palavra-chave é troca ruim, e é exatamente o tipo de mudança que alguém faz de boa-fé
achando que está sendo consistente. Quando o slug de rota e o de dado divergirem, quem manda
no pixel é o **de dado**.

**Três consequências de parceiro/agência/hotel não terem rota:**

1. `partner_slug` é o **ÚNICO** canal desse dado até o Meta. Não existe regra de "URL contém
   `/cantina-la-gregoria`" para cair de paraquedas — se o param não for enviado, o dado não
   existe no pixel, nem retroativamente. Reforça D5: **mandar sempre**.
2. O `ViewContent` deles só pode existir na **abertura do modal** — não há page load onde
   disparar.
3. As páginas hub (`onde-comer-…`, `hospedagem-…`, `transporte`, e o futuro
   `/gastronomia/<nicho>`) são **listas**: ficam com `PageView` + o `ImpressionObserver`
   1st-party que já existe. **Nunca `ViewContent` no load delas** — lista é `view_item_list`,
   não `view_item`.

---

## 2 · Regra de omissão (regra dura)

**Dimensão desconhecida ou inaplicável é OMITIDA do payload. Nunca preenchida.**

Proibido: `niche: ""`, `vertical: "none"`, `journey_stage: "unknown"`, `partner_slug: "n/a"`.

Parâmetro **ausente** não atrapalha regra de Conversão Personalizada. Placeholder em volume
dilui a regra e a faz parar de casar sem avisar.

Corolário importante: **"deixar o padrão pronto" acontece nesta matriz e no enum, não no
payload.** Um site envia só o que realmente tem. O contrato existir não obriga ninguém a
preencher.

---

## 3 · A árvore

```
PIXEL (portfólio — não pertence a nenhum site)
│
├── property ......... rodagigantefoz | roteirofoz | comprasparaguay | toemfoz
│
└── vertical ......... atrativos | transporte | hotelaria | gastronomia
    │
    ├── atrativos ......... niche: —                 item_slug + content_ids[]
    │   └── ViewContent → InitiateCheckout → Lead ✅(value) → Contact
    │       extras: lead_kind, journey_stage, ticket_qty, transfer
    │
    ├── transporte ........ niche: transfer             partner_slug: (rotativo)
    │   └── cavalga no Lead de atrativos via transfer=true
    │       futuro: Lead próprio → exige peso aprovado em §5
    │
    ├── hotelaria ......... niche: hospedagem           partner_slug: (rotativo)
    │   └── ViewContent → Contact          ❌ sem Lead (não há formulário)
    │
    └── gastronomia ....... niche: pizzaria | churrascaria | restaurante | sushi |
        │                          hamburgueria | shawarma | bar-e-cervejaria
        │                  partner_slug: cantina-la-gregoria, pantanegra, …
        └── ViewContent → Contact          ❌ sem Lead hoje
                   no toemfoz provavelmente ganha Lead → exige peso aprovado em §5
```

⚠️ As ausências marcadas com ❌ são fatos de **como cada site está construído hoje**, não
regras do padrão. A matriz permite `Lead` em qualquer vertical. O teste de que o desenho está
certo: quando o Tô em Foz ligar um formulário de gastronomia, **zero linhas desta matriz
precisam mudar** — o slot já existe, só estava sem uso.

---

## 4 · Escada de eventos

| Evento | Significa | Otimizável | `value` |
|---|---|---|---|
| `PageView` | carregou uma página | não | — |
| `ViewContent` | viu um produto específico | sim | — |
| `InitiateCheckout` | **abriu o fluxo de conversão** (modal) | sim | — |
| `Lead` | entregou contato | **sim — principal** | ✅ |
| `Contact` | foi para o ponto de contato (WhatsApp/redirect) | sim | — |
| `CTAClick` | clique granular (custom) | evitar | — |
| `Purchase` | **RESERVADO** — ver §6 | — | ✅ real |

**`InitiateCheckout` é o INÍCIO DO FLUXO DE CONVERSÃO — não "a abertura do modal".** Não
processamos pagamento, mas o fluxo simula o checkout integralmente. Na maioria dos casos isso
é a abertura do modal; no WhatsApp direto da agência **não há modal nenhum** e continua sendo
`InitiateCheckout`, porque a pessoa iniciou a compra do transfer do mesmo jeito. O modal é
mecanismo, não significado.

As **saídas** (WhatsApp central, reserva de parceiro, redirect de hotel, ingresso direto) são
`Contact`, porque acontecem **depois** do `Lead`, não antes.

🚫 **`ViewModalVIP` foi DESCARTADO (D10).** Não recriar. Ele disparava no mesmo clique do
`InitiateCheckout`, não é cidadão de primeira classe no painel (evento custom), e era vocabulário
do RGF dentro de um pixel de portfólio (contradiz D9). Nada se perdeu: o que ele distinguia volta
como param (`vertical`, `item_slug`, `cta_type`).
*(O argumento original citava também um slot de AEM — ver §0-bis: o AEM saiu do painel. Os demais
motivos seguem válidos.)*

**Nunca otimizar por `CTAClick` cru nem por `InitiateCheckout` sem filtro de `vertical`** —
ambos são disparados por origens diferentes e misturam produtos.

**`content_name` não discrimina nada no `Lead`** — historicamente vinha hardcoded. Use
`vertical` + `lead_kind`, nunca `content_name`, nas regras de `Lead`.

---

## 5 · `value` — escala única do portfólio

**`value` é definido no centro, varia por `vertical`, e NUNCA por projeto.**

Existe **uma** distribuição de valor dentro do pixel. Se um projeto disser que um lead de
atrativo vale R$150 e outro disser R$40 para a mesma coisa, o Meta não tem como saber que foi
descuido: ele aprende a média errada e passa a lançar errado nos dois.

Fonte em código: `lib/lead-value.ts`, campo `LEAD_VALUE_VERSION` — que deixa de ser interno
de um projeto e passa a ser contrato do portfólio.

| `vertical` | Emite `Lead` hoje | Escala |
|---|---|---|
| `atrativos` | ✅ sim | definida (`LEAD_VALUE_WEIGHTS`, `LEAD_VALUE_VERSION = 2026-07-v1`) |
| `transporte` | via `transfer=true` no lead de atrativos | bônus `+4` pontos, o maior da tabela |
| `hotelaria` | ❌ não | **slot vazio — sem peso aprovado** |
| `gastronomia` | ❌ não | **slot vazio — sem peso aprovado** |

> 🔒 **REGRA DURA: nenhum vertical emite `Lead` antes de ter peso aprovado nesta tabela.**
> Slot documentado vazio é seguro. Número chutado e assado no histórico não é — ele vira
> passado silencioso que ninguém percebe estar errado.

Mudar qualquer peso exige bump do `LEAD_VALUE_VERSION` e aviso a quem roda campanha
(re-baseline consciente). Peso **não** é cleanup.

---

## 6 · `Purchase` — reservado

**`Purchase` é reservado para receita real. É proibido usá-lo com valor estimado.**

`Purchase` carrega expectativa de receita no Meta. Enviá-lo com valor estimado (pontos ×
multiplicador) faz o ROAS do painel virar ficção — o Meta reporta retorno sobre dinheiro que
nunca entrou em conta, e o evento fica queimado para quando houver receita de verdade.

**Gatilho legítimo, quando o ciclo de receita existir:** a confirmação da agência no card do
Telegram (callback `confirm:`). É server-side, verificável, e representa venda real. Vai por
CAPI, com valor real.

---

## 7 · `partner_slug` — atribuição, não segmentação

**Envie o param. Nunca funde público ou Conversão Personalizada nele.**

O parceiro **rotaciona**: hoje o hotel é um, amanhã é outro; a agência é exclusiva hoje e
pode mudar. Um público montado em `partner_slug=<x>` morre no dia da troca. `vertical` e
`niche` sobrevivem a toda rotação.

Por que enviar mesmo assim: é irreversível se omitir, e existe um caso concreto — o dia em
que um parceiro pagar por campanha dele mesmo. Sem o param no histórico, essa venda não
acontece.

A prestação de contas ao parceiro **não** sai do Meta: sai do banco 1st-party (impressão
deduplicada por sessão, reach, CTR por parceiro), que é onde ela já vive.

---

## 8 · Injeção do `property`

`property` é injetado no **funil único** de disparo (`trackConversion` no client, `meta-capi`
no server) — nunca nos ~20 pontos de chamada. Assim todo evento presente **e futuro** sai
com `property`, e é impossível esquecer numa chamada nova.

---

## 9 · Como plugar um projeto novo

1. Copiar `lib/tracking-taxonomy.ts` **verbatim** (mesmo `TAXONOMY_VERSION`).
2. Copiar `pixel-matrix.md` e `pixel-decisions.md` **verbatim**.
3. Adicionar o valor novo de `property` ao enum — **em todos os repositórios plugados**. O enum é
   **aditivo**: o nome do projeto novo se SOMA à lista. Substituir um valor existente pelo nome novo
   apaga o vocabulário dos outros satélites quando o arquivo é copiado verbatim, e o `TAXONOMY_VERSION`
   igual esconde a divergência (D14).
4. Verificar o domínio no Business Manager (Segurança da Marca → Domínios). É o passo que se
   esquece, e sem ele o domínio novo não é reconhecido como seu.
   *(Não há mais priorização de eventos a fazer aqui — o AEM saiu do painel, ver §0-bis.)*
5. Se o projeto novo emitir `Lead` num vertical sem peso, **parar** e aprovar o peso em §5
   antes de subir.

Divergência entre repos se detecta comparando `TAXONOMY_VERSION` — não arquivo a arquivo.

---

## 10 · Conversões Personalizadas (painel do Meta)

São **filtros retroativos**, não coletores. Criar hoje ou em três meses produz o mesmo
resultado sobre os mesmos eventos — o que **não** é retroativo é o parâmetro: evento enviado
sem `property` nunca recupera essa informação.

Por isso a prioridade é sempre o param, nunca o painel.

Recomendação prática: criar as Conversões Personalizadas **algumas semanas antes** da
campanha — não por coleta, mas para já enxergar o volume acumulado do filtro e descobrir se
aquele evento tem massa suficiente para otimizar, antes de gastar dinheiro descobrindo que
não tem.

Limitação a conhecer: uma Conversão Personalizada opera sobre **um** evento. Não existe OR
entre eventos diferentes. Públicos Personalizados, sim, aceitam OR — é por lá que se une
"`Lead` com `transfer=true`" com "quem pediu transporte na tela de sucesso".
