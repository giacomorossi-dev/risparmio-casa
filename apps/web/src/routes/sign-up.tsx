import { SignUp } from '@clerk/tanstack-react-start';
import { createFileRoute } from '@tanstack/react-router';

import { AuthLayout } from '../components/AuthLayout.tsx';
import { ClerkBoundary } from '../components/ClerkBoundary.tsx';

export const Route = createFileRoute('/sign-up')({
  component: SignUpPage,
});

// Registrazione in-app (stesso layout di /sign-in). `routing="hash"` evita la
// route splat; il rimando "Hai già un account?" torna a /sign-in (vedi
// ClerkBoundary).
function SignUpPage() {
  return (
    <ClerkBoundary>
      <AuthLayout>
        <SignUp routing="hash" />
      </AuthLayout>
    </ClerkBoundary>
  );
}
