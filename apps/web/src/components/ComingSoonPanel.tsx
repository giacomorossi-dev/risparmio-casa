import { Button } from '@rc/ui/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@rc/ui/components/card';
import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  title: string;
  description: string;
};

export const ComingSoonPanel = ({ title, description }: Props) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO Fase 1.5: POST a /api/waitlist
    setSubmitted(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-muted-foreground text-sm uppercase tracking-wide">
          {t('common.comingSoon')}
        </p>
        {submitted ? (
          <p className="text-sm">Ti avviseremo a {email}.</p>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('common.emailPlaceholder')}
              className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
            />
            <Button type="submit">{t('common.notifyMe')}</Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};
