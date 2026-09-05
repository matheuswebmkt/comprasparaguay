// Filepath: components/ui/EnvioOverlay.tsx
// Version: 1.0
// Nome da Versão: "Cobertura de transição entre o submit do lead e a página de obrigado"
//
// ── O QUE ESTA PEÇA RESOLVE ──────────────────────────────────────────────────────────────────
// Ao enviar um lead (ingresso, roteiro pronto ou personalizado), o fluxo era: o CTA parava de
// carregar → o modal FECHAVA → a página de baixo ficava exposta crua por alguns instantes → só
// então o `router.push` levava pra `/obrigado`. Quem olhava via um pisca da página anterior no
// meio do caminho. O problema nunca foi a lentidão do redirect: era a exposição entre uma tela
// e outra.
//
// ── POR QUE ELE VIVE NO ROOT LAYOUT, E NÃO DENTRO DO MODAL ───────────────────────────────────
// ⚠️⚠️ ESTA É A DECISÃO CENTRAL. O `TicketOfferModal` faz `setOpen(false)` ANTES do `router.push`,
// e tem um `if (!open) return null` — ou seja, um overlay renderizado lá dentro morreria no exato
// instante em que ele precisa aparecer. Montado no `app/layout.tsx`, este componente sobrevive à
// navegação de client do App Router: ele atravessa o `push` e só some quando a rota nova commita.
// Não mover para dentro de modal nenhum.
//
// ── COMO ELE SOME ────────────────────────────────────────────────────────────────────────────
// Por `usePathname()`: pathname diferente do de quando o envio começou = rota nova renderizada.
// É literalmente "só quando a página de destino aparece", que é o comportamento pedido.
//
// ⚠️ O TIMEOUT DE SEGURANÇA NÃO É ENFEITE. Se a navegação falhar (rede caindo no meio, erro de
// rota), sem ele a pessoa fica presa num blur permanente, sem nada clicável — DEPOIS de já ter
// enviado o lead. O lead está salvo, mas a experiência é pior que o defeito original. O overlay
// se desarma sozinho e devolve a tela.

"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { MODAL_UI } from "@/lib/i18n/modal";

/** Evento que liga o overlay. Mesmo idioma de `ticket-offer:open` (TicketOfferButton). */
export const ENVIO_EVENT = "lead:enviando";

/** Rede de segurança: navegação que não completa não pode deixar a tela travada. */
const LIMITE_MS = 12_000;

export default function EnvioOverlay() {
  const { locale } = useLocale();
  const ui = MODAL_UI[locale];
  const pathname = usePathname();
  const [ativo, setAtivo] = useState(false);
  /** Pathname de onde o envio partiu — o overlay some quando ele MUDA. */
  const origem = useRef<string | null>(null);

  useEffect(() => {
    const ligar = () => {
      origem.current = window.location.pathname;
      setAtivo(true);
    };
    window.addEventListener(ENVIO_EVENT, ligar);
    return () => window.removeEventListener(ENVIO_EVENT, ligar);
  }, []);

  /* Rota nova commitada → some. */
  useEffect(() => {
    if (ativo && origem.current !== null && pathname !== origem.current) {
      setAtivo(false);
      origem.current = null;
    }
  }, [pathname, ativo]);

  /* Rede de segurança (ver cabeçalho). */
  useEffect(() => {
    if (!ativo) return;
    const t = window.setTimeout(() => setAtivo(false), LIMITE_MS);
    return () => window.clearTimeout(t);
  }, [ativo]);

  if (!ativo) return null;

  return (
    <div
      /* ⓘ Scrim BRANCO, não escuro. A troca é deliberada e tem um lado bom e um ruim:
         · a favor — o destino (`/obrigado`) é claro (Areia), então a CHEGADA é imperceptível;
           um scrim escuro obrigaria a tela a escurecer e clarear de novo em menos de um segundo;
         · contra — o backdrop do `TicketOfferModal` é escuro (`rgba(15,42,71,0.45)`), então há
           uma clareada no instante em que o modal dá lugar a esta cobertura.
         O lado escuro dessa conta acontece uma vez, no começo; o claro acontece na chegada, que
         é onde a pessoa fica. Não "corrigir" isto para escuro sem refazer a conta.
         ⚠️ Com fundo claro, o texto abaixo NÃO pode ser branco — ver a cor lá. */
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-3"
      style={{
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(10px) saturate(140%)",
        WebkitBackdropFilter: "blur(10px) saturate(140%)",
      }}
      role="status"
      aria-live="polite"
    >
      {/* ⚠️ `rf-envio-spin` existe só para o `globals.css` poder SUMIR com este ícone sob
          `prefers-reduced-motion` (§10.3: toda animação nova entra naquele bloco, sem exceção).
          Lá a escolha é `display:none`, não `animation:none` — spinner parado lê como travado.
          É por isso que o RÓTULO abaixo NÃO é opcional: sem ele, quem pediu menos movimento
          ficaria sem nenhum sinal de que o envio está em curso. */}
      {/* Verde Selva âncora (`hsl(152,47%,32%)`), não a variante clara: sobre fundo branco esta é
          a que §2 mede em 4.84:1 — a clara (42%) cairia perto do limiar de 3:1 exigido para
          elemento gráfico de interface. */}
      <Loader2
        className="rf-envio-spin h-9 w-9 animate-spin"
        style={{ color: "hsl(152,47%,32%)" }}
        strokeWidth={2.5}
        aria-hidden="true"
      />
      {/* Azul Abismo — a cor de tipografia de §2. Era branco enquanto o scrim era escuro. */}
      <p className="text-sm font-bold" style={{ color: "hsl(210,60%,15%)" }}>
        {ui.finalizing}
      </p>
    </div>
  );
}
