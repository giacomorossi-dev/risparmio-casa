import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { StaticPage } from '../components/StaticPage.tsx';

export const Route = createFileRoute('/privacy')({
  component: PrivacyPage,
});

function PrivacyPage() {
  const { t } = useTranslation();
  return <StaticPage title={t('pages.privacy.title')} description={t('pages.privacy.body')} />;
}
