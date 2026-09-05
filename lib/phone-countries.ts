// Filepath: lib/phone-countries.ts
// Version: 1.0
// Nome da Versão: "Extrai COUNTRIES/applyMask do TicketOfferModal — compartilhado com MontarRoteiroWizard"
//
// Único lugar com a lista de países + máscara de telefone usada em qualquer formulário de contato do site
// (modal de captura e wizard "Montar roteiro"). Shape (`prefix`/`mask`/`digits`) casa com `countryPrefix`
// gravado em lib/known-lead.ts — não renomear sem atualizar os dois consumidores.

export interface CountryEntry {
  flag: string;
  prefix: string;
  mask: string;
  digits: number;
}

export const COUNTRIES: CountryEntry[] = [
  { flag: "🇧🇷", prefix: "+55",  mask: "(##) # ####-####", digits: 11 },
  { flag: "🇵🇾", prefix: "+595", mask: "## ### ####",     digits: 9  },
  { flag: "🇦🇷", prefix: "+54",  mask: "(##) ####-####",  digits: 10 },
];

export function applyPhoneMask(raw: string, mask: string, maxDigits: number): string {
  const digits = raw.replace(/\D/g, "").slice(0, maxDigits);
  let out = "";
  let di = 0;
  for (let i = 0; i < mask.length && di < digits.length; i++) {
    out += mask[i] === "#" ? digits[di++] : mask[i];
  }
  return out;
}
