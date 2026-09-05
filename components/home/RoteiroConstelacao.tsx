"use client";

// Filepath: components/home/RoteiroConstelacao.tsx
// Version: 2.3
// Nome da Versão: "Nós ganham escala própria em mobile/tablet, sem mexer nos anéis"
// Baseado na Versão: 1.1 — "Sequência dos 3 dias espelha o roteiro pronto 3-dias-classico"
//
// ── POR QUE A 2.0 EXISTE (defeito de mobile/tablet) ──────────────────────────────────────────
// Sintoma relatado: "aparece certo por um instante e depois quebra". Causa: havia DOIS conjuntos
// de posições (`POS_WIDE`/`POS_NARROW`) trocados por `matchMedia`, com o estado nascendo `false`
// — a primeira pintura usava um e o `useEffect` trocava pelo outro logo depois.
// E o breakpoint (940px) não era a largura em que a geometria muda: abaixo de `lg` o palco
// continua nos 560px cheios até a viewport chegar a ~608px.
// Correção: UM conjunto de posições + uma CAMADA de 560px reduzida por `scale` até caber. É o
// mesmo princípio que `components/roteiros/RoteiroDiasDemo.tsx` obtém pelo `viewBox` — e a razão
// de aquela peça nunca ter tido este defeito em largura nenhuma.
// ⚠️ O DESKTOP (`lg+`) É INTOCADO POR CONSTRUÇÃO: lá a camada volta a ser o próprio palco e a
// escala é 1, por override de classe. Ver o comentário na camada.
//
// ── O QUE ESTA PEÇA É ────────────────────────────────────────────────────────────────────────
// Um núcleo luminoso ("você") emite um filamento por vez até a miniatura de um atrativo, na
// ordem manhã → tarde → noite. Ao chegar, o atrativo é selado como concluído, o filamento recua
// para fantasma (o traçado do dia se ACUMULA) e o próximo acende. Fechado o dia, a constelação
// esvanece e o dia seguinte entra. Loop.
//
// Substitui `RoteiroLiveStack` (faixa horizontal que alternava listas de nomes no rodapé do
// hero) — DELETADO nesta rodada. O motivo da troca: a faixa só trocava texto, não comunicava
// deslocamento nem sequência; a constelação mostra o roteiro como percurso.
//
// ── DUAS ARMADILHAS JÁ PAGAS. NÃO REINTRODUZIR. ──────────────────────────────────────────────
//  1. ❌ `stroke: url(#gradiente)` nos filamentos.
//     O filamento até o atrativo da direita é quase horizontal — bounding box medida no Chrome:
//     102×8px. Com o `gradientUnits` default (`objectBoundingBox`) uma caixa degenerada assim
//     não pinta de forma confiável, e as TRÊS conexões ficavam invisíveis: a metáfora central do
//     hero simplesmente não renderizava. Stroke SÓLIDO resolve. Um traço de 3px não ganha nada
//     com gradiente — a luminosidade vem do halo desfocado e da faísca.
//  2. ❌ Desenhar a geometria dentro de `requestAnimationFrame`.
//     Em aba oculta o rAF PAUSA e o `setTimeout` CONTINUA: os dias avançavam enquanto os paths
//     nunca eram desenhados, e a constelação travava vazia. `medirEDesenhar()` roda em
//     `useLayoutEffect` (síncrono, antes do paint) e o ciclo só começa com a página visível.
//
// ── ANCORAGEM ────────────────────────────────────────────────────────────────────────────────
// O filamento termina na FOTO, não na caixa do nó: o nó inclui o texto à direita e ancorar na
// caixa inteira fazia a linha morrer no meio do nome.

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { attractions } from "@/app/data/attractions";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { HOME_UI } from "@/lib/i18n/home";
import { ATTRACTION_NAMES } from "@/lib/i18n/attractions";
import { internalUrl } from "@/lib/utm";

type Turno = "Manhã" | "Tarde" | "Pôr do sol" | "Noite";
type Parada = { slug: string; turno: Turno };
type Dia = { tema: string; paradas: Parada[] };

/** Chave do dicionário de turnos (o tipo interno continua PT; a exibição é localizada). */
const TURNO_KEY: Record<Turno, "manha" | "tarde" | "porDoSol" | "noite"> = {
  Manhã: "manha",
  Tarde: "tarde",
  "Pôr do sol": "porDoSol",
  Noite: "noite",
};

/**
 * Nome e capa vêm de `attractions.ts` — aqui só a sequência do dia.
 *
 * ⚠️ SEQUÊNCIA DO EIXO COMPRAS (Compras PY). Usa apenas os 5 atrativos do catálogo mantido
 *    (compras em Ciudad del Este, Duty Free e By Night de Puerto Iguazú, Cataratas JL e
 *    Shopping Catuaí Palladium). A animação promete ao visitante um roteiro de compras que ele
 *    pode abrir nas páginas reais de `/atrativos/[slug]`. Ao mudar o catálogo, conferir aqui.
 * ⓘ `tema` não aparece na tela — serve de `key` do React e de rótulo para quem lê o código.
 */
const DIAS: Dia[] = [
  {
    tema: "Dia de compras no Paraguai",
    paradas: [
      { slug: "compras-paraguai-ciudad-del-este", turno: "Manhã" },
      { slug: "duty-free-shop-puerto-iguazu-argentina", turno: "Tarde" },
      { slug: "by-night-argentina-puerto-iguazu", turno: "Noite" },
    ],
  },
  {
    tema: "Shoppings da fronteira",
    paradas: [
      { slug: "cataratas-jl-shopping", turno: "Manhã" },
      { slug: "shopping-catuai-palladium", turno: "Tarde" },
      { slug: "by-night-argentina-puerto-iguazu", turno: "Noite" },
    ],
  },
  {
    tema: "Compras, duty free e noite",
    paradas: [
      { slug: "duty-free-shop-puerto-iguazu-argentina", turno: "Manhã" },
      { slug: "compras-paraguai-ciudad-del-este", turno: "Tarde" },
      { slug: "by-night-argentina-puerto-iguazu", turno: "Noite" },
    ],
  },
];

const PORE_SLUG = new Map(attractions.map((a) => [a.slug, a]));

/** Posições dos nós. `x` é a BORDA ESQUERDA do nó (onde a foto começa), não o centro — o nó é
 *  largo por causa do texto à direita, e ancorar pelo centro jogaria a foto fora do palco.
 *
 *  ── ARCO SOLAR (jul/2026) ───────────────────────────────────────────────────────────────
 *  Os três nós percorrem o círculo no sentido horário, aproximadamente 45° → 115° → 205°
 *  medidos do topo: manhã a nordeste, tarde a sudeste, noite a sudoeste. É o trajeto do sol,
 *  o que dá à sequência manhã/tarde/noite uma razão espacial e não só cronológica.
 *
 *  ⚠️ Uma versão anterior punha os três num arco de ~130° todo do lado DIREITO (52/60/48% em
 *  x), o que concentrava a massa à direita e deixava ~230° do círculo vazios — reprovado pelo
 *  usuário com marcação em imagem. Ao mexer aqui, manter os três em QUADRANTES DIFERENTES.
 *
 *  ⚠️ E manter o RAIO consistente (~180px no palco de 560px). Antes eram 217/150/207px, então
 *  os nós não leiam como uma órbita só. */
/**
 * ⚠️⚠️ O NÚMERO 560 APARECE EM TRÊS LUGARES E OS TRÊS TÊM DE ANDAR JUNTOS:
 *   1. o teto do palco, aqui no JSX (`max-w-[min(560px,…)]`);
 *   2. o lado da camada de composição, aqui no JSX (`h-[560px] w-[560px]`);
 *   3. o divisor da escala, em `globals.css` (`.rf-constelacao-camada`).
 * Ele é o sistema de coordenadas em que a composição foi desenhada — não uma preferência
 * estética. Mudar um sem os outros descola a composição do palco em silêncio.
 * (Não vive numa constante TS porque dois dos três usos são string de classe e o terceiro é CSS;
 * a constante só criaria a ilusão de fonte única.)
 */

/**
 * Posições dos três nós, em % da CAMADA. Conjunto ÚNICO.
 *
 * ⚠️⚠️ HAVIA UM SEGUNDO CONJUNTO (`POS_NARROW`) trocado por `matchMedia("(max-width: 940px)")`,
 * e ele era a causa do defeito "aparece certo e depois quebra": o estado nascia `false`, então a
 * primeira pintura usava estas posições e o `useEffect` trocava logo depois pelas outras. Pior,
 * 940px não é a largura em que a geometria muda — abaixo de `lg` o palco continua nos 560px
 * cheios até a viewport chegar a ~608px, então de 609 a 940 a composição se comprimia dentro de
 * um palco que não tinha encolhido. **Não reintroduzir um segundo conjunto: quem resolve tela
 * estreita é a escala da camada, não posição alternativa.**
 */
const POS = [
  { x: 59.5, y: 32 }, // manhã — nordeste  (θ≈55°, r≈180px)
  { x: 62, y: 64 }, //   tarde — sudeste   (θ≈115°, r≈180px)
  { x: 10, y: 73 }, //   noite — sudoeste  (θ≈225°, r≈180px)
];
/** Centro do núcleo, em % da camada. Serve para `--core-x` e para o centro dos anéis. */
const CORE_X = 38;

const PASSO_MS = 1750;
const TRACO_MS = 760;

const DASH = 5;
const VAO = 6;
const PREENCHE_MS = 380;

/**
 * `stroke-dasharray` de um traçado revelado até `revelado` px, com os traços
 * preenchendo conforme `cheio` (0 = tracejado, 1 = linha cheia).
 *
 * ⚠️ POR QUE GERAR O PADRÃO A CADA FRAME. `stroke-dashoffset` apenas DESLOCA um padrão
 * fixo — ele não faz o tracejado crescer. Uma versão anterior usava só dashoffset e a
 * linha nascia inteira tracejada de uma vez, o que foi reprovado. Aqui o array é
 * reconstruído por frame: só os traços já percorridos entram, e um vão final gigante
 * esconde o resto. Assim o tracejado SE REVELA conforme o marcador avança.
 *
 * A alternativa canônica seria uma `<mask>` com reveal por dashoffset, mas máscara em
 * traço quase horizontal cai na mesma armadilha de bounding box degenerada do gradiente
 * (ver cabeçalho) e exigiria `maskUnits="userSpaceOnUse"`. Isto é mais simples.
 *
 * ⚠️ A LISTA TEM DE TER COMPRIMENTO PAR. Índice par é traço, ímpar é vão — uma lista ímpar faz
 * o SVG duplicá-la, e o último elemento passa a ser lido como TRAÇO na repetição. Uma versão
 * anterior anexava o resto não percorrido como elemento solto justamente aí, e o resultado era
 * o inverso do pretendido: a linha nascia CHEIA e ia virando tracejada. Ver o comentário no
 * ponto onde o resto é somado ao último vão.
 */
function padraoTracejado(revelado: number, total: number, cheio: number): string {
  const traco = DASH + VAO * cheio;
  const vao = VAO * (1 - cheio);
  const periodo = DASH + VAO;
  const partes: number[] = [];
  let acc = 0;
  while (acc < revelado) {
    const d = Math.min(traco, revelado - acc);
    if (d < 0.6) break; // evita traço de comprimento ~0, que com linecap redondo vira ponto
    partes.push(d, vao);
    acc += periodo;
  }
  // Nada revelado ainda: tudo vão. O ponto residual do linecap cai sob o disco "você".
  if (partes.length === 0) return `0 ${Math.max(total, 1)}`;

  /* ⚠️⚠️ O RESTO NÃO PERCORRIDO ENTRA NO ÚLTIMO VÃO — não como elemento novo.
     Em `stroke-dasharray` os índices PARES são TRAÇO e os ímpares são VÃO. O laço acima empurra
     sempre em pares (`d, vao`), então `partes` tem comprimento par e um `push` extra cairia no
     índice par: posição de TRAÇO. Era exatamente esse o defeito — o "vão final" era desenhado
     como um traço do comprimento da linha inteira, pintando de sólido todo o trecho ainda não
     percorrido. O efeito na tela era o INVERSO do pretendido: a linha nascia cheia e ia virando
     tracejada conforme os pares entravam na frente dela.
     Somando no último vão, o padrão continua com comprimento PAR (nada de duplicação implícita
     de lista ímpar pelo SVG) e o trecho não percorrido fica de fato invisível. */
  partes[partes.length - 1] += Math.max(total, 1);
  return partes.join(" ");
}

function IconeTurno({ turno }: { turno: Turno }) {
  const comum = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.1,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-2.5 w-2.5 shrink-0",
    "aria-hidden": true,
  };
  if (turno === "Noite") {
    return (
      <svg {...comum}>
        <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
      </svg>
    );
  }
  if (turno === "Pôr do sol") {
    return (
      <svg {...comum}>
        <path d="M17 18a5 5 0 0 0-10 0M12 3v4M4.9 10.9 6.3 12.3M19.1 10.9 17.7 12.3M2 18h20M6 22h12" />
      </svg>
    );
  }
  if (turno === "Tarde") {
    return (
      <svg {...comum}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M2 12h2M20 12h2M5 5l1.5 1.5M19 5l-1.5 1.5" />
      </svg>
    );
  }
  return (
    <svg {...comum}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" />
    </svg>
  );
}

export default function RoteiroConstelacao() {
  const { locale } = useLocale();
  const t = HOME_UI[locale].constelacao;
  const palco = useRef<HTMLDivElement>(null);
  /** Camada de composição: 560px fixos abaixo de `lg`, reduzida por `scale` até caber. */
  const camada = useRef<HTMLDivElement>(null);
  const nucleo = useRef<HTMLSpanElement>(null);
  const nos = useRef<Array<HTMLAnchorElement | null>>([]);
  const tracos = useRef<Array<SVGPathElement | null>>([]);
  const faiscas = useRef<Array<SVGCircleElement | null>>([]);
  const timers = useRef<number[]>([]);
  const frames = useRef<number[]>([]);
  const semMovimento = useRef(false);

  const [dia, setDia] = useState(0);
  const [ativo, setAtivo] = useState<number | null>(null);
  const [concluidos, setConcluidos] = useState(0);
  const [saindo, setSaindo] = useState(false);

  const paradas = DIAS[dia].paradas;
  const pos = POS;
  const coreX = CORE_X;

  const pararTudo = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    frames.current.forEach(cancelAnimationFrame);
    frames.current = [];
  }, []);

  const agendar = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  /** Curva do núcleo até a borda da FOTO, com controle perpendicular: sai reta e
   *  chega curvando, lendo como trajeto e não como cabo. */
  const medirEDesenhar = useCallback(() => {
    const pal = camada.current;
    const nuc = nucleo.current;
    if (!pal || !nuc) return;
    const pr = pal.getBoundingClientRect();
    if (!pr.width) return;
    /* ⚠️⚠️ AS MEDIDAS SAEM EM PIXEL DE TELA, O SVG DESENHA EM PIXEL DE CAMADA. Como a camada é
       reduzida por `transform: scale()`, `getBoundingClientRect` devolve tudo já multiplicado
       pela escala — e o `d` do path, que vive DENTRO da camada, é interpretado sem ela. Sem esta
       divisão os filamentos ficam curtos e desalinhados em toda tela abaixo de `lg`, e o erro
       cresce quanto menor o aparelho: é o modo de falha mais provável desta peça.
       ⓘ `offsetWidth` é a largura de LAYOUT (não transformada), então a razão entre os dois é a
       escala realmente aplicada — sem depender de ler a CSS var nem de saber em que breakpoint
       estamos. Se a camada deixar de ser escalada um dia, isto vira 1 sozinho. */
    const escala = pal.offsetWidth ? pr.width / pal.offsetWidth : 1;
    /* ⚠️ O filamento COMEÇA NO CENTRO do "você" e termina DENTRO da foto: as duas pontas ficam
       escondidas por baixo de elementos opacos (o disco é z-4, os nós são z-5, o SVG é z-2).
       É de propósito — assim a linha nunca aparece "descolada". Não voltar a calcular interseção
       de borda com folga: com um disco, qualquer folga vira um vão visível. */
    const nr = nuc.getBoundingClientRect();
    const ncx = (nr.left + nr.width / 2 - pr.left) / escala;
    const ncy = (nr.top + nr.height / 2 - pr.top) / escala;
    const ENTRADA = 6; // quanto o traço avança para dentro da foto

    paradas.forEach((_, i) => {
      const no = nos.current[i];
      const traco = tracos.current[i];
      if (!no || !traco) return;
      const foto = no.querySelector<HTMLElement>("[data-foto]");
      if (!foto) return;

      const fr = foto.getBoundingClientRect();
      const cx = (fr.left + fr.width / 2 - pr.left) / escala;
      const cy = (fr.top + fr.height / 2 - pr.top) / escala;
      const dx = cx - ncx;
      const dy = cy - ncy;
      const comp = Math.hypot(dx, dy) || 1;
      const ux = dx / comp;
      const uy = dy / comp;

      const x1 = ncx;
      const y1 = ncy;

      /* A meia-medida da foto também vem em pixel de tela — dividir junto, senão o traço
         entra fundo demais na foto em tela pequena. */
      const tFoto = Math.min(
        fr.width / 2 / escala / Math.abs(dx || 0.001),
        fr.height / 2 / escala / Math.abs(dy || 0.001),
      );
      const x2 = cx - dx * tFoto + ux * ENTRADA;
      const y2 = cy - dy * tFoto + uy * ENTRADA;

      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const nx = -dy / comp;
      const ny = dx / comp;
      const curva = (i === 1 ? 14 : 30) * (i === 2 ? -1 : 1);
      const d = `M ${x1} ${y1} Q ${mx + nx * curva} ${my + ny * curva} ${x2} ${y2}`;

      traco.setAttribute("d", d);
    });
  }, [paradas]);

  const zerarLinhas = useCallback(() => {
    for (let i = 0; i < 3; i++) {
      const traco = tracos.current[i];
      if (traco) {
        traco.style.transition = "none";
        traco.style.opacity = "0";
        traco.style.strokeDasharray = "0 9999"; // nada revelado
        traco.style.strokeDashoffset = "0";
      }
      const f = faiscas.current[i];
      if (f) f.style.opacity = "0";
    }
  }, []);

  const conectar = useCallback(
    (i: number, dur: number, aoChegar: () => void) => {
      const traco = tracos.current[i];
      const faisca = faiscas.current[i];
      if (!traco) {
        aoChegar();
        return;
      }
      const total = traco.getTotalLength();
      if (!total) {
        aoChegar();
        return;
      }

      traco.style.transition = "opacity .2s ease";
      traco.style.strokeDashoffset = "0";
      traco.style.strokeDasharray = padraoTracejado(0, total, 0);
      traco.style.opacity = "0.9";
      if (faisca) faisca.style.opacity = "1";

      let selado = false;
      const t0 = performance.now();
      const passo = (agora: number) => {
        const dt = agora - t0;

        /* FASE 1 — o tracejado SE REVELA enquanto o marcador percorre a curva. */
        if (dt < dur) {
          const p = dt / dur;
          const e = 1 - Math.pow(1 - p, 3);
          traco.style.strokeDasharray = padraoTracejado(total * e, total, 0);
          if (faisca) {
            const pt = traco.getPointAtLength(total * e);
            faisca.setAttribute("cx", String(pt.x));
            faisca.setAttribute("cy", String(pt.y));
          }
          frames.current.push(requestAnimationFrame(passo));
          return;
        }

        /* Chegou: o selo aparece AQUI, junto com o início do preenchimento. */
        if (!selado) {
          selado = true;
          if (faisca) faisca.style.opacity = "0";
          traco.style.opacity = "1";
          aoChegar();
        }

        /* FASE 2 — os traços crescem até se fundirem: tracejado → linha cheia. */
        const p2 = Math.min(1, (dt - dur) / PREENCHE_MS);
        const e2 = 1 - Math.pow(1 - p2, 3);
        traco.style.strokeDasharray = padraoTracejado(total, total, e2);
        if (p2 < 1) {
          frames.current.push(requestAnimationFrame(passo));
        } else {
          traco.style.strokeDasharray = `${total} 0`;
        }
      };
      frames.current.push(requestAnimationFrame(passo));
    },
    [],
  );

  /** Linha concluída recua para fantasma — o traçado do dia se acumula e a ativa
   *  continua sendo a mais forte. Segue CHEIA: cheio = percorrido. 0.22 era
   *  invisível sobre Areia; 0.38 é o piso medido. */
  const recuar = useCallback((i: number) => {
    const traco = tracos.current[i];
    if (!traco) return;
    traco.style.transition = "opacity .55s ease";
    traco.style.opacity = "0.38";
  }, []);

  const mostrarEstatico = useCallback(() => {
    for (let i = 0; i < paradas.length; i++) {
      const traco = tracos.current[i];
      if (!traco) continue;
      const total = traco.getTotalLength();
      traco.style.transition = "none";
      traco.style.strokeDasharray = total ? `${total} 0` : "none";
      traco.style.strokeDashoffset = "0";
      traco.style.opacity = "1";
    }
    setConcluidos(paradas.length);
  }, [paradas.length]);

  const rodarCiclo = useCallback(() => {
    const n = paradas.length;
    for (let i = 0; i < n; i++) {
      const base = i * PASSO_MS;
      agendar(base + 120, () => {
        setAtivo(i);
        conectar(i, TRACO_MS, () => setConcluidos(i + 1));
      });
      agendar(base + TRACO_MS + 480, () => {
        setAtivo(null);
        recuar(i);
      });
    }
    agendar(n * PASSO_MS + 780, () => setSaindo(true));
    agendar(n * PASSO_MS + 1320, () => setDia((d) => (d + 1) % DIAS.length));
  }, [paradas.length, agendar, conectar, recuar]);

  /* prefers-reduced-motion */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ler = () => {
      semMovimento.current = mq.matches;
    };
    ler();
    mq.addEventListener("change", ler);
    return () => mq.removeEventListener("change", ler);
  }, []);

  /* Geometria: SÍNCRONA, antes do paint. Ver armadilha 2 no cabeçalho.
     Reset de estado aqui evita um frame com o dia novo e os selos do dia anterior. */
  useLayoutEffect(() => {
    setAtivo(null);
    setConcluidos(0);
    setSaindo(false);
    zerarLinhas();
    medirEDesenhar();
  }, [dia, zerarLinhas, medirEDesenhar]);

  /* O ciclo */
  useEffect(() => {
    if (semMovimento.current) {
      mostrarEstatico();
      return;
    }
    if (document.hidden) return;
    rodarCiclo();
    return pararTudo;
  }, [dia, rodarCiclo, mostrarEstatico, pararTudo]);

  /* Redesenha quando o palco muda de tamanho — sem isto os filamentos apontam
     para onde as fotos estavam.
     ⓘ A ESCALA DA CAMADA NÃO É CALCULADA AQUI. Ela é 100% CSS (`.rf-constelacao-camada` no
     `globals.css`) justamente porque uma versão em JS piscava a cada refresh: o HTML do servidor
     não carregava a variável e o primeiro paint saía em escala 1. Não reintroduzir cálculo de
     escala em JS — `medirEDesenhar` lê a escala JÁ APLICADA direto do DOM. */
  useLayoutEffect(() => {
    const pal = palco.current;
    if (!pal || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => medirEDesenhar());
    ro.observe(pal);
    return () => ro.disconnect();
  }, [medirEDesenhar]);

  /* Pausa limpa em aba oculta: os timers seguiriam correndo em background e a
     constelação voltaria fora de sincronia. */
  useEffect(() => {
    const aoTrocar = () => {
      pararTudo();
      if (document.hidden || semMovimento.current) return;
      setAtivo(null);
      setConcluidos(0);
      setSaindo(false);
      zerarLinhas();
      medirEDesenhar();
      rodarCiclo();
    };
    document.addEventListener("visibilitychange", aoTrocar);
    return () => document.removeEventListener("visibilitychange", aoTrocar);
  }, [pararTudo, zerarLinhas, medirEDesenhar, rodarCiclo]);

  const irParaDia = (i: number) => {
    if (i === dia) return;
    pararTudo();
    setDia(i);
  };

  return (
    // ⚠️⚠️ `max-w` É O CONTROLE DE ALTURA DA HERO. O palco é quadrado, então a largura vira a
    // altura da linha do grid; e como o hero usa `items-center`, um palco alto centraliza a copy
    // contra ele e abre vazio ACIMA do H1. Esta é a causa do "conteúdo jogado pra baixo" — não o
    // `pt-20`, que está correto para a navbar de 64px.
    //
    // ⚠️⚠️ O TAMANHO DO PALCO É DERIVADO, NÃO ESCOLHIDO. O palco é quadrado, então a LARGURA
    // dele é a ALTURA da linha do grid do hero. Travar isso num número fixo foi a origem de uma
    // sequência inteira de defeitos: num valor a copy subia mas sobrava faixa vazia no rodapé;
    // no seguinte preenchia mas empurrava o H1 para baixo. Não existe número certo, porque a
    // grandeza certa é a ALTURA DISPONÍVEL NA VIEWPORT — que muda por tela.
    //
    //   max-w = min( 560px , calc(100svh - 144px) )
    //
    //   · `calc(100svh - 144px)` é a parte VIVA: 144 = navbar `h-16` (64px) + `py-10` da seção
    //     (80px). Em tela baixa o quadrado encolhe sozinho e nunca estoura a viewport; em tela
    //     alta ele cresce até o teto. Nenhum `pb-*` precisa ser recalibrado à mão.
    //   · `560px` NÃO é preferência estética: é o teto imposto pelos NÓS, que têm largura fixa
    //     em px (`w-[190px]`) enquanto a posição deles é em %. Acima disso o card do atrativo
    //     para de acompanhar a escala do palco e a composição se desfaz. Ao mexer na largura do
    //     nó, este teto muda junto.
    //   · A largura da coluna entra sozinha pelo `w-full` — não precisa aparecer na conta.
    //
    // ⚠️ Os RAIOS dos anéis são o outro eixo, independente do tamanho: eles definem o quanto a
    // composição preenche o próprio quadrado (ver o comentário nos `<circle>`). Palco pequeno
    // com anel curto deixa vazio mesmo cabendo na tela.
    //
    // ⚠️ A saída ÓBVIA e ERRADA aqui é puxar o palco para cima com margem negativa em vez de
    // encolher. Já foi tentado: os anéis orbitais são a moldura visível da composição e o
    // `overflow-hidden` da seção decapita o arco de cima. A opacidade baixa deles (0.13–0.20)
    // engana quem lê só o código — na tela eles aparecem.
    //
    // Centralizado, não colado à direita: com o palco menor, `ml-auto` abria um vão morto entre
    // a copy e a constelação.
    <div
      ref={palco}
      className="rf-constelacao-palco relative mx-auto aspect-square w-full max-w-[min(560px,calc(100svh_-_144px))]"
      style={
        {
          "--core-x": `${coreX}%`,
          "--core-y": "50%",
        } as React.CSSProperties
      }
    >
      {/* ══ CAMADA DE COMPOSIÇÃO ═════════════════════════════════════════════════════════════
          Abaixo de `lg` ela tem PALCO_BASE (560px) FIXOS e é reduzida por `scale` até caber no
          palco. É isto que faz a composição encolher como UM BLOCO: as posições em % passam a
          ser % de 560 sempre, e os filhos em px encolhem na mesma proporção. É o que o
          `RoteiroDiasDemo` de `/roteiros` já ganha do próprio `viewBox`, e cuja ausência aqui
          era a causa raiz — não o breakpoint.

          ⚠️⚠️ EM `lg+` A CAMADA VOLTA A SER O PRÓPRIO PALCO (`lg:h-full lg:w-full`), sem
          translate e com escala 1. Isso NÃO é detalhe: no desktop o palco tem ~463px (a coluna
          é 52fr), e uma camada de 560 escalada por 463/560 encolheria os nós em 17%. Como o
          desktop está aprovado, ele não pode ser tocado — daí os três overrides por classe.

          ⓘ A transição entre os dois modos é contínua, não um salto: abaixo de `lg` o palco
          fica nos 560px cheios até a viewport chegar a ~608px (560 + 48 de padding), e nessa
          faixa `scale` = 1 e camada = palco. A escala só começa a agir onde o palco de fato
          encolhe.

          ⓘ As classes `[--rf-*]` são propriedades arbitrárias do Tailwind: dá para variar CSS
          var por breakpoint sem JS, e é por isso que não há mais `matchMedia` aqui — era o
          `useState(false)` dele que produzia o "pisca certo e depois quebra". */}
      <div
        ref={camada}
        className="rf-constelacao-camada absolute left-1/2 top-1/2 h-[560px] w-[560px] origin-center lg:left-0 lg:top-0 lg:h-full lg:w-full"
        style={{
          transform:
            "translate(var(--rf-tx,-50%), var(--rf-ty,-50%)) scale(var(--rf-escala,1))",
        }}
      >
      {/* Anéis orbitais — sugerem raio e alcance, leitura de mapa.
          viewBox 0 0 100 100 num palco quadrado mantém os círculos circulares. */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 z-[1] h-full w-full overflow-visible"
        aria-hidden="true"
      >
        {/* ⚠️ OS RAIOS DEFINEM O QUANTO A COMPOSIÇÃO PREENCHE O PALCO — não são decoração solta.
            Com r=39 o anel externo parava em 89% do quadrado e sobravam 11% mortos em cima e
            embaixo; na hero isso vira faixa vazia visível no rodapé. Com r=47 vai a 97%.
            Ao mexer aqui, conferir os dois efeitos: o vazio no rodapé da hero E a distância
            entre o anel externo e os nós (que ficam a ~32% do palco a partir do núcleo). */}
        <g className="rf-ring-spin" style={{ transformOrigin: `${coreX}px 50px` }}>
          <circle
            cx={coreX}
            cy="50"
            r="20.5"
            fill="none"
            stroke="hsla(152,40%,30%,0.20)"
            strokeWidth="0.24"
            strokeDasharray="1.1 1.9"
          />
          <circle
            cx={coreX}
            cy="50"
            r="33.7"
            fill="none"
            stroke="hsla(152,40%,32%,0.13)"
            strokeWidth="0.24"
          />
          <circle
            cx={coreX}
            cy="50"
            r="47"
            fill="none"
            stroke="hsla(152,40%,30%,0.20)"
            strokeWidth="0.24"
            strokeDasharray="1.1 1.9"
          />
        </g>
      </svg>

      {/* Camada que troca de dia */}
      <div
        className="absolute inset-0 z-[3] transition-opacity duration-500"
        style={{ opacity: saindo ? 0 : 1 }}
      >
        <svg
          className="pointer-events-none absolute inset-0 z-[2] h-full w-full overflow-visible"
          aria-hidden="true"
        >
          {/* ⚠️ O halo desfocado por baixo do traço foi REMOVIDO: o brilho não combinava com a
              sobriedade do resto. Só a cor da linha. Não devolver `filter: blur()` aqui.
              ⚠️ stroke SÓLIDO como COR — não trocar por url(#gradiente). Ver armadilha 1. */}
          {[0, 1, 2].map((i) => (
            <path
              key={`traco-${i}`}
              ref={(el) => {
                tracos.current[i] = el;
              }}
              fill="none"
              stroke="hsl(152,50%,29%)"
              strokeWidth={2.6}
              strokeLinecap="round"
              style={{ opacity: 0, strokeDasharray: "0 9999" }}
            />
          ))}
          {/* Marcador que percorre o traçado.
              ⚠️ Era branco (`#fff`), herdado de quando havia um campo verde luminoso atrás. Com o
              fundo em Areia puro, branco sobre quase-branco ficou INVISÍVEL. Verde Selva escuro
              com anel na cor do fundo resolve e continua legível sobre a foto. */}
          {[0, 1, 2].map((i) => (
            <circle
              key={`faisca-${i}`}
              ref={(el) => {
                faiscas.current[i] = el;
              }}
              r={3.4}
              fill="hsl(152,50%,26%)"
              stroke="hsl(40,33%,97%)"
              strokeWidth={1.5}
              style={{ opacity: 0 }}
            />
          ))}
        </svg>

        {paradas.map((parada, i) => {
          const atr = PORE_SLUG.get(parada.slug);
          if (!atr) return null;
          const nome = ATTRACTION_NAMES[locale][atr.slug] ?? atr.name;
          const estaAtivo = ativo === i;
          const estaConcluido = i < concluidos;
          return (
            <Link
              key={`${dia}-${parada.slug}`}
              ref={(el) => {
                nos.current[i] = el;
              }}
              href={internalUrl(`/atrativos/${atr.slug}`, "home-hero-constelacao")}
              aria-label={`${nome} — ${t.turnos[TURNO_KEY[parada.turno]]}`}
              /* ⓘ TAMANHO CONSTANTE, sem variante `sm:`/`lg:`. Quem encolhe em tela estreita é
                 a CAMADA inteira, por escala. Variar o nó por breakpoint aqui dentro faria a
                 proporção nó/anel mudar de tela para tela — que era metade do problema: no
                 celular o nó ficava com 46% do palco e no desktop com 41%. */
              className="group absolute z-[5] flex w-[190px] items-start gap-[11px] transition-transform duration-500"
              style={{
                left: `${pos[i].x}%`,
                top: `${pos[i].y}%`,
                /* ⓘ `scale(var(--rf-item))` cresce o nó a partir do próprio centro (origem
                   padrão), então ele continua ancorado no mesmo ponto da órbita — os anéis
                   não se mexem. Em `lg` a var vale 1 e este scale é inerte.
                   ⓘ O filamento acompanha sozinho: `medirEDesenhar` mede a FOTO por
                   `getBoundingClientRect`, que já reflete este scale. */
                transform: `translateY(-50%) translateX(${estaAtivo ? "3px" : "0px"}) scale(var(--rf-item,1))`,
                transitionTimingFunction: "cubic-bezier(.3,1.3,.5,1)",
              }}
            >
              <span className="relative flex-none">
                <span
                  data-foto
                  className="relative block h-[54px] w-[54px] overflow-hidden rounded-[13px] transition-all duration-500"
                  style={{
                    transform: estaAtivo ? "scale(1.06)" : "scale(1)",
                    transitionTimingFunction: "cubic-bezier(.3,1.3,.5,1)",
                    boxShadow: estaAtivo
                      ? "0 0 0 2px hsla(152,50%,40%,0.50), 0 16px 28px -12px hsla(152,50%,14%,0.50)"
                      : estaConcluido
                        ? "0 0 0 1.5px hsla(152,47%,42%,0.60), 0 10px 20px -10px hsla(152,50%,14%,0.42)"
                        : "0 0 0 1px hsla(152,40%,30%,0.14), 0 10px 20px -10px hsla(152,50%,14%,0.42)",
                  }}
                >
                  <Image
                    src={atr.cover}
                    alt=""
                    fill
                    /* ⚠️ NÃO baixar para "56px" (a largura da caixa). Medido: com `sizes="56px"`
                       o Next servia 56×42 para uma caixa de 57×57. Com `object-cover` numa
                       fonte 4:3 dentro de caixa QUADRADA, o navegador amplia até a altura
                       cobrir — a largura efetiva vira ~76px —, e o `scale-105` mais o
                       `scale(1.06)` do item ativo levam a ~84px exibidos. Resultado: 1,5× de
                       ampliação, que o design-system §8-ter chama de "mole" e lê como barato.
                       `sizes` descreve o que o object-fit EXIGE, não a largura do quadro.
                       128px cobre DPR 1 com folga e DPR 2 via srcset. */
                    sizes="128px"
                    className="scale-105 object-cover transition-transform duration-700 group-hover:scale-[1.14]"
                  />
                </span>
                {/* Selo de concluído — o wrapper NÃO recorta (só a foto tem
                    overflow-hidden), então o offset negativo não é cortado. */}
                <span
                  aria-hidden="true"
                  className="absolute -right-1.5 -top-1.5 z-[3] flex h-5 w-5 items-center justify-center rounded-full transition-all duration-500"
                  style={{
                    background:
                      "linear-gradient(140deg, hsl(152,47%,38%), hsl(152,47%,28%))",
                    boxShadow:
                      "0 0 0 2.5px hsl(40,33%,97%), 0 4px 10px -2px hsla(152,50%,14%,0.55)",
                    transform: estaConcluido ? "scale(1) rotate(0deg)" : "scale(0) rotate(-40deg)",
                    opacity: estaConcluido ? 1 : 0,
                    transitionTimingFunction: "cubic-bezier(.3,1.7,.5,1)",
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth={3.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-[11px] w-[11px]"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              </span>

              <span className="min-w-0 pt-0.5">
                <span
                  className="block text-[0.8125rem] font-bold leading-tight transition-colors duration-300"
                  style={{ color: "hsl(210,58%,16%)", letterSpacing: "-0.008em" }}
                >
                  {nome}
                </span>
                {/* Badge de turno ABAIXO do nome. As cores são de fundo claro:
                    ele vive sobre Areia, não sobre a foto. */}
                <span
                  className="mt-[5px] inline-flex items-center gap-1 rounded-full border px-2 py-[3px] pl-[6px] text-[8.5px] font-extrabold uppercase"
                  style={{
                    background: "hsla(0,0%,100%,0.80)",
                    borderColor: "hsl(152,30%,84%)",
                    color: "hsl(152,47%,28%)",
                    letterSpacing: "0.11em",
                  }}
                >
                  <IconeTurno turno={parada.turno} />
                  {t.turnos[TURNO_KEY[parada.turno]]}
                </span>
              </span>
            </Link>
          );
        })}
      </div>

      {/* NÚCLEO — o próprio rótulo "você", em disco.
          ⚠️ O que saiu foi a ESFERA VERDE com ponto de luz (gradiente radial branco → verde claro
          + três sombras de glow): o brilho não combinava com a sobriedade do resto, e o verde
          luminoso lia como menta mesmo na hue 152 — gradiente radial claro desloca a percepção de
          cor. **Os anéis pulsando FICARAM** (`rf-core-ring`); são eles que dão vida ao centro.
          ⚠️ REDONDO, não pílula. Com pílula, a interseção do filamento acontece no RETÂNGULO, cujos
          cantos passam da borda visível — as linhas pareciam descoladas. Em disco, o filamento sai
          do CENTRO e o disco (opaco) cobre a origem: a linha passa POR BAIXO, que é a leitura certa.
          Por isso o fundo tem de continuar OPACO — translúcido deixa o traço aparecer atravessando. */}
      <div
        className="pointer-events-none absolute z-[4]"
        style={{
          left: "var(--core-x)",
          top: "var(--core-y)",
          transform: "translate(-50%,-50%)",
        }}
        aria-hidden="true"
      >
        <span
          ref={nucleo}
          className="relative flex h-14 w-14 items-center justify-center rounded-full border text-[9.5px] font-bold uppercase"
          style={{
            color: "hsl(152,47%,28%)",
            background: "hsl(40,33%,98%)",
            borderColor: "hsla(152,38%,58%,0.8)",
            letterSpacing: "0.14em",
            boxShadow: "0 2px 12px -4px hsla(152,50%,20%,0.26)",
          }}
        >
          {t.coreLabel}
          <span
            className="rf-core-ring absolute rounded-full"
            style={{ inset: "-6px", border: "1.5px solid hsla(152,45%,42%,0.5)" }}
          />
          <span
            className="rf-core-ring absolute rounded-full"
            style={{
              inset: "-6px",
              border: "1.5px solid hsla(152,45%,42%,0.5)",
              animationDelay: "1.5s",
            }}
          />
        </span>
      </div>

      {/* Chip do dia — ancorado ao NÚCLEO, não ao topo do palco: lê como rótulo do ponto de
          partida e acompanha --core-y em qualquer breakpoint.
          Ele é o QUARTO elemento da composição: ocupa o quadrante noroeste, que os três nós
          deixam livre. Subiu de -116px para -152px justamente para preencher esse vazio (o
          usuário marcou o canto superior esquerdo como área morta). */}
      <div
        className="absolute left-0 z-[6] min-w-[186px] rounded-2xl px-[15px] pb-[13px] pt-3"
        style={{
          top: "calc(var(--core-y) - 152px)",
          background: "hsla(0,0%,100%,0.66)",
          backdropFilter: "blur(18px) saturate(170%)",
          WebkitBackdropFilter: "blur(18px) saturate(170%)",
          boxShadow:
            "inset 0 0 0 1px hsla(0,0%,100%,0.75), 0 16px 34px -18px hsla(152,50%,14%,0.40)",
        }}
      >
        <span
          className="block text-[9.5px] font-extrabold uppercase"
          style={{ color: "hsl(152,47%,30%)", letterSpacing: "0.2em" }}
        >
          {t.dayChip(dia + 1, DIAS.length)}
        </span>
        <span
          className="mt-[3px] block text-[1.0625rem] transition-opacity duration-300"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            lineHeight: 1.2,
            letterSpacing: "-0.012em",
            color: "hsl(210,58%,16%)",
            opacity: saindo ? 0 : 1,
          }}
        >
          {t.themes[dia]}
        </span>
        <div className="mt-2.5 flex gap-[5px]" role="group" aria-label={t.pickDayLabel}>
          {DIAS.map((d, i) => (
            <button
              key={d.tema}
              type="button"
              onClick={() => irParaDia(i)}
              aria-current={i === dia}
              aria-label={t.pickDayAria(i + 1, t.themes[i])}
              className="h-1 flex-1 rounded-full transition-colors duration-500"
              style={{
                background: i === dia ? "hsl(152,47%,34%)" : "hsla(152,32%,52%,0.28)",
              }}
            />
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
