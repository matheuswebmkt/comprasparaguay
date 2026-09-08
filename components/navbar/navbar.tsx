// Filepath: components/navbar/navbar.tsx
// Version: 8.6
// Nome da Versão: "CTA da navbar vira 'Reservar data' — abre o modal do Compras Paraguay (mesmo funil do hero)"
// Baseado na Versão: 8.4

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { internalUrl } from "@/lib/utm";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { HOME_UI } from "@/lib/i18n/home";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import ReservarDataCta from "@/components/ReservarDataCta";

const Navbar = () => {
  const { locale } = useLocale();
  const t = HOME_UI[locale].navbar;
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const suppressUntil = useRef(0);

  const pathname = usePathname();
  const fromSource =
    pathname === "/"
      ? "home"
      : pathname.split("/").filter(Boolean).pop() || "home";

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Date.now() < suppressUntil.current) {
        lastY.current = y;
        return;
      }
      const dy = y - lastY.current;
      if (y < 80) setHidden(false);
      else if (dy > 4) setHidden(true);
      else if (dy < -12) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.('a[href^="#"]');
      if (!anchor) return;
      suppressUntil.current = Date.now() + 900;
      setHidden(true);
    };
    document.addEventListener("click", onAnchorClick);
    return () => document.removeEventListener("click", onAnchorClick);
  }, []);

  const links = [
    { href: "/roteiros-de-compras", label: t.whatToDo },
    { href: "/transfer", label: t.transfer },
    { href: "/triplice-fronteira", label: t.tripleFrontier },
  ];

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-300 ${hidden ? "-translate-y-full" : "translate-y-0"}`}
      style={{
        background: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid hsl(214,25%,90%)",
      }}
    >
      <div className="section-container flex h-16 items-center justify-between gap-3">
        {/* Wordmark: Fraunces 600 em Verde Selva. NÃO voltar para dourado — §2 proíbe dourado como
            cor de TEXTO sobre fundo claro, e o dourado desta tela já é o CTA (§1: um único objeto
            dourado por tela). Também não voltar a `uppercase` (extras §13) nem a 900 (§3). */}
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight transition-opacity hover:opacity-80 sm:text-xl"
          style={{
            fontFamily: "var(--font-display)",
            color: "hsl(152,47%,32%)",
          }}
        >
          {t.brand}
        </Link>

        <div className="hidden items-center gap-5 lg:flex xl:gap-7">
          {links.map((l) => (
            <Link
              key={l.href}
              href={internalUrl(l.href, `navbar-${fromSource}`)}
              className="text-sm font-semibold transition-opacity hover:opacity-70"
              style={{ color: "hsl(210,56%,23%)" }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />

          {/* ⚠️ `hidden lg:inline-flex`: abaixo de lg este CTA vive DENTRO do menu hambúrguer
              (ver o painel no fim do arquivo), não na barra. A barra no mobile ficaria com
              idioma + CTA + hambúrguer em 64px de altura.
              ⓘ `ReservarDataCta`, NÃO `<Link>`: o CTA primário do site é a RESERVA — abre o modal
              do dia de compras direto no calendário, mesmo caminho do hero e do CTA final. O
              dourado navegar era promessa e tela desalinhadas (§21.2): um rótulo de conversão
              que navegava pra uma página de conteúdo. */}
          <ReservarDataCta
            ctaType="navbar_reserva"
            source={`navbar-cta-${fromSource}`}
            className="hidden items-center rounded-full px-3 py-1.5 text-xs font-bold text-white transition-all hover:scale-[1.03] active:scale-[0.98] sm:px-4 sm:py-2 sm:text-sm lg:inline-flex"
            style={{
              background:
                "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)",
            }}
          />

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t.closeMenu : t.openMenu}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors lg:hidden"
            style={{
              background: "hsl(214,30%,94%)",
              color: "hsl(210,56%,23%)",
            }}
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className="border-t lg:hidden"
          style={{
            borderColor: "hsl(214,25%,90%)",
            background: "rgba(255,255,255,0.95)",
          }}
        >
          <div className="section-container flex flex-col gap-1 py-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={internalUrl(l.href, `navbar-${fromSource}`)}
                className="py-2.5 text-sm font-semibold transition-opacity hover:opacity-70"
                style={{ color: "hsl(210,56%,23%)" }}
              >
                {l.label}
              </Link>
            ))}

            {/* O CTA primário do mobile mora AQUI, não na barra (ver o `hidden lg:inline-flex` lá
                em cima). Forma da família "chrome" (`rounded-full` — continua sendo cromo da
                navbar, design-system §2), tamanho da família inline (`py-3 text-sm`): a 28px de
                altura do chrome, esticado em largura total, o botão lê fino.
                ⚠️ `utm_source` PRÓPRIO (`navbar-menu-cta-*`): este clique custa um toque a mais
                que o da barra: somar os dois numa série só esconderia exatamente a diferença que
                justifica ou condena esta mudança. Mesmo CTA do topo: `ReservarDataCta` abre o
                modal do dia de compras, rótulo "Reservar data". */}
              <ReservarDataCta
                ctaType="navbar_menu_reserva"
                source={`navbar-menu-cta-${fromSource}`}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white transition-all hover:scale-[1.03] active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(35,82%,47%) 0%, hsl(38,90%,55%) 100%)",
                }}
              />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
