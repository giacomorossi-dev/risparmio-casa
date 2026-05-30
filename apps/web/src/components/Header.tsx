import { Show, SignInButton, UserButton } from '@clerk/tanstack-react-start';
import { Button } from '@rc/ui/components/button';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

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
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button size="sm">{t('nav.signIn')}</Button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <Link to="/app" className="font-medium text-sm hover:underline">
              {t('nav.dashboard')}
            </Link>
            <UserButton />
          </Show>
        </nav>
      </div>
    </header>
  );
};
