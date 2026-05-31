import { Button } from '@rc/ui/components/button';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { clerkEnabled } from '../lib/clerk.ts';
import { ThemeToggle } from './ThemeToggle.tsx';

// `isSignedIn` arriva dal loader di root (auth verificata lato server): l'header
// sceglie tra "Accedi" e "Area personale" con due semplici link, senza clerk-js.
// clerk-js si carica solo quando l'utente entra in /sign-in o /app.
export const Header = ({ isSignedIn }: { isSignedIn: boolean }) => {
  const { t } = useTranslation();

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-semibold text-lg">
          {t('app.name')}
        </Link>
        <nav className="flex items-center gap-3">
          <ThemeToggle />
          {clerkEnabled &&
            (isSignedIn ? (
              <Button render={<Link to="/app" />} nativeButton={false} variant="outline" size="sm">
                {t('nav.dashboard')}
              </Button>
            ) : (
              <Button render={<Link to="/sign-in" />} nativeButton={false} size="sm">
                {t('nav.signIn')}
              </Button>
            ))}
        </nav>
      </div>
    </header>
  );
};
