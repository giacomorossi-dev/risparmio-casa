import { Button as BaseButton } from '@rc/ui/components/button';
import type { ComponentProps, ReactElement } from 'react';
import { isValidElement } from 'react';

// Compat adapter per il codice portato da quale-conviene (shadcn/Radix):
// mappa l'API `asChild` (Radix) sul pattern `render` di Base UI e degrada le
// variant "branded" (gradient/glass) alla variant default del nostro tema.
type Variant =
  | 'default'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'destructive'
  | 'link'
  | 'gradient'
  | 'glass';

type Props = Omit<ComponentProps<typeof BaseButton>, 'variant' | 'render'> & {
  variant?: Variant;
  asChild?: boolean;
};

const mapVariant = (v?: Variant): ComponentProps<typeof BaseButton>['variant'] =>
  v === 'gradient' || v === 'glass' ? 'default' : v;

export function Button({ asChild, variant, children, ...props }: Props) {
  const mapped = mapVariant(variant);
  if (asChild && isValidElement(children)) {
    return (
      <BaseButton
        variant={mapped}
        nativeButton={false}
        render={children as ReactElement}
        {...props}
      />
    );
  }
  return (
    <BaseButton variant={mapped} {...props}>
      {children}
    </BaseButton>
  );
}

export { buttonVariants } from '@rc/ui/components/button';
