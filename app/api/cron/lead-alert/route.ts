// Filepath: app/api/cron/lead-alert/route.ts
// POST/GET — chamado por um scheduler EXTERNO (cron-job.org, a cada 60 min; Vercel Hobby não libera
// cron frequente) pra avisar o grupo da agência quando há lead(s) sem "Assumir"/"Confirmar" há mais de
// LEAD_ALERT_MIN minutos. Protegido por `?secret=` (CRON_SECRET) — não é chamado pelo navegador, não dá
// pra usar same-origin (mesmo padrão de proteção do /api/telegram-webhook, mas via query em vez de
// header, já que schedulers externos costumam não deixar configurar headers customizados no plano grátis).
//
// Nunca duplica o ping (apaga o anterior antes de mandar um novo — lib/lead-alerts.ts guarda o message_id
// vivo) e só envia dentro do horário de atendimento (06h–23h, America/Sao_Paulo) — fora disso, no-op.

import { NextRequest, NextResponse } from "next/server";
import { deleteMessage, sendPendingAlert } from "@/lib/telegram";
import { getPendingAlertMessageId, setPendingAlertMessageId, getOverdueLeads, resolveAlertChatId, LEAD_ALERT_MIN } from "@/lib/lead-alerts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isBusinessHoursBRT(): boolean {
  try {
    const hour = Number(
      new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", hour: "2-digit", hour12: false }).format(new Date())
    );
    return hour >= 6 && hour < 23;
  } catch {
    return true; // fail-open: melhor um ping a mais do que nunca avisar por erro de fuso
  }
}

async function handle(req: NextRequest): Promise<NextResponse> {
  const secret = process.env.CRON_SECRET;
  const got = req.nextUrl.searchParams.get("secret");
  if (!secret || got !== secret) return new NextResponse(null, { status: 401 });

  // `force=1` pula a checagem de horário — só pra testar manualmente fora do expediente (ainda exige o
  // secret certo). O scheduler de verdade nunca manda esse param.
  // ⚠️ O 200 desta rota NÃO significa que a mensagem saiu — cada ramo abaixo loga o motivo no console
  // da Vercel (visível em Deployments → Functions). Fora disso, o GET manual com `?secret=` responde o
  // mesmo JSON no navegador — é o teste definitivo de config.
  const force = req.nextUrl.searchParams.get("force") === "1";
  if (!force && !isBusinessHoursBRT()) {
    console.log("[cron/lead-alert] skipped: fora do horário de atendimento (06h–23h BRT)");
    return NextResponse.json({ ok: true, skipped: "outside-business-hours" });
  }

  const chatId = await resolveAlertChatId();
  if (!chatId) {
    console.log(
      "[cron/lead-alert] skipped: sem chat de destino — agency_chat_id vazio no admin OU toggle \"Enviar lead ao grupo\" desligado",
    );
    return NextResponse.json({ ok: true, skipped: "no-agency-chat-id" });
  }

  const overdueLeads = await getOverdueLeads(LEAD_ALERT_MIN);
  const currentId = await getPendingAlertMessageId();

  if (overdueLeads.length > 0) {
    if (currentId) await deleteMessage(chatId, currentId);
    const newId = await sendPendingAlert(chatId, overdueLeads);
    await setPendingAlertMessageId(newId);
    console.log(
      `[cron/lead-alert] overdue=${overdueLeads.length} pinged=${newId != null}${newId == null ? " (sendMessage falhou — ver erro do Telegram acima)" : ""}`,
    );
    return NextResponse.json({ ok: true, overdue: overdueLeads.length, pinged: newId != null });
  }

  // Nada pendente: se ainda houver um ping vivo de um ciclo anterior, limpa (rede de segurança — o
  // webhook já apaga no momento do claim/confirm; isso cobre qualquer caso perdido).
  if (currentId) {
    await deleteMessage(chatId, currentId);
    await setPendingAlertMessageId(null);
  }
  console.log(
    `[cron/lead-alert] overdue=0 (nenhum lead há mais de ${LEAD_ALERT_MIN}min sem Assumir — nada a avisar)`,
  );
  return NextResponse.json({ ok: true, overdue: 0 });
}

export async function GET(req: NextRequest) {
  return handle(req);
}

export async function POST(req: NextRequest) {
  return handle(req);
}
