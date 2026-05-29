import { SignUpButton } from '@clerk/tanstack-start';
import { Button } from '@rc/ui/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@rc/ui/components/card';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/')({
  component: HomePage,
});

type SubAppDef = {
  slug: 'quale-conviene' | 'scorte';
  tier: 'free' | 'premium';
};

const SUBAPPS: readonly SubAppDef[] = [
  { slug: 'quale-conviene', tier: 'free' },
  { slug: 'scorte', tier: 'premium' },
];

function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-4 py-10">
        <h1 className="font-bold text-4xl tracking-tight md:text-5xl">{t('home.heroTitle')}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{t('home.heroSubtitle')}</p>
        <div className="flex gap-3 pt-2">
          <SignUpButton mode="modal">
            <Button size="lg">{t('home.ctaPrimary')}</Button>
          </SignUpButton>
          <Button variant="outline" size="lg" asChild>
            <a href="#subapps">{t('home.ctaSecondary')}</a>
          </Button>
        </div>
      </section>

      <section id="subapps" className="grid gap-6 sm:grid-cols-2">
        {SUBAPPS.map(({ slug, tier }) => (
          <Card key={slug}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t(`subapps.${slug}.title`)}</CardTitle>
                <span className="text-muted-foreground text-xs uppercase tracking-wide">
                  {tier === 'free' ? t('common.free') : t('common.premium')}
                </span>
              </div>
              <CardDescription>{t(`subapps.${slug}.description`)}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link to={`/${slug}`}>{t('common.comingSoon')} →</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
