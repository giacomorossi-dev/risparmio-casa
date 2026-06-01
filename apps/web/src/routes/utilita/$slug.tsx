import { Button } from '@rc/ui/components/button';
import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { ArrowLeft, Info, Pin } from 'lucide-react';
import { Suspense } from 'react';

import { getTool } from '../../features/utilita/catalog.tsx';
import { TOOL_COMPONENTS } from '../../features/utilita/lazy.tsx';
import { usePinned } from '../../features/utilita/usePinned.ts';
import { canonical } from '../../lib/site.ts';

export const Route = createFileRoute('/utilita/$slug')({
  loader: ({ params }) => {
    if (!getTool(params.slug)) throw notFound();
    return { slug: params.slug };
  },
  head: ({ loaderData }) => {
    const tool = loaderData ? getTool(loaderData.slug) : undefined;
    if (!tool) return {};
    return {
      meta: [
        { title: `${tool.name} · Utilità · Risparmio Casa` },
        { name: 'description', content: tool.description },
      ],
      links: canonical(`/utilita/${tool.slug}`),
    };
  },
  component: ToolPage,
});

function ToolPage() {
  const { slug } = Route.useParams();
  const { isPinned, toggle } = usePinned();
  const tool = getTool(slug);
  const Body = TOOL_COMPONENTS[slug];
  if (!tool || !Body) return null;

  const pinned = isPinned(tool.slug);

  return (
    <div className="space-y-6">
      <nav
        aria-label="breadcrumb"
        className="flex flex-wrap items-center gap-1.5 text-muted-foreground text-sm"
      >
        <Link to="/" className="transition-colors hover:text-foreground hover:underline">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link to="/utilita" className="transition-colors hover:text-foreground hover:underline">
          Utilità
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground">{tool.name}</span>
      </nav>

      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <h1 className="font-semibold text-2xl tracking-tight sm:text-3xl">{tool.name}</h1>
          <p className="max-w-2xl text-muted-foreground leading-relaxed">{tool.description}</p>
        </div>
        <Button
          type="button"
          variant={pinned ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggle(tool.slug)}
          aria-pressed={pinned}
          className="shrink-0"
        >
          <Pin className={`size-4 ${pinned ? 'fill-current' : ''}`} />
          {pinned ? 'Preferita' : 'Aggiungi'}
        </Button>
      </div>

      <div className="max-w-md rounded-xl border bg-card p-4">
        <Suspense fallback={<div className="h-40 animate-pulse rounded-lg bg-muted/40" />}>
          <Body />
        </Suspense>
      </div>

      {tool.estimate && (
        <p className="flex max-w-md items-start gap-2 text-muted-foreground text-xs">
          <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          Risultato indicativo: si basa su valori medi e può variare nella realtà.
        </p>
      )}

      <div className="border-t pt-6">
        <Link
          to="/utilita"
          className="inline-flex items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Torna alle utilità
        </Link>
      </div>
    </div>
  );
}
