// Filepath: lib/i18n/paginas.ts
// Version: 1.0
// Nome da Versão: "Dicionário i18n de /sobre, /contato, /roteiros/salvos e /aviso-legal (pt/en/es)"
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

export interface SalvosUI {
  eyebrow: string;
  h1: string;
  subtitle: string;
  loading: string;
  loginTitle: string;
  loginBody: string;
  connectedAs: string;
  signOut: string;
  errorLoad: string;
  errorNetwork: string;
  emptyTitle: string;
  emptyCta: string;
  viewReady: string;
  updated: string;
  /** Rótulo de data do toLocaleDateString. */
  dateLocale: string;
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
    lead: "Planejar os dias em Foz do Iguaçu deveria ser simples.",
    intro:
      "O Compras Paraguay nasceu para ajudar você a tomar melhores decisões antes e durante a sua estadia em Foz. Reunimos atrações, experiências, hospedagens, gastronomia e recomendações em um único lugar, para que você aproveite melhor seu tempo na cidade.",
    sections: [
      {
        title: "O que fazemos",
        paragraphs: [
          "Selecionamos atrações, criamos roteiros prontos e reunimos experiências recomendadas para diferentes ritmos. Quando você demonstra interesse em uma experiência, hospedagem ou outro serviço, conectamos você aos parceiros responsáveis pelo atendimento e pela continuidade da sua solicitação.",
        ],
      },
      {
        title: "Para quem visita Foz do Iguaçu",
        paragraphs: [
          "Nosso objetivo é reduzir o tempo gasto pesquisando em dezenas de sites diferentes. Você encontra recomendações organizadas, roteiros prontos e experiências completas para planejar sua estadia com mais praticidade e segurança.",
        ],
      },
      {
        title: "Para parceiros locais",
        paragraphs: [
          "Conectamos hotéis, restaurantes, atrativos e empresas de turismo a visitantes com intenção real de viajar ou conhecer Foz do Iguaçu, valorizando negócios locais e oferecendo um ambiente transparente para essa conexão.",
        ],
      },
      {
        title: "Transparência",
        paragraphs: [
          "O Compras Paraguay atua como uma plataforma de recomendações e conexão entre visitantes e parceiros locais. Não realizamos reservas, não processamos pagamentos e não comercializamos diretamente ingressos, hospedagens ou passeios. O atendimento comercial e a contratação de cada serviço são realizados pelos respectivos parceiros responsáveis.",
        ],
      },
    ],
    backLink: "Voltar à página inicial",
  },
  en: {
    eyebrow: "Who we are",
    h1: "About Compras Paraguay",
    lead: "Planning your days in Foz do Iguaçu should be simple.",
    intro:
      "Compras Paraguay was born to help you make better decisions before and during your stay in Foz. We bring attractions, experiences, accommodation, food and recommendations together in one place, so you can make the most of your time in the city.",
    sections: [
      {
        title: "What we do",
        paragraphs: [
          "We curate attractions, create ready-made itineraries and gather recommended experiences for different paces. When you show interest in an experience, accommodation or another service, we connect you to the partners responsible for the service and the follow-up on your request.",
        ],
      },
      {
        title: "For those visiting Foz do Iguaçu",
        paragraphs: [
          "Our goal is to reduce the time spent searching across dozens of websites. You'll find organized recommendations, ready-made itineraries and complete experiences to plan your stay with more convenience and confidence.",
        ],
      },
      {
        title: "For local partners",
        paragraphs: [
          "We connect hotels, restaurants, attractions and tourism businesses with visitors who genuinely intend to travel to or explore Foz do Iguaçu, valuing local businesses and offering a transparent environment for that connection.",
        ],
      },
      {
        title: "Transparency",
        paragraphs: [
          "Compras Paraguay acts as a platform for recommendations and connection between visitors and local partners. We don't make reservations, process payments or sell tickets, accommodation or tours directly. The commercial service and contracting of each service are handled by the respective responsible partners.",
        ],
      },
    ],
    backLink: "Back to the home page",
  },
  es: {
    eyebrow: "Quiénes somos",
    h1: "Sobre Compras Paraguay",
    lead: "Planear tus días en Foz do Iguaçu debería ser simple.",
    intro:
      "Compras Paraguay nació para ayudarte a tomar mejores decisiones antes y durante tu estadía en Foz. Reunimos atractivos, experiencias, hospedajes, gastronomía y recomendaciones en un solo lugar, para que aproveches mejor tu tiempo en la ciudad.",
    sections: [
      {
        title: "Qué hacemos",
        paragraphs: [
          "Seleccionamos atractivos, creamos itinerarios listos y reunimos experiencias recomendadas para diferentes ritmos. Cuando demuestras interés en una experiencia, hospedaje u otro servicio, te conectamos con los socios responsables de la atención y de la continuidad de tu pedido.",
        ],
      },
      {
        title: "Para quien visita Foz do Iguaçu",
        paragraphs: [
          "Nuestro objetivo es reducir el tiempo que se pierde buscando en decenas de sitios diferentes. Encuentras recomendaciones organizadas, itinerarios listos y experiencias completas para planear tu estadía con más practicidad y seguridad.",
        ],
      },
      {
        title: "Para socios locales",
        paragraphs: [
          "Conectamos hoteles, restaurantes, atractivos y empresas de turismo con visitantes con intención real de viajar o conocer Foz do Iguaçu, valorando los negocios locales y ofreciendo un ambiente transparente para esa conexión.",
        ],
      },
      {
        title: "Transparencia",
        paragraphs: [
          "Compras Paraguay actúa como plataforma de recomendaciones y conexión entre visitantes y socios locales. No hacemos reservas, no procesamos pagos ni comercializamos directamente entradas, hospedajes o paseos. La atención comercial y la contratación de cada servicio la realizan los respectivos socios responsables.",
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

export const SALVOS_UI: Record<Locale, SalvosUI> = {
  pt: {
    eyebrow: "Conta · Compras Paraguay",
    h1: "Meus roteiros salvos",
    subtitle: "Entre com o link mágico do seu e-mail para ver a jornada que você guardou.",
    loading: "Carregando…",
    loginTitle: "Entre para ver seus roteiros",
    loginBody:
      "Use o mesmo e-mail do link mágico. Se ainda não salvou nenhum, escolha um roteiro pronto e salve pela página do plano.",
    connectedAs: "Conectado como",
    signOut: "Sair",
    errorLoad: "Não foi possível carregar seus roteiros.",
    errorNetwork: "Falha de rede.",
    emptyTitle: "Nenhum roteiro salvo ainda",
    emptyCta: " →",
    viewReady: "Ver roteiro pronto",
    updated: "Atualizado",
    dateLocale: "pt-BR",
  },
  en: {
    eyebrow: "Account · Compras Paraguay",
    h1: "My saved itineraries",
    subtitle: "Sign in with the magic link from your email to see the journey you saved.",
    loading: "Loading…",
    loginTitle: "Sign in to see your itineraries",
    loginBody:
      "Use the same email as the magic link. If you haven't saved any yet, pick a ready-made itinerary and save it from the plan page.",
    connectedAs: "Signed in as",
    signOut: "Sign out",
    errorLoad: "We couldn't load your itineraries.",
    errorNetwork: "Network error.",
    emptyTitle: "No saved itineraries yet",
    emptyCta: " →",
    viewReady: "View ready-made itinerary",
    updated: "Updated",
    dateLocale: "en-US",
  },
  es: {
    eyebrow: "Cuenta · Compras Paraguay",
    h1: "Mis itinerarios guardados",
    subtitle: "Entra con el enlace mágico de tu correo para ver la jornada que guardaste.",
    loading: "Cargando…",
    loginTitle: "Entra para ver tus itinerarios",
    loginBody:
      "Usa el mismo correo del enlace mágico. Si aún no guardaste ninguno, elige un itinerario listo y guárdalo desde la página del plan.",
    connectedAs: "Conectado como",
    signOut: "Salir",
    errorLoad: "No fue posible cargar tus itinerarios.",
    errorNetwork: "Fallo de red.",
    emptyTitle: "Aún no hay itinerarios guardados",
    emptyCta: " →",
    viewReady: "Ver itinerario listo",
    updated: "Actualizado",
    dateLocale: "es-ES",
  },
};

export const AVISO_LEGAL_UI: Record<Locale, AvisoLegalUI> = {
  pt: {
    eyebrow: "Transparência & Privacidade",
    h1: "Aviso Legal, Termos e Privacidade (LGPD)",
    intro:
      "O Compras Paraguay é um portal independente de curadoria turística e geração de demanda para quem visita Foz do Iguaçu. Não vendemos ingressos, não fechamos reservas e não processamos pagamentos — nosso papel é recomendar roteiros e conectar você à agência e aos parceiros homologados.",
    sections: [
      {
        title: "Marcas e atrativos mencionados",
        paragraphs: [
          "Atrativos, parques, estabelecimentos e demais marcas citadas no site pertencem aos seus respectivos detentores. O Compras Paraguay não possui vínculo societário nem representação oficial com essas marcas. Qualquer menção tem caráter informativo ou de curadoria.",
        ],
      },
      {
        title: "Parceiros locais e agência",
        paragraphs: [
          "Negócios de gastronomia, hotelaria e turismo e a agência parceira são empresas independentes. A recomendação decorre de acordos comerciais com o Compras Paraguay e não cria sociedade, representação exclusiva ou responsabilidade solidária. A agência pode ser substituída operacionalmente sem atualizar esta página.",
        ],
      },
      {
        title: "Compras, reservas e responsabilidades",
        paragraphs: [
          "O Compras Paraguay não vende ingressos, não processa pagamentos e não armazena dados financeiros. Compras, reservas e emissões são conduzidas pela agência parceira ou pelo estabelecimento responsável, em seus próprios canais. Dúvidas de pagamento, cancelamento ou qualidade do serviço devem ser resolvidas diretamente com quem prestou o serviço.",
        ],
      },
      {
        title: "Como tratamos seus dados pessoais (LGPD)",
        paragraphs: [
          "Quando você envia um pedido de roteiro, salva um roteiro ou preenche formulários, podemos coletar nome, e-mail, WhatsApp e respostas de qualificação, além de preferências de roteiro, interesse em transporte e o dia e a quantidade escolhidos.",
          "Finalidade: viabilizar o contato que você solicitou — em especial o atendimento da agência parceira.",
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
      "Compras Paraguay is an independent tourism curation and demand-generation portal for those visiting Foz do Iguaçu. We don't sell tickets, make reservations or process payments — our role is to recommend itineraries and connect you with the agency and accredited partners.",
    sections: [
      {
        title: "Mentioned brands and attractions",
        paragraphs: [
          "Attractions, parks, establishments and other brands mentioned on the site belong to their respective owners. Compras Paraguay has no corporate ties or official representation with these brands. Any mention is informational or curatorial.",
        ],
      },
      {
        title: "Local partners and agency",
        paragraphs: [
          "Food, hospitality and tourism businesses and the partner agency are independent companies. The recommendation stems from commercial agreements with Compras Paraguay and doesn't create a partnership, exclusive representation or joint liability. The agency may be operationally replaced without updating this page.",
        ],
      },
      {
        title: "Purchases, reservations and responsibilities",
        paragraphs: [
          "Compras Paraguay doesn't sell tickets, process payments or store financial data. Purchases, reservations and issuances are handled by the partner agency or the responsible establishment, on their own channels. Payment, cancellation or service-quality questions must be resolved directly with whoever provided the service.",
        ],
      },
      {
        title: "How we handle your personal data (LGPD)",
        paragraphs: [
          "When you submit an itinerary request, save an itinerary or fill in forms, we may collect your name, email, WhatsApp and qualification answers, as well as itinerary preferences, transport interest and the chosen date and quantity.",
          "Purpose: to enable the contact you requested — especially service from the partner agency.",
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
      "Compras Paraguay es un portal independiente de curaduría turística y generación de demanda para quienes visitan Foz do Iguaçu. No vendemos entradas, no hacemos reservas ni procesamos pagos — nuestro papel es recomendar itinerarios y conectarte con la agencia y los socios acreditados.",
    sections: [
      {
        title: "Marcas y atractivos mencionados",
        paragraphs: [
          "Los atractivos, parques, establecimientos y demás marcas citadas en el sitio pertenecen a sus respectivos titulares. Compras Paraguay no tiene vínculo societario ni representación oficial con esas marcas. Cualquier mención tiene carácter informativo o de curaduría.",
        ],
      },
      {
        title: "Socios locales y agencia",
        paragraphs: [
          "Los negocios de gastronomía, hotelería y turismo y la agencia asociada son empresas independientes. La recomendación deriva de acuerdos comerciales con Compras Paraguay y no crea sociedad, representación exclusiva ni responsabilidad solidaria. La agencia puede ser sustituida operativamente sin actualizar esta página.",
        ],
      },
      {
        title: "Compras, reservas y responsabilidades",
        paragraphs: [
          "Compras Paraguay no vende entradas, no procesa pagos ni almacena datos financieros. Las compras, reservas y emisiones las realizan la agencia asociada o el establecimiento responsable, en sus propios canales. Las dudas de pago, cancelación o calidad del servicio deben resolverse directamente con quien prestó el servicio.",
        ],
      },
      {
        title: "Cómo tratamos tus datos personales (LGPD)",
        paragraphs: [
          "Cuando envías un pedido de itinerario, guardas un itinerario o completas formularios, podemos recopilar nombre, correo, WhatsApp y respuestas de calificación, además de preferencias de itinerario, interés en transporte y la fecha y cantidad elegidas.",
          "Finalidad: facilitar el contacto que solicitaste — en especial la atención de la agencia asociada.",
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
