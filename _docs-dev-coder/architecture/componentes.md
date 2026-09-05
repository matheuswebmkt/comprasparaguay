// Filepath: \_docs-dev-coder/architecture/componentes.md
// Parte de architecture.md (índice em ../architecture.md)

# ARCHITECTURE · COMPONENTES-CHAVE

> Fonte única de verdade para caminhos, módulos e fronteiras.
> Cabeçalhos `###` PRESERVADOS do arquivo original — referências cruzadas continuam válidas.

---

### Componentes-chave

> ⚠️ Este inventário cobre a árvore da **home**. Quem mexer em componente-chave de outra página deve
> documentá-lo aqui também — é o ponto único de referência para "o que existe e o que faz".

#### Hero da home

| Arquivo | Papel |
|---|---|
| `components/roteiros/RoteirosHero.tsx` | Hero da home (`/`). Fundo **Areia puro** + grão, sem foto. Grid 48/52: copy à esquerda, constelação à direita. Duas ações lado a lado: "Quero meu roteiro de compras" (dourado → `/atrativos/compras-paraguai-ciudad-del-este`) e "Ver atrativos e shoppings" (texto linkado → `/atrativos`). Renderizado por `app/page.tsx` como 1ª seção. |
| `components/home/RoteiroConstelacao.tsx` | **Client component.** A constelação: o rótulo "você" num disco central (com anéis pulsando) emitindo um filamento por vez até a miniatura de um atrativo, na ordem manhã → tarde → noite. Os dias espelham o **eixo compras** (os 5 atrativos do catálogo). Loop entre 3 dias. Cada nó é `Link` para `/atrativos/[slug]`. |

⚠️ Não existe `components/home/RoteiroLiveStack.tsx` — foi substituído pela constelação acima; não
recriar.

#### Hero dedicado do nicho `/transfer`

| Arquivo | Papel |
|---|---|
| `components/niche/TransferHero.tsx` | Hero **dedicado** do nicho `transfer`, renderizado por `NichePageTemplate` quando `niche.key === "transfer"` (os demais nichos seguem o hero editorial genérico do template). Fundo Areia puro + grão, `min-h-[100svh]` + `justify-center` + `pt-16` §7.6, coluna única centralizada, H1 na escala única com destaque "sem complicação", CTA único dourado → `#recomendacao`. Copy 100% do `Niche`. |
| `components/niche/NicheRecommendation.tsx` | **Único ponto de contato com parceiro/agência** nas páginas de nicho. O card **não exibe CTAs diretos** — "Ver mais detalhes" é o único CTA (§8-bis), dispara track de abertura (`detail_open`) e abre o **mini modal de contato** (`ContactDetailModal`) que exibe APENAS o `ContactSidebar` (WhatsApp/site/Instagram/endereço). Estrutura de **seção**, não card — fundo branco (§8.2), grid `items-center lg:grid-cols-2` com FOTO à esquerda e conteúdo à direita; businessType = eyebrow, nome = `rf-title`, descrição = `rf-sub`. Usado pela página `/transfer` (agência ativa). |
| `components/niche/TransferAtrativosSection.tsx` | **Seção exclusiva do `/transfer`**, renderizada por `NichePageContent` logo após o `TransferHero` (antes do slot de recomendação). Vitrine dos 4 atrativos mais pedidos no transfer, todos `Attraction` reais (com página própria) e renderizados pelo `AttractionCard` compartilhado: `compras-paraguai-ciudad-del-este`, `by-night-argentina-puerto-iguazu`, `duty-free-shop-puerto-iguazu-argentina` e `aeroporto-checkin-checkout-hotel` (Aeroporto / check-in e check-out no hotel — atrativo novo, serviço sem ingresso, `hasLink=false`). Fundo **Areia** (flui do hero; §8.2), grid `1→2→3→4` colunas com os `sizes` de 4 colunas (§8-ter). Copy da seção em `lib/i18n/niches-content.ts` (`TRANSFER_ATRATIVOS` + `TRANSFER_ATRATIVOS_SLUGS`). |
| `components/niche/TransferPitchCard.tsx` | **Card de recomendação PRÓPRIO do nicho `transfer`** (kind `agency`), renderizado pelo `NichePitchCard` no lugar do card da agência. Sem nome/imagem de agência e sem badge/rodapé: imagem de van neutra com identidade do site (asset `/images/transfer/cover.webp`), título "Transfers e Transporte turístico", eyebrow "TURISMO NA TRÍPLICE FRONTEIRA", descrição e tags (`TRANSFER_PITCH` em `lib/i18n/niches-content.ts`). CTA **"Conversar no WhatsApp"** → `wa.me/5545999245153` (número fixo) com mensagem pronta por idioma. Hospedagem (hotel) e parceiros (partner) seguem no `NichePitchCard`; empty state ("chegando") inalterado. |
| `components/parceiros/ContactDetailModal.tsx` + `ContactDetailTrigger.tsx` + `ContactSidebar.tsx` | **Mini modal de contato** (z-[210], montado 1× no layout). Escuta `contact-detail:open` (lib/contact-detail.ts) com `{ kind: agency|partner, slug }`; resolve o perfil (getAgencyBySlug / getPartnerBySlug) e renderiza SÓ o `ContactSidebar`. O trigger dispara `detail_open` (track) + o evento. O `ContactSidebar` é o bloco de contato extraído (logo, endereço, WhatsApp, site, Instagram, telefone, e-mail). |
| `components/parceiros/PartnerDetailModal.tsx` + `PartnerDetailContent.tsx` | Modal de detalhe do parceiro (z-[210]) — **diálogo centralizado** (não full-screen), padrão `TicketOfferModal`: backdrop escuro com blur (clique fecha), `max-w-6xl` + `max-h-[92svh]` + scroll interno no corpo, close fora do corpo rolável. `PartnerDetailContent` é o miolo (banner, sobre, galeria, features, horários, sidebar de contato com os CTAs, prêmios, cardápio, eventos, fechamento, `RoteirosCta`). |

#### Página individual de atrativo (`/atrativos/[slug]`)

| Arquivo | Papel |
|---|---|
| `components/atrativos/AttractionPageContent.tsx` | Página de detalhe do atrativo (client, i18n). Estrutura no padrão do design system: **hero** Areia puro + grão com breadcrumb, eyebrow ("Atrativo · Foz do Iguaçu"), H1 na escala única (§3) e foto **contida** à direita (`rounded-3xl`, `aspect-[4/3] lg:aspect-[16/10]` — imagem com margem, nunca full-bleed §14); **conteúdo** em grid 1fr/360px ("Sobre" `rf-title` + destaques Verde Selva | sidebar branca `rounded-2xl` com ficha de info e CTA dourado `text-lg font-bold` → `TicketOfferButton`); **FAQ** `.rf-section` branco + `.rf-head` + `FaqAccordion` `max-w-3xl`; **relacionados** via componente compartilhado `RelatedAttractionsSection` (fundo areia, `items` sem o atrativo atual); fecho `RoteirosCta` (padrão compartilhado). Sem `NicheClusterLinks` e sem `PartnerPicks` (decisões do usuário). |

#### Página de confirmação (`/obrigado`)

| Arquivo | Papel |
|---|---|
| `app/obrigado/page.tsx` | Casca server: metadata `noindex` + `<Suspense>` (obrigatório do `useSearchParams`). Compacta — única página pós-submit. |
| `components/obrigado/ObrigadoContent.tsx` | Client: lê o handoff do lead (`sessionStorage`, `lib/lead-success-handoff.ts`) e monta a confirmação — check Verde Selva, subtítulo de próximos passos, resumo do pedido (se houver) e CTAs (produto de compras + home). |

#### Demais seções da home (`app/page.tsx`, ordem de render)

`RoteirosHero` → `DoresSection` → `AutoridadeSection` → `FaqSection` → `PilaresFoz` → `CtaFinal`.
⚠️ `RoteirosHomeSection` ("Roteiros prontos") e `AtrativosDestaqueSection` ("Pontos turísticos")
foram **removidos da home** na simplificação Compras PY (decisão do usuário). `AtrativosDestaqueSection`
continua vivo em `/o-que-fazer`.
A alternância de fundo entre elas é regra — ver `conventions/design.md` §7.4.

| Arquivo | Papel |
|---|---|
| `components/home/DoresSection.tsx` | **Segunda dobra (pós-hero).** A DOR em empatia: eyebrow "O cenário" + 8 dores em grid (tempo, escolha, horário, orçamento, fronteira, antecipação, logística, perda) com ícones Verdes, sem CTA. Fundo branco (alternância §7.5). Copy PT hardcoded (marcador §21.8) — em iteração. |
| `components/home/AutoridadeSection.tsx` | **Pós-Dores (prova — §21.1 camada 4 + mecanismo).** **Os 3 passos do mecanismo** (migrados do `ComoFunciona`, removido — loop de destaque §7.3 com pausa no hover/foco e reduced-motion) → **divisória fina e sutil** → **afirmações** (estrelas de contorno dourado = compromisso, não avaliação; revisão humana §21.3; orçamento do visitante §21.7). Fundo areia. Copy PT hardcoded (marcador §21.8) — em iteração. |
| `components/atrativos/AtrativosDestaqueSection.tsx` | Seção "Atrativos em destaque" — curadoria do eixo compras (`DESTAQUE_SLUGS` = os 5 atrativos do catálogo) + convite para `/atrativos`. Usada hoje em `/o-que-fazer` (saiu da home na simplificação Compras PY). |
| `components/roteiros/RoteiroCard.tsx` | Removido (mundo de roteiros prontos saiu). |
| `components/home/FaqSection.tsx` + `FaqSectionContent.tsx` | FAQ da home: o `FaqSection` (server) emite o JSON-LD canônico em pt; o `FaqSectionContent` (client, i18n) é a parte visível. Fundo **branco puro** (fecha a alternância: Atrativos areia → esta branco → PilaresFoz areia). |
| `components/FaqAccordion.tsx` | **Acordeão de FAQ único do projeto — serve 6 superfícies** (home, `/o-que-fazer`, `/atrativos`, `/atrativos/[slug]`, nichos, tríplice). Server component com `<details>`/`<summary>` nativos, filetes entre itens em vez de caixas. **NÃO** renderiza JSON-LD — isso é da página, senão sai `FAQPage` duplicado. Qualquer cor daqui se multiplica pelo site inteiro. |
- **Utilities de motion removidas de `app/globals.css`** junto com ele, por serem exclusivas dele:
  `rf-row-in`, `rf-progress`, `rf-drift`.
- **Utilities de motion adicionadas em `app/globals.css`:** `rf-grain` (grão sobre o Areia),
  `rf-core-ring` (anel pulsando do núcleo), `rf-ring-spin` (anéis orbitais). As três estão no
  guard de `prefers-reduced-motion` junto com `rf-rise`.
- `rf-rise` + `rf-d1..rf-d5` (entrada escalonada) seguem vivas e são usadas pelo hero.

#### Cobertura de transição do envio de lead

| Arquivo | Papel |
|---|---|
| `components/ui/EnvioOverlay.tsx` | **Client component montado no `app/layout.tsx`** (root). Cobre a tela com scrim BRANCO translúcido + `backdrop-filter` e um spinner Verde Selva entre o submit do lead e a navegação pós-submit. Ligado pelo `CustomEvent` `lead:enviando` (constante `ENVIO_EVENT` exportada daqui), disparado por `TicketOfferModal` logo antes do `router.push`. ⚠️ **Tem de ficar no root layout:** o `TicketOfferModal` faz `setOpen(false)` antes de navegar e tem `if (!open) return null`, então um overlay dentro dele morreria no instante em que precisa aparecer. Some por `usePathname()` (rota nova commitada) e tem timeout de segurança de 12s. Usa `MODAL_UI[locale].finalizing` ("Finalizando…") — chave PRÓPRIA, não o `submitting` do CTA. Sob `prefers-reduced-motion` o spinner some por `display:none` (`.rf-envio-spin` no `globals.css`). |
