import { createFileRoute } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Hero } from '../components/Hero.tsx';
import {
  Percentuali,
  RegolaDelTre,
  UnitConverter,
} from '../features/utilita/components/Converters.tsx';
import {
  Carburante,
  Condizionatore,
  CostoElettrodomestico,
  Gas,
  RubinettoCheGocciola,
} from '../features/utilita/components/Energy.tsx';
import { Piastrelle, StanzaAreaVolume, Vernice } from '../features/utilita/components/Home.tsx';
import {
  Forno,
  Lievito,
  PerPersona,
  RiscalaRicetta,
  VolumePeso,
} from '../features/utilita/components/Kitchen.tsx';
import {
  Ammortamento,
  CostoNelTempo,
  DividiConto,
  FattoInCasa,
  Iva,
  OffertaMultipla,
  Sconto,
} from '../features/utilita/components/Money.tsx';

export const Route = createFileRoute('/utilita')({
  component: UtilitaPage,
});

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="font-semibold text-xl">{title}</h2>
      <div className="-mt-2 h-[2px] w-full bg-primary" aria-hidden="true" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}

function UtilitaPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-12">
      <Hero
        eyebrow="Strumenti pratici"
        title={t('subapps.utilita.title')}
        subtitle={t('subapps.utilita.description')}
      />

      <Section title="Conversioni e calcoli">
        <UnitConverter />
        <Percentuali />
        <RegolaDelTre />
      </Section>

      <Section title="Cucina">
        <VolumePeso />
        <Forno />
        <Lievito />
        <RiscalaRicetta />
        <PerPersona />
      </Section>

      <Section title="Risparmio">
        <Sconto />
        <OffertaMultipla />
        <Iva />
        <CostoNelTempo />
        <FattoInCasa />
        <DividiConto />
        <Ammortamento />
      </Section>

      <Section title="Casa e bollette">
        <CostoElettrodomestico />
        <Gas />
        <RubinettoCheGocciola />
        <Condizionatore />
        <Carburante />
        <Vernice />
        <Piastrelle />
        <StanzaAreaVolume />
      </Section>
    </div>
  );
}
