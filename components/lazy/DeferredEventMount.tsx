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
//   3. quando o filho está pronto — e ELE avisa, chamando `onReady` depois de registrar o próprio
//      listener — o wrapper reemite o(s) evento(s) enfileirado(s).
//
// ⚠️ O handshake `onReady` NÃO é cerimônia: `next/dynamic` carrega o chunk de forma ASSÍNCRONA, então
// o filho não monta no mesmo commit em que `mounted` vira `true`. Qualquer reemissão disparada
// apenas por `mounted` (ou por efeito do pai) chega antes de o filho escutar e o primeiro clique se
// perde — o visitante precisa clicar duas vezes. O filho só avisa quando o listener dele já está
// registrado.
//
// ⚠️ `stopPropagation` só vale enquanto `ready.current` é falso — depois disso o evento segue o
// caminho normal até o listener do filho.

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

export default function DeferredEventMount({
  event,
  children,
}: {
  /** Nome do CustomEvent global que abre o componente (ex.: "ticket-offer:open"). */
  event: string;
  /** Renderiza o componente pesado — só é chamado depois do primeiro evento. */
  children: (onReady: () => void) => ReactNode;
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

  const onReady = useCallback(() => {
    if (ready.current) return;
    ready.current = true;
    const pending = queued.current;
    queued.current = [];
    for (const detail of pending) {
      window.dispatchEvent(new CustomEvent(event, { detail }));
    }
  }, [event]);

  return mounted ? <>{children(onReady)}</> : null;
}
