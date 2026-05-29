import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { ComingSoonPanel } from '../components/ComingSoonPanel.tsx';

export const Route = createFileRoute('/scorte')({
  component: ScortePage,
});

function ScortePage() {
  const { t } = useTranslation();
  return (
    <ComingSoonPanel
      title={t('subapps.scorte.title')}
      description={t('subapps.scorte.description')}
    />
  );
}
