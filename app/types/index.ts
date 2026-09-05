// Filepath: app/types/index.ts
// Version: 4.1
// Nome da Versão: "Attraction logistics (corredor/peso/papel) p/ personalizador B+E"
// Baseado na Versão: 4.0

// =============================================================================
// MODELO ATUAL — DIRETÓRIO DE PARCEIROS (negócios locais de Foz do Iguaçu)
// Categorias fixas (conventions.md §3): Gastronomia e Culinária | Hotelaria | Turismo.
// =============================================================================

export type PartnerCategory = "gastronomia" | "hotelaria" | "turismo";

/** Metadados de apresentação de cada categoria (filtro, heros, ícones). */
export interface PartnerCategoryMeta {
  slug: PartnerCategory;
  name: string;
  /** Nome de um ícone do lucide-react (mapeado no componente, não na data). */
  iconName: string;
  /** Cor de acento da categoria em HSL (orbes de hero, badges). design-system.md §8. */
  accent: string;
  description: string;
}

export interface Partner {
  id: number;
  slug: string;
  name: string;
  category: PartnerCategory;
  /** Rótulo do TIPO de negócio exibido no card (ex: "Cervejaria", "Pizzaria", "Pousada").
   *  `category` continua sendo a base de SEO/JSON-LD; `businessType` é só o texto do badge. */
  businessType?: string;
  /** Frase curta para card e meta description. */
  tagline: string;
  /** Parágrafos para a página individual. */
  description: string[];

  // Localização / contato (também alimenta JSON-LD LocalBusiness)
  address?: string;
  neighborhood?: string;
  city: string;
  state: string;
  /** País do parceiro (Tríplice Fronteira) — define a bandeira exibida. */
  country: "BR" | "AR" | "PY";
  mapUrl?: string;
  geo?: { lat: number; lng: number };

  // Destinos de CTA (recebem UTM enriquecida no Sprint 6)
  /** Destino primário do CTA (site, cardápio, reserva, etc.). */
  ctaUrl: string;
  ctaLabel?: string;
  website?: string;
  whatsapp?: string; // somente dígitos, formato E.164 sem "+" (ex: 5545999999999)
  /** Mensagem pré-preenchida do WhatsApp (sem encode). Default genérico referencia o nosso site. */
  whatsappMessage?: string;
  phone?: string;
  instagram?: string; // handle sem "@"
  /** URL completa do perfil no iFood (ex: cardápio da loja). Renderiza botão "Pedir no iFood" + sameAs. */
  ifood?: string;
  /** URL completa da página no Facebook. Renderiza botão + sameAs. */
  facebook?: string;

  // Mídia
  logo?: string;
  cover: string;
  gallery?: string[];

  // Metadados de apresentação / SEO
  highlights?: string[];
  priceRange?: "$" | "$$" | "$$$";
  hours?: string[];
  featured?: boolean;
  status?: "active" | "draft";
  /** Chaves de NICHO que este parceiro ocupa com EXCLUSIVIDADE (ex: "bar-e-cervejaria", "churrascaria").
   *  Um parceiro é a "Recomendação Oficial" da página de nicho correspondente. Ver `app/data/niches.ts`
   *  + `getPartnerForNiche`. A copy/SEO da página de nicho NUNCA cita o parceiro — só o slot de pitch. */
  niches?: string[];

  // ---------------------------------------------------------------------------
  // Conteúdo rico OPCIONAL da página individual (só renderiza quando presente).
  // Permite uma página premium sem quebrar parceiros simples.
  // ---------------------------------------------------------------------------
  /** Grade de diferenciais com ícone (iconName mapeado em CategoryIcon). */
  features?: { iconName: string; title: string; text: string }[];
  /** Faixa de destaque de serviço (ex: foco em eventos/reservas). `image` = fundo de branding.
   *  `ctaLabel` = texto do botão (flexível por negócio; default = `ctaLabel` do parceiro). `ctaWhatsapp` = manda o CTA pro WhatsApp em vez do `ctaUrl`.
   *  `imageSquare` = imagem quadrada → no MOBILE usa moldura quadrada (mostra a foto inteira, sem faixas nem corte). */
  serviceHighlight?: {
    title: string;
    text: string;
    items?: string[];
    image?: string;
    ctaLabel?: string;
    ctaWhatsapp?: boolean;
    imageSquare?: boolean;
  };
  /** Cardápio/seleção curada por grupos. `cols` = nº de colunas no desktop (3 padrão). `image` = foto do item.
   *  `name`/`desc` OPCIONAIS: quando ausentes, o item vira só a imagem (galeria) — para quem não tem foto por sabor. */
  menu?: {
    groupLabel: string;
    note?: string;
    cols?: 3 | 4;
    items: { name?: string; desc?: string; badge?: string; image?: string }[];
  }[];
  /** Seção de premiações/autoridade: imagem (com selos) + copy + provas. */
  awards?: { image: string; title: string; text: string; points?: string[] };
  /** Seção de fechamento: logo + frase + imagem horizontal (banner). */
  closing?: { text: string; image: string };

  // SEO opcional (sobrescreve título/descrição padrão da página individual).
  seoTitle?: string;
  seoDescription?: string;
}

// =============================================================================
// ATRATIVOS TURÍSTICOS (conteúdo neutro/informativo de SEO — NÃO são parceiros).
// CTA aponta para o site oficial (informativo, rastreado). Trocável por afiliado depois.
// Logística (corredor/peso/papel) vive em `app/data/attraction-logistics.ts` (SSOT do personalizador).
// =============================================================================

/** Corredor geográfico/logístico — itens do mesmo corredor combinam no mesmo dia. */
export type AttractionCorridor =
  | "cataratas-br"
  | "itaipu"
  | "centro-foz"
  | "lazer-tematico"
  | "ar"
  | "py"
  | "natureza-extra"
  | "flex";

/** Carga de tempo no dia. */
export type AttractionWeight = "quarter" | "half" | "full" | "evening";

/** Papel no roteiro — base de swaps (modo B) e de prioridades (modo E). */
export type AttractionRole =
  "anchor" | "addon" | "food" | "shop" | "night" | "culture" | "nature";

/** Turnos do dia (compartilhado com o personalizador). */
export type DayTurno = "manha" | "tarde" | "noite";

/**
 * Metadados de logística para personalizador inteligente.
 * - swaps (B): trocar por mesmo `corridor` + `role` (ou role compatível)
 * - prioridades (E): usuário marca anchors/addons; engine encaixa por corredor/peso
 */
export interface AttractionLogistics {
  corridor: AttractionCorridor;
  weight: AttractionWeight;
  /** Turnos em que o item faz sentido. */
  turnosOk: DayTurno[];
  role: AttractionRole;
  /**
   * Slugs de atrativos que NÃO devem ficar no mesmo dia (hard rule).
   * Ex.: lado AR pesado vs compras PY no mesmo dia.
   */
  incompatibleWith?: string[];
  /** Rótulo curto p/ UI (chips do wizard). */
  priorityLabel?: string;
}

export interface Attraction {
  slug: string;
  name: string;
  tagline: string;
  /** Parágrafos editoriais (página individual + base de conteúdo p/ SEO). */
  description: string[];
  highlights: string[];
  city: string;
  state: string;
  country: "BR" | "AR" | "PY";
  address?: string;
  mapUrl?: string;
  /** Site OFICIAL do atrativo. ⚠️ NÃO é mais destino de CTA: desde que o modo "Link direto" saiu, o
   * campo só alimenta o `sameAs` do schema.org (`lib/seo.ts`). O CTA de todo atrativo abre o modal de
   * reserva. Manter vazio não quebra nada na página. */
  officialUrl: string;
  cover: string;
  gallery?: string[];
  /** Pares rótulo/valor para a ficha (ex: "Como chegar", "Horário", "Dica"). */
  info?: { label: string; value: string }[];
  featured?: boolean;
  /** FAQ editorial (JSON-LD + página). Se ausente, gera FAQ padrão. */
  faq?: { q: string; a: string }[];
  /** Título SEO opcional (senão usa helper padrão). */
  seoTitle?: string;
  seoDescription?: string;
  /**
   * ISO `YYYY-MM-DD`. Alimentam `datePublished`/`dateModified` do `articleSchema` da página.
   * ⚠️ Antes disto as duas datas eram constantes ÚNICAS no arquivo da rota: os 29 atrativos
   * declaravam a mesma data de publicação e a mesma de modificação, e nenhuma das duas mudava
   * quando o conteúdo de um atrativo era reescrito. `updatedAt` deve subir sempre que o conteúdo
   * REAL do atrativo mudar (texto, FAQ, endereço) — não por ajuste técnico sem efeito no que o
   * visitante lê.
   * ⛔ Não adicionar coordenadas aqui: decisão do usuário — endereço em texto plano basta.
   */
  publishedAt?: string;
  updatedAt?: string;
}

// =============================================================================
// ROTEIROS PRONTOS (MVP Compras Paraguay — feature principal)
// Cada slot do dia referencia atrativos, parceiros ou item custom.
// =============================================================================

/** Tipo da referência num slot manhã/tarde/noite. */
// ⛔ `RoteiroSlotKind` foi REMOVIDO em 10/08/2026, junto com o campo `kind` do slot.
// Eram três tipos: `attraction`, `partner` e `custom`.
//  · `custom` era o item livre ("Jantar livre"), herdado de quando o terceiro perfil se chamava
//    "Compras & Gastronomia". O perfil virou só "Compras" e a gastronomia saiu dos planos prontos.
//  · `partner` já estava fora por decisão anterior — "planos prontos = atrativos por corredor, sem
//    forçar parceiro" (cabeçalho de `app/data/roteiros.ts`). Sobrava só o encanamento.
// Sobrou UM tipo, e com um tipo só o campo `kind` não discriminava nada. Slot de roteiro pronto é
// sempre um atrativo. Ao reintroduzir outro tipo, o discriminante volta junto — não emendar um
// segundo significado em `ref`.

/** Item de um turno (manhã / tarde / noite) — sempre um atrativo. */
export interface RoteiroSlotItem {
  /** Slug em `app/data/attractions.ts`. */
  ref: string;
  // ⛔ NÃO reintroduzir `note`. Havia aqui uma "dica curta do curador" por slot — 72 delas, cada
  // uma num registro diferente, e o mini card da timeline acabava com uma voz por item. O card
  // usa a `tagline` do atrativo, igual ao card de `/atrativos`. Removido em 10/08/2026.
  // ⛔ NEM `label`. Era o nome de exibição do item `custom` e, para atrativo, um override do nome
  // resolvido — que nenhum dado usava. O nome vem do catálogo.
  /**
   * Encaixe opcional — o item cabe no dia, mas o dia não depende dele.
   *
   * ⚠️ Serve para os **chips do card** (`attractionNamesFromDays`), que mostram só 3 nomes: sem
   * isto, um encaixe opcional entra na frente e empurra a âncora do turno para fora. Foi o que
   * aconteceu quando a Roda Gigante entrou antes do Marco no roteiro de 1 dia clássico — o card
   * passou a anunciar o opcional e a esconder o pôr do sol na Tríplice Fronteira.
   * O item continua aparecendo normalmente na timeline; o que ele não faz é representar o dia.
   */
  optional?: boolean;
}

/**
 * Alternativa EXCLUDENTE dentro de um dia: o visitante escolhe UMA das opções, não faz todas.
 *
 * ⚠️ Isto é ESTRUTURA DE SEÇÃO, não texto de card. Quando um dia tem `opcoes`, a timeline para de
 * renderizar os turnos do dia e passa a renderizar um bloco por opção, cada um com o próprio
 * rótulo, os próprios turnos e os próprios cards. A alternativa NUNCA é comunicada por nota dentro
 * do card — isso já foi tentado e reprovado: o visitante lia quatro cards enfileirados e entendia
 * que faria os quatro.
 *
 * Hoje existe um caso só: `/roteiros/1-dia-compras`, onde cabe uma frente de compra por dia.
 */
export interface RoteiroDayOption {
  /** Rótulo do bloco — ex.: "Opção 1". */
  label: string;
  /** Uma linha explicando a opção, exibida sob o rótulo. */
  resumo?: string;
  manha: RoteiroSlotItem[];
  tarde: RoteiroSlotItem[];
  noite: RoteiroSlotItem[];
}

/** Um dia do roteiro com três turnos. */
export interface RoteiroDay {
  /** Número do dia (1-based). */
  day: number;
  /**
   * Identidade ESTÁVEL do dia, independente da posição (ex.: "d-cataratas").
   *
   * Existe para o catálogo de dias (`DIAS_AVULSOS` em `app/data/dias-avulsos.ts`, exposto por
   * `DIAS_CATALOGO` em `lib/dias-catalogo.ts`), onde o visitante empilha dias avulsos: a seleção
   * guarda ids, então ela precisa sobreviver a um F5 e a uma reordenação da lista.
   *
   * ⓘ Os dias da `DIAS_BASE` (roteiros prontos) também têm id, herdado de quando o catálogo era
   * derivado deles. Hoje ninguém lê esses ids — são inertes, e tirá-los é ruído sem ganho.
   *
   * ⚠️ Explícito de propósito, em vez de derivado de `${perfil}-${índice}`: assim o id viaja junto
   * com o CONTEÚDO. Se um dia trocar de posição, uma seleção salva continua apontando para o dia
   * certo em vez de silenciosamente virar outro.
   *
   * ⓘ Os roteiros prontos IGNORAM este campo — a timeline não o lê e `stack()` segue numerando por
   * posição. É aditivo: nada do que já está no ar muda por causa dele.
   */
  id?: string;
  /**
   * Quando presente, o dia é uma ESCOLHA entre alternativas e os turnos abaixo ficam vazios.
   * Ver `RoteiroDayOption`.
   */
  opcoes?: RoteiroDayOption[];
  /** Título opcional do dia (ex.: "Cataratas e natureza"). */
  title?: string;
  manha: RoteiroSlotItem[];
  tarde: RoteiroSlotItem[];
  noite: RoteiroSlotItem[];
}

/**
 * Perfis fixos do hub (sempre 3 por duração 1–7).
 * Alinhados ao que o mercado vende: clássico | natureza/aventura | compras & gastronomia.
 */
// ⚠️ "compras-gastronomia" virou só "compras" em 10/08/2026 (decisão do usuário): comer é
// complemento de qualquer dia, não um roteiro. O valor alimenta o slug — `1-dia-compras`.
export type RoteiroProfile = "classico" | "aventura-e-natureza" | "compras";

/** Duração listada no hub (1–7). */
export type RoteiroDiasCount = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface Roteiro {
  id: string;
  slug: string;
  titulo: string;
  /** Frase curta para cards e meta description fallback. */
  descricao_curta: string;
  /** Quantidade de dias do roteiro (deve bater com `dias.length`). */
  diasCount: RoteiroDiasCount;
  profile: RoteiroProfile;
  /** Rótulo humano do perfil (ex.: "Clássico", "Aventura & Natureza"). */
  profileLabel: string;
  dias: RoteiroDay[];
  // ⚠️ `preco_base` REMOVIDO (jul/2026 — conventions/posicionamento.md §21.7, decisão do usuário).
  // Nenhum preço, valor, faixa ou "a partir de" aparece em superfície pública. Quem orça é a agência
  // parceira, depois do submit. O CTA deixou de ter branch com/sem preço: é um só.
  cover?: string;
  /** Destaques curtos no card/detalhe. */
  highlights?: string[];
  seoTitle?: string;
  seoDescription?: string;
  /** Aparece na home / vitrine. */
  featured?: boolean;
}
