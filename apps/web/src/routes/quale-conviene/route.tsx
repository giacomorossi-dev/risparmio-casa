import { createFileRoute, Outlet } from '@tanstack/react-router';

import HelpButton from '../../features/quale-conviene/components/HelpButton.tsx';
import OnboardingDialog from '../../features/quale-conviene/components/OnboardingDialog.tsx';

export const Route = createFileRoute('/quale-conviene')({
  component: QualeConvieneLayout,
});

// Layout della sotto-app: monta il tour guidato (auto-apertura prima visita +
// trigger "Aiuto") attorno a tutte le pagine /quale-conviene/*.
function QualeConvieneLayout() {
  return (
    <>
      <div className="mb-4 flex justify-end">
        <HelpButton />
      </div>
      <Outlet />
      <OnboardingDialog />
    </>
  );
}
