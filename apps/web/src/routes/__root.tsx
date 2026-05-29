import { ClerkProvider } from '@clerk/tanstack-react-start';
import { createI18n, I18nextProvider } from '@rc/i18n';
import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import type { ReactNode } from 'react';

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
  return (
    <ClerkProvider>
      <I18nextProvider i18n={i18n}>
        <RootDocument>
          <div className="flex min-h-screen flex-col">
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

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
