// Clerk è opzionale. Senza una publishable key (deploy senza auth, e2e in CI,
// modalità offline) l'app pubblica deve renderizzare lo stesso, senza 500 né
// crash client. Il flag è valutato a build-time da Vite (`import.meta.env`),
// così SSR e client concordano ed è dead-code-eliminabile quando assente.
export const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as
  | string
  | undefined;

export const clerkEnabled = Boolean(CLERK_PUBLISHABLE_KEY);
