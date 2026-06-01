import { SignIn } from '@clerk/tanstack-react-start';
import { createFileRoute } from '@tanstack/react-router';

import { AuthLayout } from '../components/AuthLayout.tsx';
import { ClerkBoundary } from '../components/ClerkBoundary.tsx';

export const Route = createFileRoute('/sign-in')({
  component: SignInPage,
});

// Pagina dedicata: è qui (e in /app) che si monta Clerk e si carica clerk-js.
// `routing="hash"` tiene gli step del flusso sotto /sign-in#... senza route splat.
function SignInPage() {
  return (
    <ClerkBoundary>
      <AuthLayout>
        <SignIn routing="hash" />
      </AuthLayout>
    </ClerkBoundary>
  );
}
