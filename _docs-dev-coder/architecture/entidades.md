// Filepath: \_docs-dev-coder/architecture/entidades.md
// Parte de architecture.md (índice em ../architecture.md)

# ARCHITECTURE · AGÊNCIAS

> Fonte única de verdade para caminhos, módulos e fronteiras.
> Cabeçalhos `###` PRESERVADOS do arquivo original — referências cruzadas continuam válidas.

---

### Agências
- **Entidade separada de partners** (`app/data/partners.ts` = negócios locais). Agências **recebem
  os leads**.
- ⭐ **SSOT de perfil = `app/data/agencies.ts`:** catálogo estático (mesmo padrão de `partners.ts`)
  com `AgencyProfile` (slug/name/legalName/tagline/description/contatos/cover/highlights/`isPublic`/
  `OFFICIAL_AGENCY_SLUG`/`AGENCY_NICHE_KEY`). Defaults de modal/transporte/labels e o seed do Neon
  leem daqui — trocar a parceria oficial = editar o catálogo (e `OFFICIAL_AGENCY_SLUG` se o slug
  mudar).
- **`lib/agencies.ts`:** tabela `agencies` (Neon) + seed/enrich a partir do catálogo. Exports:
  `getAgencies`/`getAgency`/`getActiveAgencySlug`/`getActiveAgencySlugCached` (tag `active-agency`)/
  `setActiveAgencySlug`/`ACTIVE_AGENCY_TAG`.
- **Agência ativa:** `app_settings.active_agency` (default nenhuma / `__none__`). `/api/leads`
  carimba `leads.assigned_partner` só quando o lead é de fato roteado a ela (`sendAgency`: agência
  com plano vigente + ingresso "querido" + turista ou aceita morador — ver
  `architecture/leads-modal-telegram.md`). `POST /api/admin/active-agency` `{ slug | null }` +
  Ativar/Desativar → `revalidateTag('active-agency')`. ⛔ Desativar **não** mexe no toggle "Receber os
  leads no grupo e atender você mesmo" — ele é decisão do admin e vale como está (ver
  `conventions/telegram.md` §12-bis).
- ⭐ **Nicho `transfer`:** `NicheRecommendation` **não** usa `niche_settings`/partners —
  resolve a **agência ativa** pública. Desativar ou agência com `isPublic:false` → Empty State (sem
  nome/link). ⚠️ **Rota real: `/transfer`** (forma curta — ver `architecture/rotas.md`).
  Modal copy = editor de Oferta (manual, independente do toggle).
- **Relatórios:** `getLeads`/`getLeadCountsByAgency`; admin `/admin/dashboard/agencia` + filtro no
  cofre. Ver `conventions/visibilidade-parceiros.md` §13.
- **Modal:** textos de default usam `officialAgencyName()` do catálogo; valores salvos no admin
  continuam independentes (override por idioma no editor de Oferta).

### Fluxo "Oferta de Ingresso"
- `components/ticket-offer/TicketOfferButton` dispara `CustomEvent` `ticket-offer:open` →
  `TicketOfferModal` (client, montado 1× no layout). Form nome/email/WhatsApp (máscara por país
  BR/PY/AR + "Outro" livre) → `POST /api/leads`; o skip ("comprar ingresso normal") abre o site
  oficial. Ver `conventions/funil-modal.md` §2/§17.
