import { ClerkProvider } from '@clerk/tanstack-react-start';
import type { ReactNode } from 'react';

// Unico punto che monta <ClerkProvider> (→ carica clerk-js). Usato SOLO dalle
// route che fanno auth interattiva (/sign-in, /app), così Clerk finisce nei loro
// chunk e non in quello delle pagine pubbliche. Lo stato "loggato?" delle pagine
// pubbliche arriva invece dal server (vedi __root + lib/clerk-server).
export function ClerkBoundary({ children }: { children: ReactNode }) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
