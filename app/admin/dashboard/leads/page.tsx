// Filepath: app/admin/dashboard/leads/page.tsx
// Version: 2.2
// Nome da Versão: "Remove chip 'Pref.' (Manter/Personalizar) da lista de leads — campo extinto"

import Link from "next/link";
import { cookies } from "next/headers";
import {
  Inbox, LogOut, ArrowLeft, Database, MessageCircle, ShieldCheck, ShieldOff, CheckCircle2,
  Building2, SlidersHorizontal, Rocket, Send, TrendingDown,
} from "lucide-react";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import {
  getLeads,
  getModalFunnel,
  clampPeriod,
  countryName,
  clickRate,
  localeLabel,
  leadContextChip,
  pageLabel,
  ctaTypeLabel,
  type LeadRow,
} from "@/lib/metrics";
import { getAgencies } from "@/lib/agencies";
import { officialAgencyName } from "@/app/data/agencies";
import { LOCALE_META, isLocale } from "@/lib/i18n/config";
import { MetricCard, Panel, Notice, PeriodSelector, GroupLabel, PctRow, fmt, TITLE, MUTED, BORDER } from "@/components/admin/dashboard-ui";
import RefreshButton from "@/components/admin/RefreshButton";

export const dynamic = "force-dynamic";

const NAVY = "hsl(210,56%,23%)";
const GOLD = "hsl(35,82%,47%)";

const TH = "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap";
const TD = "px-4 py-3 text-sm align-top";

function waLink(whatsapp: string): string {
  const digits = whatsapp.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

function dash(v: string | null | undefined) {
  return v && v.trim() ? v : <span style={{ color: "hsl(210,20%,70%)" }}>—</span>;
}

function originOf(l: LeadRow): string {
  const parts = [l.utm_source, l.utm_medium].filter((x) => x && x.trim());
  return parts.length ? parts.join(" · ") : "(direto)";
}

// Perfil de qualificação (PA §15): morador vs turista (+ se já está em Foz).
function profileOf(l: LeadRow): { label: string; color: string; bg: string } | null {
  if (l.is_local === true) return { label: "Morador", color: "hsl(210,56%,23%)", bg: "hsl(214,50%,94%)" };
  if (l.is_local === false) {
    const suf = l.already_in_foz === true ? " · já em Foz" : l.already_in_foz === false ? " · a caminho" : "";
    return { label: `Turista${suf}`, color: "hsl(35,82%,32%)", bg: "hsl(38,80%,92%)" };
  }
  return null;
}

function transportChipOf(l: LeadRow): string[] {
  return l.wants_transport ? ["🚐 Transporte"] : [];
}

// Qualificação estruturada do wizard /montar-roteiro (MR-9) → chips legíveis.
function roteiroChips(l: LeadRow): string[] {
  const out: string[] = [];
  const d = l.roteiro_dias;
  if (d) out.push(d === "undecided" ? "Dias: a definir" : d === "5+" ? "5+ dias" : `${d} dia${d === "1" ? "" : "s"}`);
  const p = l.roteiro_pessoas;
  if (p) out.push(p === "undecided" ? "Pessoas: a definir" : `${p} pessoa${p === "1" ? "" : "s"}`);
  const ORC: Record<string, string> = { economica: "Econômica", equilibrada: "Equilibrada", maximo: "Máximo" };
  if (l.roteiro_orcamento) out.push(ORC[l.roteiro_orcamento] ?? l.roteiro_orcamento);
  if (l.roteiro_perfil) {
    const P: Record<string, string> = { criancas: "Crianças", idosos: "Idosos", pne: "PNE" };
    l.roteiro_perfil.split(",").map((s) => s.trim()).filter(Boolean).forEach((x) => out.push(P[x] ?? x));
  }
  const YN: Record<string, string> = { sim: "sim", nao: "não", depois: "depois", tenho: "já tem" };
  if (l.roteiro_gastro) out.push(`Gastro: ${YN[l.roteiro_gastro] ?? l.roteiro_gastro}`);
  if (l.roteiro_hotel) out.push(`Hotel: ${YN[l.roteiro_hotel] ?? l.roteiro_hotel}`);
  if (l.roteiro_transfer) out.push(`Transfer: ${YN[l.roteiro_transfer] ?? l.roteiro_transfer}`);
  return out;
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string; agency?: string; profile?: string }>;
}) {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const secret = process.env.AUTH_SECRET;
  const email = token && secret ? await verifySessionToken(token, secret) : null;

  const sp = await searchParams;
  const days = clampPeriod(sp?.days);
  const agency = sp?.agency && sp.agency.trim() ? sp.agency.trim() : null;
  const profile: "local" | "tourist" | null =
    sp?.profile === "local" || sp?.profile === "tourist" ? sp.profile : null;
  const [data, agencies, modal] = await Promise.all([getLeads(days, 500, agency, profile), getAgencies(), getModalFunnel(days)]);
  const agencyName = (slug: string | null) => agencies.find((a) => a.slug === slug)?.name ?? slug ?? "—";

  // Monta o href preservando os filtros ativos (days + agency + profile), sobrescrevendo o que vier em `over`.
  const qs = (over: { agency?: string | null; profile?: string | null }) => {
    const p = new URLSearchParams();
    p.set("days", String(days));
    const a = "agency" in over ? over.agency : agency;
    const pr = "profile" in over ? over.profile : profile;
    if (a) p.set("agency", a);
    if (pr) p.set("profile", pr);
    return `/admin/dashboard/leads?${p.toString()}`;
  };
  const pill = (on: boolean) =>
    on
      ? { background: "hsl(210,60%,15%)", color: "white", borderColor: "hsl(210,60%,15%)" }
      : { ...BORDER, color: "hsl(210,25%,40%)", background: "white" };

  return (
    <main className="min-h-screen" style={{ background: "hsl(40,33%,97%)" }}>
      <header className="px-6 py-4 flex items-center justify-between" style={{ background: "hsl(210,60%,15%)" }}>
        <div className="flex items-center gap-2.5 text-white">
          <Inbox className="h-5 w-5" style={{ color: "hsl(38,90%,55%)" }} aria-hidden="true" />
          <span className="font-bold text-sm">Leads · Compras Paraguay</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-[1.03]"
            style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)" }}
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Métricas
          </Link>
          <Link
            href="/admin/dashboard/oferta"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-[1.03]"
            style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)" }}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
            Oferta
          </Link>
          <Link
            href={`/admin/dashboard/agencia?days=${days}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-[1.03]"
            style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)" }}
          >
            <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
            Agências
          </Link>
          <RefreshButton />
          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-[1.03]"
              style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)" }}
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              Sair
            </button>
          </form>
        </div>
      </header>

      <div className="section-container py-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            {email && <p className="text-xs" style={MUTED}>{email}</p>}
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ ...TITLE, fontFamily: "var(--font-display)" }}>
              Cofre de leads
            </h1>
          </div>
          <PeriodSelector basePath="/admin/dashboard/leads" current={days} />
        </div>

        {agencies.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-semibold" style={MUTED}>Agência:</span>
            <Link href={qs({ agency: null })} className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors" style={pill(!agency)}>
              Todas
            </Link>
            {agencies.map((a) => (
              <Link key={a.slug} href={qs({ agency: a.slug })} className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors" style={pill(agency === a.slug)}>
                {a.name}
              </Link>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs font-semibold" style={MUTED}>Perfil:</span>
          <Link href={qs({ profile: null })} className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors" style={pill(!profile)}>
            Todos
          </Link>
          <Link href={qs({ profile: "tourist" })} className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors" style={pill(profile === "tourist")}>
            Turista
          </Link>
          <Link href={qs({ profile: "local" })} className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors" style={pill(profile === "local")}>
            Morador
          </Link>
        </div>

        {!data.configured ? (
          <Notice icon={<Database className="h-7 w-7" style={{ color: NAVY }} />} title="Banco não configurado" text="Defina DATABASE_URL para coletar e exibir leads." />
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <MetricCard icon={<Inbox className="h-5 w-5" />} label="Leads no período" value={fmt(data.total)} accent={GOLD} />
              <MetricCard icon={<MessageCircle className="h-5 w-5" />} label="Exibindo" value={fmt(data.rows.length)} accent={NAVY} />
            </div>

            {data.rows.length === 0 ? (
              <Notice
                icon={<Inbox className="h-7 w-7" style={{ color: NAVY }} />}
                title="Nenhum lead neste período"
                text="Leads de ingresso (atrativos), roteiro e personalizar aparecem aqui em tempo real (use Atualizar)."
              />
            ) : (
              <div className="rounded-2xl border bg-white overflow-hidden" style={BORDER}>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr style={{ ...MUTED, background: "hsl(214,50%,97%)" }}>
                        <th className={TH}>Data</th>
                        <th className={TH}>Contexto</th>
                        <th className={TH}>Produto / resumo</th>
                        <th className={TH}>Nome</th>
                        <th className={TH}>WhatsApp</th>
                        <th className={TH}>Email</th>
                        <th className={TH}>Agência</th>
                        <th className={TH}>Assumido por</th>
                        <th className={TH}>Origem</th>
                        <th className={TH}>Campanha</th>
                        <th className={TH}>Página</th>
                        <th className={TH}>Local</th>
                        <th className={TH}>Perfil</th>
                        <th className={TH}>Idioma</th>
                        <th className={TH}>Transporte</th>
                        <th className={TH}>Dia</th>
                        <th className={TH}>Qtd</th>
                        <th className={TH}>CTA final</th>
                        <th className={TH}>LGPD</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.rows.map((l) => {
                        const local = [l.city, l.country ? countryName(l.country) : null].filter(Boolean).join(", ");
                        const profile = profileOf(l);
                        const offers = transportChipOf(l);
                        const chip = leadContextChip(l);
                        const productTitle =
                          l.roteiro_titulo?.trim() ||
                          (l.roteiro_slug ? l.roteiro_slug : null) ||
                          (l.page_path ? pageLabel(l.page_path) : null);
                        return (
                          <tr key={l.id} className="border-t" style={BORDER}>
                            <td className={TD} style={{ color: "hsl(210,25%,45%)", whiteSpace: "nowrap" }}>{l.created_at}</td>
                            <td className={TD} style={{ whiteSpace: "nowrap" }}>
                              <span
                                className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold"
                                style={{ background: chip.bg, color: chip.color }}
                                title={l.cta_type ? ctaTypeLabel(l.cta_type) : undefined}
                              >
                                {chip.label}
                              </span>
                              {l.cta_type && (
                                <p className="text-[10px] mt-0.5 max-w-[120px] truncate" style={{ color: "hsl(210,20%,50%)" }} title={l.cta_type}>
                                  {ctaTypeLabel(l.cta_type)}
                                </p>
                              )}
                            </td>
                            <td className={TD} style={{ maxWidth: 280 }}>
                              <p className="text-sm font-semibold" style={{ color: "hsl(210,60%,15%)" }}>
                                {productTitle || <span style={{ color: "hsl(210,20%,70%)", fontWeight: 400 }}>—</span>}
                              </p>
                              {roteiroChips(l).length > 0 && (
                                <div className="mt-1.5 flex flex-wrap gap-1">
                                  {roteiroChips(l).map((c, i) => (
                                    <span
                                      key={i}
                                      className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold"
                                      style={{ background: "hsl(214,50%,94%)", color: "hsl(210,56%,28%)" }}
                                    >
                                      {c}
                                    </span>
                                  ))}
                                </div>
                              )}
                              {l.roteiro_resumo?.trim() ? (
                                <pre
                                  className="mt-1 text-[10px] leading-snug whitespace-pre-wrap font-sans max-h-24 overflow-y-auto rounded-lg px-2 py-1.5"
                                  style={{
                                    background: "hsl(214,40%,97%)",
                                    color: "hsl(210,25%,35%)",
                                    border: "1px solid hsl(214,25%,90%)",
                                  }}
                                  title={l.roteiro_resumo}
                                >
                                  {l.roteiro_resumo.length > 400
                                    ? `${l.roteiro_resumo.slice(0, 400)}…`
                                    : l.roteiro_resumo}
                                </pre>
                              ) : null}
                            </td>
                            <td className={TD} style={{ ...TITLE, fontWeight: 600 }}>{dash(l.nome)}</td>
                            <td className={TD} style={{ whiteSpace: "nowrap" }}>
                              <a
                                href={waLink(l.whatsapp)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 font-semibold transition-opacity hover:opacity-70"
                                style={{ color: "hsl(152,47%,32%)" }}
                              >
                                <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                                {l.whatsapp}
                              </a>
                            </td>
                            <td className={TD} style={{ color: "hsl(210,25%,35%)" }}>{dash(l.email)}</td>
                            <td className={TD} style={{ color: "hsl(210,25%,35%)", fontWeight: 600 }}>{agencyName(l.assigned_partner)}</td>
                            <td className={TD} style={{ whiteSpace: "nowrap" }}>
                              {l.claimed_by ? (
                                <span className="inline-flex items-center gap-1.5 font-semibold" style={{ color: "hsl(152,47%,32%)" }}>
                                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                                  {l.claimed_by}
                                </span>
                              ) : (
                                <span style={{ color: "hsl(210,20%,70%)" }}>livre</span>
                              )}
                            </td>
                            <td className={TD} style={{ color: "hsl(210,25%,35%)", whiteSpace: "nowrap" }}>{originOf(l)}</td>
                            <td className={TD} style={{ color: "hsl(210,25%,35%)" }}>{dash(l.utm_campaign)}</td>
                            <td className={TD} style={{ color: "hsl(210,25%,35%)", maxWidth: 160 }}>
                              {l.page_path ? (
                                <span title={l.page_path}>
                                  <span className="block text-xs font-semibold truncate">{pageLabel(l.page_path)}</span>
                                  <span className="block text-[10px] truncate" style={{ color: "hsl(210,20%,55%)" }}>{l.page_path}</span>
                                </span>
                              ) : (
                                dash(null)
                              )}
                            </td>
                            <td className={TD} style={{ color: "hsl(210,25%,35%)", whiteSpace: "nowrap" }}>{local || <span style={{ color: "hsl(210,20%,70%)" }}>—</span>}</td>
                            <td className={TD} style={{ whiteSpace: "nowrap" }}>
                              {profile ? (
                                <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold" style={{ background: profile.bg, color: profile.color }}>
                                  {profile.label}
                                </span>
                              ) : (
                                <span style={{ color: "hsl(210,20%,70%)" }}>—</span>
                              )}
                            </td>
                            <td className={TD} style={{ whiteSpace: "nowrap" }}>
                              {isLocale(l.locale) ? (
                                <span className="inline-flex items-center gap-1 text-sm" title={LOCALE_META[l.locale].label}>
                                  <span aria-hidden="true">{LOCALE_META[l.locale].flag}</span>
                                  <span style={{ color: "hsl(210,25%,35%)", fontWeight: 600 }}>{LOCALE_META[l.locale].short}</span>
                                </span>
                              ) : (
                                <span style={{ color: "hsl(210,20%,70%)" }}>—</span>
                              )}
                            </td>
                            <td className={TD}>
                              {offers.length ? (
                                <div className="flex flex-wrap gap-1" style={{ maxWidth: 220 }}>
                                  {offers.map((o, i) => (
                                    <span key={i} className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold" style={{ background: "hsl(152,40%,93%)", color: "hsl(152,47%,28%)" }}>
                                      {o}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span style={{ color: "hsl(210,20%,70%)" }}>—</span>
                              )}
                            </td>
                            <td className={TD} style={{ whiteSpace: "nowrap" }}>
                              {l.visit_date ?? <span style={{ color: "hsl(210,20%,70%)" }}>—</span>}
                            </td>
                            <td className={TD} style={{ whiteSpace: "nowrap" }}>
                              {l.ticket_qty ?? <span style={{ color: "hsl(210,20%,70%)" }}>—</span>}
                            </td>
                            <td className={TD} style={{ whiteSpace: "nowrap" }}>
                              {l.cta_clicked ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold" style={{ background: "hsl(152,40%,93%)", color: "hsl(152,47%,28%)" }} title="Clicou no link direto do ingresso na tela de sucesso">
                                  <CheckCircle2 className="h-3 w-3" aria-hidden="true" /> Clicou
                                </span>
                              ) : l.cta_shown ? (
                                <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold" style={{ background: "hsl(38,80%,92%)", color: "hsl(35,82%,32%)" }} title="O CTA final foi exibido no sucesso, mas não houve clique">
                                  Não clicou
                                </span>
                              ) : (
                                <span style={{ color: "hsl(210,20%,70%)" }} title="CTA final não exibido (a agência atende) ou lead antigo sem funil">—</span>
                              )}
                            </td>
                            <td className={TD}>
                              {l.lgpd_consent === false ? (
                                <ShieldOff className="h-4 w-4" style={{ color: "hsl(0,72%,50%)" }} aria-label="Sem consentimento" />
                              ) : (
                                <ShieldCheck className="h-4 w-4" style={{ color: "hsl(152,47%,32%)" }} aria-label="Consentimento registrado" />
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <p className="mt-4 text-xs" style={MUTED}>
              Máximo de 500 leads por período. Clique no WhatsApp para abrir a conversa. Horários em Brasília (BRT).
            </p>

            {/* Funil do modal (detalhado) — do 1º clique ao envio, e onde abandonam */}
            <GroupLabel>Funil do modal · onde os leads abandonam</GroupLabel>
            {modal.initiations === 0 ? (
              <Notice icon={<Rocket className="h-7 w-7" style={{ color: NAVY }} />} title="Sem aberturas do modal neste período" text="Quando alguém abrir o modal de oferta, o funil completo (do 1º clique ao envio) aparece aqui. Tente o período 'Tudo'." />
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <MetricCard icon={<Rocket className="h-5 w-5" />} label="Iniciações do modal" value={fmt(modal.initiations)} accent={NAVY} />
                  <MetricCard icon={<Send className="h-5 w-5" />} label="Enviados (leads)" value={fmt(modal.submitted)} accent="hsl(152,47%,32%)" />
                  <MetricCard icon={<TrendingDown className="h-5 w-5" />} label="Abandonos" value={fmt(modal.abandoned)} accent="hsl(0,72%,45%)" />
                  <MetricCard icon={<Inbox className="h-5 w-5" />} label="Conversão do modal" value={`${clickRate(modal.submitted, modal.initiations).toFixed(1)}%`} accent={GOLD} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Panel title="Etapas do funil (sobre as iniciações)">
                    <PctRow label="Abriu o modal" value={modal.initiations} total={modal.initiations} color={NAVY} />
                    <PctRow label="Respondeu “morador de Foz?”" value={modal.localYes + modal.localNo} total={modal.initiations} color="hsl(210,56%,35%)" />
                    <PctRow label="Preencheu o nome" value={modal.filledName} total={modal.initiations} color="hsl(210,56%,35%)" />
                    <PctRow label="Preencheu o email" value={modal.filledEmail} total={modal.initiations} color="hsl(210,56%,35%)" />
                    <PctRow label="Preencheu o telefone" value={modal.filledPhone} total={modal.initiations} color="hsl(210,56%,35%)" />
                    <PctRow label="Marcou “incluir transporte”" value={modal.transportChecked} total={modal.initiations} color={GOLD} />
                    <PctRow label="Enviou (lead)" value={modal.submitted} total={modal.initiations} color="hsl(152,47%,32%)" />
                    <PctRow label="Chegou no sucesso" value={modal.reachedSuccess} total={modal.initiations} color="hsl(152,47%,32%)" />
                    <PctRow label="Clicou no CTA de sucesso" value={modal.successCta} total={modal.initiations} color={GOLD} />
                  </Panel>
                  <Panel title="Onde os leads abandonam (sobre as iniciações)">
                    <PctRow label="Abriu e não fez nada" value={modal.abOnlyOpen} total={modal.initiations} color="hsl(0,60%,55%)" />
                    <PctRow label="Parou na qualificação (respondeu morador, sem preencher)" value={modal.abAtQualification} total={modal.initiations} color="hsl(0,60%,55%)" />
                    <PctRow label="Só preencheu o nome" value={modal.abOnlyName} total={modal.initiations} color="hsl(0,60%,55%)" />
                    <PctRow label="Nome + email (sem telefone)" value={modal.abNameEmail} total={modal.initiations} color="hsl(0,60%,55%)" />
                    <PctRow label="Telefone preenchido, mas não enviou" value={modal.abWithPhone} total={modal.initiations} color="hsl(0,60%,55%)" />
                    <PctRow label="Só marcou oferta(s), sem preencher" value={modal.abOfferOnly} total={modal.initiations} color="hsl(0,60%,55%)" />
                    <PctRow label="Chegou no sucesso e não clicou o CTA" value={modal.abAtSuccess} total={modal.initiations} color="hsl(35,82%,47%)" />
                  </Panel>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  <Panel title="Qualificação dos leads">
                    <PctRow label="Morador de Foz" value={modal.localYes} total={modal.localYes + modal.localNo} color={NAVY} />
                    <PctRow label="Turista" value={modal.localNo} total={modal.localYes + modal.localNo} color={GOLD} />
                    <PctRow label="Turista · já em Foz" value={modal.infozYes} total={modal.infozYes + modal.infozNo} color="hsl(152,47%,32%)" />
                    <PctRow label="Turista · a caminho" value={modal.infozNo} total={modal.infozYes + modal.infozNo} color="hsl(210,56%,35%)" />
                  </Panel>
                  {modal.leads && modal.leads.total > 0 && (
                    <Panel title="Leads capturados · transporte e idioma">
                      <PctRow label={`Pediram transporte (${officialAgencyName()})`} value={modal.leads.wantsTransport} total={modal.leads.total} color={GOLD} />
                      {modal.leads.locales.map((l) => (
                        <PctRow key={l.locale} label={`Idioma: ${localeLabel(l.locale)}`} value={l.n} total={modal.leads!.total} color={NAVY} />
                      ))}
                    </Panel>
                  )}
                </div>
                <p className="mt-3 text-xs" style={MUTED}>
                  Cada <strong>iniciação</strong> = uma abertura do modal (mesmo que a pessoa feche em seguida). Percentuais sobre as iniciações do período.
                </p>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}
