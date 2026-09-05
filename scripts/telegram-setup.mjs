// Filepath: scripts/telegram-setup.mjs
// Registra o webhook do bot no Telegram (Bot API via HTTP). Uso: pnpm telegram:setup
// Carrega automaticamente .env.local OU .env (ou usa as envs já no ambiente).
//
// Precisa de: TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET e a URL pública do site.
// A URL do webhook = <SITE>/api/telegram-webhook, onde <SITE> vem de (nesta ordem):
//   1) argumento na linha de comando:  pnpm telegram:setup https://www.seudominio.com.br
//   2) TELEGRAM_WEBHOOK_URL   (URL completa já com o caminho, se quiser sobrescrever)
//   3) NEXT_PUBLIC_SITE_URL   (default do projeto)

import { readFileSync, existsSync } from "node:fs";

// --- Carrega variáveis de um .env simples (KEY=VALUE), sem dependências (igual migrate.mjs) ---
function loadEnvFile(file) {
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let val = m[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(m[1] in process.env)) process.env[m[1]] = val;
  }
}

if (!process.env.TELEGRAM_BOT_TOKEN) {
  loadEnvFile(".env.local");
  loadEnvFile(".env");
}

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;

if (!TOKEN) {
  console.error("❌ TELEGRAM_BOT_TOKEN não encontrado (ambiente, .env.local ou .env). Ver .env.example.");
  process.exit(1);
}
if (!SECRET) {
  console.error("❌ TELEGRAM_WEBHOOK_SECRET não encontrado. Gere um (ex: openssl rand -hex 32) e coloque no .env.");
  process.exit(1);
}

// Resolve a URL do webhook.
const argUrl = process.argv[2];
const explicit = process.env.TELEGRAM_WEBHOOK_URL;
const base = argUrl || explicit || process.env.NEXT_PUBLIC_SITE_URL;
if (!base) {
  console.error("❌ Sem URL pública. Passe como argumento ou defina NEXT_PUBLIC_SITE_URL / TELEGRAM_WEBHOOK_URL.");
  process.exit(1);
}
// Se a URL já apontar para o caminho do webhook, respeita; senão, anexa.
const webhookUrl = base.includes("/api/telegram-webhook")
  ? base
  : `${base.replace(/\/+$/, "")}/api/telegram-webhook`;

const API = `https://api.telegram.org/bot${TOKEN}`;

async function tg(method, body) {
  const res = await fetch(`${API}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  return res.json();
}

try {
  console.log(`→ Registrando webhook: ${webhookUrl}`);
  const set = await tg("setWebhook", {
    url: webhookUrl,
    // callback_query = cliques nos botões; message = o `/start lead_<id>` do deep-link no privado (TG-4).
    secret_token: SECRET,
    allowed_updates: ["callback_query", "message"],
    drop_pending_updates: true,
  });
  if (!set.ok) {
    console.error("❌ setWebhook falhou:", set.description ?? set);
    process.exit(1);
  }
  console.log("✅ Webhook registrado.");

  const info = await tg("getWebhookInfo");
  if (info.ok) {
    const r = info.result;
    console.log("ℹ️  getWebhookInfo:");
    console.log(`    url:                  ${r.url}`);
    console.log(`    pending_update_count: ${r.pending_update_count}`);
    console.log(`    has_custom_certificate: ${r.has_custom_certificate}`);
    if (r.last_error_message) {
      console.log(`    ⚠️ last_error:         ${r.last_error_date} — ${r.last_error_message}`);
    }
  }
} catch (err) {
  console.error("❌ Erro ao registrar o webhook:", err);
  process.exit(1);
}
