import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@rc/ui/components/card';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/app/')({
  component: AppHome,
});

function AppHome() {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('nav.dashboard')}</CardTitle>
        <CardDescription>
          Qui troverai le tue sub-app abilitate e le impostazioni del profilo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">Le sub-app sono in arrivo. Resta connesso.</p>
      </CardContent>
    </Card>
  );
}
