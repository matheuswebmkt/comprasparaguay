// Filepath: app/data/attractions.ts
// Version: 3.0
// Nome da Versão: "Foco Compras Paraguay — catálogo reduzido a 5 atrativos de compras/fronteira"
//
// Catálogo enxuto para o posicionamento Compras Paraguay: apenas os 5 atrativos ligados ao
// eixo de compras e fronteira (Cataratas JL Shopping, compras em Ciudad del Este, By Night
// Puerto Iguazú, Duty Free de Puerto Iguazú e Shopping Catuaí Palladium). Os demais atrativos
// foram removidos nesta rodada (decisão do usuário).

import { Attraction } from "@/app/types";

export const attractions: Attraction[] = [
  {
    slug: "cataratas-jl-shopping",
    name: "Cataratas JL Shopping",
    tagline: "Compras, gastronomia e cinema no coração de Foz.",
    seoTitle: "Cataratas JL Shopping: compras e roteiro completo em Foz",
    seoDescription:
      "Compras, cinema e praça de alimentação no caminho das Cataratas, no shopping mais perto do parque. Roteiro completo em Foz do Iguaçu.",
    updatedAt: "2026-08-08",
    description: [
      "O Cataratas JL Shopping é um dos centros de compras mais usados por quem visita Foz do Iguaçu: lojas, praça de alimentação, cinema e serviços com ar-condicionado. Não é “passeio de natureza”, mas resolve refeição, descanso e compras leves no meio do roteiro.",
      "Funciona como pausa prática no caminho dos atrativos da cidade e como plano B em chuva ou cansaço. Em roteiros longos, uma noite de cinema ou jantar no shopping também aparece com frequência.",
      "Não substitui compras no Paraguai nem o Duty Free argentino — é shopping brasileiro de conveniência e lazer urbano.",
    ],
    highlights: [
      "Lojas e serviços",
      "Praça de alimentação",
      "Cinema",
      "Plano B chuva",
    ],
    city: "Foz do Iguaçu",
    state: "PR",
    country: "BR",
    address:
      "Av. Costa e Silva, 185 - Polo Centro, Foz do Iguaçu - PR, 85863-000",
    officialUrl: "https://www.cataratasjlshopping.com.br/", // verificar
    cover: "/images/atrativos/cataratas-jl-shopping/cover.webp",
    info: [
      { label: "Tempo sugerido", value: "1 a 3 horas" },
      {
        label: "Dica",
        value: "Boa opção de refeição e descanso entre passeios.",
      },
    ],
    faq: [
      {
        q: "Vale incluir shopping no roteiro de Foz?",
        a: "Sim como apoio: comer, comprar o que faltou, ar-condicionado e cinema. Não precisa “gastar um dia” se o foco for natureza.",
      },
      {
        q: "JL Shopping ou Catuaí Palladium?",
        a: "O Catuaí é maior e mais completo em lazer; o JL é prático e bem posicionado. Muitos visitantes usam o que estiver no caminho do hotel.",
      },
      {
        q: "Tem o que comer?",
        a: "Sim — praça de alimentação e opções de restaurante. Útil depois de um dia no parque ou antes de voltar ao hotel.",
      },
      {
        q: "Serve em dia de chuva?",
        a: "Serve bem: compras, cinema e refeição sem depender do sol.",
      },
      {
        q: "É o mesmo que compras no Paraguai?",
        a: "Não. Aqui é shopping no Brasil, com preços e regras locais — outra lógica de “compras de fronteira”.",
      },
    ],
  },
  {
    slug: "shopping-catuai-palladium",
    name: "Shopping Catuaí Palladium",
    tagline: "O maior shopping da região, com lazer, compras e gastronomia.",
    seoTitle: "Shopping Catuaí Palladium: compras e roteiro completo em Foz",
    seoDescription:
      "O maior shopping da região: grandes marcas, cinema e uma praça gastronômica completa. Compras e roteiro completo em Foz do Iguaçu.",
    updatedAt: "2026-08-08",
    description: [
      "O Catuaí Palladium é o maior shopping de Foz do Iguaçu: ampla variedade de lojas, restaurantes, cinema e lazer para a família. Quem quer um programa completo de compras e diversão em um só lugar costuma priorizar este complexo.",
      "Na Avenida das Cataratas, encaixa em meio período ou noite após passeios. Em roteiros de 5–7 dias, aparece como dia (ou meio dia) de “cidade e lazer” entre fronteiras e natureza.",
      "Programe o tempo: o tamanho pede prioridade (lojas, jantar ou cinema). Não confunda com free shop argentino ou Ciudad del Este.",
    ],
    highlights: [
      "Maior shopping da região",
      "Lazer e cinema",
      "Gastronomia variada",
      "Família",
    ],
    city: "Foz do Iguaçu",
    state: "PR",
    country: "BR",
    address: "Av. das Cataratas, 3570 - Bourbon, Foz do Iguaçu - PR, 85853-000",
    officialUrl: "https://www.catuaipalladium.com.br/", // verificar
    cover: "/images/atrativos/shopping-catuai-palladium/cover.webp",
    info: [
      { label: "Tempo sugerido", value: "2 a 5 horas" },
      {
        label: "Dica",
        value: "Programe um período do dia — é grande e tem muita coisa.",
      },
    ],
    faq: [
      {
        q: "O Catuaí Palladium é o maior shopping de Foz?",
        a: "É o mais citado como o maior e mais completo da região em lojas e lazer. Ideal se você quer variedade num só lugar.",
      },
      {
        q: "Quanto tempo reservar?",
        a: "De 2 a 5 horas, conforme compras, refeição e cinema. Dá para “se perder” o dia se for o plano principal.",
      },
      {
        q: "Fica no caminho das Cataratas?",
        a: "Fica na Av. das Cataratas — eixo turístico da cidade. Fácil de combinar com hotel da mesma avenida.",
      },
      {
        q: "Vale ir com crianças?",
        a: "Sim: praça de alimentação, cinema e espaço coberto ajudam em dias de calor ou chuva.",
      },
      {
        q: "Substitui compras no Paraguai?",
        a: "Não no sentido de free shop/fronteira. É shopping brasileiro de lazer e conveniência.",
      },
    ],
  },  {
    slug: "compras-paraguai-ciudad-del-este",
    name: "Compras Paraguai - Ciudad del Este",
    tagline:
      "O polo de eletrônicos e perfumaria do outro lado da Ponte da Amizade — e ele fecha às 16h.",
    seoTitle: "Compras no Paraguai: roteiro completo em Ciudad del Este",
    seoDescription:
      "Eletrônicos, perfumes e grandes marcas em Ciudad del Este, cruzando a Ponte da Amizade. Roteiro completo a partir de Foz do Iguaçu.",
    updatedAt: "2026-08-08",
    description: [
      "A Ponte da Amizade tem pouco mais de 500 metros, e do outro lado dela começa Ciudad del Este — segunda maior cidade do Paraguai e um dos maiores polos de comércio importado da América do Sul. O trecho que interessa ao visitante está concentrado nos primeiros quarteirões depois da ponte: eletrônicos, perfumaria, cosméticos, óculos, relógios, brinquedos e utilidades, entre galerias de rua e endereços consolidados como Shopping China, Mona Lisa, Casa Rica e as lojas da Nissei.",
      "O horário é a informação que muda o dia. O comércio abre cedo, por volta das 7h ou 8h, e começa a fechar entre 15h e 16h. No sábado a maior parte encerra perto do meio-dia, e no domingo quase tudo fica fechado. É o oposto do resto do catálogo: não existe versão de fim de tarde deste passeio, e ele não serve para preencher o tempo que sobrou de outro programa — ele precisa ser a manhã do dia.",
      "O gargalo não é a distância, é a ponte. Nos horários de pico a fila de carros parada sobre o rio Paraná consome mais tempo do que a travessia inteira a pé. Por isso o costume local é deixar o carro em Foz e cruzar a pé, de táxi ou de ônibus — a caminhada leva poucos minutos e devolve o controle do relógio, que é justamente o que decide se você vai conseguir comprar antes de as lojas fecharem.",
      "Como o comércio encerra no meio da tarde, sobra tarde livre — e a resposta mais próxima está a 10 km: os Saltos del Monday, em Presidente Franco, abertos até as 19h. Compras de manhã e cachoeira à tarde fecham um dia paraguaio completo sem cruzar a ponte duas vezes. Para atravessar é preciso documento de identificação original e em bom estado, e na volta ao Brasil valem as regras de cota da Receita Federal.",
    ],
    highlights: [
      "Polo de eletrônicos e perfumaria",
      "Logo após a Ponte da Amizade",
      "Comércio fecha entre 15h e 16h",
      "Saltos del Monday a 10 km",
    ],
    city: "Ciudad del Este",
    state: "Alto Paraná",
    country: "PY",
    address:
      "Ciudad del Este, Alto Paraná, Paraguai — logo após a travessia da Ponte da Amizade",
    officialUrl: "https://www.cde.com.py/",
    cover: "/images/atrativos/compras-paraguai-ciudad-del-este/cover.webp",
    info: [
      {
        label: "Onde fica",
        value:
          "Ciudad del Este, Alto Paraná — primeiros quarteirões depois da Ponte da Amizade",
      },
      {
        label: "Horário",
        value:
          "Comércio das 7h/8h até 15h ou 16h · sábado até o meio-dia · domingo quase tudo fechado",
      },
      {
        label: "Tempo sugerido",
        value: "Uma manhã; dia inteiro só somando os Saltos del Monday",
      },
      {
        label: "Dica",
        value:
          "Deixe o carro em Foz e atravesse a pé ou de táxi — o gargalo é a fila da ponte, não a distância.",
      },
    ],
    featured: true,
    faq: [
      {
        q: "Preciso de passaporte para ir a Ciudad del Este?",
        a: "Brasileiros atravessam com documento de identificação original, RG ou passaporte, em bom estado de conservação. Cópia ou foto no celular não resolve. Como as regras de fronteira mudam, vale conferir a exigência vigente antes de sair de Foz.",
      },
      {
        q: "Que horas o comércio abre e fecha em Ciudad del Este?",
        a: "Abre cedo, por volta das 7h ou 8h, e começa a fechar entre 15h e 16h. É a informação que mais atrapalha quem planeja mal: não existe compra de fim de tarde no Paraguai, então este passeio precisa ser a manhã do dia, e não o resto dele.",
      },
      {
        q: "Vale ir no domingo?",
        a: "Não. No domingo a maior parte do comércio nem abre, e no sábado ele encerra perto do meio-dia. Se o seu único dia livre for domingo, troque por outro programa e deixe as compras para um dia útil.",
      },
      {
        q: "Dá para atravessar a Ponte da Amizade a pé?",
        a: "Dá, e costuma ser mais rápido que de carro. A ponte tem pouco mais de 500 metros e a passarela de pedestres não pega a fila que trava os veículos sobre o rio Paraná. Muita gente deixa o carro em Foz e cruza a pé, de táxi ou de ônibus.",
      },
      {
        q: "Existe limite para trazer as compras de volta ao Brasil?",
        a: "Existe. A Receita Federal aplica uma cota de isenção por pessoa, e a da fronteira terrestre é diferente da de quem chega de avião. O valor é atualizado periodicamente, então confira o vigente antes de atravessar — é o que evita surpresa na volta.",
      },
      {
        q: "Dá para combinar compras e os Saltos del Monday no mesmo dia?",
        a: "Dá, e é o encaixe mais eficiente do lado paraguaio. O comércio fecha entre 15h e 16h, e o parque dos Saltos, a 10 km em Presidente Franco, fica aberto até as 19h. Compras de manhã e cachoeira à tarde resolvem o dia sem atravessar a ponte duas vezes.",
      },
      {
        q: "Compras no Paraguai e Duty Free na Argentina são a mesma coisa?",
        a: "Não. São países, fronteiras e tipos de loja diferentes: em Ciudad del Este você anda por galerias e shoppings de rua, enquanto o Duty Free de Puerto Iguazú é uma loja única junto à aduana. Cada um tem página própria aqui, porque também são dias diferentes do roteiro.",
      },
    ],
  },  {
    slug: "by-night-argentina-puerto-iguazu",
    name: "By Night Puerto Iguazú — Argentina",
    tagline:
      "Duty Free shop, bar de gelo, feirinha e cassino — a noite argentina em quatro paradas.",
    seoTitle: "By Night Argentina: feirinha e roteiro em Puerto Iguazú",
    seoDescription:
      "Parrilla, empanadas e a feirinha de artesanato na noite mais animada de Puerto Iguazú. Roteiro completo a partir de Foz do Iguaçu.",
    updatedAt: "2026-08-08",
    description: [
      "O by night argentino é um circuito de quatro paradas, não um jantar. Começa no Duty Free Shop, na Ruta 12, com cerca de 40 minutos entre bebidas, perfumes, cosméticos e roupas isentos de imposto até a cota. Segue para o bar de gelo de Puerto Iguazú, onde se passa outros 40 minutos a até dez graus negativos, drink na mão.",
      "A terceira parada é a que dura mais e costuma ser a preferida: cerca de uma hora na feirinha da Av. Brasil, ponto de encontro de turista e morador, onde os sotaques se misturam. Ali estão as empanadas, os alfajores, a tábua de frios, as azeitonas recheadas, os queijos e os vinhos — com o pôr do sol dando o tom no começo da noite. O circuito fecha no cassino do City Center, mais 40 minutos, para quem quiser conhecer essa parte da cidade.",
      "Somando as paradas e o deslocamento, o programa ocupa de 4 a 5 horas e toma a noite inteira. Não se soma à Itaipu Iluminada, que acontece do lado brasileiro no mesmo horário — mas o Madero Tango é exceção: o show fica no complexo do Cassino Iguazú, que é a última parada deste circuito, e a sessão das 22h30 permite emendar. O encaixe mais limpo é depois de um dia nas Cataratas argentinas, que fecham às 16h — você já está do lado de lá, com a fronteira resolvida.",
      "A travessia é pela Ponte Tancredo Neves e exige documento de identificação original. Quem quiser trocar o cassino por um jantar encontra parrillas e pizzarias no centro, e há quem acrescente um show de tango à noite. Vale contar o tempo da imigração na volta: à noite o fluxo muda e o retorno a Foz nem sempre é rápido.",
    ],
    highlights: [
      "Free shop sem imposto até a cota",
      "Bar de gelo a −10 °C",
      "Feirinha da Av. Brasil",
      "Cassino do City Center",
    ],
    city: "Puerto Iguazú",
    state: "Misiones",
    country: "AR",
    address:
      "Puerto Iguazú, Misiones, Argentina — circuito entre Ruta 12 e Av. Brasil",
    officialUrl: "https://www.iguassu.com.br/planeje-sua-viagem/puerto-iguazu/", // verificar
    cover: "/images/atrativos/by-night-argentina-puerto-iguazu/cover.webp",
    info: [
      {
        label: "Onde fica",
        value:
          "Puerto Iguazú — Duty Free e cassino na Ruta 12, feirinha na Av. Brasil",
      },
      {
        label: "Quando acontece",
        value: "Programa noturno: as paradas funcionam do fim da tarde à noite",
      },
      {
        label: "Tempo sugerido",
        value: "4 a 5 horas, somando as quatro paradas e o deslocamento",
      },
      {
        label: "Dica",
        value:
          "Toma a noite inteira e termina no mesmo complexo do Madero Tango — dá para emendar na sessão das 22h30.",
      },
    ],
    faq: [
      {
        q: "O que inclui o by night em Puerto Iguazú?",
        a: "Quatro paradas: o Duty Free Shop na Ruta 12 (cerca de 40 minutos), o bar de gelo (outros 40, a até dez graus negativos), a feirinha da Av. Brasil (cerca de uma hora, a parada mais longa) e o cassino do City Center (40 minutos). Com deslocamento, o circuito ocupa de 4 a 5 horas.",
      },
      {
        q: "O bar de gelo daqui é o mesmo de Foz?",
        a: "Não, são dois bares de gelo diferentes em cidades diferentes. Este fica em Puerto Iguazú, na Argentina, e faz parte do circuito noturno; o Dreams Ice Bar fica em Foz, dentro do Dreams Park Show. Quem já foi a um dificilmente sente falta do outro.",
      },
      {
        q: "Quando encaixar o by night no roteiro?",
        a: "Depois de um dia nas Cataratas argentinas, que fecham às 16h — você já está do lado de lá e a fronteira já foi resolvida uma vez. O circuito toma a noite inteira, então não cabe junto com a Itaipu Iluminada, do lado brasileiro. Com o Madero Tango é diferente: o show fica no mesmo complexo do cassino, última parada daqui, e a sessão das 22h30 permite emendar.",
      },
      {
        q: "Que documento preciso para atravessar à noite?",
        a: "Documento de identificação original para cruzar a Ponte Tancredo Neves, como em qualquer travessia para a Argentina. O detalhe noturno é a volta: o fluxo na imigração muda depois do jantar, e o retorno a Foz nem sempre é rápido.",
      },
      {
        q: "O que se encontra na feirinha?",
        a: "Empanadas, alfajores, tábua de frios, azeitonas recheadas, queijos, vinhos e cerveja local, além de artesanato e lembranças. É onde turista e morador se cruzam, e a hora do pôr do sol é a mais movimentada.",
      },
      {
        q: "Dá para trocar o cassino por um jantar?",
        a: "Dá — parrillas e pizzarias do centro de Puerto Iguazú são a alternativa mais comum, e há quem acrescente um show de tango à noite. O cassino é a parada mais dispensável do circuito para quem viaja com crianças.",
      },
      {
        q: "O que se compra no Duty Free?",
        a: "Bebidas, perfumes, cosméticos, roupas e importados em geral, isentos de imposto até o limite da cota. É uma lógica diferente da de Ciudad del Este: menos variedade e menos caos, mais marcas e ambiente de loja.",
      },
    ],
  },
  {
    slug: "duty-free-shop-puerto-iguazu-argentina",
    name: "Compras Duty Free - Puerto Iguazú",
    tagline:
      "A loja franca logo depois da aduana argentina — perfumaria, bebidas e eletrônicos sem imposto.",
    seoTitle: "Duty Free Puerto Iguazú: compras e roteiro a partir de Foz",
    seoDescription:
      "Perfumaria, bebidas, cosméticos e eletrônicos na loja franca da fronteira argentina. Compras e roteiro completo a partir de Foz do Iguaçu.",
    updatedAt: "2026-08-10",
    description: [
      "O free shop fica logo depois do posto aduaneiro argentino, na RN 12, antes mesmo de você entrar em Puerto Iguazú. É uma loja franca de verdade: os produtos não pagam imposto de importação, e é por isso que perfumaria, bebidas destiladas, cosméticos, chocolates e eletrônicos costumam ser o motivo declarado da travessia.",
      "A diferença para Ciudad del Este é de natureza, não de tamanho. Lá você anda por galerias de rua e compara preço entre dezenas de lojas; aqui é um endereço único, climatizado, com marcas definidas e atendimento em português. Quem quer garimpar vai ao Paraguai; quem quer resolver rápido e sem confusão vem para cá.",
      "As compras são em dólar, e cartão funciona normalmente. Na volta ao Brasil valem as regras de cota de isenção da Receita Federal, que são as mesmas de qualquer fronteira terrestre e valem por pessoa — confira o valor vigente antes de atravessar, porque ele é atualizado periodicamente.",
      "Meio período resolve com folga, e é isso que torna o free shop fácil de encaixar: ele fica no caminho de quem vai para as Cataratas argentinas, para o Hito Tres Fronteras ou para La Aripuca, todos na mesma RN 12. Documento de identificação original é obrigatório — você está cruzando uma fronteira internacional, e cópia ou foto no celular não resolve.",
    ],
    highlights: [
      "Loja franca, sem imposto de importação",
      "Logo após a aduana argentina",
      "Endereço único e climatizado",
      "Na RN 12, no caminho das Cataratas AR",
    ],
    city: "Puerto Iguazú",
    state: "Misiones",
    country: "AR",
    address:
      "RN 12, junto ao posto aduaneiro argentino — Puerto Iguazú, Misiones, Argentina",
    officialUrl: "https://www.google.com/search?q=Duty+Free+Shop+Puerto+Iguazu", // verificar
    cover:
      "/images/atrativos/duty-free-shop-puerto-iguazu-argentina/cover.webp",
    info: [
      {
        label: "Onde fica",
        value:
          "RN 12, logo depois da aduana argentina — antes de entrar em Puerto Iguazú",
      },
      {
        label: "Documento",
        value:
          "Identificação original obrigatória: você cruza fronteira para chegar",
      },
      { label: "Tempo sugerido", value: "Meio período" },
      {
        label: "Dica",
        value:
          "Fica no caminho das Cataratas argentinas, do Hito e de La Aripuca — some no mesmo dia em vez de gastar uma travessia só com ele.",
      },
    ],
    faq: [
      {
        q: "O que é o Duty Free de Puerto Iguazú?",
        a: "É a loja franca da fronteira argentina, logo depois do posto aduaneiro na RN 12. Por ser área franca, os produtos não pagam imposto de importação — perfumaria, bebidas destiladas, cosméticos, chocolates e eletrônicos são as categorias que levam a maior parte dos visitantes até lá.",
      },
      {
        q: "Preciso de passaporte para entrar no free shop?",
        a: "Precisa de documento de identificação original — RG em bom estado ou passaporte. Você está cruzando uma fronteira internacional para chegar até a loja, então cópia ou foto no celular não resolve na aduana.",
      },
      {
        q: "Qual a diferença entre o Duty Free e as compras em Ciudad del Este?",
        a: "A natureza da compra, não o tamanho. No Paraguai você percorre galerias de rua e compara entre dezenas de lojas; aqui é um endereço único e climatizado, com marcas definidas e atendimento em português. Quem quer garimpar vai ao Paraguai; quem quer resolver rápido vem para cá.",
      },
      {
        q: "Existe limite para trazer as compras de volta ao Brasil?",
        a: "Existe. A Receita Federal aplica uma cota de isenção por pessoa, e a da fronteira terrestre é diferente da de quem chega de avião. O valor é atualizado periodicamente, então confira o vigente antes de atravessar — é o que evita surpresa na volta.",
      },
      {
        q: "Quanto tempo reservar para o free shop?",
        a: "Meio período resolve com folga. É justamente por isso que ele raramente ocupa um dia sozinho: cabe antes ou depois de outro programa do lado argentino, sem comprometer o resto da agenda.",
      },
      {
        q: "Dá para pagar em real ou tem que ser em dólar?",
        a: "As compras são em dólar, e cartão funciona normalmente. Vale conferir com o seu banco como fica a conversão e o IOF antes de viajar, porque isso muda a conta final mais do que a diferença entre uma loja e outra.",
      },
      {
        q: "Com o que combina no mesmo dia?",
        a: "Com tudo que fica na RN 12: as Cataratas do lado argentino, o Hito Tres Fronteras e La Aripuca estão na mesma estrada. Gastar uma travessia de fronteira só com o free shop é desperdiçar o deslocamento — ele foi feito para somar, não para ocupar o dia.",
      },
    ],
  },
];

export const getAttractionBySlug = (slug: string): Attraction | undefined =>
  attractions.find((a) => a.slug === slug);
