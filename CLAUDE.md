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

## Theming per sotto-app

L'app è un contenitore di sotto-app, ognuna con un **tema** (accento) diverso così l'utente capisce dove si trova. I temi sono classi CSS in `packages/ui/src/styles/themes.css` (`.theme-site`, `.theme-quale-conviene`, `.theme-scorte`, `.theme-utilita`) che **sovrascrivono solo i token di accento** (`--primary(+fg)`, `--accent(+fg)`, `--ring`, `--radius`). Lo **sfondo è uniforme** tra tutte le app: `--background`/`--card`/`--popover` (come foreground/muted/border/ecc.) restano da `:root`/`.dark` — cambia solo l'accento (pulsanti, hero, icone), non il colore di pagina.

- **Fonte unica**: `apps/web/src/apps.ts` (`APPS` + `themeForPath`). Home, footer e theme-resolver leggono da qui — non duplicare l'elenco delle app altrove.
- **Applicazione**: `apps/web/src/routes/__root.tsx` legge il pathname (`useRouterState`) e mette `theme-<key>` sul wrapper dello shell. Le custom property si risolvono per **prossimità DOM**, quindi il tema sul `<div>` vince sui token di `:root`; in dark mode valgono le regole `.dark .theme-*`.
- I temi sono pure classi: qualsiasi sottoalbero può adottarne uno (es. le card della home e la route `/design` mostrano i temi affiancati).
- Aggiungere una sotto-app = voce in `APPS` + classe `.theme-<slug>` in `themes.css` + route + chiavi i18n `subapps.<slug>.*`.
- Mascotte: per ora placeholder (icona lucide in `MascotSlot`); illustrazioni vere più avanti.

## Sotto-app "Quale conviene"

Portata da un repo standalone in `apps/web/src/features/quale-conviene/` (logica `lib/*` + dati `data/categories.ts`, 100% client-side, persistenza `localStorage` `qc:*`, test golden `lib/*.test.ts`) e route `apps/web/src/routes/quale-conviene/{route,index,$category,confronta}.tsx`.

- I componenti portati importano da un layer compat `features/quale-conviene/components/app/*` che rimappa su `@rc/ui` (il `Button` adatta `asChild`→`render` di Base UI). Le utility "brand" originali (gradient/glass/Poppins) sono de-brandizzate sul tema teal.
- I dir portati (`features/quale-conviene/**`, `routes/quale-conviene/**`) hanno un override in `biome.json` che spegne solo le regole **stilistiche** non adatte al codice portato (`noNonNullAssertion`, `noExcessiveCognitiveComplexity`, `noUselessFragments`, `useSemanticElements`, `useSortedClasses`). Le regole di **correttezza** `useExhaustiveDependencies` e `noArrayIndexKey` restano **attive**: le key per indice sopravvissute sono solo su liste di sola lettura/statiche e annotate con `biome-ignore` motivati; le righe del `Comparator` usano key stabili (`rowKeys` ref) perché `EntryForm` ha stato locale. I primitivi shadcn in `packages/ui/src/components/ui/**` hanno il linter disattivato.
- `exactOptionalPropertyTypes` è **attivo** a livello repo: i campi opzionali realmente assegnabili a `undefined` sono tipizzati `?: T | undefined`.
- SEO/`head()` per categoria in `lib/seo.ts` (URL con prefisso `/quale-conviene`, `VITE_SITE_URL`, brand `Risparmio Casa`). OG image: `public/og-image.svg`.

### Decisioni accettate (porting)
- **i18n**: copy/FAQ/guide delle categorie restano **inline in italiano** in `data/categories.ts` (~2 k righe). Non migrate a `@rc/i18n`: l'app è IT-only e la mole non giustifica la traduzione; le stringhe di shell (header/footer/legali) usano invece `@rc/i18n`.
- **Test**: la matematica (contratto) è coperta dai test golden `lib/*.test.ts` (35). I percorsi utente (home/ricerca, categoria, share `?d=`, wizard, SEO/JSON-LD) sono coperti da una suite **e2e Playwright** in `apps/web/e2e/` (`playwright.config.ts`, script `test:e2e` → task turbo, job `e2e` in `ci.yml`) che gira contro il **build SSR di produzione**, in modalità **key-less** (Clerk disattivato, vedi sotto): nessun secret richiesto, né in locale né in CI.
- **PWA**: `icon.svg`/`manifest.json` usano un'icona **placeholder**; le icone PNG di brand (192/512, maskable) vanno generate quando il brand è definito.

## Libreria di calcolo (utilità)

Logica delle utility in `apps/web/src/lib/calc/` — **funzioni pure** raggruppate per dominio (`units`, `kitchen`, `money`, `energy`, `home`, `math`) + tabelle dati statiche (`data.ts`) e barrel `index.ts`. Disaccoppiata dalla UI e **riusabile da tutte le sotto-app** (quale-conviene/scorte/utilità): si importa da `../lib/calc` (o dal modulo specifico). Ogni funzione ha test golden colocati `*.test.ts` (vitest), così la matematica è verificabile granularmente prima di costruirci sopra le UI. La UI dei tool e l'integrazione nelle pagine delle app sono un passo successivo.

## Site-wide
- **Auth (Clerk, opzionale)**: `clerkMiddleware` SSR in `start.ts` + `<ClerkProvider>` in `__root` + controlli in `components/AuthControls.tsx`. Tutto è gated su `src/lib/clerk.ts` (`clerkEnabled` = presenza di `VITE_CLERK_PUBLISHABLE_KEY`) lato client e su `CLERK_SECRET_KEY`/`OFFLINE_AUTH` lato server: **senza chiavi il sito rende lo stesso** (niente 500, niente controlli auth) invece di fallire. Le route pubbliche non usano auth server-side.
- **Dark mode**: `ThemeToggle` (chiave `rc:theme`) nell'`Header` + bootstrap pre-hydration in `__root`.
- **Cookie consent**: `apps/web/src/lib/consent.ts` + `components/CookieConsent.tsx` (vanilla-cookieconsent), montato in `__root`; riapertura via `data-cc="show-preferencesModal"` nel footer.
- **Analytics**: GA4 env-driven (`VITE_GA_MEASUREMENT_ID`, no-op se assente) in `lib/analytics.ts` + Consent Mode v2 bootstrap; caricato solo dopo consenso.
- **SEO**: `routes/sitemap[.]xml.ts` + `robots[.]txt.ts` (aggregano sotto-app + categorie).
- **PWA**: `public/manifest.json` + `icon.svg` (placeholder) + `sw.js`; `ServiceWorkerRegister` (solo prod).
