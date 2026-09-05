// Filepath: \_docs-dev-coder/conventions/posicionamento.md
// Parte de conventions.md (índice em ../conventions.md)

# CONVENTIONS · POSICIONAMENTO, VOZ E LÉXICO

> Restrições duras do projeto. NÃO re-propor decisões já travadas aqui.
> Numeração das seções PRESERVADA (§N) — referências cruzadas continuam válidas.

---

## 21. Posicionamento, voz e léxico (regra dura)

> **Por que esta seção existe.** O produto não é o roteiro — é a **decisão**. A pessoa não quer montar um
> roteiro do mesmo jeito que ninguém quer preencher declaração de imposto: ela quer saber se está usando
> bem o tempo e o dinheiro dela em Foz. Roteiro, ingresso, hospedagem e transfer são manifestações disso.
> Esta seção governa **toda copy que o visitante lê** — hero, CTA, wizard, modal, FAQ, e-mail. Se um texto
> novo contradiz o que está aqui, o texto está errado.

### 21.1 Arquitetura de mensagem (4 camadas)

Toda página pública se apoia nestas quatro camadas, e cada uma tem um lugar físico na tela:

| Camada | Conteúdo | Onde vive |
|---|---|---|
| **Categoria** | Planejamento de **roteiro em Foz do Iguaçu** | footer, `/sobre`, JSON-LD |
| **Promessa** | Aproveitar melhor **o seu tempo e o seu dinheiro** na cidade | H1 / subtítulo do hero |
| **Mecanismo** | Você responde · a curadoria recomenda — **nunca** "você monta" | CTAs e o wizard |
| **Prova** | Revisão por um especialista em Foz do Iguaçu — nada é gerado automaticamente | faixa de prova, bullets, badges |

⚠️ **Não somos um catálogo, não somos agência e não somos gerador automático.** A referência estética e de
linguagem é curadoria (Apple/Netflix/Spotify): a pessoa **recebe recomendação**, não escolhe entre 200 opções.

### 21.1-bis ESCOPO: dentro de Foz do Iguaçu (regra dura — violada uma vez, custou uma rodada)

O produto planeja **o roteiro da pessoa DENTRO de Foz do Iguaçu**. Não planeja a viagem dela até Foz.

- ❌ **"planejamento da sua viagem"** · "planeje sua viagem" · "sua viagem" solto. Isso sugere passagem
  aérea, saída da cidade de origem, trajeto até Foz — coisas que o produto **não faz** e que a agência
  parceira não vende.
- ✅ **"seu roteiro em Foz do Iguaçu"** · "seus dias em Foz" · "sua experiência em Foz do Iguaçu".
- **"Foz do Iguaçu" tem de aparecer no H1** de qualquer página de topo de funil. E **"roteiro" tem de
  aparecer no H1 e no CTA principal** — o projeto se chama Compras Paraguay; a promessa começa por roteiro.

**Mas roteiro como SOLUÇÃO, não como produto.** Ninguém acorda querendo um roteiro; a pessoa acorda querendo
**não desperdiçar a viagem**. Roteiro é o nome da dor resolvida (logística, ordem, tempo, dinheiro), não um
item de catálogo. Por isso a promessa vende **tempo e dinheiro bem gastos**, e entrega isso *na forma de*
um roteiro.

### 21.1-ter A HERO É SOBRE O VISITANTE, não sobre nós

No hero, a pessoa precisa se ver — o problema dela, o ganho dela. Quem somos é consequência.

- ❌ No hero: **"curadoria"** (curadoria de quê? pra quê? não resolve dor nenhuma), **"especialista"**,
  "consultoria", "nossa seleção", "nosso time". Ninguém chegou no site procurando um especialista.
- ✅ No hero: o que a pessoa **descobre, organiza, economiza ou evita**.
- **A prova humana (§21.3) entra da SEGUNDA DOBRA em diante** e no ponto de fricção (antes do formulário),
  onde ela responde a objeção "isso aqui é sério?". Ali ela é decisiva. No hero, ela rouba o lugar da dor.

> Isto **não** enfraquece §21.3 — muda só o *lugar*. O reforço humano continua obrigatório no site.

### 21.2 REGRA DE OURO DO FUNIL (a mais importante desta seção)

O modelo de negócio (ver `produto.md` §0) é interceptar intenção qualificada e entregar o lead à agência
parceira, que faz o orçamento e o atendimento **pelo WhatsApp, depois do submit**. Nada é entregue na tela.

> **A copy pré-submit promete o RESULTADO. Nunca o CANAL, nunca o INSTANTE.**

- ✅ "Receber meu planejamento completo" · "Descubra o que realmente vale a pena nos seus dias em Foz"
- ❌ "Veja seu orçamento na tela" · "Resultado imediato" · "Automático" · "Na hora"
- ❌ Também proibido **antecipar o canal**: nada de "receba no WhatsApp" antes do submit.

**Ambiguidade elegante, não afirmação falsa.** A promessa do resultado é verdadeira (a pessoa recebe mesmo o
planejamento); o que fica em aberto é quando e por onde. Afirmar explicitamente "na tela agora" seria falso
E pior comercialmente: cria um momento de decepção exatamente no ponto em que a agência precisa da confiança
intacta pra fechar.

**Corolário — a entrega humana é argumento de venda, não defeito a esconder.** Qualquer site cospe um roteiro
gerado em 3 segundos, e todo mundo já sabe que aquilo é genérico. O que virou escasso é **uma pessoa que
conhece a cidade olhar as suas respostas**. Por isso "nada aqui é automático" é copy de topo, não rodapé.

⚠️ A camada de transparência obrigatória continua onde a lei manda: microcopy de LGPD e disclaimer do footer
(§18) — que **devem** nomear o compartilhamento com a agência parceira. Marketing é implícito; LGPD é explícito.

### 21.3 Reforço humano — obrigatório, e como se diz

O reforço humano **fica e cresce**: é ele que sustenta a confiança e o valor percebido. O que muda é a forma.
A regra é **ancorar sempre no lugar e na pessoa**, nunca no cargo genérico.

| ✅ Usar | ❌ Evitar |
|---|---|
| "especialista **em Foz do Iguaçu**" | "especialista" solto · "consultor" · "atendente" |
| "um especialista **que vive em Foz do Iguaçu**" | "quem vive em Foz" **como sujeito** · "nossa equipe de atendimento" |
| "revisão humana" · "nada é automático" | "consultoria" · "assessoria" |
| "nosso curador" | "vendedor" · "agente de viagens" |

⚠️ **O sujeito da revisão é sempre o ESPECIALISTA, nunca o morador (regra dura).** "Quem vive em Foz
revisa", "validado por quem vive em Foz" e afins dão a entender que um morador qualquer olha o
roteiro — e é justamente a competência em turismo que a frase existe para afirmar. A âncora de
lugar continua obrigatória, mas ela **qualifica** o especialista, não o substitui:
✅ "um especialista que vive em Foz do Iguaçu" · "um especialista em Foz" ·
❌ "quem vive em Foz revisa" · "revisado por quem vive em Foz".

Frase-referência (matriz da promessa, adaptável por superfície):

> **Nada aqui é automático.** Um especialista em Foz do Iguaçu revisa suas respostas e monta o roteiro
> completo dos seus dias na cidade.

⚠️ A frase **termina aí**. Não acrescentar fecho de gratuidade ("por nossa conta", "sem custos") — §21.4
proíbe, e era exatamente daqui que a construção se espalhava para o site inteiro. E o objeto é **os dias na
cidade**, nunca "a sua viagem" (§21.1-bis).

### 21.4 O site NÃO afirma gratuidade (regra dura)

Nenhuma copy pública diz que algo é grátis — **e também não diz que é "por nossa conta"**. As duas formas
caem na mesma armadilha, e a segunda é pior porque parece resolvida.

**O problema não é a palavra, é o objeto da frase.** O que não é cobrado é o trabalho de planejar e organizar
o roteiro. Ingressos, transfers, hospedagem e tudo que a pessoa reservar continuam pagos por ela. Um fecho
como "tudo por nossa conta" logo depois de um parágrafo que acabou de falar em "roteiro completo" convida à
leitura de que o roteiro inteiro é cortesia — e a decepção cai exatamente no ponto em que a agência precisa
da confiança intacta para fechar (mesmo raciocínio de §21.2).

- ❌ "gratuito" · "grátis" · "sem custo" · "sem custos" · "de graça" · "sem compromisso" · "consultoria gratuita"
- ❌ **"por nossa conta"** · "tudo por nossa conta" · "cortesia da curadoria" · "faz parte do nosso trabalho"
- ✅ Nomear o que a pessoa recebe, sem tocar em dinheiro: "um especialista revisa a logística" · "a ordem e os
  horários vêm na versão final". Preço, valor e "a partir de R$" seguem banidos por §21.5.

⚠️ **"Por nossa conta" carrega dinheiro mesmo quando quem escreveu quis dizer "a gente resolve isso".** É por
isso que a expressão sai também dos trechos em que o sentido era responsabilidade, não preço. Ao reescrever um
desses, trocar por uma construção de responsabilidade — "fica com a gente" · "quem resolve é um especialista em
Foz" — e não apagar a cláusula, que costuma quebrar a frase.

ⓘ Se algum dia a gratuidade precisar ser dita, ela só pode aparecer **nomeando o objeto** ("o planejamento do
seu roteiro é por nossa conta") e nunca como fecho solto de um parágrafo sobre o roteiro completo. Hoje ela não
é dita em superfície nenhuma.

### 21.5 Léxico

**Usar:** recomendado para você · nossa seleção · curadoria · curadoria local · planejamento · seu
planejamento · a melhor combinação · o que realmente vale a pena · aproveitar melhor seu tempo · antes de
reservar · revisado por quem conhece Foz · nada automático.

**Banir na voz pública:** pacote · receptivo · formulário · solicitação / solicitar (com exceção
escopada, abaixo) · cotação · consultoria ·
especialista sem âncora de lugar · "monte seu roteiro" **como promessa** (ok apenas como descrição de
mecânica interna) · qualquer preço, valor ou "a partir de R$" · **"perfil" / "perfis"** (ver abaixo).

⚠️ **EXCEÇÃO ESCOPADA — "monte o seu" desapareceu junto com `/roteiros`.** A regra "montar como
promessa é banido; como descrição de mecânica é permitido" continua valendo — a exceção da
description de `/roteiros` não se aplica mais (rota removida).

⚠️ **EXCEÇÃO ESCOPADA — "solicitação" para o que o visitante ENVIA.** Decisão explícita do usuário:
"pedido" remete a compra fechada e, no vocabulário do próprio site, é o que se faz num restaurante
(`app/data/partners.ts`, `lib/i18n/partner-detail.ts` — ali "pedido" está CERTO e não se troca). A
exceção vale para os textos que descrevem o que a pessoa mandou, e só para eles:
`duplicateNoticeTitle` (produto único × 3 idiomas, `lib/offer-defaults.ts`) · o parágrafo de
`/sobre` sobre a continuidade do atendimento (`lib/i18n/paginas.ts`) ·
**o `successTitle` do bucket de produto** (`lib/offer-defaults.ts`: atrativo) e
**`reservaSuccessTitle`** (`lib/i18n/modal.ts`) — o título da tela de sucesso nomeia
exatamente o que a pessoa acabou de enviar, que é o caso de uso desta exceção. Os dois andam
juntos: um em "Pedido" e outro em "Solicitação" é a mesma tela falando duas línguas ·
os dois comentários equivalentes
(`TicketOfferModal.tsx`).
⛔ **"solicitar/pedir ORÇAMENTO" continua banido** — ali o problema nunca foi o verbo, é a cotação
(ver a regra dos dois sentidos de "orçamento", abaixo), e `copy-lexicon.mjs` segue pegando a
combinação inteira.
⚠️ **Fora dessa lista o termo continua banido:** em hero, CTA ou microcopy de formulário ("envie sua
solicitação") ele volta a soar processo de agência, que é exatamente o que esta seção existe para
evitar. O checker NÃO alcança nada disso — o regex só casa com a combinação de orçamento —, então
quem varrer o léxico à mão precisa saber que a exceção é deliberada e onde ela termina.

⚠️ **"Perfil" é jargão interno — não é palavra de visitante.** `profileLabel` no dado e
"perfil" em documentação seguem valendo; o que não pode é a palavra aparecer na **prosa que o
visitante lê**. Ninguém chega ao site pensando "qual é o meu perfil de roteiro" — a pessoa pensa em
ritmo, em quanto quer andar, no que quer ver. Os **rótulos** ("Clássico", "Aventura & Natureza",
"Compras & Gastronomia") continuam na tela; a palavra que os agrupa, não.
Trocas: **ritmo** · **versão** · **exemplo** · reescrever a frase sem o agrupador.

⚠️ **Bloco de amostra não é bloco de escolha.** Quando uma seção mostra 2–3 itens de um
acervo maior, eles estão ali para **demonstrar que o acervo existe**, não para serem escolhidos. A copy
não pode pressupor decisão ("nenhum destes é o seu ritmo?", "escolha o seu"), porque isso implica que
os itens exibidos seriam as melhores opções — e o visitante ainda não tem base para decidir.
✅ Nomear o que são e convidar a ver tudo: "Estes são apenas três exemplos. São N roteiros prontos no
total — vale ver todos antes de decidir por onde começar."
⚠️ E **não enumerar as alternativas** ao convidar: listar duas ou três faz o conjunto parecer fechado,
que é o contrário da função do convite. Quantidade (derivada do dado, nunca escrita na mão) em vez de
lista.

⚠️ **"Orçamento" tem dois sentidos — só um é banido.**
- ❌ **Orçamento = cotação nossa** ("peça seu orçamento", "ver orçamento", "orçamento com a agência"). É
  vocabulário de agência e é o que o reposicionamento existe pra matar.
- ✅ **Orçamento = o dinheiro do visitante** ("aproveitar melhor o seu tempo e o seu orçamento", "o que cabe
  no seu orçamento"). Isso é a **dor** dele, e é uma das promessas mais fortes que temos.

⚠️ **Exceção obrigatória:** a palavra **"agência parceira" continua** na microcopy de LGPD, no `contactDesc`
onde a lei exige e no disclaimer do footer (§18). Ali não é copy de marketing — é dever legal, e retirar
seria violação de §18.

### 21.6 SEO × posicionamento (§19 continua dura)

Posicionamento **não pode** custar a intenção de busca. A copy se divide por função, na mesma tela:

- **H1** junta intenção de busca e promessa numa frase só, sem virar SEO genérico.
- **Subtítulo e CTA** desenvolvem o ganho concreto (tempo, dinheiro, o que evitar).
- **CTA nunca descreve a ação, descreve o resultado** — e carrega "roteiro" (§21.1-bis).
  "Começar a montar" ❌ → "Começar meu roteiro" ✅. "Começar meu planejamento" ❌ (genérico demais: não diz
  roteiro nem Foz).

⚠️ **MAPA DE TERMOS POR PÁGINA — não canibalizar o próprio pilar (regra dura).** Cada intenção pertence a
UMA página. Home e pilar editorial disputando o mesmo termo é ruim de SEO **e** de posicionamento
(a home fica genérica, igual a qualquer site da cidade):

| Página | Intenção que ela é dona |
|---|---|
| `/` (home) | **roteiro de compras em Ciudad del Este** / planejar o dia de compras |
| `/o-que-fazer` | **o que fazer em Foz e na Tríplice Fronteira** (pilar editorial) |
| `/atrativos` + `/atrativos/[slug]` | compras e shoppings (Ciudad del Este, duty free, Cataratas JL, Catuaí) |
| `/transfer` | transfer na fronteira |
| `/triplice-fronteira` | BR-AR-PY |

⚠️ **Os slugs são as formas curtas** (`/o-que-fazer`, `/atrativos`, `/transfer`,
`/triplice-fronteira`) — **não** `/o-que-fazer-em-foz-do-iguacu` nem `/onde-comer-em-foz`, que não
existem como rotas. Conferir `app/` antes de escrever qualquer link novo (context.md §2.4: o código é
a verdade máxima) — essas formas longas já vazaram para outros documentos e para copy gerada por
engano mais de uma vez.

O Google lê intenção, o humano lê promessa, sem que uma coisa atrapalhe a outra.

### 21.7 Preço: proibição total em superfície pública

**Não sabemos e não precisamos saber o preço de nada** — nem ingresso, nem transfer, nem roteiro. Quem
orça é a agência parceira, depois do submit, pelo WhatsApp.

- ❌ Nenhum valor, faixa, "a partir de", estimativa ou simulador de orçamento em qualquer página pública.
- ❌ Não construir estimador de custo. Preço de ingresso/câmbio varia diariamente; cuspir número na tela é
  pior produto **e** pior conversão do que um especialista olhando o caso.
- `Roteiro.preco_base` está em remoção (ver `produto.md` §0). Enquanto existir no tipo, **não renderizar**.
- `Partner.priceRange` (`$`/`$$`/`$$$`) é faixa qualitativa de restaurante, **não** preço de produto — segue
  permitido.

### 21.8 i18n — passada de tradução concluída; pt é a matriz de CONTEÚDO

O site é trilíngue (`lib/i18n/*.ts`, `Record<Locale, X>`): o chrome de UI e o conteúdo editorial
visível estão traduzidos em pt/en/es, e **nenhuma copy nova fica hardcoded em PT em componente** —
componente que mostra texto ao visitante consome o dicionário com `useLocale`. Regras atuais:

1. **`app/data/*.ts` é a matriz PT de CONTEÚDO** (dados de negócio: nomes, endereços, catálogos,
   copy de marketing do próprio parceiro). O que o visitante lê e vem do dado ganha versão por
   locale em dicionário por slug (padrão `ATTRACTION_NAMES`, `niche-labels.ts`).
2. **`metadata` e JSON-LD ficam em PT canônico** em todas as páginas — é o que o Google indexa.
   Sem rota por locale, o Google só vê a versão pt; metadata localizado por cookie fragmentaria o
   sinal (Googlebot rastreia de IP dos EUA e a geo-detecção prioriza país). **O crawler também tem
   que ver o CONTEÚDO visível em pt:** o middleware não semeia o cookie `locale` para bots e o
   `LocaleProvider` resolve o idioma só por cookie (sem fallback de `navigator.language`), caindo
   em pt — sem isso o Googlebot executava o JS, renderizava o DOM em inglês e o snippet saía em EN
   sob título PT. Rotas por locale + hreflang são decisão futura separada.
3. **Chave NOVA de dicionário:** precisa existir nos 3 locales, traduzida de verdade — nunca PT
   copiado literal (só o `pt` pode espelhar o dado; en/es são tradução real).
4. **Copy nova em componente:** vai direto para o dicionário nos 3 idiomas — nunca PT hardcoded
   em JSX.
4-bis. **A copy do modal de lead mora em `lib/offer-defaults.ts`**, nos 3 idiomas, e desde ago/2026
   **não é mais editável no admin** — ver `conventions/funil-modal.md` §2-bis. Estar em `lib/` não a
   torna texto "de sistema": é copy de visitante e §21 vale inteira, inclusive §21.5 (nada de nomear
   a agência nem de "fale com a agência" — a relação é com o Compras Paraguay).
5. A reintrodução do tracking novo continua etapa própria de fim de ciclo (a implementação de
   Pixel atual é herdada e será substituída por estrutura nova; **não** investir nela).
6. **Uma string PT tem UMA tradução por idioma — e o verbo do CTA é travado.** Duas chaves com o
   mesmo texto em pt precisam do mesmo texto em en e es; duas chaves com texto pt DIFERENTE não
   podem colapsar na mesma frase traduzida. Sem isso o funil que o pt distingue vira ambíguo fora
   dele. O modo de falha concreto: "Fazer meu roteiro" traduzido como `Get my itinerary` no hero e
   `Start my itinerary` na navbar — a segunda idêntica ao "Começar meu roteiro" do wizard, que é
   outro momento do funil.

   | pt | en | es |
   |---|---|---|
   | fazer | make | hacer |
   | começar | start | empezar |
   | receber | receive | recibir |
   | finalizar | finish | finalizar |
   | ver | view | ver |

   Vale para todo CTA que carrega "roteiro" (§21.6): o substantivo é sempre `itinerary`/`itinerario`,
   e é o VERBO que separa os momentos do funil — entrada (`Fazer meu roteiro` → `Make my itinerary` /
   `Hacer mi itinerario`), início do wizard (`Começar meu roteiro` → `Start my itinerary` /
   `Empezar mi itinerario`) e submit (`Receber meu roteiro completo` → `Receive my complete itinerary` /
   `Recibir mi itinerario completo`). O `pnpm check:copy` não pega nada disto (§21.9): é léxico por
   idioma, não termo banido.

### 21.9 O checker executável foi REMOVIDO — a revisão de léxico é manual

⚠️ **`pnpm check:copy` não existe mais** (scripts `check-copy.mjs`/`copy-lexicon.mjs` foram apagados na
simplificação Compras PY). O conteúdo que segue é o que o guard cobria e continua valendo como **lista de
verificação manual**:

`app/`, `components/` e `lib/` (exceto `/comercial`, `/admin`, `/api`, `components/admin` — não são voz
pública) não podem conter o léxico banido em §21.5.
⚠️ **§21.4 não é verificável.** As proibições de gratuidade ("por nossa conta", "sem custos") dependem
inteiramente de revisão humana. Quem varrer à mão, grepar por `nossa conta` · `nuestra cuenta` · `on us` · `sem custos` · `sin costos`.

⚠️⚠️ **E a mensagem de ajuda do próprio checker contradiz §21.4 — ignorar a sugestão dela.** Ao barrar a
palavra direta, o texto que ele devolve manda trocar por "Sem custos pra você, tudo por nossa conta.", que é
justamente a construção banida. O conserto certo é **remover a afirmação**, nunca substituí-la. A mensagem
fica como está por decisão explícita do usuário; quem for corrigi-la um dia, é `scripts/copy-lexicon.mjs:54`
— o `re` da linha 53 está certo e não se mexe.

Ele não distingue contexto — só regex por linha —, então dois casos precisam de exceção deliberada:

- **Arrays `keywords`/`seoTitle`/`seoDescription`.** Um termo banido dentro de um array de keywords ou de
  meta description carrega intenção de busca real (§21.6 — SEO não pode ser sacrificado pelo posicionamento).
  Ex.: `"receptivo foz do iguaçu"` em `keywords: [...]`. Marcar com `// copy-ok` na mesma linha.
- **FAQ definicional de um termo de busca.** Quando a pergunta É "o que é X" e X é o próprio termo banido
  (ex.: "O que é um receptivo em Foz do Iguaçu?" em `app/data/niches.ts`), a resposta precisa nomear o termo
  pra responder à pergunta que a busca faz. Também leva `// copy-ok`. Isso é raro — a maioria dos textos
  substitui o termo por um sinônimo (ver tabela abaixo) em vez de ganhar a exceção.
- **Terceiro que não somos nós.** "Pacote" descrevendo o que um operador terceiro (parque, resort, show)
  vende por conta própria (ex.: "confirme pacotes no site oficial [do parque]") **não é exceção** — mesmo
  descrevendo produto alheio, o termo lido pelo visitante ainda soa a agência. Trocar por "opções",
  "modalidades" ou reescrever a frase.

**Tabela de substituição** (referência rápida, não é lista fechada):

| Banido | Troca típica |
|---|---|
| pacote(s) | opções · combo · plano · o que está incluído |
| receptivo(s) visível | agência local · operadora local |
| a/da/na/sua viagem | seus dias em Foz · seu roteiro · o passeio · a estadia |
| peça/pedir orçamento · orçamento com a agência | receba as condições · confira as condições · envie o pedido |
| gratuita · de graça · sem custo · gratuitamente · gratis (es) | **não há troca — remover a afirmação** (§21.4: "por nossa conta" também é banido) |
| montar seu roteiro (como promessa) | começar seu roteiro · receber seu roteiro |

⚠️⚠️ **O `check:copy` verde NÃO prova que §21 foi cumprido.** O léxico executável cobre um
subconjunto do que está escrito nesta seção, e termo fora dele volta sem ninguém perceber — já
aconteceu com o agrupador de categoria de roteiro (§21.5), com conjugações de "pedir orçamento" além
de "peça/pedir", com "orçamento … com a agência" quando há palavras no meio, e com a agência do verbo
"montar" quando a frase não usa literalmente "seu roteiro". Nenhuma dessas é um erro pontual — é o
regex sendo mais estreito que a regra escrita.

⚠️⚠️ **LACUNA REINCIDENTE: "agência parceira" + canal em copy visível.** Nem `agência parceira` nem
`WhatsApp` estão no léxico executável, então esta violação **nunca acende o checker** — e já foi
encontrada e removida **quatro vezes**, sempre no mesmo formato: uma frase que promete o que vai
acontecer depois do clique, nomeando quem atende e por onde.

| Onde | O que dizia | Quando |
|---|---|---|
| `lib/i18n/shared.ts` — `roteirosCta` | "…e receba as condições da agência parceira." | antes |
| `app/atrativos/page.tsx` — `description` (SERP) | "compre ingresso com a agência…" | antes |
| `lib/i18n/attraction-detail.ts` — `ctaHint` (sidebar do atrativo) | "Condições com a agência parceira no WhatsApp — ingressos e transfers sem sair do Compras Paraguay." | 08/08/2026 |
| `app/atrativos/page.tsx` — FAQ, **também no JSON-LD** | "…a agência parceira te chama no WhatsApp com valores, disponibilidade e transfers…" | 08/08/2026 |

A última era a pior: estava no `faqSchema` do hub, ou seja, **entregue ao Google**, e ainda somava
§21.7 ("valores"). Não é coincidência de redação — é uma tentação estrutural: sempre que existe um
espaço de microcopy embaixo de um CTA, alguém quer preenchê-lo explicando o que vem depois.

**A regra:** o que acontece após o clique é assunto **do modal**, não da página. Antes do submit,
copy visível não nomeia a agência nem o canal, e não promete valor. O diferencial que pode ficar é
"sem te mandar para sites externos" — ele não nomeia ninguém.

✅ **Onde `agência parceira` continua permitido** (e por isso não vira regex): disclaimer do footer,
microcopy de LGPD e `lib/i18n/paginas.ts` (aviso legal) — a lei exige nomear. Também em
`roteiroResumo`, que é payload interno do lead e nunca é renderizado.

Como não há checker para isto, a verificação é **leitura**: ao mexer em qualquer microcopy próxima
de um CTA, `grep -i "ag[êe]ncia parceira\|whatsapp"` no arquivo e conferir se o hit é visível.

**A regra de "montar" é sobre AGÊNCIA, não sobre possessivo.** Se o sujeito é o visitante, está
errado — em qualquer ordem de palavras: sujeito explícito ("você monta um roteiro"), ordem invertida
("o roteiro que você montar"), imperativo ("Monte o roteiro") ou infinitivo com possessivo do
visitante ("montar o próprio roteiro"). Por isso `copy-lexicon.mjs` tem mais de um regex para "montar"
— cada um cobre uma dessas ordens.

⚠️⚠️ **NÃO alargar a regra de "montar" para o infinitivo NEUTRO** ("montar o roteiro", "para montar
roteiro", "Montar roteiro" como rótulo de rota). Ali o sujeito é implícito e quase sempre somos nós ou
a agência ("nos ajuda a montar o roteiro ideal", "para montar o roteiro das Cataratas") — regex largo
demais aqui pega uso **legítimo** na maioria dos casos, e regra que barra uso correto termina coberta
de `copy-ok` até parar de significar qualquer coisa.

✅ **Continua permitido:** particípio com agência nossa ("o roteiro **é montado** sob medida para
você") e a agência como sujeito ("a agência parceira **monta** a logística"). A rota
`/montar-roteiro` foi removida (não existe mais rota com a palavra).

ⓘ **Linha que é só comentário NÃO é varrida** — `isSkippable` em `copy-lexicon.mjs` pula qualquer
linha cujo texto comece por `//`, `*`, `/*` ou `{/*`, além de qualquer linha marcada `copy-ok`.
Documentar a regra num bloco de comentário, nomeando o termo por extenso, é seguro.
⚠️ **Mas comentário no FIM de uma linha de código é varrido**, porque a linha começa pelo código e
não pelo marcador de comentário. Termo banido ali bloqueia o arquivo — use `copy-ok` na linha ou
reescreva o comentário.

ⓘ **Lacunas conhecidas, ainda sem regex:** "formulário" está banido em §21.5 mas sem regra executável.
E §21.2 (antecipar o CANAL — "te chama no WhatsApp" antes do submit) também não tem regra nenhuma.
Candidatos naturais para a próxima varredura.

ⓘ **A regra de "perfil" cobre só o uso com determinante** (`o seu perfil`, `o perfil é…`), não a
palavra solta. É deliberado, e a história explica por quê: a versão original (`perfis?`) casava o
plural mas **não o singular** — o `\b` falhava antes do "l" —, então ficou inerte no caso comum e
deixou passar "para o seu perfil" na description da home e do wizard. Corrigir para casar a palavra
inteira acusou **42 linhas, quase todas legítimas**: nome de variável, campo de tipo, rótulo de card
do Telegram e até "perfil frisante" descrevendo um chope. O determinante é o que separa prosa de
visitante de identificador de código. Isto é o caso-escola do aviso acima sobre não alargar regra:
a versão larga barra uso correto e vira `copy-ok` em toda parte.

⚠️ **Overrides salvos no admin não seguem o default automaticamente.** `lib/offer-defaults.ts` é só a
semente; `lib/offer-settings.ts` lê `valor salvo em app_settings ?? default`. Corrigir o léxico no código
conserta instalações novas e o fallback sem DB — **não** apaga um valor já salvo pelo admin. Limpar o que já
está salvo é tarefa pré-deploy: reabrir o editor do modal no admin e re-salvar os campos, ou rodar um
script que apaga as chaves de texto do `app_settings` e deixa o default assumir de novo.
