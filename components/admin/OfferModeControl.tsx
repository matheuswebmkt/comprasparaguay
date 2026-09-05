// Filepath: components/admin/OfferModeControl.tsx
// Version: 6.0
// Nome da Versão: "Remove 'Ação para parceiros' (seção 4) e 'Hotel' (seção 6) por completo — sem função no modal nem envio pro Telegram; renumera Agência→4 e Ingresso por atrativo→5"
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, AlertTriangle, ChevronDown, ChevronRight, Pencil, X, RotateCcw, Languages } from "lucide-react";
import {
  DEFAULT_PRODUCT_COPIES,
  PRODUCT_COPY_KINDS,
  // ↩️ Reativar os editores de texto pede estes quatro de volta (ver bloco ⛔ no fim do arquivo):
  // PRODUCT_COPY_FIELDS, ATRATIVO_ONLY_COPY_FIELDS, type ModalTexts, type AtrativoLeadCopy,
  type OfferConfig,
  type RoteiroSuccessMode,
  type BotMessageMode,
  type LocalizedTexts,
  type TransportOfferTexts,
  type ProductCopies,
  type ProductCopyKind,
  type AttractionOfferMode,
  type AttractionOfferSetting,
} from "@/lib/offer-defaults";
import { officialAgencyName } from "@/app/data/agencies";
import { LOCALES, LOCALE_META, type Locale } from "@/lib/i18n/config";
import TicketOfferModal from "@/components/ticket-offer/TicketOfferModal";

const OFFICIAL_AGENCY_NAME = officialAgencyName();

interface Draft {
  roteiroSuccessMode: RoteiroSuccessMode;
  atrativoSuccessMode: RoteiroSuccessMode;
  modalWhatsapp: string;
  botMessageMode: BotMessageMode;
  texts: LocalizedTexts;
  productCopies: ProductCopies;
  agencyAcceptLocals: boolean;
  agencyDefined: boolean;
  agencyChatId: string;
  agencyGroupNotifyEnabled: boolean;
  /** Toggle INDEPENDENTE de `transportOffer.enabled` — vale só sem agência definida. */
  transportNoAgencyEnabled: boolean;
  transportOffer: { enabled: boolean; texts: Record<Locale, TransportOfferTexts> };
  /** Modo SÓ INFO — vale só sem agência com plano vigente (mesmo cenário de `transportNoAgencyEnabled`). */
  agencyInfoOnlyNoPlan: boolean;
}
const toDraft = (
  c: OfferConfig,
  acceptLocals: boolean,
  agencyChatId: string,
  agencyGroupNotifyEnabled: boolean,
  transportNoAgencyEnabled: boolean,
  // Valor BRUTO da chave da seção Agência — NÃO usar `c.transportOffer.enabled`, que é o valor EFETIVO
  // (sem agência vigente ele reflete `transportNoAgencyEnabled`, e o Salvar gravaria uma chave por cima
  // da outra).
  transportEnabledRaw: boolean,
  agencyInfoOnlyNoPlan: boolean,
): Draft => ({
  roteiroSuccessMode: c.roteiroSuccessMode,
  atrativoSuccessMode: c.atrativoSuccessMode,
  modalWhatsapp: c.modalWhatsapp ?? "",
  botMessageMode: c.botMessageMode,
  texts: { pt: { ...c.texts.pt }, en: { ...c.texts.en }, es: { ...c.texts.es } },
  productCopies: JSON.parse(
    JSON.stringify(c.productCopies ?? DEFAULT_PRODUCT_COPIES),
  ) as ProductCopies,
  agencyAcceptLocals: acceptLocals,
  agencyDefined: c.agencyDefined,
  agencyChatId,
  agencyGroupNotifyEnabled,
  transportNoAgencyEnabled,
  agencyInfoOnlyNoPlan,
  transportOffer: {
    // Bruto, não `c.transportOffer.enabled` (efetivo) — ver o comentário do parâmetro.
    enabled: transportEnabledRaw,
    texts: { pt: { ...c.transportOffer.texts.pt }, en: { ...c.transportOffer.texts.en }, es: { ...c.transportOffer.texts.es } },
  },
});

/** Linha editável de "Ingresso por atrativo" (salva em attraction_offer_settings via /api/admin/attraction-offers). */
interface AttractionRow {
  slug: string; name: string; cover: string;
  hasLink: boolean; mode: AttractionOfferMode; officialUrl: string;
  /** Só relevante quando hasLink=false — escolha própria (close/whatsapp), não herda o bucket global. */
  noLinkMode: RoteiroSuccessMode;
}
const buildAttractionRows = (
  attractions: { slug: string; name: string; cover: string; officialUrl: string }[],
  settings: AttractionOfferSetting[],
): AttractionRow[] => {
  const bySlug = new Map(settings.map((s) => [s.slug, s]));
  return attractions.map((a) => {
    const s = bySlug.get(a.slug);
    return {
      slug: a.slug, name: a.name, cover: a.cover,
      hasLink: s?.hasLink ?? true,
      mode: s?.mode ?? "direct",
      noLinkMode: s?.noLinkMode ?? "close",
      officialUrl: s?.officialUrl ?? a.officialUrl ?? "",
    };
  });
};
const toAttractionInput = (r: AttractionRow) => ({
  slug: r.slug, hasLink: r.hasLink, mode: r.mode, officialUrl: r.officialUrl, noLinkMode: r.noLinkMode,
});

// Atalhos (só PRÉ-PREENCHEM o rascunho — nada é salvo até clicar em Salvar).
const PRESETS: { key: string; label: string; patch: Partial<Draft> }[] = [
  { key: "queue",   label: "Fila",    patch: { roteiroSuccessMode: "close", atrativoSuccessMode: "close", botMessageMode: "assume" } },
  { key: "central", label: "Central", patch: { roteiroSuccessMode: "whatsapp", atrativoSuccessMode: "whatsapp", botMessageMode: "passive" } },
];

const PRODUCT_KIND_LABEL: Record<ProductCopyKind, string> = {
  atrativo: "Ingresso (atrativo)",
};

// const PRODUCT_FIELD_LABELS: Partial<Record<keyof AtrativoLeadCopy, string>> = {
//   title: "Título",
//   subtitle: "Subtítulo",
//   formHint: "Chamada acima dos campos",
//   submitLabel: "Botão de enviar",
//   successTitle: "Título do sucesso",
//   successClose: "Mensagem sucesso (só Fechar)",
//   successWhatsapp: "Mensagem sucesso (WhatsApp)",
//   subjectBadge: "Badge do card (topo)",
//   subjectIncluded: "Rótulo “incluído” no card",
//   waGreeting: "Mensagem que VOCÊ manda ao lead (Telegram → “Iniciar conversa”) — use {nome}",
//   waLeadText: "Mensagem que o LEAD manda pra você (CTA “Falar com a agência” na tela de sucesso)",
//   waButtonLabel: "Rótulo do botão — modo “Iniciar conversa” (sucesso)",
//   duplicateNoticeTitle: "Título quando a MESMA pessoa reabre este produto já enviado (descrição/botão reaproveitam os dois campos acima)",
//   // Só aparecem na aba "Ingresso (atrativo)" — ver o comentário no map dos campos.
//   successDirect: "Mensagem sucesso (Link direto) — atrativos em Modo Direto, seção 5",
//   directButtonLabel: "Rótulo do botão de link direto (sucesso)",
// };
//
// title/subtitle/formHint/submitLabel/successTitle/successClose/successWhatsapp saíram daqui (jul/2026):
// são SEMPRE sobrescritos pela seção "Textos por produto" em produção (todo CTA real define um contexto
// de produto — atrativo/roteiro/personalizar), então editá-los aqui nunca tinha efeito visível no site.
// Ficam só os campos genuinamente compartilhados entre os 3 produtos (qualificação, WhatsApp central,
// fallback de link direto).
// const FORM_FIELDS: { k: keyof ModalTexts; label: string; multiline?: boolean; hint?: string }[] = [
//   { k: "qualifyTitle", label: "Chamada/CTA antes de “morador de Foz?” (segue pra compra)", multiline: true },
//   { k: "qLocal", label: "Pergunta — morador de Foz (sempre exibida)" },
//   { k: "qInFoz", label: "Pergunta — já está em Foz (sempre que responder Não em \"morador de Foz\", com ou sem agência)" },
// ];
// A coluna "Sucesso" desta seção acabou (ago/2026): TODO texto de tela de sucesso é por produto agora.
// `waButtonLabel`/`duplicateNoticeTitle` foram pro 3b (os 3 produtos os usam) e `successDirect`/
// `directButtonLabel` também foram pro 3b, mas SÓ na aba "Ingresso (atrativo)" — ver `AtrativoLeadCopy`.
// `closeLabel` já tinha saído (jul/2026): o botão "Fechar" foi retirado do sucesso — só o "X" fecha.
// Sobrou aqui a qualificação, que é genuinamente a mesma pros três produtos.
//
const CARD = "rounded-2xl border bg-white p-5";
const BORDER = { borderColor: "hsl(214,25%,90%)" } as const;
const LABEL = { color: "hsl(210,60%,15%)" } as const;
const HINT = { color: "hsl(210,25%,50%)" } as const;
const inputCls = "w-full h-10 px-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[hsl(210,56%,23%)]/15 transition-all";
const areaCls = "w-full px-3 py-2 rounded-xl border text-sm resize-y outline-none focus:ring-2 focus:ring-[hsl(210,56%,23%)]/15 transition-all";
const inputStyle = { borderColor: "hsl(214,25%,88%)", color: "hsl(210,60%,15%)", background: "white" } as const;

export default function OfferModeControl({
  initial, agencyAcceptLocals, agencyChatId, agencyGroupNotifyEnabled,
  transportEnabledRaw, transportNoAgencyEnabled, agencyInfoOnlyNoPlan,
  agencyActive, agencyPlanActive,
  attractions, attractionSettings,
}: {
  initial: OfferConfig;
  agencyAcceptLocals: boolean;
  agencyChatId: string | null;
  agencyGroupNotifyEnabled: boolean;
  /** Valor BRUTO da chave da seção Agência (COM agência) — nunca o efetivo de `initial.transportOffer`. */
  transportEnabledRaw: boolean;
  /** Valor BRUTO do toggle "Sem agência com plano ativo". */
  transportNoAgencyEnabled: boolean;
  /** Valor BRUTO do toggle "Receber os leads no grupo e atender você mesmo" (cenário SEM agência). */
  agencyInfoOnlyNoPlan: boolean;
  /** Placement puro (/admin/dashboard/agencia, ignora plano) — distingue "sem agência selecionada" de
   * "agência selecionada mas plano vencido" (`agencyPlanActive` abaixo). */
  agencyActive: boolean;
  /** Agência com plano vigente (placement + /admin/dashboard/planos) — sem isso, "Definir agência" fica travado em Não. */
  agencyPlanActive: boolean;
  attractions: { slug: string; name: string; cover: string; officialUrl: string }[];
  attractionSettings: AttractionOfferSetting[];
}) {
  const [baseline, setBaseline] = useState<Draft>(toDraft(initial, agencyAcceptLocals, agencyChatId ?? "", agencyGroupNotifyEnabled, transportNoAgencyEnabled, transportEnabledRaw, agencyInfoOnlyNoPlan));
  const [d, setD] = useState<Draft>(toDraft(initial, agencyAcceptLocals, agencyChatId ?? "", agencyGroupNotifyEnabled, transportNoAgencyEnabled, transportEnabledRaw, agencyInfoOnlyNoPlan));
  const [attractionRowsBaseline, setAttractionRowsBaseline] = useState<AttractionRow[]>(() => buildAttractionRows(attractions, attractionSettings));
  const [attractionRows, setAttractionRows] = useState<AttractionRow[]>(() => buildAttractionRows(attractions, attractionSettings));
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  // const [showTexts, setShowTexts] = useState(false);            // seção 3 — desativada (ago/2026)
  // const [showProductTexts, setShowProductTexts] = useState(false); // seção 3b — desativada (ago/2026)
  const [showAgency, setShowAgency] = useState(false);
  const [showAttractions, setShowAttractions] = useState(false);
  const [previewKey, setPreviewKey] = useState(0); // muda a key pra remontar o preview do zero ("Reiniciar")
  const [previewStage, setPreviewStage] = useState<"form" | "success">("form"); // tabs Formulário/Sucesso
  // Estes dois sobreviveram à desativação dos editores porque a pré-visualização (seção 1) continua
  // precisando saber QUAL produto e QUAL idioma exibir — agora só pra ver, não pra editar.
  const [productKind, setProductKind] = useState<ProductCopyKind>("atrativo");
  const [activeLocale, setActiveLocale] = useState<Locale>("pt");
  const router = useRouter();

  // Plano manual: sem entidade ativa → força rascunho desligado (não dá pra habilitar no editor).
  useEffect(() => {
    if (!agencyPlanActive) {
      setD((p) => ({
        ...p,
        agencyDefined: false,
        transportOffer: { ...p.transportOffer, enabled: false },
      }));
    }
  }, [agencyPlanActive]);
  // Trocar o produto no seletor "Ver como" re-simula o preview do zero com o contexto certo (mesmo
  // mecanismo do "Reiniciar") — sem isso, ele continuaria mostrando o detail do produto anterior.
  useEffect(() => {
    setPreviewKey((k) => k + 1);
    setPreviewStage("form");
  }, [productKind]);

  // Preview ao vivo (coluna direita da linha 1/2): monta o MESMO shape do OfferConfig real a partir do
  // RASCUNHO (`d`/`attractionRows`, ainda não salvo) — o TicketOfferModal em modo `preview` consome isso
  // em vez do contexto.
  const previewOffer: OfferConfig = useMemo(() => ({
    roteiroSuccessMode: d.roteiroSuccessMode,
    atrativoSuccessMode: d.atrativoSuccessMode,
    modalWhatsapp: d.modalWhatsapp || null,
    botMessageMode: d.botMessageMode,
    texts: d.texts,
    productCopies: d.productCopies,
    agencyAcceptLocals: d.agencyAcceptLocals,
    agencyDefined: d.agencyDefined,
    // Espelha a MESMA regra do server (getOfferConfig): com agência definida manda o toggle da seção
    // Agência; sem agência, o toggle "Sem agência com plano ativo". Sem isso o preview mostraria o card
    // de transporte num cenário em que o modal real não mostra (ou o contrário).
    transportOffer: {
      ...d.transportOffer,
      enabled: d.agencyDefined ? d.transportOffer.enabled : d.transportNoAgencyEnabled,
      // `agencySlug` é `partner_slug` do pixel e só é resolvido no server (agência com plano ativo).
      // No preview fica `null` de propósito: o rascunho não conhece a agência ativa, e o modal em
      // modo `preview` não dispara evento nenhum (G9) — então não há param a preencher.
      agencySlug: null,
    },
    attractionOffers: Object.fromEntries(
      attractionRows.map((r) => [r.slug, { slug: r.slug, name: r.name, hasLink: r.hasLink, mode: r.mode, officialUrl: r.officialUrl || null, noLinkMode: r.noLinkMode }]),
    ),
  }), [d, attractionRows]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => { setSaved(false); setD((p) => ({ ...p, [k]: v })); };
  // ⛔ Setters de TEXTO desativados (ago/2026) — ver o bloco no fim do arquivo. O rascunho `d` ainda
  // CARREGA os textos (vêm do server em `toDraft` e alimentam a pré-visualização), mas nada os altera.
  // const setText = (locale: Locale, k: keyof ModalTexts, v: string) => {
  //   setSaved(false);
  //   setD((p) => ({ ...p, texts: { ...p.texts, [locale]: { ...p.texts[locale], [k]: v } } }));
  // };
  // const setProductCopy = (
  //   kind: ProductCopyKind,
  //   locale: Locale,
  //   field: keyof AtrativoLeadCopy,
  //   v: string,
  // ) => {
  //   setSaved(false);
  //   setD((p) => ({
  //     ...p,
  //     productCopies: {
  //       ...p.productCopies,
  //       [kind]: {
  //         ...p.productCopies[kind],
  //         [locale]: { ...p.productCopies[kind][locale], [field]: v },
  //       },
  //     },
  //   }));
  // };
  // const setTransportText = (locale: Locale, patch: Partial<TransportOfferTexts>) => {
  //   setSaved(false);
  //   setD((p) => ({ ...p, transportOffer: { ...p.transportOffer, texts: { ...p.transportOffer.texts, [locale]: { ...p.transportOffer.texts[locale], ...patch } } } }));
  // };
  const setTransportMeta = (patch: Partial<Pick<Draft["transportOffer"], "enabled">>) => {
    setSaved(false); setD((p) => ({ ...p, transportOffer: { ...p.transportOffer, ...patch } }));
  };
  const setAttractionRow = (slug: string, patch: Partial<Omit<AttractionRow, "slug" | "name" | "cover">>) => {
    setSaved(false);
    setAttractionRows((p) => p.map((r) => (r.slug === slug ? { ...r, ...patch } : r)));
  };
  const applyPreset = (patch: Partial<Draft>) => { setSaved(false); setD((p) => ({ ...p, ...patch })); };

  // Campos de TEXTO protegidos: travados por padrão; edita pelo ícone; ✓ confirma, ✗ cancela e reverte.
  // O `id` inclui o idioma ativo — troca de aba PT/EN/ES não herda um campo travado aberto de outro idioma.
  const [editingField, setEditingField] = useState<string | null>(null);
  const [fieldBackup, setFieldBackup] = useState("");
  const startField = (id: string, current: string) => { setFieldBackup(current); setEditingField(id); };
  const confirmField = () => setEditingField(null);
  const cancelField = (restore: (v: string) => void) => { restore(fieldBackup); setEditingField(null); };
  const lockedField = (
    id: string, value: string, onChange: (v: string) => void,
    opts?: { multiline?: boolean; maxLength?: number; placeholder?: string },
  ) => (
    <LockedField
      value={value} onChange={onChange}
      editing={editingField === id}
      onEdit={() => startField(id, value)}
      onConfirm={confirmField}
      onCancel={() => cancelField(onChange)}
      multiline={opts?.multiline} maxLength={opts?.maxLength} placeholder={opts?.placeholder}
    />
  );

  const dirty =
    JSON.stringify(d) !== JSON.stringify(baseline) ||
    JSON.stringify(attractionRows) !== JSON.stringify(attractionRowsBaseline);
  const usesWhatsapp =
    d.roteiroSuccessMode === "whatsapp" ||
    d.atrativoSuccessMode === "whatsapp" ||
    attractionRows.some((r) => !r.hasLink && r.noLinkMode === "whatsapp");
  const collision = usesWhatsapp && d.botMessageMode === "assume";
  const centralIncomplete = usesWhatsapp && d.modalWhatsapp.replace(/\D/g, "").length < 10;
  // Atrativos marcados como "Direto" que não têm URL — a seção 5 não resolve e a decisão volta pro
  // bucket global da seção 1 sem avisar ninguém. Ver o comentário no card do atrativo.
  const directWithoutUrl = attractionRows.filter(
    (r) => r.hasLink && r.mode === "direct" && !r.officialUrl.trim(),
  );

  const save = async () => {
    setSaving(true);
    try {
      const H = { "Content-Type": "application/json" };
      // ⛔ `texts` e `productCopies` NÃO vão no payload (ago/2026): o modal é editado só em
      // `lib/offer-defaults.ts`. Mandá-los aqui regravaria os textos no `app_settings` a cada Salvar,
      // congelando os valores de hoje — depois disso mexer no código não mudaria nada no site. O server
      // também ignora (ver o bloco ⛔ em `saveOfferConfig`); esta é a primeira das duas trancas.
      // ↩️ Pra reativar a edição no admin, volte `texts`/`productCopies` aqui e descomente lá.
      const { texts: _texts, productCopies: _productCopies, ...behaviorOnly } = d;
      const payload = {
        ...behaviorOnly,
        // Do transporte só o toggle atravessa; título/descrição são código.
        transportOffer: { enabled: d.transportOffer.enabled, texts: undefined },
      };
      const [res1, res2] = await Promise.all([
        fetch("/api/admin/offer-config", { method: "POST", headers: H, body: JSON.stringify(payload) }),
        fetch("/api/admin/attraction-offers", { method: "POST", headers: H, body: JSON.stringify({ offers: attractionRows.map(toAttractionInput) }) }),
      ]);
      if (res1.ok) {
        const cfg = (await res1.json()) as OfferConfig;
        // As duas chaves de transporte voltam do PRÓPRIO draft (acabaram de ser gravadas): o `cfg` que a
        // rota devolve traz só o valor EFETIVO em `transportOffer.enabled`, que sem agência vigente é o
        // da outra chave — reidratar a partir dele embaralharia os dois toggles no primeiro Salvar.
        const nd = toDraft(
          cfg, d.agencyAcceptLocals, d.agencyChatId, d.agencyGroupNotifyEnabled,
          d.transportNoAgencyEnabled, d.transportOffer.enabled, d.agencyInfoOnlyNoPlan,
        );
        setBaseline(nd); setD(nd);
      }
      if (res2.ok) setAttractionRowsBaseline(attractionRows);
      if (res1.ok && res2.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={CARD} style={BORDER}>
      {/* Header + seletor de idioma + Salvar */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
        <h2 className="text-sm font-bold" style={LABEL}>Fluxo de operação do lead</h2>
        <div className="flex items-center gap-2 flex-wrap">
          {/* O seletor de idioma saiu daqui (ago/2026): não há mais campo por idioma pra ele governar.
              Ele vive dentro da pré-visualização, onde serve só pra escolher o que exibir. */}
          {saved && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: "hsl(152,47%,32%)" }}>
              <Check className="h-3.5 w-3.5" /> Salvo
            </span>
          )}
          <button
            onClick={save}
            disabled={!dirty || saving}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-transform hover:scale-[1.03] disabled:opacity-40 disabled:hover:scale-100"
            style={{ background: dirty ? "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)" : "hsl(210,15%,60%)" }}
          >
            {saving ? "Salvando…" : dirty ? "Salvar alterações" : "Salvo"}
          </button>
        </div>
      </div>
      <p className="text-xs mb-4 inline-flex items-start gap-1.5" style={HINT}>
        <Languages className="h-3.5 w-3.5 flex-none mt-0.5" />
        <span>
          Aqui você define <b>comportamento</b>, não texto. Toda a copy do modal (nos 3 idiomas) mora em{" "}
          <code>lib/offer-defaults.ts</code> — use a <b>pré-visualização</b> ao lado pra conferir como ficou.
        </span>
      </p>

      {/* Atalhos */}
      <div className="flex items-center gap-2 flex-wrap mb-4">
        <span className="text-xs" style={HINT}>Atalhos:</span>
        {PRESETS.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => applyPreset(p.patch)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors hover:bg-[hsl(214,50%,96%)]"
            style={{ ...BORDER, color: "hsl(210,56%,23%)" }}
          >
            {p.label}
          </button>
        ))}
        <span className="text-xs" style={HINT}>(só pré-preenchem — ajuste e Salve)</span>
      </div>

      {/* Aviso de colisão */}
      {collision && (
        <div className="mb-4 rounded-xl px-3 py-2 flex items-start gap-2" style={{ background: "hsl(38,80%,95%)", border: "1px solid hsl(38,70%,82%)" }}>
          <AlertTriangle className="h-4 w-4 flex-none mt-0.5" style={{ color: "hsl(35,82%,40%)" }} />
          <p className="text-xs" style={{ color: "hsl(35,82%,30%)" }}>
            <b>Possível colisão de atendimento:</b> o modal deixa o lead iniciar a conversa <b>e</b> os vendedores podem
            “Assumir” no Telegram — os dois podem atender o mesmo lead. Uso ideal: quando houver apenas um número no Telegram que recebe os leads como fonte centralizada para um ou mais vendedores.
          </p>
        </div>
      )}

      {/* Sem agência com plano ativo — MORA AQUI NO TOPO, de propósito. Este ajuste só vale quando NÃO
          há agência com plano vigente, e a seção "Agência" trava "Definir agência" exatamente nesse
          cenário: deixá-lo lá dentro escondia a configuração atrás de uma seção marcada como inativa,
          justo quando ela passa a importar. */}
      <div className="mt-4">
        <Section
          title="Sem agência com plano ativo"
          hint="O que o modal continua fazendo quando nenhuma agência está ativa (ou o plano venceu). Com agência vigente, quem manda é a seção Agência — nada aqui tem efeito."
        >
          {agencyPlanActive && (
            <p className="mb-3 text-xs px-3 py-2 rounded-lg" style={{ ...HINT, background: "hsl(214,40%,96%)" }}>
              ℹ️ Há agência com plano vigente agora — este ajuste fica guardado e passa a valer
              automaticamente se o plano vencer ou a agência for desativada.
            </p>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-semibold" style={LABEL}>Exibir o checkbox de transporte no modal</span>
            <Segmented
              options={[{ v: true, label: "Sim" }, { v: false, label: "Não" }]}
              value={d.transportNoAgencyEnabled}
              onChange={(v) => set("transportNoAgencyEnabled", v)}
            />
          </div>
          <p className="text-xs mt-1.5" style={HINT}>
            {d.transportNoAgencyEnabled
              ? "✅ Ligado: o card de transporte continua aparecendo no formulário mesmo sem agência pra atender. O lead NÃO é enviado a grupo nenhum — a resposta só é registrada (alimenta sinais de otimização de campanha). ⚠️ A copy do card (seção “Agência” → Transporte) continua sendo o que o turista lê: revise se ela promete algo que não vamos entregar agora."
              : "Desligado (padrão): sem agência vigente o card de transporte não aparece, e nenhum lead registra interesse em transporte nesse período."}
          </p>

          <div className="flex items-center gap-3 flex-wrap mt-4">
            <span className="text-xs font-semibold" style={LABEL}>Receber os leads no grupo e atender você mesmo</span>
            <Segmented
              options={[{ v: true, label: "Sim" }, { v: false, label: "Não" }]}
              value={d.agencyInfoOnlyNoPlan}
              onChange={(v) => set("agencyInfoOnlyNoPlan", v)}
            />
          </div>
          <p className="text-xs mt-1.5" style={HINT}>
            {d.agencyInfoOnlyNoPlan
              ? "✅ Ligado: sem agência com plano vigente, o lead cai no grupo do Telegram com o botão “Iniciar conversa” já liberado — você atende direto e repassa depois, em vez de perder a captura enquanto não há agência. Vale automaticamente no momento em que a agência sair do ar, inclusive por vencimento de plano, sem precisar mexer aqui de novo. Com agência ativa nada disso se aplica: aí manda a seção “2 · Mensagem do bot” (Assumir / passivo)."
              : "Desligado (padrão): sem agência vigente, o lead não gera aviso nenhum no Telegram — só fica gravado no painel de Leads."}
          </p>
          {!d.agencyInfoOnlyNoPlan && (
            <p className="text-xs mt-1.5 px-3 py-2 rounded-lg" style={{ ...HINT, background: "hsl(38,80%,95%)" }}>
              ⚠️ Esta escolha é respeitada mesmo quando o plano vence <b>em silêncio</b> (sem ninguém
              desativar nada no painel): os leads seguem sendo gravados em <b>Leads</b>, mas ninguém é
              avisado no Telegram até você religar aqui. Nada liga isto sozinho — se preferir ser avisado
              nesses períodos, deixe em <b>Sim</b> e esqueça.
            </p>
          )}
        </Section>
      </div>

      {/* Linha 2/2 — COMPORTAMENTO à esquerda (seções 1 e 2 empilhadas), PRÉ-VISUALIZAÇÃO à direita.
          Antes eram 1 e 2 lado a lado: a 1 é alta (dois cards de modo + o preview dentro) e a 2 tem três
          linhas, então a coluna direita ficava quase toda vazia. Empilhar as duas à esquerda dá uma
          altura parecida com a do modal do preview e fecha o buraco.
          `lg:` e não `sm:`: o modal do preview é largo — abaixo de ~1024px as duas colunas viram uma só.
          `items-start` pra as colunas não esticarem até a altura da mais alta. */}
      <div className="grid gap-4 lg:grid-cols-2 items-start mt-4">
        <div className="space-y-4 min-w-0">
          {/* 1 · Modal */}
          <Section title="1 · Modal — tela de sucesso" hint="O que o lead vê depois de enviar o formulário. Captura é sempre ativa — isso só decide o que aparece no final.">
            <div className="rounded-xl border p-3" style={{ borderColor: "hsl(214,25%,90%)", background: "white" }}>
              <p className="text-xs font-bold mb-2" style={LABEL}>Roteiro / personalizar</p>
              <Segmented
                options={[
                  { v: "close" as RoteiroSuccessMode, label: "Só mensagem" },
                  { v: "whatsapp" as RoteiroSuccessMode, label: "Iniciar conversa" },
                ]}
                value={d.roteiroSuccessMode}
                onChange={(v) => set("roteiroSuccessMode", v)}
              />
              <p className="mt-2 text-xs" style={HINT}>
                Sem “Link direto”: roteiro e personalizar são produto próprio Compras Paraguay — não têm site
                oficial externo pra apontar.
              </p>
            </div>

            <div className="rounded-xl border p-3 mt-3" style={{ borderColor: "hsl(214,25%,90%)", background: "white" }}>
              <p className="text-xs font-bold mb-2" style={LABEL}>Atrativos individuais</p>
              <Segmented
                options={[
                  { v: "close" as RoteiroSuccessMode, label: "Só mensagem" },
                  { v: "whatsapp" as RoteiroSuccessMode, label: "Iniciar conversa" },
                ]}
                value={d.atrativoSuccessMode}
                onChange={(v) => set("atrativoSuccessMode", v)}
              />
              <p className="mt-2 text-xs" style={HINT}>
                Vale só pros atrativos em <b>Modo Agência</b> (seção 5 · Ingresso por atrativo). Atrativos em
                <b> Modo Direto</b> sempre mostram o próprio link, direto da seção 5 — nunca caem aqui.
              </p>
            </div>

            {(d.roteiroSuccessMode === "whatsapp" || d.atrativoSuccessMode === "whatsapp") &&
              centralIncomplete && (
                <p className="mt-3 text-xs px-3 py-2 rounded-lg" style={{ color: "hsl(35,82%,40%)", background: "hsl(40,90%,96%)" }}>
                  ⚠️ O modo <b>Iniciar conversa</b> precisa do <b>número do WhatsApp</b> — está incompleto
                  em <b>“4 · Agência”</b>. Sem ele, o botão não aparece pro lead.
                </p>
              )}

          </Section>

          {/* 2 · Bot */}
          <Section title="2 · Mensagem do bot (Telegram)" hint="Como o lead chega no grupo de vendedores.">
            <Segmented
              options={[{ v: "assume" as BotMessageMode, label: "Com “Assumir Lead”" }, { v: "passive" as BotMessageMode, label: "Alerta passivo" }]}
              value={d.botMessageMode}
              onChange={(v) => set("botMessageMode", v)}
            />
            <p className="mt-2 text-xs" style={HINT}>
              {d.botMessageMode === "assume"
                ? "Fila: botão [Assumir Lead]; o WhatsApp do cliente fica oculto até um vendedor assumir."
                : "Passivo: log com nome + WhatsApp visíveis, sem botão (a agência atende sozinha)."}
            </p>
          </Section>
        </div>

        {/* Pré-visualização — SÓ LEITURA, coluna direita. Morava dentro da seção "3 · Textos do modal",
            comentada em ago/2026. Virou seção própria porque não é um editor: os seletores abaixo só
            trocam o que está sendo exibido, não alteram nada do rascunho que vai pro Salvar. */}
        <Section
          title="Pré-visualização do modal"
          hint="É o mesmo modal do site, em modo visualização — interaja à vontade: nada aqui envia lead, mensagem ou navega de verdade. Reflete o rascunho atual, antes de Salvar."
          action={
            <button type="button" onClick={() => { setPreviewKey((k) => k + 1); setPreviewStage("form"); }}
              className="inline-flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-70"
              style={{ color: "hsl(210,56%,23%)" }} title="Recomeça o preview do zero (formulário em branco)">
              <RotateCcw className="h-3 w-3" /> Reiniciar
            </button>
          }
        >
          <div className="rounded-xl border p-3 mb-3 space-y-2" style={{ borderColor: "hsl(214,25%,90%)", background: "white" }}>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold w-16 flex-none" style={LABEL}>Etapa</span>
              <Segmented
                options={[{ v: "form" as const, label: "Formulário" }, { v: "success" as const, label: "Sucesso" }]}
                value={previewStage}
                onChange={setPreviewStage}
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold w-16 flex-none" style={LABEL}>Produto</span>
              {PRODUCT_COPY_KINDS.map((k) => (
                <button key={k} type="button" onClick={() => setProductKind(k)}
                  className="rounded-xl px-2.5 py-1 text-xs font-bold border transition-all"
                  style={productKind === k
                    ? { background: "hsl(210,60%,15%)", color: "white", borderColor: "hsl(210,60%,15%)" }
                    : { background: "white", color: "hsl(210,25%,40%)", borderColor: "hsl(214,25%,88%)" }}
                >
                  {PRODUCT_KIND_LABEL[k]}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold w-16 flex-none" style={LABEL}>Idioma</span>
              <LocaleTabs value={activeLocale} onChange={setActiveLocale} />
            </div>
          </div>
          <div className="flex justify-center rounded-2xl p-3" style={{ background: "hsl(210,20%,90%)" }}>
            <TicketOfferModal key={previewKey}
              preview={{ offer: previewOffer, stage: previewStage, onStageChange: setPreviewStage, locale: activeLocale, productKind }} />
          </div>
          <p className="mt-2 text-xs" style={HINT}>
            ℹ️ Os <b>textos</b> vêm de <code>lib/offer-defaults.ts</code> e não se editam por aqui — use
            isto pra conferir o <b>comportamento</b> escolhido ao lado.
          </p>
        </Section>
      </div>

      {/* 4 · Agência (ingresso + transporte + Telegram) */}
      <div className="mt-4 rounded-xl border" style={{ borderColor: "hsl(214,25%,92%)" }}>
        <button
          type="button"
          onClick={() => setShowAgency((s) => !s)}
          className="w-full flex items-center gap-2 px-4 py-3 text-left"
        >
          {showAgency ? <ChevronDown className="h-4 w-4" style={{ color: "hsl(210,25%,45%)" }} /> : <ChevronRight className="h-4 w-4" style={{ color: "hsl(210,25%,45%)" }} />}
          <span className="text-xs font-bold" style={LABEL}>4 · Agência</span>
          <span className="text-xs" style={HINT}>(ingresso + transporte + Telegram — plano em /admin/dashboard/agencia)</span>
        </button>

        {showAgency && (
          <div className="px-4 pb-4 space-y-4 min-w-0">
            <div className="rounded-xl border p-3.5 min-w-0" style={{ borderColor: "hsl(214,25%,92%)", background: d.agencyDefined ? "hsl(214,50%,98%)" : "hsl(0,70%,97%)" }}>
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h4 className="text-xs font-bold" style={LABEL}>Oferta da agência (ingresso / transfer no modal)</h4>
                <span className="text-xs font-semibold inline-flex items-center gap-1.5" style={LABEL}>
                  Definir agência
                  <Segmented
                    options={[{ v: true, label: "Sim" }, { v: false, label: "Não" }]}
                    value={d.agencyDefined}
                    onChange={(v) => { if (agencyPlanActive) set("agencyDefined", v); }}
                    disabled={!agencyPlanActive}
                  />
                </span>
              </div>
              {!agencyPlanActive && (
                <div className="mb-2 flex items-start gap-2 rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "hsl(35,70%,75%)", background: "hsl(40,90%,96%)", color: "hsl(30,50%,28%)" }}>
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
                  {agencyActive ? (
                    <p>
                      <b>Plano interrompido</b> em{" "}
                      <Link href="/admin/dashboard/planos" className="underline font-semibold">/admin/dashboard/planos</Link>
                      . A agência está <b>oculta no site</b> (recomendação do nicho + modal). “Definir agência” e o
                      transporte ficam <b>travados em Não</b> até você <b>renovar/retomar o plano</b>. Textos/Telegram
                      continuam editáveis — e o grupo pode continuar recebendo os leads em modo informativo, ver
                      “Sem agência com plano ativo” no topo.
                    </p>
                  ) : (
                    <p>
                      <b>Nenhuma agência ativa</b> em{" "}
                      <Link href="/admin/dashboard/agencia" className="underline font-semibold">/admin/dashboard/agencia</Link>
                      . “Definir agência” e o transporte ficam <b>travados em Não</b> até você <b>Ativar</b> uma agência
                      no painel. Textos/Telegram continuam editáveis.
                    </p>
                  )}
                </div>
              )}
              <p className="text-xs mb-2" style={HINT}>
                <b>Sim</b> = agência ativa: os leads são roteados pro grupo Telegram abaixo (conforme
                “Aceitar morador local”), e o cross-sell de Transporte fica disponível em páginas de
                atrativo. <b>Não</b> = agência desativada: sem roteamento pro grupo, sem Transporte — a
                tela de sucesso segue o modo definido na seção 1.
              </p>

              {/* Canais — os dois "endereços" pra onde o lead vai. O número veio da seção 1 em ago/2026:
                  é da agência, como o id do grupo. Quem decide se o botão APARECE continua sendo o modo
                  de sucesso da seção 1; aqui é só onde o valor mora. */}
              <div className="rounded-xl border p-3 min-w-0" style={{ borderColor: "hsl(214,25%,92%)", background: "white" }}>
                <h5 className="text-xs font-bold mb-1" style={LABEL}>Canais de atendimento</h5>
                <div className="grid gap-2 sm:grid-cols-2 min-w-0">
                  <Field label="Número do WhatsApp (com DDI)">
                    {lockedField("modal:centralWa", d.modalWhatsapp, (v) => set("modalWhatsapp", v), { maxLength: 40, placeholder: "Ex: +55 45 99999-9999" })}
                    {centralIncomplete && (
                      <p className="mt-1 text-xs" style={{ color: "hsl(35,82%,40%)" }}>⚠️ Sem número completo, o botão “Iniciar conversa” não aparece pro lead.</p>
                    )}
                  </Field>
                  <Field label="ID do grupo Telegram (id negativo)">
                    {lockedField("agency:chatId", d.agencyChatId, (v) => set("agencyChatId", v), { maxLength: 40, placeholder: "Ex: -1001234567890" })}
                  </Field>
                </div>
                <div className="flex items-center gap-3 flex-wrap mt-3">
                  <span className="text-xs font-semibold" style={LABEL}>Enviar lead ao grupo</span>
                  <Segmented
                    options={[{ v: true, label: "Sim" }, { v: false, label: "Não" }]}
                    value={d.agencyGroupNotifyEnabled}
                    onChange={(v) => set("agencyGroupNotifyEnabled", v)}
                  />
                </div>
                <p className="text-xs mt-1.5" style={HINT}>
                  {d.agencyGroupNotifyEnabled
                    ? "O id acima é usado normalmente — o grupo recebe cada lead qualificado."
                    : "⚠️ Desligado: o id acima fica guardado, mas NENHUM lead é enviado ao grupo (útil contra spam, ou pra testar se só o botão “Iniciar conversa” converte melhor). Combine com a seção “1 · Modal” pra decidir o que o lead vê."}
                </p>
              </div>

              {/* Roteamento — quem entra e quem não entra no fluxo da agência. */}
              <div className="rounded-xl border p-3 mt-3 min-w-0" style={{ borderColor: "hsl(214,25%,92%)", background: "white" }}>
                <h5 className="text-xs font-bold mb-2" style={LABEL}>Roteamento</h5>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs font-semibold" style={LABEL}>Aceitar morador local</span>
                  <Segmented
                    options={[{ v: true, label: "Sim" }, { v: false, label: "Não" }]}
                    value={d.agencyAcceptLocals}
                    onChange={(v) => set("agencyAcceptLocals", v)}
                  />
                </div>
                <p className="text-xs mt-1.5" style={HINT}>
                  {d.agencyAcceptLocals
                    ? "Quem responde que mora em Foz também é roteado pro grupo da agência."
                    : "Quem responde que mora em Foz fica só gravado em Leads — não vai pro grupo da agência."}
                </p>
              </div>

              <div className="rounded-xl border p-3 mt-3" style={{ borderColor: "hsl(214,25%,92%)", background: d.transportOffer.enabled ? "white" : "hsl(0,70%,97%)" }}>
                <div className="flex items-center gap-3 flex-wrap mb-1.5">
                  <h5 className="text-xs font-bold" style={LABEL}>Transporte ({OFFICIAL_AGENCY_NAME}) — pergunta acima do formulário</h5>
                  <span className="text-xs font-semibold inline-flex items-center gap-1.5" style={LABEL}>
                    Exibir
                    <Segmented
                      options={[{ v: true, label: "Sim" }, { v: false, label: "Não" }]}
                      value={d.transportOffer.enabled}
                      onChange={(v) => { if (agencyPlanActive && d.agencyDefined) setTransportMeta({ enabled: v }); }}
                      disabled={!agencyPlanActive || !d.agencyDefined}
                    />
                  </span>
                </div>
                <p className="text-xs mb-2" style={HINT}>
                  Só aparece em <b>páginas de atrativo individual</b> — roteiros prontos já embutem a
                  logística do dia, então nunca mostram essa pergunta. Além disso, exige agência{" "}
                  <b>definida</b> (acima) e plano de agência <b>ativo</b>. A escolha do lead é registrada e
                  enviada junto ao grupo da agência.
                </p>
                {/* ⛔ Título/Descrição desativados (ago/2026) — texto é código, em `lib/offer-defaults.ts`
                    (`DEFAULT_TRANSPORT_OFFER.texts`), nos 3 idiomas. Aqui sobra o Sim/Não de exibir.
                    ↩️ Reativar: descomentar abaixo, restaurar `setTransportText`, e voltar a gravar em
                    `saveOfferConfig` (bloco ⛔ do transporte) + mandar `transportOffer.texts` no payload.
                <div className="grid gap-2">
                  <Field label={`Título — ${LOCALE_META[activeLocale].label}`}>
                    {lockedField(`transport:title:${activeLocale}`, d.transportOffer.texts[activeLocale].title, (v) => setTransportText(activeLocale, { title: v }), { maxLength: 160 })}
                  </Field>
                  <Field label={`Descrição — ${LOCALE_META[activeLocale].label}`}>
                    {lockedField(`transport:desc:${activeLocale}`, d.transportOffer.texts[activeLocale].desc, (v) => setTransportText(activeLocale, { desc: v }), { multiline: true, maxLength: 400 })}
                  </Field>
                </div>
                */}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5 · Ingresso por atrativo */}
      <div className="mt-4 rounded-xl border" style={{ borderColor: "hsl(214,25%,92%)" }}>
        <button
          type="button"
          onClick={() => setShowAttractions((s) => !s)}
          className="w-full flex items-center gap-2 px-4 py-3 text-left"
        >
          {showAttractions ? <ChevronDown className="h-4 w-4" style={{ color: "hsl(210,25%,45%)" }} /> : <ChevronRight className="h-4 w-4" style={{ color: "hsl(210,25%,45%)" }} />}
          <span className="text-xs font-bold" style={LABEL}>5 · Ingresso por atrativo</span>
          <span className="text-xs" style={HINT}>(link direto vs. agência, por atrativo — {attractionRows.length} atrativos)</span>
          {/* Sem isto o aviso de "Direto sem URL" ficaria invisível com a seção recolhida — que é o
              estado padrão. Some sozinho quando não há nenhum. */}
          {directWithoutUrl.length > 0 && (
            <span
              className="ml-auto text-xs font-bold px-2 py-0.5 rounded-lg inline-flex items-center gap-1 flex-none"
              style={{ color: "hsl(35,82%,30%)", background: "hsl(40,90%,90%)" }}
              title={`Modo = Direto sem URL: ${directWithoutUrl.map((r) => r.name).join(", ")}`}
            >
              <AlertTriangle className="h-3 w-3" />
              {directWithoutUrl.length} sem URL
            </span>
          )}
        </button>

        {showAttractions && (
          <div className="px-4 pb-4 space-y-3 min-w-0">
            <p className="text-xs" style={HINT}>
              Define, PARA CADA atrativo, o que a tela de sucesso mostra: o link oficial de compra DESSE
              atrativo (<b>Modo = Direto</b>), ou a conversa com a agência — cai no modo de sucesso global
              da seção <b>1</b> (<b>Modo = Agência</b>). Atrativos sem ingresso próprio (ex.: Compras
              Paraguai, Feirinha) devem desligar <b>Tem link</b> — a captura de lead continua normal, mas
              esses atrativos ganham a PRÓPRIA escolha (Só mensagem / Iniciar conversa), no lugar do Modo,
              em vez de herdar o bucket global.
            </p>
            {attractionRows.map((r) => (
              <div key={r.slug} className="rounded-xl border p-3.5 min-w-0" style={{ borderColor: "hsl(214,25%,92%)", background: r.hasLink ? "white" : "hsl(0,70%,97%)" }}>
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h4 className="text-xs font-bold" style={LABEL}>{r.name}</h4>
                  <span className="text-xs font-semibold inline-flex items-center gap-1.5" style={LABEL}>
                    Tem link
                    <Segmented
                      options={[{ v: true, label: "Sim" }, { v: false, label: "Não" }]}
                      value={r.hasLink}
                      onChange={(v) => setAttractionRow(r.slug, { hasLink: v })}
                    />
                  </span>
                  {r.hasLink ? (
                    <span className="text-xs font-semibold inline-flex items-center gap-1.5" style={LABEL}>
                      Modo
                      <Segmented
                        options={[{ v: "direct" as AttractionOfferMode, label: "Direto" }, { v: "agency" as AttractionOfferMode, label: "Agência" }]}
                        value={r.mode}
                        onChange={(v) => setAttractionRow(r.slug, { mode: v })}
                      />
                    </span>
                  ) : (
                    <span className="text-xs font-semibold inline-flex items-center gap-1.5" style={LABEL} title="Sem link: escolha própria pra esse atrativo — não usa o bucket global 'Atrativos individuais'">
                      Sem link
                      <Segmented
                        options={[{ v: "close" as RoteiroSuccessMode, label: "Só mensagem" }, { v: "whatsapp" as RoteiroSuccessMode, label: "Iniciar conversa" }]}
                        value={r.noLinkMode}
                        onChange={(v) => setAttractionRow(r.slug, { noLinkMode: v })}
                      />
                    </span>
                  )}
                </div>
                {r.hasLink && (
                  <Field label="Link direto (URL) — usado quando Modo = Direto">
                    {lockedField(`a:${r.slug}:url`, r.officialUrl, (v) => setAttractionRow(r.slug, { officialUrl: v }), { maxLength: 500, placeholder: "https://…" })}
                  </Field>
                )}
                {/* Único estado em que a seção 5 "não resolve" e a decisão volta silenciosamente pro
                    bucket global da seção 1: `resolvedDirectUrl` (TicketOfferButton) exige hasLink +
                    Modo=Direto + URL preenchida; sem a URL ele vira null, `detail.href` vai vazio e
                    `attractionForcesDirect` é falso. Sem este aviso o admin lê "Direto" no editor e o
                    visitante recebe o fluxo da agência — divergência muda, sem erro nenhum. */}
                {r.hasLink && r.mode === "direct" && !r.officialUrl.trim() && (
                  <p className="mt-2 text-xs px-3 py-2 rounded-lg" style={{ color: "hsl(35,82%,30%)", background: "hsl(40,90%,96%)" }}>
                    ⚠️ <b>Modo = Direto sem URL.</b> Este atrativo está caindo no modo de sucesso global
                    da seção <b>1 · Modal</b> (“Atrativos individuais”), não no link próprio. Preencha a
                    URL acima — ou mude o Modo para <b>Agência</b>, se for essa a intenção.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

/* ---------- subcomponentes ---------- */
function Section({ title, hint, action, children }: { title: string; hint: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border p-4 min-w-0" style={{ borderColor: "hsl(214,25%,92%)", background: "hsl(214,50%,98%)" }}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xs font-bold" style={{ color: "hsl(210,60%,15%)" }}>{title}</h3>
        {action && <div className="flex-none">{action}</div>}
      </div>
      <p className="text-xs mb-3" style={{ color: "hsl(210,25%,50%)" }}>{hint}</p>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-3 min-w-0">
      <label className="text-xs font-semibold break-words" style={{ color: "hsl(210,60%,15%)" }}>{label}</label>
      <div className="mt-1 min-w-0">{children}</div>
    </div>
  );
}

/** Abas PT/EN/ES — controlam qual idioma os campos de texto e o preview exibem/editam. */
function LocaleTabs({ value, onChange }: { value: Locale; onChange: (v: Locale) => void }) {
  return (
    <div className="inline-flex rounded-xl border overflow-hidden" style={{ borderColor: "hsl(214,25%,88%)" }}>
      {LOCALES.map((locale) => {
        const on = locale === value;
        return (
          <button
            key={locale}
            type="button"
            onClick={() => onChange(locale)}
            className="px-3 py-2 text-xs font-bold transition-colors inline-flex items-center gap-1"
            style={{ background: on ? "hsl(210,60%,15%)" : "white", color: on ? "white" : "hsl(210,25%,40%)" }}
            aria-pressed={on}
            title={`Editar textos em ${LOCALE_META[locale].label}`}
          >
            <span aria-hidden="true">{LOCALE_META[locale].flag}</span> {LOCALE_META[locale].short}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Campo de TEXTO protegido (mesmo padrão do "Link direto"): travado por padrão (só exibe o valor + botão "Editar");
 * ao editar → input/textarea + ✓ (confirma) / ✗ (cancela e reverte ao backup). O parent controla `editing` e os handlers.
 */
function LockedField({
  value, onChange, editing, onEdit, onConfirm, onCancel, multiline, maxLength = 600, placeholder,
}: {
  value: string; onChange: (v: string) => void;
  editing: boolean; onEdit: () => void; onConfirm: () => void; onCancel: () => void;
  multiline?: boolean; maxLength?: number; placeholder?: string;
}) {
  // min-w-0 + w-full: em grid/flex aninhados (ex: card da agência), texto longo não deve
  // expandir o campo — trunca no display e quebra/rola no edit.
  if (editing) {
    return (
      <div className="flex items-start gap-1.5 min-w-0 w-full">
        {multiline ? (
          <textarea value={value} onChange={(e) => onChange(e.target.value.slice(0, maxLength))} rows={2} className={`${areaCls} min-w-0 flex-1`} style={inputStyle} autoFocus />
        ) : (
          <input value={value} onChange={(e) => onChange(e.target.value.slice(0, maxLength))} className={`${inputCls} min-w-0 flex-1`} style={inputStyle} autoFocus />
        )}
        <button type="button" onClick={onConfirm} title="Confirmar" aria-label="Confirmar"
          className="flex-none p-2 rounded-lg text-white transition-transform hover:scale-105" style={{ background: "hsl(152,47%,32%)" }}>
          <Check className="h-4 w-4" />
        </button>
        <button type="button" onClick={onCancel} title="Cancelar" aria-label="Cancelar"
          className="flex-none p-2 rounded-lg transition-transform hover:scale-105" style={{ background: "hsl(214,30%,92%)", color: "hsl(210,25%,40%)" }}>
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 min-w-0 w-full">
      <div className="flex-1 min-w-0 h-10 px-3 rounded-xl border flex items-center text-sm overflow-hidden"
        style={{ borderColor: "hsl(214,25%,90%)", background: "hsl(214,30%,96%)", color: "hsl(210,25%,42%)" }}>
        <span className="block min-w-0 w-full truncate">{value || <span style={{ color: "hsl(210,20%,65%)" }}>{placeholder || "vazio"}</span>}</span>
      </div>
      <button type="button" onClick={onEdit}
        className="flex-none inline-flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-70" style={{ color: "hsl(210,56%,23%)" }}>
        <Pencil className="h-3 w-3" /> Editar
      </button>
    </div>
  );
}

function Segmented<T extends string | boolean>({
  options, value, onChange, disabled,
}: { options: { v: T; label: string }[]; value: T; onChange: (v: T) => void; disabled?: boolean }) {
  return (
    <div className="inline-flex rounded-xl border overflow-hidden" style={{ borderColor: "hsl(214,25%,88%)", opacity: disabled ? 0.5 : 1 }}>
      {options.map((o) => {
        const on = o.v === value;
        return (
          <button
            key={String(o.v)}
            type="button"
            disabled={disabled}
            onClick={() => onChange(o.v)}
            className="px-3.5 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed"
            style={{ background: on ? "hsl(210,60%,15%)" : "white", color: on ? "white" : "hsl(210,25%,40%)" }}
            aria-pressed={on}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════
// ⛔ EDITORES DE TEXTO DESATIVADOS (ago/2026) — seções "3 · Perguntas de qualificação" e
//    "3b · Textos por produto". Preservados aqui inteiros, a pedido do dono do produto.
//
// POR QUE saíram: o editor tinha virado dezenas de campos de texto × 3 idiomas, e revisar isso custava
// mais atenção do que valia. O admin passou a ser só COMPORTAMENTO (modo de sucesso, agência, Telegram,
// link por atrativo). Todo texto do modal vive em `lib/offer-defaults.ts` — e é traduzido lá, nos 3
// idiomas, seguindo `conventions/posicionamento.md` §21.
//
// Comentado com `//` linha a linha (e não com `/* */`) de propósito: o bloco contém comentários JSX
// com `*/` dentro, que fechariam o comentário externo no meio e quebrariam o arquivo.
//
// ↩️ PARA REATIVAR (4 passos — todos necessários, senão a edição fica só na aparência):
//   1. Descomente este bloco e cole de volta no JSX, entre `</Section></div>` (fim da seção 2) e o
//      comentário `{/* 4 · Agência ... */}`.
//   2. Restaure `FORM_FIELDS`, `PRODUCT_FIELD_LABELS`, `setText`, `setProductCopy`, `setTransportText`,
//      `showTexts` e `showProductTexts` (comentados nos seus lugares de origem, acima).
//   3. Em `save()`, volte a mandar `texts`/`productCopies`/`transportOffer.texts` no payload.
//   4. Em `lib/offer-settings.ts`, descomente os blocos de gravação (procure por ⛔).
// A LEITURA nunca foi desligada: chave que exista no `app_settings` continua vencendo o default do
// código, então o passo 4 é o que faz o que você digitar realmente aparecer no site.
// ═══════════════════════════════════════════════════════════════════════════════════════════════════
//       {/* 3 · Textos do modal (recolhível) */}
//       <div className="mt-4 rounded-xl border" style={{ borderColor: "hsl(214,25%,92%)" }}>
//         <button
//           type="button"
//           onClick={() => setShowTexts((s) => !s)}
//           className="w-full flex items-center gap-2 px-4 py-3 text-left"
//         >
//           {showTexts ? <ChevronDown className="h-4 w-4" style={{ color: "hsl(210,25%,45%)" }} /> : <ChevronRight className="h-4 w-4" style={{ color: "hsl(210,25%,45%)" }} />}
//           <span className="text-xs font-bold" style={LABEL}>3 · Perguntas de qualificação</span>
//           <span className="text-xs" style={HINT}>(iguais nos 3 produtos — o resto do modal é por produto, na 3b — {LOCALE_META[activeLocale].label})</span>
//         </button>
//
//         {showTexts && (
//           <div className="px-4 pb-4 grid gap-4 sm:grid-cols-2">
//             <div>
//               <p className="text-xs font-bold mb-2" style={LABEL}>Formulário</p>
//               {FORM_FIELDS.map((f) => (
//                 <div key={f.k} className="mb-3">
//                   <label className="text-xs font-semibold" style={LABEL}>{f.label}</label>
//                   <div className="mt-1">{lockedField(`text:${activeLocale}:${f.k}`, d.texts[activeLocale][f.k], (v) => setText(activeLocale, f.k, v), { multiline: f.multiline })}</div>
//                   {f.hint && <p className="mt-1 text-xs" style={HINT}>{f.hint}</p>}
//                 </div>
//               ))}
//             </div>
//             <div>
//               {/* Preview ao vivo do modal (mesmo componente do front, em modo visualização) — ocupa a coluna
//                   direita, antes ocupada pelos campos de "Sucesso" (todos migrados para o 3b em ago/2026).
//                   Reflete o RASCUNHO (`d`/`attractionRows`) no idioma ativo — muda em tempo real enquanto edita. */}
//               <div className="mt-2 rounded-xl border p-3" style={{ borderColor: "hsl(214,25%,92%)", background: "hsl(214,50%,98%)" }}>
//                 <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
//                   <p className="text-xs font-bold" style={LABEL}>Pré-visualização · {LOCALE_META[activeLocale].flag} {LOCALE_META[activeLocale].label}</p>
//                   <button type="button" onClick={() => { setPreviewKey((k) => k + 1); setPreviewStage("form"); }}
//                     className="inline-flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-70"
//                     style={{ color: "hsl(210,56%,23%)" }} title="Recomeça o preview do zero (formulário em branco)">
//                     <RotateCcw className="h-3 w-3" /> Reiniciar
//                   </button>
//                 </div>
//                 <p className="text-xs mb-2" style={HINT}>
//                   Reflete o rascunho atual (antes de Salvar), no idioma selecionado acima. É o mesmo modal do site,
//                   só em modo visualização: interaja à vontade — nada aqui envia lead, mensagem ou navega de verdade.
//                 </p>
//                 <div className="mb-3">
//                   <Segmented
//                     options={[{ v: "form" as const, label: "Formulário" }, { v: "success" as const, label: "Sucesso" }]}
//                     value={previewStage}
//                     onChange={setPreviewStage}
//                   />
//                 </div>
//                 <div className="flex justify-center rounded-2xl p-3" style={{ background: "hsl(210,20%,90%)" }}>
//                   <TicketOfferModal key={previewKey}
//                     preview={{ offer: previewOffer, stage: previewStage, onStageChange: setPreviewStage, locale: activeLocale, productKind }} />
//                 </div>
//               </div>
//             </div>
//             <p className="sm:col-span-2 text-xs" style={HINT}>
//               ℹ️ Não editáveis (por segurança, em nenhum idioma): a microcopy de <b>Termos/LGPD</b> e os rótulos internos dos campos do formulário.
//             </p>
//             <p className="sm:col-span-2 text-xs" style={HINT}>
//               ℹ️ Título, subtítulo, botão e mensagens de sucesso do produto vêm da seção <b>3b · Textos por
//               produto</b> abaixo — o preview acima simula o produto selecionado lá (aba <b>{PRODUCT_KIND_LABEL[productKind]}</b> agora).
//             </p>
//           </div>
//         )}
//       </div>
//
//       {/* 3b · Textos por produto Compras Paraguay */}
//       <div className="mt-4 rounded-xl border" style={{ borderColor: "hsl(214,25%,92%)" }}>
//         <button
//           type="button"
//           onClick={() => setShowProductTexts((s) => !s)}
//           className="w-full flex items-center gap-2 px-4 py-3 text-left"
//         >
//           {showProductTexts ? (
//             <ChevronDown className="h-4 w-4" style={{ color: "hsl(210,25%,45%)" }} />
//           ) : (
//             <ChevronRight className="h-4 w-4" style={{ color: "hsl(210,25%,45%)" }} />
//           )}
//           <span className="text-xs font-bold" style={LABEL}>3b · Textos por produto (Compras Paraguay)</span>
//           <span className="text-xs" style={HINT}>
//             (ingresso · plano · personalizar — {LOCALE_META[activeLocale].label})
//           </span>
//         </button>
//         {showProductTexts && (
//           <div className="px-4 pb-4 space-y-4">
//             <p className="text-xs" style={HINT}>
//               Quando o visitante clica em <b>Comprar ingresso</b>, <b>Quero esse roteiro</b> ou
//               finaliza o <b>personalizar</b>, o modal usa estes textos (não o bloco genérico da seção 3).
//               Qualificação e transporte continuam iguais em todos os fluxos.
//             </p>
//             <div className="flex flex-wrap gap-2">
//               {PRODUCT_COPY_KINDS.map((k) => (
//                 <button
//                   key={k}
//                   type="button"
//                   onClick={() => setProductKind(k)}
//                   className="rounded-xl px-3 py-1.5 text-xs font-bold border transition-all"
//                   style={
//                     productKind === k
//                       ? {
//                           background: "hsl(210,60%,15%)",
//                           color: "white",
//                           borderColor: "hsl(210,60%,15%)",
//                         }
//                       : {
//                           background: "white",
//                           color: "hsl(210,25%,40%)",
//                           borderColor: "hsl(214,25%,88%)",
//                         }
//                   }
//                 >
//                   {PRODUCT_KIND_LABEL[k]}
//                 </button>
//               ))}
//             </div>
//             <div className="grid gap-3 sm:grid-cols-2">
//               {/* Só a aba "Ingresso (atrativo)" ganha os 2 campos do modo "Link direto": roteiro pronto e
//                   personalizado não têm site oficial pra apontar, e `RoteiroSuccessMode` nem admite
//                   "direct" — nas outras abas seriam campo visível e sem efeito. Ver `AtrativoLeadCopy`. */}
//               {(productKind === "atrativo"
//                 ? [...PRODUCT_COPY_FIELDS, ...ATRATIVO_ONLY_COPY_FIELDS]
//                 : PRODUCT_COPY_FIELDS
//               ).map((field) => (
//                 <div
//                   key={field}
//                   className={
//                     field === "subtitle" ||
//                     field === "successClose" ||
//                     field === "successWhatsapp" ||
//                     field === "formHint" ||
//                     field === "duplicateNoticeTitle" ||
//                     field === "successDirect"
//                       ? "sm:col-span-2"
//                       : ""
//                   }
//                 >
//                   <label className="text-xs font-semibold" style={LABEL}>
//                     {PRODUCT_FIELD_LABELS[field] ?? field}
//                   </label>
//                   <div className="mt-1">
//                     {lockedField(
//                       `product:${productKind}:${activeLocale}:${field}`,
//                       (d.productCopies[productKind][activeLocale] as unknown as Record<string, string>)[field] ?? "",
//                       (v) => setProductCopy(productKind, activeLocale, field, v),
//                       {
//                         multiline:
//                           field === "subtitle" ||
//                           field === "formHint" ||
//                           field === "successClose" ||
//                           field === "successWhatsapp" ||
//                           field === "duplicateNoticeTitle" ||
//                           field === "successDirect",
//                       },
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
