// Filepath: components/i18n/LocaleProvider.tsx
// Version: 1.0
// Nome da Versão: "Contexto de idioma (client) — lê o cookie semeado pelo middleware; troca sem reload"
//
// O layout raiz é ESTÁTICO (não pode ler cookie sem virar dinâmico e quebrar o SSG). Então o locale é
// resolvido no CLIENT: iniciamos em pt (bate com o HTML estático → sem hydration mismatch) e, no mount,
// lemos o cookie `locale` (que o middleware semeou no 1º acesso). O modal renderiza pós-abertura, então
// já pega o idioma certo, sem flash. Ver conventions §18.
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { type Locale, DEFAULT_LOCALE, LOCALE_COOKIE, LOCALE_MAX_AGE, isLocale } from "@/lib/i18n/config";

interface LocaleCtx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  ready: boolean; // true após ler o cookie no client (evita flash de bandeira no seletor)
}

const Ctx = createContext<LocaleCtx>({ locale: DEFAULT_LOCALE, setLocale: () => {}, ready: false });

function cookieLocale(): Locale | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|;\s*)locale=([^;]+)/);
  return m && isLocale(m[1]) ? (m[1] as Locale) : null;
}

export default function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Resolução SÓ por cookie — sem fallback de navigator.language. O middleware semeia o cookie
    // na mesma resposta do HTML, então o usuário real já o tem no mount. Quem não tem cookie
    // cai em pt (default), inclusive crawlers: o fallback antigo fazia o Googlebot (headless
    // Chrome en-US) re-renderizar o DOM em inglês — snippet EN sob <title> PT (conventions §21.8).
    const fromCookie = cookieLocale();
    if (fromCookie) setLocaleState(fromCookie);
    setReady(true);
  }, []);

  const setLocale = (l: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=${LOCALE_MAX_AGE}; samesite=lax`;
    setLocaleState(l);
  };

  return <Ctx.Provider value={{ locale, setLocale, ready }}>{children}</Ctx.Provider>;
}

export const useLocale = () => useContext(Ctx);
