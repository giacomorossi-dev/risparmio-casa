import { createFileRoute } from '@tanstack/react-router';

import { appBySlug } from '../apps.ts';
import { AppHero } from '../components/AppHero.tsx';
import { ComingSoonPanel } from '../components/ComingSoonPanel.tsx';

export const Route = createFileRoute('/utilita')({
  component: UtilitaPage,
});

function UtilitaPage() {
  return (
    <>
      <AppHero app={appBySlug('utilita')} />
      <ComingSoonPanel />
    </>
  );
}
