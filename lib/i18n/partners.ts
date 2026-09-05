// Filepath: lib/i18n/partners.ts
// Version: 1.0
// Nome da Versão: "Conteúdo textual dos parceiros reais (Patanegra + Cantina La Gregoria) — pt/en/es"
//
// `app/data/partners.ts` guarda os FATOS/estrutura (slug, name, address, whatsapp, urls, imagens) — isso
// fica intacto, inclusive `name` (nome da marca, nome próprio). `seoTitle`/`seoDescription` também ficam
// só em `partners.ts` (metadata da página do parceiro é sempre pt — canônico de SEO). Aqui só o TEXTO de
// marketing/copy do parceiro (tagline, descrição, destaques, cardápio, prêmios, mensagens) ganha versão
// por locale. Tradução de copy de negócio de parceiro pagante — decisão do usuário (jul/2026).

import type { Locale } from "./config";
import type { Partner } from "@/app/types";

export interface PartnerMenuItemI18n {
  name?: string;
  desc?: string;
  badge?: string;
}
export interface PartnerMenuGroupI18n {
  groupLabel: string;
  note?: string;
  items: PartnerMenuItemI18n[];
}
export interface PartnerI18n {
  businessType?: string;
  tagline: string;
  description: string[];
  ctaLabel?: string;
  whatsappMessage?: string;
  highlights?: string[];
  hours?: string[];
  features?: { title: string; text: string }[];
  serviceHighlight?: { title: string; text: string; items?: string[]; ctaLabel?: string };
  menu?: PartnerMenuGroupI18n[];
  awards?: { title: string; text: string; points?: string[] };
  closing?: { text: string };
}

export const PARTNERS_I18N: Record<Locale, Record<string, PartnerI18n>> = {
  pt: {
    "patanegra-cervejaria": {
      businessType: "Cervejaria",
      tagline: "Peça agora mesmo o Chope artesanal mais premiado, entregue gelado onde você estiver — em Foz do Iguaçu e região.",
      description: [
        "Mais que cerveja, um estilo de vida. A Patanegra é a cervejaria de chope especial mais premiada de Foz do Iguaçu — puro malte, padrão rigoroso de pureza e aquele frescor de fábrica que vai do tanque direto pro seu copo.",
        "Bateu a vontade? É só pedir. O delivery próprio leva o seu chope gelado, na temperatura certa, até a sua casa ou local que precisar — com a agilidade de quem leva cerveja a sério. São mais de 15 estilos pra escolher: da Pilsen clássica aos chopes de vinho e às sours frutadas.",
      ],
      ctaLabel: "Fazer pedido",
      whatsappMessage: "Olá, Patanegra! Vim pelo site da Compras Paraguay e quero fazer um pedido de chopp. Pode me ajudar?",
      highlights: ["Delivery", "Entrega gelada", "Foz e região", "Puro malte", "Chope de vinho", "+15 estilos"],
      hours: ["Atendimento e delivery: todos os dias", "Pedidos pelo site, WhatsApp e Instagram"],
      features: [
        { title: "Cervejaria premiada", text: "Eleita entre as melhores cervejarias especiais, com medalhas de ouro, prata e bronze. Qualidade reconhecida em cada copo." },
        { title: "Delivery gelado", text: "Frota própria que leva o seu chope na temperatura ideal até você, em Foz do Iguaçu e região. Pediu, chegou gelado." },
        { title: "Frescor de fábrica", text: "Envase rápido que preserva os aromas e sabores originais. Do tanque direto pro seu copo, sem perder o frescor." },
        { title: "Mais de 15 estilos", text: "Da Pilsen clássica aos chopes de vinho, IPAs e sours frutadas. Tem o chope certo pra cada momento e paladar." },
      ],
      serviceHighlight: {
        title: "Vai preparar um evento em Foz?",
        text: "Festa, casamento ou confraternização da empresa? A Patanegra monta a experiência completa de chopeira: instalação técnica profissional, barris de 30L e 50L e a garantia de eficiência e qualidade do produto. E pra você não errar na quantidade, eles têm uma calculadora de chopp no próprio site que estima exatamente quanto pedir, sem desperdício.",
        items: ["Chopeira profissional instalada", "Cilindro de CO₂", "Barris de 30L e 50L", "Copos (se necessário)"],
        ctaLabel: "Calcular e pedir no site",
      },
      menu: [
        {
          groupLabel: "Chopes mais pedidos — Growler 1L",
          items: [
            { name: "Pilsen Cristal", desc: "Clara, leve e refrescante, de baixo amargor. A queridinha dos brasileiros.", badge: "Campeão de vendas" },
            { name: "Chopp de Vinho Branco", desc: "Fermentado de uvas Moscato, levemente adocicado. Perfeito pra dias quentes.", badge: "Mais pedido" },
            { name: "Chopp de Vinho Tinto", desc: "Uvas Isabel e Bordeaux, com perfil frisante e creme marcante.", badge: "Mais pedido" },
            { name: "Session IPA", desc: "Leve, dourada e super refrescante, com amargor moderado e aroma cítrico intenso.", badge: "Mais pedido" },
            { name: "Hefe Weiss", desc: "Cerveja de trigo turva e encorpada, com espuma espessa e notas de cravo e banana." },
            { name: "Sour Frutas Vermelhas", desc: "Coloração rosa, com morango, framboesa e amora. Corpo leve e acidez balanceada." },
          ],
        },
        {
          groupLabel: "Barris para a sua festa, social ou evento",
          note: "Mais de 15 estilos disponíveis em barris de 30L e 50L. Fala com a gente pra montar o seu.",
          items: [
            { name: "Barril Pilsen 30L", desc: "Rende cerca de 60 copos de 500 ml. O clássico que agrada todo mundo.", badge: "Campeão de vendas" },
            { name: "Barril Premium Lager 30L", desc: "Dourada, maltada e cremosa, de corpo médio e amargor moderado.", badge: "Mais pedido" },
            { name: "Barril Vinho Branco 30L", desc: "O nosso chopp de vinho Moscato em barril — levemente adocicado e refrescante, sucesso garantido.", badge: "Mais pedido" },
            { name: "Barril Pilsen 50L", desc: "Pra festas grandes, com o melhor custo por litro.", badge: "Campeão de vendas" },
          ],
        },
      ],
      awards: {
        title: "A cervejaria de chope mais premiada de Foz",
        text: "Não é por acaso. A Patanegra é hoje a maior referência em chope especial de Foz do Iguaçu e região — reconhecida por qualidade e pureza nas principais premiações do setor.",
        points: ["Presente nos maiores e melhores eventos da região", "Nos principais pontos comerciais da cidade", "A escolha número 1 dos consumidores"],
      },
      closing: {
        text: "Mais que cerveja, um estilo de vida. Peça o seu chopp Patanegra e entregamos o sabor e frescor gelado de fábrica até você — em Foz do Iguaçu e região.",
      },
    },
    "cantina-la-gregoria": {
      businessType: "Pizzaria",
      tagline: "A pizzaria mais charmosa de Foz do Iguaçu: pizza artesanal em rodízio, à la carte e delivery — massa no ponto e aquele capricho de família.",
      description: [
        "No coração do Centro de Foz do Iguaçu, a Cantina La Gregoria traz o aconchego de uma verdadeira cantina italiana. A pizza é feita com massa artesanal, ingredientes selecionados e o capricho de quem trata pizza como arte — do clássico salgado à surpreendente pizza de chocolate.",
        "De terça a domingo, você escolhe: o rodízio, para provar de tudo à vontade, ou o à la carte, para montar a sua no tamanho que quiser — do brotinho à gigante. E se a vontade bater em casa, o delivery leva a La Gregoria até você.",
      ],
      ctaLabel: "Cardápio/pedido",
      whatsappMessage: "Olá, Cantina La Gregoria! Vim pelo site da Compras Paraguay e quero fazer um pedido ou uma reserva. Podem me ajudar?",
      highlights: ["Rodízio", "À la carte", "Delivery", "Massa artesanal", "Pizza de chocolate", "Vinhos selecionados"],
      hours: ["Terça a domingo: 18h30 às 23h00", "Segunda-feira: fechado", "Rodízio e à la carte, de terça a domingo"],
      features: [
        { title: "Massa artesanal", text: "Massa feita no capricho, na fermentação e no ponto certos — a base de uma pizza que é levada a sério, do brotinho à gigante." },
        { title: "Rodízio à vontade", text: "De terça a domingo, o rodízio traz uma variedade de sabores salgados e doces para você provar de tudo, sem pressa." },
        { title: "Delivery", text: "A pizza da La Gregoria quentinha na sua casa ou no hotel — perfeita para relaxar depois de um dia de passeios em Foz do Iguaçu." },
        { title: "Cantina italiana", text: "O aconchego de uma cantina de verdade, no Centro de Foz, com uma carta de vinhos selecionados para acompanhar." },
      ],
      serviceHighlight: {
        title: "Uma noite especial em Foz do Iguaçu?",
        text: "Aniversário, encontro a dois ou aquele jantar em família: a Cantina La Gregoria tem o ambiente aconchegante, a pizza no capricho e uma carta de vinhos selecionados para tornar a noite memorável. Faça sua reserva pelo WhatsApp e garanta a sua mesa.",
        items: ["Reservas pelo WhatsApp", "Ambiente aconchegante de cantina", "Vinhos selecionados", "Rodízio ou à la carte"],
        ctaLabel: "Reservar pelo WhatsApp",
      },
      menu: [
        { groupLabel: "Perfeito para cada momento — do brotinho à gigante", items: [{}, {}, {}] },
        { groupLabel: "Massa tradicional, massa de chocolate, calzones e vinhos", note: "Sabores salgados e doces no rodízio, de terça a domingo.", items: [{}, {}, {}] },
      ],
      closing: {
        text: "Mais que uma pizzaria, uma cantina. Venha viver a experiência da Cantina La Gregoria no coração de Foz do Iguaçu — ou peça o delivery e traga o capricho italiano para a sua mesa.",
      },
    },
  },
  en: {
    "patanegra-cervejaria": {
      businessType: "Brewery",
      tagline: "Order the most award-winning craft draft beer right now, delivered ice-cold wherever you are — in Foz do Iguaçu and the region.",
      description: [
        "More than beer, a lifestyle. Patanegra is the most awarded specialty draft brewery in Foz do Iguaçu — pure malt, a strict purity standard, and that fresh-from-the-tank feel straight into your glass.",
        "Feeling the urge? Just order. Their own delivery brings your draft beer ice-cold, at the right temperature, to your home or wherever you need it — with the speed of people who take beer seriously. There are more than 15 styles to choose from: from the classic Pilsen to wine drafts and fruity sours.",
      ],
      ctaLabel: "Place order",
      whatsappMessage: "Hi, Patanegra! I came from the Compras Paraguay website and I'd like to place a draft beer order. Can you help me?",
      highlights: ["Delivery", "Ice-cold delivery", "Foz and region", "Pure malt", "Wine draft", "+15 styles"],
      hours: ["Service and delivery: every day", "Orders via website, WhatsApp and Instagram"],
      features: [
        { title: "Award-winning brewery", text: "Voted among the best specialty breweries, with gold, silver and bronze medals. Quality you can taste in every glass." },
        { title: "Ice-cold delivery", text: "Their own fleet brings your draft at the ideal temperature to you, in Foz do Iguaçu and the region. You order, it arrives cold." },
        { title: "Fresh from the factory", text: "Fast packaging that preserves the original aromas and flavors. Straight from the tank to your glass, without losing freshness." },
        { title: "15+ styles", text: "From the classic Pilsen to wine drafts, IPAs and fruity sours. There's the right draft for every moment and palate." },
      ],
      serviceHighlight: {
        title: "Planning an event in Foz?",
        text: "Party, wedding or company get-together? Patanegra sets up the full draft experience: professional technical installation, 30L and 50L kegs, and guaranteed product efficiency and quality. And so you don't get the quantity wrong, they have a draft calculator right on their site that estimates exactly how much to order, with no waste.",
        items: ["Professional draft system installed", "CO₂ cylinder", "30L and 50L kegs", "Cups (if needed)"],
        ctaLabel: "Calculate and order on the site",
      },
      menu: [
        {
          groupLabel: "Most ordered drafts — 1L Growler",
          items: [
            { name: "Crystal Pilsen", desc: "Light, crisp and refreshing, with low bitterness. The Brazilians' favorite.", badge: "Best seller" },
            { name: "White Wine Draft", desc: "Fermented from Moscato grapes, lightly sweet. Perfect for hot days.", badge: "Most ordered" },
            { name: "Red Wine Draft", desc: "Isabel and Bordeaux grapes, with a lightly sparkling profile and a bold creamy note.", badge: "Most ordered" },
            { name: "Session IPA", desc: "Light, golden and super refreshing, with moderate bitterness and intense citrus aroma.", badge: "Most ordered" },
            { name: "Hefe Weiss", desc: "A cloudy, full-bodied wheat beer, with a thick head and notes of clove and banana." },
            { name: "Berry Sour", desc: "Pink in color, with strawberry, raspberry and blackberry. Light body and balanced acidity." },
          ],
        },
        {
          groupLabel: "Kegs for your party, get-together or event",
          note: "More than 15 styles available in 30L and 50L kegs. Talk to us to put together yours.",
          items: [
            { name: "30L Pilsen Keg", desc: "Yields about 60 cups of 500 ml. The classic that pleases everyone.", badge: "Best seller" },
            { name: "30L Premium Lager Keg", desc: "Golden, malty and creamy, with medium body and moderate bitterness.", badge: "Most ordered" },
            { name: "30L White Wine Keg", desc: "Our Moscato wine draft in keg form — lightly sweet and refreshing, guaranteed success.", badge: "Most ordered" },
            { name: "50L Pilsen Keg", desc: "For big parties, with the best cost per liter.", badge: "Best seller" },
          ],
        },
      ],
      awards: {
        title: "The most awarded draft brewery in Foz",
        text: "It's no coincidence. Patanegra is today the top reference in specialty draft beer in Foz do Iguaçu and the region — recognized for quality and purity in the industry's top awards.",
        points: ["Present at the region's biggest and best events", "In the city's main commercial spots", "Consumers' #1 choice"],
      },
      closing: {
        text: "More than beer, a lifestyle. Order your Patanegra draft and we'll deliver factory-fresh, ice-cold flavor to you — in Foz do Iguaçu and the region.",
      },
    },
    "cantina-la-gregoria": {
      businessType: "Pizzeria",
      tagline: "The most charming pizzeria in Foz do Iguaçu: artisanal pizza all-you-can-eat, à la carte and delivery — dough just right, with that family touch.",
      description: [
        "In the heart of downtown Foz do Iguaçu, Cantina La Gregoria brings the warmth of a true Italian cantina. The pizza is made with artisanal dough, selected ingredients and the care of people who treat pizza as an art form — from the classic savory pie to the surprising chocolate pizza.",
        "From Tuesday to Sunday, you choose: the all-you-can-eat, to try a bit of everything, or à la carte, to build yours in whatever size you like — from personal to giant. And if the craving hits at home, delivery brings La Gregoria to you.",
      ],
      ctaLabel: "Menu/order",
      whatsappMessage: "Hi, Cantina La Gregoria! I came from the Compras Paraguay website and I'd like to place an order or make a reservation. Can you help me?",
      highlights: ["All-you-can-eat", "À la carte", "Delivery", "Artisanal dough", "Chocolate pizza", "Selected wines"],
      hours: ["Tuesday to Sunday: 6:30 pm to 11:00 pm", "Monday: closed", "All-you-can-eat and à la carte, Tuesday to Sunday"],
      features: [
        { title: "Artisanal dough", text: "Dough made with care, with the right fermentation and timing — the base of a pizza that's taken seriously, from personal size to giant." },
        { title: "All-you-can-eat", text: "From Tuesday to Sunday, the all-you-can-eat brings a variety of savory and sweet flavors for you to try everything, unhurried." },
        { title: "Delivery", text: "La Gregoria's pizza, warm at your home or hotel — perfect for relaxing after a day of sightseeing in Foz do Iguaçu." },
        { title: "Italian cantina", text: "The warmth of a real cantina, in downtown Foz, with a selected wine list to go with it." },
      ],
      serviceHighlight: {
        title: "A special night in Foz do Iguaçu?",
        text: "Birthday, a date night or that family dinner: Cantina La Gregoria has the cozy atmosphere, pizza made with care and a selected wine list to make the night memorable. Book via WhatsApp and secure your table.",
        items: ["Reservations via WhatsApp", "Cozy cantina atmosphere", "Selected wines", "All-you-can-eat or à la carte"],
        ctaLabel: "Book via WhatsApp",
      },
      menu: [
        { groupLabel: "Perfect for every moment — from personal to giant", items: [{}, {}, {}] },
        { groupLabel: "Traditional dough, chocolate dough, calzones and wines", note: "Savory and sweet flavors in the all-you-can-eat, Tuesday to Sunday.", items: [{}, {}, {}] },
      ],
      closing: {
        text: "More than a pizzeria, a cantina. Come live the Cantina La Gregoria experience in the heart of Foz do Iguaçu — or order delivery and bring that Italian touch to your table.",
      },
    },
  },
  es: {
    "patanegra-cervejaria": {
      businessType: "Cervecería",
      tagline: "Pide ya la cerveza artesanal más premiada, entregada bien fría donde estés — en Foz do Iguaçu y la región.",
      description: [
        "Más que cerveza, un estilo de vida. Patanegra es la cervecería de chope especial más premiada de Foz do Iguaçu — puro malta, estándar riguroso de pureza y ese frescor de fábrica que va del tanque directo a tu vaso.",
        "¿Te dieron ganas? Solo pide. El delivery propio lleva tu chope bien frío, a la temperatura justa, hasta tu casa o donde lo necesites — con la agilidad de quien se toma la cerveza en serio. Hay más de 15 estilos para elegir: desde la Pilsen clásica hasta los chopes de vino y las sours afrutadas.",
      ],
      ctaLabel: "Hacer pedido",
      whatsappMessage: "¡Hola, Patanegra! Vine desde el sitio de Compras Paraguay y quiero hacer un pedido de chopp. ¿Pueden ayudarme?",
      highlights: ["Delivery", "Entrega bien fría", "Foz y la región", "Puro malta", "Chope de vino", "+15 estilos"],
      hours: ["Atención y delivery: todos los días", "Pedidos por el sitio, WhatsApp e Instagram"],
      features: [
        { title: "Cervecería premiada", text: "Elegida entre las mejores cervecerías especiales, con medallas de oro, plata y bronce. Calidad reconocida en cada vaso." },
        { title: "Delivery bien frío", text: "Flota propia que lleva tu chope a la temperatura ideal hasta ti, en Foz do Iguaçu y la región. Pediste, llegó frío." },
        { title: "Frescor de fábrica", text: "Envasado rápido que preserva los aromas y sabores originales. Del tanque directo a tu vaso, sin perder el frescor." },
        { title: "Más de 15 estilos", text: "De la Pilsen clásica a los chopes de vino, IPAs y sours afrutadas. Hay el chope justo para cada momento y paladar." },
      ],
      serviceHighlight: {
        title: "¿Vas a organizar un evento en Foz?",
        text: "¿Fiesta, casamiento o festejo de la empresa? Patanegra arma la experiencia completa de chopera: instalación técnica profesional, barriles de 30L y 50L y la garantía de eficiencia y calidad del producto. Y para que no te equivoques en la cantidad, tienen una calculadora de chopp en el propio sitio que estima exactamente cuánto pedir, sin desperdicio.",
        items: ["Chopera profesional instalada", "Cilindro de CO₂", "Barriles de 30L y 50L", "Vasos (si es necesario)"],
        ctaLabel: "Calcular y pedir en el sitio",
      },
      menu: [
        {
          groupLabel: "Chopes más pedidos — Growler 1L",
          items: [
            { name: "Pilsen Cristal", desc: "Clara, ligera y refrescante, de bajo amargor. La preferida de los brasileños.", badge: "Más vendida" },
            { name: "Chope de Vino Blanco", desc: "Fermentado de uvas Moscato, levemente dulce. Perfecto para los días calurosos.", badge: "Más pedido" },
            { name: "Chope de Vino Tinto", desc: "Uvas Isabel y Bordeaux, con perfil frisante y un toque cremoso marcado.", badge: "Más pedido" },
            { name: "Session IPA", desc: "Ligera, dorada y muy refrescante, con amargor moderado y aroma cítrico intenso.", badge: "Más pedido" },
            { name: "Hefe Weiss", desc: "Cerveza de trigo turbia y con cuerpo, con espuma espesa y notas de clavo y banana." },
            { name: "Sour de Frutos Rojos", desc: "Color rosado, con frutilla, frambuesa y mora. Cuerpo ligero y acidez equilibrada." },
          ],
        },
        {
          groupLabel: "Barriles para tu fiesta, reunión o evento",
          note: "Más de 15 estilos disponibles en barriles de 30L y 50L. Hablá con nosotros para armar el tuyo.",
          items: [
            { name: "Barril Pilsen 30L", desc: "Rinde cerca de 60 vasos de 500 ml. El clásico que le gusta a todos.", badge: "Más vendido" },
            { name: "Barril Premium Lager 30L", desc: "Dorada, maltosa y cremosa, de cuerpo medio y amargor moderado.", badge: "Más pedido" },
            { name: "Barril Vino Blanco 30L", desc: "Nuestro chope de vino Moscato en barril — levemente dulce y refrescante, éxito garantizado.", badge: "Más pedido" },
            { name: "Barril Pilsen 50L", desc: "Para fiestas grandes, con el mejor costo por litro.", badge: "Más vendido" },
          ],
        },
      ],
      awards: {
        title: "La cervecería de chope más premiada de Foz",
        text: "No es casualidad. Patanegra es hoy la mayor referencia en chope especial de Foz do Iguaçu y la región — reconocida por calidad y pureza en las principales premiaciones del sector.",
        points: ["Presente en los mejores y más grandes eventos de la región", "En los principales puntos comerciales de la ciudad", "La elección número 1 de los consumidores"],
      },
      closing: {
        text: "Más que cerveza, un estilo de vida. Pide tu chope Patanegra y te entregamos el sabor y frescor helado de fábrica hasta ti — en Foz do Iguaçu y la región.",
      },
    },
    "cantina-la-gregoria": {
      businessType: "Pizzería",
      tagline: "La pizzería más encantadora de Foz do Iguaçu: pizza artesanal en tenedor libre, a la carta y delivery — masa en su punto y ese cuidado de familia.",
      description: [
        "En el corazón del Centro de Foz do Iguaçu, la Cantina La Gregoria trae el calor de una verdadera cantina italiana. La pizza se hace con masa artesanal, ingredientes seleccionados y el cuidado de quien trata la pizza como un arte — desde la clásica salada hasta la sorprendente pizza de chocolate.",
        "De martes a domingo, tú eliges: el tenedor libre, para probar de todo sin apuro, o la carta, para armar la tuya del tamaño que quieras — desde la individual hasta la gigante. Y si te dan ganas en casa, el delivery lleva La Gregoria hasta ti.",
      ],
      ctaLabel: "Menú/pedido",
      whatsappMessage: "¡Hola, Cantina La Gregoria! Vine desde el sitio de Compras Paraguay y quiero hacer un pedido o una reserva. ¿Pueden ayudarme?",
      highlights: ["Tenedor libre", "A la carta", "Delivery", "Masa artesanal", "Pizza de chocolate", "Vinos seleccionados"],
      hours: ["Martes a domingo: 18:30 a 23:00", "Lunes: cerrado", "Tenedor libre y a la carta, de martes a domingo"],
      features: [
        { title: "Masa artesanal", text: "Masa hecha con dedicación, con la fermentación y el punto justos — la base de una pizza que se toma en serio, desde la individual hasta la gigante." },
        { title: "Tenedor libre a gusto", text: "De martes a domingo, el tenedor libre trae una variedad de sabores salados y dulces para que pruebes de todo, sin apuro." },
        { title: "Delivery", text: "La pizza de La Gregoria calentita en tu casa o en el hotel — perfecta para relajarte después de un día de paseos en Foz do Iguaçu." },
        { title: "Cantina italiana", text: "El calor de una verdadera cantina, en el Centro de Foz, con una carta de vinos seleccionados para acompañar." },
      ],
      serviceHighlight: {
        title: "¿Una noche especial en Foz do Iguaçu?",
        text: "Cumpleaños, una cita o esa cena en familia: la Cantina La Gregoria tiene el ambiente acogedor, la pizza hecha con dedicación y una carta de vinos seleccionados para hacer la noche memorable. Reserva por WhatsApp y asegura tu mesa.",
        items: ["Reservas por WhatsApp", "Ambiente acogedor de cantina", "Vinos seleccionados", "Tenedor libre o a la carta"],
        ctaLabel: "Reservar por WhatsApp",
      },
      menu: [
        { groupLabel: "Perfecto para cada momento — desde la individual hasta la gigante", items: [{}, {}, {}] },
        { groupLabel: "Masa tradicional, masa de chocolate, calzones y vinos", note: "Sabores salados y dulces en el tenedor libre, de martes a domingo.", items: [{}, {}, {}] },
      ],
      closing: {
        text: "Más que una pizzería, una cantina. Ven a vivir la experiencia de la Cantina La Gregoria en el corazón de Foz do Iguaçu — o pide el delivery y lleva el cuidado italiano a tu mesa.",
      },
    },
  },
};

/**
 * Mescla o parceiro (fatos: nome/endereço/urls/imagens) com o texto de marketing traduzido do
 * dicionário acima. Sem entrada no dicionário (parceiro futuro sem tradução ainda) → devolve os
 * campos originais de `partners.ts` (pt) sem quebrar. Imagens/ícones/URLs sempre vêm do dado original.
 */
export function localizedPartner(partner: Partner, locale: Locale): Partner {
  const i18n = PARTNERS_I18N[locale]?.[partner.slug];
  if (!i18n) return partner;
  return {
    ...partner,
    businessType: i18n.businessType ?? partner.businessType,
    tagline: i18n.tagline,
    description: i18n.description,
    ctaLabel: i18n.ctaLabel ?? partner.ctaLabel,
    whatsappMessage: i18n.whatsappMessage ?? partner.whatsappMessage,
    highlights: i18n.highlights ?? partner.highlights,
    hours: i18n.hours ?? partner.hours,
    features: partner.features?.map((f, i) => ({
      ...f,
      title: i18n.features?.[i]?.title ?? f.title,
      text: i18n.features?.[i]?.text ?? f.text,
    })),
    serviceHighlight: partner.serviceHighlight
      ? { ...partner.serviceHighlight, ...i18n.serviceHighlight }
      : partner.serviceHighlight,
    menu: partner.menu?.map((g, gi) => ({
      ...g,
      groupLabel: i18n.menu?.[gi]?.groupLabel ?? g.groupLabel,
      note: i18n.menu?.[gi]?.note ?? g.note,
      items: g.items.map((it, ii) => ({
        ...it,
        name: i18n.menu?.[gi]?.items?.[ii]?.name ?? it.name,
        desc: i18n.menu?.[gi]?.items?.[ii]?.desc ?? it.desc,
        badge: i18n.menu?.[gi]?.items?.[ii]?.badge ?? it.badge,
      })),
    })),
    awards: partner.awards && i18n.awards ? { ...partner.awards, ...i18n.awards } : partner.awards,
    closing: partner.closing && i18n.closing ? { ...partner.closing, ...i18n.closing } : partner.closing,
  };
}
