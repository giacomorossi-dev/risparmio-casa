import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/tanstack-start';
import { Button } from '@rc/ui/components/button';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const Header = () => {
  const { t } = useTranslation();

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-semibold text-lg">
          {t('app.name')}
        </Link>
        <nav className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                {t('nav.signIn')}
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm">{t('nav.signUp')}</Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link to="/app" className="font-medium text-sm hover:underline">
              {t('nav.dashboard')}
            </Link>
            <UserButton />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
};
