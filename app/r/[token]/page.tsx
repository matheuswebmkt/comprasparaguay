// Filepath: app/r/[token]/page.tsx
// Version: 2.0
// Nome da Versão: "Página pública do pedido — link curto + botão Copiar informações para a agência"
//
// Rota CURTA de propósito (`/r/<token>`): o endereço é digitado/colado em conversa de WhatsApp, onde
// cada caractere aparece na prévia da mensagem. Toda a mensagem pronta de WhatsApp (as duas pontas:
// a que a agência/portal manda ao lead e a que o lead manda ao clicar no CTA) carrega SÓ a introdução
// + o link para cá — o detalhe do pedido (itens, data, pessoas, transporte) concentra AQUI.
//
// ⚠️⚠️ PÚBLICA PARA QUEM TEM O LINK — e por isso **sem PII**. `lib/pedido.ts` não devolve nome,
// telefone nem e-mail; não reintroduzir aqui por conveniência ("seria bom saudar pelo nome"). O mesmo
// link é colado num grupo de vendedores e reencaminhado por WhatsApp.
// ⚠️ `noindex`: pedido de uma pessoa não é conteúdo de busca, e indexar exporia o acervo de tokens.

import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import { getPedido } from "@/lib/pedido";
import { PEDIDO_UI } from "@/lib/i18n/pedido";
import { DEFAULT_PRODUCT_COPIES } from "@/lib/offer-defaults";
import { waMessageWithLink } from "@/lib/pedido-resumo";
import { VoltarButton } from "./voltar-button";
import { CopiarButton } from "./copiar-button";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  // "Resumo", não "pedido": o visitante não faz um pedido de compra aqui — ele envia o que escolheu e
  // recebe as condições depois.
  title: "Resumo — Compras Paraguay",
  robots: { index: false, follow: false },
};

const AREIA = "hsl(40,33%,97%)";
const TITULO = "hsl(210,60%,15%)";
const CORPO = "hsl(210,25%,35%)";
const SECUNDARIO = "hsl(210,25%,45%)";
const BORDA = "hsl(214,25%,90%)";
const VERDE = "hsl(152,47%,32%)";

/** DD/MM/AAAA a partir do ISO — a página não usa `toLocaleDateString` para não depender do fuso do servidor. */
function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

/** Data+hora do submit em horário curto de Brasília — mesma formatação do card do Telegram (`formatBRT`). */
function formatBRT(date: Date): string {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return "";
  }
}

function Linha({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap gap-x-2 py-1.5">
      <dt className="text-sm font-semibold" style={{ color: TITULO }}>
        {label}:
      </dt>
      <dd className="text-sm" style={{ color: SECUNDARIO }}>
        {value}
      </dd>
    </div>
  );
}

export default async function PedidoPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const pedido = await getPedido(token);
  const ui = PEDIDO_UI[pedido?.locale ?? "pt"];

  if (!pedido) {
    return (
      <>
        <Navbar />
        <main className="pt-20" style={{ background: AREIA, minHeight: "70vh" }}>
          <div className="section-container py-16 text-center">
            <h1
              className="text-3xl"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: TITULO }}
            >
              {ui.notFoundTitle}
            </h1>
            <p className="mx-auto mt-3 max-w-[52ch] leading-relaxed" style={{ color: SECUNDARIO }}>
              {ui.notFoundDesc}
            </p>
            <Link
              href="/roteiros-de-compras"
              className="mt-8 inline-flex items-center justify-center rounded-3xl px-8 py-4 text-lg font-bold text-white transition-transform hover:scale-[1.03] active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, hsl(152,47%,32%) 0%, hsl(152,50%,26%) 100%)" }}
            >
              {ui.notFoundCta}
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // CTA de conversa: mesma condição do handoff (modo do produto = whatsapp + número central).
  // A mensagem é a do bucket de produto; aqui NÃO vai link nenhum — a pessoa já está na página dele.
  const waHref = (() => {
    if (pedido.successMode !== "whatsapp" || !pedido.whatsapp) return null;
    const digits = pedido.whatsapp.replace(/\D/g, "");
    if (!digits) return null;
    const texto = waMessageWithLink(
      DEFAULT_PRODUCT_COPIES.atrativo[pedido.locale].waLeadText,
      null,
      pedido.locale,
    );
    return `https://wa.me/${digits}?text=${encodeURIComponent(texto)}`;
  })();

  // Rótulo do CTA = o MESMO botão da tela de sucesso (`waButtonLabel` do bucket do produto).
  const ctaLabel = DEFAULT_PRODUCT_COPIES.atrativo[pedido.locale].waButtonLabel;

  // Linhas do resumo — fonte ÚNICA do card e do texto do "Copiar informações" (não duplicar regra).
  const rows: { label: string; value: string }[] = [];
  if (pedido.visitDate) rows.push({ label: ui.paraODiaLabel, value: formatDate(pedido.visitDate) });
  if (pedido.isLocal !== null) {
    // INVERTIDO de propósito: o dado cru é "morador?" (isLocal), mas a linha lida como PERFIL do
    // visitante — morador=sim → turista=não, e vice-versa.
    rows.push({ label: ui.prefTurista, value: pedido.isLocal ? ui.identidade.não : ui.identidade.sim });
  }
  if (pedido.inFoz !== null) {
    rows.push({ label: ui.prefInFoz, value: pedido.inFoz ? ui.identidade.sim : ui.identidade.não });
  }
  if (pedido.ticketQty) rows.push({ label: ui.pessoasLabel, value: String(pedido.ticketQty) });
  // Reserva de data assume transporte (o modal nem pergunta): a linha diz o FATO do produto.
  if (pedido.wantsTransport !== null) rows.push({ label: ui.transporteLabel, value: ui.transporteIncluido });
  if (pedido.createdAt) rows.push({ label: ui.enviadoEmLabel, value: formatBRT(pedido.createdAt) });

  // Texto do "Copiar informações" — mesma estrutura da página, pra a agência colar no WhatsApp.
  const copyLines: string[] = [ui.titulo, ""];
  if (pedido.itens.length > 0) {
    copyLines.push(ui.itensLabel, ...pedido.itens.map((it) => `- ${it.name}`), "");
  }
  copyLines.push(ui.prefsTitle);
  for (const r of rows) copyLines.push(`${r.label}: ${r.value}`);
  const copyText = copyLines.join("\n");

  return (
    <>
      <Navbar />
      <main className="pt-20" style={{ background: AREIA }}>
        <div className="section-container py-12 sm:py-16">
          <div className="mx-auto max-w-[46rem]">
            <h1
              className="text-3xl sm:text-4xl"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: TITULO }}
            >
              {ui.titulo}
            </h1>
            <p className="mt-3 max-w-[56ch] leading-relaxed" style={{ color: SECUNDARIO }}>
              {ui.intro}
            </p>

            <div className="mt-8 rounded-2xl border bg-white p-6" style={{ borderColor: BORDA }}>
              {pedido.itens.length > 0 && (
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wide" style={{ color: VERDE }}>
                    {ui.itensLabel}
                  </h2>
                  <ul className="mt-2 space-y-1.5">
                    {pedido.itens.map((it) => (
                      <li key={it.slug} className="text-[0.9375rem]" style={{ color: CORPO }}>
                        {it.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6 border-t pt-4" style={{ borderColor: BORDA }}>
                <h2 className="text-sm font-bold uppercase tracking-wide" style={{ color: VERDE }}>
                  {ui.prefsTitle}
                </h2>
                <dl className="mt-1">
                  {rows.map((r) => (
                    <Linha key={r.label} label={r.label} value={r.value} />
                  ))}
                </dl>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <CopiarButton text={copyText} label={ui.copiarLabel} copiedLabel={ui.copiadoLabel} />
            </div>

            {waHref && (
              <div className="mt-8 text-center">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-3xl px-8 py-4 text-lg font-bold text-white transition-transform hover:scale-[1.03] active:scale-[0.98]"
                  style={{ background: "linear-gradient(135deg, hsl(152,47%,32%) 0%, hsl(152,50%,26%) 100%)" }}
                >
                  {ctaLabel}
                </a>
                <p className="mt-3 text-sm" style={{ color: SECUNDARIO }}>
                  {ui.ctaHint}
                </p>
              </div>
            )}

            {/* Navegação de saída: Voltar (histórico da aba — pode não existir num link aberto direto)
                e Página inicial. */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              <VoltarButton label={ui.voltar} />
              <Link
                href="/"
                className="group inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold underline decoration-1 underline-offset-4 transition-opacity hover:opacity-80"
                style={{ color: VERDE, textDecorationColor: "hsla(152,40%,60%,0.5)" }}
              >
                {ui.paginaInicial}
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
