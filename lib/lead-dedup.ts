// Filepath: lib/lead-dedup.ts
// Version: 1.0
// Nome da Versão: "Constante de dedup isolada em arquivo client-safe (sem imports de Node/DB)"
//
// `LEAD_DEDUP_WINDOW_MIN` precisa ser lida tanto no SERVER (app/api/leads/route.ts) quanto no CLIENT
// (lib/known-lead.ts, dentro do TicketOfferModal "use client") — mesma janela nos dois lados, senão o
// client acha que uma submissão ainda está "recente" quando o server já não considera mais duplicata (ou
// vice-versa). Este arquivo só tem a constante, sem nenhum import, e pode ser usado dos dois lados.
export const LEAD_DEDUP_WINDOW_MIN = 45;
