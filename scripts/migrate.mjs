// Filepath: scripts/migrate.mjs
// Aplica db/schema.sql no Neon. Uso: pnpm db:migrate
// Carrega automaticamente .env.local OU .env (ou usa DATABASE_URL já no ambiente).

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { neon } from "@neondatabase/serverless";

// --- Carrega variáveis de um arquivo .env simples (KEY=VALUE), sem dependências ---
function loadEnvFile(file) {
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let val = m[2].trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!(m[1] in process.env)) process.env[m[1]] = val;
  }
}

if (!process.env.DATABASE_URL) {
  loadEnvFile(".env.local");
  loadEnvFile(".env");
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("❌ DATABASE_URL não encontrada (procurei no ambiente, .env.local e .env). Ver .env.example.");
  process.exit(1);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const schema = readFileSync(join(__dirname, "..", "db", "schema.sql"), "utf8");

// O driver HTTP do Neon executa um statement por chamada.
// Removemos comentários de linha (-- ...) ANTES de dividir por ';' para não perder statements.
const statements = schema
  .split(/\r?\n/)
  .map((line) => line.replace(/--.*$/, "")) // tira comentários (não há literais com "--" no schema)
  .join("\n")
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

const sql = neon(url);

try {
  for (const stmt of statements) {
    await sql.query(stmt);
  }
  console.log(`✅ Migração concluída (${statements.length} statements).`);
} catch (err) {
  console.error("❌ Falha na migração:", err);
  process.exit(1);
}
