import { createFileRoute, Outlet } from '@tanstack/react-router';

import OnboardingDialog from '../../features/quale-conviene/components/OnboardingDialog.tsx';

export const Route = createFileRoute('/quale-conviene')({
  component: QualeConvieneLayout,
});

// Layout della sotto-app: monta il tour guidato (auto-apertura prima visita +
// trigger "Scopri come funziona" nell'hero) attorno a tutte le pagine
// /quale-conviene/*.
function QualeConvieneLayout() {
  return (
    <>
      <Outlet />
      <OnboardingDialog />
    </>
  );
}
