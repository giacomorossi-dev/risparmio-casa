import { clerkMiddleware } from '@clerk/tanstack-react-start/server';
import { createStart } from '@tanstack/react-start';

// Server-side Clerk setup (TanStack Start request middleware). Reads
// CLERK_PUBLISHABLE_KEY / CLERK_SECRET_KEY and injects auth state into SSR,
// enabling auth()/getAuth() on the server. Does not protect routes by default.
export const startInstance = createStart(() => {
  return {
    requestMiddleware: [clerkMiddleware()],
  };
});
