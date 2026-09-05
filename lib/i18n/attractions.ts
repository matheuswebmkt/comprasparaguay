// Filepath: lib/i18n/attractions.ts
// Version: 2.0
// Nome da Versão: "Conteúdo textual dos atrativos (tagline/description/highlights/info) + nomes — pt/en/es"
//
// `app/data/attractions.ts` guarda os FATOS/estrutura (slug, name, city, address, officialUrl, cover) e
// continua a matriz pt. `ATTRACTION_NAMES` traduz o NOME exibido ao visitante (cards, heróis, detalhe) —
// o pt espelha o dado, então os componentes podem usar sempre o dicionário com fallback no dado.
// JSON-LD (`attractionSchema`) e `metadata` continuam lendo direto de `attractions.ts` (sempre pt —
// canônico de SEO), não deste dicionário.

import type { Locale } from "./config";

export interface AttractionI18n {
  tagline: string;
  description: string[];
  highlights: string[];
  info: { label: string; value: string }[];
}

/** Nome exibido por locale (chave = slug de `app/data/attractions.ts`). pt = matriz (espelha o dado). */
export const ATTRACTION_NAMES: Record<Locale, Record<string, string>> = {
  pt: {
    "cataratas-do-iguacu": "Cataratas do Iguaçu",
    "parque-das-aves": "Parque das Aves",
    "marco-das-tres-fronteiras": "Marco das Três Fronteiras",
    "itaipu-binacional": "Itaipu Binacional",
    "refugio-biologico-bela-vista": "Refúgio Biológico Bela Vista",
    "dreams-park-show": "Dreams Park Show",
    "vale-dos-dinossauros": "Vale dos Dinossauros",
    "museu-de-cera": "Museu de Cera",
    "dreams-ice-bar": "Dreams Ice Bar",
    aquafoz: "Aquafoz",
    "cataratas-jl-shopping": "Cataratas JL Shopping",
    "shopping-catuai-palladium": "Shopping Catuaí Palladium",
    "roda-gigante-yup-star": "Roda Gigante Yup Star",
    "macuco-safari": "Macuco Safari",
    "cataratas-lado-argentino": "Cataratas — lado argentino",
    "templo-budista-foz": "Templo Budista Chen Tien",
    "mesquita-omar-ibn-al-khattab": "Mesquita Omar Ibn Al-Khattab",
    "compras-paraguai-ciudad-del-este": "Compras Paraguai - Ciudad del Este",
    "saltos-del-monday": "Saltos del Monday",
    "by-night-argentina-puerto-iguazu": "By Night Puerto Iguazú — Argentina",
    "duty-free-shop-puerto-iguazu-argentina":
      "Compras Duty Free - Puerto Iguazú",
    "kattamaram-foz": "Kattamaram II",
    "wonder-park-foz": "Wonder Park Foz",
    "helisul-experience-helicoptero-cataratas":
      "Helicóptero nas Cataratas - Helisul Experience",
    "eco-park-foz": "Eco Park Foz",
    "ecomuseu-itaipu": "Ecomuseu de Itaipu",
    "aguaray-eco-esportes": "Aguaray Eco Esportes",
    "gran-aventura": "Gran Aventura (barco Argentina)",
    "madero-tango-iguazu": "Madero Tango Iguazú",
    "blue-park-foz": "Blue Park",
    "iguassu-secret-falls": "Iguassu Secret Falls",
    "la-aripuca": "La Aripuca",
    "hito-tres-fronteras": "Hito Tres Fronteras (Argentina)",
    "aeroporto-checkin-checkout-hotel": "Aeroporto / Check-in e Check-out no hotel",
  },
  en: {
    "cataratas-do-iguacu": "Iguaçu Falls",
    "parque-das-aves": "Bird Park",
    "marco-das-tres-fronteiras": "Triple Frontier Landmark",
    "itaipu-binacional": "Itaipu Binational",
    "refugio-biologico-bela-vista": "Bela Vista Biological Refuge",
    "dreams-park-show": "Dreams Park Show",
    "vale-dos-dinossauros": "Valley of the Dinosaurs",
    "museu-de-cera": "Dreams Wax Museum",
    "dreams-ice-bar": "Dreams Ice Bar",
    aquafoz: "Aquafoz",
    "cataratas-jl-shopping": "Cataratas JL Shopping",
    "shopping-catuai-palladium": "Shopping Catuaí Palladium",
    "roda-gigante-yup-star": "Yup Star Ferris Wheel",
    "macuco-safari": "Macuco Safari",
    "cataratas-lado-argentino": "Falls — Argentine side",
    "templo-budista-foz": "Chen Tien Buddhist Temple",
    "mesquita-omar-ibn-al-khattab": "Omar Ibn Al-Khattab Mosque",
    "compras-paraguai-ciudad-del-este": "Shopping in Ciudad del Este",
    "saltos-del-monday": "Saltos del Monday",
    "by-night-argentina-puerto-iguazu": "By Night Puerto Iguazú — Argentina",
    "duty-free-shop-puerto-iguazu-argentina":
      "Duty Free Shopping - Puerto Iguazú",
    "kattamaram-foz": "Kattamaram II",
    "wonder-park-foz": "Wonder Park Foz",
    "helisul-experience-helicoptero-cataratas":
      "Falls Helicopter Ride (Helisul Experience)",
    "eco-park-foz": "Eco Park Foz",
    "ecomuseu-itaipu": "Itaipu Ecomuseum",
    "aguaray-eco-esportes": "Aguaray Eco Sports",
    "gran-aventura": "Gran Aventura (boat, Argentina)",
    "madero-tango-iguazu": "Madero Tango Iguazú",
    "blue-park-foz": "Blue Park",
    "iguassu-secret-falls": "Iguassu Secret Falls",
    "la-aripuca": "La Aripuca",
    "hito-tres-fronteras": "Hito Tres Fronteras (Argentina)",
    "aeroporto-checkin-checkout-hotel": "Airport / Hotel check-in and check-out",
  },
  es: {
    "cataratas-do-iguacu": "Cataratas del Iguazú",
    "parque-das-aves": "Parque de las Aves",
    "marco-das-tres-fronteiras": "Marco de las Tres Fronteras",
    "itaipu-binacional": "Itaipú Binacional",
    "refugio-biologico-bela-vista": "Refugio Biológico Bela Vista",
    "dreams-park-show": "Dreams Park Show",
    "vale-dos-dinossauros": "Valle de los Dinosaurios",
    "museu-de-cera": "Museo de Cera Dreams",
    "dreams-ice-bar": "Dreams Ice Bar",
    aquafoz: "Aquafoz",
    "cataratas-jl-shopping": "Cataratas JL Shopping",
    "shopping-catuai-palladium": "Shopping Catuaí Palladium",
    "roda-gigante-yup-star": "Rueda Gigante Yup Star",
    "macuco-safari": "Macuco Safari",
    "cataratas-lado-argentino": "Cataratas — lado argentino",
    "templo-budista-foz": "Templo Budista Chen Tien",
    "mesquita-omar-ibn-al-khattab": "Mezquita Omar Ibn Al-Khattab",
    "compras-paraguai-ciudad-del-este": "Compras en Ciudad del Este",
    "saltos-del-monday": "Saltos del Monday",
    "by-night-argentina-puerto-iguazu": "By Night Puerto Iguazú — Argentina",
    "duty-free-shop-puerto-iguazu-argentina":
      "Compras Duty Free - Puerto Iguazú",
    "kattamaram-foz": "Kattamaram II",
    "wonder-park-foz": "Wonder Park Foz",
    "helisul-experience-helicoptero-cataratas":
      "Helicóptero sobre las Cataratas (Helisul Experience)",
    "eco-park-foz": "Eco Park Foz",
    "ecomuseu-itaipu": "Ecomuseo de Itaipú",
    "aguaray-eco-esportes": "Aguaray Eco Deportes",
    "gran-aventura": "Gran Aventura (barco Argentina)",
    "madero-tango-iguazu": "Madero Tango Iguazú",
    "blue-park-foz": "Blue Park",
    "iguassu-secret-falls": "Iguassu Secret Falls",
    "la-aripuca": "La Aripuca",
    "hito-tres-fronteras": "Hito Tres Fronteras (Argentina)",
    "aeroporto-checkin-checkout-hotel": "Aeropuerto / Check-in y check-out en el hotel",
  },
};
/** Label CURTO exibido no CARD do atrativo (titulo do card) — por locale, por slug.
 * Camada INDEPENDENTE do ATTRACTION_NAMES: o nome oficial (pagina/H1/SEO) continua no
 * ATTRACTION_NAMES/dado. Quem precisa de titulo curto no card (quebra de linha) edita AQUI, nos 3
 * idiomas, sem derrubar a pagina. Fonte unica por definicao: sem entrada -> fallback ATTRACTION_NAMES. */
export const CARD_LABELS: Record<Locale, Record<string, string>> = {
  pt: {
    "cataratas-do-iguacu": "Cataratas do Iguaçu",
    "parque-das-aves": "Parque das Aves",
    "marco-das-tres-fronteiras": "Marco das Três Fronteiras",
    "itaipu-binacional": "Itaipu Binacional",
    "refugio-biologico-bela-vista": "Refúgio Biológico",
    "dreams-park-show": "Dreams Park Show",
    "vale-dos-dinossauros": "Vale dos Dinossauros",
    "museu-de-cera": "Museu de Cera",
    "dreams-ice-bar": "Dreams Ice Bar",
    "cataratas-jl-shopping": "Cataratas JL Shopping",
    "shopping-catuai-palladium": "Shopping Catuaí Palladium",
    "roda-gigante-yup-star": "Roda Gigante Yup Star",
    "macuco-safari": "Macuco Safari",
    "cataratas-lado-argentino": "Cataratas — lado argentino",
    "templo-budista-foz": "Templo Budista Chen Tien",
    "mesquita-omar-ibn-al-khattab": "Mesquita",
    "compras-paraguai-ciudad-del-este": "Compras no Paraguai",
    "saltos-del-monday": "Saltos del Monday",
    "by-night-argentina-puerto-iguazu": "By Night Argentina",
    "duty-free-shop-puerto-iguazu-argentina": "Compras Duty Free",
    "kattamaram-foz": "Kattamaram II",
    "wonder-park-foz": "Wonder Park Foz",
    "helisul-experience-helicoptero-cataratas": "Helicóptero nas Cataratas",
    "eco-park-foz": "Eco Park Foz",
    "ecomuseu-itaipu": "Ecomuseu de Itaipu",
    "aguaray-eco-esportes": "Aguaray Eco Esportes",
    "gran-aventura": "Gran Aventura",
    "madero-tango-iguazu": "Madero Tango Iguazú",
    "blue-park-foz": "Blue Park",
    "iguassu-secret-falls": "Iguassu Secret Falls",
    "la-aripuca": "La Aripuca",
    "hito-tres-fronteras": "Hito Tres Fronteras",
    "aeroporto-checkin-checkout-hotel": "Aeroporto / Check-in-out hotel",
  },
  en: {
    "cataratas-do-iguacu": "Iguaçu Falls",
    "parque-das-aves": "Bird Park",
    "marco-das-tres-fronteiras": "Triple Frontier Landmark",
    "itaipu-binacional": "Itaipu Binational",
    "refugio-biologico-bela-vista": "Biological Refuge",
    "dreams-park-show": "Dreams Park Show",
    "vale-dos-dinossauros": "Valley of the Dinosaurs",
    "museu-de-cera": "Wax Museum",
    "dreams-ice-bar": "Dreams Ice Bar",
    "cataratas-jl-shopping": "Cataratas JL Shopping",
    "shopping-catuai-palladium": "Shopping Catuaí Palladium",
    "roda-gigante-yup-star": "Yup Star Ferris Wheel",
    "macuco-safari": "Macuco Safari",
    "cataratas-lado-argentino": "Falls — Argentine side",
    "templo-budista-foz": "Chen Tien Buddhist Temple",
    "mesquita-omar-ibn-al-khattab": "Mosque",
    "compras-paraguai-ciudad-del-este": "Shopping in Paraguay",
    "saltos-del-monday": "Saltos del Monday",
    "by-night-argentina-puerto-iguazu": "By Night Argentina",
    "duty-free-shop-puerto-iguazu-argentina": "Duty Free Shopping",
    "kattamaram-foz": "Kattamaram II",
    "wonder-park-foz": "Wonder Park Foz",
    "helisul-experience-helicoptero-cataratas": "Falls Helicopter Ride",
    "eco-park-foz": "Eco Park Foz",
    "ecomuseu-itaipu": "Itaipu Ecomuseum",
    "aguaray-eco-esportes": "Aguaray Eco Sports",
    "gran-aventura": "Gran Aventura",
    "madero-tango-iguazu": "Madero Tango Iguazú",
    "blue-park-foz": "Blue Park",
    "iguassu-secret-falls": "Iguassu Secret Falls",
    "la-aripuca": "La Aripuca",
    "hito-tres-fronteras": "Hito Tres Fronteras",
    "aeroporto-checkin-checkout-hotel": "Airport / Hotel check-in-out",
  },
  es: {
    "cataratas-do-iguacu": "Cataratas del Iguazú",
    "parque-das-aves": "Parque de las Aves",
    "marco-das-tres-fronteiras": "Marco de las Tres Fronteras",
    "itaipu-binacional": "Itaipú Binacional",
    "refugio-biologico-bela-vista": "Refugio Biológico",
    "dreams-park-show": "Dreams Park Show",
    "vale-dos-dinossauros": "Valle de los Dinosaurios",
    "museu-de-cera": "Museo de Cera",
    "dreams-ice-bar": "Dreams Ice Bar",
    "cataratas-jl-shopping": "Cataratas JL Shopping",
    "shopping-catuai-palladium": "Shopping Catuaí Palladium",
    "roda-gigante-yup-star": "Rueda Gigante Yup Star",
    "macuco-safari": "Macuco Safari",
    "cataratas-lado-argentino": "Cataratas — lado argentino",
    "templo-budista-foz": "Templo Budista Chen Tien",
    "mesquita-omar-ibn-al-khattab": "Mezquita",
    "compras-paraguai-ciudad-del-este": "Compras en Paraguay",
    "saltos-del-monday": "Saltos del Monday",
    "by-night-argentina-puerto-iguazu": "By Night Argentina",
    "duty-free-shop-puerto-iguazu-argentina": "Compras Duty Free",
    "kattamaram-foz": "Kattamaram II",
    "wonder-park-foz": "Wonder Park Foz",
    "helisul-experience-helicoptero-cataratas":
      "Helicóptero sobre las Cataratas",
    "eco-park-foz": "Eco Park Foz",
    "ecomuseu-itaipu": "Ecomuseo de Itaipú",
    "aguaray-eco-esportes": "Aguaray Eco Deportes",
    "gran-aventura": "Gran Aventura",
    "madero-tango-iguazu": "Madero Tango Iguazú",
    "blue-park-foz": "Blue Park",
    "iguassu-secret-falls": "Iguassu Secret Falls",
    "la-aripuca": "La Aripuca",
    "hito-tres-fronteras": "Hito Tres Fronteras",
    "aeroporto-checkin-checkout-hotel": "Aeropuerto / Check-in-out hotel",
  },
};

export const ATTRACTIONS_I18N: Record<
  Locale,
  Record<string, AttractionI18n>
> = {
  pt: {
    "cataratas-do-iguacu": {
      tagline:
        "275 quedas d'água e a Garganta do Diabo vista de frente, do lado brasileiro do parque.",
      description: [
        "São 275 quedas espalhadas pelo cânion do rio Iguaçu, e a Garganta do Diabo despeja 80 metros de água a poucos passos de onde você fica. O lado brasileiro é o do panorama: você vê o conjunto inteiro de frente, com o Salto Floriano e o Salto Deodoro no caminho, enquanto o lado argentino leva você para cima das quedas.",
        "A visita é mais simples do que parece. Do centro de visitantes sai o ônibus interno que deixa no começo da trilha; de lá são 1,3 km de passarela até a plataforma da Garganta — a parte em que todo mundo se molha, com capa de chuva ou sem. No fim, o elevador panorâmico sobe até o Porto Canoas, onde ficam o restaurante de frente para o rio e a parada obrigatória antes da volta.",
        "Três horas dão conta do essencial, e é justamente por isso que o lado brasileiro raramente ocupa o dia inteiro sozinho. Ele divide bem a manhã com o Parque das Aves, que fica na mesma entrada, ou abre a tarde para o Macuco Safari e para o sobrevoo de helicóptero — os três estão no mesmo corredor, o que evita atravessar a cidade duas vezes no mesmo dia.",
        "O parque é floresta subtropical preservada e Patrimônio Mundial da UNESCO, e abriga espécies ameaçadas como a onça-pintada, a anta e o tatu-canastra, todas longe das trilhas. O que cruza o seu caminho de verdade são os quatis: simpáticos, oportunistas e proibidos de alimentar, porque já aprenderam a abrir mochila.",
      ],
      highlights: [
        "Sete Maravilhas da Natureza",
        "Garganta do Diabo de frente",
        "Trilha de 1,3 km com mirantes",
        "Elevador panorâmico incluído",
      ],
      info: [
        {
          label: "Onde fica",
          value: "Parque Nacional do Iguaçu — BR-469, Rodovia das Cataratas",
        },
        {
          label: "Horário",
          value: "Seg a sex, 9h às 16h · Sáb, dom e feriados, 8h30 às 16h",
        },
        {
          label: "Tempo sugerido",
          value: "3 horas para o essencial; meio período em ritmo calmo",
        },
        {
          label: "Dica",
          value:
            "Vá cedo: fila menor no ônibus interno e luz melhor na Garganta. Capa de chuva resolve mais que guarda-chuva.",
        },
      ],
    },
    "parque-das-aves": {
      tagline:
        "Viveiros que você atravessa por dentro, a 500 metros da entrada das Cataratas.",
      description: [
        "Aqui você não olha as aves atrás de uma tela: entra no viveiro com elas. Araras-canindé, tucanos e papagaios circulam soltos a poucos metros da trilha, e no viveiro dos periquitos são centenas voando ao mesmo tempo em volta de quem passa. O ponto alto para muita gente é a harpia, uma das maiores águias do mundo, que impõe respeito só de estar parada.",
        "São 1,5 km de trilha por dentro da mata, com piso acessível a cadeira de rodas, passando por flamingos, corujas, emas, seriemas, um borboletário e recintos de jacarés e cobras. Ambientes de Pantanal e de Mata Atlântica foram recriados para as espécies, e o Centro de Conservação mostra o trabalho de resgate e reprodução de aves ameaçadas — que é a razão de o parque existir, não um anexo.",
        "Ficam 500 metros da entrada do Parque Nacional, o que faz dos dois o par mais óbvio do mesmo dia. A ordem tem um detalhe: as Cataratas rendem mais cedo, com fila menor e luz melhor, enquanto as aves ficam mais ativas de manhã e perdem o ritmo no calor da tarde. Duas horas aqui resolvem, então dá para abrir o dia pelas aves às 8h30 e emendar nas Cataratas antes do meio-dia — ou inverter, se fotografar as quedas for a prioridade.",
        "É um dos poucos passeios de Foz que a chuva não estraga: a mata cobre boa parte do percurso e as aves continuam ali. Vale repelente, calçado fechado e desligar o flash — a regra existe para não assustar os bichos, e as fotos ficam melhores sem ele de qualquer forma.",
      ],
      highlights: [
        "Viveiros que você atravessa",
        "Águia-harpia de perto",
        "Trilha de 1,5 km acessível",
        "500 m das Cataratas",
      ],
      info: [
        {
          label: "Onde fica",
          value:
            "Av. das Cataratas, km 17 — 500 m da entrada do Parque Nacional",
        },
        { label: "Horário", value: "Todos os dias, 8h30 às 16h30" },
        {
          label: "Tempo sugerido",
          value: "2 horas no ritmo comum; 3 com crianças ou fotos",
        },
        {
          label: "Dica",
          value:
            "Manhã rende mais: aves ativas e menos calor. Flash é proibido — e desnecessário.",
        },
      ],
    },
    "marco-das-tres-fronteiras": {
      tagline:
        "Três países à vista, obelisco de 1903 e o pôr do sol mais concorrido de Foz.",
      description: [
        "O obelisco está ali desde 1903, marcando onde o rio Iguaçu deságua no Paraná e onde três países se encontram: Argentina de um lado, Paraguai do outro, Brasil sob os seus pés. Cada país tem o seu marco pintado nas próprias cores, e daqui você vê os três de uma vez. Na revitalização recente o obelisco ganhou espelho d'água e iluminação, o que muda completamente o lugar depois que escurece.",
        "O complexo não é só mirante. A Vila Cenográfica das Missões Jesuíticas reconstitui o encontro entre padres e indígenas nos séculos XVI e XVII, e o Memorial Cabeza de Vaca conta a história do espanhol que, em 1542, foi o primeiro europeu a registrar a existência das Cataratas. No fim da tarde entra o Espetáculo Três Fronteiras, com música e dança das culturas que dividem esta fronteira.",
        "Aqui a agenda manda: o Marco abre 13h30 e fecha às 21h, de terça a domingo. Não existe visita de manhã, e segunda-feira está fora. Isso faz dele o fecho natural de um dia que começou nas Cataratas ou em Itaipu, e não uma parada que se encaixa em qualquer buraco do dia. Uma a duas horas bastam, e quem quiser emendar tem a Roda Gigante Yup Star a poucos minutos, também de fim de tarde.",
        "O restaurante Cabeza de Vaca funciona das 15h às 22h e é uma das poucas mesas de Foz com três países na paisagem. A estrutura é plana e acessível de ponta a ponta, então carrinho de bebê e cadeira de rodas circulam sem esforço. Leve um agasalho leve: na confluência dos rios venta, e a temperatura cai rápido depois que o sol some.",
      ],
      highlights: [
        "Três países à vista",
        "Obelisco de 1903 iluminado",
        "Espetáculo Três Fronteiras",
        "Pôr do sol sobre os rios",
      ],
      info: [
        {
          label: "Onde fica",
          value:
            "Ac. Três Fronteiras, região sul de Foz — encontro dos rios Iguaçu e Paraná",
        },
        {
          label: "Horário",
          value: "Ter a dom, 13h30 às 21h · fecha às segundas",
        },
        {
          label: "Tempo sugerido",
          value: "1 a 2 horas, com o pôr do sol no meio",
        },
        {
          label: "Dica",
          value:
            "Chegue cerca de uma hora antes do pôr do sol para pegar lugar no mirante. Agasalho leve resolve o vento do rio.",
        },
      ],
    },
    "itaipu-binacional": {
      tagline:
        "O complexo do Turismo Itaipu: três visitas diferentes na maior hidrelétrica do mundo.",
      description: [
        "Itaipu é a maior hidrelétrica do mundo em produção de energia e foi eleita uma das Maravilhas da Engenharia Moderna pela Associação de Engenharia Civil dos Estados Unidos. Obra conjunta de brasileiros e paraguaios, ela domou o rio Paraná — o décimo maior do planeta em volume de água — e é um dos poucos lugares onde dá para ver equipamentos dessa escala funcionando de perto.",
        "O Turismo Itaipu não é uma visita só: são três, e escolher a errada é o tropeço mais comum de quem vem. A Panorâmica percorre o lado de fora em ônibus, leva cerca de 1h30 e é a única indicada para mobilidade reduzida. A Especial entra na usina — sala de comando, eixo de turbina, interior da barragem — em 2h30, e exige documento de identificação original. A Iluminada é noturna, acontece só às sextas e sábados, e é contemplação: não substitui nenhuma das duas.",
        "O complexo tem mais do que a barragem. O Refúgio Biológico Bela Vista e o Ecomuseu ficam no mesmo eixo e transformam a visita em meio dia ou dia inteiro, para quem quer natureza e história além da engenharia.",
        "Itaipu fica no lado oposto ao corredor das Cataratas, então tentar os dois no mesmo dia é receita para correr. O usual é reservar um dia — ou um meio período forte — para o eixo de Itaipu e deixar as Cataratas para outro. E quem tem só uma sexta ou um sábado à noite livre precisa decidir cedo entre a Iluminada e o pôr do sol no Marco das Três Fronteiras: os dois disputam exatamente o mesmo horário.",
      ],
      highlights: [
        "Maior hidrelétrica do mundo",
        "Três visitas diferentes",
        "Maravilha da Engenharia Moderna",
        "Refúgio e Ecomuseu no mesmo eixo",
      ],
      info: [
        {
          label: "Onde fica",
          value: "Av. Tancredo Neves, 6702 — Centro de Recepção de Visitantes",
        },
        {
          label: "Horário",
          value:
            "Panorâmica e Especial: diariamente, a partir das 8h30 · Iluminada: sextas e sábados, 19h",
        },
        {
          label: "Tempo sugerido",
          value: "Panorâmica 1h30 · Especial 2h30 · Iluminada 2h",
        },
        {
          label: "Dica",
          value:
            "Escolha a visita antes de sair do hotel: são três passeios distintos, com horários, regras e duração próprios.",
        },
      ],
    },
    "refugio-biologico-bela-vista": {
      tagline:
        "A onça, a harpia e a mata que a usina recompôs, em trilha guiada de 1,7 km.",
      description: [
        "O Refúgio Bela Vista nasceu de uma dívida: quando o reservatório de Itaipu encheu, a usina precisou resgatar os animais que perderam território e recompor a vegetação que foi para debaixo d'água. O que começou como operação de resgate virou unidade de conservação, centro de pesquisa e, hoje, o passeio mais tranquilo do complexo.",
        "A trilha guiada tem 1,7 km e leva cerca de duas horas por floresta, lagos e recintos. É aqui que você vê de perto onça-pintada, jaguatirica, anta, arara e harpia — parte resgatada, parte em reabilitação. No Parque Nacional do Iguaçu essas mesmas espécies existem, mas vivem longe das trilhas: este é o lugar onde elas aparecem. O jardim botânico reúne mais de 50 espécies de árvores nativas, várias ameaçadas de extinção.",
        "A logística tem duas travas que decidem o dia: o Refúgio fecha às terças e as saídas são em horários fixos — 8h30, 10h30, 14h30 e 15h30. Não existe chegar quando der. Como fica no mesmo complexo da usina, o encaixe natural é com a Itaipu Panorâmica: 1h30 dela mais 2h30 daqui fecham um meio período cheio, e é o horário de saída do Refúgio que define qual das duas vem primeiro.",
        "É passeio de ritmo lento, guiado e ao ar livre, então rende mais com calçado fechado, repelente e água. Quem viaja com crianças costuma achar aqui o contraponto que faltava a um dia de concreto e engenharia — e quem fotografa fauna encontra o oposto do Parque das Aves: animais maiores e bem menos gente por metro quadrado.",
      ],
      highlights: [
        "Onça-pintada e harpia de perto",
        "Trilha guiada de 1,7 km",
        "Jardim botânico nativo",
        "Mesmo complexo de Itaipu",
      ],
      info: [
        {
          label: "Onde fica",
          value: "Complexo Turístico de Itaipu — Av. Tancredo Neves",
        },
        {
          label: "Horário",
          value:
            "Qua a seg, saídas às 8h30, 10h30, 14h30 e 15h30 · fecha às terças",
        },
        {
          label: "Tempo sugerido",
          value: "2h a 2h30, incluindo transporte interno e trilha",
        },
        {
          label: "Dica",
          value:
            "As saídas têm horário fixo — escolher a sua é o que define a ordem do dia com a Itaipu Panorâmica.",
        },
      ],
    },
    "dreams-park-show": {
      tagline:
        "Complexo de atrações: dinossauros, maravilhas do mundo e museu de cera.",
      description: [
        "O Dreams Park Show reúne várias atrações temáticas em um só lugar, como o Vale dos Dinossauros, as Maravilhas do Mundo em miniatura e o museu de cera — diversão garantida para todas as idades.",
        "É uma ótima opção de passeio coberto, perfeito para os dias de chuva ou para variar o roteiro além da natureza.",
      ],
      highlights: [
        "Vale dos Dinossauros",
        "Maravilhas do Mundo",
        "Bom para chuva",
      ],
      info: [
        {
          label: "Onde fica",
          value: "Av. das Cataratas, 8100 — a caminho do Parque Nacional",
        },
        {
          label: "Horário",
          value:
            "Varia por atração: das 9h/10h até 21h, 22h ou 23h conforme o dia",
        },
        {
          label: "Tempo sugerido",
          value: "1 a 2 horas por atração; 3 a 5 escolhendo duas ou três",
        },
        {
          label: "Dica",
          value:
            "O ingresso é por atração, não pelo complexo. Escolher antes evita pagar por área que você não vai aproveitar.",
        },
      ],
    },
    aquafoz: {
      tagline:
        "O aquário de Foz: 300 espécies e 3,3 milhões de litros dedicados aos rios Paraná e Iguaçu.",
      description: [
        "O AquaFoz é o aquário de Foz do Iguaçu: 23 mil m² e cerca de 3,3 milhões de litros d'água distribuídos por três andares de visitação. São mais de 300 espécies de água doce e salgada, e o percurso foi desenhado como um caminho das águas — você começa nos rios da região e termina no oceano.",
        "O eixo do acervo é local, e é isso que o diferencia de um aquário genérico: a Galeria Rio Iguaçu percorre o Alto, o Médio e o Baixo Iguaçu, mostrando como a fauna muda ao longo do próprio rio. Bagre-da-pedra, lambari-do-iguaçu e cascudo-roseta aparecem no trecho alto; traíra, jacundá e mandi-do-iguaçu, no médio. São peixes que vivem na bacia que alimenta as Cataratas — o mesmo rio, visto por dentro.",
        "Painéis interativos e áreas educativas sustentam a visita, e por trás dela há um centro de conservação que mantém projetos científicos com universidades e instituições ambientais desde antes da abertura ao público. A proposta não é só exibir espécies: é pesquisa e proteção de habitat.",
        "Uma hora e meia a duas horas resolvem, e o encaixe é natural: fica perto da entrada do Parque Nacional do Iguaçu, no mesmo corredor das Cataratas e do Parque das Aves. É coberto e climatizado, o que faz dele uma das melhores cartas na manga da cidade em dia de chuva ou de calor forte. Atenção à última entrada, às 17h — bem antes do fechamento.",
      ],
      highlights: [
        "Mais de 300 espécies",
        "3,3 milhões de litros",
        "Galeria Rio Iguaçu",
        "Coberto e climatizado",
      ],
      info: [
        {
          label: "Onde fica",
          value: "Av. das Cataratas — próximo à entrada do Parque Nacional",
        },
        {
          label: "Horário",
          value: "Todos os dias, 9h às 18h30 · última entrada às 17h",
        },
        { label: "Tempo sugerido", value: "1h30 a 2 horas" },
        {
          label: "Dica",
          value:
            "A última entrada é às 17h, não às 18h30. Chegar depois disso significa não entrar.",
        },
      ],
    },
    "vale-dos-dinossauros": {
      tagline:
        "30 dinossauros em tamanho real que se mexem e rugem, numa trilha com lagos e cachoeiras.",
      description: [
        "São 30 dinossauros em tamanho real espalhados por uma trilha na mata, e eles se mexem e emitem som — o que muda completamente a reação de quem tem menos de dez anos. O maior é o Giganotossauro, com mais de 14 metros, um predador que viveu na Patagônia e hoje ocupa o meio do vale.",
        "O percurso é ao ar livre, entre lagos e cachoeiras, e é isso que separa esta atração das outras do complexo: enquanto o Museu de Cera e o Ice Bar ignoram o tempo, aqui a chuva forte estraga o passeio. Também é uma das que fecham mais cedo, às 19h30 ou 20h30 conforme o dia.",
        "Uma a duas horas dão conta com folga. Na Av. das Cataratas, no caminho do Parque Nacional, encaixa naturalmente depois de uma manhã nas quedas — e é a atração do Dreams Park que costuma decidir a visita quando o grupo tem criança pequena.",
      ],
      highlights: [
        "30 dinossauros em tamanho real",
        "Movimento e som",
        "Giganotossauro de 14 metros",
        "Trilha com lagos e cachoeiras",
      ],
      info: [
        {
          label: "Onde fica",
          value: "Dreams Park Show — Av. das Cataratas, 8100",
        },
        {
          label: "Horário",
          value: "Dom a qua, 9h30 às 19h30 · Qui a sáb, 9h30 às 20h30",
        },
        { label: "Tempo sugerido", value: "1 a 2 horas" },
        {
          label: "Dica",
          value:
            "É trilha aberta: em chuva forte perde muito. Nesse dia, o Museu de Cera e o Ice Bar, ali do lado, resolvem melhor.",
        },
      ],
    },
    "museu-de-cera": {
      tagline:
        "17 cenários e mais de 100 personagens do cinema, da música e da história para fotografar.",
      description: [
        "São 17 cenários e mais de 100 figuras de cera: astros do cinema, da música, da televisão, do esporte, da política e da história, além de um bloco dedicado a super-heróis e vilões. A proposta não é olhar de longe — cada cenário foi montado para você entrar, posar e sair com a foto.",
        "É totalmente coberto e climatizado, o que faz dele uma das respostas mais diretas de Foz para dia de chuva ou tarde de calor forte. E fecha tarde: 21h de domingo a quarta, 22h de quinta a sábado, numa cidade em que quase tudo encerra às 16h.",
        "Uma hora a uma hora e meia bastam. Fica dentro do Dreams Park Show, na Av. das Cataratas, e funciona bem emendado com outra atração do complexo ou como programa de fim de dia, quando o parque nacional já fechou e ainda sobrou disposição.",
      ],
      highlights: [
        "17 cenários",
        "Mais de 100 personagens",
        "Super-heróis e vilões",
        "Aberto até 21h ou 22h",
      ],
      info: [
        {
          label: "Onde fica",
          value: "Dreams Park Show — Av. das Cataratas, 8100",
        },
        {
          label: "Horário",
          value: "Dom a qua, 9h às 21h · Qui a sáb, 9h às 22h",
        },
        { label: "Tempo sugerido", value: "1 a 1h30" },
        {
          label: "Dica",
          value:
            "Fecha tarde e é coberto: resolve tanto o dia de chuva quanto a noite sem programação.",
        },
      ],
    },
    "dreams-ice-bar": {
      tagline:
        "Um bar a 15 graus negativos onde copo, mesa e parede são de gelo — na cidade mais quente do país.",
      description: [
        "A graça está no contraste: Foz é uma das cidades mais quentes do Brasil, e aqui você entra num ambiente a 15 graus negativos onde tudo — copos, bancos, mesas, paredes e balcão — é feito de gelo. Casacos e luvas são entregues na entrada, então não é preciso levar nada.",
        "A visita é por sessão e curta por natureza: ninguém fica muito tempo a essa temperatura, e é exatamente esse o ponto. Funciona para adultos e para crianças, e costuma render as fotos mais improváveis de um roteiro em Foz.",
        "Fica dentro do Dreams Park Show, na Av. das Cataratas, e é a atração que vai mais tarde de todo o complexo: até 22h de domingo a quarta e até 23h de quinta a sábado. Fique atento à última sessão, que fecha bem antes do horário de encerramento.",
      ],
      highlights: [
        "Ambiente a −15 °C",
        "Tudo feito de gelo",
        "Casaco e luvas na entrada",
        "Aberto até 22h ou 23h",
      ],
      info: [
        {
          label: "Onde fica",
          value: "Dreams Park Show — Av. das Cataratas, 8100",
        },
        {
          label: "Horário",
          value:
            "Dom a qua, 10h às 22h (última sessão 21h10) · Qui a sáb, 10h às 23h (última sessão 21h50)",
        },
        { label: "Tempo sugerido", value: "30 a 45 minutos, por sessão" },
        {
          label: "Dica",
          value:
            "A última sessão sai bem antes do fechamento — chegar às 22h numa quinta não garante entrada.",
        },
      ],
    },
    "cataratas-jl-shopping": {
      tagline: "Compras, gastronomia e cinema no coração de Foz.",
      description: [
        "O Cataratas JL Shopping é um dos principais centros de compras de Foz do Iguaçu, com lojas, praça de alimentação, cinema e serviços.",
        "É uma boa parada para descansar, comer e fazer compras com conforto e ar-condicionado.",
      ],
      highlights: ["Lojas e serviços", "Praça de alimentação", "Cinema"],
      info: [
        {
          label: "Dica",
          value: "Boa opção de refeição e descanso no caminho das Cataratas.",
        },
      ],
    },
    "shopping-catuai-palladium": {
      tagline: "O maior shopping da região, com lazer, compras e gastronomia.",
      description: [
        "O Catuaí Palladium é o maior shopping de Foz do Iguaçu, com ampla variedade de lojas, restaurantes, cinema e opções de lazer para toda a família.",
        "Reúne tudo em um só lugar — ideal para um programa completo de compras e diversão.",
      ],
      highlights: [
        "Maior shopping da região",
        "Lazer e cinema",
        "Gastronomia variada",
      ],
      info: [
        {
          label: "Dica",
          value: "Programe um período do dia — é grande e tem muita coisa.",
        },
      ],
    },
    "roda-gigante-yup-star": {
      tagline:
        "88 metros de altura e a Tríplice Fronteira inteira num giro de 12 minutos.",
      description: [
        "São 88 metros de altura e um giro de cerca de 12 minutos que entrega o que nenhum mirante de Foz entrega: a Tríplice Fronteira inteira de uma vez. Do alto você vê o encontro do rio Iguaçu com o Paraná, a mancha urbana de Foz, Puerto Iguazú do lado argentino e Ciudad del Este do paraguaio — os três países num único giro de 360 graus.",
        "As cabines são fechadas e climatizadas, o que muda o cálculo do dia: chuva e calor de 35 graus não atrapalham, ao contrário de quase todo passeio ao ar livre da cidade. O que cancela aqui é vento forte — é o único atrativo de Foz cujo plano B precisa levar isso em conta. Depois do pôr do sol a estrutura acende em cores e a roda vira parte da paisagem noturna.",
        "Foz tem uma disputa silenciosa pelo fim de tarde: Marco das Três Fronteiras, Kattamaram, Yup Star e, às sextas e sábados, a Itaipu Iluminada, todos querendo o mesmo pôr do sol. A boa notícia é que os dois principais se cobrem — a Yup Star fecha às quartas e o Marco fecha às segundas. Numa segunda-feira, a roda é a resposta; numa quarta, o Marco. Nos outros dias, a escolha é sua.",
        "E dá para não escolher. Como a volta dura poucos minutos, cabe subir no fim da tarde e seguir para jantar no Marco, que serve até 22h — os dois ficam na mesma região sul da cidade. Reserve cerca de uma hora no total, contando fila. No começo da tarde a fila é bem menor, mas a luz não compensa.",
      ],
      highlights: [
        "88 metros de altura",
        "Vista 360° dos três países",
        "Cabines climatizadas",
        "Iluminação noturna",
      ],
      info: [
        { label: "Onde fica", value: "R. Quixadá, 127 — região sul de Foz" },
        { label: "Horário", value: "12h30 às 20h30 · fecha às quartas" },
        {
          label: "Tempo sugerido",
          value: "Cerca de 1 hora com fila; a volta em si leva ~12 minutos",
        },
        {
          label: "Dica",
          value:
            "Fecha quarta e o Marco das Três Fronteiras fecha segunda — um cobre o dia do outro.",
        },
      ],
    },
    "macuco-safari": {
      tagline:
        "Três etapas dentro do Parque Nacional: 2 km de selva, 600 m de trilha e o barco nas quedas.",
      description: [
        "O Macuco Safari é um passeio de três etapas dentro do Parque Nacional do Iguaçu, e o barco é só a última. Começa com 2 km de selva em veículos elétricos — silenciosos, o que aumenta a chance de cruzar com bicho no caminho. Depois vêm 600 metros de trilha a pé com guia bilíngue, o trecho em que o contato com a mata é maior.",
        "A trilha termina num deck com loja, banheiros e guarda-volumes, e é ali que a coisa muda de tom: um bonde elétrico desce até o cais do rio Iguaçu, onde os botes bimotores partem em direção às quedas. São 25 a 30 minutos de navegação, e o final é entrar debaixo d'água — não uma metáfora, você sai encharcado.",
        "O passeio inteiro leva de 2 a 3 horas, e essa conta é o que decide o dia. Ele acontece no km 25 da mesma estrada que leva às Cataratas, no km 18: é o mesmo parque, mas com ingresso, agenda e tempo próprios. Somado às 3 horas da trilha dos mirantes, fecha um dia cheio — tentar encaixar o Parque das Aves ainda por cima vira maratona.",
        "A ordem importa mais do que parece: faça a trilha das Cataratas primeiro e o Macuco depois. O contrário significa percorrer os mirantes de roupa molhada. Deixe a troca de roupa no guarda-volumes do deck, leve saco impermeável para o celular e conte com a possibilidade de a navegação ser alterada — as condições do rio mandam mais que a agenda.",
      ],
      highlights: [
        "Três etapas: selva, trilha e barco",
        "25 a 30 min de navegação",
        "Veículos elétricos silenciosos",
        "Guia bilíngue na trilha",
      ],
      info: [
        {
          label: "Onde fica",
          value: "Parque Nacional do Iguaçu — BR-469, km 25",
        },
        { label: "Horário", value: "Todos os dias, 9h às 17h" },
        {
          label: "Tempo sugerido",
          value: "2 a 3 horas, das quais 25 a 30 min de navegação",
        },
        {
          label: "Dica",
          value:
            "Faça depois da trilha das Cataratas, nunca antes — senão você percorre os mirantes de roupa molhada.",
        },
      ],
    },
    "cataratas-lado-argentino": {
      tagline:
        "Três circuitos de passarela e o trem até a boca da Garganta del Diablo, 82 metros abaixo.",
      description: [
        "Se o lado brasileiro mostra a grandeza das Cataratas, o argentino faz você sentir a força delas. São três circuitos independentes dentro do Parque Nacional Iguazú, e você não está de frente para as quedas: está em cima, embaixo e dentro delas.",
        "O Circuito Superior corre por passarelas que passam sobre os saltos, com poucas escadas e a vista aberta do conjunto. O Circuito Inferior desce ao nível do rio para o ângulo frontal, com escadarias que cansam mais e o Salto Bossetti no caminho, onde o spray dá um banho de verdade. E há a Garganta del Diablo, que é outra história: um trem ecológico leva até o começo de 1 km de passarela sobre o rio, e no fim dela você está de frente para uma queda de 82 metros — o rugido chega antes da vista.",
        "A conta do dia é implacável e é o erro mais comum de quem atravessa: o parque fecha às 16h e os três circuitos pedem de 5 a 6 horas. Somando a fronteira e os 30 km desde o centro de Foz, entrar depois das 10h significa deixar circuito para trás. Sair cedo não é dica, é requisito — e documento de identificação original, RG ou passaporte, é o que a imigração vai pedir.",
        "Capa de chuva aqui não é acessório: molha muito mais do que no lado brasileiro, e o Salto Bossetti garante isso mesmo em dia de sol. Se você vai fazer o Gran Aventura, o bote que sai dentro deste parque, leve roupa de banho. E a recomendação que resolve a dúvida de todo mundo: faça os dois lados em dias consecutivos, o brasileiro primeiro pelo panorama, o argentino depois pela imersão.",
      ],
      highlights: [
        "Circuitos Superior e Inferior",
        "Garganta del Diablo de 82 m",
        "Trem ecológico + 1 km de passarela",
        "Salto Bossetti",
      ],
      info: [
        {
          label: "Onde fica",
          value:
            "Ruta 101, km 142 — 17 km de Puerto Iguazú, ~30 km do centro de Foz",
        },
        { label: "Horário", value: "Todos os dias, 8h às 16h" },
        {
          label: "Tempo sugerido",
          value:
            "5 a 6 horas no parque; dia inteiro com fronteira e deslocamento",
        },
        {
          label: "Dica",
          value:
            "Fecha às 16h e os circuitos pedem 5 a 6 horas: entrar depois das 10h é abrir mão de um deles.",
        },
      ],
    },
    "templo-budista-foz": {
      tagline:
        "120 estátuas, três Budas e uma vista que alcança o Paraguai — de entrada franca.",
      description: [
        "O Chen Tien foi construído em 1996 pelas comunidades chinesas da Tríplice Fronteira, e a escala surpreende quem chega sem expectativa: cerca de 120 estátuas espalhadas pelo terreno, cada uma representando uma reencarnação de Buda, e um templo principal de mais de dois mil metros quadrados em dois andares, onde fica a Casa do Mestre.",
        "São três Budas centrais, e eles contam coisas diferentes. O Mi La Pu-San sentado, réplica em concreto de sete metros, é o mais fotografado. O Shakyamuni deitado representa o alcance do Parinirvana. E o Amitaba, em bronze, é o mais alto na hierarquia de iluminação representada ali. Some a isso a Kuan Yin, deusa da compaixão, os pagodes, os jardins e uma vista do alto que alcança Foz e Ciudad del Este do outro lado da fronteira.",
        "A visita é curta — 30 a 40 minutos bastam, uma hora se você parar nos jardins — e a entrada é franca, o que faz dele um dos poucos atrativos de Foz sem bilheteria. Mas a agenda exige atenção: abre de terça a domingo, das 9h30 às 16h30, e fecha no primeiro domingo de cada mês. É a única regra desse tipo em Foz, e pega desprevenido quem só confere o dia da semana.",
        "Fica no corredor oeste, o mesmo de Itaipu, do Refúgio Biológico e do Ecomuseu, e é o encaixe natural para o buraco de meia hora que sobra num dia dedicado à usina. Lembre que é espaço religioso em funcionamento: silêncio, roupa discreta e nada de pose irreverente ao lado das estátuas. Leve repelente — o terreno é arborizado e tem mosquito.",
      ],
      highlights: [
        "Cerca de 120 estátuas",
        "Buda de 7 metros",
        "Vista até Ciudad del Este",
        "Entrada franca",
      ],
      info: [
        {
          label: "Onde fica",
          value: "R. Dr. Josivalter Vila Nova, 99 — Jardim Califórnia",
        },
        {
          label: "Horário",
          value: "Ter a dom, 9h30 às 16h30 · fecha no primeiro domingo do mês",
        },
        {
          label: "Tempo sugerido",
          value: "30 a 40 minutos; até 1 hora com os jardins",
        },
        {
          label: "Dica",
          value:
            "Entrada franca, mas espaço religioso em funcionamento: silêncio, roupa discreta e repelente.",
        },
      ],
    },
    "mesquita-omar-ibn-al-khattab": {
      tagline:
        "Cúpula de maior vão livre da América Latina e minaretes de 31 metros, no bairro árabe de Foz.",
      description: [
        "A Mesquita Omar Ibn Al-Khattab fica num bairro que concentra uma das maiores comunidades de imigrantes árabes e descendentes do mundo — e isso explica a escala do prédio. As obras começaram em 1983 e terminaram em 1987, num projeto audacioso para a época: arquitetura islâmica com o maior vão livre de cúpula em concreto armado da América Latina.",
        "A base é octogonal, cercada por arcos, e o salão comporta até 580 pessoas. Por dentro, as paredes são cobertas de arabescos e motivos religiosos, num nível de detalhe que a fachada não antecipa. Por fora, dois minaretes de 31 metros marcam a paisagem do bairro e, cinco vezes ao dia, é deles que sai o chamado para a oração — se a sua visita coincidir com um deles, essa é a lembrança que fica.",
        "A agenda é a parte que exige atenção, porque não segue o padrão de nenhum outro atrativo da cidade: não abre aos domingos, na segunda só recebe à tarde (14h às 17h30) e de terça a sábado funciona em duas janelas, das 8h30 às 11h30 e das 14h às 17h30. O intervalo do meio-dia derruba quem chega na hora do almoço achando que é atrativo de porta aberta.",
        "A visita leva de 45 minutos a uma hora e fica no eixo urbano de Foz, longe do corredor das Cataratas. Encaixa bem num período de cidade, junto com o Centro, as compras ou um almoço árabe — a mesma comunidade que ergueu a mesquita é a que sustenta a cena de shawarma da cidade. É espaço religioso ativo: traje recatado, com ombros e pernas cobertos, é condição de entrada, não sugestão.",
      ],
      highlights: [
        "Maior vão livre de cúpula da América Latina",
        "Minaretes de 31 metros",
        "Salão para 580 pessoas",
        "Arabescos no interior",
      ],
      info: [
        {
          label: "Onde fica",
          value: "Rua Meca, 599 — Jardim Central, eixo urbano de Foz",
        },
        {
          label: "Horário",
          value:
            "Seg, 14h às 17h30 · Ter a sáb, 8h30 às 11h30 e 14h às 17h30 · fecha aos domingos",
        },
        { label: "Tempo sugerido", value: "45 minutos a 1 hora" },
        {
          label: "Dica",
          value:
            "Fecha no meio do dia e não abre domingo. Traje recatado, com ombros e pernas cobertos, é condição de entrada.",
        },
      ],
    },
    "saltos-del-monday": {
      tagline:
        "Três quedas de 45 metros e um elevador panorâmico, a 10 km da Ponte da Amizade.",
      description: [
        "São três quedas formadas pelo rio Monday, afluente do Paraná, com cerca de 45 metros de altura e 120 de largura, cercadas por mata fechada. A comparação com as Cataratas é inevitável e não faz justiça a nenhum dos dois: aqui não há a escala de 275 quedas, mas também não há multidão — você chega perto da água num parque que cabe numa tarde.",
        "O recurso que muda a visita é o elevador panorâmico, que desce da parte alta até a base da queda principal, com a vista acompanhando o trajeto inteiro. Além dele há trilhas leves, mirantes, tirolesa e uma área de arvorismo pensada para crianças. A estrutura é simples mas completa: banheiros, lanchonete e restaurante.",
        "Um erro comum de localização: o parque não fica em Ciudad del Este, e sim em Presidente Franco, cidade vizinha — a cerca de 10 km da Ponte da Amizade. Isso o torna acessível para quem está hospedado em Foz, mas exige atravessar a fronteira, com documento de identidade recente ou passaporte. Menor de 18 anos desacompanhado dos pais precisa de autorização internacional com firma reconhecida em cartório, e das vias originais.",
        "E aqui está o encaixe que quase ninguém aproveita: o parque abre todos os dias das 8h às 19h, enquanto o comércio de Ciudad del Este fecha por volta das 16h. Ou seja, o dia do Paraguai não precisa escolher — compras pela manhã, quando as lojas estão abertas, e Monday no fim da tarde, quando o comércio já fechou e o parque ainda tem três horas de sol. Em época de chuva o volume de água aumenta e as quedas ficam mais impressionantes.",
      ],
      highlights: [
        "Três quedas de 45 metros",
        "Elevador panorâmico",
        "Tirolesa e arvorismo",
        "Aberto até 19h",
      ],
      info: [
        {
          label: "Onde fica",
          value:
            "Parque Municipal Monday, Presidente Franco — 10 km da Ponte da Amizade",
        },
        { label: "Horário", value: "Todos os dias, 8h às 19h" },
        {
          label: "Tempo sugerido",
          value: "2 a 3 horas no parque, além do deslocamento",
        },
        {
          label: "Dica",
          value:
            "Fecha às 19h, três horas depois do comércio de CDE — dá para fazer compras de manhã e o parque no fim da tarde.",
        },
      ],
    },
    "by-night-argentina-puerto-iguazu": {
      tagline:
        "Duty Free shop, bar de gelo, feirinha e cassino — a noite argentina em quatro paradas.",
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
      info: [
        {
          label: "Onde fica",
          value:
            "Puerto Iguazú — Duty Free e cassino na Ruta 12, feirinha na Av. Brasil",
        },
        {
          label: "Quando acontece",
          value:
            "Programa noturno: as paradas funcionam do fim da tarde à noite",
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
    },
    "kattamaram-foz": {
      tagline:
        "O Encontro das Águas, o Marco e as três pontes vistos da água, com buffet a bordo.",
      description: [
        "O Kattamaram II navega pelos rios Iguaçu e Paraná e passa pelos pontos que desenham a Tríplice Fronteira: a Ponte da Fraternidade, o Encontro das Águas, o Marco das Três Fronteiras, as obras da Ponte da Integração e a Ponte da Amizade. Um guia acompanha o trajeto contando o que cada estrutura significa na relação entre os três países.",
        "A diferença em relação a tudo que existe em terra é a perspectiva. O Encontro das Águas e o Marco são exatamente o que se vê do mirante do Marco das Três Fronteiras — só que aqui você está do outro lado, dentro do rio, olhando a cidade de volta. Quem já fez o Marco encontra a mesma paisagem invertida; quem não fez, resolve as duas coisas de uma vez.",
        "Há buffet a bordo, e é isso que muda a conta do dia: o passeio não se soma a uma refeição, ele é a refeição. Existem duas saídas com propostas distintas — a de almoço, que ocupa o meio do dia, e a de pôr do sol com jantar, que fecha a tarde com o sol descendo no horizonte paraguaio. Música ambiente acompanha as duas.",
        "Essa dupla grade é o trunfo logístico do Kattamaram. Foz tem quatro atrativos disputando o fim de tarde — Marco, Yup Star, Itaipu Iluminada às sextas e sábados, e este —, e ele é o único que também existe no horário do almoço. Se o seu fim de tarde já está ocupado, a versão diurna resolve sem tirar nada do roteiro.",
      ],
      highlights: [
        "Encontro das Águas",
        "Três pontes da fronteira",
        "Buffet a bordo",
        "Saída de almoço ou pôr do sol",
      ],
      info: [
        {
          label: "Onde fica",
          value:
            "Av. General Meira, 1351 — Porto de Extração de Areia, na antiga travessia da balsa para a Argentina",
        },
        {
          label: "Saídas",
          value: "Duas modalidades: almoço a bordo e pôr do sol com jantar",
        },
        { label: "Tempo sugerido", value: "2 a 3 horas, incluindo embarque" },
        {
          label: "Dica",
          value:
            "É o único passeio de fim de tarde de Foz que também tem versão diurna — resolve quando a noite já está ocupada.",
        },
      ],
    },
    "wonder-park-foz": {
      tagline:
        "Quatro atrações a 950 metros das Cataratas — e duas delas só começam às 20h.",
      description: [
        "O Wonder Park fica no km 20 da Rodovia das Cataratas, a menos de 950 metros da entrada do Parque Nacional, e reúne quatro atrações independentes. O Movie Cars expõe 50 veículos icônicos do cinema, da televisão, dos desenhos e da música em 20 cenários de Hollywood. A Bonnie's Burger é uma hamburgueria temática dos anos 50, com decoração retrô e a proposta de ser tão fotografada quanto comida.",
        "As outras duas só existem depois que escurece. O Show de Águas acontece no lago do complexo, com jatos, luz e projeções de sucessos do cinema. O Lumina Park é uma trilha noturna pela mata, onde a floresta é iluminada e sonorizada — caminhada e tecnologia no mesmo percurso, sem a adrenalina de um parque de aventura.",
        "E é justamente o relógio que define como usar este endereço. O Movie Cars e a Bonnie's Burger abrem às 11h e vão até as 23h; o Show de Águas e o Lumina Park começam ambos às 20h. Isso significa duas coisas: existe programa aqui desde o meio-dia, e as duas atrações noturnas partem no mesmo horário — vale confirmar a grade de sessões antes de contar com as duas na mesma noite.",
        "A localização faz o resto do trabalho. Você passa em frente ao voltar das Cataratas, que fecham às 16h, e a lacuna entre o fim do parque e o começo dos shows se resolve com jantar na própria Bonnie's. Junto com o Dreams Park Show, no km 8 da mesma avenida, é o que Foz tem para oferecer depois que a natureza fecha as portas.",
      ],
      highlights: [
        "50 carros de cinema no Movie Cars",
        "Show de Águas com projeções",
        "Lumina Park, trilha noturna",
        "Aberto até 23h",
      ],
      info: [
        {
          label: "Onde fica",
          value:
            "BR-469, km 20 — a menos de 950 m da entrada do Parque Nacional",
        },
        {
          label: "Horário",
          value:
            "Movie Cars e Bonnie's Burger, 11h às 23h · Show de Águas e Lumina Park, início às 20h",
        },
        {
          label: "Tempo sugerido",
          value: "2 a 4 horas, conforme quantas atrações você escolher",
        },
        {
          label: "Dica",
          value:
            "As duas atrações noturnas começam no mesmo horário — confirme a grade de sessões antes de contar com as duas.",
        },
      ],
    },
    "helisul-experience-helicoptero-cataratas": {
      tagline:
        "Dez minutos no ar e o único ângulo das Cataratas que o chão não entrega.",
      description: [
        "Do chão você vê as Cataratas de frente; do ar você vê a forma delas. O sobrevoo mostra a ferradura inteira de uma vez, a Garganta do Diabo vista de cima e o desenho do rio Iguaçu se abrindo em dezenas de braços antes de despencar — geografia que nenhuma passarela consegue explicar.",
        "A Helisul opera esses voos desde 1972 e já levou mais de cinco milhões de passageiros, o que faz dela uma das operações aéreas turísticas mais antigas do país. Os voos acontecem todos os dias, das 9h às 16h30 — a mesma janela do Parque Nacional, o que não é coincidência: o sobrevoo é pensado para acontecer dentro do dia das Cataratas.",
        "E aqui vai a expectativa que precisa ser ajustada: o voo dura cerca de 10 minutos. O programa inteiro, com deslocamento, check-in, pesagem e briefing de segurança, ocupa de 1 a 2 horas. É a maior diferença entre tempo comprometido e tempo de experiência de qualquer atrativo de Foz — e ainda assim quem faz raramente se arrepende.",
        "Por ser curto, é o encaixe que cabe quando o dia já está cheio: some às 3 horas da trilha das Cataratas e ainda sobra tarde. O que não cabe é somar Macuco Safari no mesmo dia — aí o dia estoura. Voo depende de clima e de teto de nuvens, então nunca deve ser o compromisso inadiável da agenda: se cancelar, você quer que o resto do dia continue de pé.",
      ],
      highlights: [
        "Voo de 10 minutos",
        "Ferradura inteira de uma vez",
        "Operação desde 1972",
        "Mesmo corredor das Cataratas",
      ],
      info: [
        {
          label: "Onde fica",
          value:
            "Av. das Cataratas, 11130 — em frente à entrada do Parque Nacional, no km 16,5",
        },
        { label: "Horário", value: "Todos os dias, 9h às 16h30" },
        {
          label: "Tempo sugerido",
          value: "1 a 2 horas no total; o voo em si dura 10 minutos",
        },
        {
          label: "Dica",
          value:
            "Depende de clima e teto de nuvens — não deixe o voo como compromisso inadiável do dia.",
        },
      ],
    },
    "eco-park-foz": {
      tagline:
        "Falcoaria, cavalo crioulo e mini fazenda, com dois shows em horário marcado.",
      description: [
        "O Dreams Eco Park é, antes de tudo, um centro de acolhimento e recondicionamento de animais — sobretudo aves de rapina. É esse trabalho que sustenta a atração principal: a falcoaria, arte milenar de treinar aves de caça, apresentada no Voo Livre das Aves. Ver um gavião ou uma coruja partir do braço do falcoeiro e voltar é uma cena que nenhum viveiro entrega.",
        "O segundo eixo é o cavalo crioulo, raça que carrega a tradição pastoril do sul, apresentada no show Crioulo: o Cavalo de Ouro. E há a Mini Fazenda, onde ficam os demais animais abrigados e onde a visita vira contato direto — a parte que mais funciona com criança pequena.",
        "Aqui o relógio decide tudo, e é o detalhe que a maioria descobre tarde demais. O parque abre em duas janelas, das 9h às 12h30 e das 14h30 às 18h, e os dois shows têm horário fixo: o Cavalo de Ouro às 10h e às 15h30, o Voo Livre das Aves às 10h30 e às 16h. Repare que eles ficam a 30 minutos um do outro em cada turno — quem chega às 10h ou às 15h30 vê os dois; quem chega às 11h ou às 17h não vê nenhum e conhece só a Mini Fazenda.",
        "Fica na Av. das Cataratas, 8100, o mesmo endereço do Dreams Park Show, o que torna a dupla natural em roteiros de 4 ou mais dias. E não confunda com o Parque das Aves: lá são viveiros imersivos de aves da Mata Atlântica ao lado do Parque Nacional; aqui a proposta é falcoaria, cavalos e fazenda, com show em horário marcado. São experiências diferentes com animais — não uma substituta da outra.",
      ],
      highlights: [
        "Voo Livre das Aves",
        "Show do cavalo crioulo",
        "Falcoaria e aves de rapina",
        "Mini Fazenda",
      ],
      info: [
        {
          label: "Onde fica",
          value: "Av. das Cataratas, 8100 — mesmo endereço do Dreams Park Show",
        },
        {
          label: "Horário",
          value: "Todos os dias, 9h às 12h30 e 14h30 às 18h",
        },
        {
          label: "Shows",
          value:
            "Cavalo de Ouro às 10h e 15h30 · Voo Livre das Aves às 10h30 e 16h",
        },
        {
          label: "Dica",
          value:
            "Chegue às 10h ou às 15h30 para pegar os dois shows — quem chega às 11h ou 17h não vê nenhum.",
        },
      ],
    },
    "ecomuseu-itaipu": {
      tagline:
        "Uma hora de exposições sobre a Mata Atlântica e o Lago de Itaipu, de entrada franca.",
      description: [
        "O Ecomuseu conta a região trinacional por três caminhos diferentes, em quatro paradas e cerca de uma hora. A Ciência na Esfera usa tecnologia imersiva para explicar o planeta e seus fenômenos numa projeção esférica. O Território Ilustrado reúne 25 aquarelas da flora regional, de Thaís Regina Marcon, com o nível de detalhe que só a ilustração botânica alcança. E o Território Revelado traz as fotografias de Edino Krug sobre as paisagens do Lago de Itaipu e da região lindeira.",
        "É a contraparte da barragem: onde a visita à usina mostra a engenharia, aqui aparece o que veio antes e o que ficou depois — a Mata Atlântica, o lago formado pelo reservatório e a vida da região que a obra transformou. Livre para todas as idades, e uma hora resolve.",
        "A entrada é franca e não exige reserva, mas há três exigências que pegam gente desprevenida: documento de identificação com foto oficial, cadastro de visitação num formulário preenchido na recepção, e o fato de o atendimento ser feito somente em português. Há estacionamento para carros e motos.",
        "A agenda é o ponto crítico do corredor. O Ecomuseu abre de quarta a segunda, das 8h30 às 16h — ou seja, fecha às terças, exatamente como o Refúgio Biológico Bela Vista. Quem reservar a terça-feira para o eixo de Itaipu perde os dois de uma vez e fica só com as visitas à barragem, que funcionam todos os dias.",
      ],
      highlights: [
        "Ciência na Esfera",
        "25 aquarelas da flora regional",
        "Fotografia do Lago de Itaipu",
        "Entrada franca",
      ],
      info: [
        {
          label: "Onde fica",
          value: "Complexo Turístico de Itaipu — Av. Tancredo Neves",
        },
        { label: "Horário", value: "Qua a seg, 8h30 às 16h · fecha às terças" },
        { label: "Tempo sugerido", value: "Cerca de 1 hora, em 4 paradas" },
        {
          label: "Dica",
          value:
            "Entrada franca, mas exige documento com foto e cadastro na recepção. Atendimento somente em português.",
        },
      ],
    },
    "aguaray-eco-esportes": {
      tagline:
        "4,5 km de trilha, 2 km de remada e banho em duas cachoeiras do Rio Tamanduá.",
      description: [
        "A Expedição Iguaçu é um percurso encadeado, não uma atividade solta. Começa a pé pela Trilha Ecológica do Índio até a base de canoagem, na margem do rio Iguaçu, com a caminhada acompanhada de leitura da Mata Atlântica, do bioma e da cultura local. Na base vêm as instruções e os equipamentos de segurança, fornecidos pelo próprio atrativo.",
        "Aí você embarca. A remada segue rumo ao rio Tamanduá, num trecho leve e sem corredeira, e termina num desembarque para outra trilha, agora até a Cachoeira da Toca — onde a parada é para tomar banho, não para fotografar de longe. A volta é de caiaque, com a Cachoeira do Juruvá aparecendo no fim do percurso antes da trilha de retorno.",
        "São 4,5 km de caminhada e 2 km de remada, em cerca de três horas e meia de dificuldade moderada. Duas saídas por dia, às 9h e às 14h30, de terça a domingo — fecha às segundas. Idade mínima de 10 anos, e menores de 18 precisam de autorização dos pais.",
        "Duas coisas separam este passeio de todo o resto do catálogo. A primeira é que o transporte até o local não está incluído: fica em Remanso Grande, fora do corredor turístico, e chegar é por sua conta. A segunda é que a estrutura é deliberadamente simples — banheiro ecológico, sem venda de comida ou bebida. Leve água, repelente, protetor, roupa e calçado extras para trocar no fim, e calçado fechado que possa molhar. Chinelo e sandália não entram.",
      ],
      highlights: [
        "4,5 km de trilha e 2 km de remada",
        "Banho na Cachoeira da Toca",
        "Equipamento de segurança incluso",
        "Saídas às 9h e 14h30",
      ],
      info: [
        {
          label: "Onde fica",
          value: "Alameda Caeté, Remanso Grande — fora do corredor turístico",
        },
        {
          label: "Horário",
          value: "Ter a dom, saídas às 9h e às 14h30 · fecha às segundas",
        },
        {
          label: "Tempo sugerido",
          value: "Cerca de 3h30, com 4,5 km de trilha e 2 km de remada",
        },
        {
          label: "Dica",
          value:
            "O transporte até o local não está incluído, e não há venda de comida nem bebida. Leve água.",
        },
      ],
    },
    "gran-aventura": {
      tagline:
        "6 km pelo Sendero Yacaratiá até o Puerto Macuco, e daí de bote até a base das quedas.",
      description: [
        "O Gran Aventura acontece dentro do Parque Nacional Iguazú e começa longe da água: um transporte percorre 6 quilômetros pelo Sendero Yacaratiá, trecho de floresta subtropical fechada, até o Puerto Macuco. É ali que você veste o colete e embarca — e é dali que o bote desce em direção à parte de baixo das quedas.",
        "A promessa é simples e cumprida: um banho de cachoeira. O bote entra na zona de respingo, passa pela Isla Martín e mostra o conjunto de um ângulo que as passarelas do parque não alcançam, porque elas olham de cima e daqui você olha para cima. Quem faz as passarelas vê a escala; quem faz o bote sente o peso da água.",
        "Ele não está incluído na entrada do parque — é ingresso à parte, embora existam combinados que juntam os dois. E depende do mesmo trem panorâmico que serve o resto do parque: da Estação Central saem os vagões para a Estação Cataratas e para a Garganta do Diabo, e o percurso até o porto se encaixa nesse fluxo.",
        "É aqui que a conta do dia argentino aperta de vez. O parque fecha às 16h, os três circuitos já pedem de 5 a 6 horas, e o Gran Aventura acrescenta o seu próprio tempo. Somando a fronteira e a hora de trajeto desde Foz, quem quer barco e passarelas no mesmo dia precisa entrar na abertura — não há versão relaxada dessa combinação.",
      ],
      highlights: [
        "6 km pelo Sendero Yacaratiá",
        "Embarque no Puerto Macuco",
        "Passagem pela Isla Martín",
        "Banho na base das quedas",
      ],
      info: [
        {
          label: "Onde fica",
          value: "Dentro do Parque Nacional Iguazú — Ruta 101, km 142",
        },
        {
          label: "Como chega",
          value:
            "Trem panorâmico + 6 km pelo Sendero Yacaratiá até o Puerto Macuco",
        },
        {
          label: "Tempo sugerido",
          value: "2 a 3 horas, além dos circuitos de passarela",
        },
        {
          label: "Dica",
          value:
            "Some ao dia argentino, que já pede 5 a 6 horas e fecha às 16h — só cabe entrando na abertura.",
        },
      ],
    },
    "madero-tango-iguazu": {
      tagline:
        "1h30 de tango no Cassino Iguazú, com sessões às 20h30 e 22h30 — e aula no fim.",
      description: [
        "São cerca de 1h30 de espetáculo, com dançarinos e músicos ao vivo contando a história do tango — que nasceu no fim do século XIX nas margens do Rio da Prata, em Buenos Aires. O show não é só contemplação: termina com uma aula rápida em que a plateia é chamada a dançar. É a parte de que as pessoas mais falam depois.",
        "Existem dois formatos, e a diferença importa na hora de escolher. O de jantar traz o espetáculo acompanhado de menu completo, com bebidas cobradas à parte. O de show reúne as modalidades Executivo e VIP, em que a única distinção é a posição do assento no salão — e aí a refeição não está incluída. Vale confirmar qual você está comprando.",
        "O espetáculo acontece no complexo do Cassino Iguazú, na Ruta Nacional 12, km 1640, bem perto da aduana da fronteira. São duas sessões, às 20h30 e às 22h30, de terça a domingo. Essa segunda sessão é o detalhe que muda o planejamento: ela permite que o tango entre depois de outro programa da noite, mas empurra a volta a Foz para depois da meia-noite.",
        "É o mesmo endereço em que termina o circuito by night de Puerto Iguazú — o cassino é a última parada dele. Quem quiser emendar os dois consegue, aproveitando a sessão das 22h30, mas prepare-se para uma noite longa e uma travessia de fronteira tarde. Quem prefere uma coisa só faz o tango às 20h30 e volta com folga.",
      ],
      highlights: [
        "1h30 de espetáculo ao vivo",
        "Aula de tango no final",
        "Sessões às 20h30 e 22h30",
        "No complexo do Cassino Iguazú",
      ],
      info: [
        {
          label: "Onde fica",
          value: "Cassino Iguazú — Ruta Nacional 12, km 1640, perto da aduana",
        },
        {
          label: "Sessões",
          value: "Ter a dom, às 20h30 e às 22h30 · fecha às segundas",
        },
        {
          label: "Tempo sugerido",
          value: "1h30 de espetáculo; 3 a 5 horas com deslocamento e fronteira",
        },
        {
          label: "Dica",
          value:
            "A sessão das 22h30 permite emendar com outro programa, mas joga a volta a Foz para depois da meia-noite.",
        },
      ],
    },
    "blue-park-foz": {
      tagline:
        "Piscina de ondas de 1,20 m, rio lento e um toboágua de 18 metros a 60 km/h.",
      description: [
        "O Blue Park é o parque aquático de Foz do Iguaçu: 62 mil metros quadrados na Avenida das Cataratas, com estrutura nova, paisagismo em dia e os mascotes — onça, tucano, quati — espalhados pelos passeios.",
        "A atração central é a praia de ondas: uma piscina ampla com nove tipos de onda, que chegam a 1,20 metro, cercada por faixa de areia e espreguiçadeiras. Ao lado dela ficam o rio lento, para descer de boia sem esforço, e os toboáguas — quatro pistas de mais de 100 metros no Fast Falls, e o Super Maverick, de 18 metros de altura, que alterna trechos abertos e fechados e chega a 60 km/h na descida. Para os menores há o Kids Town, com balde d'água e tobogãs, e uma área baby pensada para bebês de 6 meses a 2 anos.",
        "Duas experiências ficam fora do ingresso comum e são contratadas à parte: o wakeboard no lago e a tirolesa de 300 metros de extensão por 30 de altura, que cruza o parque por cima. Há lanchonetes espalhadas pela área e um bar dentro da piscina.",
        "Um ponto que costuma gerar expectativa errada: a água vem do Aquífero Guarani e fica em torno de 28 °C na superfície. É temperatura agradável no calor de Foz, mas não é termas — em dia frio de inverno o parque rende bem menos. Fica junto ao Mabu Thermas Grand Resort e está incluso na diária de quem se hospeda ali, mas o acesso não é exclusivo de hóspede: existe day use para visitantes.",
      ],
      highlights: [
        "Praia com ondas de até 1,20 m",
        "Super Maverick, 18 m a 60 km/h",
        "Rio lento e Kids Town",
        "Água a 28 °C do Aquífero Guarani",
      ],
      info: [
        {
          label: "Onde fica",
          value:
            "Rua Carlos Hugo Urnau, 756 — junto ao Mabu Thermas, na Av. das Cataratas",
        },
        {
          label: "Temperatura da água",
          value: "Cerca de 28 °C na superfície, do Aquífero Guarani",
        },
        { label: "Tempo sugerido", value: "Meio dia a 1 dia" },
        {
          label: "Dica",
          value:
            "Wakeboard e tirolesa são contratados à parte do ingresso comum.",
        },
      ],
    },
    "iguassu-secret-falls": {
      tagline:
        "De 2 horas a um dia inteiro: até 10 cachoeiras escondidas em trilhas guiadas de Foz.",
      description: [
        "As cachoeiras existem, são muitas e quase ninguém sabe delas — porque estão em trilhas e rios espalhados pela região, longe do circuito de mirantes do Parque Nacional. A proposta aqui é chegar até elas com guia e entrar na água: o banho é o ponto do passeio, não uma parada para foto.",
        "O que diferencia este atrativo é a escala de opções. A trilha única leva a duas cachoeiras em duas horas, com dois horários de saída — é a única forma de conhecer uma cachoeira secreta sem sacrificar um dia. O meio período aumenta o número de quedas, e a versão de dia inteiro percorre quatro trilhas e dez cachoeiras, das 8h30 às 18h.",
        "Há ainda as expedições longas, de oito horas cada. A Tamanduá cobre 3,5 km de mata e várias quedas boas para nadar e pular. A Carimã percorre 3 km até as nascentes do Rio Ouro Verde, passa pelo Horto Municipal e termina em três cachoeiras do Rio Carimã. E existe o Luau Secret Falls, de seis horas, que troca o dia pela noite: trilha noturna, mergulho no rio Iguaçu, piquenique, fogueira e música ao vivo.",
        "Tudo funciona por agendamento prévio — não é atrativo de chegar e entrar. O ponto de encontro fica na Rua Manêncio Martins, 21, na Vila Yolanda, junto à área do Camping Internacional, e de lá o grupo se desloca para as trilhas. Leve calçado fechado de trilha, roupa que possa molhar, roupa de banho e proteção impermeável para o celular.",
      ],
      highlights: [
        "Até 10 cachoeiras num dia",
        "Trilha única de 2 horas",
        "Luau com trilha noturna",
        "Expedições Tamanduá e Carimã",
      ],
      info: [
        {
          label: "Ponto de encontro",
          value:
            "R. Manêncio Martins, 21, Vila Yolanda — junto ao Camping Internacional",
        },
        {
          label: "Modalidades",
          value:
            "Trilha única 2h · meio período · dia todo (8h30–18h) · Luau 6h · expedições 8h",
        },
        {
          label: "Ritmo",
          value: "Aventura & Natureza — leve a moderado, conforme a opção",
        },
        {
          label: "Dica",
          value:
            "Só por agendamento prévio. O endereço é o ponto de encontro; as trilhas ficam em outros pontos da região.",
        },
      ],
    },
    "la-aripuca": {
      tagline:
        "Uma armadilha guarani em escala gigante, erguida com madeira nativa recuperada.",
      description: [
        "A aripuca é uma armadilha de caça guarani: uma estrutura de troncos que se sustenta pelo próprio peso e cai sobre a presa. Aqui ela foi construída em escala gigante, e o material é a parte que dá sentido ao lugar — madeira recuperada de espécies nativas da mata paranaense, árvores que já haviam caído ou sido derrubadas. A metáfora é explícita: a armadilha que prendia animais virou o símbolo do que aprisiona a floresta.",
        "Em volta da estrutura há trilhas interpretativas e construções ecológicas que contextualizam a mata missioneira e o saber guarani. O artesanato em madeira é feito por produtores locais, e há restaurante com comida regional, sorveteria e cafeteria dentro do parque — dá para fazer uma pausa sem sair do lugar.",
        "A visita é curta, de 30 minutos a uma hora, e vale mais pelo conteúdo do que pela extensão. Funciona bem com criança, com grupo e com quem quer entender a floresta que rodeia as Cataratas em vez de só fotografá-la.",
        "Fica na RN 12, km 4½, na mesma rodovia que liga Puerto Iguazú ao parque e à fronteira, e abre todos os dias das 9h às 18h. Como as Cataratas argentinas fecham às 16h, ela cabe na volta do parque — ou num meio período urbano, junto com o Hito Tres Fronteras e a feirinha do centro. Documento de identificação original é necessário para atravessar.",
      ],
      highlights: [
        "Armadilha guarani em escala gigante",
        "Madeira nativa recuperada",
        "Trilhas interpretativas",
        "Restaurante e artesanato local",
      ],
      info: [
        {
          label: "Onde fica",
          value:
            "RN 12, km 4½ — na estrada que liga Puerto Iguazú ao parque e à fronteira",
        },
        { label: "Horário", value: "Todos os dias, 9h às 18h" },
        { label: "Tempo sugerido", value: "30 minutos a 1 hora" },
        {
          label: "Dica",
          value:
            "Fecha às 18h e as Cataratas argentinas às 16h — cabe na volta do parque.",
        },
      ],
    },
    "compras-paraguai-ciudad-del-este": {
      tagline:
        "O polo de eletrônicos e perfumaria do outro lado da Ponte da Amizade — e ele fecha às 16h.",
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
    },
    "hito-tres-fronteras": {
      tagline:
        "O marco argentino da tríplice fronteira: ao ar livre, sem portaria e sobre a confluência dos rios.",
      description: [
        "São três marcos, um em cada país, e cada um pintado nas cores do seu: o argentino em azul e branco, o brasileiro em verde e amarelo, o paraguaio em vermelho, branco e azul. Este é o argentino, no ponto em que o rio Iguazú deságua no Paraná — do mirante você vê os outros dois do outro lado da água, e a fronteira deixa de ser uma linha no mapa para virar uma paisagem.",
        "O lugar foi requalificado e hoje é bem mais que o obelisco: passeio à beira do barranco, praça com anfiteatro, feira de artesãos e opções de comida em volta. É área pública ao ar livre, de entrada franca, e não tem catraca nem horário de visitação.",
        "É exatamente aí que ele resolve um problema do roteiro. O Marco das Três Fronteiras, do lado brasileiro, cobra entrada, só abre às 13h30 e fecha às segundas — então em uma segunda-feira o Hito é a única forma de ver a confluência dos rios. Vale também para quem chega tarde demais em qualquer dia: aqui não há bilheteria para fechar.",
        "O horário certo é o fim de tarde, e ele encadeia bem com o resto do dia argentino: as Cataratas do lado de lá fecham às 16h, La Aripuca vai até as 18h na RN 12 do caminho de volta, e o Hito recebe o pôr do sol. Se o dia for urbano, o trio clássico é Hito, a feirinha da Av. Brasil e La Aripuca em um só meio período. Documento de identificação original é necessário para atravessar a fronteira.",
      ],
      highlights: [
        "Os três marcos à vista",
        "Mirante sobre a confluência",
        "Entrada franca, ao ar livre",
        "Aberto quando o Marco brasileiro fecha",
      ],
      info: [
        {
          label: "Onde fica",
          value:
            "Av. Río Iguazú, Puerto Iguazú — confluência dos rios Iguazú e Paraná",
        },
        {
          label: "Entrada",
          value: "Área pública ao ar livre, de entrada franca",
        },
        {
          label: "Tempo sugerido",
          value: "1 a 2 horas, com o pôr do sol no meio",
        },
        {
          label: "Dica",
          value:
            "Segunda-feira é o dia dele: o Marco brasileiro fecha, e aqui não há bilheteria nem horário.",
        },
      ],
    },
    "duty-free-shop-puerto-iguazu-argentina": {
      tagline:
        "A loja franca logo depois da aduana argentina — perfumaria, bebidas e eletrônicos sem imposto.",
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
    },
  },
  en: {
    "cataratas-do-iguacu": {
      tagline:
        "275 waterfalls and the Devil's Throat seen head-on, from the Brazilian side of the park.",
      description: [
        "There are 275 waterfalls spread along the Iguaçu River canyon, and the Devil's Throat drops 80 metres of water a few steps from where you stand. The Brazilian side is the panoramic one: you see the whole set head-on, passing Salto Floriano and Salto Deodoro along the way, while the Argentine side takes you above the falls.",
        "The visit is simpler than it sounds. A shuttle bus leaves the visitor centre and drops you at the trailhead; from there it's a 1.3 km walkway down to the Devil's Throat platform — the part where everyone gets soaked, rain poncho or not. At the end, a panoramic lift climbs to Porto Canoas, where the river-facing restaurant and the obligatory stop before heading back are waiting.",
        "Three hours cover the essentials, which is exactly why the Brazilian side rarely fills a whole day on its own. It pairs well with the Bird Park in the morning — same entrance — or leaves the afternoon open for Macuco Safari and the helicopter flight. All three sit in the same corridor, so you never cross the city twice in one day.",
        "The park is preserved subtropical rainforest and a UNESCO World Heritage Site, home to endangered species such as the jaguar, the tapir and the giant armadillo, all far from the trails. What actually crosses your path are the coatis: charming, opportunistic and strictly not to be fed — they have long since learned how to open a backpack.",
      ],
      highlights: [
        "Seven Natural Wonders",
        "Devil's Throat head-on",
        "1.3 km trail with viewpoints",
        "Panoramic lift included",
      ],
      info: [
        {
          label: "Where it is",
          value: "Iguaçu National Park — BR-469, Rodovia das Cataratas",
        },
        {
          label: "Opening hours",
          value: "Mon–Fri, 9am to 4pm · Sat, Sun and holidays, 8:30am to 4pm",
        },
        {
          label: "Suggested time",
          value: "3 hours for the essentials; half a day at a slower pace",
        },
        {
          label: "Tip",
          value:
            "Go early: shorter shuttle queues and better light at the Throat. A rain poncho beats an umbrella here.",
        },
      ],
    },
    "parque-das-aves": {
      tagline:
        "Aviaries you walk right through, 500 metres from the Falls entrance.",
      description: [
        "Here you don't watch the birds through glass: you step into the aviary with them. Blue-and-yellow macaws, toucans and parrots move freely a few metres from the path, and in the parakeet aviary hundreds fly around you at once. For many visitors the highlight is the harpy eagle, one of the largest in the world, commanding the room without moving.",
        "The trail runs 1.5 km through the forest on wheelchair-accessible paving, past flamingos, owls, rheas, seriemas, a butterfly house and enclosures for caimans and snakes. Pantanal and Atlantic Forest habitats have been recreated for the species, and the Conservation Centre shows the rescue and breeding work for endangered birds — the reason the park exists, not a side note.",
        "It sits 500 metres from the National Park entrance, which makes the two the most obvious pairing of any single day here. The order has a catch: the Falls reward an early start, with shorter queues and better light, while the birds are livelier in the morning and slow down in the afternoon heat. Two hours are enough here, so you can open at 8:30am with the birds and move on to the Falls before noon — or flip it, if photographing the waterfalls comes first.",
        "It's one of the few outings in Foz that rain doesn't ruin: the canopy covers much of the trail and the birds stay put. Bring insect repellent and closed shoes, and switch the flash off — the rule protects the animals, and the photos come out better without it anyway.",
      ],
      highlights: [
        "Aviaries you walk through",
        "Harpy eagle up close",
        "Accessible 1.5 km trail",
        "500 m from the Falls",
      ],
      info: [
        {
          label: "Where it is",
          value:
            "Av. das Cataratas, km 17 — 500 m from the National Park entrance",
        },
        { label: "Opening hours", value: "Daily, 8:30am to 4:30pm" },
        {
          label: "Suggested time",
          value: "2 hours at a normal pace; 3 with kids or photo stops",
        },
        {
          label: "Tip",
          value:
            "Mornings pay off: active birds and less heat. Flash is banned — and unnecessary.",
        },
      ],
    },
    "marco-das-tres-fronteiras": {
      tagline:
        "Three countries in view, an obelisk from 1903 and the busiest sunset in Foz.",
      description: [
        "The obelisk has stood here since 1903, marking where the Iguaçu River flows into the Paraná and where three countries meet: Argentina on one side, Paraguay on the other, Brazil under your feet. Each country has its own marker painted in its national colours, and from here you see all three at once. A recent refurbishment gave the obelisk a reflecting pool and lighting, which transforms the place once it gets dark.",
        "The complex is more than a viewpoint. The Jesuit Missions stage village recreates the encounter between priests and Indigenous peoples in the 16th and 17th centuries, and the Cabeza de Vaca Memorial tells the story of the Spaniard who, in 1542, became the first European to record the existence of the Falls. Late afternoon brings the Three Borders Show, with music and dance from the cultures that share this frontier.",
        "Here the timetable rules: the site opens at 1:30pm and closes at 9pm, Tuesday to Sunday. There is no morning visit, and Mondays are out. That makes it the natural closer to a day that started at the Falls or at Itaipu, rather than a stop you slot into any gap. One to two hours are enough, and anyone wanting to carry on has the Yup Star Ferris Wheel minutes away, also a late-afternoon affair.",
        "The Cabeza de Vaca restaurant runs from 3pm to 10pm and is one of the few tables in Foz with three countries in the view. The grounds are flat and step-free throughout, so strollers and wheelchairs move without effort. Bring a light jacket: it gets windy where the rivers meet, and the temperature drops quickly once the sun is gone.",
      ],
      highlights: [
        "Three countries in view",
        "Lit 1903 obelisk",
        "Three Borders Show",
        "Sunset over the rivers",
      ],
      info: [
        {
          label: "Where it is",
          value:
            "Ac. Três Fronteiras, southern Foz — where the Iguaçu and Paraná rivers meet",
        },
        {
          label: "Opening hours",
          value: "Tue–Sun, 1:30pm to 9pm · closed Mondays",
        },
        {
          label: "Suggested time",
          value: "1 to 2 hours, with sunset in the middle",
        },
        {
          label: "Tip",
          value:
            "Arrive about an hour before sunset to claim a spot at the viewpoint. A light jacket handles the river wind.",
        },
      ],
    },
    "itaipu-binacional": {
      tagline:
        "The Itaipu Tourism complex: three different visits to the world's largest hydroelectric plant.",
      description: [
        "Itaipu is the world's largest hydroelectric plant by energy output, and was named one of the Modern Wonders of Engineering by the American Society of Civil Engineers. Built jointly by Brazilians and Paraguayans, it tamed the Paraná — the tenth largest river on the planet by water volume — and is one of the few places anywhere where you can watch machinery on this scale actually working.",
        "Itaipu Tourism isn't one visit but three, and picking the wrong one is the most common misstep. The Panoramic tour covers the outside by bus, takes about 1h30 and is the only one suited to reduced mobility. The Special tour goes inside the plant — control room, turbine shaft, the interior of the dam — in 2h30, and requires original photo ID. The Illuminated tour is at night, runs only on Fridays and Saturdays, and is pure contemplation: it replaces neither of the other two.",
        "The complex is more than the dam. The Bela Vista Biological Refuge and the Ecomuseum sit on the same axis and turn the visit into half a day or a full one, for anyone wanting nature and history alongside the engineering.",
        "Itaipu is on the opposite side of the city from the Falls corridor, so attempting both in one day is a recipe for rushing. The usual approach is to set aside a day — or a solid half — for the Itaipu axis and leave the Falls for another. And anyone with only one Friday or Saturday evening free has to choose early between the Illuminated tour and sunset at the Triple Frontier Landmark: the two compete for exactly the same slot.",
      ],
      highlights: [
        "World's largest hydro plant",
        "Three different visits",
        "Modern Wonder of Engineering",
        "Refuge and Ecomuseum on the same axis",
      ],
      info: [
        {
          label: "Where it is",
          value: "Av. Tancredo Neves, 6702 — Visitor Reception Centre",
        },
        {
          label: "Opening hours",
          value:
            "Panoramic and Special: daily from 8:30am · Illuminated: Fridays and Saturdays, 7pm",
        },
        {
          label: "Suggested time",
          value: "Panoramic 1h30 · Special 2h30 · Illuminated 2h",
        },
        {
          label: "Tip",
          value:
            "Pick your tour before leaving the hotel: these are three distinct visits, each with its own hours, rules and duration.",
        },
      ],
    },
    "refugio-biologico-bela-vista": {
      tagline:
        "The jaguar, the harpy eagle and the forest the dam put back, on a guided 1.7 km trail.",
      description: [
        "The Bela Vista Refuge was born of a debt: when the Itaipu reservoir filled, the plant had to rescue the animals that lost their territory and replant the vegetation that went under water. What began as a rescue operation became a conservation unit, a research centre and, today, the calmest outing in the complex.",
        "The guided trail runs 1.7 km and takes around two hours through forest, lakes and enclosures. This is where you see jaguars, ocelots, tapirs, macaws and harpy eagles up close — some rescued, some in rehabilitation. Those same species exist in Iguaçu National Park, but they live far from the trails: this is where they actually appear. The botanical garden holds more than 50 native tree species, several of them endangered.",
        "The logistics carry two constraints that shape the day: the Refuge closes on Tuesdays and departures run at fixed times — 8:30am, 10:30am, 2:30pm and 3:30pm. There is no turning up whenever. Since it sits inside the same complex as the dam, the natural pairing is the Itaipu Panoramic tour: its 1h30 plus 2h30 here fill a solid half day, and it's the Refuge's departure slot that decides which one comes first.",
        "It's a slow, guided, open-air visit, so closed shoes, insect repellent and water pay off. Anyone travelling with children tends to find here the counterweight a day of concrete and engineering was missing — and anyone photographing wildlife gets the opposite of the Bird Park: larger animals and far fewer people per square metre.",
      ],
      highlights: [
        "Jaguar and harpy eagle up close",
        "Guided 1.7 km trail",
        "Native botanical garden",
        "Same complex as Itaipu",
      ],
      info: [
        {
          label: "Where it is",
          value: "Itaipu Tourist Complex — Av. Tancredo Neves",
        },
        {
          label: "Opening hours",
          value:
            "Wed–Mon, departures at 8:30am, 10:30am, 2:30pm and 3:30pm · closed Tuesdays",
        },
        {
          label: "Suggested time",
          value: "2h to 2h30, including internal transport and the trail",
        },
        {
          label: "Tip",
          value:
            "Departures run on fixed slots — picking yours is what sets the day's order alongside the Itaipu Panoramic tour.",
        },
      ],
    },
    "dreams-park-show": {
      tagline:
        "A complex of attractions: dinosaurs, world wonders and a wax museum.",
      description: [
        "Dreams Park Show brings together several themed attractions in one place, like the Valley of the Dinosaurs, miniature World Wonders and a wax museum — fun guaranteed for all ages.",
        "It's a great indoor option, perfect for rainy days or to mix up your itinerary beyond nature.",
      ],
      highlights: [
        "Valley of the Dinosaurs",
        "World Wonders",
        "Great for rainy days",
      ],
      info: [
        {
          label: "Where it is",
          value: "Av. das Cataratas, 8100 — on the way to the National Park",
        },
        {
          label: "Opening hours",
          value:
            "Varies by attraction: from 9/10am until 9pm, 10pm or 11pm depending on the day",
        },
        {
          label: "Suggested time",
          value: "1 to 2 hours per attraction; 3 to 5 if you pick two or three",
        },
        {
          label: "Tip",
          value:
            "Tickets are sold per attraction, not for the complex. Choosing beforehand avoids paying for an area you won't use.",
        },
      ],
    },
    aquafoz: {
      tagline:
        "The Foz aquarium: 300 species and 3.3 million litres devoted to the Paraná and Iguaçu rivers.",
      description: [
        "AquaFoz is the Foz do Iguaçu aquarium: 23,000 m² and around 3.3 million litres of water spread across three floors. It holds more than 300 freshwater and saltwater species, and the route was designed as a path of waters — you start in the region's rivers and end in the ocean.",
        "The collection's spine is local, and that's what sets it apart from a generic aquarium: the Iguaçu River Gallery runs through the Upper, Middle and Lower Iguaçu, showing how the fauna changes along the river itself. Rock catfish, Iguaçu tetra and armoured catfish appear in the upper stretch; wolf fish, jacundá and Iguaçu mandi in the middle. These are fish from the basin that feeds the Falls — the same river, seen from the inside.",
        "Interactive panels and educational areas carry the visit, and behind it sits a conservation centre running scientific projects with universities and environmental institutions since before the doors opened. The purpose isn't only to display species: it's research and habitat protection.",
        "An hour and a half to two hours is enough, and it slots in naturally: it sits near the Iguaçu National Park entrance, on the same corridor as the Falls and the Bird Park. It's indoors and air-conditioned, which makes it one of the city's best cards on a rainy or brutally hot day. Watch the last admission at 5pm — well before closing.",
      ],
      highlights: [
        "Over 300 species",
        "3.3 million litres",
        "Iguaçu River Gallery",
        "Indoors and air-conditioned",
      ],
      info: [
        {
          label: "Where it is",
          value: "Av. das Cataratas — near the National Park entrance",
        },
        {
          label: "Opening hours",
          value: "Daily, 9am to 6:30pm · last admission 5pm",
        },
        { label: "Suggested time", value: "1h30 to 2 hours" },
        {
          label: "Tip",
          value:
            "Last admission is 5pm, not 6:30pm. Arriving after that means not getting in.",
        },
      ],
    },
    "vale-dos-dinossauros": {
      tagline:
        "30 life-size dinosaurs that move and roar, on a trail with lakes and waterfalls.",
      description: [
        "There are 30 life-size dinosaurs along a forest trail, and they move and make sound — which completely changes the reaction of anyone under ten. The largest is the Giganotosaurus, over 14 metres, a predator that lived in Patagonia and now occupies the middle of the valley.",
        "The route is outdoors, among lakes and waterfalls, and that's what separates this attraction from the others in the complex: while the Wax Museum and the Ice Bar ignore the weather, heavy rain ruins this one. It also closes earlier than its neighbours, at 7:30pm or 8:30pm depending on the day.",
        "One to two hours are plenty. On Av. das Cataratas, on the way to the National Park, it slots in naturally after a morning at the falls — and it's the Dreams Park attraction that usually decides the visit when there's a small child in the group.",
      ],
      highlights: [
        "30 life-size dinosaurs",
        "Movement and sound",
        "14-metre Giganotosaurus",
        "Trail with lakes and waterfalls",
      ],
      info: [
        {
          label: "Where it is",
          value: "Dreams Park Show — Av. das Cataratas, 8100",
        },
        {
          label: "Opening hours",
          value: "Sun–Wed, 9:30am to 7:30pm · Thu–Sat, 9:30am to 8:30pm",
        },
        { label: "Suggested time", value: "1 to 2 hours" },
        {
          label: "Tip",
          value:
            "It's an open-air trail: heavy rain costs a lot. On that kind of day the Wax Museum and the Ice Bar, right next door, work better.",
        },
      ],
    },
    "museu-de-cera": {
      tagline:
        "17 sets and over 100 figures from film, music and history, all built for photos.",
      description: [
        "There are 17 sets and more than 100 wax figures: stars of film, music, television, sport, politics and history, plus a section given over to superheroes and villains. The idea isn't to look from a distance — every set was built for you to step in, pose and leave with the photo.",
        "It's fully indoors and air-conditioned, which makes it one of Foz's most direct answers to a rainy day or a brutally hot afternoon. And it closes late: 9pm Sunday to Wednesday, 10pm Thursday to Saturday, in a city where almost everything shuts at 4pm.",
        "An hour to an hour and a half is enough. It sits inside Dreams Park Show, on Av. das Cataratas, and works well tacked onto another attraction in the complex or as an end-of-day plan, once the national park has closed and there's still energy left.",
      ],
      highlights: [
        "17 sets",
        "Over 100 figures",
        "Superheroes and villains",
        "Open until 9pm or 10pm",
      ],
      info: [
        {
          label: "Where it is",
          value: "Dreams Park Show — Av. das Cataratas, 8100",
        },
        {
          label: "Opening hours",
          value: "Sun–Wed, 9am to 9pm · Thu–Sat, 9am to 10pm",
        },
        { label: "Suggested time", value: "1 to 1h30" },
        {
          label: "Tip",
          value:
            "It closes late and it's indoors: it solves both the rainy day and the evening with nothing planned.",
        },
      ],
    },
    "dreams-ice-bar": {
      tagline:
        "A bar at 15 below zero where glass, table and wall are made of ice — in the country's hottest city.",
      description: [
        "The appeal is the contrast: Foz is one of the hottest cities in Brazil, and here you walk into a room at 15 degrees below zero where everything — glasses, benches, tables, walls and the bar itself — is made of ice. Coats and gloves are handed out at the entrance, so there's nothing to bring.",
        "The visit runs in sessions and is short by design: nobody lingers at that temperature, and that's precisely the point. It works for adults and children alike, and tends to produce the most improbable photos of any stay in Foz.",
        "It sits inside Dreams Park Show, on Av. das Cataratas, and runs latest of anything in the complex: until 10pm Sunday to Wednesday and 11pm Thursday to Saturday. Watch the last session, though — it starts well before closing time.",
      ],
      highlights: [
        "Room at −15 °C",
        "Everything made of ice",
        "Coat and gloves provided",
        "Open until 10pm or 11pm",
      ],
      info: [
        {
          label: "Where it is",
          value: "Dreams Park Show — Av. das Cataratas, 8100",
        },
        {
          label: "Opening hours",
          value:
            "Sun–Wed, 10am to 10pm (last session 9:10pm) · Thu–Sat, 10am to 11pm (last session 9:50pm)",
        },
        { label: "Suggested time", value: "30 to 45 minutes, per session" },
        {
          label: "Tip",
          value:
            "The last session starts well before closing — arriving at 10pm on a Thursday is no guarantee of getting in.",
        },
      ],
    },
    "cataratas-jl-shopping": {
      tagline: "Shopping, dining and a movie theater in the heart of Foz.",
      description: [
        "Cataratas JL Shopping is one of the main shopping centers in Foz do Iguaçu, with stores, a food court, a movie theater and services.",
        "It's a good stop to rest, eat and shop in comfort, with air conditioning.",
      ],
      highlights: ["Stores and services", "Food court", "Movie theater"],
      info: [
        {
          label: "Tip",
          value:
            "A good option for a meal and a break on the way to the Falls.",
        },
      ],
    },
    "shopping-catuai-palladium": {
      tagline: "The region's largest mall, with leisure, shopping and dining.",
      description: [
        "Catuaí Palladium is the largest mall in Foz do Iguaçu, with a wide variety of stores, restaurants, a movie theater and leisure options for the whole family.",
        "It brings everything together in one place — ideal for a full afternoon of shopping and fun.",
      ],
      highlights: [
        "Region's largest mall",
        "Leisure and movie theater",
        "Varied dining",
      ],
      info: [
        {
          label: "Tip",
          value:
            "Set aside a good chunk of time — it's big, with a lot to see.",
        },
      ],
    },
    "roda-gigante-yup-star": {
      tagline:
        "88 metres up and the whole Triple Frontier in a 12-minute turn.",
      description: [
        "It stands 88 metres tall, and a turn of roughly 12 minutes delivers what no viewpoint in Foz can: the entire Triple Frontier at once. From the top you see the Iguaçu meeting the Paraná, the sprawl of Foz, Puerto Iguazú on the Argentine side and Ciudad del Este on the Paraguayan — three countries in a single 360-degree sweep.",
        "The cabins are enclosed and air-conditioned, which changes the maths of the day: rain and 35-degree heat don't get in the way, unlike almost every open-air outing in the city. What stops it here is strong wind — the only attraction in Foz whose backup plan has to account for that. After sunset the structure lights up in colour and the wheel becomes part of the night skyline.",
        "Foz has a quiet contest over the late afternoon: the Triple Frontier Landmark, the Kattamaram, Yup Star and, on Fridays and Saturdays, the Itaipu Illuminated tour, all after the same sunset. The good news is that the two main ones cover each other — Yup Star closes on Wednesdays and the Landmark on Mondays. On a Monday, the wheel is the answer; on a Wednesday, the Landmark. Any other day, it's your call.",
        "And you don't have to choose. Since the ride is only minutes long, you can go up at sunset and head on to dinner at the Landmark, whose restaurant serves until 10pm — both sit in the same southern part of the city. Allow about an hour in total, queue included. Early afternoon has a far shorter queue, but the light doesn't repay it.",
      ],
      highlights: [
        "88 metres tall",
        "360° view of three countries",
        "Air-conditioned cabins",
        "Lit up at night",
      ],
      info: [
        { label: "Where it is", value: "R. Quixadá, 127 — southern Foz" },
        {
          label: "Opening hours",
          value: "12:30pm to 8:30pm · closed Wednesdays",
        },
        {
          label: "Suggested time",
          value: "About 1 hour with the queue; the ride itself is ~12 minutes",
        },
        {
          label: "Tip",
          value:
            "It closes on Wednesdays and the Triple Frontier Landmark on Mondays — each covers the other's day off.",
        },
      ],
    },
    "macuco-safari": {
      tagline:
        "Three stages inside the National Park: 2 km of jungle, 600 m of trail and the boat at the falls.",
      description: [
        "Macuco Safari is a three-stage outing inside Iguaçu National Park, and the boat is only the last of them. It opens with 2 km of jungle aboard electric vehicles — silent, which raises the odds of crossing paths with wildlife. Then comes a 600-metre walk with a bilingual guide, the stretch where contact with the forest is closest.",
        "The trail ends at a deck with a shop, toilets and lockers, and that's where the tone shifts: an electric tram runs down to the Iguaçu River pier, where twin-engine boats set off towards the falls. Navigation lasts 25 to 30 minutes, and the finale is going in under the water — not a metaphor, you come out drenched.",
        "The whole thing takes 2 to 3 hours, and that arithmetic is what shapes the day. It happens at km 25 of the same road that leads to the Falls at km 18: same park, but its own ticket, schedule and time. Added to the 3 hours of the viewpoints trail, it fills a full day — trying to squeeze the Bird Park in as well turns it into a march.",
        "Order matters more than it seems: do the Falls trail first and Macuco afterwards. The other way round means walking the viewpoints in wet clothes. Leave a change of clothes in the deck lockers, bring a waterproof pouch for your phone, and expect that navigation may change — the river's conditions outrank any schedule.",
      ],
      highlights: [
        "Three stages: jungle, trail and boat",
        "25 to 30 min on the water",
        "Silent electric vehicles",
        "Bilingual guide on the trail",
      ],
      info: [
        { label: "Where it is", value: "Iguaçu National Park — BR-469, km 25" },
        { label: "Opening hours", value: "Daily, 9am to 5pm" },
        {
          label: "Suggested time",
          value: "2 to 3 hours, of which 25 to 30 min on the water",
        },
        {
          label: "Tip",
          value:
            "Do it after the Falls trail, never before — otherwise you walk the viewpoints soaking wet.",
        },
      ],
    },
    "cataratas-lado-argentino": {
      tagline:
        "Three walkway circuits and the train to the mouth of the Devil's Throat, 82 metres down.",
      description: [
        "If the Brazilian side shows you the scale of the Falls, the Argentine side makes you feel their force. There are three separate circuits inside Iguazú National Park, and you aren't standing in front of the falls: you're above them, below them and inside them.",
        "The Upper Circuit runs along walkways that pass over the drops, with few stairs and an open view of the whole set. The Lower Circuit descends to river level for the frontal angle, with more tiring staircases and Salto Bossetti on the way, where the spray gives you a genuine soaking. Then there's the Devil's Throat, a different story altogether: an eco-train takes you to the start of a 1 km walkway over the river, and at the end you stand facing an 82-metre drop — the roar reaches you before the view does.",
        "The day's arithmetic is unforgiving, and it's the most common mistake people make crossing over: the park closes at 4pm and the three circuits need 5 to 6 hours. Add the border and the 30 km from central Foz, and arriving after 10am means leaving a circuit behind. Setting off early isn't a tip, it's a requirement — and original photo ID, national card or passport, is what immigration will ask for.",
        "A rain poncho here isn't optional: it soaks you far more than the Brazilian side, and Salto Bossetti guarantees that even on a sunny day. If you're doing Gran Aventura, the boat that departs inside this park, bring swimwear. And the recommendation that settles everyone's question: do both sides on consecutive days, the Brazilian first for the panorama, the Argentine after for the immersion.",
      ],
      highlights: [
        "Upper and Lower Circuits",
        "82-metre Devil's Throat",
        "Eco-train + 1 km walkway",
        "Salto Bossetti",
      ],
      info: [
        {
          label: "Where it is",
          value:
            "Ruta 101, km 142 — 17 km from Puerto Iguazú, ~30 km from central Foz",
        },
        { label: "Opening hours", value: "Daily, 8am to 4pm" },
        {
          label: "Suggested time",
          value:
            "5 to 6 hours in the park; a full day with the border and travel",
        },
        {
          label: "Tip",
          value:
            "It closes at 4pm and the circuits need 5 to 6 hours: arriving after 10am means giving one up.",
        },
      ],
    },
    "templo-budista-foz": {
      tagline:
        "120 statues, three Buddhas and a view that reaches Paraguay — with free admission.",
      description: [
        "Chen Tien was built in 1996 by the Chinese communities of the Triple Frontier, and the scale catches people off guard: around 120 statues across the grounds, each representing a reincarnation of Buddha, and a main temple of more than two thousand square metres over two floors, home to the Master's House.",
        "Three central Buddhas anchor the site, and each says something different. The seated Mi La Pu-San, a seven-metre concrete replica, is the most photographed. The reclining Shakyamuni represents the attainment of Parinirvana. And Amitabha, in bronze, stands highest in the hierarchy of enlightenment represented here. Add Kuan Yin, goddess of compassion, the pagodas, the gardens and a view from the top that takes in Foz and Ciudad del Este across the border.",
        "The visit is short — 30 to 40 minutes is enough, an hour if you linger in the gardens — and admission costs nothing, making it one of the few attractions in Foz with no ticket desk. The calendar does demand attention, though: it opens Tuesday to Sunday, 9:30am to 4:30pm, and closes on the first Sunday of every month. It's the only rule of its kind in the city, and it catches out anyone who only checks the day of the week.",
        "It sits on the western corridor, the same one as Itaipu, the Biological Refuge and the Ecomuseum, and it's the natural fit for the spare half hour left over from a day spent at the dam. Remember it's a working religious site: quiet, modest clothing and no irreverent poses beside the statues. Bring insect repellent — the grounds are wooded and there are mosquitoes.",
      ],
      highlights: [
        "Around 120 statues",
        "Seven-metre Buddha",
        "View as far as Ciudad del Este",
        "Free admission",
      ],
      info: [
        {
          label: "Where it is",
          value: "R. Dr. Josivalter Vila Nova, 99 — Jardim Califórnia",
        },
        {
          label: "Opening hours",
          value:
            "Tue–Sun, 9:30am to 4:30pm · closed the first Sunday of each month",
        },
        {
          label: "Suggested time",
          value: "30 to 40 minutes; up to an hour with the gardens",
        },
        {
          label: "Tip",
          value:
            "Admission is free, but it's a working religious site: quiet, modest clothing and repellent.",
        },
      ],
    },
    "mesquita-omar-ibn-al-khattab": {
      tagline:
        "The largest free-span dome in Latin America and 31-metre minarets, in Foz's Arab quarter.",
      description: [
        "The Omar Ibn Al-Khattab Mosque stands in a district holding one of the largest communities of Arab immigrants and their descendants anywhere in the world — which explains the scale of the building. Construction began in 1983 and finished in 1987, an audacious project for its time: Islamic architecture with the largest free-span reinforced-concrete dome in Latin America.",
        "The base is octagonal, ringed by arches, and the hall seats up to 580 people. Inside, the walls are covered in arabesques and religious motifs at a level of detail the façade never hints at. Outside, two 31-metre minarets mark the neighbourhood skyline and, five times a day, carry the call to prayer — if your visit coincides with one, that's the memory you'll keep.",
        "The timetable is the part that demands attention, because it follows no other attraction's pattern in the city: it doesn't open on Sundays, on Mondays it receives visitors only in the afternoon (2pm to 5:30pm), and Tuesday to Saturday it runs in two windows, 8:30am to 11:30am and 2pm to 5:30pm. The midday break catches out anyone who turns up at lunchtime assuming the doors stay open.",
        "The visit takes 45 minutes to an hour, and it sits on Foz's urban axis, far from the Falls corridor. It fits well into a city half-day, alongside the centre, shopping or an Arab lunch — the same community that built the mosque sustains the city's shawarma scene. It's an active place of worship: modest dress, with shoulders and legs covered, is a condition of entry, not a suggestion.",
      ],
      highlights: [
        "Largest free-span dome in Latin America",
        "31-metre minarets",
        "Hall for 580 people",
        "Arabesques inside",
      ],
      info: [
        {
          label: "Where it is",
          value: "Rua Meca, 599 — Jardim Central, Foz's urban axis",
        },
        {
          label: "Opening hours",
          value:
            "Mon, 2pm to 5:30pm · Tue–Sat, 8:30–11:30am and 2–5:30pm · closed Sundays",
        },
        { label: "Suggested time", value: "45 minutes to 1 hour" },
        {
          label: "Tip",
          value:
            "It closes at midday and doesn't open on Sundays. Modest dress, shoulders and legs covered, is a condition of entry.",
        },
      ],
    },
    "saltos-del-monday": {
      tagline:
        "Three 45-metre falls and a panoramic lift, 10 km from the Friendship Bridge.",
      description: [
        "Three waterfalls formed by the Monday River, a tributary of the Paraná, around 45 metres high and 120 wide, ringed by dense forest. The comparison with the Iguaçu Falls is inevitable and does neither any favours: there's no 275-waterfall scale here, but there's no crowd either — you get close to the water in a park that fits into an afternoon.",
        "The feature that changes the visit is the panoramic lift, descending from the upper level to the base of the main fall with the view alongside the whole way. Beyond it there are easy trails, viewpoints, a zip line and a treetop course built for children. The facilities are simple but complete: toilets, a snack bar and a restaurant.",
        "A common mix-up about the location: the park isn't in Ciudad del Este but in Presidente Franco, the neighbouring town — about 10 km from the Friendship Bridge. That puts it within easy reach of anyone staying in Foz, but it does mean crossing the border, with a recent ID document or a passport. Under-18s travelling without their parents need international authorisation notarised at a registry office, presented with the original copies.",
        "And here's the pairing almost nobody exploits: the park opens daily from 8am to 7pm, while the shops in Ciudad del Este close around 4pm. So the Paraguay day doesn't have to choose — shopping in the morning, while the stores are open, and Monday in the late afternoon, once the commerce has shut and the park still has three hours of daylight. In the rainy season the water volume rises and the falls become far more impressive.",
      ],
      highlights: [
        "Three 45-metre falls",
        "Panoramic lift",
        "Zip line and treetop course",
        "Open until 7pm",
      ],
      info: [
        {
          label: "Where it is",
          value:
            "Parque Municipal Monday, Presidente Franco — 10 km from the Friendship Bridge",
        },
        { label: "Opening hours", value: "Daily, 8am to 7pm" },
        {
          label: "Suggested time",
          value: "2 to 3 hours in the park, plus travel",
        },
        {
          label: "Tip",
          value:
            "It closes at 7pm, three hours after the shops in Ciudad del Este — shop in the morning and do the park late afternoon.",
        },
      ],
    },
    "by-night-argentina-puerto-iguazu": {
      tagline:
        "Duty free, ice bar, street market and casino — the Argentine night in four stops.",
      description: [
        "The Argentine by night is a four-stop circuit, not a dinner. It opens at the Duty Free Shop on Ruta 12, with around 40 minutes among spirits, perfumes, cosmetics and clothing free of tax up to the allowance. Next comes Puerto Iguazú's ice bar, another 40 minutes at up to ten degrees below zero, drink in hand.",
        "The third stop lasts longest and tends to be the favourite: about an hour at the street market on Av. Brasil, a meeting point for visitors and locals where the accents blend. That's where the empanadas, alfajores, cold-cut boards, stuffed olives, cheeses and wines are — with sunset setting the tone at the start of the evening. The circuit closes at the City Center casino, another 40 minutes, for anyone curious about that side of town.",
        "Adding up the stops and the driving, the programme runs 4 to 5 hours and takes the whole evening. It doesn't stack with the Itaipu Illuminated tour, which runs on the Brazilian side at the same hour — but Madero Tango is the exception: the show sits in the Casino Iguazú complex, the final stop of this circuit, and its 10:30pm session makes chaining possible. The cleanest fit is after a day at the Argentine Falls, which close at 4pm — you're already on that side, with the border crossing behind you.",
        "The crossing runs over the Tancredo Neves Bridge and requires original photo ID. Anyone who'd rather swap the casino for dinner will find parrillas and pizzerias in the centre, and some add a tango show to the evening. Do factor in immigration on the way back: the flow shifts after dinner, and the return to Foz isn't always quick.",
      ],
      highlights: [
        "Tax-free shopping up to the allowance",
        "Ice bar at −10 °C",
        "Av. Brasil street market",
        "City Center casino",
      ],
      info: [
        {
          label: "Where it is",
          value:
            "Puerto Iguazú — duty free and casino on Ruta 12, market on Av. Brasil",
        },
        {
          label: "When it runs",
          value:
            "An evening programme: the stops operate from late afternoon into the night",
        },
        {
          label: "Suggested time",
          value: "4 to 5 hours, counting the four stops and the driving",
        },
        {
          label: "Tip",
          value:
            "It takes the whole evening and ends at the same complex as Madero Tango — you can chain onto the 10:30pm session.",
        },
      ],
    },
    "kattamaram-foz": {
      tagline:
        "The Meeting of the Waters, the Landmark and the three bridges seen from the river, with a buffet aboard.",
      description: [
        "The Kattamaram II sails the Iguaçu and Paraná rivers, passing the structures that draw the Triple Frontier: the Fraternity Bridge, the Meeting of the Waters, the Triple Frontier Landmark, the works on the Integration Bridge and the Friendship Bridge. A guide narrates the route, explaining what each structure means in the relationship between the three countries.",
        "What sets it apart from anything on land is the perspective. The Meeting of the Waters and the Landmark are exactly what you see from the Landmark's viewpoint — except here you're on the other side, out on the river, looking back at the city. Anyone who has done the Landmark finds the same scene reversed; anyone who hasn't gets both at once.",
        "There's a buffet aboard, and that changes the day's arithmetic: the outing doesn't add to a meal, it is the meal. Two departures offer different propositions — the lunch sailing, which takes the middle of the day, and the sunset-with-dinner sailing, closing the afternoon with the sun dropping over the Paraguayan horizon. Live background music accompanies both.",
        "That double schedule is the Kattamaram's logistical trump card. Foz has four attractions competing for the late afternoon — the Landmark, Yup Star, the Itaipu Illuminated tour on Fridays and Saturdays, and this one — and it's the only one that also exists at lunchtime. If your evening is already spoken for, the daytime sailing solves it without taking anything out of the plan.",
      ],
      highlights: [
        "Meeting of the Waters",
        "Three border bridges",
        "Buffet aboard",
        "Lunch or sunset departure",
      ],
      info: [
        {
          label: "Where it is",
          value:
            "Av. General Meira, 1351 — the old ferry crossing to Argentina, on the Iguaçu River",
        },
        {
          label: "Departures",
          value: "Two options: lunch aboard, or sunset with dinner",
        },
        { label: "Suggested time", value: "2 to 3 hours, including boarding" },
        {
          label: "Tip",
          value:
            "It's the only late-afternoon outing in Foz that also has a daytime version — handy when the evening is taken.",
        },
      ],
    },
    "wonder-park-foz": {
      tagline:
        "Four attractions 950 metres from the Falls — and two of them only start at 8pm.",
      description: [
        "Wonder Park sits at km 20 of the Rodovia das Cataratas, less than 950 metres from the National Park entrance, and gathers four independent attractions. Movie Cars displays 50 iconic vehicles from film, television, cartoons and music across 20 Hollywood sets. Bonnie's Burger is a 1950s-themed diner, retro throughout and built to be photographed as much as eaten in.",
        "The other two only exist after dark. The Water Show runs on the complex's lake, with jets, light and projections of cinema hits. Lumina Park is a night trail through the forest, lit and scored along the way — walking and technology on the same route, without the adrenaline of an adventure park.",
        "And it's the clock that decides how to use this address. Movie Cars and Bonnie's Burger open at 11am and run to 11pm; the Water Show and Lumina Park both start at 8pm. That means two things: there's something here from midday onwards, and the two night attractions begin at the same hour — worth checking the session schedule before counting on both in one evening.",
        "The location does the rest. You drive past it coming back from the Falls, which close at 4pm, and the gap between the park closing and the shows starting is solved by dinner at Bonnie's itself. Together with Dreams Park Show at km 8 of the same avenue, it's what Foz has to offer once nature shuts its doors.",
      ],
      highlights: [
        "50 movie cars at Movie Cars",
        "Water Show with projections",
        "Lumina Park night trail",
        "Open until 11pm",
      ],
      info: [
        {
          label: "Where it is",
          value: "BR-469, km 20 — under 950 m from the National Park entrance",
        },
        {
          label: "Opening hours",
          value:
            "Movie Cars and Bonnie's Burger, 11am to 11pm · Water Show and Lumina Park, from 8pm",
        },
        {
          label: "Suggested time",
          value: "2 to 4 hours, depending on how many attractions you pick",
        },
        {
          label: "Tip",
          value:
            "Both night attractions start at the same hour — check the session schedule before counting on both.",
        },
      ],
    },
    "helisul-experience-helicoptero-cataratas": {
      tagline:
        "Ten minutes in the air and the one angle on the Falls the ground can't give you.",
      description: [
        "From the ground you see the Falls head-on; from the air you see their shape. The flight reveals the whole horseshoe at once, the Devil's Throat from above and the pattern of the Iguaçu River splitting into dozens of arms before it drops — geography no walkway can explain.",
        "Helisul has run these flights since 1972 and has carried more than five million passengers, making it one of the oldest tourist air operations in Brazil. Flights run daily from 9am to 4:30pm — the same window as the National Park, which is no coincidence: the overflight is designed to happen inside the Falls day.",
        "And here's the expectation that needs adjusting: the flight lasts about 10 minutes. The full programme, with travel, check-in, weighing and the safety briefing, takes 1 to 2 hours. It's the widest gap between time committed and time experienced of any attraction in Foz — and even so, people rarely regret it.",
        "Being short is what makes it fit when the day is already full: it adds to the 3 hours of the Falls trail and still leaves the afternoon. What doesn't fit is adding Macuco Safari on the same day — then the arithmetic breaks. The flight depends on weather and cloud ceiling, so it should never be the day's unmissable commitment: if it's cancelled, you want the rest of the plan to survive.",
      ],
      highlights: [
        "10-minute flight",
        "The whole horseshoe at once",
        "Flying since 1972",
        "Same corridor as the Falls",
      ],
      info: [
        {
          label: "Where it is",
          value:
            "Av. das Cataratas, 11130 — opposite the National Park entrance, at km 16.5",
        },
        { label: "Opening hours", value: "Daily, 9am to 4:30pm" },
        {
          label: "Suggested time",
          value: "1 to 2 hours in total; the flight itself lasts 10 minutes",
        },
        {
          label: "Tip",
          value:
            "It depends on weather and cloud ceiling — never make the flight the day's unmissable commitment.",
        },
      ],
    },
    "eco-park-foz": {
      tagline:
        "Falconry, criollo horses and a petting farm, with two shows at fixed times.",
      description: [
        "Dreams Eco Park is, above all, a rescue and rehabilitation centre for animals — birds of prey in particular. That work is what underpins the main attraction: falconry, the ancient art of training hunting birds, presented in the Free Flight show. Watching a hawk or an owl leave the falconer's arm and come back is a scene no aviary can offer.",
        "The second strand is the criollo horse, the breed carrying southern Brazil's pastoral tradition, presented in the show Criollo: the Golden Horse. And there's the Mini Farm, home to the other rescued animals, where the visit turns into direct contact — the part that works best with small children.",
        "Here the clock decides everything, and it's the detail most people discover too late. The park opens in two windows, 9am to 12:30pm and 2:30pm to 6pm, and both shows run at fixed times: the Golden Horse at 10am and 3:30pm, the Free Flight at 10:30am and 4pm. Note they sit 30 minutes apart in each session — arrive at 10am or 3:30pm and you catch both; arrive at 11am or 5pm and you catch neither, seeing only the Mini Farm.",
        "It sits at Av. das Cataratas, 8100, the same address as Dreams Park Show, which makes the pair natural on itineraries of four days or more. And don't confuse it with the Bird Park: there you get immersive aviaries of Atlantic Forest birds beside the National Park; here the proposition is falconry, horses and a farm, with scheduled shows. Two different animal experiences — not substitutes for one another.",
      ],
      highlights: [
        "Free Flight bird show",
        "Criollo horse show",
        "Falconry and birds of prey",
        "Mini Farm",
      ],
      info: [
        {
          label: "Where it is",
          value:
            "Av. das Cataratas, 8100 — the same address as Dreams Park Show",
        },
        {
          label: "Opening hours",
          value: "Daily, 9am to 12:30pm and 2:30pm to 6pm",
        },
        {
          label: "Shows",
          value:
            "Golden Horse at 10am and 3:30pm · Free Flight at 10:30am and 4pm",
        },
        {
          label: "Tip",
          value:
            "Arrive at 10am or 3:30pm to catch both shows — arriving at 11am or 5pm means catching neither.",
        },
      ],
    },
    "ecomuseu-itaipu": {
      tagline:
        "An hour of exhibitions on the Atlantic Forest and Lake Itaipu, with free admission.",
      description: [
        "The Ecomuseum tells the story of the tri-border region along three different routes, across four stops and around an hour. Science in the Sphere uses immersive technology to explain the planet and its phenomena on a spherical projection. Illustrated Territory gathers 25 watercolours of the regional flora by Thaís Regina Marcon, at the level of detail only botanical illustration achieves. And Revealed Territory brings Edino Krug's photographs of the landscapes around Lake Itaipu and the shoreline region.",
        "It's the counterpart to the dam: where the plant tour shows the engineering, here you see what came before and what remained after — the Atlantic Forest, the lake formed by the reservoir and the life of a region the works transformed. Open to all ages, and an hour covers it.",
        "Admission is free and needs no booking, but three requirements catch people out: official photo ID, a visitor registration form filled in at reception, and the fact that the visit is conducted in Portuguese only. There is parking for cars and motorbikes.",
        "The calendar is the corridor's critical point. The Ecomuseum opens Wednesday to Monday, 8:30am to 4pm — meaning it closes on Tuesdays, exactly like the Bela Vista Biological Refuge. Anyone setting Tuesday aside for the Itaipu axis loses both at once and is left with the dam tours alone, which do run every day.",
      ],
      highlights: [
        "Science in the Sphere",
        "25 watercolours of local flora",
        "Photography of Lake Itaipu",
        "Free admission",
      ],
      info: [
        {
          label: "Where it is",
          value: "Itaipu Tourist Complex — Av. Tancredo Neves",
        },
        {
          label: "Opening hours",
          value: "Wed–Mon, 8:30am to 4pm · closed Tuesdays",
        },
        { label: "Suggested time", value: "About 1 hour, across 4 stops" },
        {
          label: "Tip",
          value:
            "Admission is free, but photo ID and reception registration are required. The visit is in Portuguese only.",
        },
      ],
    },
    "aguaray-eco-esportes": {
      tagline:
        "4.5 km of trail, 2 km of paddling and a swim at two waterfalls on the Tamanduá River.",
      description: [
        "The Iguaçu Expedition is a linked route, not a standalone activity. It starts on foot along the Trilha Ecológica do Índio to the canoe base on the bank of the Iguaçu River, the walk accompanied by a reading of the Atlantic Forest, the biome and the local culture. At the base come the briefing and the safety equipment, supplied by the operator.",
        "Then you get in. The paddle heads towards the Tamanduá River, a gentle stretch with no rapids, ending at a landing for another trail — this one to Cachoeira da Toca, where the stop is for swimming, not for photographing from a distance. The return is by kayak, with Cachoeira do Juruvá appearing at the end before the walk back.",
        "That's 4.5 km of walking and 2 km of paddling, in roughly three and a half hours at moderate difficulty. Two departures a day, at 9am and 2:30pm, Tuesday to Sunday — closed Mondays. Minimum age is 10, and under-18s need parental authorisation.",
        "Two things set this apart from everything else in the catalogue. The first is that transport to the site isn't included: it's in Remanso Grande, outside the tourist corridor, and getting there is on you. The second is that the facilities are deliberately basic — an ecological toilet, no food or drink for sale. Bring water, repellent, sunscreen, spare clothes and shoes to change into afterwards, and closed shoes that can get wet. Flip-flops and sandals aren't allowed.",
      ],
      highlights: [
        "4.5 km trail and 2 km paddle",
        "Swim at Cachoeira da Toca",
        "Safety gear included",
        "Departures at 9am and 2:30pm",
      ],
      info: [
        {
          label: "Where it is",
          value: "Alameda Caeté, Remanso Grande — outside the tourist corridor",
        },
        {
          label: "Opening hours",
          value: "Tue–Sun, departures at 9am and 2:30pm · closed Mondays",
        },
        {
          label: "Suggested time",
          value: "About 3h30, with 4.5 km of trail and 2 km of paddling",
        },
        {
          label: "Tip",
          value:
            "Transport to the site isn't included, and there's no food or drink for sale. Bring water.",
        },
      ],
    },
    "gran-aventura": {
      tagline:
        "6 km along the Yacaratiá Trail to Puerto Macuco, then by boat to the foot of the falls.",
      description: [
        "Gran Aventura happens inside Iguazú National Park and begins far from the water: a vehicle covers 6 kilometres along the Yacaratiá Trail, a stretch of dense subtropical forest, to Puerto Macuco. That's where you put on the life jacket and board — and where the boat sets off towards the lower reaches of the falls.",
        "The promise is simple and delivered: a waterfall shower. The boat runs into the spray zone, passes Isla Martín and shows the falls from an angle the park walkways can't reach, because they look down and from here you look up. The walkways give you the scale; the boat gives you the weight of the water.",
        "It isn't included in park admission — it's a separate ticket, though combined options bundling both exist. And it depends on the same panoramic train that serves the rest of the park: from the Central Station the carriages run to Cataratas Station and to the Devil's Throat, and the route to the port slots into that flow.",
        "This is where the Argentine day's arithmetic really tightens. The park closes at 4pm, the three circuits already need 5 to 6 hours, and Gran Aventura adds its own time on top. Counting the border and the hour's drive from Foz, anyone wanting boat and walkways on the same day has to be there at opening — there's no relaxed version of that combination.",
      ],
      highlights: [
        "6 km on the Yacaratiá Trail",
        "Boarding at Puerto Macuco",
        "Passing Isla Martín",
        "Soaking at the foot of the falls",
      ],
      info: [
        {
          label: "Where it is",
          value: "Inside Iguazú National Park — Ruta 101, km 142",
        },
        {
          label: "Getting there",
          value:
            "Panoramic train + 6 km along the Yacaratiá Trail to Puerto Macuco",
        },
        {
          label: "Suggested time",
          value: "2 to 3 hours, on top of the walkway circuits",
        },
        {
          label: "Tip",
          value:
            "It adds to an Argentine day that already needs 5 to 6 hours and closes at 4pm — only fits if you arrive at opening.",
        },
      ],
    },
    "madero-tango-iguazu": {
      tagline:
        "90 minutes of tango at Casino Iguazú, with 8:30pm and 10:30pm sessions — and a lesson at the end.",
      description: [
        "The show runs about 90 minutes, with live dancers and musicians tracing the history of tango — born in the late 19th century on the banks of the Río de la Plata, in Buenos Aires. It isn't purely spectatorial: it closes with a quick lesson in which the audience is called up to dance. That's the part people talk about afterwards.",
        "There are two formats, and the difference matters when choosing. The dinner version pairs the show with a full menu, drinks charged separately. The show-only version comes in Executive and VIP tiers, where the sole distinction is where your seat sits in the room — and there the meal isn't included. Worth confirming which one you're buying.",
        "The show takes place in the Casino Iguazú complex, on Ruta Nacional 12, km 1640, right by the border customs post. There are two sessions, at 8:30pm and 10:30pm, Tuesday to Sunday. That second session is the detail that changes planning: it lets tango follow another evening programme, but pushes the return to Foz past midnight.",
        "It's the same address where the Puerto Iguazú by night circuit ends — the casino is its final stop. Anyone wanting to chain the two can, using the 10:30pm session, but be ready for a long night and a late border crossing. Anyone preferring one thing only takes the 8:30pm show and heads back with time to spare.",
      ],
      highlights: [
        "90-minute live show",
        "Tango lesson at the end",
        "8:30pm and 10:30pm sessions",
        "In the Casino Iguazú complex",
      ],
      info: [
        {
          label: "Where it is",
          value:
            "Casino Iguazú — Ruta Nacional 12, km 1640, near the border post",
        },
        {
          label: "Sessions",
          value: "Tue–Sun, at 8:30pm and 10:30pm · closed Mondays",
        },
        {
          label: "Suggested time",
          value: "90 minutes of show; 3 to 5 hours with travel and the border",
        },
        {
          label: "Tip",
          value:
            "The 10:30pm session lets you chain onto another programme, but pushes the return to Foz past midnight.",
        },
      ],
    },
    "blue-park-foz": {
      tagline:
        "A wave pool with 1.2 m swells, a lazy river and an 18-metre slide hitting 60 km/h.",
      description: [
        "Blue Park is Foz do Iguaçu's water park: 62,000 square metres on the Avenida das Cataratas, with new facilities, well-kept landscaping and the park mascots — jaguar, toucan, coati — dotted along the walkways.",
        "The centrepiece is the wave beach: a wide pool with nine types of wave reaching 1.2 metres, ringed by a strip of sand and sun loungers. Beside it sit the lazy river, for drifting on a ring, and the slides — four lanes of over 100 metres at Fast Falls, and the Super Maverick, 18 metres tall, alternating open and enclosed sections and hitting 60 km/h on the way down. For younger visitors there's Kids Town, with a tipping bucket and slides, and a baby area designed for infants from 6 months to 2 years.",
        "Two experiences fall outside the standard ticket and are booked separately: wakeboarding on the lake and the zip line, 300 metres long and 30 metres up, crossing the park from above. Snack bars are spread across the grounds, and there's a swim-up bar in the pool.",
        "One point that often sets the wrong expectation: the water comes from the Guarani Aquifer and sits at around 28 °C at the surface. That's pleasant in Foz's heat, but it isn't a thermal spa — on a cold winter day the park delivers far less. It sits next to the Mabu Thermas Grand Resort and is included for guests staying there, but access isn't guest-only: day passes are available to outside visitors.",
      ],
      highlights: [
        "Wave beach with 1.2 m swells",
        "Super Maverick, 18 m at 60 km/h",
        "Lazy river and Kids Town",
        "Water at 28 °C from the Guarani Aquifer",
      ],
      info: [
        {
          label: "Where it is",
          value:
            "Rua Carlos Hugo Urnau, 756 — next to Mabu Thermas, off the Av. das Cataratas",
        },
        {
          label: "Water temperature",
          value: "Around 28 °C at the surface, from the Guarani Aquifer",
        },
        { label: "Suggested time", value: "Half a day to a full day" },
        {
          label: "Tip",
          value:
            "Wakeboarding and the zip line are booked separately from the standard ticket.",
        },
      ],
    },
    "iguassu-secret-falls": {
      tagline:
        "From 2 hours to a full day: up to 10 hidden waterfalls on guided trails around Foz.",
      description: [
        "The waterfalls are there, there are many of them and almost nobody knows about them — because they sit on trails and rivers scattered across the region, far from the National Park's viewpoint circuit. The idea here is to reach them with a guide and get into the water: the swim is the point of the outing, not a photo stop.",
        "What sets this operator apart is the range of options. The single trail reaches two waterfalls in two hours, with two departure times — the only way to see a hidden waterfall without giving up a day. The half-day version adds more falls, and the full-day covers four trails and ten waterfalls, from 8:30am to 6pm.",
        "There are also the long expeditions, eight hours each. Tamanduá covers 3.5 km of forest and several falls good for swimming and jumping. Carimã runs 3 km to the springs of the Ouro Verde River, passes the Municipal Nursery and ends at three waterfalls on the Carimã River. And there's Luau Secret Falls, six hours long, trading day for night: a night trail, a swim in the Iguaçu River, a picnic, a bonfire and live music.",
        "Everything runs by advance booking — this isn't a turn-up-and-enter attraction. The meeting point is at Rua Manêncio Martins, 21, in Vila Yolanda, by the International Campground, and the group travels from there to the trails. Bring closed hiking shoes, clothes that can get wet, swimwear and a waterproof pouch for your phone.",
      ],
      highlights: [
        "Up to 10 waterfalls in a day",
        "Two-hour single trail",
        "Luau with a night trail",
        "Tamanduá and Carimã expeditions",
      ],
      info: [
        {
          label: "Meeting point",
          value:
            "R. Manêncio Martins, 21, Vila Yolanda — by the International Campground",
        },
        {
          label: "Options",
          value:
            "Single trail 2h · half day · full day (8:30am–6pm) · Luau 6h · expeditions 8h",
        },
        {
          label: "Pace",
          value:
            "Adventure & nature — light to moderate, depending on the option",
        },
        {
          label: "Tip",
          value:
            "Advance booking only. The address is the meeting point; the trails are elsewhere in the region.",
        },
      ],
    },
    "la-aripuca": {
      tagline:
        "A Guaraní hunting trap built at giant scale, from reclaimed native hardwood.",
      description: [
        "An aripuca is a Guaraní hunting trap: a structure of logs held up by its own weight that drops onto the prey. Here it has been built at giant scale, and the material is what gives the place its meaning — timber reclaimed from native species of the Paraná forest, trees that had already fallen or been felled. The metaphor is explicit: the trap that once caught animals became the symbol of what traps the forest itself.",
        "Around the structure run interpretive trails and ecological constructions that put the Misiones forest and Guaraní knowledge in context. The wooden crafts are made by local producers, and there's a restaurant serving regional food, an ice cream parlour and a café inside the grounds — you can take a break without leaving.",
        "The visit is short, 30 minutes to an hour, and it's worth more for its content than its length. It works well with children, with groups, and with anyone wanting to understand the forest surrounding the Falls rather than only photograph it.",
        "It sits on RN 12, km 4½, on the same road linking Puerto Iguazú to the park and the border, and opens daily from 9am to 6pm. Since the Argentine Falls close at 4pm, it fits on the way back from the park — or into an urban half-day alongside Hito Tres Fronteras and the town's street market. Original photo ID is required to cross.",
      ],
      highlights: [
        "Giant-scale Guaraní trap",
        "Reclaimed native timber",
        "Interpretive trails",
        "Restaurant and local crafts",
      ],
      info: [
        {
          label: "Where it is",
          value:
            "RN 12, km 4½ — on the road linking Puerto Iguazú to the park and the border",
        },
        { label: "Opening hours", value: "Daily, 9am to 6pm" },
        { label: "Suggested time", value: "30 minutes to 1 hour" },
        {
          label: "Tip",
          value:
            "It closes at 6pm and the Argentine Falls at 4pm — it fits on the way back from the park.",
        },
      ],
    },
    "compras-paraguai-ciudad-del-este": {
      tagline:
        "The electronics and perfume hub across the Friendship Bridge — and it closes at 4pm.",
      description: [
        "The Friendship Bridge is just over 500 metres long, and Ciudad del Este starts on the other side — Paraguay's second-largest city and one of South America's biggest hubs for imported goods. The part that matters to visitors is packed into the first few blocks past the bridge: electronics, perfume, cosmetics, eyewear, watches, toys and household goods, spread between street arcades and established names like Shopping China, Mona Lisa, Casa Rica and the Nissei stores.",
        "Opening hours are the detail that reshapes the day. Shops open early, around 7 or 8am, and start closing between 3 and 4pm. On Saturdays most shut around midday, and on Sundays almost nothing opens. It's the opposite of everything else here: there is no late-afternoon version of this trip, and it can't fill the time left over from another plan — it has to be the morning itself.",
        "The bottleneck isn't the distance, it's the bridge. At peak times the queue of cars stopped over the Paraná river eats more time than the whole crossing on foot. That's why locals leave the car in Foz and cross walking, by taxi or by bus — the walk takes a few minutes and hands back control of the clock, which is exactly what decides whether you shop before the doors close.",
        "Since trading ends mid-afternoon, the afternoon is left open — and the nearest answer is 10 km away: Saltos del Monday, in Presidente Franco, open until 7pm. Shopping in the morning and waterfalls after lunch make a complete Paraguayan day without crossing the bridge twice. You need original photo ID in good condition to cross, and Brazil's customs allowance rules apply on the way back.",
      ],
      highlights: [
        "Electronics and perfume hub",
        "Right past the Friendship Bridge",
        "Shops close between 3 and 4pm",
        "Saltos del Monday 10 km away",
      ],
      info: [
        {
          label: "Where it is",
          value:
            "Ciudad del Este, Alto Paraná — the first blocks past the Friendship Bridge",
        },
        {
          label: "Opening hours",
          value:
            "Shops 7/8am to 3 or 4pm · Saturday until midday · Sunday almost everything closed",
        },
        {
          label: "Suggested time",
          value: "One morning; a full day only by adding Saltos del Monday",
        },
        {
          label: "Tip",
          value:
            "Leave the car in Foz and cross on foot or by taxi — the bottleneck is the bridge queue, not the distance.",
        },
      ],
    },
    "hito-tres-fronteras": {
      tagline:
        "The Argentine marker of the triple frontier: open air, no gate, above the meeting of the rivers.",
      description: [
        "There are three markers, one per country, each painted in its own colours: the Argentine one in blue and white, the Brazilian in green and yellow, the Paraguayan in red, white and blue. This is the Argentine one, at the point where the Iguazú river flows into the Paraná — from the lookout you can see the other two across the water, and the border stops being a line on a map and becomes a landscape.",
        "The site was redeveloped and is now far more than the obelisk: a walkway along the bluff, a plaza with an amphitheatre, an artisans' fair and places to eat around it. It's a public open-air space with free entry, no turnstile and no visiting hours.",
        "And that's exactly where it solves a problem in your itinerary. The Marco das Três Fronteiras on the Brazilian side charges entry, only opens at 1.30pm and closes on Mondays — so on a Monday the Hito is the only way to see the rivers meet. The same applies to anyone arriving too late on any day: there's no ticket office here to close.",
        "The right time is late afternoon, and it chains well with the rest of an Argentine day: the Falls on that side close at 4pm, La Aripuca stays open until 6pm on the RN 12 you drive back along, and the Hito takes the sunset. For an urban day, the classic trio is the Hito, the Av. Brasil street market and La Aripuca in a single half-day. Original photo ID is required to cross the border.",
      ],
      highlights: [
        "All three markers in view",
        "Lookout over the river confluence",
        "Free entry, open air",
        "Open when the Brazilian Marco is closed",
      ],
      info: [
        {
          label: "Where it is",
          value:
            "Av. Río Iguazú, Puerto Iguazú — where the Iguazú and Paraná rivers meet",
        },
        {
          label: "Entry",
          value: "Public open-air area, free entry",
        },
        {
          label: "Suggested time",
          value: "1 to 2 hours, with sunset in the middle",
        },
        {
          label: "Tip",
          value:
            "Monday is its day: the Brazilian Marco closes, and here there's no ticket office and no schedule.",
        },
      ],
    },
    "duty-free-shop-puerto-iguazu-argentina": {
      tagline:
        "The duty-free store just past Argentine customs — perfume, spirits and electronics, untaxed.",
      description: [
        "The free shop sits right after the Argentine customs post on RN 12, before you even reach Puerto Iguazú. It's a genuine duty-free zone: goods carry no import tax, which is why perfume, spirits, cosmetics, chocolate and electronics are the stated reason most people cross at all.",
        "The difference from Ciudad del Este is in kind, not in size. There you walk street arcades and compare across dozens of shops; here it's a single air-conditioned address with set brands and Portuguese-speaking staff. If you want to hunt for bargains, go to Paraguay; if you want it sorted quickly and without fuss, come here.",
        "Purchases are in dollars and cards work normally. Back in Brazil, the customs allowance rules apply — the same as at any land border, per person. Check the current figure before crossing, since it's updated periodically.",
        "Half a day covers it comfortably, and that's what makes the free shop easy to slot in: it's on the way to the Argentine Falls, to Hito Tres Fronteras and to La Aripuca, all on the same RN 12. Original photo ID is required — you're crossing an international border, and a photocopy or a phone picture won't do.",
      ],
      highlights: [
        "Duty-free, no import tax",
        "Right past Argentine customs",
        "A single air-conditioned address",
        "On RN 12, en route to the Argentine Falls",
      ],
      info: [
        {
          label: "Where it is",
          value:
            "RN 12, just past Argentine customs — before you reach Puerto Iguazú",
        },
        {
          label: "ID",
          value: "Original photo ID required: you cross a border to get there",
        },
        { label: "Suggested time", value: "Half a day" },
        {
          label: "Tip",
          value:
            "It's on the way to the Argentine Falls, the Hito and La Aripuca — add it to one of those days instead of spending a whole border crossing on it.",
        },
      ],
    },
    "aeroporto-checkin-checkout-hotel": {
      tagline:
        "From landing to your hotel, and back to the airport for departure — without relying on a ride app.",
      description: [
        "The first and last legs are what most shape how a trip starts and ends. Landing in Foz do Iguaçu and hunting for the hotel in traffic, or getting off a flight and being at the mercy of a surge-priced ride app, is the kind of friction that stains arrival — and departure, with luggage, a deadline and a flight to catch, is worse if left to the last minute.",
        "The airport transfer handles it with a set plan: the driver waits for your arrival, helps with the bags and takes you straight to the hotel; on the way back, they pick you up at the right time to reach the flight check-in with room to spare. For anyone staying in Foz it's the same logic — the service covers the stretch between the hotel and any point in town, including the airport, without the ride-app roulette or the wait.",
      ],
      highlights: [
        "Airport to hotel on arrival",
        "Hotel to airport on departure",
        "Flight wait and luggage included",
        "No reliance on a ride app",
      ],
      info: [
        { label: "Where it is", value: "Foz do Iguaçu International Airport and hotels in town" },
        { label: "Hours", value: "Flexible — arranged to your flight time" },
        { label: "Tip", value: "Book the return pickup ahead so you reach the flight check-in with time to spare." },
      ],
    },
  },
  es: {
    "cataratas-do-iguacu": {
      tagline:
        "275 saltos de agua y la Garganta del Diablo vista de frente, desde el lado brasileño del parque.",
      description: [
        "Son 275 saltos repartidos por el cañón del río Iguazú, y la Garganta del Diablo descarga 80 metros de agua a pocos pasos de donde estás. El lado brasileño es el del panorama: ves el conjunto entero de frente, con el Salto Floriano y el Salto Deodoro en el camino, mientras que el lado argentino te lleva por encima de los saltos.",
        "La visita es más sencilla de lo que parece. Del centro de visitantes sale el bus interno que te deja al inicio del sendero; desde allí son 1,3 km de pasarela hasta la plataforma de la Garganta — la parte en la que todos se mojan, con piloto de lluvia o sin él. Al final, el ascensor panorámico sube hasta Porto Canoas, donde están el restaurante frente al río y la parada obligatoria antes de volver.",
        "Tres horas alcanzan para lo esencial, y por eso mismo el lado brasileño rara vez ocupa el día entero solo. Combina bien con el Parque de las Aves por la mañana — misma entrada — o deja la tarde libre para el Macuco Safari y el sobrevuelo en helicóptero. Los tres están en el mismo corredor, así no cruzas la ciudad dos veces el mismo día.",
        "El parque es selva subtropical preservada y Patrimonio Mundial de la UNESCO, y alberga especies amenazadas como el yaguareté, el tapir y el tatú carreta, todas lejos de los senderos. Lo que sí se cruza en tu camino son los coatíes: simpáticos, oportunistas y prohibido alimentarlos, porque ya aprendieron a abrir mochilas.",
      ],
      highlights: [
        "Siete Maravillas Naturales",
        "Garganta del Diablo de frente",
        "Sendero de 1,3 km con miradores",
        "Ascensor panorámico incluido",
      ],
      info: [
        {
          label: "Dónde queda",
          value: "Parque Nacional del Iguazú — BR-469, Rodovia das Cataratas",
        },
        {
          label: "Horario",
          value: "Lun a vie, 9h a 16h · Sáb, dom y feriados, 8:30h a 16h",
        },
        {
          label: "Tiempo sugerido",
          value: "3 horas para lo esencial; medio día a ritmo tranquilo",
        },
        {
          label: "Consejo",
          value:
            "Ve temprano: menos fila en el bus interno y mejor luz en la Garganta. El piloto de lluvia sirve más que el paraguas.",
        },
      ],
    },
    "parque-das-aves": {
      tagline:
        "Viveros que atraviesas por dentro, a 500 metros de la entrada de las Cataratas.",
      description: [
        "Aquí no miras a las aves detrás de un vidrio: entras al vivero con ellas. Guacamayos azulamarillos, tucanes y loros circulan sueltos a pocos metros del sendero, y en el vivero de los periquitos son cientos volando al mismo tiempo a tu alrededor. El punto alto para muchos es la harpía, una de las águilas más grandes del mundo, que impone respeto con solo estar quieta.",
        "Son 1,5 km de sendero por dentro del monte, con piso accesible para silla de ruedas, pasando por flamencos, lechuzas, ñandúes, chuñas, un mariposario y recintos de yacarés y serpientes. Se recrearon ambientes de Pantanal y de Mata Atlántica para las especies, y el Centro de Conservación muestra el trabajo de rescate y reproducción de aves amenazadas — la razón por la que el parque existe, no un anexo.",
        "Queda a 500 metros de la entrada del Parque Nacional, lo que convierte a los dos en la dupla más obvia de un mismo día. El orden tiene un detalle: las Cataratas rinden más temprano, con menos fila y mejor luz, mientras que las aves están más activas por la mañana y bajan el ritmo con el calor de la tarde. Dos horas alcanzan aquí, así que puedes abrir el día por las aves a las 8:30 y seguir a las Cataratas antes del mediodía — o invertirlo, si fotografiar los saltos es la prioridad.",
        "Es uno de los pocos paseos de Foz que la lluvia no arruina: el monte cubre buena parte del sendero y las aves siguen ahí. Conviene repelente, calzado cerrado y apagar el flash — la regla existe para no asustar a los animales, y las fotos salen mejor sin él de todos modos.",
      ],
      highlights: [
        "Viveros que atraviesas",
        "Águila harpía de cerca",
        "Sendero accesible de 1,5 km",
        "500 m de las Cataratas",
      ],
      info: [
        {
          label: "Dónde queda",
          value:
            "Av. das Cataratas, km 17 — 500 m de la entrada del Parque Nacional",
        },
        { label: "Horario", value: "Todos los días, 8:30h a 16:30h" },
        {
          label: "Tiempo sugerido",
          value: "2 horas a ritmo normal; 3 con niños o parando a fotografiar",
        },
        {
          label: "Consejo",
          value:
            "La mañana rinde más: aves activas y menos calor. El flash está prohibido — y es innecesario.",
        },
      ],
    },
    "marco-das-tres-fronteiras": {
      tagline:
        "Tres países a la vista, obelisco de 1903 y el atardecer más concurrido de Foz.",
      description: [
        "El obelisco está ahí desde 1903, marcando donde el río Iguazú desemboca en el Paraná y donde se encuentran tres países: Argentina de un lado, Paraguay del otro, Brasil bajo tus pies. Cada país tiene su marco pintado con sus propios colores, y desde aquí ves los tres de una vez. En la revitalización reciente el obelisco ganó espejo de agua e iluminación, lo que cambia por completo el lugar cuando oscurece.",
        "El complejo no es solo mirador. La Villa Escenográfica de las Misiones Jesuíticas recrea el encuentro entre sacerdotes e indígenas en los siglos XVI y XVII, y el Memorial Cabeza de Vaca cuenta la historia del español que, en 1542, fue el primer europeo en registrar la existencia de las Cataratas. Al final de la tarde entra el Espectáculo Tres Fronteras, con música y danza de las culturas que comparten esta frontera.",
        "Aquí manda la agenda: el Marco abre a las 13:30 y cierra a las 21h, de martes a domingo. No existe visita por la mañana, y los lunes está cerrado. Eso lo convierte en el cierre natural de un día que empezó en las Cataratas o en Itaipú, y no en una parada que encaja en cualquier hueco. Una o dos horas alcanzan, y quien quiera seguir tiene la Rueda Gigante Yup Star a pocos minutos, también de final de tarde.",
        "El restaurante Cabeza de Vaca funciona de 15h a 22h y es una de las pocas mesas de Foz con tres países en el paisaje. La estructura es plana y accesible de punta a punta, así que cochecitos y sillas de ruedas circulan sin esfuerzo. Lleva un abrigo liviano: en la confluencia de los ríos corre viento, y la temperatura baja rápido cuando se va el sol.",
      ],
      highlights: [
        "Tres países a la vista",
        "Obelisco de 1903 iluminado",
        "Espectáculo Tres Fronteras",
        "Atardecer sobre los ríos",
      ],
      info: [
        {
          label: "Dónde queda",
          value:
            "Ac. Três Fronteiras, zona sur de Foz — encuentro de los ríos Iguazú y Paraná",
        },
        {
          label: "Horario",
          value: "Mar a dom, 13:30h a 21h · cierra los lunes",
        },
        {
          label: "Tiempo sugerido",
          value: "1 a 2 horas, con el atardecer en el medio",
        },
        {
          label: "Consejo",
          value:
            "Llega una hora antes del atardecer para conseguir lugar en el mirador. Un abrigo liviano resuelve el viento del río.",
        },
      ],
    },
    "itaipu-binacional": {
      tagline:
        "El complejo de Turismo Itaipú: tres visitas diferentes a la mayor hidroeléctrica del mundo.",
      description: [
        "Itaipú es la mayor hidroeléctrica del mundo en producción de energía y fue elegida una de las Maravillas de la Ingeniería Moderna por la Asociación de Ingeniería Civil de Estados Unidos. Obra conjunta de brasileños y paraguayos, domó el río Paraná — el décimo más grande del planeta en volumen de agua — y es uno de los pocos lugares donde se pueden ver equipos de esa escala funcionando de cerca.",
        "Turismo Itaipú no es una visita sola: son tres, y elegir la equivocada es el tropiezo más común. La Panorámica recorre el exterior en bus, dura cerca de 1h30 y es la única indicada para movilidad reducida. La Especial entra a la usina — sala de comando, eje de una turbina, interior de la represa — en 2h30, y exige documento de identidad original. La Iluminada es nocturna, ocurre solo los viernes y sábados, y es contemplación: no reemplaza a ninguna de las otras dos.",
        "El complejo es más que la represa. El Refugio Biológico Bela Vista y el Ecomuseo quedan en el mismo eje y convierten la visita en medio día o día entero, para quien quiere naturaleza e historia además de la ingeniería.",
        "Itaipú queda del lado opuesto al corredor de las Cataratas, así que intentar los dos el mismo día es receta para correr. Lo habitual es reservar un día — o medio día fuerte — para el eje de Itaipú y dejar las Cataratas para otro. Y quien tiene solo un viernes o un sábado por la noche libre tiene que decidir temprano entre la Iluminada y el atardecer en el Marco de las Tres Fronteras: las dos disputan exactamente el mismo horario.",
      ],
      highlights: [
        "La mayor hidroeléctrica del mundo",
        "Tres visitas diferentes",
        "Maravilla de la Ingeniería Moderna",
        "Refugio y Ecomuseo en el mismo eje",
      ],
      info: [
        {
          label: "Dónde queda",
          value: "Av. Tancredo Neves, 6702 — Centro de Recepción de Visitantes",
        },
        {
          label: "Horario",
          value:
            "Panorámica y Especial: todos los días desde las 8:30h · Iluminada: viernes y sábados, 19h",
        },
        {
          label: "Tiempo sugerido",
          value: "Panorámica 1h30 · Especial 2h30 · Iluminada 2h",
        },
        {
          label: "Consejo",
          value:
            "Elige la visita antes de salir del hotel: son tres paseos distintos, con horarios, reglas y duración propios.",
        },
      ],
    },
    "refugio-biologico-bela-vista": {
      tagline:
        "El yaguareté, la harpía y el monte que la represa recompuso, en sendero guiado de 1,7 km.",
      description: [
        "El Refugio Bela Vista nació de una deuda: cuando el embalse de Itaipú se llenó, la represa tuvo que rescatar a los animales que perdieron territorio y recomponer la vegetación que quedó bajo el agua. Lo que empezó como operación de rescate se volvió unidad de conservación, centro de investigación y, hoy, el paseo más tranquilo del complejo.",
        "El sendero guiado tiene 1,7 km y lleva cerca de dos horas por bosque, lagos y recintos. Aquí ves de cerca yaguareté, ocelote, tapir, guacamayo y harpía — parte rescatados, parte en rehabilitación. En el Parque Nacional del Iguazú esas mismas especies existen, pero viven lejos de los senderos: este es el lugar donde aparecen. El jardín botánico reúne más de 50 especies de árboles nativos, varias amenazadas de extinción.",
        "La logística tiene dos trabas que deciden el día: el Refugio cierra los martes y las salidas son en horarios fijos — 8:30, 10:30, 14:30 y 15:30. No existe llegar cuando se pueda. Como queda en el mismo complejo de la represa, el encaje natural es con la Itaipú Panorámica: 1h30 de ella más 2h30 de aquí llenan medio día completo, y es el horario de salida del Refugio el que define cuál viene primero.",
        "Es un paseo de ritmo lento, guiado y al aire libre, así que rinde más con calzado cerrado, repelente y agua. Quien viaja con niños suele encontrar aquí el contrapeso que le faltaba a un día de hormigón e ingeniería — y quien fotografía fauna encuentra lo opuesto del Parque de las Aves: animales más grandes y mucha menos gente por metro cuadrado.",
      ],
      highlights: [
        "Yaguareté y harpía de cerca",
        "Sendero guiado de 1,7 km",
        "Jardín botánico nativo",
        "Mismo complejo de Itaipú",
      ],
      info: [
        {
          label: "Dónde queda",
          value: "Complejo Turístico de Itaipú — Av. Tancredo Neves",
        },
        {
          label: "Horario",
          value:
            "Mié a lun, salidas a las 8:30, 10:30, 14:30 y 15:30 · cierra los martes",
        },
        {
          label: "Tiempo sugerido",
          value: "2h a 2h30, incluyendo transporte interno y sendero",
        },
        {
          label: "Consejo",
          value:
            "Las salidas tienen horario fijo — elegir la tuya es lo que define el orden del día junto con la Itaipú Panorámica.",
        },
      ],
    },
    "dreams-park-show": {
      tagline:
        "Complejo de atracciones: dinosaurios, maravillas del mundo y museo de cera.",
      description: [
        "Dreams Park Show reúne varias atracciones temáticas en un solo lugar, como el Valle de los Dinosaurios, las Maravillas del Mundo en miniatura y el museo de cera — diversión garantizada para todas las edades.",
        "Es una excelente opción de paseo bajo techo, perfecto para los días de lluvia o para variar el itinerario más allá de la naturaleza.",
      ],
      highlights: [
        "Valle de los Dinosaurios",
        "Maravillas del Mundo",
        "Ideal para días de lluvia",
      ],
      info: [
        {
          label: "Dónde queda",
          value: "Av. das Cataratas, 8100 — camino al Parque Nacional",
        },
        {
          label: "Horario",
          value:
            "Varía por atracción: de 9h/10h hasta 21h, 22h o 23h según el día",
        },
        {
          label: "Tiempo sugerido",
          value: "1 a 2 horas por atracción; 3 a 5 eligiendo dos o tres",
        },
        {
          label: "Consejo",
          value:
            "La entrada es por atracción, no por el complejo. Elegir antes evita pagar por un área que no vas a aprovechar.",
        },
      ],
    },
    aquafoz: {
      tagline:
        "El acuario de Foz: 300 especies y 3,3 millones de litros dedicados a los ríos Paraná e Iguazú.",
      description: [
        "El AquaFoz es el acuario de Foz do Iguaçu: 23 mil m² y cerca de 3,3 millones de litros de agua repartidos en tres pisos de visita. Reúne más de 300 especies de agua dulce y salada, y el recorrido fue diseñado como un camino de las aguas — empiezas en los ríos de la región y terminas en el océano.",
        "El eje del acervo es local, y eso lo diferencia de un acuario genérico: la Galería Río Iguazú recorre el Alto, el Medio y el Bajo Iguazú, mostrando cómo cambia la fauna a lo largo del propio río. En el tramo alto aparecen el bagre de piedra, la mojarra del Iguazú y el vieja de agua; en el medio, la tararira, el jacundá y el mandi del Iguazú. Son peces de la cuenca que alimenta las Cataratas — el mismo río, visto por dentro.",
        "Paneles interactivos y áreas educativas sostienen la visita, y detrás de ella hay un centro de conservación con proyectos científicos junto a universidades e instituciones ambientales desde antes de la apertura al público. La propuesta no es solo exhibir especies: es investigación y protección de hábitat.",
        "Una hora y media a dos horas alcanzan, y el encaje es natural: queda cerca de la entrada del Parque Nacional del Iguazú, en el mismo corredor de las Cataratas y del Parque de las Aves. Es techado y climatizado, lo que lo convierte en una de las mejores cartas de la ciudad en día de lluvia o de calor fuerte. Atención a la última entrada, a las 17h — bastante antes del cierre.",
      ],
      highlights: [
        "Más de 300 especies",
        "3,3 millones de litros",
        "Galería Río Iguazú",
        "Techado y climatizado",
      ],
      info: [
        {
          label: "Dónde queda",
          value: "Av. das Cataratas — cerca de la entrada del Parque Nacional",
        },
        {
          label: "Horario",
          value: "Todos los días, 9h a 18:30 · última entrada a las 17h",
        },
        { label: "Tiempo sugerido", value: "1h30 a 2 horas" },
        {
          label: "Consejo",
          value:
            "La última entrada es a las 17h, no a las 18:30. Llegar después significa no entrar.",
        },
      ],
    },
    "vale-dos-dinossauros": {
      tagline:
        "30 dinosaurios de tamaño real que se mueven y rugen, en un sendero con lagos y cascadas.",
      description: [
        "Son 30 dinosaurios de tamaño real repartidos por un sendero en el monte, y se mueven y emiten sonido — lo que cambia por completo la reacción de quien tiene menos de diez años. El mayor es el Giganotosaurio, con más de 14 metros, un depredador que vivió en la Patagonia y hoy ocupa el medio del valle.",
        "El recorrido es al aire libre, entre lagos y cascadas, y eso separa a esta atracción de las demás del complejo: mientras el Museo de Cera y el Ice Bar ignoran el clima, aquí la lluvia fuerte arruina el paseo. También es de las que cierran más temprano, a las 19:30 o 20:30 según el día.",
        "Una a dos horas alcanzan de sobra. En la Av. das Cataratas, camino al Parque Nacional, encaja naturalmente después de una mañana en los saltos — y es la atracción del Dreams Park que suele decidir la visita cuando hay un niño pequeño en el grupo.",
      ],
      highlights: [
        "30 dinosaurios de tamaño real",
        "Movimiento y sonido",
        "Giganotosaurio de 14 metros",
        "Sendero con lagos y cascadas",
      ],
      info: [
        {
          label: "Dónde queda",
          value: "Dreams Park Show — Av. das Cataratas, 8100",
        },
        {
          label: "Horario",
          value: "Dom a mié, 9:30 a 19:30 · Jue a sáb, 9:30 a 20:30",
        },
        { label: "Tiempo sugerido", value: "1 a 2 horas" },
        {
          label: "Consejo",
          value:
            "Es sendero abierto: con lluvia fuerte pierde mucho. Ese día, el Museo de Cera y el Ice Bar, al lado, resuelven mejor.",
        },
      ],
    },
    "museu-de-cera": {
      tagline:
        "17 escenarios y más de 100 figuras del cine, la música y la historia para fotografiar.",
      description: [
        "Son 17 escenarios y más de 100 figuras de cera: estrellas del cine, la música, la televisión, el deporte, la política y la historia, además de un bloque dedicado a superhéroes y villanos. La propuesta no es mirar de lejos — cada escenario fue montado para que entres, poses y salgas con la foto.",
        "Es totalmente techado y climatizado, lo que lo convierte en una de las respuestas más directas de Foz para un día de lluvia o una tarde de calor fuerte. Y cierra tarde: 21h de domingo a miércoles, 22h de jueves a sábado, en una ciudad donde casi todo termina a las 16h.",
        "Una hora a una hora y media alcanzan. Queda dentro del Dreams Park Show, en la Av. das Cataratas, y funciona bien pegado a otra atracción del complejo o como programa de fin de día, cuando el parque nacional ya cerró y todavía queda energía.",
      ],
      highlights: [
        "17 escenarios",
        "Más de 100 figuras",
        "Superhéroes y villanos",
        "Abierto hasta las 21h o 22h",
      ],
      info: [
        {
          label: "Dónde queda",
          value: "Dreams Park Show — Av. das Cataratas, 8100",
        },
        {
          label: "Horario",
          value: "Dom a mié, 9h a 21h · Jue a sáb, 9h a 22h",
        },
        { label: "Tiempo sugerido", value: "1 a 1h30" },
        {
          label: "Consejo",
          value:
            "Cierra tarde y es techado: resuelve tanto el día de lluvia como la noche sin programa.",
        },
      ],
    },
    "dreams-ice-bar": {
      tagline:
        "Un bar a 15 grados bajo cero donde vaso, mesa y pared son de hielo — en la ciudad más calurosa del país.",
      description: [
        "La gracia está en el contraste: Foz es una de las ciudades más calurosas de Brasil, y aquí entras a un ambiente a 15 grados bajo cero donde todo — vasos, bancos, mesas, paredes y barra — está hecho de hielo. Los abrigos y guantes se entregan en la entrada, así que no hace falta llevar nada.",
        "La visita es por sesión y corta por naturaleza: nadie se queda mucho tiempo a esa temperatura, y ese es justamente el punto. Funciona para adultos y para niños, y suele dar las fotos más improbables de una estadía en Foz.",
        "Queda dentro del Dreams Park Show, en la Av. das Cataratas, y es la atracción que va más tarde de todo el complejo: hasta las 22h de domingo a miércoles y hasta las 23h de jueves a sábado. Atención a la última sesión, que sale bastante antes del cierre.",
      ],
      highlights: [
        "Ambiente a −15 °C",
        "Todo hecho de hielo",
        "Abrigo y guantes en la entrada",
        "Abierto hasta las 22h o 23h",
      ],
      info: [
        {
          label: "Dónde queda",
          value: "Dreams Park Show — Av. das Cataratas, 8100",
        },
        {
          label: "Horario",
          value:
            "Dom a mié, 10h a 22h (última sesión 21:10) · Jue a sáb, 10h a 23h (última sesión 21:50)",
        },
        { label: "Tiempo sugerido", value: "30 a 45 minutos, por sesión" },
        {
          label: "Consejo",
          value:
            "La última sesión sale bastante antes del cierre — llegar a las 22h un jueves no garantiza entrada.",
        },
      ],
    },
    "cataratas-jl-shopping": {
      tagline: "Compras, gastronomía y cine en el corazón de Foz.",
      description: [
        "Cataratas JL Shopping es uno de los principales centros comerciales de Foz do Iguaçu, con tiendas, patio de comidas, cine y servicios.",
        "Es una buena parada para descansar, comer y hacer compras con comodidad y aire acondicionado.",
      ],
      highlights: ["Tiendas y servicios", "Patio de comidas", "Cine"],
      info: [
        {
          label: "Consejo",
          value: "Buena opción para comer y descansar camino a las Cataratas.",
        },
      ],
    },
    "shopping-catuai-palladium": {
      tagline:
        "El shopping más grande de la región, con recreación, compras y gastronomía.",
      description: [
        "Catuaí Palladium es el shopping más grande de Foz do Iguaçu, con una amplia variedad de tiendas, restaurantes, cine y opciones de recreación para toda la familia.",
        "Reúne todo en un solo lugar — ideal para un programa completo de compras y diversión.",
      ],
      highlights: [
        "El shopping más grande de la región",
        "Recreación y cine",
        "Gastronomía variada",
      ],
      info: [
        {
          label: "Consejo",
          value: "Reserva un buen tiempo — es grande y tiene mucho para ver.",
        },
      ],
    },
    "roda-gigante-yup-star": {
      tagline:
        "88 metros de altura y toda la Triple Frontera en un giro de 12 minutos.",
      description: [
        "Son 88 metros de altura y un giro de unos 12 minutos que entrega lo que ningún mirador de Foz entrega: la Triple Frontera entera de una vez. Desde arriba ves el encuentro del río Iguazú con el Paraná, la mancha urbana de Foz, Puerto Iguazú del lado argentino y Ciudad del Este del paraguayo — los tres países en un solo giro de 360 grados.",
        "Las cabinas son cerradas y climatizadas, lo que cambia la cuenta del día: la lluvia y el calor de 35 grados no molestan, al contrario de casi todo paseo al aire libre de la ciudad. Lo que cancela aquí es el viento fuerte — es el único atractivo de Foz cuyo plan B tiene que considerarlo. Después del atardecer la estructura se enciende en colores y la rueda pasa a ser parte del paisaje nocturno.",
        "Foz tiene una disputa silenciosa por el final de la tarde: el Marco de las Tres Fronteras, el Kattamaram, la Yup Star y, los viernes y sábados, la Itaipú Iluminada, todos detrás del mismo atardecer. La buena noticia es que los dos principales se cubren — la Yup Star cierra los miércoles y el Marco los lunes. Un lunes, la rueda es la respuesta; un miércoles, el Marco. Los demás días, la elección es tuya.",
        "Y no hace falta elegir. Como el giro dura pocos minutos, puedes subir al final de la tarde y seguir a cenar al Marco, cuyo restaurante atiende hasta las 22h — los dos quedan en la misma zona sur de la ciudad. Reserva alrededor de una hora en total, contando la fila. A principios de la tarde la fila es mucho menor, pero la luz no compensa.",
      ],
      highlights: [
        "88 metros de altura",
        "Vista 360° de tres países",
        "Cabinas climatizadas",
        "Iluminación nocturna",
      ],
      info: [
        { label: "Dónde queda", value: "R. Quixadá, 127 — zona sur de Foz" },
        { label: "Horario", value: "12:30 a 20:30 · cierra los miércoles" },
        {
          label: "Tiempo sugerido",
          value: "Cerca de 1 hora con fila; el giro en sí dura ~12 minutos",
        },
        {
          label: "Consejo",
          value:
            "Cierra los miércoles y el Marco de las Tres Fronteras los lunes — uno cubre el día del otro.",
        },
      ],
    },
    "macuco-safari": {
      tagline:
        "Tres etapas dentro del Parque Nacional: 2 km de selva, 600 m de sendero y el bote en los saltos.",
      description: [
        "El Macuco Safari es un paseo de tres etapas dentro del Parque Nacional del Iguazú, y el bote es solo la última. Empieza con 2 km de selva en vehículos eléctricos — silenciosos, lo que aumenta la chance de cruzarse con algún animal en el camino. Después vienen 600 metros de sendero a pie con guía bilingüe, el tramo de mayor contacto con el monte.",
        "El sendero termina en un deck con tienda, baños y guardarropa, y ahí la cosa cambia de tono: un tranvía eléctrico baja hasta el muelle del río Iguazú, donde los botes bimotores salen rumbo a los saltos. Son 25 a 30 minutos de navegación, y el final es entrar debajo del agua — no es metáfora, sales empapado.",
        "El paseo entero lleva de 2 a 3 horas, y esa cuenta es la que decide el día. Ocurre en el km 25 de la misma ruta que lleva a las Cataratas, en el km 18: mismo parque, pero con entrada, agenda y tiempo propios. Sumado a las 3 horas del sendero de los miradores, llena un día completo — intentar encajar el Parque de las Aves encima se vuelve maratón.",
        "El orden importa más de lo que parece: haz primero el sendero de las Cataratas y el Macuco después. Al revés significa recorrer los miradores con la ropa mojada. Deja el cambio de ropa en el guardarropa del deck, lleva bolsa impermeable para el celular y cuenta con que la navegación pueda alterarse — las condiciones del río mandan más que la agenda.",
      ],
      highlights: [
        "Tres etapas: selva, sendero y bote",
        "25 a 30 min de navegación",
        "Vehículos eléctricos silenciosos",
        "Guía bilingüe en el sendero",
      ],
      info: [
        {
          label: "Dónde queda",
          value: "Parque Nacional del Iguazú — BR-469, km 25",
        },
        { label: "Horario", value: "Todos los días, 9h a 17h" },
        {
          label: "Tiempo sugerido",
          value: "2 a 3 horas, de las cuales 25 a 30 min de navegación",
        },
        {
          label: "Consejo",
          value:
            "Hazlo después del sendero de las Cataratas, nunca antes — si no, recorres los miradores con la ropa mojada.",
        },
      ],
    },
    "cataratas-lado-argentino": {
      tagline:
        "Tres circuitos de pasarela y el tren hasta la boca de la Garganta del Diablo, 82 metros abajo.",
      description: [
        "Si el lado brasileño muestra la grandeza de las Cataratas, el argentino te hace sentir su fuerza. Son tres circuitos independientes dentro del Parque Nacional Iguazú, y no estás frente a los saltos: estás arriba, abajo y dentro de ellos.",
        "El Circuito Superior corre por pasarelas que pasan por encima de los saltos, con pocas escaleras y la vista abierta del conjunto. El Circuito Inferior baja al nivel del río para el ángulo frontal, con escalinatas que cansan más y el Salto Bossetti en el camino, donde el rocío da un baño de verdad. Y está la Garganta del Diablo, que es otra historia: un tren ecológico lleva hasta el inicio de 1 km de pasarela sobre el río, y al final estás frente a una caída de 82 metros — el rugido llega antes que la vista.",
        "La cuenta del día es implacable y es el error más común de quien cruza: el parque cierra a las 16h y los tres circuitos piden de 5 a 6 horas. Sumando la frontera y los 30 km desde el centro de Foz, entrar después de las 10h significa dejar un circuito atrás. Salir temprano no es consejo, es requisito — y el documento de identidad original, DNI o pasaporte, es lo que va a pedir migraciones.",
        "El piloto de lluvia acá no es accesorio: moja mucho más que en el lado brasileño, y el Salto Bossetti lo garantiza incluso en día de sol. Si vas a hacer el Gran Aventura, el bote que sale dentro de este parque, lleva ropa de baño. Y la recomendación que resuelve la duda de todos: haz los dos lados en días consecutivos, el brasileño primero por el panorama, el argentino después por la inmersión.",
      ],
      highlights: [
        "Circuitos Superior e Inferior",
        "Garganta del Diablo de 82 m",
        "Tren ecológico + 1 km de pasarela",
        "Salto Bossetti",
      ],
      info: [
        {
          label: "Dónde queda",
          value:
            "Ruta 101, km 142 — 17 km de Puerto Iguazú, ~30 km del centro de Foz",
        },
        { label: "Horario", value: "Todos los días, 8h a 16h" },
        {
          label: "Tiempo sugerido",
          value: "5 a 6 horas en el parque; día entero con frontera y traslado",
        },
        {
          label: "Consejo",
          value:
            "Cierra a las 16h y los circuitos piden 5 a 6 horas: entrar después de las 10h es renunciar a uno.",
        },
      ],
    },
    "templo-budista-foz": {
      tagline:
        "120 estatuas, tres Budas y una vista que llega a Paraguay — con entrada libre.",
      description: [
        "El Chen Tien fue construido en 1996 por las comunidades chinas de la Triple Frontera, y la escala sorprende a quien llega sin expectativa: cerca de 120 estatuas repartidas por el terreno, cada una representando una reencarnación de Buda, y un templo principal de más de dos mil metros cuadrados en dos pisos, donde está la Casa del Maestro.",
        "Son tres Budas centrales, y cada uno cuenta algo distinto. El Mi La Pu-San sentado, réplica en hormigón de siete metros, es el más fotografiado. El Shakyamuni recostado representa el alcance del Parinirvana. Y el Amitaba, en bronce, es el más alto en la jerarquía de iluminación representada allí. Suma a eso la Kuan Yin, diosa de la compasión, las pagodas, los jardines y una vista desde lo alto que alcanza Foz y Ciudad del Este del otro lado de la frontera.",
        "La visita es corta — 30 a 40 minutos alcanzan, una hora si te detienes en los jardines — y la entrada es libre, lo que lo convierte en uno de los pocos atractivos de Foz sin boletería. Pero la agenda exige atención: abre de martes a domingo, de 9:30 a 16:30, y cierra el primer domingo de cada mes. Es la única regla de ese tipo en la ciudad, y sorprende a quien solo mira el día de la semana.",
        "Queda en el corredor oeste, el mismo de Itaipú, del Refugio Biológico y del Ecomuseo, y es el encaje natural para el hueco de media hora que sobra en un día dedicado a la represa. Recuerda que es un espacio religioso en funcionamiento: silencio, ropa discreta y nada de poses irreverentes al lado de las estatuas. Lleva repelente — el terreno es arbolado y hay mosquitos.",
      ],
      highlights: [
        "Cerca de 120 estatuas",
        "Buda de 7 metros",
        "Vista hasta Ciudad del Este",
        "Entrada libre",
      ],
      info: [
        {
          label: "Dónde queda",
          value: "R. Dr. Josivalter Vila Nova, 99 — Jardim Califórnia",
        },
        {
          label: "Horario",
          value: "Mar a dom, 9:30 a 16:30 · cierra el primer domingo del mes",
        },
        {
          label: "Tiempo sugerido",
          value: "30 a 40 minutos; hasta 1 hora con los jardines",
        },
        {
          label: "Consejo",
          value:
            "Entrada libre, pero espacio religioso en funcionamiento: silencio, ropa discreta y repelente.",
        },
      ],
    },
    "mesquita-omar-ibn-al-khattab": {
      tagline:
        "La cúpula de mayor luz libre de América Latina y minaretes de 31 metros, en el barrio árabe de Foz.",
      description: [
        "La Mezquita Omar Ibn Al-Khattab está en un barrio que concentra una de las mayores comunidades de inmigrantes árabes y descendientes del mundo — y eso explica la escala del edificio. Las obras empezaron en 1983 y terminaron en 1987, en un proyecto audaz para la época: arquitectura islámica con la mayor luz libre de cúpula en hormigón armado de América Latina.",
        "La base es octogonal, rodeada de arcos, y el salón tiene capacidad para 580 personas. Por dentro, las paredes están cubiertas de arabescos y motivos religiosos, con un nivel de detalle que la fachada no anticipa. Por fuera, dos minaretes de 31 metros marcan el paisaje del barrio y, cinco veces al día, de ellos sale el llamado a la oración — si tu visita coincide con uno, ese es el recuerdo que queda.",
        "La agenda es la parte que exige atención, porque no sigue el patrón de ningún otro atractivo de la ciudad: no abre los domingos, los lunes solo recibe por la tarde (14h a 17:30) y de martes a sábado funciona en dos ventanas, de 8:30 a 11:30 y de 14h a 17:30. El intervalo del mediodía sorprende a quien llega a la hora del almuerzo pensando que es un atractivo de puerta abierta.",
        "La visita lleva de 45 minutos a una hora y queda en el eje urbano de Foz, lejos del corredor de las Cataratas. Encaja bien en medio día de ciudad, junto con el centro, las compras o un almuerzo árabe — la misma comunidad que levantó la mezquita sostiene la escena de shawarma de la ciudad. Es un espacio religioso activo: vestimenta recatada, con hombros y piernas cubiertos, es condición de entrada, no sugerencia.",
      ],
      highlights: [
        "Mayor luz libre de cúpula de América Latina",
        "Minaretes de 31 metros",
        "Salón para 580 personas",
        "Arabescos en el interior",
      ],
      info: [
        {
          label: "Dónde queda",
          value: "Rua Meca, 599 — Jardim Central, eje urbano de Foz",
        },
        {
          label: "Horario",
          value:
            "Lun, 14h a 17:30 · Mar a sáb, 8:30 a 11:30 y 14h a 17:30 · cierra los domingos",
        },
        { label: "Tiempo sugerido", value: "45 minutos a 1 hora" },
        {
          label: "Consejo",
          value:
            "Cierra al mediodía y no abre los domingos. Vestimenta recatada, con hombros y piernas cubiertos, es condición de entrada.",
        },
      ],
    },
    "saltos-del-monday": {
      tagline:
        "Tres saltos de 45 metros y un ascensor panorámico, a 10 km del Puente de la Amistad.",
      description: [
        "Son tres saltos formados por el río Monday, afluente del Paraná, de unos 45 metros de altura y 120 de ancho, rodeados de monte cerrado. La comparación con las Cataratas es inevitable y no le hace justicia a ninguno de los dos: acá no hay la escala de 275 saltos, pero tampoco hay multitud — te acercas al agua en un parque que cabe en una tarde.",
        "El recurso que cambia la visita es el ascensor panorámico, que baja desde la parte alta hasta la base del salto principal, con la vista acompañando todo el trayecto. Además hay senderos livianos, miradores, tirolesa y un área de arborismo pensada para chicos. La estructura es sencilla pero completa: baños, cafetería y restaurante.",
        "Un error común de ubicación: el parque no queda en Ciudad del Este, sino en Presidente Franco, la ciudad vecina — a unos 10 km del Puente de la Amistad. Eso lo vuelve accesible para quien se hospeda en Foz, pero exige cruzar la frontera, con documento de identidad reciente o pasaporte. Los menores de 18 años que viajan sin los padres necesitan autorización internacional certificada ante escribanía, presentada con los originales.",
        "Y acá está el encaje que casi nadie aprovecha: el parque abre todos los días de 8h a 19h, mientras que el comercio de Ciudad del Este cierra alrededor de las 16h. O sea, el día de Paraguay no tiene que elegir — compras por la mañana, con los locales abiertos, y Monday al final de la tarde, cuando el comercio ya cerró y el parque todavía tiene tres horas de sol. En época de lluvia el volumen de agua aumenta y los saltos quedan mucho más impresionantes.",
      ],
      highlights: [
        "Tres saltos de 45 metros",
        "Ascensor panorámico",
        "Tirolesa y arborismo",
        "Abierto hasta las 19h",
      ],
      info: [
        {
          label: "Dónde queda",
          value:
            "Parque Municipal Monday, Presidente Franco — 10 km del Puente de la Amistad",
        },
        { label: "Horario", value: "Todos los días, 8h a 19h" },
        {
          label: "Tiempo sugerido",
          value: "2 a 3 horas en el parque, además del traslado",
        },
        {
          label: "Consejo",
          value:
            "Cierra a las 19h, tres horas después del comercio de CDE — se puede comprar de mañana y hacer el parque al final de la tarde.",
        },
      ],
    },
    "by-night-argentina-puerto-iguazu": {
      tagline:
        "Free shop, bar de hielo, feria y casino — la noche argentina en cuatro paradas.",
      description: [
        "El by night argentino es un circuito de cuatro paradas, no una cena. Empieza en el Duty Free Shop, en la Ruta 12, con cerca de 40 minutos entre bebidas, perfumes, cosméticos y ropa libres de impuesto hasta la cuota. Sigue al bar de hielo de Puerto Iguazú, donde se pasan otros 40 minutos a hasta diez grados bajo cero, trago en mano.",
        "La tercera parada es la que más dura y suele ser la preferida: cerca de una hora en la feria de la Av. Brasil, punto de encuentro de turistas y vecinos, donde se mezclan los acentos. Ahí están las empanadas, los alfajores, la tabla de fiambres, las aceitunas rellenas, los quesos y los vinos — con el atardecer dándole el tono al comienzo de la noche. El circuito cierra en el casino del City Center, otros 40 minutos, para quien quiera conocer esa parte de la ciudad.",
        "Sumando las paradas y el traslado, el programa ocupa de 4 a 5 horas y se lleva la noche entera. No se suma a la Itaipú Iluminada, que ocurre del lado brasileño en el mismo horario — pero el Madero Tango es la excepción: el show queda en el complejo del Casino Iguazú, que es la última parada de este circuito, y la función de las 22:30 permite encadenar. El encaje más limpio es después de un día en las Cataratas argentinas, que cierran a las 16h — ya estás de ese lado, con la frontera resuelta.",
        "El cruce es por el Puente Tancredo Neves y exige documento de identidad original. Quien prefiera cambiar el casino por una cena encuentra parrillas y pizzerías en el centro, y hay quien agrega un show de tango a la noche. Conviene contar el tiempo de migraciones a la vuelta: de noche el flujo cambia y el regreso a Foz no siempre es rápido.",
      ],
      highlights: [
        "Free shop sin impuesto hasta la cuota",
        "Bar de hielo a −10 °C",
        "Feria de la Av. Brasil",
        "Casino del City Center",
      ],
      info: [
        {
          label: "Dónde queda",
          value:
            "Puerto Iguazú — Duty Free y casino en la Ruta 12, feria en la Av. Brasil",
        },
        {
          label: "Cuándo ocurre",
          value:
            "Programa nocturno: las paradas funcionan del final de la tarde a la noche",
        },
        {
          label: "Tiempo sugerido",
          value: "4 a 5 horas, sumando las cuatro paradas y el traslado",
        },
        {
          label: "Consejo",
          value:
            "Se lleva la noche entera y termina en el mismo complejo del Madero Tango — se puede encadenar con la función de las 22:30.",
        },
      ],
    },
    "kattamaram-foz": {
      tagline:
        "El Encuentro de las Aguas, el Marco y los tres puentes vistos desde el río, con buffet a bordo.",
      description: [
        "El Kattamaram II navega por los ríos Iguazú y Paraná y pasa por los puntos que dibujan la Triple Frontera: el Puente de la Fraternidad, el Encuentro de las Aguas, el Marco de las Tres Fronteras, las obras del Puente de la Integración y el Puente de la Amistad. Un guía acompaña el trayecto contando qué significa cada estructura en la relación entre los tres países.",
        "La diferencia respecto de todo lo que existe en tierra es la perspectiva. El Encuentro de las Aguas y el Marco son exactamente lo que se ve desde el mirador del Marco de las Tres Fronteras — solo que aquí estás del otro lado, dentro del río, mirando la ciudad de vuelta. Quien ya hizo el Marco encuentra el mismo paisaje invertido; quien no lo hizo, resuelve las dos cosas de una vez.",
        "Hay buffet a bordo, y eso cambia la cuenta del día: el paseo no se suma a una comida, es la comida. Existen dos salidas con propuestas distintas — la de almuerzo, que ocupa el mediodía, y la de atardecer con cena, que cierra la tarde con el sol bajando en el horizonte paraguayo. Música ambiente acompaña a las dos.",
        "Esa doble grilla es el as logístico del Kattamaram. Foz tiene cuatro atractivos disputando el final de la tarde — el Marco, la Yup Star, la Itaipú Iluminada los viernes y sábados, y este — y es el único que también existe en el horario del almuerzo. Si tu final de tarde ya está ocupado, la versión diurna lo resuelve sin sacar nada del itinerario.",
      ],
      highlights: [
        "Encuentro de las Aguas",
        "Tres puentes de la frontera",
        "Buffet a bordo",
        "Salida de almuerzo o atardecer",
      ],
      info: [
        {
          label: "Dónde queda",
          value:
            "Av. General Meira, 1351 — el antiguo cruce de la balsa a Argentina, sobre el río Iguazú",
        },
        {
          label: "Salidas",
          value: "Dos modalidades: almuerzo a bordo y atardecer con cena",
        },
        {
          label: "Tiempo sugerido",
          value: "2 a 3 horas, incluyendo el embarque",
        },
        {
          label: "Consejo",
          value:
            "Es el único paseo de final de tarde de Foz que también tiene versión diurna — resuelve cuando la noche ya está ocupada.",
        },
      ],
    },
    "wonder-park-foz": {
      tagline:
        "Cuatro atracciones a 950 metros de las Cataratas — y dos de ellas recién empiezan a las 20h.",
      description: [
        "El Wonder Park queda en el km 20 de la Rodovia das Cataratas, a menos de 950 metros de la entrada del Parque Nacional, y reúne cuatro atracciones independientes. El Movie Cars expone 50 vehículos icónicos del cine, la televisión, los dibujos animados y la música en 20 escenarios de Hollywood. La Bonnie's Burger es una hamburguesería temática de los años 50, con decoración retro y la propuesta de ser tan fotografiada como comida.",
        "Las otras dos solo existen cuando oscurece. El Show de Aguas ocurre en el lago del complejo, con chorros, luz y proyecciones de éxitos del cine. El Lumina Park es un sendero nocturno por el monte, donde el bosque se ilumina y se sonoriza — caminata y tecnología en el mismo recorrido, sin la adrenalina de un parque de aventura.",
        "Y es justamente el reloj el que define cómo usar esta dirección. El Movie Cars y la Bonnie's Burger abren a las 11h y van hasta las 23h; el Show de Aguas y el Lumina Park empiezan los dos a las 20h. Eso significa dos cosas: hay programa aquí desde el mediodía, y las dos atracciones nocturnas arrancan a la misma hora — conviene confirmar la grilla de funciones antes de contar con ambas la misma noche.",
        "La ubicación hace el resto. Pasas por delante al volver de las Cataratas, que cierran a las 16h, y el hueco entre el fin del parque y el comienzo de los shows se resuelve cenando en la propia Bonnie's. Junto con el Dreams Park Show, en el km 8 de la misma avenida, es lo que Foz tiene para ofrecer después de que la naturaleza cierra las puertas.",
      ],
      highlights: [
        "50 autos de cine en el Movie Cars",
        "Show de Aguas con proyecciones",
        "Lumina Park, sendero nocturno",
        "Abierto hasta las 23h",
      ],
      info: [
        {
          label: "Dónde queda",
          value:
            "BR-469, km 20 — a menos de 950 m de la entrada del Parque Nacional",
        },
        {
          label: "Horario",
          value:
            "Movie Cars y Bonnie's Burger, 11h a 23h · Show de Aguas y Lumina Park, desde las 20h",
        },
        {
          label: "Tiempo sugerido",
          value: "2 a 4 horas, según cuántas atracciones elijas",
        },
        {
          label: "Consejo",
          value:
            "Las dos atracciones nocturnas empiezan a la misma hora — confirma la grilla de funciones antes de contar con ambas.",
        },
      ],
    },
    "helisul-experience-helicoptero-cataratas": {
      tagline:
        "Diez minutos en el aire y el único ángulo de las Cataratas que el suelo no entrega.",
      description: [
        "Desde el suelo ves las Cataratas de frente; desde el aire ves su forma. El sobrevuelo muestra la herradura entera de una vez, la Garganta del Diablo vista desde arriba y el dibujo del río Iguazú abriéndose en decenas de brazos antes de caer — geografía que ninguna pasarela logra explicar.",
        "Helisul opera estos vuelos desde 1972 y ya llevó a más de cinco millones de pasajeros, lo que la convierte en una de las operaciones aéreas turísticas más antiguas del país. Los vuelos salen todos los días, de 9h a 16:30 — la misma ventana del Parque Nacional, y no es casualidad: el sobrevuelo está pensado para ocurrir dentro del día de las Cataratas.",
        "Y acá va la expectativa que hay que ajustar: el vuelo dura cerca de 10 minutos. El programa completo, con traslado, check-in, pesaje y briefing de seguridad, ocupa de 1 a 2 horas. Es la mayor diferencia entre tiempo comprometido y tiempo de experiencia de cualquier atractivo de Foz — y aun así quien lo hace rara vez se arrepiente.",
        "Ser corto es lo que lo hace encajar cuando el día ya está lleno: se suma a las 3 horas del sendero de las Cataratas y todavía sobra la tarde. Lo que no cabe es sumar el Macuco Safari el mismo día — ahí la cuenta se rompe. El vuelo depende del clima y del techo de nubes, así que nunca debe ser el compromiso inaplazable de la agenda: si se cancela, querés que el resto del día siga en pie.",
      ],
      highlights: [
        "Vuelo de 10 minutos",
        "La herradura entera de una vez",
        "Operando desde 1972",
        "Mismo corredor de las Cataratas",
      ],
      info: [
        {
          label: "Dónde queda",
          value:
            "Av. das Cataratas, 11130 — frente a la entrada del Parque Nacional, en el km 16,5",
        },
        { label: "Horario", value: "Todos los días, 9h a 16:30" },
        {
          label: "Tiempo sugerido",
          value: "1 a 2 horas en total; el vuelo en sí dura 10 minutos",
        },
        {
          label: "Consejo",
          value:
            "Depende del clima y del techo de nubes — nunca dejes el vuelo como compromiso inaplazable del día.",
        },
      ],
    },
    "eco-park-foz": {
      tagline:
        "Cetrería, caballo criollo y minigranja, con dos shows en horario fijo.",
      description: [
        "El Dreams Eco Park es, ante todo, un centro de acogida y recuperación de animales — sobre todo aves rapaces. Ese trabajo es el que sostiene la atracción principal: la cetrería, arte milenario de entrenar aves de caza, presentada en el Vuelo Libre de las Aves. Ver a un gavilán o a una lechuza salir del brazo del cetrero y volver es una escena que ningún vivero entrega.",
        "El segundo eje es el caballo criollo, raza que carga la tradición ganadera del sur, presentada en el show Criollo: el Caballo de Oro. Y está la Minigranja, donde viven los demás animales acogidos y donde la visita se vuelve contacto directo — la parte que mejor funciona con niños pequeños.",
        "Aquí el reloj decide todo, y es el detalle que la mayoría descubre demasiado tarde. El parque abre en dos ventanas, de 9h a 12:30 y de 14:30 a 18h, y los dos shows tienen horario fijo: el Caballo de Oro a las 10h y a las 15:30, el Vuelo Libre a las 10:30 y a las 16h. Fíjate que quedan a 30 minutos uno del otro en cada turno — quien llega a las 10h o a las 15:30 ve los dos; quien llega a las 11h o a las 17h no ve ninguno y conoce solo la Minigranja.",
        "Queda en la Av. das Cataratas, 8100, la misma dirección del Dreams Park Show, lo que vuelve natural la dupla en itinerarios de 4 días o más. Y no lo confundas con el Parque de las Aves: allá son viveros inmersivos de aves de la Mata Atlántica al lado del Parque Nacional; aquí la propuesta es cetrería, caballos y granja, con show en horario fijo. Son experiencias distintas con animales — no una sustituta de la otra.",
      ],
      highlights: [
        "Vuelo Libre de las Aves",
        "Show del caballo criollo",
        "Cetrería y aves rapaces",
        "Minigranja",
      ],
      info: [
        {
          label: "Dónde queda",
          value:
            "Av. das Cataratas, 8100 — la misma dirección del Dreams Park Show",
        },
        { label: "Horario", value: "Todos los días, 9h a 12:30 y 14:30 a 18h" },
        {
          label: "Shows",
          value:
            "Caballo de Oro a las 10h y 15:30 · Vuelo Libre a las 10:30 y 16h",
        },
        {
          label: "Consejo",
          value:
            "Llega a las 10h o a las 15:30 para ver los dos shows — quien llega a las 11h o 17h no ve ninguno.",
        },
      ],
    },
    "ecomuseu-itaipu": {
      tagline:
        "Una hora de exposiciones sobre la Mata Atlántica y el Lago de Itaipú, con entrada libre.",
      description: [
        "El Ecomuseo cuenta la región trinacional por tres caminos distintos, en cuatro paradas y cerca de una hora. La Ciencia en la Esfera usa tecnología inmersiva para explicar el planeta y sus fenómenos en una proyección esférica. El Territorio Ilustrado reúne 25 acuarelas de la flora regional, de Thaís Regina Marcon, con el nivel de detalle que solo la ilustración botánica alcanza. Y el Territorio Revelado trae las fotografías de Edino Krug sobre los paisajes del Lago de Itaipú y de la región costera.",
        "Es la contraparte de la represa: donde la visita a la usina muestra la ingeniería, aquí aparece lo que vino antes y lo que quedó después — la Mata Atlántica, el lago formado por el embalse y la vida de la región que la obra transformó. Libre para todas las edades, y una hora alcanza.",
        "La entrada es libre y no exige reserva, pero hay tres exigencias que sorprenden: documento de identidad con foto oficial, registro de visita en un formulario que se completa en la recepción, y el hecho de que la atención se hace solamente en portugués. Hay estacionamiento para autos y motos.",
        "La agenda es el punto crítico del corredor. El Ecomuseo abre de miércoles a lunes, de 8:30 a 16h — o sea, cierra los martes, exactamente como el Refugio Biológico Bela Vista. Quien reserve el martes para el eje de Itaipú pierde los dos de una vez y se queda solo con las visitas a la represa, que funcionan todos los días.",
      ],
      highlights: [
        "Ciencia en la Esfera",
        "25 acuarelas de la flora regional",
        "Fotografía del Lago de Itaipú",
        "Entrada libre",
      ],
      info: [
        {
          label: "Dónde queda",
          value: "Complejo Turístico de Itaipú — Av. Tancredo Neves",
        },
        {
          label: "Horario",
          value: "Mié a lun, 8:30 a 16h · cierra los martes",
        },
        { label: "Tiempo sugerido", value: "Cerca de 1 hora, en 4 paradas" },
        {
          label: "Consejo",
          value:
            "Entrada libre, pero exige documento con foto y registro en la recepción. La atención es solo en portugués.",
        },
      ],
    },
    "aguaray-eco-esportes": {
      tagline:
        "4,5 km de sendero, 2 km de remada y baño en dos cascadas del río Tamanduá.",
      description: [
        "La Expedición Iguazú es un recorrido encadenado, no una actividad suelta. Empieza a pie por el Sendero Ecológico del Indio hasta la base de canotaje, en la orilla del río Iguazú, con la caminata acompañada de una lectura de la Mata Atlántica, del bioma y de la cultura local. En la base vienen las instrucciones y los equipos de seguridad, provistos por el propio atractivo.",
        "Ahí embarcas. La remada sigue rumbo al río Tamanduá, en un tramo suave y sin correntada, y termina en un desembarco para otro sendero, ahora hasta la Cascada da Toca — donde la parada es para bañarse, no para fotografiar de lejos. La vuelta es en kayak, con la Cascada do Juruvá apareciendo al final del recorrido antes del sendero de regreso.",
        "Son 4,5 km de caminata y 2 km de remada, en cerca de tres horas y media de dificultad moderada. Dos salidas por día, a las 9h y a las 14:30, de martes a domingo — cierra los lunes. Edad mínima de 10 años, y los menores de 18 necesitan autorización de los padres.",
        "Dos cosas separan este paseo de todo el resto del catálogo. La primera es que el transporte hasta el lugar no está incluido: queda en Remanso Grande, fuera del corredor turístico, y llegar corre por tu cuenta. La segunda es que la estructura es deliberadamente simple — baño ecológico, sin venta de comida ni bebida. Lleva agua, repelente, protector, ropa y calzado extra para cambiarte al final, y calzado cerrado que pueda mojarse. Las ojotas y sandalias no entran.",
      ],
      highlights: [
        "4,5 km de sendero y 2 km de remada",
        "Baño en la Cascada da Toca",
        "Equipo de seguridad incluido",
        "Salidas a las 9h y 14:30",
      ],
      info: [
        {
          label: "Dónde queda",
          value: "Alameda Caeté, Remanso Grande — fuera del corredor turístico",
        },
        {
          label: "Horario",
          value: "Mar a dom, salidas a las 9h y a las 14:30 · cierra los lunes",
        },
        {
          label: "Tiempo sugerido",
          value: "Cerca de 3h30, con 4,5 km de sendero y 2 km de remada",
        },
        {
          label: "Consejo",
          value:
            "El transporte hasta el lugar no está incluido, y no hay venta de comida ni bebida. Lleva agua.",
        },
      ],
    },
    "gran-aventura": {
      tagline:
        "6 km por el Sendero Yacaratiá hasta Puerto Macuco, y de ahí en bote a la base de los saltos.",
      description: [
        "El Gran Aventura ocurre dentro del Parque Nacional Iguazú y empieza lejos del agua: un transporte recorre 6 kilómetros por el Sendero Yacaratiá, tramo de selva subtropical cerrada, hasta Puerto Macuco. Ahí te pones el chaleco y embarcas — y desde ahí el bote baja rumbo a la parte inferior de los saltos.",
        "La promesa es simple y se cumple: un baño de cascada. El bote entra en la zona de rocío, pasa por la Isla Martín y muestra el conjunto desde un ángulo que las pasarelas del parque no alcanzan, porque ellas miran desde arriba y desde aquí miras hacia arriba. Quien hace las pasarelas ve la escala; quien hace el bote siente el peso del agua.",
        "No está incluido en la entrada del parque — es una entrada aparte, aunque existen combinados que juntan las dos. Y depende del mismo tren panorámico que sirve al resto del parque: de la Estación Central salen los vagones hacia la Estación Cataratas y hacia la Garganta del Diablo, y el recorrido hasta el puerto se encaja en ese flujo.",
        "Es aquí donde la cuenta del día argentino se aprieta del todo. El parque cierra a las 16h, los tres circuitos ya piden de 5 a 6 horas, y el Gran Aventura suma su propio tiempo. Contando la frontera y la hora de trayecto desde Foz, quien quiere bote y pasarelas el mismo día tiene que entrar en la apertura — no hay versión relajada de esa combinación.",
      ],
      highlights: [
        "6 km por el Sendero Yacaratiá",
        "Embarque en Puerto Macuco",
        "Paso por la Isla Martín",
        "Baño en la base de los saltos",
      ],
      info: [
        {
          label: "Dónde queda",
          value: "Dentro del Parque Nacional Iguazú — Ruta 101, km 142",
        },
        {
          label: "Cómo se llega",
          value:
            "Tren panorámico + 6 km por el Sendero Yacaratiá hasta Puerto Macuco",
        },
        {
          label: "Tiempo sugerido",
          value: "2 a 3 horas, además de los circuitos de pasarela",
        },
        {
          label: "Consejo",
          value:
            "Se suma al día argentino, que ya pide 5 a 6 horas y cierra a las 16h — solo entra si llegas en la apertura.",
        },
      ],
    },
    "madero-tango-iguazu": {
      tagline:
        "1h30 de tango en el Casino Iguazú, con funciones a las 20:30 y 22:30 — y clase al final.",
      description: [
        "Son cerca de 1h30 de espectáculo, con bailarines y músicos en vivo contando la historia del tango — nacido a fines del siglo XIX en las orillas del Río de la Plata, en Buenos Aires. El show no es solo contemplación: termina con una clase rápida en la que se invita al público a bailar. Es la parte de la que más se habla después.",
        "Existen dos formatos, y la diferencia importa a la hora de elegir. El de cena trae el espectáculo acompañado de menú completo, con bebidas cobradas aparte. El de show reúne las modalidades Ejecutivo y VIP, donde la única distinción es la ubicación del asiento en el salón — y ahí la comida no está incluida. Conviene confirmar cuál estás comprando.",
        "El espectáculo ocurre en el complejo del Casino Iguazú, en la Ruta Nacional 12, km 1640, bien cerca de la aduana de la frontera. Son dos funciones, a las 20:30 y a las 22:30, de martes a domingo. Esa segunda función es el detalle que cambia la planificación: permite que el tango entre después de otro programa de la noche, pero empuja la vuelta a Foz para después de la medianoche.",
        "Es la misma dirección donde termina el circuito by night de Puerto Iguazú — el casino es su última parada. Quien quiera encadenar los dos puede, aprovechando la función de las 22:30, pero que se prepare para una noche larga y un cruce de frontera tarde. Quien prefiere una sola cosa hace el tango a las 20:30 y vuelve con holgura.",
      ],
      highlights: [
        "1h30 de espectáculo en vivo",
        "Clase de tango al final",
        "Funciones a las 20:30 y 22:30",
        "En el complejo del Casino Iguazú",
      ],
      info: [
        {
          label: "Dónde queda",
          value:
            "Casino Iguazú — Ruta Nacional 12, km 1640, cerca de la aduana",
        },
        {
          label: "Funciones",
          value: "Mar a dom, a las 20:30 y a las 22:30 · cierra los lunes",
        },
        {
          label: "Tiempo sugerido",
          value: "1h30 de espectáculo; 3 a 5 horas con traslado y frontera",
        },
        {
          label: "Consejo",
          value:
            "La función de las 22:30 permite encadenar con otro programa, pero deja la vuelta a Foz para después de la medianoche.",
        },
      ],
    },
    "blue-park-foz": {
      tagline:
        "Piscina de olas de 1,20 m, río lento y un tobogán de 18 metros a 60 km/h.",
      description: [
        "El Blue Park es el parque acuático de Foz do Iguaçu: 62 mil metros cuadrados en la Avenida das Cataratas, con estructura nueva, paisajismo cuidado y los mascotas del parque — yaguareté, tucán, coatí — repartidos por los senderos.",
        "La atracción central es la playa de olas: una piscina amplia con nueve tipos de ola, que llegan a 1,20 metro, rodeada por una franja de arena y reposeras. A su lado están el río lento, para dejarse llevar sobre una boya, y los toboganes — cuatro pistas de más de 100 metros en el Fast Falls, y el Super Maverick, de 18 metros de altura, que alterna tramos abiertos y cerrados y llega a 60 km/h en la bajada. Para los más chicos está el Kids Town, con balde de agua y toboganes, y un área baby pensada para bebés de 6 meses a 2 años.",
        "Dos experiencias quedan fuera de la entrada común y se contratan aparte: el wakeboard en el lago y la tirolesa de 300 metros de extensión por 30 de altura, que cruza el parque por arriba. Hay cafeterías repartidas por el predio y un bar dentro de la piscina.",
        "Un punto que suele generar expectativa equivocada: el agua viene del Acuífero Guaraní y ronda los 28 °C en la superficie. Es una temperatura agradable con el calor de Foz, pero no son termas — en un día frío de invierno el parque rinde mucho menos. Queda junto al Mabu Thermas Grand Resort y está incluido en la tarifa de quien se hospeda allí, pero el acceso no es exclusivo de huéspedes: hay day use para visitantes.",
      ],
      highlights: [
        "Playa con olas de hasta 1,20 m",
        "Super Maverick, 18 m a 60 km/h",
        "Río lento y Kids Town",
        "Agua a 28 °C del Acuífero Guaraní",
      ],
      info: [
        {
          label: "Dónde queda",
          value:
            "Rua Carlos Hugo Urnau, 756 — junto al Mabu Thermas, en la Av. das Cataratas",
        },
        {
          label: "Temperatura del agua",
          value: "Cerca de 28 °C en la superficie, del Acuífero Guaraní",
        },
        { label: "Tiempo sugerido", value: "Medio día a un día" },
        {
          label: "Consejo",
          value:
            "El wakeboard y la tirolesa se contratan aparte de la entrada común.",
        },
      ],
    },
    "iguassu-secret-falls": {
      tagline:
        "De 2 horas a un día entero: hasta 10 cascadas escondidas en senderos guiados de Foz.",
      description: [
        "Las cascadas existen, son muchas y casi nadie las conoce — porque están en senderos y ríos repartidos por la región, lejos del circuito de miradores del Parque Nacional. La propuesta acá es llegar hasta ellas con guía y meterse al agua: el baño es el punto del paseo, no una parada para la foto.",
        "Lo que diferencia a este atractivo es la escala de opciones. El sendero único llega a dos cascadas en dos horas, con dos horarios de salida — es la única forma de conocer una cascada secreta sin sacrificar un día. El medio día aumenta la cantidad de caídas, y la versión de día entero recorre cuatro senderos y diez cascadas, de 8:30 a 18h.",
        "Están además las expediciones largas, de ocho horas cada una. La Tamanduá cubre 3,5 km de monte y varias caídas buenas para nadar y saltar. La Carimã recorre 3 km hasta las nacientes del Río Ouro Verde, pasa por el Vivero Municipal y termina en tres cascadas del Río Carimã. Y existe el Luau Secret Falls, de seis horas, que cambia el día por la noche: sendero nocturno, chapuzón en el río Iguazú, picnic, fogata y música en vivo.",
        "Todo funciona con reserva previa — no es un atractivo de llegar y entrar. El punto de encuentro queda en la Rua Manêncio Martins, 21, en Vila Yolanda, junto al Camping Internacional, y desde allí el grupo se traslada a los senderos. Lleva calzado cerrado de trekking, ropa que pueda mojarse, ropa de baño y protección impermeable para el celular.",
      ],
      highlights: [
        "Hasta 10 cascadas en un día",
        "Sendero único de 2 horas",
        "Luau con sendero nocturno",
        "Expediciones Tamanduá y Carimã",
      ],
      info: [
        {
          label: "Punto de encuentro",
          value:
            "R. Manêncio Martins, 21, Vila Yolanda — junto al Camping Internacional",
        },
        {
          label: "Modalidades",
          value:
            "Sendero único 2h · medio día · día entero (8:30–18h) · Luau 6h · expediciones 8h",
        },
        {
          label: "Ritmo",
          value: "Aventura y naturaleza — leve a moderado, según la opción",
        },
        {
          label: "Consejo",
          value:
            "Solo con reserva previa. La dirección es el punto de encuentro; los senderos quedan en otros puntos de la región.",
        },
      ],
    },
    "la-aripuca": {
      tagline:
        "Una trampa guaraní a escala gigante, levantada con madera nativa recuperada.",
      description: [
        "La aripuca es una trampa de caza guaraní: una estructura de troncos que se sostiene por su propio peso y cae sobre la presa. Aquí fue construida a escala gigante, y el material es lo que le da sentido al lugar — madera recuperada de especies nativas de la selva paranaense, árboles que ya habían caído o sido talados. La metáfora es explícita: la trampa que atrapaba animales se volvió el símbolo de lo que aprisiona a la selva.",
        "Alrededor de la estructura hay senderos interpretativos y construcciones ecológicas que contextualizan la selva misionera y el saber guaraní. Las artesanías en madera las hacen productores locales, y hay restaurante con sabores regionales, heladería y cafetería dentro del parque — se puede hacer una pausa sin salir del lugar.",
        "La visita es corta, de 30 minutos a una hora, y vale más por el contenido que por la extensión. Funciona bien con chicos, con grupos y con quien quiere entender la selva que rodea las Cataratas en lugar de solo fotografiarla.",
        "Queda en la RN 12, km 4½, en la misma ruta que une Puerto Iguazú con el parque y con la frontera, y abre todos los días de 9 a 18 hs. Como las Cataratas argentinas cierran a las 16h, entra en la vuelta del parque — o en medio día urbano, junto con el Hito Tres Fronteras y la feria del centro. Se necesita documento de identidad original para cruzar.",
      ],
      highlights: [
        "Trampa guaraní a escala gigante",
        "Madera nativa recuperada",
        "Senderos interpretativos",
        "Restaurante y artesanía local",
      ],
      info: [
        {
          label: "Dónde queda",
          value:
            "RN 12, km 4½ — en la ruta que une Puerto Iguazú con el parque y la frontera",
        },
        { label: "Horario", value: "Todos los días, 9 a 18 hs" },
        { label: "Tiempo sugerido", value: "30 minutos a 1 hora" },
        {
          label: "Consejo",
          value:
            "Cierra a las 18h y las Cataratas argentinas a las 16h — entra en la vuelta del parque.",
        },
      ],
    },
    "compras-paraguai-ciudad-del-este": {
      tagline:
        "El polo de electrónica y perfumería del otro lado del Puente de la Amistad — y cierra a las 16h.",
      description: [
        "El Puente de la Amistad tiene poco más de 500 metros, y del otro lado empieza Ciudad del Este — segunda ciudad más grande de Paraguay y uno de los mayores polos de comercio importado de Sudamérica. Lo que le interesa al visitante está concentrado en las primeras cuadras después del puente: electrónica, perfumería, cosméticos, anteojos, relojes, juguetes y artículos para el hogar, entre galerías de calle y direcciones consolidadas como Shopping China, Mona Lisa, Casa Rica y las tiendas de Nissei.",
        "El horario es el dato que cambia el día. El comercio abre temprano, cerca de las 7 u 8 de la mañana, y empieza a cerrar entre las 15 y las 16h. El sábado la mayoría cierra cerca del mediodía, y el domingo casi nada abre. Es lo opuesto al resto del catálogo: no existe una versión de fin de tarde de este paseo, y no sirve para llenar el tiempo que sobró de otro programa — tiene que ser la mañana del día.",
        "El cuello de botella no es la distancia, es el puente. En hora pico la fila de autos detenida sobre el río Paraná consume más tiempo que todo el cruce a pie. Por eso la costumbre local es dejar el auto en Foz y cruzar caminando, en taxi o en colectivo — la caminata lleva pocos minutos y devuelve el control del reloj, que es justamente lo que define si vas a comprar antes de que cierren.",
        "Como el comercio termina a media tarde, queda la tarde libre — y la respuesta más cercana está a 10 km: los Saltos del Monday, en Presidente Franco, abiertos hasta las 19h. Compras por la mañana y cascada por la tarde cierran un día paraguayo completo sin cruzar el puente dos veces. Para cruzar se necesita documento de identidad original y en buen estado, y a la vuelta a Brasil rigen las reglas de cupo de la Receita Federal.",
      ],
      highlights: [
        "Polo de electrónica y perfumería",
        "Justo después del Puente de la Amistad",
        "El comercio cierra entre 15 y 16h",
        "Saltos del Monday a 10 km",
      ],
      info: [
        {
          label: "Dónde queda",
          value:
            "Ciudad del Este, Alto Paraná — primeras cuadras después del Puente de la Amistad",
        },
        {
          label: "Horario",
          value:
            "Comercio de 7/8h a 15 o 16h · sábado hasta el mediodía · domingo casi todo cerrado",
        },
        {
          label: "Tiempo sugerido",
          value: "Una mañana; día entero solo sumando los Saltos del Monday",
        },
        {
          label: "Consejo",
          value:
            "Deja el auto en Foz y cruza a pie o en taxi — el cuello de botella es la fila del puente, no la distancia.",
        },
      ],
    },
    "hito-tres-fronteras": {
      tagline:
        "El hito argentino de la triple frontera: al aire libre, sin portería y sobre la confluencia de los ríos.",
      description: [
        "Son tres hitos, uno en cada país, y cada uno pintado con sus colores: el argentino en celeste y blanco, el brasileño en verde y amarillo, el paraguayo en rojo, blanco y azul. Este es el argentino, en el punto donde el río Iguazú desemboca en el Paraná — desde el mirador ves los otros dos del otro lado del agua, y la frontera deja de ser una línea en el mapa para volverse un paisaje.",
        "El lugar fue puesto en valor y hoy es mucho más que el obelisco: paseo al borde de la barranca, plaza con anfiteatro, feria de artesanos y opciones de comida alrededor. Es un área pública al aire libre, de entrada libre, y no tiene molinete ni horario de visita.",
        "Y ahí es justamente donde resuelve un problema del itinerario. El Marco das Três Fronteiras, del lado brasileño, cobra entrada, abre recién a las 13h30 y cierra los lunes — así que un lunes el Hito es la única manera de ver la confluencia de los ríos. Vale también para quien llega demasiado tarde cualquier día: acá no hay boletería que cierre.",
        "El horario justo es el fin de la tarde, y encadena bien con el resto del día argentino: las Cataratas de ese lado cierran a las 16h, La Aripuca abre hasta las 18h sobre la RN 12 del camino de vuelta, y el Hito se queda con la puesta de sol. Si el día es urbano, el trío clásico es Hito, la feria de la Av. Brasil y La Aripuca en un solo medio día. Se necesita documento de identidad original para cruzar la frontera.",
      ],
      highlights: [
        "Los tres hitos a la vista",
        "Mirador sobre la confluencia",
        "Entrada libre, al aire libre",
        "Abierto cuando el Marco brasileño cierra",
      ],
      info: [
        {
          label: "Dónde queda",
          value:
            "Av. Río Iguazú, Puerto Iguazú — confluencia de los ríos Iguazú y Paraná",
        },
        {
          label: "Entrada",
          value: "Área pública al aire libre, de entrada libre",
        },
        {
          label: "Tiempo sugerido",
          value: "1 a 2 horas, con la puesta de sol en el medio",
        },
        {
          label: "Consejo",
          value:
            "El lunes es su día: el Marco brasileño cierra, y acá no hay boletería ni horario.",
        },
      ],
    },
    "duty-free-shop-puerto-iguazu-argentina": {
      tagline:
        "La tienda libre justo después de la aduana argentina — perfumería, bebidas y electrónica sin impuestos.",
      description: [
        "El free shop queda justo después del puesto aduanero argentino, sobre la RN 12, antes incluso de entrar a Puerto Iguazú. Es una tienda libre de verdad: los productos no pagan impuesto de importación, y por eso perfumería, bebidas destiladas, cosméticos, chocolates y electrónica suelen ser el motivo declarado del cruce.",
        "La diferencia con Ciudad del Este es de naturaleza, no de tamaño. Allá caminas por galerías de calle y comparas entre decenas de tiendas; acá es una única dirección climatizada, con marcas definidas y atención en portugués. Quien quiere rebuscar va a Paraguay; quien quiere resolver rápido y sin lío viene acá.",
        "Las compras son en dólares y la tarjeta funciona normalmente. A la vuelta a Brasil rigen las reglas de cupo de exención de la Receita Federal, las mismas de cualquier frontera terrestre y por persona — verifica el valor vigente antes de cruzar, porque se actualiza periódicamente.",
        "Medio día alcanza con holgura, y eso es lo que vuelve al free shop fácil de encajar: queda camino a las Cataratas argentinas, al Hito Tres Fronteras y a La Aripuca, todos sobre la misma RN 12. Se exige documento de identidad original — estás cruzando una frontera internacional, y una copia o una foto en el celular no sirve.",
      ],
      highlights: [
        "Tienda libre, sin impuesto de importación",
        "Justo después de la aduana argentina",
        "Una sola dirección climatizada",
        "Sobre la RN 12, camino a las Cataratas AR",
      ],
      info: [
        {
          label: "Dónde queda",
          value:
            "RN 12, justo después de la aduana argentina — antes de entrar a Puerto Iguazú",
        },
        {
          label: "Documento",
          value:
            "Identidad original obligatoria: cruzas una frontera para llegar",
        },
        { label: "Tiempo sugerido", value: "Medio día" },
        {
          label: "Consejo",
          value:
            "Queda camino a las Cataratas argentinas, al Hito y a La Aripuca — súmalo a uno de esos días en vez de gastar un cruce entero solo con él.",
        },
      ],
    },
    "aeroporto-checkin-checkout-hotel": {
      tagline:
        "Del aterrizaje al hotel, y de vuelta al aeropuerto para el embarque — sin depender de una app.",
      description: [
        "El primer y el último tramo son los que más influyen en cómo comienza y termina un viaje. Llegar a Foz do Iguaçu y perseguir el hotel en el tránsito, o bajar del vuelo y quedar a merced de una app con tarifa de hora punta, es la fricción que mancha la llegada — y la partida, con maleta, apuro y horario de vuelo, es peor si se deja para el final.",
        "El traslado al aeropuerto lo resuelve con un plan combinado: el conductor espera tu llegada, ayuda con las maletas y te lleva directo al hotel; a la vuelta, te recoge a la hora justa para llegar con margen al check-in del vuelo. Quien se hospeda en Foz tiene la misma lógica: el servicio cubre el trayecto entre el hotel y cualquier punto de la ciudad, incluso el aeropuerto, sin la ruleta de la app ni la lista de espera.",
      ],
      highlights: [
        "Del aeropuerto al hotel en la llegada",
        "Del hotel al aeropuerto en la partida",
        "Espera del vuelo y maletas incluidas",
        "Sin depender de una app",
      ],
      info: [
        { label: "Dónde queda", value: "Aeropuerto Internacional de Foz do Iguaçu y hoteles de la ciudad" },
        { label: "Horario", value: "Flexible — combinado según el horario del vuelo" },
        { label: "Consejo", value: "Combina la recogida de vuelta con antelación para llegar con margen al check-in del vuelo." },
      ],
    },
  },
};

/**
 * Nome + tagline de um atrativo NOS TRÊS IDIOMAS, para superfícies que trocam de idioma sem
 * recarregar e não podem importar este dicionário.
 *
 * ⚠️⚠️ O caso é o modal de captura: ele tem seletor de idioma próprio, mas recebe o item pelo `detail`
 * do evento de abertura — um SNAPSHOT do clique. Trocar o idioma lá dentro não retraduzia o card do
 * assunto, porque a string já tinha sido resolvida na página. Passar as três versões resolve sem que
 * o modal (montado em TODA página) carregue os ~230 KB deste arquivo.
 * ⓘ `cardLabel`: usa a cascata do card (`CARD_LABELS` → `ATTRACTION_NAMES`), que é o rótulo curto que
 * o visitante viu antes de abrir o modal. Sem a flag, vale o nome oficial da página.
 */
export function attractionSubjectI18n(
  slug: string,
  fallback: { name: string; tagline: string },
  opts?: { cardLabel?: boolean },
): Record<Locale, { title: string; subtitle: string }> {
  const um = (l: Locale) => ({
    title:
      (opts?.cardLabel ? CARD_LABELS[l][slug] : undefined) ??
      ATTRACTION_NAMES[l][slug] ??
      fallback.name,
    subtitle: ATTRACTIONS_I18N[l][slug]?.tagline ?? fallback.tagline,
  });
  return { pt: um("pt"), en: um("en"), es: um("es") };
}
