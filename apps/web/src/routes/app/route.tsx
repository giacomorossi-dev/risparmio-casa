import { UserButton, useAuth } from '@clerk/tanstack-react-start';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { ClerkBoundary } from '../../components/ClerkBoundary.tsx';

export const Route = createFileRoute('/app')({
  component: AppLayout,
});

// L'area riservata monta Clerk (ClerkBoundary → clerk-js) perché qui serve
// davvero: guardia auth client + UserButton (logout). clerk-js resta confinato
// al chunk di /app, fuori dalle pagine pubbliche.
function AppLayout() {
  return (
    <ClerkBoundary>
      <AppShell />
    </ClerkBoundary>
  );
}

function AppShell() {
  const { t } = useTranslation();
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <p>…</p>;
  if (!isSignedIn) {
    throw redirect({ to: '/sign-in' });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-2xl">{t('nav.dashboard')}</h1>
        <UserButton />
      </div>
      <Outlet />
    </div>
  );
}
