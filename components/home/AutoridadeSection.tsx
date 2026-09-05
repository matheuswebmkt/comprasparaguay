// Filepath: components/home/AutoridadeSection.tsx
// Version: 2.3
// Nome da Versão: "Fundo vira BRANCO — a entrada do transfer na home deslocou a alternância (§7.5)."
// Baseado na Versão: 2.2 ("afirmações reordenadas — humano, compromisso, orçamento — e peso suavizado
// de semibold para normal").
//
// A PROVA (§21.1 camada 4) + o MECANISMO (os 3 passos, migrados do ComoFunciona por decisão do
// usuário — a seção foi removida da home). O loop de destaque segue o padrão §7.3: um passo em
// destaque por vez, pausa no hover/foco, e `prefers-reduced-motion` desliga o ciclo E o
// esmaecimento (todos legíveis ao mesmo tempo).
// Ordem (pedido do usuário): mecanismo → divisória fina e sutil → afirmações.
// Estrelas = COMPROMISSO (não avaliação): contorno dourado (`fill="none"`) — dourado como
// ACENTO GRÁFICO é permitido (§2 proíbe dourado como COR DE TEXTO, não como desenho).
// Copy i18n-izada (lib/i18n/home.ts). Ajuste de §21 na migração: "para o seu ritmo" (não "perfil", §21.5).
// Nenhuma afirmação de gratuidade nesta seção — §21.4 proíbe as duas formas ("grátis" E "por nossa conta").

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Star, CheckCircle2, Wallet } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { HOME_UI } from "@/lib/i18n/home";
import TituloComDestaque from "@/components/TituloComDestaque";

const CICLO_MS = 3200;

export default function AutoridadeSection() {
  const { locale } = useLocale();
  const t = HOME_UI[locale].autoridade;
  const PASSOS = t.passos;
  const [ativo, setAtivo] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [semMovimento, setSemMovimento] = useState(false);
  const timer = useRef<number | null>(null);
  const numPassos = PASSOS.length;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ler = () => setSemMovimento(mq.matches);
    ler();
    mq.addEventListener("change", ler);
    return () => mq.removeEventListener("change", ler);
  }, []);

  useEffect(() => {
    if (semMovimento || pausado) return;
    timer.current = window.setInterval(
      () => setAtivo((i) => (i + 1) % numPassos),
      CICLO_MS,
    );
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [semMovimento, pausado, numPassos]);

  /** Com reduced-motion, todo passo é "ativo": ninguém esmaece. */
  const destacado = (i: number) => semMovimento || i === ativo;

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

        {/* MECANISMO — os 3 passos (migrados do ComoFunciona; loop de destaque §7.3).
            ⚠️ O loop PAUSA no hover/foco, e apontar para um passo o torna o ativo. */}
        <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Passos — empilhados à esquerda */}
          <ol
            className="flex flex-col gap-10"
            onMouseEnter={() => setPausado(true)}
            onMouseLeave={() => setPausado(false)}
            onFocusCapture={() => setPausado(true)}
            onBlurCapture={() => setPausado(false)}
          >

          {PASSOS.map((p, i) => {
            const on = destacado(i);
            return (
              <li
                key={p.n}
                className="relative transition-opacity duration-700"
                style={{ opacity: on ? 1 : 0.45 }}
                onMouseEnter={() => setAtivo(i)}
              >
                <div
                  className="relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-700"
                  style={{
                    background: on ? "hsl(152,47%,32%)" : "hsl(214,50%,94%)",
                    color: on ? "#fff" : "hsl(210,25%,50%)",
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: "1.125rem",
                    transform: on ? "scale(1.1)" : "scale(1)",
                    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                    boxShadow: on
                      ? "0 10px 22px -8px hsla(152,50%,20%,0.45)"
                      : "none",
                  }}
                >
                  {p.n}
                  {/* Pulse só no ativo — e nunca sob reduced-motion. */}
                  {i === ativo && !semMovimento && (
                    <span
                      className="rf-step-pulse pointer-events-none absolute inset-0 rounded-full"
                      style={{ border: "1.5px solid hsla(152,47%,40%,0.65)" }}
                      aria-hidden="true"
                    />
                  )}
                </div>
                <h3
                  className="mt-5 text-lg font-bold leading-snug transition-colors duration-700"
                  style={{
                    color: on ? "hsl(210,60%,15%)" : "hsl(210,25%,42%)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {p.titulo}
                </h3>
                <p
                  className="mt-2.5 text-sm leading-relaxed"
                  style={{ color: "hsl(210,25%,45%)" }}
                >
                  {p.texto}
                </p>
              </li>
            );
          })}
        </ol>

        {/* Imagem da especialista — direita */}
        <div className="overflow-hidden rounded-3xl shadow-tef-lg">
          <Image
            src="/images/especialista-roteiro-foz.webp"
            alt={t.imgAlt}
            width={1121}
            height={1401}
            sizes="(max-width: 1024px) 100vw, 520px"
            className="h-auto w-full"
          />
        </div>
        </div>

        {/* Divisória fina e sutil — separa o mecanismo das afirmações */}
        <div
          className="mx-auto mt-14 h-px max-w-5xl"
          style={{ background: "hsl(214,25%,90%)" }}
          aria-hidden="true"
        />

        {/* Afirmações — humano, compromisso, orçamento (ícones combinam com a afirmação, não com a
            posição: CheckCircle2 = revisão humana, estrelas = compromisso, Wallet = orçamento).
            Estrelas: contorno dourado, acento gráfico §2 — são promessa, não avaliação.
            Peso normal (não semibold) por decisão do usuário. */}
        <div className="mx-auto mt-14 grid max-w-5xl gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <CheckCircle2
              className="h-6 w-6"
              style={{ color: "hsl(152,47%,32%)" }}
              aria-hidden="true"
            />
            <p
              className="mt-3 text-base font-normal italic leading-snug"
              style={{ color: "hsl(210,60%,15%)" }}
            >
              {t.afirma2}
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="flex gap-1" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star
                  key={i}
                  className="h-6 w-6"
                  fill="none"
                  style={{ color: "hsl(35,82%,47%)" }}
                />
              ))}
            </div>
            <p
              className="mt-3 text-base font-normal italic leading-snug"
              style={{ color: "hsl(210,60%,15%)" }}
            >
              {t.afirma1}
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <Wallet
              className="h-6 w-6"
              style={{ color: "hsl(152,47%,32%)" }}
              aria-hidden="true"
            />
            <p
              className="mt-3 text-base font-normal italic leading-snug"
              style={{ color: "hsl(210,60%,15%)" }}
            >
              {t.afirma3}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
