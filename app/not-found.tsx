// Filepath: app/not-found.tsx
// Version: 1.0
// Nome da Versão: "404 própria + marcador para NavigationEvents NÃO rastrear (anti-poluição de probes)"
// Baseado na Versão: N/A

import Link from "next/link";
import { Compass } from "lucide-react";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import { internalUrl } from "@/lib/utm";

export default function NotFound() {
  return (
    <>
      {/* Marcador: o NavigationEvents checa este atributo e NÃO rastreia pageview em 404
          (evita que probes de bots a caminhos inexistentes poluam as métricas). */}
      <span data-rgf-notfound hidden aria-hidden="true" />

      <Navbar />
      <main className="min-h-screen flex items-center" style={{ background: "hsl(40,33%,97%)" }}>
        <div className="section-container text-center py-28">
          <p className="text-6xl sm:text-7xl font-black tracking-tight" style={{ color: "hsl(35,82%,47%)", fontFamily: "var(--font-display)" }}>
            404
          </p>
          <h1 className="mt-4 text-2xl sm:text-3xl font-black tracking-tight" style={{ color: "hsl(210,60%,15%)", fontFamily: "var(--font-display)" }}>
            Página não encontrada
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base leading-relaxed" style={{ color: "hsl(210,25%,45%)" }}>
            O endereço que você tentou acessar não existe. Que tal voltar ao início ou explorar o que fazer em Foz?
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm text-white transition-all hover:scale-[1.04]"
              style={{ background: "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)" }}
            >
              Voltar ao início
            </Link>
            <Link
              href={internalUrl("/atrativos", "404")}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-sm border transition-all hover:scale-[1.02]"
              style={{ color: "hsl(210,56%,23%)", borderColor: "hsl(214,25%,85%)", background: "white" }}
            >
              <Compass className="h-4 w-4" aria-hidden="true" />
              O que fazer em Foz
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
