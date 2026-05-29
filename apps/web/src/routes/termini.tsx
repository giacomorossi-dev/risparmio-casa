import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { StaticPage } from '../components/StaticPage.tsx';

export const Route = createFileRoute('/termini')({
  component: TerminiPage,
});

function TerminiPage() {
  const { t } = useTranslation();
  return <StaticPage title={t('pages.terms.title')} description={t('pages.terms.body')} />;
}
