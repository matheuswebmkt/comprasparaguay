// Filepath: lib/turnstile.ts
// Version: 1.0
// Nome da Versão: "Verificação server-side do Cloudflare Turnstile (anti-bot do modal)"
//
// Espelha o padrão do projeto (meta-capi/telegram): NO-OP silencioso se faltar `TURNSTILE_SECRET_KEY`
// (o form segue funcionando). Configurado: valida o token com o siteverify do Cloudflare antes de gravar/rotear o lead.
// Nunca lança.

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Verifica o token do Turnstile enviado pelo modal. Retorna:
 *  • `true`  se não está configurado (no-op) OU o token é válido;
 *  • `false` se está configurado e o token está ausente/ inválido (provável bot → o caller bloqueia).
 * ⚠️ Fail-OPEN em erro de rede ao Cloudflare (não perder lead legítimo por indisponibilidade); fail-CLOSED em token ausente/inválido.
 */
export async function verifyTurnstile(token: string | null, remoteIp?: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;   // não configurado → no-op
  if (!token) return false;   // configurado mas sem token → bloqueia

  try {
    const body = new URLSearchParams();
    body.set("secret", secret);
    body.set("response", token);
    if (remoteIp) body.set("remoteip", remoteIp);

    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = (await res.json().catch(() => null)) as { success?: boolean } | null;
    return data?.success === true;
  } catch {
    return true; // erro de rede ao CF → fail-open (não bloqueia lead legítimo)
  }
}
