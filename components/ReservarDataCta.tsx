// Filepath: components/ReservarDataCta.tsx
// Version: 1.1
// Nome da Versão: "Nasce da home: o CTA dourado 'Reservar data' que ABRE O MODAL do dia de compras"
//
// Um botão, um produto. O funil do site é um só — o dia de compras no Paraguai com carro privativo e
// guia — e o lead dele é a RESERVA DE DATA: o modal nasce no calendário. Este componente existe para
// que o hero e o CtaFinal digam a mesma coisa com o mesmo clique: abrir o modal. Navegar para uma
// página de conteúdo sob um rótulo "Reservar data" seria a promessa e a tela desalinhadas — a
// decepção que `posicionamento.md` §21.2 existe para evitar.
//
// Regras que este arquivo carrega:
//   · §21.2 — o rótulo promete o resultado (a data), nunca o canal nem o instante; quem confirma a
//     disponibilidade é uma pessoa, depois do submit.
//   · §21.8-6 — o texto é o MESMO de `ATTRACTION_DETAIL_UI.ctaReserva` ("Reservar data" / "Reserve a
//     date" / "Reservar fecha"): um PT, uma tradução por idioma. Trocou um, troca o outro.
//   · design-system §2 — `className`/`style` vêm do chamador de propósito: o dourado tem de continuar
//     o único objeto cheio da tela e o rótulo dourado precisa de `text-lg font-bold` (contraste
//     3.02:1 só passa como texto grande). Não endurecer tamanho aqui.
//   · `subjectI18n` viaja nos 3 idiomas porque o modal tem seletor de idioma próprio — ver
//     `TicketOfferOpenDetail` (lib/roteiro-lead.ts): sem isso, trocar o idioma lá dentro deixava o
//     card do assunto no idioma da página.

"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { SHARED_UI } from "@/lib/i18n/shared";
import { internalUrl } from "@/lib/utm";
import TicketOfferButton from "@/components/ticket-offer/TicketOfferButton";

/** Slug do produto: o dia de compras em Ciudad del Este. */
export const RESERVA_ATTRACTION_SLUG = "compras-paraguai-ciudad-del-este";

/** Capa do atrativo no modal — MESMA imagem do card de `/roteiros-de-compras` (AttractionCard) e da
 * página do destino (`app/data/attractions.ts` `cover`). Path fixo em vez de importar o catálogo: este
 * arquivo é client e o catálogo não entra no bundle (razão de o assunto viver aqui). Se trocar a capa
 * do atrativo, troca aqui também. */
const RESERVA_SUBJECT_IMAGE = "/images/atrativos/compras-paraguai-ciudad-del-este/cover.webp";

export default function ReservarDataCta({
  ctaType,
  source,
  className,
  style,
  children,
}: {
  /** Telemetria de CTA — cada posição tem a sua (`home_hero`, `home_cta_final`…). */
  ctaType: string;
  /** Origem UTM, mesma convenção dos `internalUrl` do restante da página. */
  source: string;
  className?: string;
  style?: React.CSSProperties;
  /** Rótulo opcional: sem children, usa `ctaReserva` do idioma ativo. */
  children?: React.ReactNode;
}) {
  const { locale } = useLocale();
  const t = SHARED_UI[locale].roteirosCta;
  // As três versões do card do assunto, montadas a partir do mesmo dicionário (pequeno — esta é a
  // razão de o assunto viver aqui e não vir de `app/data/attractions.ts`, que não entra no bundle).
  const subjectI18n = {
    pt: { title: SHARED_UI.pt.roteirosCta.reservaSubject, subtitle: SHARED_UI.pt.roteirosCta.reservaSubjectSub },
    en: { title: SHARED_UI.en.roteirosCta.reservaSubject, subtitle: SHARED_UI.en.roteirosCta.reservaSubjectSub },
    es: { title: SHARED_UI.es.roteirosCta.reservaSubject, subtitle: SHARED_UI.es.roteirosCta.reservaSubjectSub },
  };

  return (
    <TicketOfferButton
      href={internalUrl(`/roteiros-de-compras/${RESERVA_ATTRACTION_SLUG}`, source)}
      ctaType={ctaType}
      itemSlug={RESERVA_ATTRACTION_SLUG}
      context="atrativo"
      subjectTitle={t.reservaSubject}
      subjectSubtitle={t.reservaSubjectSub}
      // Capa do atrativo no mini-card do modal: sem ela o card nascia com o placeholder 🗺️ — a copy
      // própria deste CTA é de propósito, mas SEM a foto ficava desalinhado do card padrão da página.
      subjectImage={RESERVA_SUBJECT_IMAGE}
      subjectI18n={subjectI18n}
      className={className}
      style={style}
    >
      {children ?? t.ctaReserva}
    </TicketOfferButton>
  );
}
