import { clerkMiddleware } from '@clerk/tanstack-react-start/server';
import { createStart } from '@tanstack/react-start';

// Server-side Clerk setup (TanStack Start request middleware). Reads
// CLERK_PUBLISHABLE_KEY / CLERK_SECRET_KEY and injects auth state into SSR,
// enabling auth()/getAuth() on the server. Does not protect routes by default.
//
// `clerkMiddleware()` esige CLERK_SECRET_KEY e fa fallire l'SSR con 500
// ("no secret key" / "Invalid host") se assente o non valida. Le route pubbliche
// non usano auth lato server: attiviamo il middleware solo se la secret c'è e non
// siamo in modalità offline, così il sito resta servibile anche senza Clerk.
const clerkEnabled = Boolean(process.env.CLERK_SECRET_KEY) && process.env.OFFLINE_AUTH !== '1';

export const startInstance = createStart(() => {
  return {
    requestMiddleware: clerkEnabled ? [clerkMiddleware()] : [],
  };
});
