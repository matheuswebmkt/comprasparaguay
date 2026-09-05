// Filepath: app/admin/dashboard/agencia/page.tsx
// Version: 1.1
// Nome da Versão: "Agências (v1) — lista + ativa + contagem; perfil SSOT em app/data/agencies.ts"
// Base para a página completa futura (métricas por agência, edição rica, página pública).
// ⚠️ A agência ATIVA também alimenta a recomendação do nicho `/transfer`.

import Link from "next/link";
import { cookies } from "next/headers";
import { Building2, LogOut, ArrowLeft, Inbox, SlidersHorizontal, Database, MapPin } from "lucide-react";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { getAgencies, getActiveAgencySlugRaw } from "@/lib/agencies";
import { getLeadCountsByAgency, clampPeriod, countryName } from "@/lib/metrics";
import { Notice, PeriodSelector, fmt, TITLE, MUTED, BORDER } from "@/components/admin/dashboard-ui";
import RefreshButton from "@/components/admin/RefreshButton";
import ActiveAgencyControl from "@/components/admin/ActiveAgencyControl";

export const dynamic = "force-dynamic";

const NAVY = "hsl(210,56%,23%)";
const GOLD = "hsl(35,82%,47%)";

export default async function AgenciesPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const secret = process.env.AUTH_SECRET;
  const email = token && secret ? await verifySessionToken(token, secret) : null;

  const days = clampPeriod((await searchParams)?.days);
  const [agencies, activeSlug, counts] = await Promise.all([
    getAgencies(),
    getActiveAgencySlugRaw(),
    getLeadCountsByAgency(days),
  ]);

  const HeaderLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
    <Link href={href}
      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-[1.03]"
      style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)" }}>
      {icon}{label}
    </Link>
  );

  return (
    <main className="min-h-screen" style={{ background: "hsl(40,33%,97%)" }}>
      <header className="px-6 py-4 flex items-center justify-between flex-wrap gap-2" style={{ background: "hsl(210,60%,15%)" }}>
        <div className="flex items-center gap-2.5 text-white">
          <Building2 className="h-5 w-5" style={{ color: "hsl(38,90%,55%)" }} aria-hidden="true" />
          <span className="font-bold text-sm">Agências · Compras Paraguay</span>
        </div>
        <div className="flex items-center gap-2">
          <HeaderLink href="/admin/dashboard" icon={<ArrowLeft className="h-3.5 w-3.5" />} label="Métricas" />
          <HeaderLink href="/admin/dashboard/oferta" icon={<SlidersHorizontal className="h-3.5 w-3.5" />} label="Oferta" />
          <HeaderLink href={`/admin/dashboard/leads?days=${days}`} icon={<Inbox className="h-3.5 w-3.5" />} label="Leads" />
          <RefreshButton />
          <form action="/api/auth/logout" method="post">
            <button type="submit"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-[1.03]"
              style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)" }}>
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" /> Sair
            </button>
          </form>
        </div>
      </header>

      <div className="section-container py-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            {email && <p className="text-xs" style={MUTED}>{email}</p>}
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ ...TITLE, fontFamily: "var(--font-display)" }}>
              Agências
            </h1>
            <p className="text-sm mt-1" style={MUTED}>
              A agência <b>ativa</b> recebe os novos leads e é a única que aparece no site (nicho de agência de turismo), se o perfil for <b>público</b> no catálogo.
              <b>Desativar</b> = some do site (Empty State, sem nome/link) e deixa de carimbar novos leads. Perfil ={" "}
              <code className="text-[11px]">app/data/agencies.ts</code>. Histórico de leads antigos preservado por slug.
            </p>
          </div>
          <PeriodSelector basePath="/admin/dashboard/agencia" current={days} />
        </div>

        {!agencies.length ? (
          <Notice icon={<Database className="h-7 w-7" style={{ color: NAVY }} />} title="Sem agências / banco não configurado" text="Defina DATABASE_URL e rode a migração para criar as agências." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {agencies.map((a) => {
              const isActive = a.slug === activeSlug;
              const local = [a.city, a.country ? countryName(a.country) : null].filter(Boolean).join(", ");
              return (
                <div key={a.slug} className="rounded-2xl border bg-white p-5 flex flex-col gap-3 transition-all hover:shadow-tef-md"
                  style={{ ...BORDER, ...(isActive ? { borderColor: "hsl(152,47%,45%)" } : {}) }}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-base font-bold" style={TITLE}>{a.name}</h2>
                      <p className="text-xs" style={MUTED}>{a.slug}</p>
                    </div>
                    <ActiveAgencyControl slug={a.slug} isActive={isActive} />
                  </div>
                  {local && (
                    <p className="text-xs inline-flex items-center gap-1.5" style={{ color: "hsl(210,25%,40%)" }}>
                      <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {local}
                    </p>
                  )}
                  {a.description && <p className="text-xs leading-relaxed line-clamp-3" style={{ color: "hsl(210,25%,45%)" }}>{a.description}</p>}
                  {(a.website || a.whatsapp || a.instagram) && (
                    <p className="text-[11px] leading-relaxed break-all" style={MUTED}>
                      {[a.website, a.whatsapp ? `wa.me/${a.whatsapp}` : null, a.instagram ? `@${a.instagram}` : null]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-3 border-t" style={BORDER}>
                    <span className="text-xs" style={MUTED}>Desde {a.created_at}</span>
                    <Link href={`/admin/dashboard/leads?days=${days}&agency=${a.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-bold transition-opacity hover:opacity-70"
                      style={{ color: GOLD }}>
                      <Inbox className="h-4 w-4" aria-hidden="true" /> {fmt(counts[a.slug] ?? 0)} leads
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="mt-6 text-xs" style={MUTED}>
          Contagem de leads no período selecionado. Clique em “leads” para ver a lista filtrada por esta agência.
          Ativar uma desativa a anterior (só uma ativa). Desativar remove a recomendação pública até você ativar de novo.
          Textos do modal (nome da agência no sucesso etc.) são editados à parte em Oferta — não são ligados a este toggle.
        </p>
      </div>
    </main>
  );
}
