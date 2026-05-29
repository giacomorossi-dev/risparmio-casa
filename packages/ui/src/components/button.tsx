// Wrapper applicativo: isola l'app dal primitivo shadcn (./ui/button).
// Importa sempre da @rc/ui/components/button, mai da @rc/ui/components/ui/button.

export type { ButtonProps } from './ui/button.tsx';
export { Button, buttonVariants } from './ui/button.tsx';
