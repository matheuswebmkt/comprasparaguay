// Filepath: app/r/[token]/voltar-button.tsx
// "Voltar" da página do pedido: usa o histórico da ABA (session history), não uma rota fixa —
// o lead pode ter chegado de WhatsApp (sem histórico no site) ou de navegação normal. Sem
// histórico pra voltar, o botão não faz nada — o link "Página inicial" ao lado cobre o caso.
"use client";

export function VoltarButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.history.back()}
      className="group inline-flex cursor-pointer items-center gap-1.5 text-[0.9375rem] font-semibold underline decoration-1 underline-offset-4 transition-opacity hover:opacity-80"
      style={{ color: "hsl(152,47%,32%)", textDecorationColor: "hsla(152,40%,60%,0.5)" }}
    >
      {label}
    </button>
  );
}
