import { ClerkProvider } from '@clerk/tanstack-react-start';
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
import { Footer } from '../components/Footer.tsx';
import { Header } from '../components/Header.tsx';
import appCss from '../styles.css?url';

export const Route = createRootRoute({
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
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootComponent,
});

const i18n = createI18n('it');

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const theme = themeForPath(pathname);

  return (
    <ClerkProvider>
      <I18nextProvider i18n={i18n}>
        <RootDocument>
          <div
            className={`theme-${theme} flex min-h-screen flex-col bg-background text-foreground`}
          >
            <Header />
            <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
              <Outlet />
            </main>
            <Footer />
          </div>
        </RootDocument>
      </I18nextProvider>
    </ClerkProvider>
  );
}

// Applica la classe .dark prima dell'hydration leggendo rc:theme, così non c'è
// flash bianco per chi ha il tema scuro salvato. Vedi components/ThemeToggle.
const THEME_BOOTSTRAP = `(function(){try{var t=localStorage.getItem('rc:theme');var d;if(t==='dark'){d=true;}else if(t==='light'){d=false;}else{d=matchMedia('(prefers-color-scheme: dark)').matches;}if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        <HeadContent />
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: theme bootstrap must run before hydration */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
