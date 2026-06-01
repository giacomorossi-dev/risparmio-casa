import { Input } from '@rc/ui/components/input';
import { createFileRoute } from '@tanstack/react-router';
import { Pin, Search } from 'lucide-react';
import { type ReactNode, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Hero } from '../../components/Hero.tsx';
import { SECTIONS, searchTools } from '../../features/utilita/catalog.tsx';
import { ToolCard } from '../../features/utilita/components/ToolCard.tsx';
import { usePinned } from '../../features/utilita/usePinned.ts';
import { canonical } from '../../lib/site.ts';

export const Route = createFileRoute('/utilita/')({
  head: () => ({
    meta: [
      { title: 'Utilità · Risparmio Casa' },
      {
        name: 'description',
        content:
          'Piccoli strumenti pratici per cucina, risparmio e casa: convertitori, calcolatori e stime, tutti gratuiti.',
      },
    ],
    links: canonical('/utilita'),
  }),
  component: UtilitaIndex,
});

function SectionGrid({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="font-semibold text-xl">{title}</h2>
      <div className="-mt-2 h-[2px] w-full bg-primary" aria-hidden="true" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}

function UtilitaIndex() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const { isPinned, toggle } = usePinned();
  const results = useMemo(() => searchTools(query), [query]);

  const pinnedResults = results.filter((tool) => isPinned(tool.slug));

  return (
    <div className="space-y-12">
      <Hero
        eyebrow="Strumenti pratici"
        title={t('subapps.utilita.title')}
        subtitle={t('subapps.utilita.description')}
      />

      <div className="relative max-w-xl">
        <Search
          className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          placeholder="Cerca un'utilità: 'iva', 'sconto', 'forno', 'bolletta'…"
          className="pl-9"
          aria-label="Cerca un'utilità"
        />
      </div>

      {results.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Nessuna utilità trovata per <strong>«{query}»</strong>.
        </p>
      ) : (
        <>
          {pinnedResults.length > 0 && (
            <SectionGrid
              title={
                <span className="inline-flex items-center gap-2">
                  <Pin className="size-4 fill-primary text-primary" />
                  Preferite
                </span>
              }
            >
              {pinnedResults.map((tool) => (
                <ToolCard
                  key={tool.slug}
                  tool={tool}
                  pinned
                  onTogglePin={() => toggle(tool.slug)}
                />
              ))}
            </SectionGrid>
          )}

          {SECTIONS.map((s) => {
            const tools = results.filter((tool) => tool.section === s.id && !isPinned(tool.slug));
            if (tools.length === 0) return null;
            return (
              <SectionGrid key={s.id} title={s.label}>
                {tools.map((tool) => (
                  <ToolCard
                    key={tool.slug}
                    tool={tool}
                    pinned={false}
                    onTogglePin={() => toggle(tool.slug)}
                  />
                ))}
              </SectionGrid>
            );
          })}
        </>
      )}
    </div>
  );
}
