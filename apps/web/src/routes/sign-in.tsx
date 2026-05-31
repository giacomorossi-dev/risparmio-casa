import { SignIn } from '@clerk/tanstack-react-start';
import { createFileRoute } from '@tanstack/react-router';

import { ClerkBoundary } from '../components/ClerkBoundary.tsx';

export const Route = createFileRoute('/sign-in')({
  component: SignInPage,
});

// Pagina dedicata: è qui (e in /app) che si monta Clerk e si carica clerk-js.
// `routing="hash"` tiene gli step del flusso sotto /sign-in#... senza route splat.
function SignInPage() {
  return (
    <ClerkBoundary>
      <div className="flex justify-center py-10">
        <SignIn routing="hash" />
      </div>
    </ClerkBoundary>
  );
}
