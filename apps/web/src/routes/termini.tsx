import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { StaticPage } from '../components/StaticPage.tsx';
import { canonical } from '../lib/site.ts';

export const Route = createFileRoute('/termini')({
  head: () => ({ links: canonical('/termini') }),
  component: TerminiPage,
});

function TerminiPage() {
  const { t } = useTranslation();
  return <StaticPage title={t('pages.terms.title')} description={t('pages.terms.body')} />;
}
