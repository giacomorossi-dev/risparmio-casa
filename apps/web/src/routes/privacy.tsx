import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { StaticPage } from '../components/StaticPage.tsx';
import { canonical } from '../lib/site.ts';

export const Route = createFileRoute('/privacy')({
  head: () => ({ links: canonical('/privacy') }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const { t } = useTranslation();
  return <StaticPage title={t('pages.privacy.title')} description={t('pages.privacy.body')} />;
}
