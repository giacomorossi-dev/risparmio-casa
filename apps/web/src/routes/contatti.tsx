import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { StaticPage } from '../components/StaticPage.tsx';
import { canonical } from '../lib/site.ts';

export const Route = createFileRoute('/contatti')({
  head: () => ({ links: canonical('/contatti') }),
  component: ContattiPage,
});

function ContattiPage() {
  const { t } = useTranslation();
  const email = t('pages.contact.email');
  return (
    <StaticPage title={t('pages.contact.title')} description={t('pages.contact.body')}>
      <a href={`mailto:${email}`} className="font-medium text-primary text-sm hover:underline">
        {email}
      </a>
    </StaticPage>
  );
}
