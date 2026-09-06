// Filepath: components/RoteirosCta.tsx
// Version: 3.0
// Nome da Versão: "Fechamento converte pelo modal: 'Reservar data' no lugar do botão de página e do link secundário"
//
// Fechamento compartilhado por SETE páginas (/atrativos, atrativo individual, nichos, hotel,
// /onde-comer, parceiro, /triplice-fronteira). Qualquer mudança aqui propaga para todas.
//
// ── O QUE SAIU, E NÃO VOLTA ──────────────────────────────────────────────────────────────────
//  1. FUNDO `linear-gradient(180deg, azul 40% → verde 25%)` + `borderTop`. Campo de cor
//     inventado, e ainda com DUAS hues — §8.2 admite Areia ou branco, só.
//  2. DISCO COM ÍCONE `Route` de 64px no topo. Mobília; §8-bis subtrai. O fechamento de
//     `/roteiros` tinha um disco igual (com `Compass`) e saiu pelo mesmo motivo.
//  3. CTA em `hsl(38,90%,55%) → hsl(35,82%,47%)` com rótulo `text-base`: dourado com texto
//     branco dá 3.02:1 e REPROVA WCAG AA. Só passa como texto grande, que exige ≥18px bold
//     (design-system.md §2). Agora `text-lg font-bold`, que é o que sustenta o contraste.
//  4. `max-w-xl` e `text-2xl font-bold` próprios → `.rf-head` + `.rf-title` (§8.1).
//
// ── O CTA NA v3.0: O MODAL ───────────────────────────────────────────────────
// O dourado é o `ReservarDataCta`: mesmo rótulo, mesmo modal e mesmo calendário do hero, do
// fechamento da home e do card de transfer — um funil, um caminho. Antes este botão era um `<Link>`
// para a página do atrativo (e, mais atrás, para o wizard `/montar-roteiro`, que não existe mais):
// rótulo de "reservar" que navegava para conteúdo é a promessa e a tela desalinhadas (§21.2).
// O link de texto "Ver atrativos e shoppings →", que ficava ao lado, saiu: oferecia uma saída de
// leitura exatamente no ponto de conversão. Continua UM botão cheio — §8-bis conta CTA por botão
// cheio, e link de texto na prosa não conta.

"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { SHARED_UI } from "@/lib/i18n/shared";
import ReservarDataCta from "@/components/ReservarDataCta";
import TituloComDestaque from "@/components/TituloComDestaque";

export default function RoteirosCta({
  ctaType,
  title,
  text,
}: {
  ctaType: string;
  title?: string;
  text?: string;
}) {
  const { locale } = useLocale();
  const t = SHARED_UI[locale].roteirosCta;
  return (
    /* ⓘ Fundo BRANCO, cravado. Como este bloco fecha sete páginas diferentes, não dá para garantir
       o alternado do §7.5 aqui dentro — ao padronizar cada página, conferir o tom da seção
       imediatamente acima e resolver LÁ, invertendo a penúltima seção.
       ⚠️ Este arquivo já teve uma prop `fundo: "branco" | "areia"` para isso, e ela foi retirada.
       Não porque a ideia seja errada — porque ficou sem consumidor no mesmo dia em que nasceu.
       Ela existiu por uma cauda de `/triplice-fronteira` em que NENHUM tom servia para a
       penúltima seção (Areia colidia acima, branco colidia com este bloco, e o §8.2 não tem um
       terceiro); a remoção de uma seção dissolveu o impasse. Se outra página recriar essa
       situação — e é uma situação real, não hipotética — reintroduzir a prop é a saída certa. */
    <section
      className="rf-section relative overflow-hidden"
      style={{ background: "hsl(0,0%,100%)" }}
    >
      <div
        className="rf-grain pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-multiply"
        aria-hidden
      />

      <div className="section-container relative z-10">
        {/* Sem eyebrow: é fechamento, não tema novo — a exceção que o §8.1 documenta. */}
        <div className="rf-head">
          <h2 className="rf-title" style={{ marginTop: 0 }}>
            <TituloComDestaque texto={title ?? t.title} destaque={t.titleDestaque} />
          </h2>
          <p className="rf-sub">{text ?? t.text}</p>
        </div>

        {/* ⚠️ `text-lg font-bold` não é opcional: dourado + branco dá 3.02:1 e só passa como texto
            GRANDE (§2). O `text-center` do invólucro centraliza o `inline-flex` do botão. */}
        <div className="text-center">
          <ReservarDataCta
            ctaType={ctaType}
            source={ctaType}
            className="inline-flex items-center justify-center rounded-3xl px-8 py-4 text-lg font-bold text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
            style={{
              background:
                "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
