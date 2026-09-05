// Filepath: lib/offer-defaults.ts
// Version: 2.1
// Nome da Versão: "Remove preferência Manter/Personalizar, showInItinerary, itineraryOffersEnabled e textos do modal associados (offersTitle/partnerCheck/itinerary/successOffers) — bloco 'incluir experiências no roteiro' extinto"
//
// Este módulo NÃO importa o banco → pode ser usado no client (provider/modal) sem puxar
// o driver Neon pro bundle. O lib/offer-settings.ts (server) importa daqui e adiciona o DB.
//
// ⚠️ i18n FASE 3 (jul/2026): todo texto que o VISITANTE lê no modal agora é editável em PT/EN/ES no
// admin (antes: só PT vinha do banco, EN/ES vinham de um dicionário fixo no código). Cada campo de
// texto virou `Record<Locale, string>` (ou um objeto de textos por locale). Compatibilidade: as chaves
// de `app_settings`/colunas de `partner_lead_settings` que já existiam continuam sendo o valor PT (sem
// sufixo) — nada do que já foi digitado se perde; só EN/ES ganharam colunas/chaves NOVAS (sufixo `_en`/`_es`).

import type { Locale } from "./i18n/config";

// ⛔ NÃO reintroduzir `officialAgencyName()` nos textos daqui. Nenhuma copy que o visitante lê pode
// nomear a agência nem dizer "fale com a agência": posicionamento.md §21.5 restringe "agência parceira"
// à microcopy de LGPD, ao `contactDesc` e ao disclaimer do footer (§18), onde é dever legal. Em copy de
// marketing a relação é com o Compras Paraguay — o vocabulário certo é §21.3 ("um especialista em Foz do
// Iguaçu"). ⚠️ E o sujeito é o ESPECIALISTA, nunca o morador: "quem vive em Foz/na cidade" como sujeito
// saiu do vocabulário permitido. Nomear a agência aqui já custou uma rodada inteira de reescrita.

export type ModalSuccessMode = "close" | "whatsapp" | "direct";
export type BotMessageMode = "assume" | "passive";

/** Textos EDITÁVEIS do modal, de UM idioma (tudo, menos a microcopy de Termos e os placeholders dos campos). */
export interface ModalTexts {
  title: string;          // headline do formulário
  subtitle: string;       // subtítulo do formulário
  formHint: string;       // linha acima dos campos
  submitLabel: string;    // botão de enviar
  successTitle: string;   // título da tela de sucesso
  successClose: string;   // mensagem de sucesso quando modalSuccessMode = "close"
  successWhatsapp: string;// mensagem de sucesso quando modalSuccessMode = "whatsapp"
  qLocal: string;         // pergunta de qualificação "É morador de Foz?" (PA — sempre exibida)
  qInFoz: string;         // pergunta de qualificação "Já está em Foz?" (só quando qLocal = Não)
  qualifyTitle: string;   // chamada (CTA) logo antes de "morador de Foz?" — indica que abaixo ele segue a compra
}

/** `ModalTexts` nos 3 idiomas — é o shape que trafega em `OfferConfig.texts`. */
export type LocalizedTexts = Record<Locale, ModalTexts>;

/** Textos (por idioma) do cross-sell de transporte. */
export interface TransportOfferTexts {
  title: string;        // "Você gostaria de transporte pra esse dia?"
  desc: string;         // descrição do serviço
}

/** Cross-sell de transporte (parceiro da agência oficial) — pergunta acima do formulário quando a agência está ativa. */
export interface TransportOffer {
  enabled: boolean;     // exibir ou não o bloco no modal
  /**
   * Slug da agência ATIVA (só leitura, computado no server). **Não é exibido em lugar nenhum:**
   * alimenta o `partner_slug` da taxonomia do pixel (`_docs-portfolio/pixel-matrix.md` §1.4) nos
   * eventos de transfer/agência. Sem ele não haveria como o client mandar `partner_slug`, e esse
   * dado não tem plano B — parceiro/agência não têm rota própria, então o param é o ÚNICO canal
   * dessa informação até o Meta (D5/D11).
   *
   * É identificador de DADO (`app/data/agencies.ts`), nunca segmento de URL. `null` quando não há
   * agência com plano ativo → o param é omitido (D8), nunca preenchido com placeholder.
   */
  agencySlug: string | null;
  texts: Record<Locale, TransportOfferTexts>;
}

/**
 * Textos do modal por PRODUTO Compras Paraguay (sobrescrevem title/subtitle/submit/sucesso do `texts` base).
 * Editáveis no admin · seção “Textos por produto”.
 */
export interface ProductLeadCopy {
  title: string;
  subtitle: string;
  formHint: string;
  submitLabel: string;
  successTitle: string;
  successClose: string;
  successWhatsapp: string;
  subjectBadge: string;
  subjectIncluded: string;
  /** Mensagem pronta do wa.me disparado no TELEGRAM (botão "Abrir WhatsApp do cliente"/"Iniciar
   * conversa") — quem lê é o LEAD, no idioma que ele escolheu no modal (`leads.locale`), não o idioma
   * de quem está no grupo. Placeholder `{nome}` = primeiro nome do lead.
   * ⚠️ Mora AQUI, por produto, e não numa chave global: quem pediu ingresso de um atrativo e quem pediu
   * um roteiro personalizado precisam de aberturas diferentes. A versão global antiga dizia "ingressos
   * ou roteiro" justamente por não saber qual era. Vale com ou sem agência definida. */
  waGreeting: string;
  /** Texto pré-preenchido do wa.me que **o VISITANTE** dispara no CTA de conversa da tela de
   * sucesso — a ponta oposta do `waGreeting` acima. Não confundir:
   *   • `waGreeting` → mensagem que VOCÊ (ou a agência) manda AO lead, a partir do Telegram;
   *   • `waLeadText` → mensagem que o LEAD manda pra vocês, a partir do site.
   * Por produto pelo mesmo motivo: "quero o ingresso do atrativo" e "quero o roteiro sob medida" são
   * pedidos diferentes, e quem recebe precisa saber qual é sem perguntar. `buildPreferencesSummary`
   * anexa o resumo (perfil/dia/quantidade) depois deste texto. */
  waLeadText: string;
  /** Rótulo do botão do modo "Iniciar conversa" (o que o visitante clica pra abrir o WhatsApp).
   * Por produto porque o rótulo legitimamente muda: "falar sobre meu ingresso" não é "falar sobre meu
   * roteiro". ⚠️ Não confundir com `directButtonLabel` (modo "Link direto"), que só existe em
   * `AtrativoLeadCopy`. */
  waButtonLabel: string;
  /** Título exibido quando a MESMA pessoa reabre o CTA de um produto que já enviou dentro da janela de
   * dedup (o modal abre nesse aviso em vez de redirecionar; ver `duplicateModalId` no TicketOfferModal).
   * A descrição e o botão reaproveitam `successWhatsapp`/`waButtonLabel` deste mesmo produto. */
  duplicateNoticeTitle: string;
}

/**
 * Textos que SÓ o produto "ingresso de atrativo" tem — o modo de sucesso **Link direto**.
 *
 * ⚠️ A assimetria é intencional e está no TIPO, não só na UI do admin: roteiro pronto e personalizado
 * usam `RoteiroSuccessMode` (que nem admite `"direct"`) e não têm site oficial externo pra apontar —
 * a tela só renderiza esse modo com `detail.href`, que é o link do atrativo. Com o tipo assim, os
 * loops de leitura/gravação de `productCopies` não têm como criar uma chave
 * `product_copy_roteiro_successDirect` órfã no `app_settings`.
 */
export interface AtrativoLeadCopy extends ProductLeadCopy {
  /** Mensagem de sucesso quando o atrativo está em Modo Direto → entregamos o link oficial de compra. */
  successDirect: string;
  /** Rótulo do botão que leva ao link oficial do atrativo. */
  directButtonLabel: string;
}

export type ProductCopyKind = "atrativo";

export type ProductCopies = {
  atrativo: Record<Locale, AtrativoLeadCopy>;
};

/** Modo de sucesso por atrativo (seção "Ingresso por atrativo" do admin). */
export type AttractionOfferMode = "direct" | "agency";

/**
 * Configuração de sucesso de UM atrativo — não tem campos sensíveis (roteamento de lead
 * continua 100% global, seção Agência), então é o MESMO shape no admin e no client.
 */
export interface AttractionOfferSetting {
  slug: string;
  /** false = atrativo sem ingresso/link (ex.: Compras Paraguai, Feirinha) — sucesso nunca mostra link. */
  hasLink: boolean;
  /** "direct" = tela de sucesso sempre mostra o link deste atrativo. "agency" = cai no modo de sucesso global.
   * Só é editável/relevante quando `hasLink=true` — com `hasLink=false` quem manda é `noLinkMode`. */
  mode: AttractionOfferMode;
  officialUrl: string | null;
  /** Só relevante quando `hasLink=false`: como a tela de sucesso se comporta pra esse atrativo específico
   * (não tem link nenhum pra oferecer — nem próprio nem o global de fallback). Escolha PRÓPRIA do atrativo,
   * não herda do bucket global "Atrativos individuais" (seção 1). */
  noLinkMode: RoteiroSuccessMode;
}

/** Projeção pública (client-safe) — inclui `name` (catálogo estático) pro seletor "Incluir ingresso de
 * outros atrativos?" no modal poder listar todos os atrativos sem importar o arquivo pesado de conteúdo. */
export interface AttractionOfferPublic extends AttractionOfferSetting {
  name: string;
}

/** Como classificar o VOCABULÁRIO de um pedido de atrativo: o que ele contém decide se a superfície
 * fala em "ingressos", "reservas" ou nos dois. */
export type ItensKind = "ingressos" | "reservas" | "misto";

/**
 * Classifica os itens de um pedido pelo `hasLink` de cada atrativo (§17-ter — lugares públicos como
 * Compras Paraguai e By Night não vendem ingresso, só reserva de data).
 *
 * ⚠️ Fonte ÚNICA das três pontas — modal (client), `/api/leads` e o webhook. Cada uma alcança o
 * `attractionOffers` por um caminho próprio (config assada, `getOfferConfig`, `getOfferConfigCached`),
 * mas a REGRA é esta, num lugar só: com a conta repetida em cada ponta, o mesmo pedido sairia chamado
 * de "ingressos" numa superfície e de "reservas" na outra.
 * ⓘ Derivado da config ATUAL, não gravado no lead: se o admin corrigir o `hasLink` de um atrativo, o
 * vocabulário passa a refletir a verdade — inclusive num pedido antigo.
 */
export function itensKind(
  slugs: string[],
  attractionOffers?: Record<string, AttractionOfferPublic> | null,
): ItensKind {
  if (!slugs.length) return "ingressos";
  const reservas = slugs.filter((s) => attractionOffers?.[s]?.hasLink === false).length;
  if (reservas === 0) return "ingressos";
  return reservas === slugs.length ? "reservas" : "misto";
}

/** O modo de sucesso dos fluxos de atrativo: "close" (mensagem) ou "whatsapp". Sem "link direto" como
 * fallback global — link direto só existe por atrativo específico (URL própria, seção 7). */
export type RoteiroSuccessMode = "close" | "whatsapp";

export interface OfferConfig {
  /** Modo de sucesso — roteiro de compras (produto único do modal). */
  roteiroSuccessMode: RoteiroSuccessMode;
  /** Modo de sucesso — fallback de atrativo em Modo="agency" (seção "Ingresso por atrativo") sem link
   * próprio. Sem "direct": link direto só existe por atrativo específico (URL própria, seção 7) — nunca
   * como fallback genérico global (removido — não fazia sentido sem uma URL própria pra apontar). */
  atrativoSuccessMode: RoteiroSuccessMode;
  modalWhatsapp: string | null;
  botMessageMode: BotMessageMode;
  texts: LocalizedTexts;
  /** Overrides de copy por contexto (ingresso de atrativo / roteiro de compras). */
  productCopies: ProductCopies;
  agencyAcceptLocals: boolean;         // a agência aceita morador local? (roteamento server-side)
  agencyDefined: boolean;              // com agência OCULTA: true = agência ativa (registra/roteia); false = item de ingresso FIXO só visual (sem atribuir agência)
  transportOffer: TransportOffer;      // cross-sell de transporte (agência oficial) — pergunta acima do form, só em atrativo
  /** Config de sucesso por atrativo (Modo/Tem link/URL/nome) — chave = slug. Sempre completo para todo o catálogo. */
  attractionOffers: Record<string, AttractionOfferPublic>;
}

export const PRODUCT_COPY_KINDS: ProductCopyKind[] = [
  "atrativo",
];

export const PRODUCT_COPY_FIELDS: (keyof ProductLeadCopy)[] = [
  "title",
  "subtitle",
  "formHint",
  "submitLabel",
  "successTitle",
  "successClose",
  "successWhatsapp",
  "subjectBadge",
  "subjectIncluded",
  "waGreeting",
  "waLeadText",
  "waButtonLabel",
  "duplicateNoticeTitle",
];

/** Campos EXTRA que só a aba "Ingresso (atrativo)" do 3b tem — ver `AtrativoLeadCopy`. */
export const ATRATIVO_ONLY_COPY_FIELDS: (keyof AtrativoLeadCopy)[] = [
  "successDirect",
  "directButtonLabel",
];

/** Defaults Compras Paraguay — seed do admin / fallback se DB vazio. */
export const DEFAULT_PRODUCT_COPIES: ProductCopies = {
  atrativo: {
    pt: {
      title: "Receba as condições desse ingresso",
      // subtitle: “Orçamento e informações” (decisão do usuário set/2026 — substitui a antiga decisão
      // de vazio). Vale para os DOIS contextos atrativo (ingresso E reserva de data): o modal renderiza
      // `texts.subtitle` do bucket atrativo nos dois. “Orçamento” = dinheiro do VISITANTE (§21.5).
      subtitle: "Orçamento e informações",
      formHint: "",
      submitLabel: "Finalizar e continuar",
      successTitle: "Solicitação de ingresso recebida!",
      successClose:
        "Um especialista em Foz do Iguaçu vai te chamar no WhatsApp com as condições deste ingresso e a melhor forma de encaixá-lo no restante dos seus dias na cidade.",
      successWhatsapp:
        "Quer adiantar? Toque abaixo e comece a conversa agora — a gente já sabe qual ingresso é o seu.",
      subjectBadge: "Ingresso / atrativo",
      subjectIncluded: "Incluído",
      waGreeting: "Olá {nome}! Aqui é do Compras Paraguay. Vi os ingressos que você escolheu — vou te passar as condições:",
      waLeadText: "Olá! Vim pelo Compras Paraguay e quero as condições dos ingressos que escolhi:",
      waButtonLabel: "Falar sobre meu ingresso 💬",
      duplicateNoticeTitle: "Já recebemos sua solicitação para este ingresso!",
      successDirect: "Tudo certo! Para garantir seu ingresso agora mesmo, é só acessar o link oficial abaixo e escolher o seu melhor dia.",
      directButtonLabel: "Finalizar ingresso →",
    },
    en: {
      title: "Receive the conditions for this ticket",
      subtitle: "Budget and information",
      formHint: "",
      submitLabel: "Receive the ticket conditions",
      successTitle: "Ticket request received!",
      successClose:
        "A Foz do Iguaçu specialist will message you on WhatsApp with this ticket's conditions and the best way to fit it into the rest of your days in the city.",
      successWhatsapp:
        "Want to get ahead? Tap below and start the conversation now — we already know which ticket is yours.",
      subjectBadge: "Ticket / attraction",
      subjectIncluded: "Included",
      waGreeting: "Hi {nome}! This is Compras Paraguay. I saw the tickets you picked — here are the conditions:",
      waLeadText: "Hi! I came from Compras Paraguay and I'd like the conditions for the tickets I picked:",
      waButtonLabel: "Talk about my ticket 💬",
      duplicateNoticeTitle: "We already got your request for this ticket!",
      successDirect: "All set! To secure your ticket right now, just open the official link below and pick your best day.",
      directButtonLabel: "Complete ticket →",
    },
    es: {
      title: "Recibe las condiciones de esta entrada",
      subtitle: "Presupuesto e información",
      formHint: "",
      submitLabel: "Finalizar y continuar",
      successTitle: "¡Solicitud de entrada recibida!",
      successClose:
        "Un especialista en Foz do Iguaçu te escribirá por WhatsApp con las condiciones de esta entrada y la mejor forma de encajarla en el resto de tus días en la ciudad.",
      successWhatsapp:
        "¿Quieres adelantar? Toca abajo y empieza la conversación ahora — ya sabemos cuál entrada es la tuya.",
      subjectBadge: "Entrada / atractivo",
      subjectIncluded: "Incluido en el pedido de condiciones",
      waGreeting: "¡Hola {nome}! Aquí Compras Paraguay. Vi las entradas que elegiste — te paso las condiciones:",
      waLeadText: "¡Hola! Vine por Compras Paraguay y quiero las condiciones de las entradas que elegí:",
      waButtonLabel: "Hablar sobre mi entrada 💬",
      duplicateNoticeTitle: "¡Ya recibimos tu solicitud para esta entrada!",
      successDirect: "¡Todo listo! Para asegurar tu entrada ahora mismo, solo accede al enlace oficial de abajo y elige tu mejor día.",
      directButtonLabel: "Finalizar entrada →",
    },
  },
};

/** Chave app_settings: product_copy_{kind}_{field}[_en|_es] */
export const productCopyKey = (
  kind: ProductCopyKind,
  field: keyof AtrativoLeadCopy,
  locale: Locale,
): string => {
  const base = `product_copy_${kind}_${field}`;
  return locale === "pt" ? base : `${base}_${locale}`;
};

/** Saudação pronta padrão que o PARCEIRO envia ao lead (wa.me do botão "Atender Cliente"). SERVER-ONLY, sempre pt (mensagem operacional interna, não é lida pelo visitante). {nome}/{cupom} substituídos no server. */
export const DEFAULT_PARTNER_GREETING =
  "Olá {nome}! Vi aqui no portal Compras Paraguay que você resgatou seu benefício exclusivo. Aqui está o seu cupom: {cupom}. Posso te enviar mais informações?";

/** Saudação pronta padrão que a AGÊNCIA envia ao lead (botão "Abrir WhatsApp do cliente" no Telegram — TG-4).
 * SERVER-ONLY (nunca vai ao OfferConfig client). Editável por idioma em "Oferta da agência" (admin) — vai no
 * idioma que o LEAD escolheu no modal (`leads.locale`), não no idioma de quem está no Telegram. {nome} substituído no server. */
export const DEFAULT_WA_GREETING: Record<Locale, string> = {
  pt: "Olá {nome}! Aqui é do Compras Paraguay. Recebi a sua solicitação e posso te passar as condições e a melhor forma de organizar os seus dias em Foz do Iguaçu. Podemos falar por aqui?",
  en: "Hi {nome}! This is Compras Paraguay. I got your request and I can share the conditions and the best way to organize your days in Foz do Iguaçu. Can we talk here?",
  es: "¡Hola {nome}! Aquí Compras Paraguay. Recibí tu solicitud y puedo pasarte las condiciones y la mejor forma de organizar tus días en Foz do Iguaçu. ¿Hablamos por aquí?",
};

// ⚠️ Este bloco é FALLBACK. Em produção todo CTA real define um contexto de produto, e aí quem manda é
// `DEFAULT_PRODUCT_COPIES` (atrativo) — estes textos só aparecem se um dia surgir um
// CTA sem `detail`. Mantidos genéricos de propósito: não dá pra nomear o produto sem saber qual é.
const DEFAULT_TEXTS_PT: ModalTexts = {
  title: "Falta pouco pra fechar os seus dias em Foz 😍",
  subtitle: "Deixe seus dados e receba as condições, os links oficiais e a melhor ordem pra aproveitar melhor o seu tempo na cidade.",
  formHint: "Leva segundos — e nada aqui é automático:",
  submitLabel: "Receber as condições",
  successTitle: "Tudo certo!",
  successClose: "Um especialista em Foz do Iguaçu vai te chamar no WhatsApp com as condições e a melhor forma de organizar os seus dias na cidade.",
  successWhatsapp: "Quer adiantar? Toque abaixo e comece a conversa agora.",
  qLocal: "Você é morador de Foz do Iguaçu?",
  qInFoz: "Você já está em Foz do Iguaçu?",
  // ⛔ VAZIO de propósito (decisão do usuário): o passo de qualificação não precisa de chamada, e
  // "finalize a compra" era falso — aqui ninguém compra, e no atrativo sem ingresso nem existe compra.
  qualifyTitle: "",
};

const DEFAULT_TEXTS_EN: ModalTexts = {
  title: "You're one step from sorting your days in Foz 😍",
  subtitle: "Leave your details and get the conditions, the official links and the best order to make the most of your time in the city.",
  formHint: "It takes seconds — and nothing here is automated:",
  submitLabel: "Receive the conditions",
  successTitle: "All set!",
  successClose: "A Foz do Iguaçu specialist will message you on WhatsApp with the conditions and the best way to organize your days in the city.",
  successWhatsapp: "Want to get ahead? Tap below and start the conversation now.",
  qLocal: "Are you a resident of Foz do Iguaçu?",
  qInFoz: "Are you already in Foz do Iguaçu?",
  qualifyTitle: "",
};

const DEFAULT_TEXTS_ES: ModalTexts = {
  title: "Falta poco para cerrar tus días en Foz 😍",
  subtitle: "Deja tus datos y recibe las condiciones, los enlaces oficiales y el mejor orden para aprovechar mejor tu tiempo en la ciudad.",
  formHint: "Toma segundos — y nada aquí es automático:",
  submitLabel: "Recibir las condiciones",
  successTitle: "¡Todo listo!",
  successClose: "Un especialista en Foz do Iguaçu te escribirá por WhatsApp con las condiciones y la mejor forma de organizar tus días en la ciudad.",
  successWhatsapp: "¿Quieres adelantar? Toca abajo y empieza la conversación ahora.",
  qLocal: "¿Eres residente de Foz do Iguaçu?",
  qInFoz: "¿Ya estás en Foz do Iguaçu?",
  qualifyTitle: "",
};

/** Defaults por idioma (seed inicial dos campos ainda não editados no admin). */
export const DEFAULT_TEXTS: LocalizedTexts = { pt: DEFAULT_TEXTS_PT, en: DEFAULT_TEXTS_EN, es: DEFAULT_TEXTS_ES };

/** Cross-sell de transporte (agência oficial) — default (editável no admin; começa desligado). Nome vem do catálogo. */
export const DEFAULT_TRANSPORT_OFFER: TransportOffer = {
  enabled: false,
  agencySlug: null,
  texts: {
    pt: {
      title: "Incluir transporte no seu roteiro?",
      desc: "A gente organiza junto, para uma experiência sem filas e com preferência nos corredores da cidade.",
    },
    en: {
      title: "Include transport in your itinerary?",
      desc: "We arrange it together, for an experience without queues and with priority on the city's corridors.",
    },
    es: {
      title: "¿Incluir transporte en tu itinerario?",
      desc: "Lo organizamos junto, para una experiencia sin filas y con preferencia en los corredores de la ciudad.",
    },
  },
};

export const DEFAULT_OFFER: OfferConfig = {
  roteiroSuccessMode: "close",
  atrativoSuccessMode: "close",
  modalWhatsapp: null,
  botMessageMode: "assume",
  texts: DEFAULT_TEXTS,
  productCopies: DEFAULT_PRODUCT_COPIES,
  agencyAcceptLocals: false,
  agencyDefined: false,
  transportOffer: DEFAULT_TRANSPORT_OFFER,
  attractionOffers: {},
};

/**
 * Mapa campo→chave BASE em app_settings (usado no server p/ ler/gravar cada texto). A chave BASE (sem
 * sufixo) é o valor **pt** (compatibilidade — já existia antes da Fase 3, preserva tudo que já foi
 * digitado). en/es usam a MESMA chave com sufixo `_en`/`_es` (novas, seedadas de `DEFAULT_TEXTS`).
 */
export const TEXT_KEYS: Record<keyof ModalTexts, string> = {
  title: "modal_title",
  subtitle: "modal_subtitle",
  formHint: "modal_form_hint",
  submitLabel: "modal_submit_label",
  successTitle: "modal_success_title",
  successClose: "modal_success_close",
  successWhatsapp: "modal_success_whatsapp",
  qLocal: "modal_q_local",
  qInFoz: "modal_q_in_foz",
  qualifyTitle: "",
};

/** Chave `app_settings` de um campo de `ModalTexts`, para um locale (pt = chave base, sem sufixo). */
export const textKeyFor = (field: keyof ModalTexts, locale: Locale): string =>
  locale === "pt" ? TEXT_KEYS[field] : `${TEXT_KEYS[field]}_${locale}`;

/** Chave singleton `app_settings` de um sufixo dado, para um locale (pt = chave base, sem sufixo). */
const localizedKey = (base: string, locale: Locale): string => (locale === "pt" ? base : `${base}_${locale}`);

/** Chaves singleton (app_settings) da Ação para parceiros — NÃO são textos do modal. */
export const PARTNER_ACTION_KEYS = {
  agencyAcceptLocals: "agency_accept_locals", // SERVER-ONLY (roteamento): morador local pode ir p/ o grupo da agência
  agencyChatId: "agency_chat_id",             // SERVER-ONLY: grupo da agência (gerenciado no admin; TELEGRAM_CHAT_ID env é só a migração 1×)
  agencyGroupNotifyEnabled: "agency_group_notify_enabled", // SERVER-ONLY: liga/desliga o ENVIO ao grupo sem apagar o chat_id salvo (default true)
  agencyDefined: "agency_defined",            // com agência oculta: agência ativa (registra/roteia) vs item de ingresso fixo só visual
  agencyInfoOnlyNoPlan: "agency_info_only_no_plan", // SERVER-ONLY: sem plano de agência vigente, envia o lead ao grupo em modo SÓ INFO (sem WhatsApp/botão) — default false (opt-in)
  transportEnabled: "transport_offer_enabled",           // cross-sell de transporte (agência oficial): exibir ou não
  transportNoAgencyEnabled: "transport_no_agency_enabled", // idem, quando NÃO há agência definida (chave independente — nunca cruzar com transportEnabled)
  transportTitle: (locale: Locale) => localizedKey("transport_offer_title", locale),
  transportDesc: (locale: Locale) => localizedKey("transport_offer_desc", locale),
} as const;
