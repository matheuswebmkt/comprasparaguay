// Filepath: lib/email.ts
// Version: 1.2
// Nome da Versão: "+ e-mail do formulário de contato (/contato → contato@comprasparaguay.online, mesma caixa do ADMIN_EMAIL)"
// Baseado na Versão: 1.1

interface SendArgs {
  to: string;
  subject: string;
  html: string;
  /** Ex: e-mail do visitante que preencheu o formulário — responder o e-mail vai direto pra ele. */
  replyTo?: string;
}

/** Envia um e-mail via API do Resend. Retorna false (no-op) se a API key estiver ausente. */
export async function sendEmail({ to, subject, html, replyTo }: SendArgs): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY ausente — e-mail não enviado.");
    return false;
  }

  // Com onboarding@resend.dev o Resend só aceita o e-mail da conta (modo teste).
  // Domínio verificado em resend.com/domains + EMAIL_FROM nesse domínio = envio real.
  const from = process.env.EMAIL_FROM ?? "Compras Paraguay <onboarding@resend.dev>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html, ...(replyTo ? { reply_to: replyTo } : {}) }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.warn("[email] Resend recusou envio", { status: res.status, to, from, body });
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] Erro de rede Resend:", err);
    return false;
  }
}

/** HTML do e-mail de link mágico (design-system.md §12). */
function magicLinkHtml(link: string): string {
  return `
  <div style="background:#F8FAFC;padding:24px 0;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
      <table role="presentation" width="600" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #E2E8F0;">
        <tr><td style="background:linear-gradient(135deg,#0F2A47,#0A1F35);padding:28px 32px;">
          <span style="color:#ffffff;font-size:18px;font-weight:bold;">Compras Paraguay</span><span style="color:#F4A623;font-size:18px;font-weight:bold;">&bull;</span>
        </td></tr>
        <tr><td style="padding:36px 32px;color:#475569;font-size:15px;line-height:1.6;">
          <h1 style="margin:0 0 12px;color:#0F2A47;font-size:22px;">Seu acesso ao painel</h1>
          <p style="margin:0 0 24px;">Clique no botão abaixo para entrar no painel da Compras Paraguay. O link expira em 15 minutos e só pode ser usado uma vez.</p>
          <a href="${link}" style="display:inline-block;background:#D4821A;color:#ffffff;text-decoration:none;font-weight:bold;font-size:15px;padding:14px 28px;border-radius:10px;">Entrar no painel</a>
          <p style="margin:24px 0 0;font-size:13px;color:#94A3B8;">Se você não solicitou este acesso, ignore este e-mail.</p>
        </td></tr>
        <tr><td style="background:#F8FAFC;padding:18px 32px;color:#94A3B8;font-size:12px;">Compras Paraguay &bull; Foz do Iguaçu, PR</td></tr>
      </table>
    </td></tr></table>
  </div>`;
}

export async function sendMagicLinkEmail(to: string, link: string): Promise<boolean> {
  return sendEmail({
    to,
    subject: "Seu acesso ao painel — Compras Paraguay",
    html: magicLinkHtml(link),
  });
}

/** Magic link do visitante (salvar roteiro / continuar depois). */
function visitorMagicLinkHtml(link: string): string {
  return `
  <div style="background:#F8FAFC;padding:24px 0;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
      <table role="presentation" width="600" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #E2E8F0;">
        <tr><td style="background:linear-gradient(135deg,#0F2A47,#0A1F35);padding:28px 32px;">
          <span style="color:#ffffff;font-size:18px;font-weight:bold;">Compras Paraguay</span><span style="color:#F4A623;font-size:18px;font-weight:bold;">&bull;</span>
        </td></tr>
        <tr><td style="padding:36px 32px;color:#475569;font-size:15px;line-height:1.6;">
          <h1 style="margin:0 0 12px;color:#0F2A47;font-size:22px;">Salve seu roteiro</h1>
          <p style="margin:0 0 24px;">Clique no botão para entrar sem senha e continuar sua jornada em Foz do Iguaçu. O link expira em 15 minutos e só pode ser usado uma vez.</p>
          <a href="${link}" style="display:inline-block;background:#D4821A;color:#ffffff;text-decoration:none;font-weight:bold;font-size:15px;padding:14px 28px;border-radius:10px;">Continuar no Compras Paraguay</a>
          <p style="margin:24px 0 0;font-size:13px;color:#94A3B8;">Se você não pediu este link, ignore este e-mail.</p>
        </td></tr>
        <tr><td style="background:#F8FAFC;padding:18px 32px;color:#94A3B8;font-size:12px;">Compras Paraguay &bull; Foz do Iguaçu, PR</td></tr>
      </table>
    </td></tr></table>
  </div>`;
}

export async function sendVisitorMagicLinkEmail(
  to: string,
  link: string,
): Promise<boolean> {
  return sendEmail({
    to,
    subject: "Seu link para salvar o roteiro — Compras Paraguay",
    html: visitorMagicLinkHtml(link),
  });
}

/** Caixa que recebe o formulário de /contato (fixo — mesma caixa do ADMIN_EMAIL do magic link). */
const CONTACT_EMAIL = "contato@comprasparaguay.online";

function escHtml(v: string): string {
  return v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

interface ContactFormArgs {
  nome: string;
  email: string;
  mensagem: string;
}

function contactFormHtml({ nome, email, mensagem }: ContactFormArgs): string {
  return `
  <div style="background:#F8FAFC;padding:24px 0;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
      <table role="presentation" width="600" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #E2E8F0;">
        <tr><td style="background:linear-gradient(135deg,#0F2A47,#0A1F35);padding:28px 32px;">
          <span style="color:#ffffff;font-size:18px;font-weight:bold;">Compras Paraguay</span><span style="color:#F4A623;font-size:18px;font-weight:bold;">&bull;</span> <span style="color:#9DB4D4;font-size:15px;">novo contato</span>
        </td></tr>
        <tr><td style="padding:36px 32px;color:#475569;font-size:15px;line-height:1.6;">
          <p style="margin:0 0 6px;"><strong style="color:#0F2A47;">Nome:</strong> ${escHtml(nome)}</p>
          <p style="margin:0 0 18px;"><strong style="color:#0F2A47;">E-mail:</strong> ${escHtml(email)}</p>
          <p style="margin:0 0 6px;"><strong style="color:#0F2A47;">Mensagem:</strong></p>
          <p style="margin:0;white-space:pre-line;">${escHtml(mensagem)}</p>
        </td></tr>
        <tr><td style="background:#F8FAFC;padding:18px 32px;color:#94A3B8;font-size:12px;">Enviado pelo formulário de contato do site &bull; comprasparaguay.online</td></tr>
      </table>
    </td></tr></table>
  </div>`;
}

/** Envia o formulário de /contato para a caixa dedicada de contato. No-op (false) sem RESEND_API_KEY. */
export async function sendContactFormEmail(args: ContactFormArgs): Promise<boolean> {
  return sendEmail({
    to: CONTACT_EMAIL,
    subject: `Novo contato pelo site — ${args.nome}`,
    html: contactFormHtml(args),
    replyTo: args.email,
  });
}
