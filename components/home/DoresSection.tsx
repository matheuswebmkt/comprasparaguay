// Filepath: components/home/DoresSection.tsx
// Version: 1.0
// Nome da Versão: "Seção da dor — o cenário de quem planeja Foz por conta própria"
//
// Segunda dobra da home (logo após o hero): EMPATIA, não prova. O visitante se vê nos 8
// momentos (tempo, paralisia de escolha, horário, orçamento, fronteira, antecipação,
// logística, perda). Sem CTA (§8-bis — um CTA por seção; quem fecha a ideia é a próxima,
// AutoridadeSection). Fundo branco (alternância §7.5: hero areia → esta branco → autoridade
// areia → AutoridadeSection areia).

"use client";

import { Search, Compass, Clock, Wallet, Banknote, Ticket, Luggage, XCircle } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { HOME_UI } from "@/lib/i18n/home";
import TituloComDestaque from "@/components/TituloComDestaque";

const ICONES = [Search, Compass, Clock, Wallet, Banknote, Ticket, Luggage, XCircle];

export default function DoresSection() {
  const { locale } = useLocale();
  const t = HOME_UI[locale].dores;
  return (
    <section className="rf-section" style={{ background: "hsl(0,0%,100%)" }}>
      <div className="section-container">
        <div className="rf-head">
          <p className="rf-eyebrow">{t.eyebrow}</p>
          <h2 className="rf-title">
            <TituloComDestaque texto={t.title} destaque={t.titleDestaque} />
          </h2>
          <p className="rf-sub">{t.subtitle}</p>
        </div>

        {/* As 8 dores — linhas curtas, sem caixa (a dor é contexto, não catálogo — §8-bis) */}
        <ul className="mx-auto mt-10 grid max-w-4xl gap-x-10 gap-y-6 sm:grid-cols-2">
          {t.items.map((text, i) => {
            const Icon = ICONES[i] ?? Search;
            return (
              <li key={text} className="flex items-start gap-3">
                <Icon
                  className="mt-0.5 h-5 w-5 flex-shrink-0"
                  style={{ color: "hsl(152,47%,32%)" }}
                  aria-hidden="true"
                />
                <span className="text-base leading-relaxed" style={{ color: "hsl(210,25%,35%)" }}>
                  {text}
                </span>
              </li>
            );
          })}
        </ul>

        {/* Ponte para a autoridade (sem CTA) */}
        <p
          className="mx-auto mt-12 max-w-3xl text-center text-lg font-semibold leading-snug"
          style={{ color: "hsl(210,60%,15%)", fontFamily: "var(--font-display)" }}
        >
          {t.bridge}
        </p>
      </div>
    </section>
  );
}
