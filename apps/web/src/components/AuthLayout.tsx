import { Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

// Layout per le pagine di autenticazione: sfondo a gradient (token del tema, quindi
// segue dark mode) con il contenuto — la card — centrato. Le pagine auth non hanno
// header, quindi un link "torna alla home" in alto a sinistra.
export function AuthLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center gap-4 bg-gradient-to-br from-primary/15 via-background to-accent/25 p-4">
      {children}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('nav.home')}
      </Link>
    </div>
  );
}
