// Filepath: middleware.ts
// Version: 4.0
// Nome da Versão: "Protege /admin/** + /comercial/painel (sessões separadas) + cookie de idioma"
// Baseado na Versão: 3.0

// ⚠️ IMPORTS PROFUNDAS (regra dura, ver conventions §5-bis): o barrel "next/server" puxa eager
// o módulo user-agent → ua-parser compilado, que executa __dirname no escopo do módulo — inexistente
// no Edge (crash MIDDLEWARE_INVOCATION_FAILED em toda requisição). Importar direto das extensões
// spec evita a cadeia. NextRequest é só tipo (some em runtime); só NextResponse carrega código.
import type { NextRequest } from "next/dist/server/web/spec-extension/request";
import { NextResponse } from "next/dist/server/web/spec-extension/response";// ⚠️ IMPORTS RELATIVAS (regra dura, ver conventions §5-bis): o empacotador de Edge Function
// da Vercel não resolve os aliases "@/*" do tsconfig — só caminhos relativos e pacotes de
// node_modules. Alias aqui = erro "referencing unsupported modules" no deploy.
import { SESSION_COOKIE, verifySessionToken } from "./lib/session";
import { PORTAL_SESSION_COOKIE, verifyPortalSessionToken } from "./lib/portal-session";
import { LOCALE_COOKIE, LOCALE_MAX_AGE, isLocale, detectLocale } from "./lib/i18n/config";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const secret = process.env.AUTH_SECRET;

  // 1) Auth do /admin (login público).
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const email = token && secret ? await verifySessionToken(token, secret) : null;
    if (!email) return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // 2) Painel do parceiro (login em /comercial/login; sessão distinta do admin).
  //    Demais /comercial/* continuam públicas (links manuais noindex).
  if (pathname === "/comercial/painel" || pathname.startsWith("/comercial/painel/")) {
    const token = req.cookies.get(PORTAL_SESSION_COOKIE)?.value;
    const session = token && secret ? await verifyPortalSessionToken(token, secret) : null;
    if (!session) return NextResponse.redirect(new URL("/comercial/login", req.url));
  }

  // 3) Idioma (i18n): semeia cookie locale 1× — sem redirecionar.
  //    Bots NÃO recebem o cookie: rastreiam de IP dos EUA e a geo-detecção os rotularia como "en",
  //    e o conteúdo client i18n-izado re-renderizaria o DOM em inglês para o crawler — snippet do
  //    Google em EN sob <title> em PT. Sem cookie, o LocaleProvider cai em pt (default), alinhado
  //    ao metadata em pt canônico (conventions §21.8).
  const ua = req.headers.get("user-agent") ?? "";
  const isBot = /bot|crawl|spider|slurp|bing|google|yandex|baidu|duckduck|facebookexternalhit|linkedin/i.test(ua);
  const res = NextResponse.next();
  if (!isBot && !isLocale(req.cookies.get(LOCALE_COOKIE)?.value)) {
    const loc = detectLocale(
      req.headers.get("accept-language"),
      req.headers.get("x-vercel-ip-country"),
    );
    res.cookies.set(LOCALE_COOKIE, loc, { path: "/", maxAge: LOCALE_MAX_AGE, sameSite: "lax" });
  }
  return res;
}

export const config = {
  // Site todo (público + admin), exceto API, assets do Next e arquivos (com extensão).
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
