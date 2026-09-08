// Filepath: lib/offer-defaults.ts
// Version: 3.0
// Nome da Versão: "Link direto por atrativo EXTINTO — todo atrativo é RESERVA DE DATA: caem
// AttractionOfferMode/Setting/Public, successDirect/directButtonLabel e o modo `direct`"
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

// Sem `"direct"`: não existe mais entrega self-serve por link oficial. Todo produto do modal é captura
// de lead (reserva de data) e a entrega é humana, depois do submit.
export type ModalSuccessMode = "close" | "whatsapp";
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

/** Cross-sell de transporte — hoje é FATO DO PRODUTO: todo atrativo é reserva com transporte incluso,
 * o modal não pergunta Sim/Não e não há toggle nem copy configurável
 * (conventions/tracking-metricas.md §11). O tipo sobrevive só como portador do identificador de
 * atribuição do pixel. */
export interface TransportOffer {
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
  /** Saudação do wa.me quando quem inicia a conversa é a AGÊNCIA ATIVA ("Definir agência" + plano
   * vigente) — o lead precisa saber desde a 1ª linha QUEM está falando, pois o nome/perfil de quem
   * atende muda. Sem agência ativa vale o `waGreeting` acima (voz do portal). Mesmo lugar/chave
   * (`waGreetingAgency`), placeholder extra `{agencia}` = nome da agência ativa — pré-preenchido pelo
   * webhook (`greetingFor`) antes de o template entrar no card/botão. */
  waGreetingAgency: string;
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
 * Textos do produto "reserva de data de atrativo".
 *
 * ⚠️ Já foi `interface extends ProductLeadCopy` com dois campos extras (`successDirect` /
 * `directButtonLabel`), que alimentavam a tela de sucesso com LINK DIRETO para o site oficial do
 * atrativo. O modo "Direto" deixou de existir (v3.0): os 5 atrativos do catálogo são serviços
 * reservados com a agência — não há ingresso nem compra self-serve. O nome do tipo fica como alias
 * para não fragmentar `ProductCopies`/`productCopyKey` nem as chaves `product_copy_atrativo_*`.
 */
export type AtrativoLeadCopy = ProductLeadCopy;

export type ProductCopyKind = "atrativo";

export type ProductCopies = {
  atrativo: Record<Locale, AtrativoLeadCopy>;
};

/** O antigo `AttractionOfferSetting` (Modo Direto/Agência + Tem link + URL, por atrativo, salvo em
 * `attraction_offer_settings`) foi EXTINTO na v3.0: os atrativos do catálogo não vendem ingresso, todos
 * abrem a captura de **reserva de data**. O que o client ainda precisa saber do catálogo é só o NOME de
 * cada atrativo (seletor "incluir outros atrativos" do modal) — daí `attractionCatalog` abaixo, projeção
 * magra e estática, sem tabela e sem admin.
 */

/** Como classificar o VOCABULÁRIO de um pedido de atrativo: o que ele contém decide se a superfície
 * fala em "ingressos", "reservas" ou nos dois. */
export type ItensKind = "ingressos" | "reservas" | "misto";

/**
 * Classifica os itens de um pedido.
 *
 * ⚠️ Desde a v3.0 só existe uma resposta possível: **`"reservas"`**. As variantes `"ingressos"` e
 * `"misto"` continuam no tipo porque `lib/telegram.ts` monta o rótulo da linha do pedido a partir
 * delas — removê-las daqui obrigaria a mexer na mensagem operacional da agência na mesma rodada, sem
 * ganho nenhum. Pedido vazio devolve `"ingressos"` como antes: é o valor neutro que o card trata como
 * "sem lista de itens".
 *
 * ⓘ Fonte ÚNICA das três pontas (modal, `/api/leads`, webhook) — decisão que continua valendo: a regra
 * mora aqui, cada ponta só alcança a função.
 */
export function itensKind(slugs: string[]): ItensKind {
  return slugs.length ? "reservas" : "ingressos";
}

/** O modo de sucesso dos fluxos de atrativo: "close" (mensagem) ou "whatsapp". Sem "link direto" como
 * fallback global — link direto só existe por atrativo específico (URL própria, seção 7). */
export type RoteiroSuccessMode = "close" | "whatsapp";

export interface OfferConfig {
  /** Modo de sucesso — roteiro de compras (produto único do modal). */
  roteiroSuccessMode: RoteiroSuccessMode;
  /** Modo de sucesso dos atrativos (reserva de data) — "Só mensagem" ou "Iniciar conversa". */
  atrativoSuccessMode: RoteiroSuccessMode;
  modalWhatsapp: string | null;
  botMessageMode: BotMessageMode;
  texts: LocalizedTexts;
  /** Overrides de copy por contexto (ingresso de atrativo / roteiro de compras). */
  productCopies: ProductCopies;
  agencyAcceptLocals: boolean;         // a agência aceita morador local? (roteamento server-side)
  agencyDefined: boolean;              // com agência OCULTA: true = agência ativa (registra/roteia); false = item de ingresso FIXO só visual (sem atribuir agência)
  transportOffer: TransportOffer;      // transporte sempre incluído (fato do produto) — carrega só o partner_slug da agência ativa
  /**
   * Catálogo client-safe: `slug → nome` de todo atrativo (montado no servidor a partir de
   * `app/data/attractions.ts`, que é pesado e NÃO pode ser importado no client). Serve a um único uso:
   * o seletor "incluir outros atrativos" do modal e o resumo do pedido. Não é configurável.
   */
  attractionCatalog: Record<string, string>;
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
  "waGreetingAgency",
  "waLeadText",
  "waButtonLabel",
  "duplicateNoticeTitle",
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
      waGreeting: "Olá {nome}! Aqui é do Compras Paraguay. Vi {pedidos} que você escolheu — vou te passar as condições:",
      waGreetingAgency: "Olá {nome}! Aqui é a agência {agencia}. Recebemos {pedidos} que você escolheu no Compras Paraguay — vou te passar as condições:",
      // Mensagem que o LEAD manda ao clicar no wa.me (site): mesmo template da mensagem da agência
      // (intro → resumo → lista "Incluído: …"), mudando só o gancho/introdução. `{pedidos}` vira
      // "a reserva"/"as reservas" conforme o nº de itens.
      waLeadText: "Olá! Fiz {pedidos} no Compras Paraguay e gostaria de receber as condições:",
      waButtonLabel: "Falar sobre minha reserva 💬",
      duplicateNoticeTitle: "Já recebemos sua solicitação para este ingresso!",
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
      waGreeting: "Hi {nome}! This is Compras Paraguay. I saw {pedidos} you picked — here are the conditions:",
      waGreetingAgency: "Hi {nome}! This is the {agencia} agency. We received {pedidos} you picked on Compras Paraguay — here are the conditions:",
      waLeadText: "Hi! I made {pedidos} on Compras Paraguay and I'd like to receive the conditions:",
      waButtonLabel: "Talk about my booking 💬",
      duplicateNoticeTitle: "We already got your request for this ticket!",
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
      waGreeting: "¡Hola {nome}! Aquí Compras Paraguay. Vi {pedidos} que elegiste — te paso las condiciones:",
      waGreetingAgency: "¡Hola {nome}! Aquí la agencia {agencia}. Recibimos {pedidos} que elegiste en Compras Paraguay — te paso las condiciones:",
      waLeadText: "¡Hola! Hice {pedidos} en Compras Paraguay y quiero recibir las condiciones:",
      waButtonLabel: "Hablar sobre mi reserva 💬",
      duplicateNoticeTitle: "¡Ya recibimos tu solicitud para esta entrada!",
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

export const DEFAULT_OFFER: OfferConfig = {
  roteiroSuccessMode: "close",
  atrativoSuccessMode: "close",
  modalWhatsapp: null,
  botMessageMode: "assume",
  texts: DEFAULT_TEXTS,
  productCopies: DEFAULT_PRODUCT_COPIES,
  agencyAcceptLocals: false,
  agencyDefined: false,
  transportOffer: { agencySlug: null },
  attractionCatalog: {},
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

/** Chaves singleton (app_settings) da Ação para parceiros — NÃO são textos do modal. */
export const PARTNER_ACTION_KEYS = {
  agencyAcceptLocals: "agency_accept_locals", // SERVER-ONLY (roteamento): morador local pode ir p/ o grupo da agência
  agencyChatId: "agency_chat_id",             // SERVER-ONLY: grupo da agência (gerenciado no admin; TELEGRAM_CHAT_ID env é só a migração 1×)
  agencyGroupNotifyEnabled: "agency_group_notify_enabled", // SERVER-ONLY: liga/desliga o ENVIO ao grupo sem apagar o chat_id salvo (default true)
  agencyDefined: "agency_defined",            // com agência oculta: agência ativa (registra/roteia) vs item de ingresso fixo só visual
  agencyInfoOnlyNoPlan: "agency_info_only_no_plan", // SERVER-ONLY: sem plano de agência vigente, envia o lead ao grupo em modo SÓ INFO (sem WhatsApp/botão) — default false (opt-in)
} as const;
