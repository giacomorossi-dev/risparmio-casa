import { auth } from '@clerk/tanstack-react-start/server';
import { createServerFn } from '@tanstack/react-start';

// Stato auth verificato lato server: legge la sessione iniettata da
// `clerkMiddleware` e restituisce un semplice booleano per header e pagine
// pubbliche, SENZA caricare clerk-js sul client. In modalità key-less/offline
// il middleware non gira → utente anonimo.
export const fetchAuthState = createServerFn().handler(async () => {
  if (!process.env.CLERK_SECRET_KEY || process.env.OFFLINE_AUTH === '1') {
    return { isSignedIn: false };
  }
  const { userId } = await auth();
  return { isSignedIn: Boolean(userId) };
});
