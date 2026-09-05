// Filepath: lib/i18n/modal.ts
// Version: 2.2
// Nome da Versão: "Rótulo do seletor sem 'ingresso' + as chaves `reservaSuccess*` finalmente ligadas na tela de sucesso"
//
// O modal é CLIENT (renderiza na abertura, pós-hidratação) → traduz sem flash. Estratégia:
//   • UI fixa (placeholders, Sim/Não, LGPD, erros)  → MODAL_UI[locale]  (pt/en/es) — SEMPRE fixa, não editável.
//   • Copy de negócio (title/subtitle/transporte/…) → TODA editável no admin nos 3 idiomas (Fase 3),
//     assada no `OfferConfig.texts`/`transportOffer.texts` (Record<Locale, …>) —
//     `modalTexts`/`transportText` abaixo viraram indexação direta (sem fallback pra dicionário).

import type { Locale } from "./config";

/** Strings FIXAS da UI do modal (não editáveis no admin) — nos 3 idiomas. */
export interface ModalUI {
  namePlaceholder: string;
  emailPlaceholder: string;
  phoneCustomPlaceholder: string;
  /** Rótulo flutuante do campo de telefone. ⚠️ NÃO é o `phoneCustomPlaceholder`: aquele é a
   *  MÁSCARA/exemplo de formato, que só aparece com o campo em foco. */
  phoneLabel: string;
  /** Atrativo de RESERVA (§17-ter, "Tem link - NÃO"): ali o transporte é assumido pelo produto e
   *  a pergunta Sim/Não não aparece. Entra como RÓTULO do mini-card do assunto, no lugar do
   *  `subjectIncluded` ("Incluído") — colado no item a que se refere, sem virar bloco à parte.
   *  ⚠️ Chave FIXA, não texto de oferta do admin: é estado do produto, não copy vendável. */
  transportIncluded: string;
  otherCountry: string;
  submitting: string;
  /** Cobertura de transição entre o submit e a página de obrigado (`EnvioOverlay`).
   *  ⚠️ NÃO reaproveitar `submitting`: aquele é o rótulo do CTA ENQUANTO ele carrega. Repetir a
   *  mesma palavra na cobertura faz parecer que o mesmo passo travou, em vez de ter avançado. */
  finalizing: string;
  lgpdBefore: string;
  lgpdTerms: string;
  lgpdAfter: string;
  yes: string;
  no: string;
  includedBadge: string;
  saberMais: string;
  /** Atrativo SEM venda de ingresso (§17-ter): título e badge do modal falam em RESERVA DE DATA.
   * Fica no dicionário FIXO (não no bucket de produto) porque é a mesma copy dos dois: o que muda é o
   * atrativo, não o produto — criar um 4º bucket em `ProductCopies` custaria tipos, defaults nos 3
   * idiomas e chaves de `app_settings` para duas linhas de texto. */
  reservaTitle: string;
  reservaBadge: string;
  /** Sucesso do atrativo de RESERVA (§17-ter). Sobrescreve `successTitle`/`successClose` do
   *  "3b · Textos por produto", que falam em INGRESSO — vocabulário errado num lugar que não
   *  vende ingresso, e que já contradiz o CTA do card ("Reservar data").
   *  ⚠️ Chaves FIXAS, como `reservaTitle`/`reservaBadge`: é estado do produto, não copy vendável
   *  editável no admin. Mesmo critério já aplicado no título e no badge do modal. */
  reservaSuccessTitle: string;
  reservaSuccessClose: string;
  /** Atrativo: expansor "Incluir ingresso de outros atrativos?" + botão de cancelar do picker. */
  includeOtherAttractions: string;
  cancel: string;
  /** Rótulo do seletor de idioma no topo do modal (transplantado do RG). Fica ao lado do
   * `LanguageSwitcher` — o mesmo do navbar —, e só no modal real: no preview do admin o idioma é
   * escolhido lá, e o switcher gravaria cookie + `router.refresh()`. */
  languageLabel: string;
  /** Estado "enviado" do botão de envio do hotel (sucesso). */
  sent: string;
  errName: string;
  errEmail: string;
  errPhoneShort: string;
  errPhoneIncomplete: string;
  errSelect: string;
  errTurnstile: string;
  errDate: string;
  /** Calendário do dia da visita (atrativo/roteiro) — título acima do DayCalendar. */
  chooseDayTitle: string;
  /** Título acima do QuantityStepper. ⚠️ Pergunta PESSOAS, não ingressos: o campo vale para todo
   * produto do modal (ingresso, reserva de data e roteiro), e "quantos ingressos" seria falso nos dois
   * últimos. É a mesma quantidade — 5 pessoas são 5 ingressos em cada atrativo. */
  quantityTitle: string;
  // Resumo de preferências anexado à mensagem pré-preenchida do wa.me central (item C) — fixas, não editáveis
  // (dados factuais do que o lead respondeu, não copy de negócio). ⚠️ Sem emoji de propósito (correção):
  // "🗺️"/outros compostos quebravam ("�") ao cair no wa.me pré-preenchido em alguns dispositivos — só
  // caracteres simples/universais (ex: "•", U+2022) daqui pra frente nestas linhas.
  prefAlreadyInFoz: string;
  prefNotInFozYet: string;
  prefWantsTransport: string;
  prefNoTransport: string;
  prefVisitDate: string;
  prefTickets: string;
  // Card resumido (contato + qualificação já respondida) — mesmos fatos de prefAlreadyInFoz/prefNotInFozYet,
  // mas sem o bullet "• " (usadas numa linha " · "-separada, não numa lista de preferências).
  summaryLocalYes: string;
  summaryLocalNo: string;
  summaryAlreadyInFoz: string;
  summaryNotInFozYet: string;
  /** Transporte consolidado no card de resumo: respondido (nesta sessão ou herdado de um produto
   * anterior) some do form editável, mas precisa seguir visível aqui — senão parece que a informação
   * se perdeu. Os dois lados aparecem, igual "Moro em Foz"/"Não moro em Foz". */
  summaryTransport: string;
  summaryNoTransport: string;
}

export const MODAL_UI: Record<Locale, ModalUI> = {
  pt: {
    namePlaceholder: "Seu nome",
    emailPlaceholder: "Email (opcional, mas recomendado)",
    phoneCustomPlaceholder: "Ex: +351 912 345 678",
    phoneLabel: "WhatsApp",
    transportIncluded: "Transporte já incluído",
    otherCountry: "🌐 Outro",
    submitting: "Enviando…",
    finalizing: "Finalizando…",
    lgpdBefore: "Ao continuar, você concorda com nossos ",
    lgpdTerms: "Termos",
    lgpdAfter: " e autoriza o compartilhamento do seu nome e WhatsApp com a agência de turismo parceira e/ou os parceiros selecionados, para dar continuidade ao seu atendimento e liberar as vantagens exclusivas dessa parceria.",
    yes: "Sim",
    no: "Não",
    includedBadge: "Incluído",
    saberMais: "Saber mais →",
    reservaTitle: "Receba as condições dessa reserva",
    reservaBadge: "Reserva / atrativo",
    reservaSuccessTitle: "Solicitação de atrativo recebida!",
    reservaSuccessClose:
      "Um especialista em Foz do Iguaçu vai te chamar no WhatsApp com as condições deste atrativo.",
    includeOtherAttractions: "Incluir outros atrativos no mesmo dia?",
    cancel: "cancelar",
    languageLabel: "Idioma",
    sent: "Enviado",
    errName: "Nome muito curto",
    errEmail: "Email inválido",
    errPhoneShort: "Número muito curto (inclua o código do país)",
    errPhoneIncomplete: "Número incompleto",
    errSelect: "Selecione uma opção",
    errTurnstile: "Confirme que você não é um robô e tente de novo.",
    errDate: "Selecione o dia da sua visita",
    chooseDayTitle: "Escolha o melhor dia para você",
    quantityTitle: "Para quantas pessoas?",
    prefAlreadyInFoz: "• Já estou em Foz",
    prefNotInFozYet: "• Ainda não estou em Foz",
    prefWantsTransport: "• Gostaria de transporte",
    prefNoTransport: "• Não gostaria de transporte",
    prefVisitDate: "• Dia escolhido",
    prefTickets: "• Ingressos",
    summaryLocalYes: "Moro em Foz",
    summaryLocalNo: "Não moro em Foz",
    summaryAlreadyInFoz: "Já estou em Foz",
    summaryNotInFozYet: "Ainda não estou em Foz",
    summaryTransport: "Transporte incluído",
    summaryNoTransport: "Sem transporte",
  },
  en: {
    namePlaceholder: "Your name",
    emailPlaceholder: "Email (optional, but recommended)",
    phoneCustomPlaceholder: "e.g. +351 912 345 678",
    phoneLabel: "WhatsApp",
    transportIncluded: "Transport already included",
    otherCountry: "🌐 Other",
    submitting: "Sending…",
    finalizing: "Finishing up…",
    lgpdBefore: "By continuing, you agree to our ",
    lgpdTerms: "Terms",
    lgpdAfter: " and authorize us to share your name and WhatsApp number with the partner travel agency and/or the selected partners, so they can follow up with you and unlock the exclusive perks of this partnership.",
    yes: "Yes",
    no: "No",
    includedBadge: "Included",
    saberMais: "Learn more →",
    reservaTitle: "Receive the conditions for this booking",
    reservaBadge: "Booking / attraction",
    reservaSuccessTitle: "Booking request received!",
    reservaSuccessClose:
      "A specialist in Foz do Iguaçu will message you on WhatsApp with the conditions for this attraction.",
    includeOtherAttractions: "Add other attractions to the same day?",
    cancel: "cancel",
    languageLabel: "Language",
    sent: "Sent",
    errName: "Name too short",
    errEmail: "Invalid email",
    errPhoneShort: "Number too short (include the country code)",
    errPhoneIncomplete: "Incomplete number",
    errSelect: "Please select an option",
    errTurnstile: "Please confirm you're not a robot and try again.",
    errDate: "Please select the day of your visit",
    chooseDayTitle: "Choose the best day for you",
    quantityTitle: "For how many people?",
    prefAlreadyInFoz: "• I'm already in Foz",
    prefNotInFozYet: "• Not in Foz yet",
    prefWantsTransport: "• I'd like transport",
    prefNoTransport: "• I don't need transport",
    prefVisitDate: "• Chosen day",
    prefTickets: "• Tickets",
    summaryLocalYes: "I live in Foz",
    summaryLocalNo: "I don't live in Foz",
    summaryAlreadyInFoz: "I'm already in Foz",
    summaryNotInFozYet: "Not in Foz yet",
    summaryTransport: "Transport included",
    summaryNoTransport: "No transport",
  },
  es: {
    namePlaceholder: "Tu nombre",
    emailPlaceholder: "Email (opcional, pero recomendado)",
    phoneCustomPlaceholder: "Ej: +351 912 345 678",
    phoneLabel: "WhatsApp",
    transportIncluded: "Transporte ya incluido",
    otherCountry: "🌐 Otro",
    submitting: "Enviando…",
    finalizing: "Finalizando…",
    lgpdBefore: "Al continuar, aceptas nuestros ",
    lgpdTerms: "Términos",
    lgpdAfter: " y autorizas que compartamos tu nombre y WhatsApp con la agencia de turismo asociada y/o los socios seleccionados, para darte seguimiento y liberar las ventajas exclusivas de esta alianza.",
    yes: "Sí",
    no: "No",
    includedBadge: "Incluida",
    saberMais: "Saber más →",
    reservaTitle: "Recibe las condiciones de esta reserva",
    reservaBadge: "Reserva / atractivo",
    reservaSuccessTitle: "¡Solicitud de atractivo recibida!",
    reservaSuccessClose:
      "Un especialista en Foz do Iguaçu te escribirá por WhatsApp con las condiciones de este atractivo.",
    includeOtherAttractions: "¿Incluir otros atractivos en el mismo día?",
    cancel: "cancelar",
    languageLabel: "Idioma",
    sent: "Enviado",
    errName: "Nombre demasiado corto",
    errEmail: "Email inválido",
    errPhoneShort: "Número demasiado corto (incluye el código de país)",
    errPhoneIncomplete: "Número incompleto",
    errSelect: "Selecciona una opción",
    errTurnstile: "Confirma que no eres un robot e inténtalo de nuevo.",
    errDate: "Selecciona el día de tu visita",
    chooseDayTitle: "Elige el mejor día para ti",
    quantityTitle: "¿Para cuántas personas?",
    prefAlreadyInFoz: "• Ya estoy en Foz",
    prefNotInFozYet: "• Todavía no estoy en Foz",
    prefWantsTransport: "• Me gustaría transporte",
    prefNoTransport: "• No necesito transporte",
    prefVisitDate: "• Día elegido",
    prefTickets: "• Entradas",
    summaryLocalYes: "Vivo en Foz",
    summaryLocalNo: "No vivo en Foz",
    summaryAlreadyInFoz: "Ya estoy en Foz",
    summaryNotInFozYet: "Todavía no estoy en Foz",
    summaryTransport: "Transporte incluido",
    summaryNoTransport: "Sin transporte",
  },
};

import type { LocalizedTexts, TransportOfferTexts } from "@/lib/offer-defaults";

/** Copy de negócio do idioma ativo — indexação direta (Fase 3: todos os 3 idiomas vêm do OfferConfig). */
export function modalTexts(locale: Locale, texts: LocalizedTexts) {
  return texts[locale];
}
/** Transporte (title/desc/includeLabel) do idioma ativo. */
export function transportText(locale: Locale, texts: Record<Locale, TransportOfferTexts>): TransportOfferTexts {
  return texts[locale];
}

/**
 * Resumo das preferências do lead (item C) — anexado à mensagem pré-preenchida do wa.me central
 * ("Falar com a Agência Agora"), pra o vendedor já saber sem precisar perguntar de novo. Cada linha só
 * aparece se fizer sentido: "já em Foz" só se for turista (isLocal===false); transporte só se o bloco
 * estava disponível (agência ativa + transportOffer ligado); roteiro só se marcou pelo menos 1 experiência
 * (sem opção marcada = fica em silêncio, o vendedor oferece por conta própria). Vazio → retorna "".
 */
export function buildPreferencesSummary(
  locale: Locale,
  input: {
    isLocal: boolean | null;
    alreadyInFoz: boolean | null;
    transportOfferShown: boolean;
    transportChecked: boolean;
    /** Dia (ISO YYYY-MM-DD) e quantidade escolhidos no calendário/stepper — `undefined`/`null` = fluxo
     * sem calendário (roteiro/personalizar não têm quantidade; sem contexto = sem calendário). */
    visitDate?: string | null;
    ticketQty?: number | null;
  },
): string {
  const ui = MODAL_UI[locale];
  const lines: string[] = [];
  if (input.isLocal === false && input.alreadyInFoz !== null) {
    lines.push(input.alreadyInFoz ? ui.prefAlreadyInFoz : ui.prefNotInFozYet);
  }
  if (input.transportOfferShown) {
    lines.push(input.transportChecked ? ui.prefWantsTransport : ui.prefNoTransport);
  }
  if (input.visitDate) {
    const [y, m, d] = input.visitDate.split("-");
    lines.push(`${ui.prefVisitDate}: ${d}/${m}/${y}`);
  }
  if (input.ticketQty) {
    lines.push(`${ui.prefTickets}: ${input.ticketQty}`);
  }
  return lines.length ? `\n\n${lines.join("\n")}` : "";
}
