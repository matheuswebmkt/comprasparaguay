// Filepath: components/ticket-offer/TicketOfferModal.tsx
// Version: 10.6
// Nome da Versão: "CTA de envio ganha o mesmo spinner+rótulo do CTA final do wizard"
// Baseado na Versão: 10.1 ("Grava transportChecked no handoff pra tela de sucesso — Sprint 7")
// Baseado na Versão: 10.0 ("Calendário do dia da visita/início (atrativo + roteiro pronto/personalizar) +
// quantidade de ingressos (só atrativo) — DayCalendar/QuantityStepper, gate sequencial antes da
// qualificação (D5/D6).")
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Script from "next/script";
import { X, CalendarCheck, Check, CircleCheck, Loader2, Pencil, Route, Ticket } from "lucide-react";
import TurnstileWidget, {
  TURNSTILE_ENABLED,
} from "@/components/ticket-offer/TurnstileWidget";
import DayCalendar from "@/components/ticket-offer/DayCalendar";
import { track, getSessionId, getVisitorId } from "@/lib/track";
import { modalTrack, newModalId, type ModalStep } from "@/lib/modal-track";
import { getInboundUtms } from "@/lib/utm";
import {
  COUNTRIES,
  applyPhoneMask,
  type CountryEntry,
} from "@/lib/phone-countries";
import { trackConversion, CONVERSIONS } from "@/lib/analytics";
import { taxonomyParams, VERTICALS, NICHE_KEYS } from "@/lib/tracking-taxonomy";
import { buildLeadEventParams } from "@/lib/lead-value";
import { useOfferConfig } from "@/components/cta-mode/CtaModeProvider";
import { useLocale } from "@/components/i18n/LocaleProvider";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import {
  MODAL_UI,
  modalTexts,
  transportText,
} from "@/lib/i18n/modal";
import { buildWaMessage, resumoCurto } from "@/lib/pedido-resumo";
import type { Locale } from "@/lib/i18n/config";
import {
  DEFAULT_PRODUCT_COPIES,
  itensKind,
  type OfferConfig,
  type ProductCopyKind,
  type ModalSuccessMode,
} from "@/lib/offer-defaults";
import {
  isRoteiroLeadContext,
  isAtrativoLeadContext,
  resolveLeadKind,
  isPersonalizarIntent,
  resolveLeadModalCopy,
  type TicketOfferOpenDetail,
} from "@/lib/roteiro-lead";
import {
  LEAD_HANDOFF_KEY,
  OBRIGADO_PATH,
  type LeadSuccessHandoff,
} from "@/lib/lead-success-handoff";
import {
  loadKnownLeadContact,
  rememberKnownLead,
  productSignature,
  recentSubmissionOf,
} from "@/lib/known-lead";
import { ENVIO_EVENT } from "@/components/ui/EnvioOverlay";

type Stage = "form" | "submitting" | "success";

/** Divisória sutil do modal (mesma linha abaixo do WhatsApp no sucesso). */
function ModalDivider({ className = "mt-6 pt-5" }: { className?: string }) {
  return (
    <div
      className={`border-t ${className}`}
      style={{ borderColor: "hsl(210,20%,88%)" }}
      aria-hidden="true"
    />
  );
}

type OpenDetail = TicketOfferOpenDetail;

function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

/** ID do evento (UUID) — casa o Lead do Pixel (browser) com o do CAPI (servidor) p/ dedupe. */
function newEventId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID)
    return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

// --- Item 3 (persistência) — sobrevive a fechar/reabrir E a um reload/atualização de página (sessionStorage:
// dura enquanto a aba estiver aberta; limpa sozinho ao fechá-la — não fica PII pendurada indefinidamente). ---
const DRAFT_STORAGE_KEY = "rgf_ticket_offer_draft";

interface PersistedDraft {
  nome: string;
  email: string;
  phone: string;
  countryPrefix: string;
  isCustom: boolean;
  isLocal: boolean | null;
  alreadyInFoz: boolean | null;
  /** Tri-state (`true` quer · `false` recusou · `null` ainda não respondeu) — precisa guardar a RECUSA,
   * senão quem responde "Não" é perguntado de novo a cada reabertura. */
  transportWanted: boolean | null;
  includeOtherAttractions: boolean;
  extraAttractions: string[];
  /** Ingresso de atrativo / roteiro pronto / personalizar — só no rascunho de SESSÃO (nunca em
   * known-lead, que é cross-sessão: o dia é sensível ao tempo, não faz sentido pré-preencher dias depois). */
  visitDate: string | null;
  ticketQty: number;
}

function loadDraft(): PersistedDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(DRAFT_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PersistedDraft) : null;
  } catch {
    return null; // storage indisponível (modo privado/quota/JSON inválido) — degrada pro form em branco
  }
}

function saveDraft(d: PersistedDraft): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(d));
  } catch {
    // noop — sem persistência nesta sessão, mas o modal segue funcionando normalmente
  }
}

function clearDraft(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // noop
  }
}

interface TicketOfferModalProps {
  /**
   * Preview embutido no editor admin (`/admin/dashboard/oferta`, seção "4 · Textos do modal"): usa a config do
   * RASCUNHO (ainda não salvo) em vez do contexto real, renderiza INLINE (sem overlay/backdrop fixo), fica
   * sempre "aberto" e NUNCA dispara rede/analytics reais (submit, CTAs de sucesso e CTAs de parceiro viram
   * inertes). É "exatamente o mesmo modal", só em modo visualização — ver conventions.md.
   */
  preview?: {
    offer: OfferConfig;
    /** Controla de fora qual tela mostrar (tabs "Formulário"/"Sucesso" no admin). */
    stage?: "form" | "success";
    /** Avisa o admin quando o estágio muda por dentro do preview (submit → sucesso; "Fechar" → formulário),
     * pra manter as tabs sincronizadas com o que o preview está realmente mostrando. */
    onStageChange?: (stage: "form" | "success") => void;
    /** Idioma exibido no preview (i18n Fase 3 — segue o idioma que o admin está editando). Default "pt". */
    locale?: Locale;
    /** Simula o produto selecionado na aba "Textos por produto" (default "atrativo") — o preview passa
     * a abrir com o MESMO contexto que a produção usaria, então os textos genéricos vs por-produto se
     * comportam igual ao site real (nada de "funciona só no preview"). */
    productKind?: ProductCopyKind;
  };
}

/** Detail sintético do preview — produto único (atrativo) na simplificação Compras PY. */
function previewDetailFor(_kind: ProductCopyKind = "atrativo"): OpenDetail {
  return {
    href: "#",
    ctaType: "atrativo_ingresso",
    context: "atrativo",
    itemSlug: "preview",
    subjectTitle: "Atrativo de exemplo",
  };
}

export default function TicketOfferModal({
  preview,
}: TicketOfferModalProps = {}) {
  const router = useRouter();
  const [open, setOpen] = useState(!!preview);
  const [detail, setDetail] = useState<OpenDetail | null>(
    preview ? previewDetailFor(preview.productKind) : null,
  );
  const [stage, setStage] = useState<Stage>("form");
  /** Reenvio do MESMO produto dentro da janela de dedup: em vez de mandar pra `/obrigado` de novo, o
   * modal abre já mostrando o aviso de "já estamos com sua solicitação" + o CTA de conversa. Guarda o
   * `modal_id` da submissão ORIGINAL — é ele que casa o clique no CTA com o lead certo
   * (`/api/leads/success`). `null` = fluxo normal. */
  const [duplicateModalId, setDuplicateModalId] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState<CountryEntry>(COUNTRIES[0]);
  const [isCustom, setIsCustom] = useState(false);
  const [errors, setErrors] = useState<{
    nome?: string;
    email?: string;
    phone?: string;
    local?: string;
    inFoz?: string;
    turnstile?: string;
    date?: string;
  }>({});
  // Card consolidado (lead conhecido/rascunho válido, ver lib/known-lead.ts): compacta nome/e-mail/telefone
  // num resumo em vez do form editável, quando já existe uma identidade válida na abertura. "Editar" volta
  // pro form de sempre. Recalculado em TODA abertura (não só a 1ª) — ver o handler de "ticket-offer:open".
  const [editingContact, setEditingContact] = useState(true);
  // Ação para parceiros (PA §15): qualificação (sempre) + seleção de ofertas.
  const [isLocal, setIsLocal] = useState<boolean | null>(null);
  const [alreadyInFoz, setAlreadyInFoz] = useState<boolean | null>(null);
  // Transporte (cross-sell da agência oficial) — TRI-STATE, mesma forma de `isLocal`/`alreadyInFoz`:
  // `true` quer · `false` recusou · `null` ainda não respondeu. Um único estado de propósito: com dois
  // booleanos separados ("marcado" + "já respondeu") existe um par inválido possível, e é justamente ele
  // que confundiria "disse não" com "nunca perguntaram" — na consolidação entre produtos isso faria quem
  // respondeu "Não" ser perguntado de novo a cada reabertura.
  const [transportWanted, setTransportWanted] = useState<boolean | null>(null);
  const transportChecked = transportWanted === true;
  const transportAnswered = transportWanted !== null;
  // Atrativo: "Incluir ingresso de outros atrativos?" — pacote com mais de um atrativo no mesmo lead.
  const [includeOtherAttractions, setIncludeOtherAttractions] = useState(false);
  const [extraAttractions, setExtraAttractions] = useState<string[]>([]);
  // Calendário do dia da visita/início (atrativo + roteiro pronto/personalizar) + quantidade de
  // ingressos (só atrativo) — ver `wantsDate`/`wantsQty` abaixo. Persistem só no rascunho de SESSÃO.
  const [visitDate, setVisitDate] = useState<string | null>(null);
  const [ticketQty, setTicketQty] = useState<number>(1);
  // Dedup silencioso (antiabuso): o MESMO WhatsApp reenviou o form há pouco → a agência não foi renotificada,
  // mas o lead precisa saber (senão parece que o envio falhou) — vira um sucesso especial, ver `/api/leads`.
  const [wasDuplicate, setWasDuplicate] = useState(false);
  /** Token do pedido devolvido por `/api/leads` — vira o link curto (/r/[token]) na mensagem e no handoff. */
  const [pedidoToken, setPedidoToken] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null); // token do anti-bot (Cloudflare Turnstile)
  /** Sessão visitante (magic link salvar roteiro) — pré-preenche nome/e-mail. */
  const [visitorPrefill, setVisitorPrefill] = useState<{
    email: string;
    name: string | null;
  } | null>(null);
  const nomeRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null); // corpo com scroll — reseta ao topo a cada troca de estágio
  const honeypotRef = useRef<HTMLInputElement>(null); // campo-armadilha (invisível p/ humanos; bot preenche → dropado no server)
  const modalIdRef = useRef<string>(""); // UUID da abertura atual (funil do modal)
  const firedRef = useRef<Set<string>>(new Set()); // passos já disparados nesta abertura (dedupe)
  const draftInitRef = useRef(false); // já aplicou os defaults nesta "sessão" de rascunho? (item 3 — persistência)
  const abandonBeaconFiredRef = useRef(false); // já disparou o beacon de abandono nesta abertura? (ver fireAbandonBeacon)
  // Scroll automático pro próximo item ao responder uma pergunta/marcação (UX) — refs das seções que vão sendo
  // liberadas pelo gate sequencial (ver `readyForForm`). `justAnsweredRef` só fica `true` logo após um clique
  // REAL do usuário (setado nos handlers `choose*`/`toggle*`) — nunca durante a restauração de um rascunho, que
  // seta o mesmo estado diretamente (sem passar pelos handlers) e não deve disparar scroll nenhum.
  const calendarSectionRef = useRef<HTMLDivElement>(null); // calendário do dia — 1º item do bloco liberado
  const qInFozSectionRef = useRef<HTMLDivElement>(null);
  const qLocalSectionRef = useRef<HTMLDivElement>(null);
  const transportSectionRef = useRef<HTMLDivElement>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);
  const justAnsweredRef = useRef(false);
  const lastScrollTargetRef = useRef<HTMLElement | null>(null); // evita re-rolar pro mesmo alvo (ex: marcar 2ª/3ª experiência no roteiro não deve puxar de volta pro form)
  const contextOffer = useOfferConfig(); // config assada no provider — comportamento do sucesso + ofertas de parceiro
  const offer = preview?.offer ?? contextOffer; // preview: usa o RASCUNHO do admin em vez do contexto/config salva
  // i18n (Fase 3): idioma do modal (cookie/contexto) — TODOS os textos (form/sucesso/agência/transporte/
  // parceiros) vêm do OfferConfig já nos 3 idiomas (editável no admin). Preview: reflete o idioma que o
  // admin está editando (`preview.locale`), pra poder revisar a tradução visualmente antes de salvar.
  const { locale: contextLocale } = useLocale();
  const locale = preview ? (preview.locale ?? "pt") : contextLocale;
  const ui = MODAL_UI[locale];
  const isRoteiroCtx = isRoteiroLeadContext(detail);
  const isAtrativoCtx = isAtrativoLeadContext(detail);
  const isPersonalizar = isPersonalizarIntent(detail);
  /** Bucket de produto deste lead — produto único (atrativo). `isRoteiroCtx`/`isPersonalizar`
   * permanecem computados apenas para as pontas legadas que o server ainda tolera (nunca true
   * nos gatilhos vivos). */
  const leadProductKind: ProductCopyKind = "atrativo";
  const leadCopy = useMemo(
    () =>
      resolveLeadModalCopy(locale, detail, offer.productCopies ?? undefined),
    [locale, detail, offer.productCopies],
  );
  const texts = useMemo(() => {
    const base = modalTexts(locale, offer.texts);
    // waButtonLabel/duplicateNoticeTitle vivem SÓ em ProductLeadCopy (3b). Fora de um produto
    // Compras Paraguay (CTA genérico de atrativo sem `detail`), cai no default do atrativo.
    const fallback = DEFAULT_PRODUCT_COPIES.atrativo[locale];
    const shared = {
      waButtonLabel: leadCopy?.waButtonLabel || fallback.waButtonLabel,
      duplicateNoticeTitle:
        leadCopy?.duplicateNoticeTitle || fallback.duplicateNoticeTitle,
      // Modo "Link direto" só existe em atrativo (ver `AtrativoLeadCopy`) — lê a aba atrativo do 3b
      // direto, sem passar por `leadCopy`.
      successDirect:
        offer.productCopies?.atrativo?.[locale]?.successDirect ||
        fallback.successDirect,
      directButtonLabel:
        offer.productCopies?.atrativo?.[locale]?.directButtonLabel ||
        fallback.directButtonLabel,
    };
    if (!leadCopy) return { ...base, ...shared };
    // ⛔ Sem "📍 <nome do item>" colado no subtítulo: o card do assunto, logo abaixo, já mostra o
    // item com foto e nome — o marcador repetia a mesma informação duas linhas acima dela.
    return {
      ...base,
      ...shared,
      title: leadCopy.title,
      subtitle: leadCopy.subtitle,
      formHint: leadCopy.formHint,
      submitLabel: leadCopy.submitLabel,
      successTitle: leadCopy.successTitle,
      successClose: leadCopy.successClose,
      successWhatsapp: leadCopy.successWhatsapp,
    };
    // O texto deixou de depender do ITEM quando o marcador de local saiu daqui; quem depende dele é
    // o card do assunto, que lê o `detail` direto.
  }, [locale, offer.texts, offer.productCopies?.atrativo, leadCopy]);
  const transport = transportText(locale, offer.transportOffer.texts);
  // Card do topo: roteiro ou atrativo (sempre um dos dois — todo CTA real do site define um contexto).
  // Card do assunto: as três versões chegam no `detail` (`subjectI18n`) para o card acompanhar o
  // seletor de idioma DO MODAL — os campos avulsos abaixo são o snapshot do clique e ficariam presos
  // ao idioma da página.
  const subjectTraduzido = detail?.subjectI18n?.[locale];
  const subjectTitle =
    subjectTraduzido?.title ||
    detail?.subjectTitle ||
    detail?.roteiroTitulo ||
    (isAtrativoCtx ? detail?.itemSlug : null);
  const subjectImage = detail?.subjectImage ?? null;
  const subjectSubtitle = subjectTraduzido?.subtitle ?? detail?.subjectSubtitle ?? null;
  const showSubjectCard =
    Boolean(subjectTitle) && (isRoteiroCtx || isAtrativoCtx);
  const effectiveAgencyChecked = true;
  // Atrativo com Modo="direct" (seção "Ingresso por atrativo") força o link deste atrativo por cima
  // do modo de sucesso global — único jeito de "direct" acontecer (não existe mais link direto global).
  // Atrativo sem link (hasLink=false, ex.: Feirinha) tem sua PRÓPRIA escolha close/whatsapp
  // (attractionNoLinkMode) — não herda o bucket global. Fora isso (Modo="agency" com link, ou contexto
  // roteiro/personalizar), o modo de sucesso é o que o admin escolheu em "1 · Modal — tela de sucesso"
  // (close/whatsapp, nos dois buckets — roteiro e atrativo individuais).
  const attractionForcesDirect =
    isAtrativoCtx && detail?.attractionMode === "direct" && !!detail?.href;
  const baseSuccessMode: ModalSuccessMode = isAtrativoCtx
    ? offer.atrativoSuccessMode
    : offer.roteiroSuccessMode;
  const effectiveSuccessMode: ModalSuccessMode = attractionForcesDirect
    ? "direct"
    : isAtrativoCtx && detail?.attractionNoLinkMode
      ? detail.attractionNoLinkMode
      : baseSuccessMode;
  const showDirectOnSuccess = effectiveSuccessMode === "direct";
  const showWhatsappOnSuccess = effectiveSuccessMode === "whatsapp";

  // Gate sequencial do form (jul/2026): só revela o form quando TODAS as perguntas/marcações que de fato
  // ESTÃO VISÍVEIS (dinâmico — depende do admin) já foram resolvidas. Cada etapa auto-passa quando a seção
  // correspondente nem aparece (sem transporte ligado no admin, etc.) — por design: o usuário já engajado
  // com cada pergunta chega no form com investimento (gatilho mental).
  // "Já em Foz?" (alreadyInFoz) é a 1ª pergunta agora — `false` já resolve as duas (isLocal=false derivado
  // na hora, ver chooseInFoz); `true` só termina quando a 2ª pergunta ("é morador?") também for respondida.
  // ⚠️ `isLocal === true ||` é OBRIGATÓRIO aqui, não redundante: `chooseLocal(true)` reseta `alreadyInFoz`
  // de volta pra `null` (preserva o invariante de métricas), então SEM essa cláusula um morador — recém
  // respondido OU um lead conhecido reabrindo o modal — cai em `alreadyInFoz===null`, nenhuma das outras
  // duas condições bate, e o form/transporte fica escondido pra sempre (mesmo bug do "Problema A" original,
  // só que na direção oposta: agora é o morador que travaria, não o turista).
  // Calendário do dia da visita/início: ingresso de atrativo + roteiro pronto/personalizar — os três
  // contextos reais do site. Quantidade só no ingresso de atrativo (roteiro pronto/personalizar já
  // embutem "quantas pessoas" no wizard — MR-9 — não duplicar a pergunta aqui).
  const wantsDate = isAtrativoCtx || isRoteiroCtx;
  // "Tem link - NÃO" no admin (hasLink=false — lugares públicos como Compras Paraguai e By Night não
  // vendem ingresso): o CTA do card vira "Reservar data" e o transporte passa a ser assumido.
  const hasIngressoLink = isAtrativoCtx
    ? (offer.attractionOffers?.[detail?.itemSlug ?? ""]?.hasLink ?? true)
    : true;
  /**
   * ⭐ **"Para quantas pessoas?" vale para TODO produto do modal** (decisão do usuário): ingresso,
   * reserva de data e roteiro pronto/personalizar. Antes era `isAtrativoCtx && hasIngressoLink`, o que
   * deixava a agência sem o dado mais determinante do orçamento justamente em roteiro — e sumia
   * também na reserva de data, onde a pergunta ("quantos ingressos") é que estava errada, não o campo.
   * ⓘ O wizard NÃO passa por aqui: ele tem passo próprio de pessoas, em faixa.
   */
  const wantsQty = true;
  /** Atrativo SEM venda de ingresso (§17-ter): o modal fala em RESERVA DE DATA, não em ingresso —
   * "Comprar ingresso" num lugar que não vende ingresso contradiz o próprio CTA do card, que já diz
   * "Reservar data". */
  const isReservaCtx = isAtrativoCtx && !hasIngressoLink;
  /** Itens do pedido, em slugs. Fonte ÚNICA: alimenta o `itemSlugs` do POST (coluna `item_slugs`, que
   * a página /r/[token] lê) E a contagem do resumo curto da mensagem de WhatsApp. Num ingresso são o
   * atrativo de entrada + os extras marcados; num roteiro, o bundle que já veio no `detail`. */
  const pedidoItems: string[] = isAtrativoCtx
    ? [detail?.itemSlug, ...extraAttractions].filter((s): s is string => Boolean(s))
    : (detail?.contentIds ?? []);
  /** Ingressos, reservas de data ou os dois (§17-ter) — decide o vocabulário do link e do título. */
  const itensPedido = isAtrativoCtx ? itensKind(pedidoItems, offer.attractionOffers) : undefined;
  const dateChosen = !wantsDate || visitDate !== null;
  const qualificationDone =
    isLocal === true ||
    alreadyInFoz === false ||
    (alreadyInFoz === true && isLocal !== null);
  // Transporte: fonte única da visibilidade é `offer.transportOffer.enabled` (lib/offer-settings —
  // resolve sozinho o cenário COM ou SEM agência definida). NÃO gatear por produto nem por agência:
  //  • `agencyActive &&` era a cópia que impedia o checkbox de existir sem agência;
  //  • `isAtrativoCtx &&` era a que fazia o roteiro pronto NUNCA perguntar sobre transporte, mesmo com
  //    o admin marcando "Exibir = Sim" — quem chega pelo roteiro precisa se locomover igual (a
  //    logística do roteiro é a ordem do dia, não o transporte em si).
  // O toggle do admin é a ÚNICA autoridade sobre exibir ou não, em qualquer produto.
  const transportVisible = offer.transportOffer.enabled;
  // Transporte AUTOMÁTICO (sem perguntar) para atrativos "Tem link - NÃO" (lugares públicos: Compras
  // Paraguai, By Night...): quem reserva precisa de transporte — o lead sai com `true`, a pergunta não
  // é exibida e o atributo da pessoa no known-lead é PRESERVADO (o automático é regra do produto, não
  // preferência — decisão do usuário; o próximo modal segue com a resposta anterior dela).
  const transporteAutomatico = isAtrativoCtx && !hasIngressoLink;
  const transportEfetivo = transporteAutomatico
    ? true
    : transportVisible
      ? transportWanted
      : null;
  // Transporte BLOQUEIA o form até ser respondido — legítimo porque a pergunta é Sim/Não explícita.
  // (Com o checkbox antigo isto era hostil: dizer "não" custava marcar e desmarcar, já que só havia um
  // toggle. Com dois botões, "Não" é um clique como qualquer outro.) O produto quer a resposta dos dois
  // lados: num roteiro com vários atrativos, saber que a pessoa NÃO precisa de transporte vale tanto
  // quanto saber que precisa.
  const transportDone =
    transporteAutomatico || !transportVisible || transportAnswered;
  const readyForForm = dateChosen && qualificationDone && transportDone;

  // Funil do modal: dispara um PASSO no máximo 1× por abertura (dedupe por `key`). Silencioso/no-op sem DB.
  const fire = (step: ModalStep, o?: { itemSlug?: string; key?: string }) => {
    if (preview) return; // preview nunca reporta ao funil — não é uma abertura real
    const key = o?.key ?? step;
    if (firedRef.current.has(key)) return;
    firedRef.current.add(key);
    modalTrack(step, {
      modalId: modalIdRef.current,
      itemSlug: o?.itemSlug,
      ctaType: detail?.ctaType,
      pagePath: typeof window !== "undefined" ? window.location.pathname : null,
    });
  };

  // Captura silenciosa de abandono (jul/2026 — ver conventions/funil-modal.md §17):
  // se o lead já deixou QUALQUER sinal (nome, algum dígito de telefone, qualificação respondida ou transporte
  // marcado) mas fecha o modal (X/backdrop/Escape) OU sai da página (pagehide) SEM enviar o formulário,
  // salvamos isso em segundo plano via sendBeacon (mesmo padrão de lib/track.ts) — NUNCA notifica ninguém
  // (marca `abandoned=true`, ver /api/leads/draft); é só dado interno pra recuperação de contato depois.
  // Dispara no máximo 1× por abertura (`abandonBeaconFiredRef`) e nunca em preview/fora do estágio "form".
  const fireAbandonBeacon = () => {
    if (preview) return;
    if (stage !== "form") return; // já enviou de verdade, ou está enviando — não duplica
    if (abandonBeaconFiredRef.current) return;
    const hasName = nome.trim().length >= 2;
    const phoneDigits = phone.replace(/\D/g, "");
    const hasPhoneDigits = isCustom
      ? phone.trim().length > 0
      : phoneDigits.length > 0;
    const hasSignal =
      hasName ||
      hasPhoneDigits ||
      isLocal !== null ||
      Boolean(visitDate) ||
      (transportVisible && transportChecked);
    if (!hasSignal) return; // nada pra recuperar — "abriu e não fez nada" fica de fora de propósito
    abandonBeaconFiredRef.current = true;
    const fullPhone = hasPhoneDigits
      ? isCustom
        ? phone.trim()
        : `${country.prefix} ${phone}`
      : null;
    const utm = getInboundUtms();
    const payload = JSON.stringify({
      nome: nome.trim() || null,
      email: email.trim() || null,
      whatsapp: fullPhone,
      ctaType: detail?.ctaType ?? null,
      pagePath: typeof window !== "undefined" ? window.location.pathname : null,
      sessionId: getSessionId(),
      visitorId: getVisitorId(),
      utmSource: utm.source ?? null,
      utmMedium: utm.medium ?? null,
      utmCampaign: utm.campaign ?? null,
      utmContent: utm.content ?? null,
      utmTerm: utm.term ?? null,
      locale,
      isLocal,
      alreadyInFoz,
      wantsTransport: transportEfetivo,
      visitDate: wantsDate ? visitDate : null,
      ticketQty: wantsQty ? ticketQty : null,
      leadContext: isRoteiroCtx
        ? "roteiro"
        : isAtrativoCtx
          ? "atrativo"
          : "ingresso",
      roteiroSlug:
        detail?.roteiroSlug ?? (isRoteiroCtx ? detail?.itemSlug : null) ?? null,
      roteiroTitulo: detail?.roteiroTitulo ?? detail?.subjectTitle ?? null,
      itemSlug: detail?.itemSlug ?? null,
      honeypot: honeypotRef.current?.value ?? "",
    });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/leads/draft",
          new Blob([payload], { type: "application/json" }),
        );
      } else {
        void fetch("/api/leads/draft", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        });
      }
    } catch {
      // nunca quebra o fechamento do modal por causa disso
    }
  };
  // `pagehide` (fechar aba/navegar embora) precisa da versão MAIS RECENTE de `fireAbandonBeacon` (closure sobre
  // nome/email/phone atuais) sem reatachar o listener a cada tecla digitada — guarda numa ref, atualizada a
  // cada render; o listener (attachado 1×) sempre chama a versão corrente via `.current()`.
  const fireAbandonBeaconRef = useRef(fireAbandonBeacon);
  fireAbandonBeaconRef.current = fireAbandonBeacon;

  useEffect(() => {
    if (preview) return; // preview nunca dispara beacons de verdade
    const handler = () => fireAbandonBeaconRef.current();
    window.addEventListener("pagehide", handler);
    return () => window.removeEventListener("pagehide", handler);
  }, [preview]);

  useEffect(() => {
    if (preview) return; // preview não escuta o evento global — abre inline, ver efeito de init logo abaixo
    const handler = (e: Event) => {
      const d = (e as CustomEvent<OpenDetail>).detail;

      // Reenvio do MESMO produto dentro da janela de dedup (lib/known-lead.ts) + qualificação ainda
      // fresca → não faz sentido pedir tudo de novo. O modal ABRE já no aviso de "já estamos com seu
      // pedido" + CTA de conversa, reaproveitando o `modal_id` da submissão original (o clique no CTA
      // continua batendo no lead certo, ver /api/leads/success).
      // ⚠️ Antes isto REDIRECIONAVA pra `/obrigado` (com handoff `wasDuplicate` no atrativo, e sem
      // aviso nenhum no roteiro). Mudou por dois motivos: cada re-clique empurrava a pessoa de volta
      // pra página de obrigado, e cada visita àquela página gera evento — reenvios repetidos
      // inflavam o tracking com pageviews/CTAs que não eram jornada nova. Agora o aviso é o MESMO nos
      // três produtos, e acontece onde a pessoa está.
      const knownForSkip = loadKnownLeadContact();
      const qualificationStillFresh = knownForSkip
        ? knownForSkip.isLocal === true || knownForSkip.alreadyInFoz !== null
        : true;
      const recentSubmission = recentSubmissionOf(productSignature(d));
      if (recentSubmission && qualificationStillFresh) {
        setDetail(d);
        setDuplicateModalId(recentSubmission.modalId);
        // ⚠️⚠️ RESETAR O STAGE É OBRIGATÓRIO AQUI. Sem isto o aviso reabria com o stage residual do
        // envio anterior — e um stage "submitting" deixava o modal TRAVADO: o X fica `disabled` e o
        // backdrop ignora o clique justamente nesse estado, então não havia como fechar sem recarregar
        // a página. O corpo do aviso é escolhido por `duplicateModalId`, não pelo stage.
        setStage("form");
        setOpen(true);
        return; // não abre o formulário — o corpo do modal renderiza só o aviso
      }

      setDetail(d);
      setStage("form");
      setErrors({});
      setWasDuplicate(false);
      setTurnstileToken(null); // token é de uso único — sempre renovado, mesmo com rascunho preservado
      justAnsweredRef.current = false; // scroll automático: zera a cada abertura (nunca dispara sozinho ao reabrir)
      lastScrollTargetRef.current = null;
      abandonBeaconFiredRef.current = false; // captura de abandono: nova abertura pode disparar de novo
      // Item 3 — persistência: só aplica os defaults (form em branco + pré-marcações) na 1ª abertura da sessão
      // do rascunho. Reaberturas seguintes (fechou sem querer, ou só voltou pra reler algo) preservam o que o
      // lead já preencheu/marcou. Cobre também um RELOAD de página (o componente remonta do zero): o rascunho
      // é lido do `sessionStorage` (`loadDraft`) antes de aplicar os defaults em branco. Limpo de propósito
      // após um envio bem-sucedido (ver `handleSubmit`/`close()`).
      // Lido AQUI FORA (não só dentro do `if` abaixo) porque a checagem de "editar vs. resumo" logo adiante
      // também precisa saber se há uma identidade válida, mesmo numa REABERTURA (`draftInitRef.current` já
      // true, bloco de pré-preenchimento não roda de novo).
      const saved = loadDraft();
      // Lead conhecido (localStorage, sobrevive ao envio — ver lib/known-lead.ts): lido SEMPRE (mesmo havendo
      // rascunho) — pro pré-preenchimento o rascunho de SESSÃO continua vencendo (mais específico/recente).
      const knownContact = loadKnownLeadContact();
      const known = saved ? null : knownContact;
      if (!draftInitRef.current) {
        if (saved) {
          setNome(saved.nome);
          setEmail(saved.email);
          setPhone(saved.phone);
          setCountry(
            COUNTRIES.find((c) => c.prefix === saved.countryPrefix) ??
              COUNTRIES[0],
          );
          setIsCustom(saved.isCustom);
          setIsLocal(saved.isLocal);
          setAlreadyInFoz(saved.alreadyInFoz);
          // Restaura a resposta EXATA (incl. a recusa) — não presumir "já respondeu" só por existir
          // rascunho: o rascunho nasce com o primeiro caractere do nome, muito antes do transporte.
          setTransportWanted(saved.transportWanted);
          setIncludeOtherAttractions(saved.includeOtherAttractions);
          setExtraAttractions(saved.extraAttractions);
          setVisitDate(saved.visitDate);
          setTicketQty(saved.ticketQty);
        } else if (known) {
          // Lead já converteu ANTES (mesmo sem rascunho de sessão vivo, ex: outra aba/dia/produto) — reaproveita
          // contato E qualificação (isLocal é atributo estável da pessoa; alreadyInFoz é mais sensível ao
          // tempo, mas poupa a pergunta na maioria dos casos reais). O lead sempre pode reabrir e mudar a
          // resposta se algo mudou (não é travado, só vem pré-marcado).
          setNome(known.nome);
          setEmail(known.email);
          setPhone(known.phone);
          setCountry(
            COUNTRIES.find((c) => c.prefix === known.countryPrefix) ??
              COUNTRIES[0],
          );
          setIsCustom(known.isCustom);
          setIsLocal(known.isLocal);
          setAlreadyInFoz(known.alreadyInFoz);
          // Transporte é atributo ESTÁVEL da pessoa (ver lib/known-lead.ts `wantsTransport`): quem
          // respondeu num produto não responde de novo no seguinte — vale tanto pro "Sim" quanto pro
          // "Não". É isto que consolida a resposta ENTRE PRODUTOS.
          setTransportWanted(known.wantsTransport);
          setIncludeOtherAttractions(false);
          setExtraAttractions([]);
          // Dia VEM do known-lead: é preferência da PESSOA na jornada (quem já disse quando vai a Foz
          // não redigita isso a cada produto que abre). O `loadKnownLeadContact` já devolve `null` se a
          // data tiver vencido, então nunca restaura um dia que o calendário não deixaria reescolher.
          // Quantidade continua sempre em branco — é do pedido, não da pessoa.
          setVisitDate(known.visitDate);
          setTicketQty(1);
        } else {
          setNome("");
          setEmail("");
          setPhone("");
          setCountry(COUNTRIES[0]);
          setIsCustom(false);
          setIsLocal(null);
          setAlreadyInFoz(null);
          setTransportWanted(null); // ainda não perguntamos
          setIncludeOtherAttractions(false);
          setExtraAttractions([]);
          setVisitDate(null);
          setTicketQty(1);
        }
        draftInitRef.current = true;
        // Pré-preenche a partir da sessão visitante (magic link) — não bloqueia o open.
        void fetch("/api/visitor/me", { credentials: "include" })
          .then((r) => r.json())
          .then(
            (data: {
              authenticated?: boolean;
              email?: string;
              name?: string | null;
            }) => {
              if (!data?.authenticated || !data.email) {
                setVisitorPrefill(null);
                return;
              }
              setVisitorPrefill({ email: data.email, name: data.name ?? null });
              // Só preenche campos ainda vazios (respeita rascunho/lead conhecido já aplicado acima).
              setEmail((prev) => prev || data.email || "");
              if (data.name) setNome((prev) => prev || data.name || "");
            },
          )
          .catch(() => setVisitorPrefill(null));
      }

      // Modo "resumo" (card consolidado) vs. edição — recalculado em TODA abertura (não só a 1ª), usando
      // `saved`/`known` (lidos direto do storage acima, sempre frescos) em vez do estado React (que teria
      // valor desatualizado se acabamos de chamar `setNome`/`setPhone` nesta MESMA chamada, por causa do
      // batching).
      const identity = saved ?? known;
      const identityValid = identity
        ? identity.isLocal !== null && // "sou morador?" ainda não respondida → precisa do form completo, não dá pra resumir
          identity.nome.trim().length >= 2 &&
          (identity.isCustom
            ? identity.phone.trim().length >= 8
            : identity.phone.replace(/\D/g, "").length >=
              (
                COUNTRIES.find((c) => c.prefix === identity.countryPrefix) ??
                COUNTRIES[0]
              ).digits)
        : false;
      setEditingContact(!identityValid);

      setOpen(true);
      // INÍCIO do fluxo de conversão (D6): abrir o modal É o checkout começando — daqui o único
      // caminho adiante é o formulário que vira `Lead`. Antes disto o `InitiateCheckout` disparava
      // nas SAÍDAS, ou seja, DEPOIS do `Lead`: funil invertido, taxa de conversão sem sentido.
      // 🚫 Substitui o antigo `ViewModalVIP` (D10) — não recriar, nem com outro nome.
      // Retargeting barato continua existindo: quem abriu e não converteu = IC sem Lead.
      trackConversion(CONVERSIONS.initiateCheckout, {
        cta_type: d.ctaType,
        // O modal do RF é sempre funil de `atrativos` — ingresso, atrativo e roteiro são todos
        // produto próprio (matriz §1.1). Não há caminho de hotel aqui, ao contrário do RG.
        ...taxonomyParams({
          vertical: VERTICALS.atrativos,
          item_slug: d.itemSlug,
          partner_slug: offer.transportOffer.agencySlug,
          // Mesmo bundle do `Lead` que virá a seguir — sem isto, o funil IC→Lead não pode ser
          // filtrado pela mesma regra de painel.
          content_ids: d.contentIds,
        }),
      });

      // Funil 1st-party: nova abertura → novo modal_id + reset do dedupe.
      modalIdRef.current = newModalId();
      firedRef.current = new Set();
      const pagePath =
        typeof window !== "undefined" ? window.location.pathname : null;
      modalTrack("open", {
        modalId: modalIdRef.current,
        ctaType: d.ctaType,
        itemSlug: d.itemSlug,
        pagePath,
      });
    };
    window.addEventListener("ticket-offer:open", handler);
    return () => window.removeEventListener("ticket-offer:open", handler);
  }, [offer, preview]);

  // Preview: as tabs "Formulário"/"Sucesso" do admin controlam o estágio de fora — sincroniza sempre que mudar.
  useEffect(() => {
    if (preview?.stage) setStage(preview.stage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview?.stage]);

  // Item 3 — persiste o rascunho no sessionStorage a cada mudança (cobre reload de página, não só fechar/reabrir).
  // Guardado por `draftInitRef`: sem isso, o estado em branco do 1º render (antes de qualquer abertura real)
  // sobrescreveria um rascunho salvo antes mesmo do usuário reabrir o modal.
  useEffect(() => {
    if (preview) return; // preview nunca persiste (não é o rascunho real do lead)
    if (!draftInitRef.current) return;
    saveDraft({
      nome,
      email,
      phone,
      countryPrefix: country.prefix,
      isCustom,
      isLocal,
      alreadyInFoz,
      transportWanted,
      includeOtherAttractions,
      extraAttractions,
      visitDate,
      ticketQty,
    });
  }, [
    nome,
    email,
    phone,
    country,
    isCustom,
    isLocal,
    alreadyInFoz,
    transportWanted,
    includeOtherAttractions,
    extraAttractions,
    visitDate,
    ticketQty,
    preview,
  ]);

  // O corpo rolável fica montado o tempo todo — o navegador preserva o scrollTop por padrão quando o conteúdo
  // interno troca. Só reseta ao entrar/sair da tela de SUCESSO (view genuinamente diferente); "submitting" NÃO
  // conta — ele ainda renderiza o MESMO formulário (o ternário abaixo só troca em stage==="success"), então
  // resetar em `[stage]` bruto fazia a tela pular pro topo no meio do envio, antes mesmo de mudar de tela.
  const isSuccessStage = stage === "success";
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [isSuccessStage]);

  // Scroll automático pro PRÓXIMO item liberado pelo gate sequencial (UX — item pedido pelo usuário), disparado
  // só por um clique real (`justAnsweredRef`, setado nos handlers `choose*`/`toggle*`; nunca pela restauração de
  // rascunho, que muda o mesmo estado sem passar por eles). Mesma ordem de prioridade do `readyForForm`: rola pra
  // a 1ª seção ainda visível-e-não-resolvida; se já resolveu tudo, rola pro form. `lastScrollTargetRef` evita
  // repetir o scroll pro MESMO alvo (ex: marcar a 2ª/3ª experiência do roteiro não deve puxar de volta pro form).
  useEffect(() => {
    if (!justAnsweredRef.current) return;
    justAnsweredRef.current = false;
    let target: HTMLElement | null = null;
    if (wantsDate && !visitDate) target = calendarSectionRef.current;
    // Qualificação ainda não começou → rola pra 1ª pergunta ("já está em Foz?"). Sem este ramo, escolher
    // o dia no calendário não rolava pra lugar nenhum: a cadeia caía direto no ramo do transporte, cuja
    // seção só renderiza DEPOIS da qualificação — logo o ref era `null` e o scroll era silenciosamente
    // descartado. (O mesmo ref serve pro card de resumo e pro bloco de edição: são mutuamente exclusivos.)
    else if (alreadyInFoz === null && isLocal === null)
      target = qInFozSectionRef.current;
    else if (alreadyInFoz === true && isLocal === null)
      target = qLocalSectionRef.current;
    else if (transportVisible && !transportAnswered && !transporteAutomatico)
      target = transportSectionRef.current;
    else if (readyForForm) target = formSectionRef.current;
    if (target && target !== lastScrollTargetRef.current) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      lastScrollTargetRef.current = target;
    }
  }, [
    wantsDate,
    visitDate,
    isLocal,
    alreadyInFoz,
    transportVisible,
    transportAnswered,
    readyForForm,
  ]);

  useEffect(() => {
    if (preview) return; // não rouba o foco da tela de edição do admin
    if (open && stage === "form") {
      const t = setTimeout(() => nomeRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [open, stage, preview]);

  const close = () => {
    if (preview) {
      // Preview nunca "fecha" de verdade (é sempre visível no editor) — só volta pro formulário.
      setStage("form");
      preview.onStageChange?.("form"); // mantém a tab do admin sincronizada
      return;
    }
    // No aviso de reenvio não há formulário em jogo — nada a salvar como abandono.
    if (!duplicateModalId) fireAbandonBeacon(); // fechou sem enviar + já deixou algum sinal → salva silenciosamente
    setOpen(false);
    setDuplicateModalId(null);
    // Já convertido — a próxima abertura começa limpa (não faz sentido reaproveitar os dados de um lead já enviado).
    // Rede de segurança: o rascunho já é limpo em handleSubmit ao chegar no sucesso; repetir aqui não tem custo.
    if (stage === "success") {
      draftInitRef.current = false;
      clearDraft();
    }
  };

  const handleCountryChange = (value: string) => {
    setPhone("");
    if (value === "outro") {
      setIsCustom(true);
    } else {
      setIsCustom(false);
      setCountry(COUNTRIES.find((c) => c.prefix === value) ?? COUNTRIES[0]);
    }
    if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
  };

  const handlePhoneChange = (raw: string) => {
    if (isCustom) {
      setPhone(raw.slice(0, 25));
    } else {
      setPhone(applyPhoneMask(raw, country.mask, country.digits));
    }
    if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
  };

  // Ordem invertida (jul/2026, pedido do usuário — menos fricção pro turista): pergunta 1 = "já está em
  // Foz?". "Não" já BASTA pra saber que não é morador (ninguém que ainda não chegou é morador daqui) —
  // deriva `isLocal=false` na hora e pula a 2ª pergunta. "Sim" é ambíguo (pode ser morador OU turista já
  // chegado) — só aí revela "é morador de Foz?".
  const chooseVisitDate = (iso: string) => {
    setVisitDate(iso);
    if (errors.date) setErrors((p) => ({ ...p, date: undefined }));
    justAnsweredRef.current = true;
  };
  const chooseInFoz = (v: boolean) => {
    setAlreadyInFoz(v);
    setIsLocal(v ? null : false); // "não" já resolve isLocal sozinho; "sim" ainda precisa da 2ª pergunta
    if (errors.inFoz) setErrors((p) => ({ ...p, inFoz: undefined }));
    fire(v ? "q_infoz_yes" : "q_infoz_no");
    justAnsweredRef.current = true;
  };
  // Variante p/ a revalidação de TTL dentro do card resumido (`identitySummary`) — ali `isLocal` já é
  // conhecido/estável (a pessoa já é identificada como morador ou turista), então NÃO deriva/reseta
  // `isLocal` como `chooseInFoz` faz na 1ª pergunta (senão apagaria um `isLocal` já sabido).
  const chooseInFozRevalidate = (v: boolean) => {
    setAlreadyInFoz(v);
    if (errors.inFoz) setErrors((p) => ({ ...p, inFoz: undefined }));
    fire(v ? "q_infoz_yes" : "q_infoz_no");
    justAnsweredRef.current = true;
  };
  const chooseLocal = (v: boolean) => {
    setIsLocal(v);
    // Morador → `alreadyInFoz` some (não é métrica relevante pra quem mora aqui, ver lib/metrics.ts e
    // buildPreferencesSummary — o invariante "null quando morador" preexiste à inversão de ordem).
    // Turista (v===false) → `alreadyInFoz` continua `true` (já setado na 1ª pergunta pra chegar até aqui).
    if (v) setAlreadyInFoz(null);
    if (errors.local) setErrors((p) => ({ ...p, local: undefined }));
    fire(v ? "q_local_yes" : "q_local_no");
    justAnsweredRef.current = true;
  };
  /** Resposta explícita de transporte (Sim/Não), no mesmo padrão das perguntas de qualificação.
   * ⚠️ O passo de funil `transport_check` dispara SÓ no "Sim": ele significa "marcou incluir
   * transporte" desde sempre, e contar o "Não" nele mudaria o sentido da métrica em silêncio. */
  const chooseTransport = (v: boolean) => {
    if (v && !transportChecked) fire("transport_check");
    setTransportWanted(v);
    justAnsweredRef.current = true;
  };

  // "Incluir ingresso de outros atrativos?" — lista todos os atrativos (menos o que o lead já está
  // comprando), ordenada por nome. Desligar o toggle limpa a seleção (o "cancelar" reusa o mesmo handler).
  const attractionPickerList = useMemo(
    () =>
      Object.values(offer.attractionOffers ?? {})
        .filter((a) => a.slug !== detail?.itemSlug)
        .sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
    [offer.attractionOffers, detail?.itemSlug],
  );
  const toggleIncludeOtherAttractions = () => {
    setIncludeOtherAttractions((v) => {
      const next = !v;
      if (!next) setExtraAttractions([]);
      return next;
    });
  };
  const toggleExtraAttraction = (slug: string) => {
    setExtraAttractions((p) =>
      p.includes(slug) ? p.filter((s) => s !== slug) : [...p, slug],
    );
  };

  const validate = (): boolean => {
    const errs: typeof errors = {};
    if (wantsDate && !visitDate) errs.date = ui.errDate;
    if (nome.trim().length < 2) errs.nome = ui.errName;
    if (email.trim() && !isValidEmail(email.trim())) errs.email = ui.errEmail;
    if (isCustom) {
      if (phone.trim().length < 8) errs.phone = ui.errPhoneShort;
    } else {
      if (phone.replace(/\D/g, "").length < country.digits)
        errs.phone = ui.errPhoneIncomplete;
    }
    // Qualificação: "já em Foz?" é sempre a 1ª pergunta; "é morador?" só quando ainda ambíguo (respondeu "sim").
    // Morador (isLocal===true) sempre conta como já qualificado — `alreadyInFoz` fica `null` de propósito
    // pra ele (ver chooseLocal), então NÃO pode cair no `errs.inFoz` abaixo (mesmo motivo do `qualificationDone`).
    if (isLocal !== true) {
      if (alreadyInFoz === null) errs.inFoz = ui.errSelect;
      else if (alreadyInFoz === true && isLocal === null)
        errs.local = ui.errSelect;
    }
    // Anti-bot (Turnstile): só exige o token quando o widget está ligado (nunca em preview).
    if (!preview && TURNSTILE_ENABLED && !turnstileToken)
      errs.turnstile = ui.errTurnstile;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Modal com "botão iniciar conversa": link do WhatsApp da agência (só dígitos, mantém DDI).
  // Item C: anexa um resumo das preferências do lead (já em Foz/transporte/roteiro) — o vendedor já chega
  // sabendo, sem precisar perguntar de novo.
  const centralWaUrl = (): string | null => {
    const digits = (offer.modalWhatsapp ?? "").replace(/\D/g, "");
    if (!digits) return null;
    // Texto POR PRODUTO ("3b · Textos por produto" → `waLeadText`): o que o VISITANTE manda. Sem copy de
    // produto resolvida (contexto legado "ingresso"), cai no bucket do ingresso avulso.
    const base =
      leadCopy?.waLeadText ||
      DEFAULT_PRODUCT_COPIES.atrativo[locale].waLeadText;
    // Intro → resumo de UMA linha → link do pedido. O detalhe (lista de itens, respostas do wizard)
    // vive em /r/[token]; mandar tudo na mensagem faz o texto crescer com o tamanho do roteiro.
    // ⚠️ Sem token (reabertura de lead duplicado, que é anterior a este envio) a mensagem sai só com
    // intro + resumo — `buildWaMessage` omite a linha do link em vez de montar um endereço quebrado.
    const msg = buildWaMessage(
      base,
      resumoCurto(
        {
          kind: leadProductKind,
          itemCount: pedidoItems.length,
          visitDate: wantsDate ? visitDate : null,
          pessoas: wantsQty ? ticketQty : null,
          wantsTransport: transportEfetivo === true,
        },
        locale,
        "lead",
      ),
      pedidoToken,
      leadProductKind,
      locale,
      "lead",
      { itens: itensPedido },
    );
    return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
  };

  /** Marca o CTA final na linha do lead ORIGINAL (a mesma marcação que a página de obrigado fazia no
   * caso de reenvio) — sem isto, mover o aviso pro modal apagaria esse sinal do funil. */
  const markDuplicateCta = (opts: { shown?: true; clicked?: true }) => {
    if (!duplicateModalId) return;
    void fetch("/api/leads/success", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        modalId: duplicateModalId,
        ctaType: "modal_central_whatsapp",
        ...opts,
      }),
      keepalive: true,
    }).catch(() => {});
  };
  /** Taxonomia do CTA do caminho de lead duplicado — mesmo produto, mesmo vertical do fluxo normal. */
  const duplicateTax = () =>
    taxonomyParams({
      vertical: VERTICALS.atrativos,
      item_slug: detail?.itemSlug,
      partner_slug: offer.transportOffer.agencySlug,
    });
  // "Exibido" dispara 1× por aviso aberto, e só quando existe CTA de verdade pra mostrar.
  const duplicateShownRef = useRef<string | null>(null);
  useEffect(() => {
    if (!duplicateModalId || !open || !centralWaUrl()) return;
    if (duplicateShownRef.current === duplicateModalId) return;
    duplicateShownRef.current = duplicateModalId;
    markDuplicateCta({ shown: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duplicateModalId, open]);

  const handleCentralClick = (e: React.MouseEvent) => {
    if (preview) {
      e.preventDefault();
      close();
      return;
    } // visualização: nunca navega de verdade
    // Alta intenção: o lead vai falar com a agência agora → otimiza p/ conversão.
    fire("success_cta");
    const tax = taxonomyParams({
      vertical: VERTICALS.atrativos,
      item_slug: detail?.itemSlug,
      partner_slug: offer.transportOffer.agencySlug,
    });
    trackConversion(CONVERSIONS.ctaClick, { cta_type: "modal_central_whatsapp", ...tax });
    // SAÍDA do fluxo — acontece DEPOIS do `Lead`, então é `Contact`, nunca `InitiateCheckout` (D6).
    // `cta_type` fica só no `CTAClick`: ele é telemetria de UI, e o `Contact` é degrau de funil.
    trackConversion(CONVERSIONS.contact, tax);
    close();
  };

  // Sucesso self-serve: a agência não atende este lead → link direto p/ comprar online (destino = official_url via detail.href).
  const handleDirectSuccess = (e: React.MouseEvent) => {
    if (preview) {
      e.preventDefault();
      close();
      return;
    } // visualização: nunca navega de verdade
    fire("success_cta");
    if (detail) {
      track({
        type: "cta_click",
        ctaType: detail.ctaType,
        itemSlug: detail.itemSlug,
        destination: detail.href,
      });
      const tax = taxonomyParams({
        vertical: VERTICALS.atrativos,
        item_slug: detail.itemSlug,
        partner_slug: offer.transportOffer.agencySlug,
      });
      trackConversion(CONVERSIONS.ctaClick, {
        cta_type: "modal_success_direct",
        destination: detail.href,
        ...tax,
      });
      // SAÍDA do fluxo — depois do `Lead` (D6).
      trackConversion(CONVERSIONS.contact, tax);
    }
    close();
  };

  // Funil: registra "chegou no sucesso" e, quando há botão de CTA na tela de sucesso, "cta exibido" (1× por abertura).
  // Dedup (`wasDuplicate`) tem prioridade: mostra o CTA de WhatsApp central como fallback mesmo fora do modo "whatsapp".
  const successHasCta = wasDuplicate
    ? !!centralWaUrl()
    : showDirectOnSuccess
      ? !!detail?.href
      : showWhatsappOnSuccess && !!centralWaUrl();
  useEffect(() => {
    if (open && stage === "success") {
      fire("success");
      if (successHasCta) fire("success_cta_shown");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, stage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (preview) {
      setStage("success");
      preview.onStageChange?.("success");
      return;
    } // visualização: pula validação/rede/analytics
    if (!validate()) return;
    // Funil: garante os passos dos campos + o submit (rede de segurança caso o blur não tenha disparado, ex.: autofill).
    fire("field_name");
    if (email.trim()) fire("field_email");
    fire("field_phone");
    fire("submit");
    setStage("submitting");
    const fullPhone = isCustom ? phone.trim() : `${country.prefix} ${phone}`;
    const eventId = newEventId();
    const utm = getInboundUtms();

    // Ativo principal (alimenta o Lookalike). Mesmo eventId vai ao CAPI no /api/leads → dedupe.
    // 🚫 `content_name` REMOVIDO (D9 + matriz §4) e não deve voltar: no `Lead` ele não discrimina
    // nada que `item_slug` já não diga, e amarrava o vocabulário de um satélite dentro de um pixel
    // que atende vários. Quem identifica o produto é `item_slug` (e `content_ids`, no bundle);
    // quem identifica o site é `property`, injetado no funil (lib/analytics + lib/meta-capi).
    // Contexto do produto: calculado UMA vez e usado nos dois lugares — no evento do Pixel (via
    // `resolveLeadKind`) e no corpo do POST. É o mesmo valor que o servidor vai ler para derivar o
    // `lead_kind` do CAPI, então as duas pontas não têm como discordar (G1).
    const leadContextValue = isRoteiroCtx ? "roteiro" : isAtrativoCtx ? "atrativo" : "ingresso";

    // ⚠️ G1: o CAPI precisa mandar EXATAMENTE os mesmos params neste mesmo `event_id` — o espelho
    // fica em `app/api/leads/route.ts` → `lib/meta-capi.ts`, alimentado pelos MESMOS sinais e pela
    // MESMA função (`buildLeadEventParams`). `atrativos` é o único vertical com peso de `value`
    // aprovado (G4), e é o vertical de todo produto do RF.
    // ⓘ `item_slug` sai de `buildLeadEventParams`, NÃO de `taxonomyParams` — senão o param sairia
    // duas vezes no mesmo payload.
    trackConversion(
      CONVERSIONS.lead,
      {
        ...buildLeadEventParams({
          leadKind: resolveLeadKind(leadContextValue),
          itemSlug: detail?.itemSlug,
          isLocal,
          alreadyInFoz,
          // ⚠️ EXATAMENTE o mesmo valor que o corpo do POST manda (`wantsTransport: transportEfetivo`,
          // logo abaixo) — não uma expressão equivalente "na leitura". `transportEfetivo` cobre o caso
          // do transporte AUTOMÁTICO (atrativo sem link de ingresso), em que ninguém marcou nada e o
          // transporte é assumido; usar `transportVisible && transportChecked` aqui daria `false` e o
          // bônus de transfer (+4 pontos, o maior da tabela) sumiria só do lado do Pixel.
          wantsTransport: transportEfetivo === true,
          locale,
          ticketQty: wantsQty ? ticketQty : null,
        }),
        ...taxonomyParams({
          vertical: VERTICALS.atrativos,
          partner_slug: offer.transportOffer.agencySlug,
          // O bundle: `item_slug` é o produto de ENTRADA (o roteiro), `content_ids` é tudo que ele
          // inclui. Os dois convivem no mesmo evento (D7). Vazio/ausente → omitido (D8).
          content_ids: detail?.contentIds,
        }),
      },
      { eventID: eventId },
    );

    // ⚠️ `transportEfetivo`, NUNCA `transportChecked`. `transportChecked` é o estado CRU, e ele volta
    // `true` do known-lead (um "sim" dado em outro modal, outro dia) mesmo quando o cross-sell está
    // DESLIGADO no admin e a pergunta não apareceu aqui. Gatilho por ele fazia este evento afirmar
    // que a pessoa pediu transporte numa tela que nunca ofereceu — inflando o vertical `transporte`
    // do pixel de portfólio com clique que não existiu, e contradizendo o `transfer` do `Lead` do
    // MESMO submit (que já lia `transportEfetivo`). É a mesma regra do G1: o mesmo sinal, uma
    // definição só.
    if (transportEfetivo === true)
      // 🚫 Aqui havia `content_name: "Foz_Falls_transporte"` — o nome da agência dentro do param
      // errado. Quem entrega é `partner_slug` (matriz §1.4); `content_name` não é canal de
      // atribuição e ainda amarrava UMA agência (que rotaciona) numa string fixa.
      trackConversion(CONVERSIONS.ctaClick, {
        cta_type: "modal_transport_offer",
        transfer: true,
        ...taxonomyParams({
          vertical: VERTICALS.transporte,
          niche: NICHE_KEYS.transfer,
          item_slug: detail?.itemSlug,
          partner_slug: offer.transportOffer.agencySlug,
        }),
      });

    let wasDup = false;
    let token: string | null = null;
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim() || null,
          whatsapp: fullPhone,
          ctaType: detail?.ctaType ?? null,
          eventId,
          pagePath:
            typeof window !== "undefined" ? window.location.pathname : null,
          sessionId: getSessionId(),
          visitorId: getVisitorId(),
          lgpdConsent: true,
          utmSource: utm.source ?? null,
          utmMedium: utm.medium ?? null,
          utmCampaign: utm.campaign ?? null,
          utmContent: utm.content ?? null,
          utmTerm: utm.term ?? null,
          // Qualificação → roteamento no servidor (agência).
          isLocal,
          alreadyInFoz,
          agencyOfferChecked: effectiveAgencyChecked,
          wantsTransport: transportEfetivo,
          visitDate: wantsDate ? visitDate : null,
          ticketQty: wantsQty ? ticketQty : null,
          locale, // idioma escolhido → cofre + Telegram (a agência abre a conversa no idioma certo)
          turnstileToken,
          honeypot: honeypotRef.current?.value ?? "",
          modalId: modalIdRef.current, // cruza o lead com o funil (modal_events) — ex: clique no CTA final do sucesso
          // Slug do atrativo pedido (distingue o produto no dedup/known-lead server-side — ver product_signature
          // em app/api/leads/route.ts e lib/known-lead.ts). Só relevante em contexto atrativo.
          itemSlug: detail?.itemSlug ?? null,
          // Contexto Compras Paraguay — tag Telegram + telemetria. MESMA const que alimentou o
          // `lead_kind` do Pixel logo acima (G1).
          leadContext: leadContextValue,
          // Só para o CAPI espelhar o `content_ids` que o Pixel acabou de mandar (G1). Não é
          // coluna de `leads` nem entra em regra de negócio nenhuma.
          contentIds: detail?.contentIds ?? null,
          // Itens do pedido → coluna `item_slugs`, que alimenta a página pública /r/[token].
          itemSlugs: pedidoItems,
          roteiroSlug:
            detail?.roteiroSlug ??
            (isRoteiroCtx ? detail?.itemSlug : null) ??
            null,
          roteiroTitulo: detail?.roteiroTitulo ?? detail?.subjectTitle ?? null,
          roteiroResumo: (() => {
            // PEDIDO DE INGRESSO: o resumo é a LISTA do que a pessoa quer — o atrativo de entrada mais
            // os extras marcados no modal, separados por vírgula. O card renderiza isso como uma linha
            // só ("🎫 Ingressos para: A, B, C"), sem bloco de detalhes: num ingresso não há dia a dia
            // nem curadoria a descrever. Nomes saem de `offer.attractionOffers` (assado no servidor,
            // completo pro catálogo) — o modal não importa `app/data/attractions.ts`.
            if (isAtrativoCtx) {
              // ⚠️ Separado por `hasLink` (§17-ter): atrativo SEM link não vende ingresso — é lugar
              // público, o CTA dele é "Reservar data". Dizer "Ingressos para: Compras Paraguai" seria
              // falso e mandaria a agência cotar algo que não existe. Quem sabe disso é o MODAL (tem a
              // config assada); o webhook, que reconstrói o card no claim/confirm, só tem este texto —
              // por isso o rótulo é decidido aqui e viaja pronto na coluna, em vez de o card tentar
              // redescobrir depois.
              const comIngresso: string[] = [];
              const soReserva: string[] = [];
              const add = (nome: string | null | undefined, temLink: boolean) => {
                if (nome) (temLink ? comIngresso : soReserva).push(nome);
              };
              add(detail?.subjectTitle, hasIngressoLink);
              for (const slug of extraAttractions) {
                const extra = offer.attractionOffers?.[slug];
                add(extra?.name, extra?.hasLink !== false);
              }
              const linhas: string[] = [];
              if (comIngresso.length)
                linhas.push(`🎫 Ingressos para: ${comIngresso.join(", ")}`);
              if (soReserva.length)
                linhas.push(`📅 Reserva de data para: ${soReserva.join(", ")}`);
              return linhas.length ? linhas.join("\n") : null;
            }
            const parts: string[] = [];
            if (isPersonalizar) {
              parts.push(
                "Origem: criador de roteiro personalizado (dias + atrativos livres)",
              );
            }
            if (detail?.roteiroResumo) parts.push(detail.roteiroResumo);
            return parts.length ? parts.join("\n") : null;
          })(),
        }),
      });
      // `duplicate: true` = mesmo WhatsApp reenviou o form recente (dedup) → a agência NÃO foi renotificada;
      // a tela de sucesso (em /o-que-fazer) mostra um aviso + CTA de WhatsApp central como fallback.
      const data = await res.json().catch(() => null);
      wasDup = data?.duplicate === true;
      // Token do pedido → link curto na mensagem de WhatsApp e na página de obrigado.
      if (typeof data?.pedidoToken === "string") {
        token = data.pedidoToken;
        setPedidoToken(token);
      }
    } catch {
      // sem resposta → não assume duplicidade
    }
    // Envio concluído — limpa o rascunho persistido AGORA (não só no fechar): evita que um reload restaure
    // os dados já enviados numa reabertura e cause um envio duplicado.
    clearDraft();
    // ⚠️ Reabilita a restauração na PRÓXIMA abertura. Sem isto o comportamento ficava não-determinístico:
    // o modal vive no layout e sobrevive à navegação client-side, então, se a página não remontasse, a
    // guarda continuava `true`, o bloco de restauração era pulado e o estado do produto ANTERIOR seguia
    // em memória (o rascunho de sessão já tinha sido apagado logo acima). Com remontagem, o mesmo fluxo
    // abria em branco. Era exatamente isso que fazia a data "às vezes persistir, às vezes não" — agora
    // a próxima abertura sempre re-deriva do known-lead, que é a fonte estável.
    draftInitRef.current = false;
    // Lead conhecido (localStorage, sobrevive ao envio — ver lib/known-lead.ts): grava contato+qualificação
    // e a assinatura do produto pedido AGORA, pra pré-preencher/pular fricção numa próxima abertura (mesmo ou
    // outro produto, outra aba, outro dia — dentro do TTL de 90 dias).
    rememberKnownLead(
      {
        nome: nome.trim(),
        email: email.trim(),
        phone,
        countryPrefix: country.prefix,
        isCustom,
        isLocal,
        alreadyInFoz,
        wantsTransport: transporteAutomatico
          ? (loadKnownLeadContact()?.wantsTransport ?? null)
          : transportEfetivo,
        // Só grava o dia quando ele fez parte DESTE pedido; senão preserva o que já se sabia (um
        // produto sem calendário não pode apagar a data que a pessoa deu noutro).
        visitDate: wantsDate
          ? visitDate
          : (loadKnownLeadContact()?.visitDate ?? null),
      },
      productSignature(detail),
      modalIdRef.current,
    );
    // ⚠️ ANTES do `setOpen(false)`: é o fechamento do modal que expunha a página de baixo crua
    // até o `router.push` lá embaixo completar. A cobertura entra primeiro e atravessa os dois.
    window.dispatchEvent(new CustomEvent(ENVIO_EVENT));
    setOpen(false);
    // Roteiro e atrativo/ingresso caem na MESMA página de obrigado (ver LeadSuccessScreen):
    // roteiro → /obrigado?tipo=pronto|personalizado (o PARÂMETRO escolhe a copy);
    // ingresso/atrativo → /obrigado?lead_enviado=1 (o handoff traz o `detail` que escolhe a copy).
    // ⚠️⚠️ O handoff é gravado nos DOIS fluxos, sempre. O caminho do roteiro já retornou aqui antes de
    // gravá-lo, e o resultado era o pedido errado na tela: o storage guardava o handoff do envio
    // ANTERIOR (um ingresso, por exemplo), e a página de roteiro exibia aquele link. Quem separa os
    // dois é o campo `fluxo`, conferido do outro lado — não a ausência do handoff.
    try {
      const handoff: LeadSuccessHandoff = {
        detail,
        isLocal,
        alreadyInFoz,
        modalId: modalIdRef.current,
        wasDuplicate: wasDup,
        pedidoToken: token,
        fluxo: isRoteiroCtx ? (isPersonalizar ? "roteiro-personalizado" : "roteiro-pronto") : "atrativo",
        itens: itensPedido,
        resumo: resumoCurto(
          {
            kind: leadProductKind,
            itemCount: pedidoItems.length,
            visitDate: wantsDate ? visitDate : null,
            pessoas: wantsQty ? ticketQty : null,
            wantsTransport: transportEfetivo === true,
          },
          locale,
          "lead",
        ),
      };
      window.sessionStorage.setItem(LEAD_HANDOFF_KEY, JSON.stringify(handoff));
    } catch {
      // noop — sem sessionStorage a página de destino mostra o fallback genérico
    }
    router.push(
      isRoteiroCtx
        ? `${OBRIGADO_PATH}?tipo=${isPersonalizar ? "personalizado" : "pronto"}`
        : `${OBRIGADO_PATH}?lead_enviado=1`,
    );
  };

  if (!open) return null;

  /* ── FLOATING LABEL ───────────────────────────────────────────────────────────────────────
     O rótulo nasce DENTRO do campo e sobe para cima da borda ao FOCAR ou quando há CONTEÚDO.
     Os dois gatilhos são obrigatórios: só com foco, o rótulo desceria de volta por cima do que
     a pessoa acabou de digitar assim que ela saísse do campo.

     ⚠️ EXIGE `placeholder=" "` (um espaço) no input. `:placeholder-shown` só é verdadeiro se
     existir placeholder; sem ele o seletor nunca casa e o rótulo fica travado embaixo. O espaço
     não aparece na tela porque o rótulo o cobre.

     ⓘ Variante "outlined": o rótulo flutuado fica SOBRE a borda (`top-0` + `-translate-y-1/2`),
     com `bg-white px-1` recortando a linha. Isso mantém a ALTURA do campo igual à de antes —
     a variante que empurra o rótulo para dentro do topo exigiria `pt-5` e mudaria a altura de
     todos os campos do modal.

     ⓘ GANHO DE ACESSIBILIDADE, não só estético: antes o rótulo existia só como `placeholder`,
     que some ao digitar e não é nome acessível confiável. Agora é `<label htmlFor>` de verdade. */
  const inputBase =
    "peer w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-[hsl(38,90%,55%)] disabled:opacity-60";
  /** Classes do rótulo que acompanha `inputBase` via `peer`. */
  const rotuloFlutuante =
    "pointer-events-none absolute left-3 top-1/2 z-[1] -translate-y-1/2 bg-white px-1 text-sm text-[hsl(210,25%,45%)] transition-all duration-150 " +
    "peer-focus:top-0 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:text-[hsl(210,56%,23%)] " +
    "peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-semibold";
  const inputOk = {
    borderColor: "hsl(210,20%,82%)",
    background: "white",
    color: "hsl(210,60%,15%)",
  };
  const inputErr = {
    borderColor: "hsl(0,72%,51%)",
    background: "white",
    color: "hsl(210,60%,15%)",
  };
  const phoneBorder = errors.phone ? "hsl(0,72%,51%)" : "hsl(210,20%,82%)";

  // Card único consolidado (lead conhecido/rascunho válido, ver lib/known-lead.ts) — substitui os campos
  // nome/e-mail/telefone quando já existe uma identidade válida na abertura (ver `editingContact` acima).
  // "Editar" reabre os campos de contato de sempre, sem alterar a qualificação já respondida (isLocal/
  // alreadyInFoz seguem no estado, resumidos abaixo). Exceção: se `alreadyInFoz` ainda está null (nunca
  // respondeu, ou TTL de 1 dia vencido — ver lib/known-lead.ts), essa 1 pergunta reaparece ao vivo dentro
  // do próprio card, sem reabrir o resto (nome/telefone/isLocal continuam resumidos).
  const identitySummaryLine = [
    email || null,
    isCustom ? phone : `${country.prefix} ${phone}`,
    isLocal === true
      ? ui.summaryLocalYes
      : isLocal === false
        ? ui.summaryLocalNo
        : null,
    isLocal === false && alreadyInFoz !== null
      ? alreadyInFoz
        ? ui.summaryAlreadyInFoz
        : ui.summaryNotInFozYet
      : null,
    // Transporte consolidado: o card acima some depois de respondido (ver o gate lá), então a resposta
    // precisa continuar visível AQUI — senão parece que a informação se perdeu. Mostra OS DOIS lados,
    // igual "Moro em Foz"/"Não moro em Foz": a recusa também é uma resposta que a pessoa deu.
    transportVisible && transportAnswered
      ? transportChecked
        ? ui.summaryTransport
        : ui.summaryNoTransport
      : null,
  ]
    .filter(Boolean)
    .join(" · ");
  const identitySummary = (
    <div
      className="mb-1 rounded-2xl border p-3"
      style={{ borderColor: "hsl(214,25%,88%)", background: "white" }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p
            className="text-sm font-bold truncate"
            style={{ color: "hsl(210,60%,15%)" }}
          >
            {nome}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "hsl(210,25%,45%)" }}>
            {identitySummaryLine}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditingContact(true)}
          className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-70"
          style={{ color: "hsl(210,56%,23%)" }}
        >
          <Pencil className="h-3 w-3" aria-hidden="true" />
          Editar
        </button>
      </div>
      {isLocal === false && alreadyInFoz === null && (
        <div className="mt-3" ref={qInFozSectionRef}>
          <label
            className="text-sm font-semibold"
            style={{ color: "hsl(210,60%,15%)" }}
          >
            {texts.qInFoz}
          </label>
          <div className="mt-1.5">
            <SimNao
              value={alreadyInFoz}
              invalid={!!errors.inFoz}
              locale={locale}
              onSim={() => chooseInFozRevalidate(true)}
              onNao={() => chooseInFozRevalidate(false)}
              disabled={stage === "submitting"}
            />
          </div>
          {errors.inFoz && (
            <p className="mt-1 text-xs" style={{ color: "hsl(0,72%,51%)" }}>
              {errors.inFoz}
            </p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div
      className={
        preview
          ? "relative w-full flex items-center justify-center"
          : "fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-3 sm:p-6"
      }
      role={preview ? undefined : "dialog"}
      aria-modal={preview ? undefined : true}
      aria-label={
        preview
          ? undefined
          : isRoteiroCtx
            ? "Orçamento do roteiro"
            : "Oferta especial de ingresso"
      }
    >
      {!preview && TURNSTILE_ENABLED && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
        />
      )}

      {/* Backdrop — só no modal real (overlay fixo); preview é inline, sem nada por trás pra escurecer */}
      {!preview && (
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={stage !== "submitting" ? close : undefined}
          aria-hidden="true"
        />
      )}

      {/* Card — flex column: header fixo + corpo com scroll */}
      <div
        className={`relative z-10 w-full max-w-md rounded-3xl shadow-2xl flex flex-col ${preview ? "" : "animate-in slide-in-from-bottom-4 fade-in duration-300"}`}
        style={{
          background: "hsl(40,33%,97%)",
          maxHeight: preview ? 640 : "92dvh",
        }}
      >
        {/* Botão fechar — absoluto, não consome espaço no layout e não cobre o scroll (só no modal real) */}
        {!preview && (
          <button
            onClick={close}
            disabled={stage === "submitting"}
            className="absolute top-3 right-3 z-20 p-1.5 rounded-full transition-colors hover:bg-black/10 disabled:opacity-40"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" style={{ color: "hsl(210,25%,45%)" }} />
          </button>
        )}

        {/* Corpo com scroll — pt-10 reserva espaço visual para o botão fechar (só no modal real) */}
        <div
          ref={bodyRef}
          className={`flex-1 overflow-y-auto px-6 ${preview ? "pt-6" : "pt-10"} pb-7 sm:px-8 sm:pb-8`}
        >
          {/* Seletor de idioma — topo do modal (acima de tudo), mesmo componente do navbar. Oculto no
              preview do admin: lá o idioma é controlado pelo seletor da pré-visualização, e o switcher
              real gravaria cookie + `router.refresh()`, o que embaralharia o rascunho do editor. */}
          {!preview && (
            <div className="mb-4 flex items-center gap-2.5">
              <span
                className="text-sm font-semibold"
                style={{ color: "hsl(210,60%,15%)" }}
              >
                {ui.languageLabel}
              </span>
              <LanguageSwitcher />
            </div>
          )}
          {duplicateModalId ? (
            /* ── JÁ ENVIADO (reenvio do mesmo produto na janela de dedup) ──
                 Mesmo conteúdo que a página de obrigado mostrava neste caso — título de fallback
                 (`3 · Textos do modal`), a mensagem de "iniciar conversa" do produto e o CTA central.
                 Vale pros TRÊS produtos: antes o roteiro caía no `/obrigado` sem aviso nenhum. */
            <div className="text-center py-4">
              {/* Check outline em Verde Selva — mesmo tratamento da tela de sucesso em /obrigado. O
                  emoji ✅ de 5xl gritava mais que o próprio título. */}
              <CircleCheck
                className="mx-auto mb-4 h-10 w-10"
                style={{ color: "hsl(152,47%,32%)" }}
                strokeWidth={2}
                aria-hidden="true"
              />
              <h2
                className="text-xl font-bold mb-3"
                style={{
                  color: "hsl(210,60%,15%)",
                  fontFamily: "var(--font-display)",
                }}
              >
                {texts.duplicateNoticeTitle}
              </h2>
              {/* ⚠️ Texto E botão respeitam o modo de sucesso do produto (admin): com "iniciar
                  conversa" desligado, o aviso fica só no título — antes a mensagem "Quer adiantar?
                  Toque abaixo…" aparecia mesmo sem botão nenhum embaixo dela. */}
              {showWhatsappOnSuccess && centralWaUrl() && (
                <p
                  className="text-[15px] leading-relaxed whitespace-pre-line"
                  style={{ color: "hsl(210,25%,35%)" }}
                >
                  {texts.successWhatsapp}
                </p>
              )}
              {showWhatsappOnSuccess && centralWaUrl() && (
                <a
                  href={centralWaUrl()!}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackConversion(CONVERSIONS.ctaClick, {
                      cta_type: "modal_central_whatsapp",
                      ...duplicateTax(),
                    });
                    // SAÍDA (D6) — é o mesmo WhatsApp central, alcançado pelo caminho do lead duplicado.
                    trackConversion(CONVERSIONS.contact, duplicateTax());
                    markDuplicateCta({ clicked: true });
                  }}
                  className="mt-6 inline-flex items-center justify-center gap-2 w-full rounded-2xl py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(152,47%,32%) 0%, hsl(152,50%,26%) 100%)",
                  }}
                >
                  {texts.waButtonLabel}
                </a>
              )}
            </div>
          ) : stage === "success" ? (
            /* ── SUCESSO ──────────────────────────────────── */
            <div className="text-center py-4">
              <div className="text-5xl mb-4" aria-hidden="true">
                🎉
              </div>
              <h2
                className="text-xl font-bold mb-3"
                style={{
                  color: "hsl(210,60%,15%)",
                  fontFamily: "var(--font-display)",
                }}
              >
                {wasDuplicate ? texts.duplicateNoticeTitle : texts.successTitle}
              </h2>

              {wasDuplicate ? (
                /* Fallback de dedup (antiabuso): mesmo WhatsApp reenviou o form há pouco — a agência não foi
                   renotificada (evita reincomodar), mas o lead precisa de uma resposta clara + um jeito de
                   adiantar o contato. Reaproveita a descrição/botão do modo "Botão iniciar conversa" (mesmo
                   fora desse modo) — só o TÍTULO acima muda (editável no admin). Some sem número central configurado. */
                <>
                  <p
                    className="text-[15px] leading-relaxed whitespace-pre-line text-left"
                    style={{ color: "hsl(210,25%,35%)" }}
                  >
                    {texts.successWhatsapp}
                  </p>
                  {centralWaUrl() && (
                    <a
                      href={centralWaUrl()!}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleCentralClick}
                      className="mt-6 inline-flex items-center justify-center gap-2 w-full rounded-2xl py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
                      style={{
                        background:
                          "linear-gradient(135deg, hsl(152,47%,32%) 0%, hsl(152,50%,26%) 100%)",
                      }}
                    >
                      {texts.waButtonLabel}
                    </a>
                  )}
                </>
              ) : showDirectOnSuccess && detail?.href ? (
                /* Self-serve: a agência não atende este lead → link direto p/ comprar online. */
                <>
                  <p
                    className="text-[15px] leading-relaxed whitespace-pre-line text-left"
                    style={{ color: "hsl(210,25%,35%)" }}
                  >
                    {texts.successDirect}
                  </p>
                  <a
                    href={detail.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleDirectSuccess}
                    className="mt-6 inline-flex items-center justify-center gap-2 w-full rounded-2xl py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)",
                    }}
                  >
                    {texts.directButtonLabel}
                  </a>
                </>
              ) : showWhatsappOnSuccess && centralWaUrl() ? (
                /* Modal "botão iniciar conversa": o lead pode adiantar o contato pelo WhatsApp. */
                <>
                  <p
                    className="text-[15px] leading-relaxed whitespace-pre-line text-left"
                    style={{ color: "hsl(210,25%,35%)" }}
                  >
                    {texts.successWhatsapp}
                  </p>
                  <a
                    href={centralWaUrl()!}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleCentralClick}
                    className="mt-6 inline-flex items-center justify-center gap-2 w-full rounded-2xl py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(152,47%,32%) 0%, hsl(152,50%,26%) 100%)",
                    }}
                  >
                    {texts.waButtonLabel}
                  </a>
                </>
              ) : (
                /* Sucesso "só mensagem + fechar": a agência chama o lead — SEM botão (anti-colisão). */
                <>
                  <p
                    className="text-[15px] leading-relaxed whitespace-pre-line text-left"
                    style={{ color: "hsl(210,25%,35%)" }}
                  >
                    {texts.successClose}
                  </p>
                </>
              )}
            </div>
          ) : (
            /* ── FORMULÁRIO ───────────────────────────────── */
            <>
              <div className="mb-1">
                {/* Ícone acima do título, alinhado à esquerda (decisão do usuário set/2026). Verde
                    Selva, não dourado: o único objeto dourado da tela é o CTA de envio
                    (design-system §1). `Route` é o ícone que o projeto já usa para roteiro. */}
                {isAtrativoCtx ? (
                  isReservaCtx ? (
                    <CalendarCheck
                      className="mb-2 h-5 w-5"
                      style={{ color: "hsl(152,47%,32%)" }}
                      aria-hidden="true"
                    />
                  ) : (
                    <Ticket
                      className="mb-2 h-5 w-5"
                      style={{ color: "hsl(152,47%,32%)" }}
                      aria-hidden="true"
                    />
                  )
                ) : isRoteiroCtx ? (
                  <Route
                    className="mb-2 h-5 w-5"
                    style={{ color: "hsl(152,47%,32%)" }}
                    aria-hidden="true"
                  />
                ) : null}
                <h2
                  className="text-xl font-bold leading-snug whitespace-pre-line"
                  style={{
                    color: "hsl(210,60%,15%)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {isReservaCtx ? ui.reservaTitle : texts.title}
                </h2>
                {/* Vazio = não renderiza: o bucket atrativo não tem subtítulo (o card do assunto,
                    logo abaixo, já diz o que é), e um <p> vazio deixaria um buraco no espaçamento. */}
                {texts.subtitle && (
                  <p
                    className="mt-2 text-[15px] leading-relaxed whitespace-pre-line"
                    style={{ color: "hsl(210,25%,40%)" }}
                  >
                    {texts.subtitle}
                  </p>
                )}
              </div>

              {/* NOVO FLUXO: os parceiros NÃO ficam mais no topo. Aparecem (a) INLINE quando o lead marca transporte
                  e responde "Sim" no roteiro (abaixo, após o transporte), ou (b) na TELA DE SUCESSO quem não quer transfer. */}

              <ModalDivider />

              {/* Subject dinâmico (roteiro / atrativo) OU card de ingresso/agência (legado). */}
              {showSubjectCard && subjectTitle && leadCopy && (
                <SubjectItemCard
                  label={subjectTitle}
                  copy={
                    subjectSubtitle ||
                    /* Fallback inalcançável hoje (os 5 callers passam `subjectSubtitle`), mas
                       mantido sem nomear agência nem canal: a versão anterior dizia "…com a
                       agência parceira" e teria renderizado copy banida (§21.5) se um caller
                       futuro omitisse a prop. */
                    (isReservaCtx
                      ? "Reserva de data."
                      : isAtrativoCtx
                        ? "Ingresso do atrativo."
                        : "Logística do roteiro.")
                  }
                  image={subjectImage}
                  badge={isReservaCtx ? ui.reservaBadge : leadCopy.subjectBadge}
                  /* Atrativo de RESERVA: o rótulo "Incluído" do mini-card vira o aviso de que o
                     transporte está contemplado — ali a pergunta Sim/Não não existe e este é o
                     único lugar da tela onde a informação cabe sem virar um bloco a mais.
                     ⚠️ Também gateado por `transportVisible`: com a oferta de transporte
                     desligada no admin, volta ao rótulo normal. Anunciar "transporte incluído"
                     com a oferta fora do ar seria prometer o que não está no ar. */
                  includedLabel={
                    isReservaCtx && transportVisible
                      ? ui.transportIncluded
                      : leadCopy.subjectIncluded
                  }
                  locale={locale}
                />
              )}

              {/* Atrativo: pacote com mais de um ingresso no mesmo lead. */}
              {isAtrativoCtx &&
                showSubjectCard &&
                subjectTitle &&
                leadCopy &&
                attractionPickerList.length > 0 && (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={toggleIncludeOtherAttractions}
                      className="text-sm font-semibold transition-opacity hover:opacity-80"
                      style={{ color: "hsl(210,56%,23%)" }}
                    >
                      {includeOtherAttractions ? "− " : "+ "}
                      {ui.includeOtherAttractions}
                    </button>
                    {includeOtherAttractions && (
                      <div
                        className="mt-2 rounded-2xl border p-3"
                        style={{
                          borderColor: "hsl(214,25%,88%)",
                          background: "white",
                        }}
                      >
                        <div className="max-h-52 overflow-y-auto flex flex-col gap-1 pr-1">
                          {attractionPickerList.map((a) => {
                            const checked = extraAttractions.includes(a.slug);
                            return (
                              <button
                                key={a.slug}
                                type="button"
                                onClick={() => toggleExtraAttraction(a.slug)}
                                className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm transition-colors"
                                style={{
                                  background: checked
                                    ? "hsl(152,40%,95%)"
                                    : "transparent",
                                  color: checked
                                    ? "hsl(152,47%,25%)"
                                    : "hsl(210,25%,35%)",
                                }}
                              >
                                <span
                                  className="flex h-4 w-4 flex-none items-center justify-center rounded border"
                                  style={{
                                    borderColor: checked
                                      ? "hsl(152,47%,40%)"
                                      : "hsl(214,25%,75%)",
                                    background: checked
                                      ? "hsl(152,47%,40%)"
                                      : "white",
                                  }}
                                  aria-hidden="true"
                                >
                                  {checked && (
                                    <Check className="h-3 w-3 text-white" />
                                  )}
                                </span>
                                {a.name}
                              </button>
                            );
                          })}
                        </div>
                        <button
                          type="button"
                          onClick={toggleIncludeOtherAttractions}
                          className="mt-2 text-xs font-semibold transition-opacity hover:opacity-70"
                          style={{ color: "hsl(210,25%,50%)" }}
                        >
                          {ui.cancel}
                        </button>
                      </div>
                    )}
                  </div>
                )}

              <ModalDivider />

              {/* Calendário do dia da visita/início — atrativo + roteiro pronto/personalizar (D5/D6). 1º item
                  do bloco liberado: qualificação/transporte/form só aparecem depois do dia escolhido (`dateChosen`
                  abaixo), mesmo padrão de revelação sequencial do resto do fluxo. */}
              {wantsDate && (
                <div ref={calendarSectionRef}>
                  <p
                    className="text-sm font-bold mb-2 text-center"
                    style={{ color: "hsl(152,47%,30%)" }}
                  >
                    {ui.chooseDayTitle}
                  </p>
                  <DayCalendar
                    value={visitDate}
                    onChange={chooseVisitDate}
                    locale={locale}
                    disabled={stage === "submitting"}
                  />
                  {errors.date && (
                    <p
                      className="mt-1 text-xs"
                      style={{ color: "hsl(0,72%,51%)" }}
                    >
                      {errors.date}
                    </p>
                  )}
                </div>
              )}

              {/* "Para quantas pessoas?" — depois do dia escolhido, em todo produto do modal. */}
              {dateChosen && wantsQty && (
                <>
                  <ModalDivider />
                  <div>
                    <p
                      className="text-sm font-bold mb-2 text-center"
                      style={{ color: "hsl(152,47%,30%)" }}
                    >
                      {ui.quantityTitle}
                    </p>
                    <QuantityStepper
                      value={ticketQty}
                      onChange={setTicketQty}
                      disabled={stage === "submitting"}
                    />
                  </div>
                </>
              )}

              {dateChosen && (
                <>
                  <ModalDivider />
                  {/* Card único consolidado (nome/telefone/morador?/já-em-Foz?) — só quando NÃO editando (identidade
                      já conhecida/válida, ver `editingContact` acima). Quando editando, mostra as 2 perguntas ao
                      vivo (bloco abaixo); "Editar" nunca reabre ESSE bloco, só volta pros campos de contato. */}
                  {!editingContact && identitySummary}

                  {editingContact && (
                    <>
                      {/* Chamada (CTA) — logo acima da 1ª pergunta de qualificação ("já está em Foz?"). Ordem
                          invertida (jul/2026): "já em Foz?" vem primeiro — "Não" já resolve as duas perguntas
                          sozinho (ninguém que ainda não chegou é morador daqui), eliminando a 2ª pergunta pro
                          turista que ainda está de viagem. Só quem responde "Sim" (ambíguo: pode ser morador OU
                          turista já chegado) vê a 2ª pergunta "é morador de Foz?" pra desambiguar. */}
                      {texts.qualifyTitle && (
                        <p
                          className="text-sm font-bold mb-2"
                          style={{ color: "hsl(152,47%,30%)" }}
                        >
                          {texts.qualifyTitle}
                        </p>
                      )}

                      {/* Qualificação — mesma moldura do bloco de roteiro (borda + fundo branco).
                          `qInFozSectionRef` é o alvo do auto-scroll depois que o dia é escolhido. */}
                      <div
                        className="mb-1 rounded-2xl border p-3"
                        ref={qInFozSectionRef}
                        style={{
                          borderColor: "hsl(214,25%,88%)",
                          background: "white",
                        }}
                      >
                        <label
                          className="block text-sm font-semibold text-center"
                          style={{ color: "hsl(210,60%,15%)" }}
                        >
                          {texts.qInFoz}
                        </label>
                        <div className="mt-1.5">
                          <SimNao
                            value={alreadyInFoz}
                            invalid={!!errors.inFoz}
                            locale={locale}
                            onSim={() => chooseInFoz(true)}
                            onNao={() => chooseInFoz(false)}
                            disabled={stage === "submitting"}
                          />
                        </div>
                        {errors.inFoz && (
                          <p
                            className="mt-1 text-xs"
                            style={{ color: "hsl(0,72%,51%)" }}
                          >
                            {errors.inFoz}
                          </p>
                        )}
                        {alreadyInFoz === true && (
                          <div className="mt-3" ref={qLocalSectionRef}>
                            <label
                              className="block text-sm font-semibold text-center"
                              style={{ color: "hsl(210,60%,15%)" }}
                            >
                              {texts.qLocal}
                            </label>
                            <div className="mt-1.5">
                              <SimNao
                                value={isLocal}
                                invalid={!!errors.local}
                                locale={locale}
                                onSim={() => chooseLocal(true)}
                                onNao={() => chooseLocal(false)}
                                disabled={stage === "submitting"}
                              />
                            </div>
                            {errors.local && (
                              <p
                                className="mt-1 text-xs"
                                style={{ color: "hsl(0,72%,51%)" }}
                              >
                                {errors.local}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Transporte/roteiro + form: só renderiza após responder "já está em Foz?" — e, se a resposta foi
                  "sim" (ambíguo), também a 2ª pergunta "é morador?" (item D removeu o gate de agência, mas ainda
                  precisa da(s) resposta(s) necessária(s), senão abre no meio da qualificação). O FORM em si (mais
                  abaixo) tem um gate ADICIONAL (`readyForForm`) — essas seções de transporte/roteiro seguem
                  visíveis aqui, só o <form> espera elas serem resolvidas. */}
              {qualificationDone && (
                <>
                  {/* Transporte (agência oficial) — pergunta Sim/Não acima do form, em QUALQUER produto
                      (só o toggle do admin manda, ver `transportVisible`).
                      ⚠️ `editingContact || !transportAnswered`: chaveia por RESPONDIDO, não por marcado —
                      quem respondeu "Não" também consolida e não é perguntado de novo a cada reabertura
                      (com `!transportChecked` aqui, a recusa reabriria o card pra sempre). A resposta
                      segue visível na linha do card de resumo (`ui.summaryTransport`/`ui.summaryNoTransport`).
                      Clicar em "Editar" (`editingContact = true`) REEXIBE o bloco mesmo já respondido,
                      senão não haveria como trocar a resposta. */}
                  {(editingContact || !transportAnswered) &&
                    transportVisible &&
                    !transporteAutomatico && (
                      <div ref={transportSectionRef}>
                        <ModalDivider />
                        <TransportCard
                          title={transport.title}
                          desc={transport.desc}
                          value={transportWanted}
                          onChoose={chooseTransport}
                          locale={locale}
                          disabled={stage === "submitting"}
                        />
                      </div>
                    )}

                  {/* ⓘ NÃO existe bloco próprio de "transporte incluído" aqui. Houve um, e saiu:
                      a informação cabe no rótulo do mini-card do assunto (ver `includedLabel`),
                      onde ela fica colada no item a que se refere em vez de virar mais uma faixa
                      entre a pergunta e o formulário. */}

                  {/* Form: só após as perguntas/marcações VISÍVEIS acima (transporte) estarem
                      resolvidas — gate dinâmico (`readyForForm`), auto-passa quando a seção nem existe. */}
                  {readyForForm && (
                    <>
                      <ModalDivider />
                      {texts.formHint && (
                        <p
                          className="text-sm font-semibold text-center mb-2"
                          style={{ color: "hsl(152,47%,32%)" }}
                        >
                          {texts.formHint}
                        </p>
                      )}
                      {/* Âncora do scroll automático: fica no bloco do formulário, não no texto —
                          o texto é opcional e some no bucket atrativo. */}
                      <div ref={formSectionRef} />

                      <form
                        onSubmit={handleSubmit}
                        noValidate
                        className="flex flex-col gap-3"
                      >
                        {/* Honeypot anti-bot — invisível p/ humanos (fora de tela, sem tab/autofill); bot preenche → dropado no servidor */}
                        <input
                          ref={honeypotRef}
                          type="text"
                          name="website"
                          tabIndex={-1}
                          autoComplete="off"
                          aria-hidden="true"
                          style={{
                            position: "absolute",
                            left: "-9999px",
                            top: 0,
                            width: 1,
                            height: 1,
                            opacity: 0,
                          }}
                        />

                        {editingContact && (
                          <>
                            {/* Nome — oculto se sessão visitante já tem nome + e-mail */}
                            {!(
                              visitorPrefill?.name &&
                              visitorPrefill?.email &&
                              nome.trim() &&
                              email.trim()
                            ) && (
                              <div className="relative">
                                <input
                                  ref={nomeRef}
                                  id="rf-modal-nome"
                                  type="text"
                                  /* Espaço, não o rótulo — ver a nota do floating label. */
                                  placeholder=" "
                                  value={nome}
                                  onChange={(e) => {
                                    setNome(e.target.value.slice(0, 80));
                                    if (errors.nome)
                                      setErrors((p) => ({
                                        ...p,
                                        nome: undefined,
                                      }));
                                  }}
                                  onBlur={() => {
                                    if (nome.trim().length >= 2)
                                      fire("field_name");
                                  }}
                                  required
                                  maxLength={80}
                                  disabled={stage === "submitting"}
                                  className={inputBase}
                                  style={errors.nome ? inputErr : inputOk}
                                  aria-invalid={!!errors.nome}
                                />
                                <label
                                  htmlFor="rf-modal-nome"
                                  className={rotuloFlutuante}
                                >
                                  {ui.namePlaceholder}
                                </label>
                                {errors.nome && (
                                  <p
                                    className="mt-1 text-xs"
                                    style={{ color: "hsl(0,72%,51%)" }}
                                  >
                                    {errors.nome}
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Email — oculto se logado via magic link */}
                            {!(visitorPrefill?.email && email.trim()) && (
                              <div className="relative">
                                <input
                                  id="rf-modal-email"
                                  type="email"
                                  placeholder=" "
                                  value={email}
                                  onChange={(e) => {
                                    setEmail(e.target.value.slice(0, 120));
                                    if (errors.email)
                                      setErrors((p) => ({
                                        ...p,
                                        email: undefined,
                                      }));
                                  }}
                                  onBlur={() => {
                                    if (
                                      email.trim() &&
                                      isValidEmail(email.trim())
                                    )
                                      fire("field_email");
                                  }}
                                  maxLength={120}
                                  disabled={stage === "submitting"}
                                  className={inputBase}
                                  style={errors.email ? inputErr : inputOk}
                                  aria-invalid={!!errors.email}
                                />
                                <label
                                  htmlFor="rf-modal-email"
                                  className={rotuloFlutuante}
                                >
                                  {ui.emailPlaceholder}
                                </label>
                                {errors.email && (
                                  <p
                                    className="mt-1 text-xs"
                                    style={{ color: "hsl(0,72%,51%)" }}
                                  >
                                    {errors.email}
                                  </p>
                                )}
                              </div>
                            )}

                            {visitorPrefill?.email && email.trim() && (
                              <p className="text-center text-xs text-[hsl(210,25%,50%)]">
                                Conta: <strong>{visitorPrefill.email}</strong>
                                {visitorPrefill.name
                                  ? ` · ${visitorPrefill.name}`
                                  : ""}
                              </p>
                            )}

                            {/* WhatsApp + seletor de país */}
                            <div>
                              {/* ⚠️ AQUI O RÓTULO NÃO FLUTUA, e não é inconsistência:
                                  1. a caixa tem `overflow-hidden` (é o que arredonda os cantos do
                                     seletor de DDI), então um rótulo sobre a borda seria cortado;
                                  2. este campo NUNCA está visualmente vazio — a máscara já ocupa o
                                     interior. Rótulo flutuante existe para fazer as vezes do
                                     placeholder enquanto não há nada; aqui não há esse vazio.
                                  A aparência é a MESMA do estado flutuado dos outros dois (11px,
                                  semibold, Azul Médio), então a leitura do formulário é uniforme. */}
                              <label
                                htmlFor="rf-modal-phone"
                                className="mb-1 block text-[11px] font-semibold text-[hsl(210,56%,23%)]"
                              >
                                {ui.phoneLabel}
                              </label>
                              <div
                                className="rounded-xl border overflow-hidden"
                                style={{ borderColor: phoneBorder }}
                              >
                                <div className="flex">
                                  <select
                                    value={isCustom ? "outro" : country.prefix}
                                    onChange={(e) =>
                                      handleCountryChange(e.target.value)
                                    }
                                    disabled={stage === "submitting"}
                                    className="flex-none text-sm font-medium px-3 py-2.5 border-r outline-none cursor-pointer disabled:opacity-60"
                                    style={{
                                      borderColor: phoneBorder,
                                      background: "hsl(40,20%,93%)",
                                      color: "hsl(210,60%,15%)",
                                      minWidth: 94,
                                      appearance: "none",
                                    }}
                                    aria-label="Código do país"
                                  >
                                    {COUNTRIES.map((c) => (
                                      <option key={c.prefix} value={c.prefix}>
                                        {c.flag} {c.prefix}
                                      </option>
                                    ))}
                                    <option value="outro">
                                      {ui.otherCountry}
                                    </option>
                                  </select>

                                  {isCustom ? (
                                    <input
                                      id="rf-modal-phone"
                                      type="tel"
                                      inputMode="tel"
                                      placeholder={ui.phoneCustomPlaceholder}
                                      value={phone}
                                      onChange={(e) =>
                                        handlePhoneChange(e.target.value)
                                      }
                                      onBlur={() => {
                                        if (phone.trim().length >= 8)
                                          fire("field_phone");
                                      }}
                                      required
                                      maxLength={25}
                                      disabled={stage === "submitting"}
                                      className="flex-1 px-4 py-2.5 text-sm outline-none disabled:opacity-60 min-w-0"
                                      style={{
                                        background: "white",
                                        color: "hsl(210,60%,15%)",
                                      }}
                                      aria-label="Número completo com código do país"
                                      aria-invalid={!!errors.phone}
                                    />
                                  ) : (
                                    <input
                                      id="rf-modal-phone"
                                      type="tel"
                                      inputMode="numeric"
                                      placeholder={country.mask.replace(
                                        /#/g,
                                        "0",
                                      )}
                                      value={phone}
                                      onChange={(e) =>
                                        handlePhoneChange(e.target.value)
                                      }
                                      onBlur={() => {
                                        if (
                                          phone.replace(/\D/g, "").length >=
                                          country.digits
                                        )
                                          fire("field_phone");
                                      }}
                                      required
                                      disabled={stage === "submitting"}
                                      className="flex-1 px-4 py-2.5 text-sm outline-none disabled:opacity-60 min-w-0"
                                      style={{
                                        background: "white",
                                        color: "hsl(210,60%,15%)",
                                      }}
                                      aria-label="Número de WhatsApp"
                                      aria-invalid={!!errors.phone}
                                    />
                                  )}
                                </div>
                              </div>
                              {errors.phone && (
                                <p
                                  className="mt-1 text-xs"
                                  style={{ color: "hsl(0,72%,51%)" }}
                                >
                                  {errors.phone}
                                </p>
                              )}
                            </div>
                          </>
                        )}

                        {/* Anti-bot (Cloudflare Turnstile) — só renderiza quando ligado (site key presente) */}
                        {TURNSTILE_ENABLED && (
                          <div>
                            <TurnstileWidget onToken={setTurnstileToken} />
                            {errors.turnstile && (
                              <p
                                className="mt-1 text-xs text-center"
                                style={{ color: "hsl(0,72%,51%)" }}
                              >
                                {errors.turnstile}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Botão principal */}
                        <button
                          type="submit"
                          disabled={stage === "submitting"}
                          /* ⓘ `flex` + `gap-2`: o botão passa a hospedar spinner + rótulo lado a
                             lado, o MESMO tratamento do CTA final do wizard. Antes só trocava o
                             texto, e a diferença entre os dois fluxos aparecia justo no momento
                             de maior ansiedade do visitante. */
                          className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:scale-100"
                          style={{
                            background:
                              "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)",
                          }}
                        >
                          {stage === "submitting" ? (
                            <>
                              {/* `rf-envio-spin`: sob `prefers-reduced-motion` o ícone some e o
                                  rótulo sustenta o estado sozinho (§10.3 + globals.css). */}
                              <Loader2
                                className="rf-envio-spin h-4 w-4 animate-spin"
                                aria-hidden="true"
                              />
                              {ui.submitting}
                            </>
                          ) : (
                            texts.submitLabel
                          )}
                        </button>

                        {/* Microcopy LGPD */}
                        <p
                          className="text-center leading-relaxed"
                          style={{ fontSize: 11, color: "hsl(210,20%,55%)" }}
                        >
                          {ui.lgpdBefore}
                          <a
                            href="/aviso-legal"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-2"
                          >
                            {ui.lgpdTerms}
                          </a>
                          {ui.lgpdAfter}
                        </p>
                      </form>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- subcomponentes (Ação para parceiros — PA §15) ---------- */

/** Par de botões Sim/Não para a qualificação do lead. */
function SimNao({
  value,
  onSim,
  onNao,
  invalid,
  disabled,
  locale,
}: {
  value: boolean | null;
  onSim: () => void;
  onNao: () => void;
  invalid?: boolean;
  disabled?: boolean;
  locale: Locale;
}) {
  const ui = MODAL_UI[locale];
  const base =
    "flex-1 rounded-xl border py-2 text-sm font-semibold transition-colors disabled:opacity-50";
  const idle = {
    background: "white",
    color: "hsl(210,25%,40%)",
    borderColor: invalid ? "hsl(0,72%,51%)" : "hsl(210,20%,82%)",
  };
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onSim}
        disabled={disabled}
        aria-pressed={value === true}
        className={base}
        style={
          value === true
            ? {
                background: "hsl(152,47%,32%)",
                color: "white",
                borderColor: "hsl(152,47%,32%)",
              }
            : idle
        }
      >
        {ui.yes}
      </button>
      <button
        type="button"
        onClick={onNao}
        disabled={disabled}
        aria-pressed={value === false}
        className={base}
        style={
          value === false
            ? {
                background: "hsl(210,60%,15%)",
                color: "white",
                borderColor: "hsl(210,60%,15%)",
              }
            : idle
        }
      >
        {ui.no}
      </button>
    </div>
  );
}

/**
 * Card do item em contexto (roteiro pronto / personalizar / atrativo).
 */
function SubjectItemCard({
  label,
  copy,
  image,
  badge,
  includedLabel,
  locale,
}: {
  label: string;
  copy: string;
  image: string | null;
  badge: string;
  includedLabel: string;
  locale: Locale;
}) {
  const ui = MODAL_UI[locale];
  return (
    <div
      className="rounded-2xl border p-3"
      style={{ borderColor: "hsl(214,25%,88%)", background: "white" }}
    >
      <div className="overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt=""
            width={56}
            height={56}
            className="float-left mr-3 mb-1 h-[56px] w-[56px] rounded-xl object-cover"
          />
        ) : (
          <div
            className="float-left mr-3 mb-1 flex h-[56px] w-[56px] items-center justify-center rounded-xl text-2xl"
            style={{ background: "hsl(214,50%,96%)" }}
            aria-hidden
          >
            🗺️
          </div>
        )}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className="rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
              style={{
                background: "hsl(152,45%,92%)",
                color: "hsl(152,47%,28%)",
              }}
            >
              {badge}
            </span>
          </div>
          <p
            className="mt-1 text-sm font-bold leading-snug"
            style={{ color: "hsl(210,60%,15%)" }}
          >
            {label}
          </p>
          <p
            className="mt-0.5 text-xs leading-relaxed"
            style={{ color: "hsl(210,25%,45%)" }}
          >
            {copy}
          </p>
        </div>
      </div>
      <div
        className="mt-3 flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-bold"
        style={{
          borderColor: "hsl(152,35%,80%)",
          background: "hsl(152,40%,97%)",
          color: "hsl(152,47%,28%)",
        }}
      >
        <Check className="h-3.5 w-3.5" aria-hidden />
        {includedLabel || ui.includedBadge}
      </div>
    </div>
  );
}

/**
 * Card de transporte (cross-sell da agência oficial) — o `title` É a pergunta e o `desc` é o argumento,
 * os dois editáveis no admin. Resposta em Sim/Não (mesmo `SimNao` da qualificação), não checkbox: num
 * roteiro com vários atrativos a resposta importa dos DOIS lados (saber que a pessoa não precisa vale
 * tanto quanto saber que precisa), e um checkbox só sabe dizer "sim" — "não" ficava indistinguível de
 * "não respondeu".
 */
function TransportCard({
  title,
  desc,
  value,
  onChoose,
  locale,
  disabled,
}: {
  title: string;
  desc: string;
  value: boolean | null;
  onChoose: (v: boolean) => void;
  locale: Locale;
  disabled?: boolean;
}) {
  const chosen = value === true;
  return (
    <div
      className="rounded-2xl border p-2.5 mb-4"
      style={{
        borderColor: chosen ? "hsl(152,47%,40%)" : "hsl(210,20%,86%)",
        background: chosen ? "hsl(152,40%,96%)" : "white",
      }}
    >
      <p
        className="text-base font-bold leading-tight text-center"
        style={{ color: "hsl(210,60%,15%)" }}
      >
        {title}
      </p>
      {desc && (
        <p
          className="text-sm mt-0.5 leading-snug text-center"
          style={{ color: "hsl(209,25%,26%)" }}
        >
          {desc}
        </p>
      )}
      <div className="mt-2.5">
        <SimNao
          value={value}
          onSim={() => onChoose(true)}
          onNao={() => onChoose(false)}
          disabled={disabled}
          locale={locale}
        />
      </div>
    </div>
  );
}

/** Stepper de quantidade ("− N +") do ingresso de atrativo — clicar no número vira input editável. Clamp 1–10. */
function QuantityStepper({
  value,
  onChange,
  min = 1,
  // Sem teto artificial: grupos grandes existem (excursão, família estendida) e travar em 10 fazia a
  // pessoa desistir do campo. 999 é só a barreira contra digitação absurda.
  max = 999,
  disabled,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [raw, setRaw] = useState(String(value));
  useEffect(() => {
    if (!editing) setRaw(String(value));
  }, [value, editing]);
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const commit = () => {
    const n = parseInt(raw, 10);
    onChange(Number.isFinite(n) ? clamp(n) : value);
    setEditing(false);
  };
  const btnStyle = {
    borderColor: "hsl(210,20%,82%)",
    color: "hsl(210,60%,15%)",
  };
  return (
    <div
      className="flex items-center justify-center gap-3 rounded-xl border px-3 py-2"
      style={{ borderColor: "hsl(210,20%,82%)", background: "white" }}
    >
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={disabled || value <= min}
        aria-label="Diminuir quantidade"
        className="h-8 w-8 rounded-lg border flex items-center justify-center font-bold disabled:opacity-30"
        style={btnStyle}
      >
        −
      </button>
      {editing ? (
        <input
          type="number"
          inputMode="numeric"
          value={raw}
          autoFocus
          disabled={disabled}
          onChange={(e) => setRaw(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            }
          }}
          className="w-14 text-center text-base font-bold outline-none"
          style={{ color: "hsl(210,60%,15%)" }}
        />
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            setRaw(String(value));
            setEditing(true);
          }}
          className="w-14 text-center text-base font-bold"
          style={{ color: "hsl(210,60%,15%)" }}
          aria-label="Editar quantidade manualmente"
        >
          {value}
        </button>
      )}
      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={disabled || value >= max}
        aria-label="Aumentar quantidade"
        className="h-8 w-8 rounded-lg border flex items-center justify-center font-bold disabled:opacity-30"
        style={btnStyle}
      >
        +
      </button>
    </div>
  );
}
