// Filepath: components/TituloComDestaque.tsx
// Version: 1.1
// Nome da Versão: "Suporta múltiplos trechos de destaque (`destaque: string | string[]`) — o título
// 'Mais de três dias?' do hub /roteiros destaca 'roteiro' e 'montado'. Retrocompatível: string
// continua com o comportamento exato de antes."
//
// Renderiza um título com UM ou MAIS trechos em itálico Verde Selva. É a assinatura visual das heros do
// projeto: "Organize seu *roteiro*", "Roteiros prontos de *1, 2 ou 3 dias*", "Os principais
// *atrativos*", "Descubra o melhor da *gastronomia*", "Mais de três dias? O *roteiro* é *montado*
// para você".
//
// ⓘ Nasceu inline em `/atrativos`, virou helper local em `/onde-comer` (que usa o padrão duas
// vezes) e foi promovido a componente quando `/triplice-fronteira` precisou dele. Três cópias da
// mesma lógica é onde ela começa a divergir.

import type { ReactNode } from "react";

export default function TituloComDestaque({
  texto,
  destaque,
}: {
  texto: string;
  /** Substring(s) de `texto` que recebem o destaque. */
  destaque: string | string[];
}) {
  const trechos = (Array.isArray(destaque) ? destaque : [destaque]).filter(Boolean);
  if (trechos.length === 0) return <>{texto}</>;

  /* ⚠️ DEGRADAÇÃO DELIBERADA (regra original preservada): se QUALQUER trecho não existir dentro de
     `texto`, o título sai inteiro, sem destaque — melhor um título sem itálico do que a frase partida
     no lugar errado. Não trocar por `split`/regex: o comportamento no "não encontrou" é o ponto. */
  if (trechos.some((t) => !texto.includes(t))) return <>{texto}</>;

  const parts: ReactNode[] = [];
  let rest = texto;
  let key = 0;
  for (const t of trechos) {
    const i = rest.indexOf(t);
    if (i < 0) continue; // inalcançável (validação acima) — segurança
    if (i > 0) parts.push(rest.slice(0, i));
    parts.push(
      <em key={key++} style={{ fontStyle: "italic", fontWeight: 500, color: "hsl(152,47%,30%)" }}>
        {t}
      </em>,
    );
    rest = rest.slice(i + t.length);
  }
  if (rest) parts.push(rest);
  return <>{parts}</>;
}
