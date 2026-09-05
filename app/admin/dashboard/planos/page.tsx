// Filepath: app/admin/dashboard/planos/page.tsx
// Version: 2.0
// Nome da Versão: "Planos + templates + valor + carência + confirmação (topo da hierarquia)"
//
// Controle manual do ciclo (sem Stripe). Independente de Ativar/Desativar e de /nichos.
// Carência avaliada em tempo de leitura — sem cron.

import Link from "next/link";
import { cookies } from "next/headers";
import {
  CalendarClock, LogOut, ArrowLeft, Inbox, Building2, Store, SlidersHorizontal, AlertTriangle,
} from "lucide-react";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import {
  listPlanDashboard,
  listPlanTemplates,
  getPlanHistory,
  listPeriodNotes,
  listEntityNotes,
  formatBrl,
  PLAN_DEFAULT_DAYS,
  PLAN_EXPIRING_DAYS,
  type PlanRow,
  type PlanStatus,
} from "@/lib/plan-periods";
import { TITLE, MUTED, BORDER } from "@/components/admin/dashboard-ui";
import RefreshButton from "@/components/admin/RefreshButton";
import PlanPeriodControl from "@/components/admin/PlanPeriodControl";
import PlanTemplateManager from "@/components/admin/PlanTemplateManager";
import PortalAccessControl from "@/components/admin/PortalAccessControl";
import PlanNotesPanel from "@/components/admin/PlanNotesPanel";
import { listPortalAccounts } from "@/lib/portal-auth";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<PlanStatus, string> = {
  none: "Sem plano",
  active: "Ativo",
  expiring: "Vencendo",
  grace: "Carência",
  paused: "Pausado",
  expired: "Expirado",
};

function statusStyle(s: PlanStatus): React.CSSProperties {
  if (s === "active") return { color: "hsl(152,47%,28%)", background: "hsl(152,40%,93%)" };
  if (s === "expiring") return { color: "hsl(35,82%,30%)", background: "hsl(40,90%,93%)" };
  if (s === "grace") return { color: "hsl(280,45%,35%)", background: "hsl(280,50%,95%)" };
  if (s === "paused") return { color: "hsl(210,40%,30%)", background: "hsl(214,30%,92%)" };
  if (s === "expired") return { color: "hsl(0,60%,40%)", background: "hsl(0,70%,96%)" };
  return { color: "hsl(210,25%,40%)", background: "hsl(214,30%,95%)" };
}

function typeLabel(t: PlanRow["entityType"]) {
  if (t === "partner") return "Parceiro";
  return "Agência";
}

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function Progress({
  daysRemaining,
  daysUntilGone,
  status,
}: {
  daysRemaining: number | null;
  daysUntilGone: number | null;
  status: PlanStatus;
}) {
  if (status === "none" || daysRemaining === null) {
    return (
      <div className="h-2 rounded-full w-full" style={{ background: "hsl(214,25%,90%)" }} title="Sem plano" />
    );
  }
  // Em carência, usa dias até sumir do site; senão, dias até o vencimento
  const ref = status === "grace" || status === "expired"
    ? (daysUntilGone ?? daysRemaining)
    : daysRemaining;
  const pct = status === "expired"
    ? 0
    : Math.max(0, Math.min(100, Math.round((Math.max(0, ref) / PLAN_DEFAULT_DAYS) * 100)));
  const color =
    status === "paused" ? "hsl(210,30%,50%)" :
    status === "grace" ? "hsl(280,45%,50%)" :
    status === "expiring" ? "hsl(35,82%,47%)" :
    status === "expired" ? "hsl(0,60%,50%)" :
    "hsl(152,47%,40%)";
  return (
    <div className="h-2 rounded-full w-full overflow-hidden" style={{ background: "hsl(214,25%,90%)" }}>
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export default async function PlanosPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; slug?: string }>;
}) {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const secret = process.env.AUTH_SECRET;
  const email = token && secret ? await verifySessionToken(token, secret) : null;

  const sp = await searchParams;
  const filterType = sp.type === "partner" || sp.type === "agency" ? sp.type : null;
  const detailSlug = typeof sp.slug === "string" ? sp.slug : null;

  const [rows, templates, portalAccounts] = await Promise.all([
    listPlanDashboard(),
    listPlanTemplates(true),
    listPortalAccounts(),
  ]);
  const portalByKey = new Map(
    portalAccounts.map((a) => [`${a.entityType}:${a.entitySlug}`, a] as const),
  );
  const filtered = filterType ? rows.filter((r) => r.entityType === filterType) : rows;

  const expiring = rows.filter((r) => r.status === "expiring");
  const grace = rows.filter((r) => r.status === "grace");
  const expired = rows.filter((r) => r.status === "expired");
  const active = rows.filter((r) => r.status === "active");
  const none = rows.filter((r) => r.status === "none");

  const detail = detailSlug && filterType
    ? rows.find((r) => r.entityType === filterType && r.entitySlug === detailSlug) ?? null
    : null;
  const history = detail
    ? await getPlanHistory(detail.entityType, detail.entitySlug, 40)
    : [];
  const periodNotes = detail
    ? await listPeriodNotes(detail.entityType, detail.entitySlug, {
        periodStart: detail.periodStart,
        includeAdmin: true,
      })
    : [];
  const entityNotes = detail
    ? await listEntityNotes(detail.entityType, detail.entitySlug)
    : [];

  const HeaderLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-[1.03]"
      style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)" }}
    >
      {icon}{label}
    </Link>
  );

  const Filter = ({ href, label, count, on }: { href: string; label: string; count: number; on: boolean }) => (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors"
      style={on
        ? { background: "hsl(210,60%,15%)", color: "white", borderColor: "hsl(210,60%,15%)" }
        : { background: "white", color: "hsl(210,25%,40%)", borderColor: "hsl(214,25%,88%)" }}
    >
      {label} <span className="opacity-80">({count})</span>
    </Link>
  );

  return (
    <main className="min-h-screen" style={{ background: "hsl(40,33%,97%)" }}>
      <header className="px-6 py-4 flex items-center justify-between flex-wrap gap-2" style={{ background: "hsl(210,60%,15%)" }}>
        <div className="flex items-center gap-2.5 text-white">
          <CalendarClock className="h-5 w-5" style={{ color: "hsl(38,90%,55%)" }} aria-hidden="true" />
          <span className="font-bold text-sm">Planos · Compras Paraguay</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <HeaderLink href="/admin/dashboard" icon={<ArrowLeft className="h-3.5 w-3.5" />} label="Métricas" />
          <HeaderLink href="/admin/dashboard/agencia" icon={<Building2 className="h-3.5 w-3.5" />} label="Agências" />
          <HeaderLink href="/admin/dashboard/nichos" icon={<Store className="h-3.5 w-3.5" />} label="Nichos" />
          <HeaderLink href="/admin/dashboard/oferta" icon={<SlidersHorizontal className="h-3.5 w-3.5" />} label="Oferta" />
          <HeaderLink href="/admin/dashboard/leads" icon={<Inbox className="h-3.5 w-3.5" />} label="Leads" />
          <RefreshButton />
          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-[1.03]"
              style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)" }}
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" /> Sair
            </button>
          </form>
        </div>
      </header>

      <div className="section-container py-10">
        <div className="mb-6">
          {email && <p className="text-xs" style={MUTED}>{email}</p>}
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ ...TITLE, fontFamily: "var(--font-display)" }}>
            Planos e assinaturas
          </h1>
          <p className="text-sm mt-1 max-w-3xl" style={MUTED}>
            Crie <b>modelos de plano</b> (duração, valor padrão, carência). Ao iniciar/renovar,
            só <b>escolhe o plano</b>, confirma o valor recebido e anota o período. Toda ação pede{" "}
            <b>confirmação</b>. Use <b>Acesso painel</b> e envie o link{" "}
            <code className="text-[12px] px-1 rounded" style={{ background: "hsl(214,30%,94%)" }}>
              /comercial/login
            </code>{" "}
            manualmente ao negócio (não está no menu público; noindex). Sem Stripe e sem cron. Este
            controle é o <b>topo da hierarquia</b> — sem plano vigente (ou em carência), a entidade
            não aparece no site.
          </p>
        </div>

        {/* Modelos de plano */}
        <PlanTemplateManager templates={templates} />

        {/* Resumo */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 mb-6">
          {[
            { label: "Vencendo (≤7d)", n: expiring.length, color: "hsl(35,82%,47%)" },
            { label: "Em carência", n: grace.length, color: "hsl(280,45%,45%)" },
            { label: "Expirados", n: expired.length, color: "hsl(0,60%,50%)" },
            { label: "Ativos", n: active.length, color: "hsl(152,47%,40%)" },
            { label: "Sem plano", n: none.length, color: "hsl(210,25%,50%)" },
          ].map((c) => (
            <div key={c.label} className="rounded-2xl border bg-white p-4" style={BORDER}>
              <p className="text-xs font-semibold" style={MUTED}>{c.label}</p>
              <p className="text-3xl font-black mt-1" style={{ color: c.color, fontFamily: "var(--font-display)" }}>{c.n}</p>
            </div>
          ))}
        </div>

        {(expiring.length > 0 || grace.length > 0) && (
          <div className="mb-6 flex items-start gap-2 rounded-xl border px-4 py-3 text-sm" style={{ borderColor: "hsl(35,70%,75%)", background: "hsl(40,90%,96%)", color: "hsl(30,50%,28%)" }}>
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1">
              {expiring.length > 0 && (
                <p>
                  <b>{expiring.length} plano(s)</b> com ≤ {PLAN_EXPIRING_DAYS} dias até o vencimento — priorize cobrança.
                  {expiring.slice(0, 4).map((r) => (
                    <span key={`${r.entityType}-${r.entitySlug}`}> · {r.entityName} ({r.daysRemaining}d)</span>
                  ))}
                  {expiring.length > 4 ? "…" : null}
                </p>
              )}
              {grace.length > 0 && (
                <p>
                  <b>{grace.length}</b> em carência (ainda no site até sumir):
                  {grace.slice(0, 4).map((r) => (
                    <span key={`${r.entityType}-${r.entitySlug}`}> · {r.entityName} ({r.daysUntilGone}d restantes no site)</span>
                  ))}
                  {grace.length > 4 ? "…" : null}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Filter href="/admin/dashboard/planos" label="Todos" count={rows.length} on={!filterType} />
          <Filter href="/admin/dashboard/planos?type=partner" label="Parceiros" count={rows.filter((r) => r.entityType === "partner").length} on={filterType === "partner"} />
          <Filter href="/admin/dashboard/planos?type=agency" label="Agências" count={rows.filter((r) => r.entityType === "agency").length} on={filterType === "agency"} />
        </div>

        <div className={`grid gap-6 ${detail ? "lg:grid-cols-[1fr_360px]" : ""}`}>
          {/* Lista */}
          <div className="rounded-2xl border bg-white overflow-hidden" style={BORDER}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "hsl(214,40%,97%)" }}>
                    <th className="text-left px-4 py-3 text-xs font-bold" style={TITLE}>Entidade</th>
                    <th className="text-left px-3 py-3 text-xs font-bold" style={TITLE}>Status</th>
                    <th className="text-left px-3 py-3 text-xs font-bold hidden md:table-cell" style={TITLE}>Plano / valor</th>
                    <th className="text-left px-3 py-3 text-xs font-bold hidden sm:table-cell" style={TITLE}>Período</th>
                    <th className="text-left px-3 py-3 text-xs font-bold" style={TITLE}>Dias</th>
                    <th className="text-right px-4 py-3 text-xs font-bold" style={TITLE}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => {
                    const selected = detail?.entityType === r.entityType && detail?.entitySlug === r.entitySlug;
                    return (
                      <tr
                        key={`${r.entityType}:${r.entitySlug}`}
                        className="border-t"
                        style={{
                          borderColor: "hsl(214,25%,92%)",
                          background: selected ? "hsl(214,50%,97%)" : undefined,
                        }}
                      >
                        <td className="px-4 py-3">
                          <Link
                            href={`/admin/dashboard/planos?type=${r.entityType}&slug=${encodeURIComponent(r.entitySlug)}`}
                            className="font-semibold hover:underline"
                            style={TITLE}
                          >
                            {r.entityName}
                          </Link>
                          <p className="text-[11px]" style={MUTED}>
                            {typeLabel(r.entityType)} · {r.entitySlug}
                          </p>
                          {r.notes && (
                            <p className="text-[10px] mt-0.5 line-clamp-1" style={{ color: "hsl(210,20%,45%)" }} title={r.notes}>
                              📝 {r.notes}
                            </p>
                          )}
                          <div className="mt-1.5 max-w-[180px]">
                            <Progress daysRemaining={r.daysRemaining} daysUntilGone={r.daysUntilGone} status={r.status} />
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <span className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold" style={statusStyle(r.status)}>
                            {STATUS_LABEL[r.status]}
                          </span>
                          {r.graceDays > 0 && r.status !== "none" && (
                            <p className="text-[10px] mt-0.5" style={MUTED}>carência {r.graceDays}d</p>
                          )}
                        </td>
                        <td className="px-3 py-3 text-xs hidden md:table-cell" style={MUTED}>
                          <div className="font-semibold" style={TITLE}>{r.templateName ?? "—"}</div>
                          <div>{formatBrl(r.amountCents)}</div>
                        </td>
                        <td className="px-3 py-3 text-xs hidden sm:table-cell" style={MUTED}>
                          <div>Início: {fmtDate(r.periodStart)}</div>
                          <div>Fim: {fmtDate(r.periodEnd)}</div>
                          {r.status === "grace" && r.daysUntilGone !== null && (
                            <div style={{ color: "hsl(280,45%,40%)" }}>No site até: +{r.daysUntilGone}d</div>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          {r.daysRemaining === null ? (
                            <span className="text-xs" style={MUTED}>—</span>
                          ) : r.status === "expired" ? (
                            <span className="text-sm font-bold" style={{ color: "hsl(0,60%,45%)" }}>{r.daysRemaining}d</span>
                          ) : r.status === "grace" ? (
                            <span className="text-sm font-bold" style={{ color: "hsl(280,45%,40%)" }} title="Dias até sumir do site">
                              {r.daysUntilGone}d site
                            </span>
                          ) : (
                            <span className="text-sm font-bold" style={TITLE}>{r.daysRemaining}d</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex flex-col items-end gap-1.5">
                            <PlanPeriodControl
                              entityType={r.entityType}
                              entitySlug={r.entitySlug}
                              entityName={r.entityName}
                              status={r.status}
                              templates={templates}
                              defaults={{
                                templateSlug: r.templateSlug,
                                amountCents: r.amountCents,
                                notes: r.notes,
                              }}
                            />
                            <PortalAccessControl
                              entityType={r.entityType}
                              entitySlug={r.entitySlug}
                              entityName={r.entityName}
                              account={(() => {
                                const a = portalByKey.get(`${r.entityType}:${r.entitySlug}`);
                                return a ? { email: a.email, active: a.active } : null;
                              })()}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-sm" style={MUTED}>
                        Nenhuma entidade neste filtro.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Histórico lateral */}
          {detail && (
            <aside className="rounded-2xl border bg-white p-5 h-fit" style={BORDER}>
              <p className="text-xs font-semibold uppercase tracking-wide" style={MUTED}>
                Detalhe · {typeLabel(detail.entityType)}
              </p>
              <h2 className="text-lg font-black mt-1" style={{ ...TITLE, fontFamily: "var(--font-display)" }}>
                {detail.entityName}
              </h2>
              <p className="text-xs mt-0.5" style={MUTED}>{detail.entitySlug}</p>
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold" style={statusStyle(detail.status)}>
                  {STATUS_LABEL[detail.status]}
                </span>
                {detail.templateName && (
                  <span className="text-xs font-semibold" style={TITLE}>{detail.templateName}</span>
                )}
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <dt style={MUTED}>Valor</dt>
                  <dd className="font-bold" style={TITLE}>{formatBrl(detail.amountCents)}</dd>
                </div>
                <div>
                  <dt style={MUTED}>Carência</dt>
                  <dd className="font-bold" style={TITLE}>{detail.graceDays}d</dd>
                </div>
                <div>
                  <dt style={MUTED}>Até vencimento</dt>
                  <dd className="font-bold" style={TITLE}>
                    {detail.daysRemaining === null ? "—" : `${detail.daysRemaining}d`}
                  </dd>
                </div>
                <div>
                  <dt style={MUTED}>No site até</dt>
                  <dd className="font-bold" style={TITLE}>
                    {detail.daysUntilGone === null ? "—" : `${detail.daysUntilGone}d`}
                  </dd>
                </div>
              </dl>
              <div className="mt-3">
                <Progress daysRemaining={detail.daysRemaining} daysUntilGone={detail.daysUntilGone} status={detail.status} />
              </div>
              {detail.status === "paused" && (
                <p className="mt-2 text-xs rounded-lg border px-2.5 py-2" style={{ borderColor: "hsl(214,30%,85%)", background: "hsl(214,30%,96%)", color: "hsl(210,35%,30%)" }}>
                  Pausado — fora do site; prazo congelado até <b>Retomar</b>.
                </p>
              )}

              <PlanNotesPanel
                entityType={detail.entityType}
                entitySlug={detail.entitySlug}
                hasPeriod={Boolean(detail.periodStart)}
                periodNotes={periodNotes}
                legacyNote={detail.notes}
                entityNotes={entityNotes}
              />

              <p className="text-[10px] font-bold uppercase tracking-wide mt-5 mb-2" style={MUTED}>Histórico</p>
              <div className="space-y-3 max-h-[420px] overflow-y-auto">
                {history.length === 0 && (
                  <p className="text-xs" style={MUTED}>Nenhum início/renovação ainda.</p>
                )}
                {history.map((h) => (
                  <div key={h.id} className="rounded-xl border p-3" style={BORDER}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold" style={TITLE}>
                        {h.eventType === "start"
                          ? "Início"
                          : h.eventType === "interrupt_grace"
                            ? "Carência interrompida"
                            : h.eventType === "pause"
                              ? "Pausa"
                              : h.eventType === "resume"
                                ? "Retomada"
                                : "Renovação"}
                      </span>
                      <span className="text-[10px]" style={MUTED}>{h.createdAt}</span>
                    </div>
                    <p className="text-[11px] mt-1" style={MUTED}>
                      {fmtDate(h.periodStart)} → {fmtDate(h.periodEnd)}
                    </p>
                    <p className="text-[11px] mt-0.5" style={MUTED}>
                      {formatBrl(h.amountCents)}
                      {h.graceDays > 0 ? ` · carência ${h.graceDays}d` : ""}
                      {h.templateSlug ? ` · ${h.templateSlug}` : ""}
                    </p>
                    {h.createdBy && (
                      <p className="text-[10px] mt-0.5" style={MUTED}>por {h.createdBy}</p>
                    )}
                    {h.note && (
                      <p className="text-xs mt-1" style={TITLE}>{h.note}</p>
                    )}
                  </div>
                ))}
              </div>
              <Link
                href={filterType ? `/admin/dashboard/planos?type=${filterType}` : "/admin/dashboard/planos"}
                className="mt-4 inline-block text-xs font-semibold underline"
                style={{ color: "hsl(210,56%,23%)" }}
              >
                Fechar detalhe
              </Link>
            </aside>
          )}
        </div>
      </div>
    </main>
  );
}
