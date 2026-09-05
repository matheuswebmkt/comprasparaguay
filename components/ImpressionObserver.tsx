// Filepath: components/ImpressionObserver.tsx
// Version: 1.0
// Nome da Versão: "Sentinela de impressão (IntersectionObserver → 1 evento por parceiro por sessão)"
// Baseado na Versão: N/A

"use client";

import { useEffect, useRef } from "react";
import { trackImpressionOnce } from "@/lib/track";

/**
 * Mede a IMPRESSÃO do card/seção de um parceiro: dispara um evento quando o
 * elemento-PAI (o card/seção onde este sentinela é colocado) fica ≥ `threshold`
 * visível por ~1s — o que ignora quem só passou batido no scroll. O dedupe por
 * sessão vive em trackImpressionOnce; aqui só detectamos a visibilidade real.
 * Renderiza um <span hidden> (display:none) → não afeta layout algum.
 */
export default function ImpressionObserver({
  slug,
  ctaType,
  threshold = 0.5,
}: {
  slug: string;
  ctaType: string;
  /** Fração do card/seção visível p/ contar. Seções grandes usam um valor menor. */
  threshold?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el || typeof IntersectionObserver === "undefined") return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
          // Precisa PERMANECER visível ~1s p/ contar (scroll rápido não conta).
          timer ??= setTimeout(() => {
            trackImpressionOnce(slug, ctaType);
            obs.disconnect();
          }, 1000);
        } else if (timer) {
          clearTimeout(timer);
          timer = undefined;
        }
      },
      { threshold: [0, threshold, 1] }
    );
    obs.observe(el);

    return () => {
      if (timer) clearTimeout(timer);
      obs.disconnect();
    };
  }, [slug, ctaType, threshold]);

  return <span ref={ref} className="hidden" aria-hidden="true" />;
}
