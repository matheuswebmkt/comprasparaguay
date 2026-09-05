// Filepath: app/admin/dashboard/nichos/page.tsx
// Version: 1.0
// Nome da Versão: "Nichos (v1) — atribui o parceiro EXCLUSIVO (Recomendação Oficial) de cada página de nicho"
//
// Gerencia, sem deploy, qual parceiro é o pitch de cada página `/<nicho>`. A copy/SEO do
// nicho (app/data/niches.ts) NUNCA é tocada — só o slot muda. Salvar → revalidateTag('niche-settings').

import Link from "next/link";
import { cookies } from "next/headers";
import { Store, LogOut, ArrowLeft, Inbox, SlidersHorizontal, Building2, Database, CheckCircle2 } from "lucide-react";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { isDbConfigured } from "@/lib/db";
import { niches } from "@/app/data/niches";
import { activePartners, getCategoryMeta } from "@/app/data/partners";
import { getNicheAssignments } from "@/lib/niche-settings";
import { Notice, TITLE, MUTED, BORDER } from "@/components/admin/dashboard-ui";
import RefreshButton from "@/components/admin/RefreshButton";
import NicheAssignmentControl from "@/components/admin/NicheAssignmentControl";

export const dynamic = "force-dynamic";

export default async function NichesAdminPage() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const secret = process.env.AUTH_SECRET;
  const email = token && secret ? await verifySessionToken(token, secret) : null;

  const assignments = await getNicheAssignments();
  const partnerOptions = activePartners.map((p) => ({ slug: p.slug, name: p.name }));
  const partnerName = (slug: string) => activePartners.find((p) => p.slug === slug)?.name ?? slug;

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
          <Store className="h-5 w-5" style={{ color: "hsl(38,90%,55%)" }} aria-hidden="true" />
          <span className="font-bold text-sm">Nichos · Compras Paraguay</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <HeaderLink href="/admin/dashboard" icon={<ArrowLeft className="h-3.5 w-3.5" />} label="Métricas" />
          <HeaderLink href="/admin/dashboard/oferta" icon={<SlidersHorizontal className="h-3.5 w-3.5" />} label="Oferta" />
          <HeaderLink href="/admin/dashboard/agencia" icon={<Building2 className="h-3.5 w-3.5" />} label="Agências" />
          <HeaderLink href="/admin/dashboard/leads" icon={<Inbox className="h-3.5 w-3.5" />} label="Leads" />
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
        <div className="mb-8">
          {email && <p className="text-xs" style={MUTED}>{email}</p>}
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ ...TITLE, fontFamily: "var(--font-display)" }}>
            Nichos & exibição de parceiros
          </h1>
          <p className="text-sm mt-1 max-w-3xl" style={MUTED}>
            Este é o <b>controle global</b> de exibição. Vincular um parceiro a um nicho o coloca <b>no ar em todo o site</b> —
            página própria, vitrines (cards), páginas de SEO e a recomendação do nicho. <b>Nenhum</b> = o parceiro <b>some de tudo</b>
            (a página própria dele sai do ar e redireciona). É o seu controle de plano: pagou, seleciona; não pagou, desseleciona. Salva na hora, sem deploy.
          </p>
        </div>

        {!isDbConfigured() && (
          <div className="mb-6">
            <Notice
              icon={<Database className="h-7 w-7" style={{ color: "hsl(35,82%,40%)" }} />}
              title="Banco não configurado"
              text="Sem DATABASE_URL, as atribuições não são salvas — a página usa o fallback estático (Partner.niches). Configure o banco para editar aqui."
            />
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {niches.map((n) => {
            const meta = getCategoryMeta(n.category);
            const assigned = assignments[n.key] ?? null;
            return (
              <div key={n.key} className="rounded-2xl border bg-white p-5 flex flex-col gap-3" style={BORDER}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h2 className="text-base font-bold leading-snug" style={TITLE}>{n.navLabel}</h2>
                    <p className="text-xs truncate" style={MUTED}>{n.breadcrumbLabel}</p>
                  </div>
                  <span className="shrink-0 inline-flex px-2 py-0.5 rounded-lg text-[10px] font-semibold" style={{ color: meta.accent, background: "hsl(214,50%,96%)" }}>
                    {meta.name}
                  </span>
                </div>

                <div className="text-xs" style={MUTED}>
                  {assigned ? (
                    <span className="inline-flex items-center gap-1.5" style={{ color: "hsl(152,47%,32%)" }}>
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Recomendando: <b>{partnerName(assigned)}</b>
                    </span>
                  ) : (
                    <span>Sem recomendação — Empty State</span>
                  )}
                </div>

                <NicheAssignmentControl nicheKey={n.key} current={assigned} partners={partnerOptions} />

                <div className="mt-auto pt-3 border-t flex items-center justify-between" style={BORDER}>
                  <span className="text-[11px]" style={MUTED}>chave: {n.key}</span>
                  {/* Sem link "ver página": páginas de nicho são LEGADO e nunca existirão como rota.
                      A superfície viva é o hub /atrativos. */}
                  <span className="text-[11px]" style={MUTED}>hub: /atrativos</span>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-xs max-w-3xl" style={MUTED}>
          Um parceiro por nicho (exclusividade = proposta comercial). Vincular/desvincular controla a <b>exibição global</b> daquele
          parceiro (cards, seções, home, página própria) — não afeta a copy/SEO das páginas nem o histórico de métricas do parceiro.
        </p>
      </div>
    </main>
  );
}
