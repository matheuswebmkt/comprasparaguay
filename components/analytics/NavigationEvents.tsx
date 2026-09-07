// Filepath: components/analytics/NavigationEvents.tsx
// Version: 4.1
// Nome da Versão: "pageview de rota volta para o dataLayer (canal Google é o container do GTM do portfólio, não gtag direto)"
// Baseado na Versão: 4.0
'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { track } from '@/lib/track'
import { getInboundUtms } from '@/lib/utm'
import { fbqTrack } from '@/lib/fbq'

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const firstLoad = useRef(true);
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    // Não rastreia o painel admin (navegação interna do dono).
    if (pathname.startsWith('/admin')) return;

    // Não rastreia páginas 404 (marcador do app/not-found.tsx). Evita que probes de bots
    // a caminhos inexistentes (ex: /cmd_sco) poluam as métricas.
    if (typeof document !== 'undefined' && document.querySelector('[data-rgf-notfound]')) return;

    const search = searchParams.toString();
    const usource = searchParams.get('utm_source');
    const isInternal = !!usource && usource.startsWith('interno-');

    // Conta 1 pageview por pathname (ignora re-disparo só por mudança de query, ex.: a limpeza abaixo
    // ou re-clique na mesma página). Captura a UTM ANTES de limpar.
    if (lastPath.current !== pathname) {
      lastPath.current = pathname;
      track({ type: 'pageview', path: pathname, utm: getInboundUtms(search) });
      // Meta Pixel: 1ª PageView vem do script base; nas trocas de rota dispara aqui.
      if (firstLoad.current) {
        firstLoad.current = false;
      } else {
        fbqTrack('PageView');
        // Pageview de rota no canal Google: push no dataLayer, que é o que as tags do container do
        // GTM escutam (o GA4 vive dentro do container — não há gtag direto neste projeto). A 1ª
        // pageview vem do próprio carregamento da página.
        window.dataLayer?.push({ event: 'page_view', page_path: pathname });
      }
    }

    // UTM INTERNA é só p/ controle: depois de capturada, limpa da URL (mesmo em self-nav)
    // para não poluir ao copiar/compartilhar. replaceState não recarrega nem gera pageview.
    if (isInternal) {
      const sp = new URLSearchParams(search);
      for (const k of [...sp.keys()]) if (k.startsWith('utm_')) sp.delete(k);
      const qs = sp.toString();
      window.history.replaceState(null, '', qs ? `${pathname}?${qs}` : pathname);
    }
  }, [pathname, searchParams]);

  return null;
}
