// Filepath: lib/i18n/roteiros.ts
// Version: 1.0
// Nome da Versão: "Dicionário i18n do hub /roteiros, cards e bloco de lead (pt/en/es)"
//
// Cobre a parte VISÍVEL (client) do hub /roteiros, do RoteiroCard, do RoteiroDiasDemo e do
// RoteiroLeadBlock. Dados de roteiro/atrativos (app/data/*.ts) continuam em pt (matriz);
// os rótulos de turno e dia são chrome e vivem aqui. O JSON-LD e `metadata` continuam em pt
// no page.tsx (SEO canônico).

import type { Locale } from "./config";

export interface RoteirosUI {
  /** RoteiroCard — linha de turnos + CTA. */
  card: {
    /**
     * Conjunção da lista de turnos do card ("manhã e tarde" / "morning and afternoon").
     * ⚠️ Substituiu um `diaNoite` FIXO ("Manhã, tarde e noite"): o card anunciava três turnos
     * mesmo em roteiro que só usa dois. A lista agora vem de `turnosDoRoteiro()`, do dado.
     */
    conector: string;
    cta: string;
  };
  /** RoteiroDiasDemo — rótulos dos chips de dia e badges de turno. */
  diasDemo: {
    rotulos: string[];
    turnos: { manha: string; tarde: string; noite: string };
  };
  /** RoteiroLeadBlock — bloco de conversão da página individual. */
  leadBlock: {
    eyebrow: string;
    title: string;
    subtitle: string;
    /** CTA do bloco de conversão. ⚠️ NÃO reusar `card.cta` ("Ver roteiro"): lá o botão NAVEGA
     *  para a página; aqui ele ABRE o modal de pedido. Rótulos diferentes para ações diferentes. */
    cta: string;
    altText: string;
    altLink: string;
  };
  /** Hub /roteiros. */
  hub: {
    heroH1Before: string;
    heroH1Strong: string;
    heroH1After: string;
    heroSubtitle: string;
    heroCta: string;
    plansEyebrow: string;
    navAria: string;
    dayLabel: (d: number) => string;
    maisDias: {
      eyebrow: string;
      title: string;
      /** Trecho(s) do título destacado(s) em Verde Selva (TituloComDestaque). */
      titleDestaque: string | string[];
      subtitle: string;
    };
    faq: {
      eyebrow: string;
      title: string;
      items: { q: string; a: string }[];
    };
    closing: {
      title: string;
      subtitle: string;
    };
  };
  /**
   * Editor de dias avulsos (`components/roteiros/RoteiroPorDias.tsx` + `DiaTurnos.tsx`).
   *
   * ⚠️⚠️ O QUE **NÃO** ENTRA AQUI: o texto que vai no LEAD. `roteiroTitulo` e o `resumoDaSelecao`
   * continuam em PT em qualquer locale, de propósito — quem lê é a agência parceira, no Brasil.
   * Traduzir o lead entregaria ao especialista um roteiro em espanhol para atender em português.
   * Mesma lógica de `metadata`/JSON-LD ficarem PT canônico (§21.8-2).
   */
  porDias: {
    eyebrow: string;
    title: string;
    titleDestaque: string | string[];
    subtitle: string;
    /** Cartão de reforço (`CardReforco`) exibido antes do editor. */
    reforcoTitulo: string;
    reforcoDestaque: string | string[];
    reforcoCorpo: string;
    /** "Dia 1" / "Day 1" / "Día 1". */
    dia: (n: number) => string;
    selecionar: string;
    trocar: string;
    remover: (titulo: string) => string;
    modalAria: (n: number) => string;
    modalSub: string;
    fechar: string;
    escolher: string;
    escolhido: string;
    cta: string;
    /** Ação MANUAL de esvaziar a cesta — nunca automática. Ver o ⚠️ em `RoteiroPorDias`. */
    recomecar: string;
    /**
     * Confirmação do "Recomeçar" — mesmo contrato do `MontarRoteiroWizard`
     * (`restartConfirm*` em `lib/i18n/montar-roteiro.ts`). ⚠️ Só a DESCRIÇÃO muda entre os dois:
     * lá apaga preferências e atrativos avulsos, aqui apaga dias escolhidos e encaixes ligados.
     */
    recomecarTitulo: string;
    recomecarDesc: string;
    recomecarSim: string;
    recomecarNao: string;
    /** Card do modal de lead — o que o visitante lê, não o que a agência recebe. */
    assunto: string;
    /**
     * Rótulos de turno e de estado do mini card.
     * ⚠️ Vivem aqui e são PASSADOS para `DiaTurnos`, que tem default PT. O default existe porque
     * `RoteiroTimeline` (server component, sem locale) consome o mesmo componente — ver o ⚠️ lá.
     */
    turnos: { manha: string; tarde: string; noite: string };
    slot: {
      atrativo: string;
      opcional: string;
      incluido: string;
      jaSelecionado: string;
      incluirPergunta: string;
      incluirAria: (nome: string) => string;
    };
  };
}

export const ROTEIROS_UI: Record<Locale, RoteirosUI> = {
  pt: {
    card: {
      conector: "e",
      cta: "Ver roteiro",
    },
    diasDemo: {
      rotulos: ["Primeiro dia", "Segundo dia", "Terceiro dia"],
      turnos: { manha: "Manhã", tarde: "Tarde", noite: "Noite" },
    },
    leadBlock: {
      eyebrow: "Este roteiro",
      title: "Quer este roteiro nos seus dias em Foz?",
      cta: "Quero este roteiro",
      subtitle:
        "Um especialista que vive na cidade confere a sequência, os horários e o que precisa ser reservado com antecedência — e entrega o roteiro completo para as suas datas.",
      altText: "Quer algo diferente deste?",
      altLink: "Faça o seu próprio roteiro",
    },
    hub: {
      heroH1Before: "Roteiros prontos de ",
      heroH1Strong: "1, 2 ou 3 dias",
      heroH1After: " em Foz do Iguaçu",
      heroSubtitle:
        "Um, dois ou três dias já resolvidos — manhã, tarde e noite na ordem que funciona. Use como ponto de partida do seu.",
      heroCta: "Ver roteiros prontos",
      plansEyebrow: "Escolha por duração",
      navAria: "Ir para os roteiros por duração",
      dayLabel: (d) => `${d} ${d === 1 ? "dia" : "dias"}`,
      maisDias: {
        eyebrow: "Seu caso é outro",
        title: "Não achou o que precisa? O roteiro é montado do zero pra você",
        titleDestaque: ["montado", "do zero"],
        subtitle:
          "Datas apertadas, viajar com criança ou com quem anda menos, um atrativo que você faz questão — nada disso cabe num plano fechado. Um especialista que vive em Foz do Iguaçu monta os seus dias a partir do que você contar.",
      },
      faq: {
        eyebrow: "Antes de escolher",
        title: "Perguntas sobre roteiros em Foz",
        items: [
          {
            q: "Qual roteiro combina com os meus dias em Foz?",
            a: "Cada duração tem três ritmos. O Clássico cobre o essencial sem correria. O Aventura & Natureza é para quem prefere andar a esperar. O Compras & Gastronomia puxa para o Paraguai, a Argentina e a mesa. Se nenhum encaixar, o seu é montado a partir do que estiver mais perto.",
          },
          {
            q: "Vocês têm roteiro pronto de 5 ou 7 dias?",
            // ⚠️ Espelho do `HUB_FAQ` de `app/roteiros/page.tsx` (que alimenta o JSON-LD). O
            // motivo da troca está lá; as duas cópias precisam mudar juntas.
            a: "Fechados, os planos vão até 3 dias. Acima disso, nesta mesma página você escolhe dias já prontos um a um — cada um com a ordem, os horários e os deslocamentos resolvidos por dentro — e chega a 5, 7 ou quantos dias quiser. Se as suas datas ou o seu ritmo pedirem outra coisa, um especialista que vive em Foz do Iguaçu monta o seu do zero.",
          },
          {
            q: "Os roteiros incluem ingressos e transporte?",
            a: "Sim, entram no planejamento. O roteiro considera ingressos, deslocamentos e transfer quando fizerem sentido para os seus dias, junto com horários e a ordem que evita atravessar a cidade sem necessidade.",
          },
          {
            q: "Quanto custa conhecer Foz do Iguaçu?",
            a: "Depende de quando você vai, de quantas pessoas viajam e de quais atrações entram — ingressos, câmbio e alta temporada mudam bastante a conta. Por isso o valor não sai de uma tabela genérica: ele é fechado em cima do roteiro montado para os seus dias.",
          },
          {
            q: "Como recebo meu roteiro?",
            a: "Responda algumas perguntas rápidas — leva menos de dois minutos. Um especialista que vive em Foz revisa suas respostas, ajusta a logística e monta a versão final dos seus dias na cidade.",
          },
        ],
      },
      closing: {
        title: "Estes são organizados por duração. O seu, por você.",
        subtitle:
          "Responda algumas perguntas rápidas e um especialista que vive em Foz monta o roteiro dos seus dias na cidade — com a ordem, os horários e os deslocamentos já resolvidos.",
      },
    },
    porDias: {
      eyebrow: "Roteiro por dias",
      title: "Quer escolher as opções de dias prontos para seu roteiro em Foz?",
      titleDestaque: "as opções de dias prontos",
      subtitle:
        "Cada opção é um dia inteiro já resolvido por dentro — a ordem, os horários e os deslocamentos. Você escolhe um por vez, e para quando quiser.",
      reforcoTitulo: "Todos os ingressos já incluídos automaticamente",
      reforcoDestaque: "já incluídos automaticamente",
      reforcoCorpo:
        "Você não precisa caçar bilheteria por bilheteria, comparar site por site nem descobrir na véspera o que esgota antes. Os ingressos dos atrativos deste roteiro já entram no planejamento, junto com a ordem dos dias — de uma vez só.",
      dia: (n) => `Dia ${n}`,
      selecionar: "Selecionar opção",
      trocar: "Trocar",
      remover: (titulo) => `Remover ${titulo}`,
      modalAria: (n) => `Escolher a opção do Dia ${n}`,
      modalSub: "Escolha a opção deste dia",
      fechar: "Fechar",
      escolher: "Escolher",
      escolhido: "Escolhido",
      cta: "Quero este roteiro",
      recomecar: "Recomeçar do zero",
      recomecarTitulo: "Tem certeza?",
      recomecarDesc:
        "Todos os dias que você escolheu serão apagados, junto com os encaixes que ligou, e você recomeça do zero.",
      recomecarSim: "Sim, recomeçar",
      recomecarNao: "Não, continuar",
      assunto: "Roteiro montado por dias",
      turnos: { manha: "Manhã", tarde: "Tarde", noite: "Noite" },
      slot: {
        atrativo: "Atrativo",
        opcional: "Opcional",
        incluido: "Incluído",
        jaSelecionado: "já selecionado",
        incluirPergunta: "Incluir?",
        incluirAria: (nome) => `Incluir ${nome} neste dia`,
      },
    },
  },
  en: {
    card: {
      conector: "and",
      cta: "View itinerary",
    },
    diasDemo: {
      rotulos: ["First day", "Second day", "Third day"],
      turnos: { manha: "Morning", tarde: "Afternoon", noite: "Evening" },
    },
    leadBlock: {
      eyebrow: "This itinerary",
      title: "Want this itinerary for your days in Foz?",
      cta: "I want this itinerary",
      subtitle:
        "A specialist who lives in the city checks the sequence, the timings and what needs to be booked in advance — and delivers the complete itinerary for your dates.",
      altText: "Want something different from this?",
      altLink: "Make your own itinerary",
    },
    hub: {
      heroH1Before: "Ready-made itineraries for ",
      heroH1Strong: "1, 2 or 3 days",
      heroH1After: " in Foz do Iguaçu",
      heroSubtitle:
        "One, two or three days already sorted — morning, afternoon and evening in the order that works. Use it as the starting point for yours.",
      heroCta: "See ready-made itineraries",
      plansEyebrow: "Choose by duration",
      navAria: "Go to itineraries by duration",
      dayLabel: (d) => `${d} ${d === 1 ? "day" : "days"}`,
      maisDias: {
        eyebrow: "Your case is different",
        title:
          "Didn't find what you need? Your itinerary is built from scratch",
        titleDestaque: ["built", "from scratch"],
        subtitle:
          "Tight dates, travelling with a child or with someone who walks less, one attraction you refuse to miss — none of that fits a fixed plan. A specialist who lives in Foz do Iguaçu builds your days from what you tell us.",
      },
      faq: {
        eyebrow: "Before you choose",
        title: "Questions about itineraries in Foz",
        items: [
          {
            q: "Which itinerary fits my days in Foz?",
            a: "Each duration has three paces. The Classic covers the essentials without rushing. Adventure & Nature is for those who prefer walking over waiting. Shopping & Food leans toward Paraguay, Argentina and the table. If none fits, yours is built from the closest one.",
          },
          {
            q: "Do you have ready-made itineraries for 5 or 7 days?",
            a: "Fixed plans go up to 3 days. Beyond that, on this same page you pick ready-made days one at a time — each with the order, the timings and the travel already sorted inside — and reach 5, 7 or as many days as you want. If your dates or your pace call for something else, a specialist who lives in Foz do Iguaçu builds yours from scratch.",
          },
          {
            q: "Do the itineraries include tickets and transport?",
            a: "Yes, they're part of the planning. The itinerary takes into account tickets, travel and transfers when they make sense for your days, along with timings and an order that avoids crossing the city unnecessarily.",
          },
          {
            q: "How much does it cost to visit Foz do Iguaçu?",
            a: "It depends on when you go, how many people travel and which attractions are included — tickets, exchange rates and high season change the bill a lot. That's why the price doesn't come from a generic table: it's closed based on the itinerary built for your days.",
          },
          {
            q: "How do I receive my itinerary?",
            a: "Answer a few quick questions — it takes less than two minutes. A specialist who lives in Foz reviews your answers, adjusts the logistics and puts together the final version of your days in the city.",
          },
        ],
      },
      closing: {
        title: "These are organized by duration. Yours, by you.",
        subtitle:
          "Answer a few quick questions and a specialist who lives in Foz builds the itinerary for your days in the city — with the order, timings and travel already solved.",
      },
    },
    porDias: {
      eyebrow: "Itinerary by days",
      title: "Want to pick ready-made days for your itinerary in Foz?",
      titleDestaque: "ready-made days",
      subtitle:
        "Each option is a whole day already solved inside — the order, the timings and the travel. You pick one at a time, and stop whenever you want.",
      reforcoTitulo: "All tickets already included automatically",
      reforcoDestaque: "already included automatically",
      reforcoCorpo:
        "You don't have to hunt down one box office at a time, compare site by site or find out the day before what sells out first. The tickets for the attractions in this itinerary are already part of the planning, along with the order of the days — all at once.",
      dia: (n) => `Day ${n}`,
      selecionar: "Select an option",
      trocar: "Change",
      remover: (titulo) => `Remove ${titulo}`,
      modalAria: (n) => `Choose the option for Day ${n}`,
      modalSub: "Choose this day's option",
      fechar: "Close",
      escolher: "Choose",
      escolhido: "Chosen",
      cta: "I want this itinerary",
      recomecar: "Start over",
      recomecarTitulo: "Are you sure?",
      recomecarDesc:
        "All the days you chose will be erased, along with the add-ons you turned on, and you start from scratch.",
      recomecarSim: "Yes, start over",
      recomecarNao: "No, continue",
      assunto: "Itinerary built by days",
      turnos: { manha: "Morning", tarde: "Afternoon", noite: "Evening" },
      slot: {
        atrativo: "Attraction",
        opcional: "Optional",
        incluido: "Included",
        jaSelecionado: "already selected",
        incluirPergunta: "Include?",
        incluirAria: (nome) => `Include ${nome} in this day`,
      },
    },
  },
  es: {
    card: {
      conector: "y",
      cta: "Ver itinerario",
    },
    diasDemo: {
      rotulos: ["Primer día", "Segundo día", "Tercer día"],
      turnos: { manha: "Mañana", tarde: "Tarde", noite: "Noche" },
    },
    leadBlock: {
      eyebrow: "Este itinerario",
      title: "¿Quieres este itinerario para tus días en Foz?",
      cta: "Quiero este itinerario",
      subtitle:
        "Un especialista que vive en la ciudad comprueba la secuencia, los horarios y lo que hay que reservar con antelación — y entrega el itinerario completo para tus fechas.",
      altText: "¿Quieres algo diferente de esto?",
      altLink: "Haz tu propio itinerario",
    },
    hub: {
      heroH1Before: "Itinerarios listos de ",
      heroH1Strong: "1, 2 o 3 días",
      heroH1After: " en Foz do Iguaçu",
      heroSubtitle:
        "Uno, dos o tres días ya resueltos — mañana, tarde y noche en el orden que funciona. Úsalo como punto de partida del tuyo.",
      heroCta: "Ver itinerarios listos",
      plansEyebrow: "Elige por duración",
      navAria: "Ir a los itinerarios por duración",
      dayLabel: (d) => `${d} ${d === 1 ? "día" : "días"}`,
      maisDias: {
        eyebrow: "Tu caso es otro",
        title:
          "¿No encontraste lo que necesitas? Tu itinerario se arma desde cero",
        titleDestaque: ["arma", "desde cero"],
        subtitle:
          "Fechas ajustadas, viajar con niños o con quien camina menos, un atractivo que no quieres perderte — nada de eso entra en un plan cerrado. Un especialista que vive en Foz do Iguaçu arma tus días con lo que nos cuentes.",
      },
      faq: {
        eyebrow: "Antes de elegir",
        title: "Preguntas sobre itinerarios en Foz",
        items: [
          {
            q: "¿Qué itinerario combina con mis días en Foz?",
            a: "Cada duración tiene tres ritmos. El Clásico cubre lo esencial sin apuros. Aventura & Naturaleza es para quien prefiere caminar a esperar. Compras & Gastronomía tira hacia Paraguay, Argentina y la mesa. Si ninguno encaja, el tuyo se arma a partir del más cercano.",
          },
          {
            q: "¿Tienen itinerario listo de 5 o 7 días?",
            a: "Cerrados, los planes llegan hasta 3 días. Más allá, en esta misma página eliges días ya listos uno a uno — cada uno con el orden, los horarios y los traslados resueltos por dentro — y llegas a 5, 7 o los días que quieras. Si tus fechas o tu ritmo piden otra cosa, un especialista que vive en Foz do Iguaçu arma el tuyo desde cero.",
          },
          {
            q: "¿Los itinerarios incluyen entradas y transporte?",
            a: "Sí, entran en la planificación. El itinerario considera entradas, trayectos y transfer cuando tienen sentido para tus días, junto con horarios y un orden que evita cruzar la ciudad sin necesidad.",
          },
          {
            q: "¿Cuánto cuesta conocer Foz do Iguaçu?",
            a: "Depende de cuándo vayas, cuántas personas viajen y qué atractivos entren — las entradas, el tipo de cambio y la temporada alta cambian bastante la cuenta. Por eso el valor no sale de una tabla genérica: se cierra sobre el itinerario armado para tus días.",
          },
          {
            q: "¿Cómo recibo mi itinerario?",
            a: "Responde algunas preguntas rápidas — toma menos de dos minutos. Un especialista que vive en Foz revisa tus respuestas, ajusta la logística y arma la versión final de tus días en la ciudad.",
          },
        ],
      },
      closing: {
        title: "Estos están organizados por duración. El tuyo, por ti.",
        subtitle:
          "Responde algunas preguntas rápidas y un especialista que vive en Foz arma el itinerario de tus días en la ciudad — con el orden, los horarios y los trayectos ya resueltos.",
      },
    },
    porDias: {
      eyebrow: "Itinerario por días",
      title: "¿Quieres elegir los días ya listos para tu itinerario en Foz?",
      titleDestaque: "los días ya listos",
      subtitle:
        "Cada opción es un día entero ya resuelto por dentro — el orden, los horarios y los trayectos. Eliges uno por vez, y paras cuando quieras.",
      reforcoTitulo: "Todas las entradas ya incluidas automáticamente",
      reforcoDestaque: "ya incluidas automáticamente",
      reforcoCorpo:
        "No tienes que buscar taquilla por taquilla, comparar sitio por sitio ni descubrir la víspera qué se agota antes. Las entradas de los atractivos de este itinerario ya entran en la planificación, junto con el orden de los días — de una sola vez.",
      dia: (n) => `Día ${n}`,
      selecionar: "Seleccionar opción",
      trocar: "Cambiar",
      remover: (titulo) => `Quitar ${titulo}`,
      modalAria: (n) => `Elegir la opción del Día ${n}`,
      modalSub: "Elige la opción de este día",
      fechar: "Cerrar",
      escolher: "Elegir",
      escolhido: "Elegido",
      cta: "Quiero este itinerario",
      recomecar: "Empezar de nuevo",
      recomecarTitulo: "¿Estás seguro?",
      recomecarDesc:
        "Se borrarán todos los días que elegiste, junto con los complementos que activaste, y empezarás desde cero.",
      recomecarSim: "Sí, empezar de nuevo",
      recomecarNao: "No, continuar",
      assunto: "Itinerario armado por días",
      turnos: { manha: "Mañana", tarde: "Tarde", noite: "Noche" },
      slot: {
        atrativo: "Atractivo",
        opcional: "Opcional",
        incluido: "Incluido",
        jaSelecionado: "ya seleccionado",
        incluirPergunta: "¿Incluir?",
        incluirAria: (nome) => `Incluir ${nome} en este día`,
      },
    },
  },
};
