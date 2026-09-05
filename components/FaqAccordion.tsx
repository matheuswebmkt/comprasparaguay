// Filepath: components/FaqAccordion.tsx
// Version: 1.1
// Nome da Versão: "FAQ único do projeto — indicador em Verde Selva"
//
// ── POR QUE ESTE ARQUIVO EXISTE ───────────────────────────────────────────────────────────────
// A marcação de FAQ estava DUPLICADA em 9 lugares (home, /roteiros, /roteiros/[slug], /o-que-fazer,
// /atrativos, /atrativos/[slug], /onde-comer, nichos, tríplice). Todas quase iguais, algumas com o
// ícone "+", outras sem. Consequência prática: melhorar o FAQ da home não melhorava nenhum outro —
// exatamente o que aconteceu no passe de design (jul/2026). Agora existe UM componente.
//
// Estilo editorial de `design-system/layout-secoes.md` §8-bis: filetes finos entre itens, sem caixa
// branca com borda por pergunta. Oito retângulos idênticos empilhados leem como parede, não como
// lista de respostas.
//
// ⚠️ NÃO renderiza JSON-LD. Dado estruturado é responsabilidade da página (cada uma tem o seu
// `faqSchema(...)` com o conteúdo canônico em pt). Misturar as duas coisas aqui produziria FAQPage
// duplicado quando a página já emite o dela.
//
// Server Component: `<details>`/`<summary>` são nativos, sem estado React.

export type FaqItem = { q: string; a: string };

export default function FaqAccordion({
  items,
  className = "",
}: {
  items: FaqItem[];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <div className={className}>
      {items.map((item) => (
        <details
          key={item.q}
          className="group py-5"
          style={{ borderTop: "1px solid hsl(214,25%,88%)" }}
        >
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
            <span
              className="font-bold leading-snug"
              style={{
                color: "hsl(210,60%,15%)",
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1rem, 1.5vw, 1.125rem)",
              }}
            >
              {item.q}
            </span>
            {/* ⚠️ Verde Selva, não dourado. O glyph era `hsl(35,82%,47%)`: 3.00:1 sobre branco, que
                só passa por ser ≥24px (limiar de texto grande). §2 é direto — dourado é fundo de
                botão ou acento gráfico, NUNCA cor de texto sobre fundo claro. Este componente serve
                9 superfícies, então o dourado aqui se multiplicava pelo site inteiro. */}
            <span
              className="mt-0.5 shrink-0 text-2xl leading-none transition-transform duration-200 group-open:rotate-45"
              style={{ color: "hsl(152,47%,34%)" }}
              aria-hidden="true"
            >
              +
            </span>
          </summary>
          <p
            className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed"
            style={{ color: "hsl(210,25%,40%)" }}
          >
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}
