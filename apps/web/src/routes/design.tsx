import { Button } from '@rc/ui/components/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@rc/ui/components/card';
import { createFileRoute } from '@tanstack/react-router';

import { THEME_KEYS } from '../apps.ts';

export const Route = createFileRoute('/design')({
  component: DesignPage,
});

const VARIANTS = ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'] as const;
const SIZES = ['sm', 'default', 'lg'] as const;
const SWATCHES = [
  { name: 'background', cls: 'bg-background' },
  { name: 'card', cls: 'bg-card' },
  { name: 'primary', cls: 'bg-primary' },
  { name: 'accent', cls: 'bg-accent' },
  { name: 'muted', cls: 'bg-muted' },
  { name: 'ring', cls: 'bg-ring' },
] as const;

function ThemeSection({ theme }: { theme: string }) {
  return (
    <div
      className={`theme-${theme} flex flex-col gap-5 rounded-xl border bg-background p-6 text-foreground`}
    >
      <h3 className="font-heading font-semibold text-lg capitalize">{theme}</h3>

      <div className="flex flex-wrap gap-3">
        {SWATCHES.map((s) => (
          <div key={s.name} className="flex flex-col items-center gap-1">
            <div className={`${s.cls} size-12 rounded-lg border`} />
            <span className="text-muted-foreground text-xs">{s.name}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {VARIANTS.map((v) => (
          <Button key={v} variant={v}>
            {v}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {SIZES.map((s) => (
          <Button key={s} size={s}>
            size {s}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Card di esempio</CardTitle>
          <CardAction>
            <Button variant="ghost" size="sm">
              Azione
            </Button>
          </CardAction>
          <CardDescription>Una card per vedere superfici e bordi del tema.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm">Contenuto della card.</CardContent>
        <CardFooter>
          <Button size="sm">Conferma</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function DesignPage() {
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-1">
        <h1 className="font-bold text-3xl tracking-tight">Design system</h1>
        <p className="text-muted-foreground">
          Componenti @rc/ui (Base UI · base-nova) e temi per sotto-app, light e dark.
        </p>
      </header>

      {(['light', 'dark'] as const).map((mode) => (
        <section key={mode} className={mode === 'dark' ? 'dark' : undefined}>
          <div className="rounded-2xl bg-background p-4 text-foreground">
            <h2 className="mb-4 font-medium text-muted-foreground text-sm uppercase tracking-wide">
              {mode}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {THEME_KEYS.map((theme) => (
                <ThemeSection key={theme} theme={theme} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
