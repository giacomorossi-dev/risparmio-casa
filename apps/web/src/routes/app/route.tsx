import { useAuth } from '@clerk/tanstack-start';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/app')({
  component: AppLayout,
});

function AppLayout() {
  const { t } = useTranslation();
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <p>…</p>;
  if (!isSignedIn) {
    throw redirect({ to: '/' });
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-semibold text-2xl">{t('nav.dashboard')}</h1>
      <Outlet />
    </div>
  );
}
