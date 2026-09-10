// Filepath: lib/i18n/pedido.ts
// Version: 1.0
// Nome da Versão: "Dicionário da página pública do pedido (/r/[token]) — Compras Paraguay"
//
// A página é renderizada no idioma do LEAD (`leads.locale`), não no cookie de quem abre: o link vai
// para o WhatsApp do turista e para o grupo da agência, e quem escreveu o pedido escolheu o idioma.
//
// Dicionário MAGRO de propósito: este projeto só tem o produto "atrativo" (reserva de data), sem
// wizard, sem ingresso e sem roteiro — nada de rótulos de wizard/ingresso aqui.

import type { Locale } from "./config";

export interface PedidoUI {
  titulo: string;
  intro: string;
  itensLabel: string;
  paraODiaLabel: string;
  pessoasLabel: string;
  transporteLabel: string;
  /** Reserva de data: o transporte não foi perguntado, é parte do serviço — fato do produto. */
  transporteIncluido: string;
  /** Exibida como "Turista" com valor INVERTIDO (morador=sim → turista=não) — o que a agência lê
   *  é o perfil do VISITANTE, não a pergunta. O dado cru continua `isLocal`. */
  prefTurista: string;
  prefInFoz: string;
  identidade: { sim: string; não: string };
  prefsTitle: string;
  enviadoEmLabel: string;
  ctaHint: string;
  /** Navegação de saída da página: Voltar (histórico da aba) e Página inicial (/). */
  voltar: string;
  paginaInicial: string;
  notFoundTitle: string;
  notFoundDesc: string;
  notFoundCta: string;
}

export const PEDIDO_UI: Record<Locale, PedidoUI> = {
  pt: {
    titulo: "Suas reservas",
    intro:
      "Tudo que você escolheu está aqui. Um especialista de Compras no Paraguai em Ciudad del Este revisa e leva as condições até você.",
    itensLabel: "Reserva de data para",
    paraODiaLabel: "Para o dia",
    pessoasLabel: "Para quantas pessoas",
    transporteLabel: "Transporte",
    transporteIncluido: "incluído",
    prefTurista: "É turista",
    prefInFoz: "Já está em Foz",
    identidade: { sim: "sim", não: "não" },
    prefsTitle: "Resumo de suas respostas",
    enviadoEmLabel: "Enviado em",
    ctaHint: "Nada aqui é automático — um especialista em Foz revisa suas escolhas.",
    voltar: "Voltar",
    paginaInicial: "Página inicial",
    notFoundTitle: "Não encontramos este link",
    notFoundDesc:
      "O endereço pode estar incompleto. Comece de novo e escolha o que quer comprar na fronteira.",
    notFoundCta: "Ver roteiros de compras",
  },
  en: {
    titulo: "Your bookings",
    intro:
      "Everything you picked is here. A specialist in Foz do Iguaçu reviews it and brings you the conditions.",
    itensLabel: "Date booking for",
    paraODiaLabel: "For the day",
    pessoasLabel: "For how many people",
    transporteLabel: "Transport",
    transporteIncluido: "included",
    prefTurista: "Is a tourist",
    prefInFoz: "Already in Foz",
    identidade: { sim: "yes", não: "no" },
    prefsTitle: "Summary of your answers",
    enviadoEmLabel: "Sent on",
    ctaHint: "Nothing here is automatic — a Foz specialist reviews your choices.",
    voltar: "Back",
    paginaInicial: "Home page",
    notFoundTitle: "We couldn't find this link",
    notFoundDesc: "The address may be incomplete. Start again and pick what you want to buy at the border.",
    notFoundCta: "See shopping itineraries",
  },
  es: {
    titulo: "Tus reservas",
    intro:
      "Todo lo que elegiste está aquí. Un especialista en Foz de Iguazú lo revisa y te lleva las condiciones.",
    itensLabel: "Reserva de fecha para",
    paraODiaLabel: "Para el día",
    pessoasLabel: "Para cuántas personas",
    transporteLabel: "Transporte",
    transporteIncluido: "incluido",
    prefTurista: "Es turista",
    prefInFoz: "Ya está en Foz",
    identidade: { sim: "sí", não: "no" },
    prefsTitle: "Resumen de tus respuestas",
    enviadoEmLabel: "Enviado el",
    ctaHint: "Nada aquí es automático — un especialista en Foz revisa tus elecciones.",
    voltar: "Volver",
    paginaInicial: "Página inicial",
    notFoundTitle: "No encontramos este enlace",
    notFoundDesc:
      "La dirección puede estar incompleta. Empieza de nuevo y elige lo que quieres comprar en la frontera.",
    notFoundCta: "Ver itinerarios de compras",
  },
};
