import { auth, clerkClient } from '@clerk/tanstack-react-start/server';
import { createServerFn } from '@tanstack/react-start';

export type AuthState = {
  isSignedIn: boolean;
  imageUrl: string;
  initials: string;
};

const SIGNED_OUT: AuthState = { isSignedIn: false, imageUrl: '', initials: '' };

// Stato auth verificato lato server: legge la sessione iniettata da
// `clerkMiddleware` e restituisce un flag + i dati per l'avatar dell'header,
// SENZA caricare clerk-js sul client. In modalità key-less/offline il middleware
// non gira → utente anonimo.
export const fetchAuthState = createServerFn().handler(async (): Promise<AuthState> => {
  if (!process.env.CLERK_SECRET_KEY || process.env.OFFLINE_AUTH === '1') {
    return SIGNED_OUT;
  }
  const { userId } = await auth();
  if (!userId) return SIGNED_OUT;

  const user = await clerkClient().users.getUser(userId);
  const initials =
    `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() ||
    user.primaryEmailAddress?.emailAddress?.[0]?.toUpperCase() ||
    '·';

  return { isSignedIn: true, imageUrl: user.imageUrl ?? '', initials };
});
