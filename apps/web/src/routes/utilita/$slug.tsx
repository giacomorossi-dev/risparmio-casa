import { Button } from '@rc/ui/components/button';
import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { ArrowLeft, Pin } from 'lucide-react';

import { getTool } from '../../features/utilita/tools.tsx';
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
  if (!tool) return null;

  const Body = tool.Component;
  const pinned = isPinned(tool.slug);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
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

        <Button
          type="button"
          variant={pinned ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggle(tool.slug)}
          aria-pressed={pinned}
        >
          <Pin className={`size-4 ${pinned ? 'fill-current' : ''}`} />
          {pinned ? 'Preferita' : 'Aggiungi'}
        </Button>
      </div>

      <p className="max-w-2xl text-muted-foreground leading-relaxed">{tool.description}</p>

      <div className="max-w-md">
        <Body />
      </div>

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
