// Filepath: lib/i18n/paginas.ts
// Version: 1.2
// Nome da Versão: "AVISO_LEGAL_UI reescrito para a narrativa Compras PY; LGPD espelha os campos reais do modal de qualificação"
//
// O `pt` é a matriz (espelha o conteúdo das páginas). Metadata/JSON-LD continuam em pt canônico
// nos page.tsx (SEO).

import type { Locale } from "./config";

export interface SectionUI {
  title: string;
  paragraphs: string[];
}

export interface SobreUI {
  eyebrow: string;
  h1: string;
  lead: string;
  intro: string;
  sections: SectionUI[];
  backLink: string;
}

export interface ContatoUI {
  eyebrow: string;
  h1: string;
  backLink: string;
  form: {
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    success: string;
    error: string;
    submit: string;
    sending: string;
  };
}

export interface AvisoLegalUI {
  eyebrow: string;
  h1: string;
  intro: string;
  sections: SectionUI[];
  backLink: string;
}

export const SOBRE_UI: Record<Locale, SobreUI> = {
  pt: {
    eyebrow: "Quem somos",
    h1: "Sobre o Compras Paraguay",
    lead: "Suas compras na fronteira, resolvidas por quem conhece cada lado dela.",
    intro:
      "O Compras Paraguay nasceu em Foz do Iguaçu para cuidar de tudo o que atrapalha quem cruza a fronteira para comprar: transporte, horários, câmbio, fila da ponte e a ordem certa das lojas. Você escolhe o dia e o roteiro — a logística de Ciudad del Este, do duty free de Puerto Iguazú e dos shoppings da região fica com quem vive a fronteira todos os dias.",
    sections: [
      {
        title: "O que fazemos",
        paragraphs: [
          "Conduzimos o seu dia de compras na fronteira: veículo privativo com ida e volta a partir do seu hotel em Foz do Iguaçu, guia especialista em Ciudad del Este e orientação sobre lojas, horários, câmbio e cota da Receita. Quando você demonstra interesse, um especialista revisa seus planos e conecta você à agência parceira, responsável pelo atendimento e pela contratação.",
        ],
      },
      {
        title: "Para quem cruza a fronteira para comprar",
        paragraphs: [
          "Nosso objetivo é devolver tempo a quem vem comprar: nada de dezenas de abas abertas, dúvidas sobre a cota ou horários que mudam de um lado ao outro da ponte. Você encontra um roteiro de compras organizado, com a ordem, o ritmo e as paradas que fazem sentido para o seu dia.",
        ],
      },
      {
        title: "Como funciona",
        paragraphs: [
          "Você escolhe um destino de compras e envia seus dados — leva poucos minutos. Um especialista que conhece a fronteira revisa suas escolhas, e a agência parceira conduz o atendimento: datas, transporte e as condições do seu dia. O Compras Paraguay fica com a curadoria e a qualificação da sua solicitação; a operação fica com quem a executa.",
        ],
      },
      {
        title: "Transparência",
        paragraphs: [
          "O Compras Paraguay é um portal independente de curadoria: não vendemos roteiros, não processamos pagamentos e não operamos diretamente transporte ou reservas. Capturamos e qualificamos a sua solicitação e a conectamos à agência parceira e aos estabelecimentos responsáveis, que conduzem atendimento, contratação e pagamento. As marcas mencionadas no site pertencem aos seus detentores.",
        ],
      },
    ],
    backLink: "Voltar à página inicial",
  },
  en: {
    eyebrow: "Who we are",
    h1: "About Compras Paraguay",
    lead: "Your shopping trip across the border, handled by people who know every side of it.",
    intro:
      "Compras Paraguay was born in Foz do Iguaçu to take care of everything that gets in the way of shopping across the border: transport, opening hours, currency exchange, the bridge line and the right order of stores. You pick the day and the plan — the logistics of Ciudad del Este, the Puerto Iguazú duty free and the region's shopping centers stay with people who live the border every day.",
    sections: [
      {
        title: "What we do",
        paragraphs: [
          "We run your shopping day at the border: private vehicle with round-trip transfer from your hotel in Foz do Iguaçu, a guide who knows Ciudad del Este inside out and guidance on stores, opening hours, exchange rates and customs allowances. When you express interest, a specialist reviews your plans and connects you with our partner agency, which handles service and booking.",
        ],
      },
      {
        title: "For those who cross the border to shop",
        paragraphs: [
          "Our goal is to give time back to people who come to shop: no dozens of open tabs, no doubts about allowances or opening hours that change from one side of the bridge to the other. You get an organized shopping itinerary, with the order, pace and stops that make sense for your day.",
        ],
      },
      {
        title: "How it works",
        paragraphs: [
          "You pick a shopping destination and send your details — it takes a couple of minutes. A specialist who knows the border reviews your choices, and the partner agency takes over the service: dates, transport and the conditions of your day. Compras Paraguay handles curation and qualification of your request; the operation stays with the people who run it.",
        ],
      },
      {
        title: "Transparency",
        paragraphs: [
          "Compras Paraguay is an independent curation portal: we don't sell itineraries, process payments or directly run transport or bookings. We capture and qualify your request and connect it to the partner agency and the responsible businesses, which handle service, contracting and payment. Mentioned brands belong to their owners.",
        ],
      },
    ],
    backLink: "Back to the home page",
  },
  es: {
    eyebrow: "Quiénes somos",
    h1: "Sobre Compras Paraguay",
    lead: "Tu viaje de compras por la frontera, resuelto por gente que conoce cada lado.",
    intro:
      "Compras Paraguay nació en Foz do Iguaçu para ocuparse de todo lo que estorba a quien cruza la frontera a comprar: transporte, horarios, cambio de divisas, la fila del puente y el orden correcto de las tiendas. Tú eliges el día y el plan — la logística de Ciudad del Este, del duty free de Puerto Iguazú y de los centros de compras de la región queda en manos de quienes viven la frontera todos los días.",
    sections: [
      {
        title: "Qué hacemos",
        paragraphs: [
          "Conducimos tu día de compras en la frontera: vehículo privado con ida y vuelta desde tu hotel en Foz do Iguaçu, un guía especialista en Ciudad del Este y orientación sobre tiendas, horarios, cambio y franquicia aduanera. Cuando muestras interés, un especialista revisa tus planes y te conecta con la agencia asociada, que realiza la atención y la contratación.",
        ],
      },
      {
        title: "Para quien cruza la frontera a comprar",
        paragraphs: [
          "Nuestro objetivo es devolverle tiempo a quien viene a comprar: nada de decenas de pestañas abiertas, dudas sobre la franquicia u horarios que cambian de un lado al otro del puente. Recibes un itinerario de compras organizado, con el orden, el ritmo y las paradas que tienen sentido para tu día.",
        ],
      },
      {
        title: "Cómo funciona",
        paragraphs: [
          "Eliges un destino de compras y envías tus datos — toma un par de minutos. Un especialista que conoce la frontera revisa tus elecciones y la agencia asociada se encarga de la atención: fechas, transporte y las condiciones de tu día. Compras Paraguay se queda con la curaduría y la calificación de tu solicitud; la operación la realizan quienes la ejecutan.",
        ],
      },
      {
        title: "Transparencia",
        paragraphs: [
          "Compras Paraguay es un portal independiente de curaduría: no vendemos itinerarios, no procesamos pagos ni operamos directamente el transporte o las reservas. Captamos y calificamos tu solicitud y la conectamos con la agencia asociada y los establecimientos responsables, que realizan la atención, la contratación y el cobro. Las marcas mencionadas en el sitio pertenecen a sus titulares.",
        ],
      },
    ],
    backLink: "Volver a la página de inicio",
  },
};

export const CONTATO_UI: Record<Locale, ContatoUI> = {
  pt: {
    eyebrow: "Fale conosco",
    h1: "Contato",
    backLink: "Voltar à página inicial",
    form: {
      nameLabel: "Nome",
      namePlaceholder: "Seu nome",
      emailLabel: "E-mail",
      emailPlaceholder: "voce@exemplo.com",
      messageLabel: "Mensagem",
      messagePlaceholder: "Como podemos ajudar?",
      success: "Mensagem enviada! Vamos responder no e-mail informado assim que possível.",
      error: "Não conseguimos enviar sua mensagem agora. Tente novamente em instantes.",
      submit: "Enviar mensagem",
      sending: "Enviando…",
    },
  },
  en: {
    eyebrow: "Talk to us",
    h1: "Contact",
    backLink: "Back to the home page",
    form: {
      nameLabel: "Name",
      namePlaceholder: "Your name",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      messageLabel: "Message",
      messagePlaceholder: "How can we help?",
      success: "Message sent! We'll reply to the email you provided as soon as possible.",
      error: "We couldn't send your message right now. Please try again in a moment.",
      submit: "Send message",
      sending: "Sending…",
    },
  },
  es: {
    eyebrow: "Hable con nosotros",
    h1: "Contacto",
    backLink: "Volver a la página de inicio",
    form: {
      nameLabel: "Nombre",
      namePlaceholder: "Tu nombre",
      emailLabel: "Email",
      emailPlaceholder: "tu@ejemplo.com",
      messageLabel: "Mensaje",
      messagePlaceholder: "¿Cómo podemos ayudarte?",
      success: "¡Mensaje enviado! Responderemos al correo indicado lo antes posible.",
      error: "No pudimos enviar tu mensaje ahora. Inténtalo de nuevo en unos instantes.",
      submit: "Enviar mensaje",
      sending: "Enviando…",
    },
  },
};

export const AVISO_LEGAL_UI: Record<Locale, AvisoLegalUI> = {
  pt: {
    eyebrow: "Transparência & Privacidade",
    h1: "Aviso Legal, Termos e Privacidade (LGPD)",
    intro:
      "O Compras Paraguay é um portal independente de curadoria de compras na tríplice fronteira — para quem cruza a fronteira para comprar em Ciudad del Este, em Puerto Iguazú e nos shoppings da região. Não vendemos roteiros, não fechamos reservas e não processamos pagamentos — nosso papel é organizar a curadoria, capturar a sua solicitação e conectá-la à agência parceira e aos estabelecimentos responsáveis.",
    sections: [
      {
        title: "Marcas e destinos mencionados",
        paragraphs: [
          "Shoppings, free shops, atrativos, estabelecimentos e demais marcas citadas no site pertencem aos seus respectivos detentores. O Compras Paraguay não possui vínculo societário nem representação oficial com essas marcas. Qualquer menção tem caráter informativo ou de curadoria.",
        ],
      },
      {
        title: "Agência parceira e estabelecimentos",
        paragraphs: [
          "A agência de turismo parceira e os destinos de compras, shoppings e free shops indicados são empresas independentes. A recomendação decorre de acordos comerciais com o Compras Paraguay e não cria sociedade, representação exclusiva ou responsabilidade solidária. A agência parceira pode ser substituída operacionalmente sem atualização desta página.",
        ],
      },
      {
        title: "Compras, reservas e responsabilidades",
        paragraphs: [
          "O Compras Paraguay não vende produtos, não processa pagamentos e não armazena dados financeiros. O dia de compras, o transporte, as reservas e as emissões são conduzidos pela agência parceira ou pelo estabelecimento responsável, em seus próprios canais. Dúvidas de pagamento, cancelamento ou qualidade do serviço devem ser resolvidas diretamente com quem prestou o serviço.",
        ],
      },
      {
        title: "Como tratamos seus dados pessoais (LGPD)",
        paragraphs: [
          "Quando você solicita um dia de compras, envia um contato ou preenche formulários, podemos coletar nome, e-mail e WhatsApp, além do destino escolhido, da data desejada, do número de pessoas, da preferência de transporte e das respostas de qualificação que você fornecer.",
          "Finalidade: viabilizar o contato que você solicitou — em especial o atendimento da agência parceira, que recebe o seu pedido para dar continuidade.",
          "Base legal: consentimento e legítimo interesse para a operação do site e da demanda que você originou.",
          "Para exercer direitos de titular (acesso, correção, exclusão etc.), use o canal em /contato.",
        ],
      },
      {
        title: "Cookies e tecnologias semelhantes",
        paragraphs: [
          "Usamos cookies e tecnologias de medição (incluindo, quando você aceita o banner, tags de marketing) para entender o uso do site e melhorar a experiência. Detalhes práticos estão no banner de cookies e nesta política. Analytics 1st-party essencial pode funcionar sem PII identificável.",
        ],
      },
      {
        title: "Alterações",
        paragraphs: [
          "Podemos atualizar este aviso periodicamente. A versão vigente é a publicada nesta página.",
        ],
      },
    ],
    backLink: "Voltar à página inicial",
  },
  en: {
    eyebrow: "Transparency & Privacy",
    h1: "Legal Notice, Terms and Privacy (LGPD)",
    intro:
      "Compras Paraguay is an independent shopping curation portal at the triple border — for people crossing the border to shop in Ciudad del Este, Puerto Iguazú and the region's shopping centers. We don't sell itineraries, make reservations or process payments — our role is to run the curation, capture your request and connect it to the partner agency and the responsible businesses.",
    sections: [
      {
        title: "Mentioned brands and destinations",
        paragraphs: [
          "Malls, duty frees, attractions, establishments and other brands mentioned on the site belong to their respective owners. Compras Paraguay has no corporate ties or official representation with these brands. Any mention is informational or curatorial.",
        ],
      },
      {
        title: "Partner agency and businesses",
        paragraphs: [
          "The partner tourism agency and the shopping destinations, malls and duty frees indicated are independent companies. The recommendation stems from commercial agreements with Compras Paraguay and doesn't create a partnership, exclusive representation or joint liability. The partner agency may be operationally replaced without updating this page.",
        ],
      },
      {
        title: "Purchases, reservations and responsibilities",
        paragraphs: [
          "Compras Paraguay doesn't sell products, process payments or store financial data. The shopping day, transport, reservations and issuances are handled by the partner agency or the responsible business, on their own channels. Payment, cancellation or service-quality questions must be resolved directly with whoever provided the service.",
        ],
      },
      {
        title: "How we handle your personal data (LGPD)",
        paragraphs: [
          "When you request a shopping day, get in touch or fill in forms, we may collect your name, email and WhatsApp number, as well as your chosen destination, preferred date, number of people, transport preference and the qualification answers you provide.",
          "Purpose: to enable the contact you requested — especially service by the partner agency, which receives your request to follow up.",
          "Legal basis: consent and legitimate interest for operating the site and the demand you originated.",
          "To exercise data subject rights (access, correction, deletion, etc.), use the channel at /contato.",
        ],
      },
      {
        title: "Cookies and similar technologies",
        paragraphs: [
          "We use cookies and measurement technologies (including marketing tags when you accept the banner) to understand site usage and improve the experience. Practical details are in the cookie banner and in this policy. Essential first-party analytics may work without identifiable PII.",
        ],
      },
      {
        title: "Changes",
        paragraphs: [
          "We may update this notice periodically. The current version is the one published on this page.",
        ],
      },
    ],
    backLink: "Back to the home page",
  },
  es: {
    eyebrow: "Transparencia y Privacidad",
    h1: "Aviso Legal, Términos y Privacidad (LGPD)",
    intro:
      "Compras Paraguay es un portal independiente de curaduría de compras en la triple frontera — para quien cruza la frontera a comprar a Ciudad del Este, a Puerto Iguazú y a los centros de compras de la región. No vendemos itinerarios, no hacemos reservas ni procesamos pagos — nuestro papel es organizar la curaduría, captar tu solicitud y conectarla con la agencia asociada y los establecimientos responsables.",
    sections: [
      {
        title: "Marcas y destinos mencionados",
        paragraphs: [
          "Los centros de compras, los duty free, los atractivos, los establecimientos y las demás marcas citadas en el sitio pertenecen a sus respectivos titulares. Compras Paraguay no tiene vínculo societario ni representación oficial con esas marcas. Cualquier mención tiene carácter informativo o de curaduría.",
        ],
      },
      {
        title: "Agencia asociada y establecimientos",
        paragraphs: [
          "La agencia de turismo asociada y los destinos de compras, centros comerciales y duty free indicados son empresas independientes. La recomendación deriva de acuerdos comerciales con Compras Paraguay y no crea sociedad, representación exclusiva ni responsabilidad solidaria. La agencia asociada puede ser sustituida operativamente sin actualizar esta página.",
        ],
      },
      {
        title: "Compras, reservas y responsabilidades",
        paragraphs: [
          "Compras Paraguay no vende productos, no procesa pagos ni almacena datos financieros. El día de compras, el transporte, las reservas y las emisiones los realizan la agencia asociada o el establecimiento responsable, en sus propios canales. Las dudas de pago, cancelación o calidad del servicio deben resolverse directamente con quien prestó el servicio.",
        ],
      },
      {
        title: "Cómo tratamos tus datos personales (LGPD)",
        paragraphs: [
          "Cuando solicitas un día de compras, envías un contacto o completas formularios, podemos recopilar tu nombre, correo y WhatsApp, además del destino elegido, la fecha deseada, el número de personas, la preferencia de transporte y las respuestas de calificación que proporciones.",
          "Finalidad: facilitar el contacto que solicitaste — en especial la atención de la agencia asociada, que recibe tu pedido para darle continuidad.",
          "Base legal: consentimiento e interés legítimo para la operación del sitio y la demanda que originaste.",
          "Para ejercer derechos de titular (acceso, corrección, eliminación, etc.), usa el canal en /contato.",
        ],
      },
      {
        title: "Cookies y tecnologías similares",
        paragraphs: [
          "Usamos cookies y tecnologías de medición (incluidas, cuando aceptas el banner, etiquetas de marketing) para entender el uso del sitio y mejorar la experiencia. Los detalles prácticos están en el banner de cookies y en esta política. Los analytics de primera parte esenciales pueden funcionar sin PII identificable.",
        ],
      },
      {
        title: "Cambios",
        paragraphs: [
          "Podemos actualizar este aviso periódicamente. La versión vigente es la publicada en esta página.",
        ],
      },
    ],
    backLink: "Volver a la página de inicio",
  },
};
