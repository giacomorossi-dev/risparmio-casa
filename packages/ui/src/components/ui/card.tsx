import type { ComponentProps } from 'react';

import { cn } from '../../lib/utils.ts';

export const Card = ({ className, ...props }: ComponentProps<'div'>) => (
  <div
    data-slot="card"
    className={cn(
      'flex flex-col gap-6 rounded-xl border bg-card text-card-foreground py-6 shadow-sm',
      className,
    )}
    {...props}
  />
);

export const CardHeader = ({ className, ...props }: ComponentProps<'div'>) => (
  <div data-slot="card-header" className={cn('flex flex-col gap-1.5 px-6', className)} {...props} />
);

export const CardTitle = ({ className, ...props }: ComponentProps<'div'>) => (
  <div
    data-slot="card-title"
    className={cn('text-lg font-semibold leading-none', className)}
    {...props}
  />
);

export const CardDescription = ({ className, ...props }: ComponentProps<'div'>) => (
  <div
    data-slot="card-description"
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
);

export const CardContent = ({ className, ...props }: ComponentProps<'div'>) => (
  <div data-slot="card-content" className={cn('px-6', className)} {...props} />
);

export const CardFooter = ({ className, ...props }: ComponentProps<'div'>) => (
  <div
    data-slot="card-footer"
    className={cn('flex items-center px-6 pt-0', className)}
    {...props}
  />
);
