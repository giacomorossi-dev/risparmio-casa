import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { ComingSoonPanel } from '../components/ComingSoonPanel.tsx';
import { Hero } from '../components/Hero.tsx';

export const Route = createFileRoute('/scorte')({
  component: ScortePage,
});

function ScortePage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-10">
      <Hero
        eyebrow="Presto disponibile"
        title={t('subapps.scorte.title')}
        subtitle={t('subapps.scorte.description')}
      />
      <ComingSoonPanel />
    </div>
  );
}
