import { createI18n, I18nextProvider } from '@rc/i18n';
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  useRouterState,
} from '@tanstack/react-router';
import type { ReactNode } from 'react';

import { themeForPath } from '../apps.ts';
import { CookieConsent } from '../components/CookieConsent.tsx';
import { Footer } from '../components/Footer.tsx';
import { Header } from '../components/Header.tsx';
import { ServiceWorkerRegister } from '../components/ServiceWorkerRegister.tsx';
import { fetchAuthState } from '../lib/clerk-server.ts';
import appCss from '../styles.css?url';

export const Route = createRootRoute({
  // Stato "loggato?" risolto una volta sul server (no clerk-js sulle pagine
  // pubbliche). `staleTime: Infinity`: l'auth è stabile nella sessione e i
  // cambi (login/logout) passano da navigazioni complete che ri-inizializzano.
  loader: () => fetchAuthState(),
  staleTime: Number.POSITIVE_INFINITY,
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Risparmio Casa — Strumenti pratici per risparmiare' },
      {
        name: 'description',
        content:
          'Una raccolta di piccole app italiane per la spesa, le scorte di casa e le bollette.',
      },
      { name: 'theme-color', content: '#5b9e84' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'manifest', href: '/manifest.json' },
      { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' },
    ],
  }),
  component: RootComponent,
});

const i18n = createI18n('it');

// Le route di autenticazione usano un layout a tutto schermo (gradient + card),
// senza header/footer del sito.
const isAuthPath = (pathname: string) =>
  pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const theme = themeForPath(pathname);
  const { isSignedIn, imageUrl, initials } = Route.useLoaderData();

  // Niente <ClerkProvider> qui: le pagine pubbliche non caricano clerk-js.
  // L'auth interattiva vive in /sign-in e /app (che montano ClerkBoundary).
  return (
    <I18nextProvider i18n={i18n}>
      <RootDocument>
        <div className={`theme-${theme} flex min-h-screen flex-col bg-background text-foreground`}>
          {isAuthPath(pathname) ? (
            <Outlet />
          ) : (
            <>
              <Header isSignedIn={isSignedIn} imageUrl={imageUrl} initials={initials} />
              <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
                <Outlet />
              </main>
              <Footer />
            </>
          )}
        </div>
      </RootDocument>
    </I18nextProvider>
  );
}

// Applica la classe .dark prima dell'hydration leggendo rc:theme, così non c'è
// flash bianco per chi ha il tema scuro salvato. Vedi components/ThemeToggle.
const THEME_BOOTSTRAP = `(function(){try{var t=localStorage.getItem('rc:theme');var d;if(t==='dark'){d=true;}else if(t==='light'){d=false;}else{d=matchMedia('(prefers-color-scheme: dark)').matches;}if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

// Google Consent Mode v2 — tutto "denied" finché l'utente non accetta la
// categoria analytics; deve girare PRIMA di qualsiasi script GA4. lib/analytics
// loadGA4() passa a "granted" e inietta gtag.js solo dopo il consenso.
const CONSENT_BOOTSTRAP = `window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments);};window.gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});`;

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        <HeadContent />
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: theme bootstrap must run before hydration */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: gtag consent default must run before any analytics */}
        <script dangerouslySetInnerHTML={{ __html: CONSENT_BOOTSTRAP }} />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        {children}
        <CookieConsent />
        <ServiceWorkerRegister />
        <Scripts />
      </body>
    </html>
  );
}
