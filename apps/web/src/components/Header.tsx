import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { clerkEnabled } from '../lib/clerk.ts';
import { AuthControls } from './AuthControls.tsx';
import { ThemeToggle } from './ThemeToggle.tsx';

export const Header = () => {
  const { t } = useTranslation();

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-semibold text-lg">
          {t('app.name')}
        </Link>
        <nav className="flex items-center gap-3">
          <ThemeToggle />
          {clerkEnabled && <AuthControls />}
        </nav>
      </div>
    </header>
  );
};
