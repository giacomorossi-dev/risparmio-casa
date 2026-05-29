# CLAUDE.md

Convenzioni di progetto per `risparmiocasa.app`. Vedi `README.md` per setup e architettura.

## UI — shadcn/ui (Base UI) + wrapper components

In `packages/ui` (`@rc/ui`) usiamo shadcn/ui variante **Base UI** (preset `base-nova`, `style: "base-nova"` in `components.json`) su **`@base-ui/react`, NON Radix**, **più un wrapper sottile per ogni componente**. Aggiungere componenti con la CLI: `shadcn add <x>` (variante base, non radix).

> Polimorfismo: si usa il pattern Base UI `render` (es. `<Button render={<a href="/x" />} nativeButton={false}>…</Button>`), **non** `asChild`/`Slot` di Radix. Quando `render` cambia l'elemento in un non-button (`<a>`, `Link`), aggiungere `nativeButton={false}`.

> Setup CSS (in `src/styles/globals.css`): `@import "shadcn/tailwind.css"` (infra: keyframes + custom-variant `data-*`), il set token completo (`:root`/`.dark` + `@theme inline`), e `@source "../components/**/*.{ts,tsx}"` — necessario perché Tailwind v4 salta `node_modules` e `@rc/ui` è symlinkato lì (senza, le utility usate solo nei primitivi non vengono generate). I primitivi in `components/ui/**` sono esclusi da `useSortedClasses`/`organizeImports` per restare fedeli al registry.

```
packages/ui/src/components/
  ui/            # primitivi shadcn (rigenerabili dalla CLI shadcn)
    button.tsx
    card.tsx
  button.tsx     # wrapper -> export ... from './ui/button.tsx'
  card.tsx       # wrapper -> export ... from './ui/card.tsx'
```

Regole:

- I primitivi shadcn vivono in `components/ui/`. `components.json` ha `aliases.ui = "@rc/ui/components/ui"`, quindi `shadcn add <x>` li mette lì.
- Per **ogni** primitivo deve esistere il wrapper corrispondente in `components/<nome>.tsx`. Il wrapper è un re-export sottile (stessa identica API, nessun comportamento aggiunto): esporta il componente, le sue `*Variants` e il tipo delle props.
- Le app importano **sempre** dal wrapper (`@rc/ui/components/button`), **mai** dal primitivo (`@rc/ui/components/ui/button`).

Perché: disaccoppia il codice applicativo da shadcn, così i primitivi si possono rigenerare/aggiornare senza toccare i consumer, e resta un unico punto dove aggiungere eventuali default di progetto.

Quando aggiungi un componente shadcn (finisce in `components/ui/`), crea **subito** anche il wrapper in `components/`. Nessun primitivo senza il suo wrapper.
