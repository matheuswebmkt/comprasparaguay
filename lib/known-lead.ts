// Filepath: lib/known-lead.ts
// Version: 1.1
// Nome da Versão: "wantsTransport vira atributo ESTÁVEL da pessoa (mesmo padrão de isLocal) — consolida
// a resposta de transporte entre produtos diferentes"
// Baseado na Versão: 1.0 ("Lead conhecido (localStorage) — sobrevive ao envio; pré-preenche
// contato+qualificação entre produtos/páginas e evita repetir o form.")
//
// Diferença do rascunho de sessão (DRAFT_STORAGE_KEY em TicketOfferModal.tsx, sessionStorage): o rascunho
// cobre só "esqueci de terminar de preencher" e é apagado no envio (decisão antiga — "já convertido, próxima
// abertura começa limpa"). Este registro é o OPOSTO: persiste DEPOIS do envio, em localStorage (sobrevive
// fechar o navegador, não só a aba), pra dois casos:
//   1) o mesmo visitante pede um produto DIFERENTE minutos/dias depois (ex: pediu ingresso de um atrativo,
//      depois quer orçamento de um roteiro pronto) — o contato já vem pré-preenchido, sem repetir por causa
//      de ter convertido antes num produto diferente.
//   2) o visitante reabre o modal pro MESMO produto dentro da janela de dedup — ver `recentSubmissionOf`
//      (usado no TicketOfferModal.tsx pra redirecionar direto pra /o-que-fazer sem reabrir o form, ver
//      conventions/funil-modal.md §17).
// TTL de 90 dias pro contato (bem maior que a janela de dedup) — cobre uma janela realista de planejamento de
// viagem sem acumular dado indefinidamente. Client-only (sem SSR) — todas as funções são no-op no server.

import { LEAD_DEDUP_WINDOW_MIN } from "./lead-dedup";
import { isRoteiroLeadContext, isAtrativoLeadContext, type TicketOfferOpenDetail } from "./roteiro-lead";

const STORAGE_KEY = "rgf_known_lead";
const TTL_MS = 90 * 24 * 60 * 60 * 1000; // 90 dias
const MAX_SUBMISSIONS = 20; // teto de segurança — ninguém pede 20 produtos diferentes de verdade
// Validade PRÓPRIA de `alreadyInFoz` (1 dia) — mais curta que o resto do registro (90 dias): a pessoa pode ter
// chegado em Foz (ou saído) de um dia pro outro, então essa resposta específica não pode ficar velha como o
// contato/`isLocal` (que não mudam). Passou do prazo → volta a perguntar, sem mexer no resto do registro.
const ALREADY_IN_FOZ_TTL_MS = 24 * 60 * 60 * 1000; // 1 dia

export interface KnownLeadContact {
  nome: string;
  email: string;
  phone: string;
  countryPrefix: string;
  isCustom: boolean;
  /** "Você é morador de Foz do Iguaçu?" — atributo estável da PESSOA (não muda de um pedido pro outro),
   * reaproveitado igual ao contato. */
  isLocal: boolean | null;
  /** "Você já está em Foz do Iguaçu?" — validade de só 1 DIA (`ALREADY_IN_FOZ_TTL_MS`), não os 90 dias do
   * resto do registro: pode mudar de um dia pro outro (chegou ou saiu de Foz). Depois de 1 dia sem novo envio,
   * `loadKnownLeadContact()` devolve `null` aqui de novo, mesmo com o resto do lead ainda válido. */
  alreadyInFoz: boolean | null;
  /** "Vai precisar de transporte?" — atributo ESTÁVEL da pessoa, mesmo tratamento de `isLocal`, e pelo
   * mesmo motivo TRI-STATE: `true` quer · `false` recusou · `null` nunca respondeu. Guardar a RECUSA é o
   * ponto — com um booleano, "disse não" seria indistinguível de "nunca perguntaram" e a pessoa levaria a
   * mesma pergunta de novo a cada modal que abrisse, em cada produto. Sem TTL próprio (≠ `alreadyInFoz`):
   * só some quando o registro inteiro expira. */
  wantsTransport: boolean | null;
  /** Dia da visita/início (ISO `YYYY-MM-DD`) — preferência da PESSOA na jornada, não do produto: quem
   * já disse quando vai a Foz não deve redigitar isso a cada atrativo/roteiro que abrir.
   * ⚠️ Tem validade PRÓPRIA, e ela não é um TTL: a data **vencida não volta**. `loadKnownLeadContact`
   * devolve `null` quando o dia já passou — o calendário bloqueia o passado, então restaurar uma data
   * vencida deixaria o gate satisfeito com um valor que a pessoa não consegue nem reescolher, e o lead
   * seria enviado com um dia que já foi. */
  visitDate: string | null;
}

/** Hoje em ISO local (`YYYY-MM-DD`) — mesma régua de "passado" do calendário (DayCalendar). */
function todayISO(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

interface KnownLeadSubmission {
  /** Ver `productSignature()` — identifica QUAL produto foi pedido (atrativo/roteiro/personalizar/ingresso). */
  signature: string;
  submittedAt: number; // epoch ms
  /** `modal_id` da submissão original — reaproveitado pra um clique tardio no CTA de sucesso continuar
   * batendo com o lead certo, mesmo sem reenviar o form (ver /api/leads/success). */
  modalId: string;
}

interface KnownLeadRecord extends KnownLeadContact {
  submissions: KnownLeadSubmission[];
  updatedAt: number;
  /** epoch ms de quando `alreadyInFoz` foi respondido pela última vez — ver `ALREADY_IN_FOZ_TTL_MS`. */
  alreadyInFozAt: number | null;
}

/**
 * Assinatura estável do "produto" pedido — MESMA regra usada no server pro dedup (ver app/api/leads/route.ts,
 * coluna `product_signature`). Precisa espelhar exatamente essa lógica, senão o client acha "mesmo produto"
 * quando o server despacharia como diferente (ou vice-versa).
 *
 * Nossas chaves (diferente do doador, que usa experienceSlug/noItem): `atrativo:<slug>` · `roteiro:<slug ou
 * "personalizar">` · `ingresso:generic`.
 */
export function productSignature(
  detail: Pick<TicketOfferOpenDetail, "context" | "ctaType" | "itemSlug" | "roteiroSlug" | "intent"> | null | undefined,
): string {
  if (isAtrativoLeadContext(detail)) return `atrativo:${detail?.itemSlug ?? "generic"}`;
  if (isRoteiroLeadContext(detail)) return `roteiro:${detail?.roteiroSlug ?? "personalizar"}`;
  return "ingresso:generic";
}

function readRaw(): KnownLeadRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<KnownLeadRecord> | null;
    if (!parsed || typeof parsed !== "object" || typeof parsed.updatedAt !== "number") return null;
    if (Date.now() - parsed.updatedAt > TTL_MS) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return {
      nome: parsed.nome ?? "",
      email: parsed.email ?? "",
      phone: parsed.phone ?? "",
      countryPrefix: parsed.countryPrefix ?? "+55",
      isCustom: parsed.isCustom ?? false,
      // `?? null` — registros gravados ANTES desses campos existirem voltam como "ainda não respondeu"
      // (comportamento idêntico a nunca ter um lead conhecido), nunca quebra por dado antigo.
      isLocal: parsed.isLocal ?? null,
      alreadyInFoz: parsed.alreadyInFoz ?? null,
      alreadyInFozAt: parsed.alreadyInFozAt ?? null,
      wantsTransport: parsed.wantsTransport ?? null, // registro gravado antes do campo existir → "nunca respondeu"
      visitDate: parsed.visitDate ?? null,

      submissions: Array.isArray(parsed.submissions) ? parsed.submissions : [],
      updatedAt: parsed.updatedAt,
    };
  } catch {
    return null;
  }
}

function writeRaw(rec: KnownLeadRecord): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rec));
  } catch {
    // localStorage indisponível/cheio (modo privado, quota) — degrada em silêncio, nunca quebra o modal.
  }
}

/** Contato + qualificação salvos (pré-preenchimento) — `null` se nunca converteu ou o registro expirou (90 dias).
 * `alreadyInFoz` some (volta `null`) sozinho depois de 1 dia, mesmo com o resto do lead ainda válido. */
export function loadKnownLeadContact(): KnownLeadContact | null {
  const rec = readRaw();
  if (!rec || !rec.nome || !rec.phone) return null;
  const { nome, email, phone, countryPrefix, isCustom, isLocal, alreadyInFoz, alreadyInFozAt, wantsTransport, visitDate } = rec;
  const alreadyInFozFresh = alreadyInFozAt !== null && Date.now() - alreadyInFozAt <= ALREADY_IN_FOZ_TTL_MS;
  // `wantsTransport` sai sem checagem de validade de propósito — é estável como `isLocal`.
  // `visitDate` tem regra própria: some quando o dia JÁ PASSOU (ver o comentário do campo).
  const visitDateFresh = visitDate !== null && visitDate >= todayISO();
  return {
    nome, email, phone, countryPrefix, isCustom, isLocal,
    alreadyInFoz: alreadyInFozFresh ? alreadyInFoz : null,
    wantsTransport,
    visitDate: visitDateFresh ? visitDate : null,
  };
}

/** Grava/atualiza o contato+qualificação e registra a assinatura do produto enviado AGORA (chamar no envio
 * bem-sucedido) — `alreadyInFoz` sempre fica "fresco" no momento do envio (acabou de ser respondido agora). */
export function rememberKnownLead(contact: KnownLeadContact, signature: string, modalId: string): void {
  const now = Date.now();
  const prev = readRaw();
  const submissions = (prev?.submissions ?? []).filter((s) => s.signature !== signature);
  submissions.push({ signature, submittedAt: now, modalId });
  writeRaw({ ...contact, submissions: submissions.slice(-MAX_SUBMISSIONS), updatedAt: now, alreadyInFozAt: now });
}

/**
 * Última submissão dessa assinatura DENTRO da janela de dedup — `null` se nunca houve, ou se já passou da
 * janela (aí é um pedido novo do MESMO produto, tratado normalmente). Devolve o `modalId` original pra
 * reaproveitar no redirect de sucesso (ver TicketOfferModal.tsx / conventions §17).
 */
export function recentSubmissionOf(signature: string): { submittedAt: number; modalId: string } | null {
  const rec = readRaw();
  if (!rec) return null;
  const entry = rec.submissions.find((s) => s.signature === signature);
  if (!entry) return null;
  const withinWindow = Date.now() - entry.submittedAt <= LEAD_DEDUP_WINDOW_MIN * 60 * 1000;
  return withinWindow ? { submittedAt: entry.submittedAt, modalId: entry.modalId } : null;
}
