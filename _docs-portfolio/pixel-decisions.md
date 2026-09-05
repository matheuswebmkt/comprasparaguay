// Filepath: \_docs-portfolio/pixel-decisions.md
// Version: 1.1
// Nome da Versão: "+ D13 — nicho de transporte unificado em `transfer`"
// TAXONOMY_VERSION: 2026-08-v1

# DECISÕES DO PIXEL — FUNDAMENTOS E REJEIÇÕES

> ⚠️ **ESTE ARQUIVO NÃO PERTENCE A ESSE REPOSITÓRIO.** Copiado verbatim nos três repositórios.
>
> Companheiro de `pixel-matrix.md`. A matriz diz **o quê**; este arquivo diz **por quê**, e
> principalmente **o que já foi rejeitado**.
>
> **Para que serve na prática:** impedir que uma sessão futura — humana ou de IA — re-proponha
> de boa-fé algo que já foi analisado e descartado. Uma decisão sem o registro do que foi
> rejeitado é uma decisão que será revisitada a cada seis meses.
>
> **Regra:** nenhuma regra nova entra na matriz sem entrada aqui. Nenhuma entrada aqui é
> apagada — decisão revertida ganha uma entrada NOVA marcada `↩️ REVERTE Dn`, com o motivo.

---

## D1 · Um pixel único para os três domínios

**Decisão:** `rodagigantefoz.com.br`, `comprasparaguay.online` e `toemfoz.com.br` alimentam **o
mesmo pixel**.

**Por quê:** é literalmente a mesma pessoa. Quem sobe na roda gigante é quem janta na
churrascaria e quem precisa de transfer — o perfil é "turista em Foz do Iguaçu", e ele
atravessa os três sites. Somando as três propriedades, o pixel sai da fase de aprendizado
~3× mais rápido, e a semente de lookalike fica densa em vez de virar três poças rasas. O
transfer é carro-chefe nos três: pooling é exatamente o que a campanha dele precisa.

**Rejeitado — pixel por vertical** (um para hotel, um para gastronomia, um para transfer):

- Pixels não conversam. O pixel do hotel nunca saberia que a pessoa viu ingresso 5 minutos
  antes — morre o retargeting cruzado, que é o ativo principal do portfólio.
- Cada pixel recomeça do zero e nenhum acumula volume suficiente para sair do aprendizado.
- A mesma pessoa vira 4 pessoas diferentes; o público se fragmenta em fatias que não somam.
- Pixel é unidade de **site**, não de produto. Categoria se resolve com parâmetro.

**Rejeitado — pixel por projeto:** mesmo problema, na dimensão errada. `property` resolve a
separação sem perder o pooling, e ainda permite o corte combinado ("transfer em qualquer
property") que pixel separado tornaria impossível para sempre.

**Única razão que justificaria um segundo pixel no futuro:** um dos projetos virar negócio
separado, vendido ou entregue a um sócio — aí o pixel é o ativo que vai junto. Não é
categoria, não é vertical, não é campanha.

---

## D2 · `Lead` não é `Purchase`

**Decisão:** a conversão principal é `Lead`, com valor estimado. `Purchase` fica reservado.

**Por quê:** `Lead` já suporta otimização por valor exatamente como `Purchase` — não há ganho
mecânico em renomear.

**Rejeitado — usar `Purchase` com valor estimado** (proposto sob o argumento de que "o lead é
o nosso purchase, já que não processamos pagamento"):

- `Purchase` carrega expectativa de receita real. Com valor estimado, o ROAS do painel vira
  ficção: o Meta reporta retorno sobre dinheiro que nunca entrou em conta.
- Queima o evento. Quando houver receita real, ou você polui o mesmo evento com dois
  significados, ou re-baseline tudo.

**O gatilho legítimo já existe e é server-side:** a confirmação da agência no card do Telegram
(callback `confirm:`) representa venda real, é verificável e não depende do browser. É esse o
`Purchase` do futuro, via CAPI, com valor real.

---

## D3 · `value` definido no centro, por vertical, nunca por projeto

**Decisão:** a escala de valor vive numa fonte única do portfólio (`lib/lead-value.ts`,
versionada por `LEAD_VALUE_VERSION`) e varia por `vertical`. Nenhum projeto define escala
própria.

**Por quê:** existe **uma** distribuição de valor dentro do pixel. Se um projeto disser R$150
e outro R$40 para o mesmo produto, o Meta não distingue erro de intenção — aprende a média
errada e lança errado nos dois.

**Rejeitado — inventar pesos agora para `hotelaria` e `gastronomia`** "já que é pra deixar
pronto": esses verticais não emitem `Lead` em nenhum projeto hoje. Um peso chutado hoje vira
histórico silencioso no dia em que alguém ligar o formulário, e número errado assado é mais
difícil de perceber do que número ausente. O slot fica declarado e **vazio**, com a regra dura
de que nenhum vertical emite `Lead` sem peso aprovado.

---

## D4 · Os valores dos enums reusam os slugs que já existem

**Decisão:** nomes de parâmetro em inglês (consistente com `lead_kind`, `item_slug`,
`journey_stage`); **valores** reusam os slugs já mantidos no código
(`gastronomia`, `hotelaria`, `pizzaria`, `churrascaria`, …).

**Rejeitado — vocabulário paralelo em inglês** (`dining`, `lodging`, `transfer`): criaria um
segundo dicionário sobre o que já existe em `partners.ts` e `niches.ts`, exigindo tabela de
tradução em cada ponto de disparo. Tabela de tradução deriva — alguém adiciona um nicho num
lado e esquece do outro, e o evento sai com valor que nenhuma regra casa.

Com os slugs reusados, na maioria dos pontos o valor sai **direto do dado que já está ali**,
sem mapeamento.

**Efeito colateral bom:** a colisão entre o vertical de transfer e o booleano `transfer` do
`Lead` desaparece sozinha, porque o vertical se chama `transporte` (slug que já existe). O
rename do booleano, que chegou a ser considerado, deixou de ser necessário.

**Pegadinha registrada:** `Niche` tem `slug` (URL: `pizzaria-em-foz-do-iguacu`) **e** `key`
(`pizzaria`). O param usa a **`key`** — é ela que casa com `Partner.niches`. Mandar o slug de
URL quebraria o match em silêncio.

---

## D5 · `partner_slug` é atribuição, não segmentação

**Decisão:** enviar o param, mas **nunca** fundar público ou Conversão Personalizada nele.

**Por quê:** o parceiro rotaciona — o hotel de hoje não é o de amanhã, a exclusividade da
agência pode mudar. Público montado em `partner_slug` morre na troca; `vertical` e `niche`
sobrevivem a toda rotação.

**Rejeitado — omitir o param** para manter a cardinalidade baixa: é irreversível. E existe um
caso concreto de receita — o dia em que um parceiro pagar por campanha dele mesmo. Sem
histórico, essa venda não acontece.

A prestação de contas ao parceiro não depende disso: já sai do banco 1st-party, com impressão
deduplicada por sessão, reach e CTR.

**➕ Reforço (jul/2026, ver D11):** parceiro, agência e hotel **não têm rota própria** em
nenhum dos projetos — são cards nas páginas hub, e o clique abre um modal. Isso remove o
plano B: não existe regra de "URL contém `/cantina-la-gregoria`" para recuperar o dado depois.
`partner_slug` deixa de ser camada extra e passa a ser o **único canal** desse dado até o
Meta. A metade "mandar sempre" desta decisão fica mais forte; a metade "nunca fundar público
nele" continua idêntica.

---

## D6 · `InitiateCheckout` na abertura do modal; saídas viram `Contact`

**Decisão:** abrir o modal dispara `InitiateCheckout`. As saídas (WhatsApp central, reserva de
parceiro, redirect de hotel, ingresso direto) disparam `Contact`.

**Por quê:** o funil estava invertido. `InitiateCheckout` disparava nas saídas, ou seja
**depois** do `Lead`. Não processamos pagamento, mas o modal simula o checkout integralmente
— é ali que o fluxo de conversão começa, e é o que o evento significa.

~~`ViewModalVIP` continua disparando como sinal descritivo~~ — **↩️ SUPERSEDIDO POR D10:** ele
foi descartado por completo. E o D10 também corrige o enquadramento desta decisão: o gatilho
não é "a abertura do modal", é **o início do fluxo de conversão**. O WhatsApp direto da agência
não tem modal e mesmo assim é `InitiateCheckout`. O modal é mecanismo, não significado.

**Custo do remapeamento: zero, e só agora.** Nenhuma campanha foi rodada ainda — não existe
otimização treinada para quebrar. Com campanha ativa, a mesma mudança custaria re-baseline.
Esta janela não se repete.

---

## D7 · `content_ids` (array) para combos, experiências e roteiros

**Decisão:** `item_slug` guarda o produto de entrada (valor único); `content_ids` guarda o
array de tudo que o pacote inclui.

**Por quê:** um combo envolve vários atrativos simultâneos e `item_slug` sozinho não expressa
isso. `content_ids` é campo nativo do Meta e aceita array. No Roteiro Foz o produto **é** o
bundle — lá o campo deixa de ser opcional.

**Rejeitado — concatenar** (`item_slug: "cataratas-rodagigante-aves"`): gambiarra que quebra
toda regra de painel e cresce combinatoriamente.

---

## D8 · Omitir, nunca preencher com placeholder

**Decisão:** dimensão desconhecida ou inaplicável é omitida do payload.

**Por quê:** parâmetro ausente não atrapalha regra de Conversão Personalizada. Placeholder
(`""`, `"none"`, `"unknown"`, `"n/a"`) em volume dilui a regra e a faz **parar de casar sem
emitir erro** — o sintoma aparece semanas depois como campanha ruim, não como bug.

**Rejeitado — mandar todos os campos sempre, vazios quando não se aplica**, sob o argumento de
"deixar padronizado para os próximos projetos": a padronização mora na matriz e no enum, não
no payload. O contrato existir não obriga a preencher.

Herdado da regra que já valia para `journey_stage`, agora elevada a princípio do portfólio.

---

## D9 · Este padrão não pertence ao RodaGiganteFoz

**Decisão:** a matriz mora em `_docs-portfolio/`, fora da árvore de documentação de qualquer
projeto, e é copiada verbatim nos três.

**Por quê:** o RodaGiganteFoz é o primeiro satélite plugado no pixel — não é núcleo nem base.
Se a matriz virasse uma seção das conventions dele, os outros dois projetos teriam que copiar
um arquivo "do RGF", e ela ficaria misturada a regras que só valem aqui (definição de CTR,
exclusão de `/comercial`, UTM interna).

**Rejeitado — documentar no `plan.md`:** o plan é efêmero e vai para `plan-archive` ao fim do
esforço. Matriz em arquivo que se arquiva é matriz perdida.

**Consequência operacional obrigatória:** como o protocolo de entrada de sessão de cada projeto
lê apenas a documentação **dele**, cada repo precisa de um **ponteiro duro** das suas
conventions de tracking para cá. Sem isso, uma sessão futura edita o tracking local e diverge
de boa-fé, sem nunca saber que esta matriz existe.

---

## D10 · `ViewModalVIP` descartado — só `InitiateCheckout`

**Decisão:** o evento custom `ViewModalVIP` sai da escada. O início do fluxo de conversão é
`InitiateCheckout`, evento padrão, e nada mais.

**Por quê — o argumento decisivo:** o WhatsApp direto da agência também é início de compra e
**não tem modal nenhum**. Se o mesmo evento semântico acontece com e sem modal, então nomear
o evento pelo modal é descrever o mecanismo em vez do significado. O modal é implementação.

Somam-se três custos concretos:

- ~~**Gasta um slot de AEM.** São 8 eventos priorizados **por domínio** — gastar um num evento
  que dispara no mesmo clique que o `InitiateCheckout` é desperdício direto.~~
  ⛔ **ARGUMENTO CAIU (jul/2026):** o Meta removeu a tela de Mensuração de Eventos Agregados; a
  agregação virou automática e o limite de 8 eventos deixou de existir (ver matriz §0-bis).
  **A decisão NÃO muda** — os dois motivos abaixo bastam e não dependiam do AEM. Registrado em
  vez de apagado justamente para ninguém reabrir o D10 achando que o único motivo evaporou.
- **Evento custom não é cidadão de primeira classe:** não entra em Advantage+ do mesmo jeito
  que um padrão, e não aparece em relatório de funil padrão.
- **É vocabulário do RGF dentro de um pixel de portfólio** — contradiz D9. Os outros dois
  projetos teriam que replicar um evento nomeado a partir de uma tela específica deste site.

**Rejeitado — mantê-lo como "sinal descritivo"** (era a recomendação anterior, revertida
aqui): não há informação a preservar. Tudo que ele distinguia volta como parâmetro no
`InitiateCheckout` (`vertical`, `item_slug`, e um `cta_type` que separa modal de WhatsApp
direto). Manter dois eventos para um clique é custo sem contrapartida.

**Custo do descarte: zero, e só agora** — nenhuma campanha rodou, então não existe otimização
treinada nele. Depois de campanha ativa, remover evento é re-baseline.

---

## D11 · Slug de DADO ≠ slug de ROTA

**Decisão:** o pixel recebe sempre o identificador do **dado**. A URL nunca é a fonte.

**Contexto que torna isso concreto:** parceiro, agência e hotel **não têm página individual**
em nenhum dos projetos. São cards nas páginas hub e o clique abre um modal — decisão de
manutenção do produto, para não criar centenas de páginas e ter que gerenciar 301/308 mais
reindexação no Search Console a cada parceria que começa ou termina.

Isso poderia sugerir que `partner_slug` "não existe". Existe: é `Partner.slug` /
`AgencyProfile.slug` / `HotelProfile.slug`, dado que o sistema **já usa hoje** — `foz-falls`
está gravado em `leads.assigned_partner` em todos os leads, e o slug do parceiro já vai ao
Neon na abertura do modal (`PartnerDetailModal`). Slug é identificador, não endereço.

**A regra que isso gera:** atrativos e experiências **têm** rota, e o `item_slug` coincide com
o segmento dela. É coincidência de roteamento, não o significado do param.

🔒 **Renomear uma rota por SEO NÃO muda o `item_slug`.** Quebrar histórico de pixel para ganhar
palavra-chave é troca ruim. Quando os dois divergirem, quem manda no pixel é o slug de dado.

**Efeito colateral bom da arquitetura sem página individual:** um público montado em URL
morreria no dia do 301, em silêncio. Com o identificador no param, o histórico continua
legível ("isto aconteceu com a Cantina") mesmo depois de o parceiro sair do site.

---

## D12 · `value` mede o benefício do PARCEIRO, não a receita do satélite

**Decisão:** o `value` do `Lead` é **pontuação de qualidade**, e o que ela estima é quanto o
lead vale **para quem recebe o lead** (a agência, o hotel, o restaurante) — não quanto o site
fatura com ele. A escala absoluta é convenção; o que carrega informação é a razão entre os
valores.

**Por que isso precisa estar escrito num arquivo de PORTFÓLIO:** o modelo de receita **muda por
satélite**, e a interpretação de `value` muda junto. Quem for plugar `comprasparaguay`/`toemfoz` no
pixel vai encontrar uma tabela de pesos pronta e presumir que ela representa dinheiro do
projeto. Não representa — e presumir isso leva direto a configurar meta de ROAS em cima de um
número que não é receita.

**O caso concreto que originou a decisão (`rodagigantefoz`, jul/2026):** o site **não ganha
comissão por ingresso**. Cobra da agência um **valor fixo semanal** pelo direito de estar no
grupo de leads e assumir todos eles. A receita é a mesma se a agência vender 10 ou 200
ingressos.

Três consequências que não são óbvias:

- **ROAS é estruturalmente sem sentido aqui.** Não existe receita atribuível a um lead
  específico. Não configurar meta de retorno; a métrica que importa é **custo por lead
  qualificado**.
- **Não existe âncora financeira para o multiplicador** (`LEAD_VALUE_MULTIPLIER_BRL`), e ele
  **não precisa de uma**. A tentativa de ancorar (`comissão × taxa de fechamento`) foi
  **rejeitada**: nenhum dos dois números existe — não há comissão, e não há coluna de venda no
  banco (`claimed_by` registra quem ASSUMIU o lead, nunca se vendeu).
- **A cadeia de valor é indireta:** lead bom → agência satisfeita → agência renova a semana →
  receita do site. Então otimizar para "lead que a agência gosta de receber" É otimizar para a
  própria receita, só que com um elo no meio.

**Rejeitado — usar preço real do ingresso** (ex.: `R$ 69,90 × quantidade`, somando atrativos nas
experiências):

- o satélite **não fatura esse dinheiro** — inflaria o `value` em uma ordem de grandeza acima
  do que está em jogo para ele;
- **`Lead` não é venda.** Preço cheio trata formulário preenchido como compra concretizada, e
  empurra a otimização para volume de formulário;
- **colide com `Purchase`** (D2), que é o evento reservado à receita real — o mesmo dinheiro
  seria contado duas vezes;
- **o dado nem existe:** nenhum preço está no repositório, por decisão de produto (a venda é do
  parceiro, o valor aparece no checkout dele). Criar uma tabela de preços de terceiros seria
  assumir manutenção de um dado que desatualiza sozinho.

🔒 **Não embutir suposição de taxa de fechamento no `value`.** O modelo de pontuação é imune a
ela de propósito: um lead de 6 ingressos com transfer vale mais que um solo mesmo que 100% dos
leads fechem. Se um dia houver medição real de venda, ela entra como `Purchase` (D2) — nunca
re-escalando o `Lead`.

---

## D13 · O nicho de transporte é `transfer` em todos os satélites

**Decisão:** o valor de `Niche` para transporte é **`transfer`**. Substitui
`agencia-de-turismo`, que era o valor original. `TAXONOMY_VERSION`: `2026-07-v1` → `2026-08-v1`.

**O que forçou a decisão:** os satélites nomeavam o mesmo nicho de formas diferentes —
`agencia-de-turismo` num, `transfer` no outro. Como o enum é bloco congelado e a travessia
dado→enum passa por `asNiche()`, o satélite cujo dado não casasse com o enum simplesmente
**omitiria o `niche`** (D8) no vertical inteiro de transporte. Omissão é o comportamento
seguro, e é exatamente por isso que o defeito seria invisível: nenhum erro, nenhum log — só
um vertical que nunca aparece segmentado no painel.

**Por que `transfer` e não `agencia-de-turismo`:** `transfer` nomeia o **produto** (o
deslocamento); `agencia-de-turismo` nomeia **quem entrega** — e "quem entrega" já é o papel do
`partner_slug`. Um `niche` que descreve o fornecedor duplica a dimensão de atribuição e morre
na rotação de parceiro, que é justamente o que D5 diz que `vertical`/`niche` não podem fazer.

**Rejeitado — manter os dois valores no enum** ("o enum pode crescer, §1.2"): cresceria com
**dois valores para um conceito**. O pixel é um só; a segmentação de transporte racharia em
duas fatias que não somam, e nenhuma das duas teria volume para otimizar. O enum cresce para
nicho **novo**, não para sinônimo.

**Rejeitado — deixar o satélite divergente omitir o `niche`:** funciona e é seguro, mas
descarta o sub-tipo do vertical de transporte para sempre. Param não é retroativo.

**Custo aceito, e ele é real:** os eventos já enviados com `niche=agencia-de-turismo`
**permanecem no histórico do pixel** — evento enviado não se apaga. O ganho é para frente. O
custo é baixo agora porque nenhuma campanha rodou e o volume acumulado é de teste; depois de
campanha ativa, esta mesma troca seria re-baseline.

**Consequência operacional obrigatória:** a `key` do nicho é **chave primária** de
`niche_settings` no banco de cada satélite que tenha essa tabela. Renomear o valor sem migrar a
linha faz a "Recomendação Oficial" daquele nicho perder a atribuição do admin e cair no
fallback estático — em silêncio, sem erro visível.

⚠️ **`key` ≠ `slug` (§1.5 / D11), e eles continuam diferentes de propósito.** A URL pública do
nicho segue sendo o que cada satélite decidiu por SEO (`/transporte` num, `/transfer` no
outro). Só a `key` foi unificada, porque só ela vai ao pixel. **Não** unificar slug: isso é
rota, custa 301 e reindexação, e não muda nada no Meta.
