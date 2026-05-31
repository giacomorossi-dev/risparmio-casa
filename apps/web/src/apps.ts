import type { LucideIcon } from 'lucide-react';
import { PackageOpen, Scale, Wrench } from 'lucide-react';

export type ThemeKey = 'site' | 'quale-conviene' | 'scorte' | 'utilita';
export type Tier = 'free' | 'premium';

export type AppDef = {
  /** route segment + i18n key under `subapps.*` */
  slug: 'quale-conviene' | 'scorte' | 'utilita';
  /** absolute route path */
  path: string;
  theme: ThemeKey;
  tier: Tier;
  /** placeholder mascot icon; sostituire con illustrazione vera più avanti */
  mascot: LucideIcon;
};

/** Fonte unica delle sotto-app: home cards, footer e theme-resolver leggono da qui. */
export const APPS: readonly AppDef[] = [
  {
    slug: 'quale-conviene',
    path: '/quale-conviene',
    theme: 'quale-conviene',
    tier: 'free',
    mascot: Scale,
  },
  { slug: 'scorte', path: '/scorte', theme: 'scorte', tier: 'premium', mascot: PackageOpen },
  { slug: 'utilita', path: '/utilita', theme: 'utilita', tier: 'free', mascot: Wrench },
] as const;

/** Tutte le ThemeKey, utile per la route /design. */
export const THEME_KEYS: readonly ThemeKey[] = ['site', 'quale-conviene', 'scorte', 'utilita'];

/** Tema attivo dal pathname (match longest-prefix), fallback 'site'. */
export function themeForPath(pathname: string): ThemeKey {
  const match = APPS.filter((a) => pathname === a.path || pathname.startsWith(`${a.path}/`)).sort(
    (a, b) => b.path.length - a.path.length,
  )[0];
  return match?.theme ?? 'site';
}

/** AppDef dato lo slug (per le route delle sotto-app). */
export function appBySlug(slug: AppDef['slug']): AppDef {
  const app = APPS.find((a) => a.slug === slug);
  if (!app) throw new Error(`App non trovata: ${slug}`);
  return app;
}
