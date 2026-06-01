import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { ComingSoonPanel } from '../components/ComingSoonPanel.tsx';
import { Hero } from '../components/Hero.tsx';

export const Route = createFileRoute('/utilita')({
  component: UtilitaPage,
});

function UtilitaPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-10">
      <Hero
        eyebrow="Presto disponibile"
        title={t('subapps.utilita.title')}
        subtitle={t('subapps.utilita.description')}
      />
      <ComingSoonPanel />
    </div>
  );
}
