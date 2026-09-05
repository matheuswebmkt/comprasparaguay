// Filepath: lib/lead-alerts.ts
// Version: 1.0
// Nome da Versão: "Ping de 'alguém aguardando confirmação' no grupo da agência (Sprint 11)"
//
// Estado mínimo (app_settings, mesma tabela/padrão de lib/offer-settings.ts): guarda só o message_id
// do ping ATUALMENTE vivo no grupo, pra saber o que apagar antes de mandar um novo (nunca duplica) e
// pra apagar quando não sobrar mais nenhum lead pendente. Sem tabela nova, sem chat_id novo — reusa o
// `agency_chat_id` já configurado no admin (mesmo grupo dos leads).

import { getSql } from "./db";
import { getAgencyChatId } from "./offer-settings";

const KEY = "pending_alert_message_id";

/** Idade mínima (minutos) pra um lead sem resposta contar como "aguardando" — mesma régua usada tanto
 * pra DISPARAR o ping (cron) quanto pra APAGAR (webhook, ao confirmar/assumir o último atrasado). Um
 * lead recém-chegado (ainda dentro dessa janela) não impede o aviso de sumir.
 * ⚠️ No RG este valor está como `2`, marcado no próprio código como TEMP de teste — aqui entra direto
 * com o valor real (30). */
export const LEAD_ALERT_MIN = 30;

/**
 * Chat de destino do ping. Em DEV, se `TELEGRAM_TEST_CHAT_ID` estiver setado, usa ele em vez do grupo
 * real da agência — protege o grupo de produção de mensagens de teste (o banco é o mesmo entre local e
 * prod, então `countUnclaimedLeads`/`countOverdueLeads` refletem dados reais mesmo testando local; só o
 * DESTINO da mensagem muda). Guardado por `NODE_ENV !== "production"` — nunca entra em ação no deploy real.
 */
export async function resolveAlertChatId(): Promise<string | null> {
  const testChat = process.env.TELEGRAM_TEST_CHAT_ID;
  if (process.env.NODE_ENV !== "production" && testChat) return testChat;
  return getAgencyChatId();
}

export async function getPendingAlertMessageId(): Promise<number | null> {
  const sql = getSql();
  if (!sql) return null;
  try {
    const rows = (await sql`select value from app_settings where key = ${KEY}`) as { value: string }[];
    const v = rows[0]?.value;
    return v ? Number(v) : null;
  } catch {
    return null;
  }
}

export async function setPendingAlertMessageId(id: number | null): Promise<void> {
  const sql = getSql();
  if (!sql) return;
  try {
    if (id == null) {
      await sql`delete from app_settings where key = ${KEY}`;
    } else {
      await sql`
        insert into app_settings (key, value, updated_at)
        values (${KEY}, ${String(id)}, now())
        on conflict (key) do update set value = ${String(id)}, updated_at = now()
      `;
    }
  } catch {
    /* nunca quebra o caller — pior caso, um ping fica duplicado até o próximo ciclo */
  }
}

/** Quantos leads foram roteados pra AGÊNCIA E geraram mensagem DE VERDADE no Telegram, ainda sem
 * `claimed_at`, há mais de `minutes` minutos (candidatos ao ping — e, quando chega a 0, o gatilho pra
 * apagar o aviso). DOIS filtros CRÍTICOS, cada um cobrindo um caso real:
 * 1) `assigned_partner is not null` — sem ele, leads que nunca foram roteados a nenhuma agência (sem
 *    `agency_chat_id`/agência ativa configurados na época, etc.) ficam pra sempre "sem resposta" no banco,
 *    mas não existe nada pra confirmar em lugar nenhum. Também exclui de propósito os cards do modo SÓ
 *    INFO (Sprint 5) — `assigned_partner` é null lá (proxy documentado em app/api/leads/route.ts): sem
 *    plano vigente ninguém tem como assumir, então não faz sentido cobrar resposta.
 * 2) `telegram_message_id is not null` — cobre o caso do LEAD DUPLICADO reconciliado (Sprint 6): o lead
 *    SUPERADO tem o `telegram_message_id` zerado de propósito (migrou pro lead novo) — sem essa 2ª
 *    checagem, ele ficaria contando como atrasado pra sempre, sem card nenhum em lugar nenhum pra
 *    confirmar (só o lead que HERDOU o card, com `telegram_message_id` preenchido, é real). */
export async function countOverdueLeads(minutes: number): Promise<number> {
  const sql = getSql();
  if (!sql) return 0;
  try {
    const rows = (await sql`
      select count(*)::int as n from leads
      where abandoned = false and claimed_at is null
        and assigned_partner is not null and telegram_message_id is not null
        and created_at < now() - make_interval(mins => ${minutes})
    `) as { n: number }[];
    return rows[0]?.n ?? 0;
  } catch {
    return 0;
  }
}

export interface OverdueLead {
  nome: string;
  waitSeconds: number; // now() − created_at, em segundos
}

/** Nome + tempo de espera de cada lead atrasado (mesmos filtros de `countOverdueLeads`, mais antigo
 * primeiro) — alimenta o ping do cron com a lista de quem está pendente, em vez de uma mensagem genérica. */
export async function getOverdueLeads(minutes: number): Promise<OverdueLead[]> {
  const sql = getSql();
  if (!sql) return [];
  try {
    const rows = (await sql`
      select nome, extract(epoch from (now() - created_at))::int as wait_seconds
      from leads
      where abandoned = false and claimed_at is null
        and assigned_partner is not null and telegram_message_id is not null
        and created_at < now() - make_interval(mins => ${minutes})
      order by created_at asc
    `) as { nome: string | null; wait_seconds: number }[];
    return rows.map((r) => ({ nome: (r.nome ?? "").trim() || "Sem nome", waitSeconds: r.wait_seconds }));
  } catch {
    return [];
  }
}
