import { Link } from '@tanstack/react-router';
import { Pin } from 'lucide-react';

import type { Tool } from '../tools.tsx';

// Card della landing: nome + descrizione, link alla pagina del tool. Il pulsante
// "pin" è un fratello del Link (non annidato) così non fa navigare.
export function ToolCard({
  tool,
  pinned,
  onTogglePin,
}: {
  tool: Tool;
  pinned: boolean;
  onTogglePin: () => void;
}) {
  const Icon = tool.icon;
  return (
    <div className="group/card relative h-full">
      <button
        type="button"
        onClick={onTogglePin}
        aria-label={pinned ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
        aria-pressed={pinned}
        className={`absolute top-3 right-3 z-10 inline-flex size-7 items-center justify-center rounded-md transition-colors ${
          pinned
            ? 'text-primary'
            : 'text-muted-foreground/40 opacity-0 hover:text-muted-foreground focus-visible:opacity-100 group-hover/card:opacity-100'
        }`}
      >
        <Pin className={`size-4 ${pinned ? 'fill-primary' : ''}`} />
      </button>

      <Link
        to="/utilita/$slug"
        params={{ slug: tool.slug }}
        className="flex h-full flex-col gap-2 rounded-xl border bg-card p-4 pr-10 transition-all hover:-translate-y-px hover:border-primary/40 hover:shadow-sm"
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Icon className="size-4" />
          </span>
          <h3 className="font-semibold group-hover/card:text-primary">{tool.name}</h3>
        </div>
        <p className="text-muted-foreground text-sm leading-snug">{tool.description}</p>
      </Link>
    </div>
  );
}
