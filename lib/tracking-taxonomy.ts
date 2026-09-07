// Filepath: lib/tracking-taxonomy.ts
// Version: 1.3
// Nome da Versão: "+ `comprasparaguay` ao enum `Property` — satélite novo se SOMA, não substitui (D14)"
// Baseado na Versão: 1.2
//
// ⚠️ TAXONOMY_VERSION MUDA em 1.3 (`2026-08-v1` → `2026-09-v1`): valor de enum `Property` novo
//    (`comprasparaguay`). Valor de enum novo = bump obrigatório nos repos plugados (ver D13 e D14 em
//    `_docs-portfolio/pixel-decisions.md`).
//
// ⚠️ ESTE ARQUIVO NÃO PERTENCE AO RODAGIGANTEFOZ.
// É a camada de EXECUÇÃO do contrato definido em `_docs-portfolio/pixel-matrix.md` (normativo)
// e `_docs-portfolio/pixel-decisions.md` (fundamentos + rejeições). O pixel do Meta é um ativo
// de PORTFÓLIO, compartilhado por rodagigantefoz / roteirofoz / comprasparaguay / toemfoz. Este
// projeto é UM SATÉLITE plugado nele — não é núcleo, não é base, não tem precedência.
//
// A doc impede que alguém não SAIBA o padrão. Este arquivo impede que alguém DIVIRJA dele:
// nenhum ponto de disparo escreve string literal — todos importam daqui.
//
// 🔒 ANTES DE EDITAR: leia a matriz. Param novo, valor de enum novo ou evento novo exigem
// entrada em `pixel-decisions.md` e bump do TAXONOMY_VERSION em todos os repos plugados.
// ⚠️ ENUM É ADITIVO: plugar um satélite novo SOMA um valor. Substituir um valor existente apaga o
// vocabulário dos outros projetos quando este arquivo é copiado verbatim (D14).

// =============================================================================
// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  BLOCO CONGELADO — IDÊNTICO BYTE A BYTE NOS TRÊS REPOSITÓRIOS             ║
// ║  Divergência aqui = bug de portfólio. Detecte com `diff`, não com leitura.║
// ╚═══════════════════════════════════════════════════════════════════════════╝
// =============================================================================

/** Espelha o TAXONOMY_VERSION de `_docs-portfolio/pixel-matrix.md`. Bump = todos os repos juntos. */
export const TAXONOMY_VERSION = "2026-09-v1";

/**
 * Domínio sem TLD. Um pixel só para todos os domínios do portfólio — ver decisão D1.
 * Um valor NOVO se soma à lista; um valor existente nunca é trocado pelo nome do projeto que
 * está sendo plugado agora (D14).
 */
export type Property =
  | "rodagigantefoz"
  | "roteirofoz"
  | "comprasparaguay"
  | "toemfoz";

/**
 * Os 4 produtos do portfólio. Nem todo satélite tem os quatro: cada um usa o subconjunto que
 * construiu e omite o resto (D8) — ter o valor no enum não obriga ninguém a enviá-lo.
 * NÃO é 1:1 com `PartnerCategory` (matriz §1.1): `turismo` → `transporte`, e `atrativos`
 * não tem categoria de parceiro porque é produto próprio (ingresso, experiência, combo).
 */
export type Vertical = "atrativos" | "transporte" | "hotelaria" | "gastronomia";

/**
 * Sub-tipo dentro do vertical. SUPERSET DO PORTFÓLIO — cada projeto usa só o subconjunto que
 * tem, e omite o param quando não se aplica (D8). Ter o valor no enum não obriga a enviá-lo.
 *
 * ⚠️ São os valores de `Niche.key` (`pizzaria`), NUNCA de `Niche.slug`
 * (`pizzaria-em-foz-do-iguacu`, que é segmento de URL). É a `key` que casa com
 * `Partner.niches` — mandar o slug quebraria o match em silêncio (D4).
 */
export type Niche =
  | "bar-e-cervejaria"
  | "churrascaria"
  | "restaurante"
  | "pizzaria"
  | "shawarma"
  | "sushi"
  | "hamburgueria"
  | "hospedagem"
  | "transfer";

/**
 * Runtime do type `Vertical`. Ponto de disparo NUNCA escreve `"atrativos"` na mão — importa
 * `VERTICALS.atrativos` (G7). O `satisfies` garante que o objeto e o type não podem divergir:
 * acrescentar um vertical ao type sem acrescentar aqui não compila.
 */
export const VERTICALS = {
  atrativos: "atrativos",
  transporte: "transporte",
  hotelaria: "hotelaria",
  gastronomia: "gastronomia",
} as const satisfies Record<Vertical, Vertical>;

/**
 * Nichos citados EXPLICITAMENTE no código (os de gastronomia chegam pelo dado, via `asNiche`).
 * Mesmo motivo do `VERTICALS`: `"transfer"` escrito à mão em dois arquivos vira `"transfers"` num
 * deles no primeiro refactor, e o pixel perde metade do volume em silêncio.
 */
export const NICHE_KEYS = {
  hospedagem: "hospedagem",
  transfer: "transfer",
} as const satisfies Record<string, Niche>;

/** Runtime do type `Niche` — existe só para alimentar `asNiche`. Manter os dois em sincronia. */
export const NICHES: readonly Niche[] = [
  "bar-e-cervejaria",
  "churrascaria",
  "restaurante",
  "pizzaria",
  "shawarma",
  "sushi",
  "hamburgueria",
  "hospedagem",
  "transfer",
];

/**
 * Estreita uma string do DADO (`Partner.niches`, que é `string[]` livre) para o enum, ou
 * `undefined` se não reconhecer. Ponte OBRIGATÓRIA entre os dois mundos: o catálogo de nichos do
 * projeto pode ganhar uma chave nova sem que o portfólio saiba dela, e nesse caso a regra é omitir
 * (D8) — nunca deixar vazar uma string desconhecida para o pixel compartilhado, onde ela viraria
 * um valor órfão que ninguém consegue segmentar depois.
 */
export function asNiche(value: string | null | undefined): Niche | undefined {
  if (!value) return undefined;
  return NICHES.includes(value as Niche) ? (value as Niche) : undefined;
}

/** `PartnerCategory` → `Vertical`, com a mesma regra de omissão de `asNiche`. */
export function verticalOfPartnerCategory(value: string | null | undefined): Vertical | undefined {
  if (!value) return undefined;
  return (VERTICAL_BY_PARTNER_CATEGORY as Record<string, Vertical>)[value];
}

/**
 * Eventos do portfólio. `Purchase` é RESERVADO: só receita real, gatilho = confirmação da
 * agência no Telegram. Proibido usá-lo com valor estimado (D2).
 */
export const PORTFOLIO_EVENTS = {
  viewContent: "ViewContent",
  initiateCheckout: "InitiateCheckout",
  lead: "Lead",
  contact: "Contact",
  purchase: "Purchase",
} as const;

/**
 * Verticais que já têm peso de `value` aprovado na matriz §5.
 * 🔒 REGRA DURA: nenhum vertical emite `Lead` antes de constar aqui. Slot vazio é seguro;
 * peso chutado vira histórico silencioso que ninguém percebe estar errado (D3).
 */
export const VERTICALS_WITH_APPROVED_LEAD_VALUE: readonly Vertical[] = ["atrativos"];

/** Mapa `PartnerCategory` → `Vertical`. As duas divergências são deliberadas (matriz §1.1). */
export const VERTICAL_BY_PARTNER_CATEGORY = {
  gastronomia: "gastronomia",
  hotelaria: "hotelaria",
  turismo: "transporte",
} as const satisfies Record<string, Vertical>;

/**
 * Dimensões de ATRIBUIÇÃO — string livre de propósito, não enum. Enum fechado é só para as
 * dimensões onde se FUNDA REGRA de painel; tipar slug de negócio seria manutenção infinita
 * por benefício zero, já que ele nunca vira regra (D5).
 *
 * `item_slug` = O QUÊ foi vendido (`app/data/attractions.ts`, `app/data/experiences.ts`).
 * `partner_slug` = QUEM entrega. TRÊS fontes alimentam este mesmo param:
 *   • `app/data/partners.ts`  → Partner.slug       (gastronomia)
 *   • `app/data/agencies.ts`  → AgencyProfile.slug (foz-falls)
 *   • `app/data/hotels.ts`    → HotelProfile.slug  (doubletree-…)
 * Nada no código impede colisão de slug entre os três — conferir ao cadastrar negócio novo.
 * ⚠️ Existem slugs de TESTE no dado (`agencia-teste`, `hotel-teste`): se um ficar ativo por
 * engano, entra no pixel de portfólio e não sai mais.
 *
 * Os dois CONVIVEM no mesmo evento: experiência vendida pela agência sai com
 * `item_slug=roda-gigante-cataratas` E `partner_slug=foz-falls`.
 *
 * ⚠️ É sempre o identificador do DADO, nunca a URL (D11). Parceiro/agência/hotel não têm rota
 * própria (são card + modal nas páginas hub); atrativo/experiência têm, mas isso é
 * coincidência de roteamento. Renomear rota por SEO NÃO muda o `item_slug`.
 *
 * `partner_slug` nunca funda público nem Conversão Personalizada: o parceiro rotaciona e o
 * público morre na troca. Quem sobrevive à rotação é `vertical`/`niche` (D5).
 * `content_ids` é array (combos/roteiros); NUNCA concatenar em `item_slug` (D7).
 */
export interface AttributionParams {
  item_slug?: string | null;
  content_ids?: string[] | null;
  partner_slug?: string | null;
}

export interface TaxonomyParams extends AttributionParams {
  vertical?: Vertical;
  niche?: Niche;
}

/**
 * Monta os params da taxonomia aplicando a REGRA DE OMISSÃO (D8): dimensão desconhecida ou
 * inaplicável sai FORA do payload — nunca vira `""`, `"none"`, `"unknown"` ou `"n/a"`.
 *
 * Por que isso é uma função e não um spread solto: parâmetro ausente não atrapalha regra de
 * Conversão Personalizada, mas placeholder em volume dilui a regra e a faz PARAR DE CASAR sem
 * emitir erro nenhum. O sintoma aparece semanas depois como campanha ruim, não como bug — por
 * isso a omissão é centralizada aqui em vez de confiada a cada ponto de disparo.
 */
export function taxonomyParams(input: TaxonomyParams): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (input.vertical) out.vertical = input.vertical;
  if (input.niche) out.niche = input.niche;
  if (input.item_slug) out.item_slug = input.item_slug;
  if (input.partner_slug) out.partner_slug = input.partner_slug;
  if (input.content_ids && input.content_ids.length > 0) out.content_ids = input.content_ids;
  return out;
}

// =============================================================================
// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  BLOCO LOCAL — A ÚNICA PARTE QUE MUDA POR REPOSITÓRIO                     ║
// ╚═══════════════════════════════════════════════════════════════════════════╝
// =============================================================================

/**
 * Qual satélite é ESTE repositório. Injetado centralmente no funil de disparo
 * (`lib/analytics.trackConversion` + `lib/meta-capi`), nunca nos pontos de chamada — assim
 * todo evento presente E FUTURO sai com `property`, sem depender de ninguém lembrar.
 *
 * Hardcoded de propósito, não vem de env: um preview mal configurado mandaria a property
 * errada para o pixel compartilhado, e isso é histórico que não se limpa.
 */
export const TRACKING_PROPERTY: Property = "comprasparaguay";
