import { Show, SignInButton, UserButton } from '@clerk/tanstack-react-start';
import { Button } from '@rc/ui/components/button';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

// Controlli auth basati su Clerk (provider + clerk-js). Isolati qui così l'Header
// li include solo quando Clerk è configurato (`clerkEnabled`): nei build senza
// publishable key l'intero blocco — e gli import @clerk — vengono eliminati.
export const AuthControls = () => {
  const { t } = useTranslation();

  return (
    <>
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
    </>
  );
};
