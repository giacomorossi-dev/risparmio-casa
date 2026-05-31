// URL canonico del deploy. Imposta VITE_SITE_URL a build time.
export const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined) ?? 'https://risparmiocasa.app';

/** Link canonical per una route ("/" o "/contatti", ...). */
export function canonical(path: string) {
  return [{ rel: 'canonical', href: path === '/' ? SITE_URL : `${SITE_URL}${path}` }];
}
