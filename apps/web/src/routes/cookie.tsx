import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { StaticPage } from '../components/StaticPage.tsx';

export const Route = createFileRoute('/cookie')({
  component: CookiePage,
});

function CookiePage() {
  const { t } = useTranslation();
  return <StaticPage title={t('pages.cookie.title')} description={t('pages.cookie.body')} />;
}
