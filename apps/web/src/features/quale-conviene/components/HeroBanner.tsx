import { HelpCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Hero } from '../../../components/Hero.tsx';
import { CATEGORIES } from '../data/categories.ts';
import { SITE_NAME } from '../lib/seo.ts';

// Evento ascoltato da OnboardingDialog per aprire il tour guidato.
const OPEN_EVENT = 'qc:open-onboarding';

const STATS: { to: number; suffix?: string | undefined; label: string }[] = [
  { to: CATEGORIES.length, label: 'categorie' },
  { to: 4, label: 'contesti di calcolo' },
  { to: 100, suffix: '%', label: 'gratis · senza login' },
];

const COUNT_UP_DURATION = 1400;

// Ease-out cubic — fast start, gentle finish, looks more "natural" than linear.
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

function useCountUp(target: number, duration: number) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setValue(target);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setValue(Math.round(target * easeOutCubic(t)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

function Stat({ to, suffix, label }: { to: number; suffix?: string | undefined; label: string }) {
  const n = useCountUp(to, COUNT_UP_DURATION);
  return (
    <li className="flex items-baseline gap-1.5">
      <span className="font-semibold text-lg tabular-nums">
        {n}
        {suffix}
      </span>
      <span className="text-white/85">{label}</span>
    </li>
  );
}

const openTour = () => {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(OPEN_EVENT));
};

export default function HeroBanner() {
  return (
    <Hero
      ariaLabel={`${SITE_NAME} — banner`}
      eyebrow={
        <>
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          Confronta. Calcola. Risparmia.
        </>
      }
      title={
        <>
          Scopri quale prodotto
          <br />
          conviene davvero
        </>
      }
      subtitle="Normalizza il prezzo all'unità — fra formati, marche e confezioni diverse — e leggi il verdetto in un colpo d'occhio."
    >
      <ul className="mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-sm">
        {STATS.map((s) => (
          <Stat key={s.label} to={s.to} suffix={s.suffix} label={s.label} />
        ))}
      </ul>

      <div className="flex justify-center pt-4">
        <button
          type="button"
          onClick={openTour}
          className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/15 px-4 py-2 font-medium text-sm text-white backdrop-blur-sm transition-colors hover:bg-white/25"
        >
          <HelpCircle className="h-4 w-4" />
          Scopri come funziona
        </button>
      </div>
    </Hero>
  );
}
