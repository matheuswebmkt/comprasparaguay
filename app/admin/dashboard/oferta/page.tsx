// Filepath: app/admin/dashboard/oferta/page.tsx
// Version: 1.1
// Nome da Versão: 'Seção "Ingresso por atrativo" saiu do admin — nada por atrativo a configurar'

import Link from "next/link";
import { cookies } from "next/headers";
import { SlidersHorizontal, LogOut, ArrowLeft, Inbox, Building2 } from "lucide-react";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import {
  getOfferConfig, getAgencyAcceptLocals, getAgencyChatIdRaw, getAgencyGroupNotifyEnabled,
  getTransportEnabledRaw, getTransportNoAgencyEnabled, getAgencyInfoOnlyWhenNoPlan,
} from "@/lib/offer-settings";
import { getActiveAgencySlug, getActiveAgencySlugRaw } from "@/lib/agencies";
import { MUTED, TITLE } from "@/components/admin/dashboard-ui";
import RefreshButton from "@/components/admin/RefreshButton";
import OfferModeControl from "@/components/admin/OfferModeControl";

export const dynamic = "force-dynamic";

export default async function OfferPage() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const secret = process.env.AUTH_SECRET;
  const email = token && secret ? await verifySessionToken(token, secret) : null;

  const [
    config, agencyAcceptLocals, agencyChatId, agencyGroupNotifyEnabled,
    transportEnabledRaw, transportNoAgencyEnabled, agencyInfoOnlyNoPlan,
    activeAgencySlugRaw, activeAgencySlug,
  ] = await Promise.all([
    getOfferConfig(),
    getAgencyAcceptLocals(),
    getAgencyChatIdRaw(),

    getAgencyGroupNotifyEnabled(),
    getTransportEnabledRaw(),
    getTransportNoAgencyEnabled(),
    getAgencyInfoOnlyWhenNoPlan(),
    getActiveAgencySlugRaw(), // placement puro (ignora plano) — distingue "sem agência" de "plano vencido"
    getActiveAgencySlug(),    // já plan-gated internamente (null se plano não vigente)
  ]);
  // Ativa = placement (qual entidade) · PlanActive = ATIVA + plano vigente (visibilidade global no site).
  // Não repetir a checagem de plano aqui (ex.: chamar isPlanCurrentlyActive de novo) — getActiveAgencySlug
  // já faz esse gate internamente; duplicar custa um ciclo extra e caro de ensure() no load da página.
  const agencyActive = Boolean(activeAgencySlugRaw);
  const agencyPlanActive = Boolean(activeAgencySlug);

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
          <SlidersHorizontal className="h-5 w-5" style={{ color: "hsl(38,90%,55%)" }} aria-hidden="true" />
          <span className="font-bold text-sm">Oferta · Compras Paraguay</span>
        </div>
        <div className="flex items-center gap-2">
          <HeaderLink href="/admin/dashboard" icon={<ArrowLeft className="h-3.5 w-3.5" />} label="Métricas" />
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

      <div className="section-container py-10 max-w-4xl">
        <div className="mb-8">
          {email && <p className="text-xs" style={MUTED}>{email}</p>}
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ ...TITLE, fontFamily: "var(--font-display)" }}>
            Editor de oferta
          </h1>
          <p className="text-sm mt-1" style={MUTED}>Defina o fluxo (captura, modal, bot), o link direto e todos os textos do modal.</p>
        </div>

        <OfferModeControl
          initial={config}
          agencyAcceptLocals={agencyAcceptLocals}
          agencyChatId={agencyChatId}
          agencyGroupNotifyEnabled={agencyGroupNotifyEnabled}

          transportEnabledRaw={transportEnabledRaw}
          transportNoAgencyEnabled={transportNoAgencyEnabled}
          agencyInfoOnlyNoPlan={agencyInfoOnlyNoPlan}
          agencyActive={agencyActive}
          agencyPlanActive={agencyPlanActive}
        />
      </div>
    </main>
  );
}
