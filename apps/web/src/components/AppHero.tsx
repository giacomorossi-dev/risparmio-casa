import { useTranslation } from 'react-i18next';

import type { AppDef } from '../apps.ts';
import { MascotSlot } from './MascotSlot.tsx';

// Intestazione di una sotto-app: mascotte + titolo/descrizione (i18n).
export const AppHero = ({ app }: { app: AppDef }) => {
  const { t } = useTranslation();
  const title = t(`subapps.${app.slug}.title`);
  return (
    <div className="mb-8 flex items-center gap-4">
      <MascotSlot icon={app.mascot} label={title} />
      <div className="flex flex-col gap-1">
        <h1 className="font-heading font-semibold text-2xl">{title}</h1>
        <p className="text-muted-foreground text-sm">{t(`subapps.${app.slug}.description`)}</p>
      </div>
    </div>
  );
};
