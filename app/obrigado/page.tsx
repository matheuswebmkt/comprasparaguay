// Filepath: app/obrigado/page.tsx
// Versão nova (foco Compras PY): página de confirmação pós-submit, única para todos os
// produtos. O conteúdo é client (lê o handoff em sessionStorage) — esta casca server só
// monta a metadata (noindex) e o Suspense obrigatório do useSearchParams.

import type { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import ObrigadoContent from "@/components/obrigado/ObrigadoContent";

export const metadata: Metadata = {
  title: "Pedido recebido | Compras Paraguay",
  robots: { index: false, follow: false },
};

export default function ObrigadoPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "hsl(40,33%,97%)" }}>
        <Suspense fallback={null}>
          <ObrigadoContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}