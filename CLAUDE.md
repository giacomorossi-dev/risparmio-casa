# CLAUDE.md

Convenzioni di progetto per `risparmiocasa.app`. Vedi `README.md` per setup e architettura.

## UI — shadcn/ui + wrapper components

In `packages/ui` (`@rc/ui`) usiamo i primitivi shadcn/ui **più un wrapper sottile per ogni componente**.

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
