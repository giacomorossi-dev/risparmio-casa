import type { ReactNode } from 'react';

type Props = {
  /** Pillola/eyebrow sopra il titolo (opzionale). */
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Contenuto extra sotto il sottotitolo (stat, CTA…), centrato. */
  children?: ReactNode;
  ariaLabel?: string;
};

// Banner hero riutilizzabile dalle sotto-app: sfondo a gradient sul colore
// dell'app (`bg-primary` → segue il tema), blob bianchi neutri (vanno bene su
// qualsiasi accento) e contenuto centrato in bianco. Vedi apps.ts/__root per il
// tema applicato per pathname.
export function Hero({ eyebrow, title, subtitle, children, ariaLabel }: Props) {
  return (
    <section
      aria-label={ariaLabel}
      className="relative isolate flex min-h-[340px] items-center justify-center overflow-hidden rounded-2xl px-6 py-12 sm:min-h-[380px] sm:px-12 sm:py-14"
    >
      <div className="absolute inset-0 bg-primary" aria-hidden="true" />

      {/* Blob luminosi neutri: leggibili su teal/ambra/violetto allo stesso modo. */}
      <div
        aria-hidden="true"
        className="absolute -top-24 -left-20 h-80 w-80 rounded-full bg-white/25 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="absolute -right-12 -bottom-28 h-96 w-96 rounded-full bg-white/20 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/4 right-1/3 h-56 w-56 rounded-full bg-white/15 blur-2xl"
      />

      {/* Velo scuro per mantenere leggibile il testo bianco su ogni accento. */}
      <div aria-hidden="true" className="absolute inset-0 bg-black/10 dark:bg-black/25" />

      <div className="relative z-10 max-w-3xl space-y-4 text-center text-white">
        {eyebrow && (
          <p className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1 font-medium text-xs backdrop-blur-sm">
            {eyebrow}
          </p>
        )}
        <h1 className="font-semibold text-4xl leading-[1.05] tracking-tight drop-shadow-sm sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto max-w-xl text-sm text-white/90 sm:text-base">{subtitle}</p>
        )}
        {children}
      </div>
    </section>
  );
}
