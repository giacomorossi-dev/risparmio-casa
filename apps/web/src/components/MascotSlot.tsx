import { cn } from '@rc/ui/lib/utils';
import type { LucideIcon } from 'lucide-react';

type Props = {
  icon: LucideIcon;
  label: string;
  className?: string;
};

// Slot mascotte: per ora un'icona lucide in un badge morbido tinto col tema corrente.
// Sostituire con un'illustrazione SVG dedicata per ogni app più avanti.
export const MascotSlot = ({ icon: Icon, label, className }: Props) => (
  <div
    role="img"
    aria-label={label}
    className={cn(
      'flex size-16 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground',
      className,
    )}
  >
    <Icon className="size-8" aria-hidden="true" />
  </div>
);
