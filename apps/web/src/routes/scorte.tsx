import { createFileRoute } from '@tanstack/react-router';

import { appBySlug } from '../apps.ts';
import { AppHero } from '../components/AppHero.tsx';
import { ComingSoonPanel } from '../components/ComingSoonPanel.tsx';

export const Route = createFileRoute('/scorte')({
  component: ScortePage,
});

function ScortePage() {
  return (
    <>
      <AppHero app={appBySlug('scorte')} />
      <ComingSoonPanel />
    </>
  );
}
