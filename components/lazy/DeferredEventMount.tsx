"use client";

// Filepath: components/lazy/DeferredEventMount.tsx
// Version: 1.0
// Nome da Versão: "Monta componente client pesado sob demanda, sem perder o evento global que o abre"
//
// Por que existe: os modais do site (reserva, parceiro, contato) são componentes client grandes
// montados no root layout, então entram no bundle inicial de TODAS as páginas mesmo quando a
// maioria das visitas nunca os abre. `next/dynamic(..., { ssr: false })` tira eles do bundle
// inicial — mas cria uma janela de corrida: o `TicketOfferButton` dispara um CustomEvent global
// SEMPRE, e se o clique chegar antes de o chunk montar, o modal nunca abre.
//
// Este wrapper resolve a corrida em três passos:
//   1. escuta o evento em FASE DE CAPTURA enquanto o pesado não montou (o listener do filho ainda
//      não existe);
//   2. enfileira o `detail` e dispara o import;
//   3. quando o filho monta, o efeito DESTE pai roda DEPOIS dos efeitos do filho (React executa
//      efeitos de baixo para cima) — logo o listener do filho já está registrado — e reemite o(s)
//      evento(s) enfileirado(s).
//
// ⚠️ Não trocar a ordem por `useLayoutEffect` no pai nem reemitir fora do efeito de `mounted`:
// a garantia de que o filho já escuta depende de o efeito do pai rodar depois do efeito do filho.
// ⚠️ `stopPropagation` só vale enquanto `ready.current` é falso — depois disso o evento segue o
// caminho normal até o listener do filho.

import { useEffect, useRef, useState, type ReactNode } from "react";

export default function DeferredEventMount({
  event,
  children,
}: {
  /** Nome do CustomEvent global que abre o componente (ex.: "ticket-offer:open"). */
  event: string;
  /** Renderiza o componente pesado — só é chamado depois do primeiro evento. */
  children: () => ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const ready = useRef(false);
  const queued = useRef<unknown[]>([]);

  useEffect(() => {
    const capture = (e: Event) => {
      if (ready.current) return;
      e.stopPropagation();
      queued.current.push((e as CustomEvent).detail);
      setMounted(true);
    };
    window.addEventListener(event, capture, true);
    return () => window.removeEventListener(event, capture, true);
  }, [event]);

  useEffect(() => {
    if (!mounted) return;
    ready.current = true;
    const pending = queued.current;
    queued.current = [];
    for (const detail of pending) {
      window.dispatchEvent(new CustomEvent(event, { detail }));
    }
  }, [mounted, event]);

  return mounted ? <>{children()}</> : null;
}
