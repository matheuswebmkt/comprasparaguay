// Filepath: lib/attraction-catalog.ts
// Version: 1.0
// Nome da Versão: "Nasce do extinto lib/attraction-offers.ts — projeção magra slug→nome, sem tabela e sem admin"
//
// O `lib/attraction-offers.ts` que existiu aqui guardava, POR ATRATIVO, o modo da tela de sucesso
// (Direto × Agência), "tem link" e a URL oficial — uma tabela (`attraction_offer_settings`) e uma
// seção no admin. Ele morreu junto com a venda de ingresso: os atrativos do catálogo são serviços
// reservados com a agência, e TODOS abrem a captura de reserva de data. Não há mais o que configurar.
//
// O que o client ainda precisa saber do catálogo é só o NOME de cada atrativo — o seletor "incluir
// outros atrativos" do modal e o resumo do pedido precisam listar/atribuir nomes sem importar
// `app/data/attractions.ts` no bundle (o arquivo é conteúdo pesado: descrição, FAQ, highlights).
// Daí esta projeção: montada no servidor, entra assada no `OfferConfig` como `Record<slug, nome>`.

import { attractions } from "@/app/data/attractions";

/** `slug → nome` de todo o catálogo. SERVER-ONLY (importa o catálogo cheio); o que vai ao client é o
 * resultado, já reduzido a strings. */
export function getAttractionCatalog(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const a of attractions) out[a.slug] = a.name;
  return out;
}
