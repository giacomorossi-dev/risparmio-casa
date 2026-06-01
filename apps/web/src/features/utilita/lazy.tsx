import { type ComponentType, lazy } from 'react';

// Componenti interattivi caricati lazy (uno per slug): così il codice dei tool
// NON entra nel chunk principale / della landing, ma solo nel chunk della pagina
// del tool quando viene aperta. Vedi catalog.tsx per i metadati.
export const TOOL_COMPONENTS: Record<string, ComponentType> = {
  'convertitore-unita': lazy(() =>
    import('./components/Converters.tsx').then((m) => ({ default: m.UnitConverter })),
  ),
  percentuali: lazy(() =>
    import('./components/Converters.tsx').then((m) => ({ default: m.Percentuali })),
  ),
  'regola-del-tre': lazy(() =>
    import('./components/Converters.tsx').then((m) => ({ default: m.RegolaDelTre })),
  ),
  'volume-peso': lazy(() =>
    import('./components/Kitchen.tsx').then((m) => ({ default: m.VolumePeso })),
  ),
  forno: lazy(() => import('./components/Kitchen.tsx').then((m) => ({ default: m.Forno }))),
  lievito: lazy(() => import('./components/Kitchen.tsx').then((m) => ({ default: m.Lievito }))),
  'riscala-ricetta': lazy(() =>
    import('./components/Kitchen.tsx').then((m) => ({ default: m.RiscalaRicetta })),
  ),
  'adatta-stampo': lazy(() =>
    import('./components/Kitchen.tsx').then((m) => ({ default: m.AdattaStampo })),
  ),
  'quanto-cucinare': lazy(() =>
    import('./components/Kitchen.tsx').then((m) => ({ default: m.PerPersona })),
  ),
  impasto: lazy(() => import('./components/Kitchen.tsx').then((m) => ({ default: m.Impasto }))),
  sconto: lazy(() => import('./components/Money.tsx').then((m) => ({ default: m.Sconto }))),
  'offerta-3x2': lazy(() =>
    import('./components/Money.tsx').then((m) => ({ default: m.OffertaMultipla })),
  ),
  iva: lazy(() => import('./components/Money.tsx').then((m) => ({ default: m.Iva }))),
  'costo-nel-tempo': lazy(() =>
    import('./components/Money.tsx').then((m) => ({ default: m.CostoNelTempo })),
  ),
  'fatto-in-casa': lazy(() =>
    import('./components/Money.tsx').then((m) => ({ default: m.FattoInCasa })),
  ),
  'dividi-conto': lazy(() =>
    import('./components/Money.tsx').then((m) => ({ default: m.DividiConto })),
  ),
  'cambio-elettrodomestico': lazy(() =>
    import('./components/Money.tsx').then((m) => ({ default: m.Ammortamento })),
  ),
  'costo-elettrodomestico': lazy(() =>
    import('./components/Energy.tsx').then((m) => ({ default: m.CostoElettrodomestico })),
  ),
  gas: lazy(() => import('./components/Energy.tsx').then((m) => ({ default: m.Gas }))),
  rubinetto: lazy(() =>
    import('./components/Energy.tsx').then((m) => ({ default: m.RubinettoCheGocciola })),
  ),
  'btu-condizionatore': lazy(() =>
    import('./components/Energy.tsx').then((m) => ({ default: m.Condizionatore })),
  ),
  'costo-tragitto': lazy(() =>
    import('./components/Energy.tsx').then((m) => ({ default: m.Carburante })),
  ),
  vernice: lazy(() => import('./components/Home.tsx').then((m) => ({ default: m.Vernice }))),
  piastrelle: lazy(() => import('./components/Home.tsx').then((m) => ({ default: m.Piastrelle }))),
  'area-volume-stanza': lazy(() =>
    import('./components/Home.tsx').then((m) => ({ default: m.StanzaAreaVolume })),
  ),
};
