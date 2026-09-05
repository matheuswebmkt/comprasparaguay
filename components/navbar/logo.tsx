// Filepath: components/navbar/logo.tsx
// Version: 3.0
// Nome da Versão: "Marca Compras Paraguay"
// Baseado na Versão: 2.1

import Link from "next/link";

export const Logo = () => (
  <Link
    href="/"
    aria-label="Página inicial Compras Paraguay"
    className="text-md font-bold tracking-tight text-white hover:text-white/80 transition-colors"
  >
    Compras Paraguay
  </Link>
);