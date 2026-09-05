// Filepath: lib/plan-periods.ts
// Version: 3.0
// Nome da Versão: "Pausa (relógio congelado) + notas de período (shared/admin) + notas internas da entidade"
//
// ⭐ Hierarquia: plano vigente (period_end + grace_days > now, e NÃO pausado) → Ativar/nichos no site.
// Carência e pausa sem cron: avaliadas em tempo de leitura.

import { unstable_cache } from "next/cache";
import { getSql } from "./db";
import { activePartners } from "@/app/data/partners";
import { seedableAgencies } from "@/app/data/agencies";

export type PlanEntityType = "partner" | "agency";
export type PlanEventType = "start" | "renew" | "interrupt_grace" | "pause" | "resume";
/** grace = após o vencimento, ainda no site pela carência. paused = relógio congelado, fora do site. */
export type PlanStatus = "none" | "active" | "expiring" | "grace" | "paused" | "expired";
/** shared = admin + parceiro; admin = só admin. */
export type NoteVisibility = "shared" | "admin";

export const PLAN_DEFAULT_DAYS = 30;
export const PLAN_EXPIRING_DAYS = 7;
export const PLAN_PERIODS_TAG = "plan-periods";

export interface PlanTemplate {
  slug: string;
  name: string;
  description: string | null;
  defaultDays: number;
  defaultAmountCents: number | null; // null = sem preço padrão
  defaultGraceDays: number; // 0 = some no vencimento; 7 = +7 dias no site
  active: boolean;
  createdAt: string | null;
}

export interface PlanPeriod {
  entityType: PlanEntityType;
  entitySlug: string;
  templateSlug: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  amountCents: number | null;
  graceDays: number;
  notes: string | null; // legado (uma string); preferir plan_period_notes
  pausedAt: string | null;
  updatedAt: string | null;
}

export interface PlanEvent {
  id: number;
  entityType: PlanEntityType;
  entitySlug: string;
  eventType: PlanEventType;
  templateSlug: string | null;
  periodStart: string;
  periodEnd: string;
  amountCents: number | null;
  graceDays: number;
  note: string | null;
  createdBy: string | null;
  createdAt: string;
}

/** Observação ligada ao ciclo (period_start). */
export interface PlanPeriodNote {
  id: number;
  entityType: PlanEntityType;
  entitySlug: string;
  periodStart: string;
  body: string;
  visibility: NoteVisibility;
  createdBy: string | null;
  createdAt: string;
}

/** Nota interna da entidade (não depende do ciclo de plano). Só admin. */
export interface PlanEntityNote {
  id: number;
  entityType: PlanEntityType;
  entitySlug: string;
  body: string;
  createdBy: string | null;
  createdAt: string;
}

export interface PlanRow {
  entityType: PlanEntityType;
  entitySlug: string;
  entityName: string;
  templateSlug: string | null;
  templateName: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  amountCents: number | null;
  graceDays: number;
  notes: string | null;
  pausedAt: string | null;
  daysRemaining: number | null; // até period_end (congelado se paused)
  daysUntilGone: number | null; // até period_end + grace
  status: PlanStatus;
  updatedAt: string | null;
}

type Sql = NonNullable<ReturnType<typeof getSql>>;

// `ensure()` roda ~20 statements DDL sequenciais (cada um = 1 round-trip HTTP ao Neon). Sem essa trava, ele
// rodava em TODA chamada de `getPlanPeriod`/`isPlanCurrentlyActive` — inclusive dentro de
// `getActiveAgencySlug`/`getActiveHotelSlug`, no caminho quente do `/api/leads` (via `getOfferConfig`),
// deixando o submit do modal lento. As tabelas já existem (idempotente/migrado) — memoiza por instância
// (processo) pra rodar 1× por cold start; se falhar no meio, `ensured` continua false e a próxima chamada
// tenta de novo.
let ensured = false;


async function ensure(sql: Sql) {
  if (ensured) return;
  await sql`
    CREATE TABLE IF NOT EXISTS plan_templates (
      slug                  TEXT PRIMARY KEY,
      name                  TEXT NOT NULL,
      description           TEXT,
      default_days          INT NOT NULL DEFAULT 30,
      default_amount_cents  INT,
      default_grace_days    INT NOT NULL DEFAULT 0,
      active                BOOLEAN NOT NULL DEFAULT true,
      created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS plan_entities (
      entity_type   TEXT NOT NULL,
      entity_slug   TEXT NOT NULL,
      template_slug TEXT,
      period_start  TIMESTAMPTZ,
      period_end    TIMESTAMPTZ,
      amount_cents  INT,
      grace_days    INT NOT NULL DEFAULT 0,
      notes         TEXT,
      updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (entity_type, entity_slug)
    )
  `;
  // Migrações idempotentes se a tabela já existia na v1:
  await sql`ALTER TABLE plan_entities ADD COLUMN IF NOT EXISTS template_slug TEXT`;
  await sql`ALTER TABLE plan_entities ADD COLUMN IF NOT EXISTS amount_cents INT`;
  await sql`ALTER TABLE plan_entities ADD COLUMN IF NOT EXISTS grace_days INT NOT NULL DEFAULT 0`;
  await sql`ALTER TABLE plan_entities ADD COLUMN IF NOT EXISTS notes TEXT`;
  await sql`ALTER TABLE plan_entities ADD COLUMN IF NOT EXISTS paused_at TIMESTAMPTZ`;

  await sql`
    CREATE TABLE IF NOT EXISTS plan_period_events (
      id            BIGSERIAL PRIMARY KEY,
      entity_type   TEXT NOT NULL,
      entity_slug   TEXT NOT NULL,
      event_type    TEXT NOT NULL,
      template_slug TEXT,
      period_start  TIMESTAMPTZ NOT NULL,
      period_end    TIMESTAMPTZ NOT NULL,
      amount_cents  INT,
      grace_days    INT NOT NULL DEFAULT 0,
      note          TEXT,
      created_by    TEXT,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE plan_period_events ADD COLUMN IF NOT EXISTS template_slug TEXT`;
  await sql`ALTER TABLE plan_period_events ADD COLUMN IF NOT EXISTS amount_cents INT`;
  await sql`ALTER TABLE plan_period_events ADD COLUMN IF NOT EXISTS grace_days INT NOT NULL DEFAULT 0`;

  // Observações do ciclo (várias; shared = parceiro vê, admin = só admin)
  await sql`
    CREATE TABLE IF NOT EXISTS plan_period_notes (
      id            BIGSERIAL PRIMARY KEY,
      entity_type   TEXT NOT NULL,
      entity_slug   TEXT NOT NULL,
      period_start  TIMESTAMPTZ NOT NULL,
      body          TEXT NOT NULL,
      visibility    TEXT NOT NULL DEFAULT 'shared',
      created_by    TEXT,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS plan_period_notes_entity_idx
    ON plan_period_notes (entity_type, entity_slug, period_start DESC, created_at DESC)`;

  // Notas internas da entidade (independentes do ciclo) — só admin
  await sql`
    CREATE TABLE IF NOT EXISTS plan_entity_notes (
      id            BIGSERIAL PRIMARY KEY,
      entity_type   TEXT NOT NULL,
      entity_slug   TEXT NOT NULL,
      body          TEXT NOT NULL,
      created_by    TEXT,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS plan_entity_notes_entity_idx
    ON plan_entity_notes (entity_type, entity_slug, created_at DESC)`;

  await sql`CREATE INDEX IF NOT EXISTS plan_period_events_entity_idx ON plan_period_events (entity_type, entity_slug, created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS plan_entities_end_idx ON plan_entities (period_end)`;

  // Seed: um plano padrão mensal (idempotente)
  await sql`
    INSERT INTO plan_templates (slug, name, description, default_days, default_amount_cents, default_grace_days, active)
    VALUES (
      'mensal-padrao',
      'Mensal padrão',
      'Ciclo de 30 dias. Carência 0 = some do site no vencimento.',
      30, NULL, 0, true
    )
    ON CONFLICT (slug) DO NOTHING
  `;
  ensured = true;
}

export function formatBrl(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return "—";
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Converte string "199,90" ou "199.90" ou "199" → centavos. */
export function parseBrlToCents(input: string): number | null {
  const t = input.trim().replace(/\s/g, "");
  if (!t) return null;
  // 1.234,56 ou 1234,56 ou 1234.56
  let n: number;
  if (t.includes(",")) {
    n = Number(t.replace(/\./g, "").replace(",", "."));
  } else {
    n = Number(t);
  }
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100);
}

export function listCatalogEntities(): { entityType: PlanEntityType; entitySlug: string; entityName: string }[] {
  const out: { entityType: PlanEntityType; entitySlug: string; entityName: string }[] = [];
  for (const p of activePartners) out.push({ entityType: "partner", entitySlug: p.slug, entityName: p.name });
  for (const a of seedableAgencies()) out.push({ entityType: "agency", entitySlug: a.slug, entityName: a.name });
  return out;
}

function visibilityEnd(periodEnd: Date, graceDays: number): Date {
  return new Date(periodEnd.getTime() + Math.max(0, graceDays) * 86_400_000);
}

function computeStatus(
  periodEnd: Date | null,
  graceDays: number,
  pausedAt: Date | null = null,
): {
  status: PlanStatus;
  daysRemaining: number | null;
  daysUntilGone: number | null;
} {
  if (!periodEnd) return { status: "none", daysRemaining: null, daysUntilGone: null };
  const msDay = 86_400_000;
  const end = periodEnd.getTime();
  const gone = visibilityEnd(periodEnd, graceDays).getTime();

  // Pausa: relógio congelado no instante paused_at (fora do site).
  if (pausedAt) {
    const ref = pausedAt.getTime();
    return {
      status: "paused",
      daysRemaining: Math.ceil((end - ref) / msDay),
      daysUntilGone: Math.ceil((gone - ref) / msDay),
    };
  }

  const now = Date.now();
  const daysRemaining = Math.ceil((end - now) / msDay);
  const daysUntilGone = Math.ceil((gone - now) / msDay);

  if (now > gone) return { status: "expired", daysRemaining, daysUntilGone };
  if (now > end) return { status: "grace", daysRemaining, daysUntilGone };
  if (daysRemaining <= PLAN_EXPIRING_DAYS) return { status: "expiring", daysRemaining, daysUntilGone };
  return { status: "active", daysRemaining, daysUntilGone };
}

// ------------------------------------------------------------------ Templates

export async function listPlanTemplates(includeInactive = true): Promise<PlanTemplate[]> {
  const sql = getSql();
  if (!sql) return [];
  try {
    await ensure(sql);
    // Evita fragmento SQL vazio (neon): sempre lista e filtra em JS se preciso
    const rows = (await sql`
      SELECT slug, name, description, default_days, default_amount_cents, default_grace_days, active,
             to_char(created_at at time zone 'America/Sao_Paulo', 'DD/MM/YYYY') as created_at
      FROM plan_templates
      ORDER BY name
    `) as {
      slug: string; name: string; description: string | null; default_days: number;
      default_amount_cents: number | null; default_grace_days: number; active: boolean; created_at: string;
    }[];
    const mapped = rows.map((r) => ({
      slug: r.slug,
      name: r.name,
      description: r.description,
      defaultDays: r.default_days,
      defaultAmountCents: r.default_amount_cents,
      defaultGraceDays: r.default_grace_days ?? 0,
      active: r.active,
      createdAt: r.created_at,
    }));
    return includeInactive ? mapped : mapped.filter((t) => t.active);
  } catch {
    return [];
  }
}

export async function listActivePlanTemplates(): Promise<PlanTemplate[]> {
  const sql = getSql();
  if (!sql) return [];
  try {
    await ensure(sql);
    const rows = (await sql`
      SELECT slug, name, description, default_days, default_amount_cents, default_grace_days, active,
             to_char(created_at at time zone 'America/Sao_Paulo', 'DD/MM/YYYY') as created_at
      FROM plan_templates WHERE active = true ORDER BY name
    `) as {
      slug: string; name: string; description: string | null; default_days: number;
      default_amount_cents: number | null; default_grace_days: number; active: boolean; created_at: string;
    }[];
    return rows.map((r) => ({
      slug: r.slug,
      name: r.name,
      description: r.description,
      defaultDays: r.default_days,
      defaultAmountCents: r.default_amount_cents,
      defaultGraceDays: r.default_grace_days ?? 0,
      active: r.active,
      createdAt: r.created_at,
    }));
  } catch {
    return [];
  }
}

export async function getPlanTemplate(slug: string): Promise<PlanTemplate | null> {
  const list = await listPlanTemplates(true);
  return list.find((t) => t.slug === slug) ?? null;
}

export async function upsertPlanTemplate(input: {
  slug: string;
  name: string;
  description?: string | null;
  defaultDays?: number;
  defaultAmountCents?: number | null;
  defaultGraceDays?: number;
  active?: boolean;
}): Promise<PlanTemplate> {
  const sql = getSql();
  if (!sql) throw new Error("DB not configured");
  const slug = input.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "").slice(0, 64);
  if (!slug) throw new Error("invalid slug");
  const name = input.name.trim().slice(0, 120);
  if (!name) throw new Error("invalid name");
  const description = (input.description ?? "").trim().slice(0, 500) || null;
  const defaultDays = Math.min(366, Math.max(1, input.defaultDays ?? PLAN_DEFAULT_DAYS));
  const defaultGraceDays = Math.min(90, Math.max(0, input.defaultGraceDays ?? 0));
  const defaultAmountCents =
    input.defaultAmountCents === undefined || input.defaultAmountCents === null
      ? null
      : Math.max(0, Math.round(input.defaultAmountCents));
  const active = input.active !== false;

  await ensure(sql);
  await sql`
    INSERT INTO plan_templates (slug, name, description, default_days, default_amount_cents, default_grace_days, active)
    VALUES (${slug}, ${name}, ${description}, ${defaultDays}, ${defaultAmountCents}, ${defaultGraceDays}, ${active})
    ON CONFLICT (slug) DO UPDATE SET
      name = ${name},
      description = ${description},
      default_days = ${defaultDays},
      default_amount_cents = ${defaultAmountCents},
      default_grace_days = ${defaultGraceDays},
      active = ${active}
  `;
  const t = await getPlanTemplate(slug);
  if (!t) throw new Error("template save failed");
  return t;
}

// ------------------------------------------------------------------ Períodos

export async function getPlanPeriod(entityType: PlanEntityType, entitySlug: string): Promise<PlanPeriod | null> {
  const sql = getSql();
  if (!sql) return null;
  try {
    await ensure(sql);
    const rows = (await sql`
      SELECT entity_type, entity_slug, template_slug,
             period_start::text as period_start, period_end::text as period_end,
             amount_cents, grace_days, notes, paused_at::text as paused_at,
             updated_at::text as updated_at
      FROM plan_entities
      WHERE entity_type = ${entityType} AND entity_slug = ${entitySlug}
    `) as {
      entity_type: PlanEntityType; entity_slug: string; template_slug: string | null;
      period_start: string | null; period_end: string | null;
      amount_cents: number | null; grace_days: number; notes: string | null;
      paused_at: string | null; updated_at: string | null;
    }[];
    const r = rows[0];
    if (!r) return null;
    return {
      entityType: r.entity_type,
      entitySlug: r.entity_slug,
      templateSlug: r.template_slug,
      periodStart: r.period_start,
      periodEnd: r.period_end,
      amountCents: r.amount_cents,
      graceDays: r.grace_days ?? 0,
      notes: r.notes,
      pausedAt: r.paused_at,
      updatedAt: r.updated_at,
    };
  } catch {
    return null;
  }
}

// Cache do PERÍODO BRUTO (period_end/grace_days/paused_at) — sem `revalidate` por tempo: só muda quando o
// admin edita o plano, e toda rota de edição (start/renew/pause/resume/plan-period) já chama
// `revalidateTag(PLAN_PERIODS_TAG)` na hora. A checagem "está dentro do prazo AGORA?" nunca é cacheada —
// roda em JS puro (`visibilityEnd(...).getTime() > Date.now()`) a cada chamada, então nunca fica stale
// mesmo sem nenhum timer: o vencimento por passagem do tempo é detectado no primeiro acesso após o prazo
// virar, sem precisar de query nova (ver conventions §13-ter).
const getPlanPeriodCached = unstable_cache(
  (entityType: PlanEntityType, entitySlug: string) => getPlanPeriod(entityType, entitySlug),
  ["plan-period"],
  { tags: [PLAN_PERIODS_TAG] },
);

/** Visível no site se não pausado e period_end + grace_days > now (sem cron). */
export async function isPlanCurrentlyActive(entityType: PlanEntityType, entitySlug: string): Promise<boolean> {
  const p = await getPlanPeriodCached(entityType, entitySlug);
  if (!p?.periodEnd || p.pausedAt) return false;
  const end = new Date(p.periodEnd);
  return visibilityEnd(end, p.graceDays ?? 0).getTime() > Date.now();
}

export async function getActivePlanSlugs(entityType: PlanEntityType): Promise<Set<string>> {
  const sql = getSql();
  if (!sql) return new Set();
  try {
    await ensure(sql);
    const rows = (await sql`
      SELECT entity_slug FROM plan_entities
      WHERE entity_type = ${entityType}
        AND period_end IS NOT NULL
        AND paused_at IS NULL
        AND (period_end + (COALESCE(grace_days, 0) * INTERVAL '1 day')) > NOW()
    `) as { entity_slug: string }[];
    return new Set(rows.map((r) => r.entity_slug));
  } catch {
    return new Set();
  }
}

/** Linhas BRUTAS de plano de um tipo de entidade (sem filtrar por NOW()) — usado só pela versão cacheada abaixo. */
async function getPlanRowsRaw(
  entityType: PlanEntityType,
): Promise<{ entitySlug: string; periodEnd: string | null; graceDays: number; pausedAt: string | null }[]> {
  const sql = getSql();
  if (!sql) return [];
  try {
    await ensure(sql);
    const rows = (await sql`
      SELECT entity_slug, period_end::text as period_end, grace_days, paused_at::text as paused_at
      FROM plan_entities
      WHERE entity_type = ${entityType}
    `) as { entity_slug: string; period_end: string | null; grace_days: number; paused_at: string | null }[];
    return rows.map((r) => ({
      entitySlug: r.entity_slug,
      periodEnd: r.period_end,
      graceDays: r.grace_days ?? 0,
      pausedAt: r.paused_at,
    }));
  } catch {
    return [];
  }
}

// Cache do dado BRUTO de todas as entidades do tipo (sem filtrar por NOW() no SQL, sem `revalidate` por
// tempo) — o filtro "vigente agora" roda em JS a cada chamada, fora do cache. Corrige bug real (jul/2026):
// antes cacheávamos `getActivePlanSlugs()` inteiro, que já filtrava
// `period_end + grace_days > NOW()` DENTRO da query SQL cacheada — um plano vencendo sozinho (sem NENHUMA
// ação no admin naquele dia) nunca invalidava o cache, então o parceiro/agência/hotel continuava aparecendo
// como vigente indefinidamente após o vencimento. `revalidateTag(PLAN_PERIODS_TAG)` (já disparado em toda
// rota de edição de plano) é o único gatilho que invalida esse cache — a parte manual.
const cachedPartnerPlanRows = unstable_cache(() => getPlanRowsRaw("partner"), ["plan-rows-partner"], { tags: [PLAN_PERIODS_TAG] });
const cachedAgencyPlanRows = unstable_cache(() => getPlanRowsRaw("agency"), ["plan-rows-agency"], { tags: [PLAN_PERIODS_TAG] });

export async function getActivePlanSlugsCached(entityType: PlanEntityType): Promise<Set<string>> {
  const rows =
    entityType === "partner" ? await cachedPartnerPlanRows()
    : await cachedAgencyPlanRows();
  const now = Date.now();
  const out = new Set<string>();
  for (const r of rows) {
    if (!r.periodEnd || r.pausedAt) continue;
    if (visibilityEnd(new Date(r.periodEnd), r.graceDays).getTime() > now) out.add(r.entitySlug);
  }
  return out;
}

/**
 * Inicia ou renova. Confirmação e campos (valor, plano, carência, obs) vêm do admin.
 * Recomeça a contagem a partir de agora + days.
 */
export async function startOrRenewPlan(opts: {
  entityType: PlanEntityType;
  entitySlug: string;
  templateSlug?: string | null;
  days?: number;
  amountCents?: number | null;
  graceDays?: number;
  note?: string | null;
  createdBy?: string | null;
}): Promise<PlanPeriod> {
  const sql = getSql();
  if (!sql) throw new Error("DB not configured");
  const { entityType, entitySlug } = opts;

  const known = listCatalogEntities().some((e) => e.entityType === entityType && e.entitySlug === entitySlug);
  if (!known) throw new Error("entity not found");

  await ensure(sql);

  let template: PlanTemplate | null = null;
  const tSlug = (opts.templateSlug ?? "").trim() || null;
  if (tSlug) {
    template = await getPlanTemplate(tSlug);
    if (!template || !template.active) throw new Error("template not found");
  }

  const days = Math.min(366, Math.max(1, opts.days ?? template?.defaultDays ?? PLAN_DEFAULT_DAYS));
  const graceDays = Math.min(90, Math.max(0, opts.graceDays ?? template?.defaultGraceDays ?? 0));
  const amountCents =
    opts.amountCents === undefined
      ? (template?.defaultAmountCents ?? null)
      : opts.amountCents === null
        ? null
        : Math.max(0, Math.round(opts.amountCents));
  const note = (opts.note ?? "").trim().slice(0, 500) || null;
  const createdBy = (opts.createdBy ?? "").trim().slice(0, 120) || null;

  const existing = await getPlanPeriod(entityType, entitySlug);
  const eventType: PlanEventType = existing?.periodStart ? "renew" : "start";

  const start = new Date();
  const end = new Date(start.getTime() + days * 86_400_000);

  await sql`
    INSERT INTO plan_entities (
      entity_type, entity_slug, template_slug, period_start, period_end,
      amount_cents, grace_days, notes, paused_at, updated_at
    )
    VALUES (
      ${entityType}, ${entitySlug}, ${tSlug}, ${start.toISOString()}, ${end.toISOString()},
      ${amountCents}, ${graceDays}, ${null}, ${null}, NOW()
    )
    ON CONFLICT (entity_type, entity_slug) DO UPDATE SET
      template_slug = ${tSlug},
      period_start = ${start.toISOString()},
      period_end = ${end.toISOString()},
      amount_cents = ${amountCents},
      grace_days = ${graceDays},
      paused_at = NULL,
      updated_at = NOW()
  `;
  await sql`
    INSERT INTO plan_period_events (
      entity_type, entity_slug, event_type, template_slug,
      period_start, period_end, amount_cents, grace_days, note, created_by
    )
    VALUES (
      ${entityType}, ${entitySlug}, ${eventType}, ${tSlug},
      ${start.toISOString()}, ${end.toISOString()}, ${amountCents}, ${graceDays}, ${note}, ${createdBy}
    )
  `;

  // Observação do ciclo (visível ao parceiro) se informada no início/renovação
  if (note) {
    await sql`
      INSERT INTO plan_period_notes (entity_type, entity_slug, period_start, body, visibility, created_by)
      VALUES (${entityType}, ${entitySlug}, ${start.toISOString()}, ${note}, ${"shared"}, ${createdBy})
    `;
  }

  return {
    entityType,
    entitySlug,
    templateSlug: tSlug,
    periodStart: start.toISOString(),
    periodEnd: end.toISOString(),
    amountCents,
    graceDays,
    notes: note,
    pausedAt: null,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Interrompe a carência agora: some do site imediatamente.
 * Só faz sentido com status "grace" (já venceu, ainda no prazo de graça).
 * Implementação: grace_days = 0 (period_end já está no passado → some na leitura).
 */
export async function interruptGraceNow(opts: {
  entityType: PlanEntityType;
  entitySlug: string;
  note?: string | null;
  createdBy?: string | null;
}): Promise<PlanPeriod> {
  const sql = getSql();
  if (!sql) throw new Error("DB not configured");
  const { entityType, entitySlug } = opts;

  await ensure(sql);
  const existing = await getPlanPeriod(entityType, entitySlug);
  if (!existing?.periodEnd) throw new Error("sem plano");

  if (existing.pausedAt) throw new Error("retome a pausa antes de interromper a carência");
  const st = computeStatus(new Date(existing.periodEnd), existing.graceDays ?? 0, null);
  if (st.status !== "grace") {
    throw new Error("só é possível interromper durante a carência");
  }

  const eventNote =
    (opts.note ?? "").trim().slice(0, 500) || "Carência interrompida manualmente";
  const createdBy = (opts.createdBy ?? "").trim().slice(0, 120) || null;
  const periodStart = existing.periodStart ?? existing.periodEnd;
  const periodEnd = existing.periodEnd;

  // grace_days = 0 com period_end no passado → some do site na próxima leitura (sem cron)
  await sql`
    UPDATE plan_entities
    SET grace_days = 0, updated_at = NOW()
    WHERE entity_type = ${entityType} AND entity_slug = ${entitySlug}
  `;
  await sql`
    INSERT INTO plan_period_events (
      entity_type, entity_slug, event_type, template_slug,
      period_start, period_end, amount_cents, grace_days, note, created_by
    )
    VALUES (
      ${entityType}, ${entitySlug}, ${"interrupt_grace"}, ${existing.templateSlug},
      ${periodStart}, ${periodEnd}, ${existing.amountCents}, ${0}, ${eventNote}, ${createdBy}
    )
  `;

  return {
    entityType,
    entitySlug,
    templateSlug: existing.templateSlug,
    periodStart: existing.periodStart,
    periodEnd: existing.periodEnd,
    amountCents: existing.amountCents,
    graceDays: 0,
    notes: existing.notes,
    pausedAt: existing.pausedAt,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Pausa o plano: some do site e congela o relógio (period_end deslocado na retomada).
 * Permitido em active | expiring | grace.
 */
export async function pausePlan(opts: {
  entityType: PlanEntityType;
  entitySlug: string;
  note?: string | null;
  createdBy?: string | null;
}): Promise<PlanPeriod> {
  const sql = getSql();
  if (!sql) throw new Error("DB not configured");
  const { entityType, entitySlug } = opts;

  await ensure(sql);
  const existing = await getPlanPeriod(entityType, entitySlug);
  if (!existing?.periodEnd) throw new Error("sem plano");
  if (existing.pausedAt) throw new Error("já está pausado");

  const st = computeStatus(new Date(existing.periodEnd), existing.graceDays ?? 0, null);
  if (st.status === "none" || st.status === "expired") {
    throw new Error("só é possível pausar plano ativo, vencendo ou em carência");
  }

  const eventNote = (opts.note ?? "").trim().slice(0, 500) || "Plano pausado";
  const createdBy = (opts.createdBy ?? "").trim().slice(0, 120) || null;
  const now = new Date();
  const periodStart = existing.periodStart ?? existing.periodEnd;

  await sql`
    UPDATE plan_entities
    SET paused_at = ${now.toISOString()}, updated_at = NOW()
    WHERE entity_type = ${entityType} AND entity_slug = ${entitySlug}
  `;
  await sql`
    INSERT INTO plan_period_events (
      entity_type, entity_slug, event_type, template_slug,
      period_start, period_end, amount_cents, grace_days, note, created_by
    )
    VALUES (
      ${entityType}, ${entitySlug}, ${"pause"}, ${existing.templateSlug},
      ${periodStart}, ${existing.periodEnd}, ${existing.amountCents}, ${existing.graceDays},
      ${eventNote}, ${createdBy}
    )
  `;

  return {
    ...existing,
    pausedAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
}

/**
 * Retoma após pausa: period_end += (now - paused_at) — preserva o tempo restante.
 */
export async function resumePlan(opts: {
  entityType: PlanEntityType;
  entitySlug: string;
  note?: string | null;
  createdBy?: string | null;
}): Promise<PlanPeriod> {
  const sql = getSql();
  if (!sql) throw new Error("DB not configured");
  const { entityType, entitySlug } = opts;

  await ensure(sql);
  const existing = await getPlanPeriod(entityType, entitySlug);
  if (!existing?.periodEnd || !existing.pausedAt) throw new Error("não está pausado");

  const pausedAt = new Date(existing.pausedAt);
  const periodEnd = new Date(existing.periodEnd);
  const deltaMs = Date.now() - pausedAt.getTime();
  const newEnd = new Date(periodEnd.getTime() + Math.max(0, deltaMs));
  const eventNote =
    (opts.note ?? "").trim().slice(0, 500) ||
    `Plano retomado (+${Math.round(deltaMs / 86_400_000)}d no prazo)`;
  const createdBy = (opts.createdBy ?? "").trim().slice(0, 120) || null;
  const periodStart = existing.periodStart ?? existing.periodEnd;

  await sql`
    UPDATE plan_entities
    SET period_end = ${newEnd.toISOString()},
        paused_at = NULL,
        updated_at = NOW()
    WHERE entity_type = ${entityType} AND entity_slug = ${entitySlug}
  `;
  await sql`
    INSERT INTO plan_period_events (
      entity_type, entity_slug, event_type, template_slug,
      period_start, period_end, amount_cents, grace_days, note, created_by
    )
    VALUES (
      ${entityType}, ${entitySlug}, ${"resume"}, ${existing.templateSlug},
      ${periodStart}, ${newEnd.toISOString()}, ${existing.amountCents}, ${existing.graceDays},
      ${eventNote}, ${createdBy}
    )
  `;

  return {
    ...existing,
    periodEnd: newEnd.toISOString(),
    pausedAt: null,
    updatedAt: new Date().toISOString(),
  };
}

// ------------------------------------------------------------------ Notas

export async function listPeriodNotes(
  entityType: PlanEntityType,
  entitySlug: string,
  opts?: { periodStart?: string | null; includeAdmin?: boolean },
): Promise<PlanPeriodNote[]> {
  const sql = getSql();
  if (!sql) return [];
  try {
    await ensure(sql);
    const periodStart = opts?.periodStart ?? null;
    const includeAdmin = opts?.includeAdmin !== false;
    const rows = (periodStart
      ? await sql`
          SELECT id, entity_type, entity_slug, period_start::text as period_start, body, visibility,
                 created_by,
                 to_char(created_at at time zone 'America/Sao_Paulo', 'DD/MM/YYYY HH24:MI') as created_at
          FROM plan_period_notes
          WHERE entity_type = ${entityType} AND entity_slug = ${entitySlug}
            AND period_start = ${periodStart}::timestamptz
          ORDER BY id DESC
        `
      : await sql`
          SELECT id, entity_type, entity_slug, period_start::text as period_start, body, visibility,
                 created_by,
                 to_char(created_at at time zone 'America/Sao_Paulo', 'DD/MM/YYYY HH24:MI') as created_at
          FROM plan_period_notes
          WHERE entity_type = ${entityType} AND entity_slug = ${entitySlug}
          ORDER BY id DESC
        `) as {
      id: number; entity_type: PlanEntityType; entity_slug: string; period_start: string;
      body: string; visibility: string; created_by: string | null; created_at: string;
    }[];
    return rows
      .filter((r) => includeAdmin || r.visibility === "shared")
      .map((r) => ({
        id: r.id,
        entityType: r.entity_type,
        entitySlug: r.entity_slug,
        periodStart: r.period_start,
        body: r.body,
        visibility: (r.visibility === "admin" ? "admin" : "shared") as NoteVisibility,
        createdBy: r.created_by,
        createdAt: r.created_at,
      }));
  } catch {
    return [];
  }
}

export async function addPeriodNote(opts: {
  entityType: PlanEntityType;
  entitySlug: string;
  body: string;
  visibility?: NoteVisibility;
  createdBy?: string | null;
}): Promise<PlanPeriodNote> {
  const sql = getSql();
  if (!sql) throw new Error("DB not configured");
  await ensure(sql);
  const period = await getPlanPeriod(opts.entityType, opts.entitySlug);
  if (!period?.periodStart) throw new Error("sem período vigente — inicie um plano primeiro");
  const body = opts.body.trim().slice(0, 2000);
  if (!body) throw new Error("texto vazio");
  const visibility: NoteVisibility = opts.visibility === "admin" ? "admin" : "shared";
  const createdBy = (opts.createdBy ?? "").trim().slice(0, 120) || null;

  const rows = (await sql`
    INSERT INTO plan_period_notes (entity_type, entity_slug, period_start, body, visibility, created_by)
    VALUES (
      ${opts.entityType}, ${opts.entitySlug}, ${period.periodStart},
      ${body}, ${visibility}, ${createdBy}
    )
    RETURNING id, entity_type, entity_slug, period_start::text as period_start, body, visibility,
              created_by,
              to_char(created_at at time zone 'America/Sao_Paulo', 'DD/MM/YYYY HH24:MI') as created_at
  `) as {
    id: number; entity_type: PlanEntityType; entity_slug: string; period_start: string;
    body: string; visibility: string; created_by: string | null; created_at: string;
  }[];
  const r = rows[0];
  if (!r) throw new Error("save failed");
  return {
    id: r.id,
    entityType: r.entity_type,
    entitySlug: r.entity_slug,
    periodStart: r.period_start,
    body: r.body,
    visibility: r.visibility === "admin" ? "admin" : "shared",
    createdBy: r.created_by,
    createdAt: r.created_at,
  };
}

export async function listEntityNotes(
  entityType: PlanEntityType,
  entitySlug: string,
): Promise<PlanEntityNote[]> {
  const sql = getSql();
  if (!sql) return [];
  try {
    await ensure(sql);
    const rows = (await sql`
      SELECT id, entity_type, entity_slug, body, created_by,
             to_char(created_at at time zone 'America/Sao_Paulo', 'DD/MM/YYYY HH24:MI') as created_at
      FROM plan_entity_notes
      WHERE entity_type = ${entityType} AND entity_slug = ${entitySlug}
      ORDER BY id DESC
    `) as {
      id: number; entity_type: PlanEntityType; entity_slug: string;
      body: string; created_by: string | null; created_at: string;
    }[];
    return rows.map((r) => ({
      id: r.id,
      entityType: r.entity_type,
      entitySlug: r.entity_slug,
      body: r.body,
      createdBy: r.created_by,
      createdAt: r.created_at,
    }));
  } catch {
    return [];
  }
}

export async function addEntityNote(opts: {
  entityType: PlanEntityType;
  entitySlug: string;
  body: string;
  createdBy?: string | null;
}): Promise<PlanEntityNote> {
  const sql = getSql();
  if (!sql) throw new Error("DB not configured");
  const known = listCatalogEntities().some(
    (e) => e.entityType === opts.entityType && e.entitySlug === opts.entitySlug,
  );
  if (!known) throw new Error("entity not found");
  await ensure(sql);
  const body = opts.body.trim().slice(0, 2000);
  if (!body) throw new Error("texto vazio");
  const createdBy = (opts.createdBy ?? "").trim().slice(0, 120) || null;

  const rows = (await sql`
    INSERT INTO plan_entity_notes (entity_type, entity_slug, body, created_by)
    VALUES (${opts.entityType}, ${opts.entitySlug}, ${body}, ${createdBy})
    RETURNING id, entity_type, entity_slug, body, created_by,
              to_char(created_at at time zone 'America/Sao_Paulo', 'DD/MM/YYYY HH24:MI') as created_at
  `) as {
    id: number; entity_type: PlanEntityType; entity_slug: string;
    body: string; created_by: string | null; created_at: string;
  }[];
  const r = rows[0];
  if (!r) throw new Error("save failed");
  return {
    id: r.id,
    entityType: r.entity_type,
    entitySlug: r.entity_slug,
    body: r.body,
    createdBy: r.created_by,
    createdAt: r.created_at,
  };
}

export async function getPlanHistory(
  entityType: PlanEntityType,
  entitySlug: string,
  limit = 50,
): Promise<PlanEvent[]> {
  const sql = getSql();
  if (!sql) return [];
  try {
    await ensure(sql);
    const rows = (await sql`
      SELECT id, entity_type, entity_slug, event_type, template_slug,
             period_start::text as period_start, period_end::text as period_end,
             amount_cents, grace_days, note, created_by,
             to_char(created_at at time zone 'America/Sao_Paulo', 'DD/MM/YYYY HH24:MI') as created_at
      FROM plan_period_events
      WHERE entity_type = ${entityType} AND entity_slug = ${entitySlug}
      ORDER BY id DESC
      LIMIT ${limit}
    `) as {
      id: number; entity_type: PlanEntityType; entity_slug: string; event_type: PlanEventType;
      template_slug: string | null; period_start: string; period_end: string;
      amount_cents: number | null; grace_days: number; note: string | null;
      created_by: string | null; created_at: string;
    }[];
    return rows.map((r) => ({
      id: r.id,
      entityType: r.entity_type,
      entitySlug: r.entity_slug,
      eventType: r.event_type,
      templateSlug: r.template_slug,
      periodStart: r.period_start,
      periodEnd: r.period_end,
      amountCents: r.amount_cents,
      graceDays: r.grace_days ?? 0,
      note: r.note,
      createdBy: r.created_by,
      createdAt: r.created_at,
    }));
  } catch {
    return [];
  }
}

export async function listPlanDashboard(): Promise<PlanRow[]> {
  const catalog = listCatalogEntities();
  const templates = await listPlanTemplates(true);
  const tName = new Map(templates.map((t) => [t.slug, t.name]));
  const sql = getSql();
  const byKey = new Map<string, {
    templateSlug: string | null;
    periodStart: string | null;
    periodEnd: string | null;
    amountCents: number | null;
    graceDays: number;
    notes: string | null;
    pausedAt: string | null;
    updatedAt: string | null;
  }>();

  if (sql) {
    try {
      await ensure(sql);
      const rows = (await sql`
        SELECT entity_type, entity_slug, template_slug,
               period_start::text as period_start, period_end::text as period_end,
               amount_cents, grace_days, notes, paused_at::text as paused_at,
               updated_at::text as updated_at
        FROM plan_entities
      `) as {
        entity_type: string; entity_slug: string; template_slug: string | null;
        period_start: string | null; period_end: string | null;
        amount_cents: number | null; grace_days: number; notes: string | null;
        paused_at: string | null; updated_at: string | null;
      }[];
      for (const r of rows) {
        byKey.set(`${r.entity_type}:${r.entity_slug}`, {
          templateSlug: r.template_slug,
          periodStart: r.period_start,
          periodEnd: r.period_end,
          amountCents: r.amount_cents,
          graceDays: r.grace_days ?? 0,
          notes: r.notes,
          pausedAt: r.paused_at,
          updatedAt: r.updated_at,
        });
      }
    } catch { /* empty */ }
  }

  return catalog.map((e) => {
    const p = byKey.get(`${e.entityType}:${e.entitySlug}`);
    const end = p?.periodEnd ? new Date(p.periodEnd) : null;
    const grace = p?.graceDays ?? 0;
    const paused = p?.pausedAt ? new Date(p.pausedAt) : null;
    const st = computeStatus(end, grace, paused);
    return {
      entityType: e.entityType,
      entitySlug: e.entitySlug,
      entityName: e.entityName,
      templateSlug: p?.templateSlug ?? null,
      templateName: p?.templateSlug ? (tName.get(p.templateSlug) ?? p.templateSlug) : null,
      periodStart: p?.periodStart ?? null,
      periodEnd: p?.periodEnd ?? null,
      amountCents: p?.amountCents ?? null,
      graceDays: grace,
      notes: p?.notes ?? null,
      pausedAt: p?.pausedAt ?? null,
      daysRemaining: st.daysRemaining,
      daysUntilGone: st.daysUntilGone,
      status: st.status,
      updatedAt: p?.updatedAt ?? null,
    };
  }).sort((a, b) => {
    const rank: Record<PlanStatus, number> = {
      grace: 0, expiring: 1, paused: 2, expired: 3, active: 4, none: 5,
    };
    if (rank[a.status] !== rank[b.status]) return rank[a.status] - rank[b.status];
    const da = a.daysUntilGone ?? a.daysRemaining ?? 9999;
    const db = b.daysUntilGone ?? b.daysRemaining ?? 9999;
    if (da !== db) return da - db;
    return a.entityName.localeCompare(b.entityName, "pt");
  });
}
