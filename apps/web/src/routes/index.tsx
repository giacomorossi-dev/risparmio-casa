import { Button } from '@rc/ui/components/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@rc/ui/components/card';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { APPS } from '../apps.ts';
import { MascotSlot } from '../components/MascotSlot.tsx';
import { canonical } from '../lib/site.ts';

export const Route = createFileRoute('/')({
  head: () => ({ links: canonical('/') }),
  component: HomePage,
});

function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-4 py-10">
        <h1 className="font-bold text-4xl tracking-tight md:text-5xl">{t('home.heroTitle')}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{t('home.heroSubtitle')}</p>
        <div className="flex gap-3 pt-2">
          <Button
            size="lg"
            nativeButton={false}
            render={<a href="#subapps">{t('home.ctaSecondary')}</a>}
          />
        </div>
      </section>

      <section id="subapps" className="grid gap-6 sm:grid-cols-2">
        {APPS.map((app) => (
          <Card key={app.slug} className={`theme-${app.theme}`}>
            <CardHeader>
              <MascotSlot
                icon={app.mascot}
                label={t(`subapps.${app.slug}.title`)}
                className="mb-2"
              />
              <CardTitle>{t(`subapps.${app.slug}.title`)}</CardTitle>
              <CardAction>
                <span className="text-muted-foreground text-xs uppercase tracking-wide">
                  {app.tier === 'free' ? t('common.free') : t('common.premium')}
                </span>
              </CardAction>
              <CardDescription>{t(`subapps.${app.slug}.description`)}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                nativeButton={false}
                render={<Link to={`/${app.slug}`}>{t('common.comingSoon')} →</Link>}
              />
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
