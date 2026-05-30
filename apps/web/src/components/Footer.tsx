import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { APPS } from '../apps.ts';

export const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const staticSections = [
    {
      title: t('footer.sections.company'),
      links: [
        { label: t('footer.links.home'), to: '/' },
        { label: t('footer.links.contact'), to: '/contatti' },
      ],
    },
    {
      title: t('footer.sections.legal'),
      links: [
        { label: t('footer.links.privacy'), to: '/privacy' },
        { label: t('footer.links.terms'), to: '/termini' },
        { label: t('footer.links.cookie'), to: '/cookie' },
      ],
    },
  ] as const;

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-lg">{t('app.name')}</span>
            <p className="max-w-xs text-muted-foreground text-sm">{t('app.tagline')}</p>
          </div>

          <nav className="flex flex-col gap-3" aria-label={t('footer.sections.apps')}>
            <span className="font-medium text-sm">{t('footer.sections.apps')}</span>
            <ul className="flex flex-col gap-2">
              {APPS.map((app) => (
                <li key={app.slug}>
                  <Link
                    to={`/${app.slug}`}
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  >
                    {t(`subapps.${app.slug}.title`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {staticSections.map((section) => (
            <nav key={section.title} className="flex flex-col gap-3" aria-label={section.title}>
              <span className="font-medium text-sm">{section.title}</span>
              <ul className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-2 border-t pt-6 text-muted-foreground text-xs sm:flex-row">
          <span>
            © {year} {t('app.name')}. {t('footer.rights')}
          </span>
          <nav className="flex gap-4" aria-label={t('footer.sections.legal')}>
            <Link to="/privacy" className="transition-colors hover:text-foreground">
              {t('footer.links.privacy')}
            </Link>
            <Link to="/cookie" className="transition-colors hover:text-foreground">
              {t('footer.links.cookie')}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};
