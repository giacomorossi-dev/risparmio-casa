import { Link } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CategoryDefinition } from '../lib/pricing.ts';

interface Props {
  prev: CategoryDefinition;
  next: CategoryDefinition;
}

/**
 * Sequential prev/next pager. Two large tap targets, side by side on >sm,
 * stacked on mobile. The previous-direction card right-aligns its label so
 * the arrow stays on the outer edge — feels more "navigable" with thumbs.
 */
export default function CategoryPager({ prev, next }: Props) {
  return (
    <nav aria-label="Naviga fra le categorie" className="grid gap-3 sm:grid-cols-2">
      <Link
        to="/quale-conviene/$category"
        params={{ category: prev.slug }}
        className="group bg-card flex items-center gap-3 rounded-xl p-4 transition-all hover:-translate-y-px hover:shadow-[0_18px_50px_-20px_rgba(168,85,247,0.4)]"
      >
        <ChevronLeft
          className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5 group-hover:text-foreground"
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Precedente</div>
          <div className="truncate font-semibold group-hover:text-primary">{prev.name}</div>
        </div>
      </Link>

      <Link
        to="/quale-conviene/$category"
        params={{ category: next.slug }}
        className="group bg-card flex items-center gap-3 rounded-xl p-4 transition-all hover:-translate-y-px hover:shadow-[0_18px_50px_-20px_rgba(168,85,247,0.4)] sm:text-right"
      >
        <div className="min-w-0 flex-1 sm:order-1">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Successiva</div>
          <div className="truncate font-semibold group-hover:text-primary">{next.name}</div>
        </div>
        <ChevronRight
          className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground sm:order-2"
          aria-hidden="true"
        />
      </Link>
    </nav>
  );
}
