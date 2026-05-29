import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { ComingSoonPanel } from '../components/ComingSoonPanel.tsx';

export const Route = createFileRoute('/quale-conviene')({
  component: QualeConvienePage,
});

function QualeConvienePage() {
  const { t } = useTranslation();
  return (
    <ComingSoonPanel
      title={t('subapps.quale-conviene.title')}
      description={t('subapps.quale-conviene.description')}
    />
  );
}
