import {
  ArrowLeftRight,
  CakeSlice,
  Calculator,
  CalendarClock,
  ChefHat,
  CircleDot,
  Divide,
  Droplets,
  Flame,
  Fuel,
  LayoutGrid,
  type LucideIcon,
  PaintRoller,
  Percent,
  PiggyBank,
  Receipt,
  Ruler,
  Scale,
  Snowflake,
  Tags,
  Users,
  Wheat,
  Zap,
} from 'lucide-react';
import type { ReactNode } from 'react';

import { Percentuali, RegolaDelTre, UnitConverter } from './components/Converters.tsx';
import {
  Carburante,
  Condizionatore,
  CostoElettrodomestico,
  Gas,
  RubinettoCheGocciola,
} from './components/Energy.tsx';
import { Piastrelle, StanzaAreaVolume, Vernice } from './components/Home.tsx';
import {
  AdattaStampo,
  Forno,
  Impasto,
  Lievito,
  PerPersona,
  RiscalaRicetta,
  VolumePeso,
} from './components/Kitchen.tsx';
import {
  Ammortamento,
  CostoNelTempo,
  DividiConto,
  FattoInCasa,
  Iva,
  OffertaMultipla,
  Sconto,
} from './components/Money.tsx';

export type ToolSection = 'conversioni' | 'cucina' | 'risparmio' | 'casa';

export type Tool = {
  slug: string;
  name: string;
  /** Descrizione "parlante" mostrata nella card della landing. */
  description: string;
  keywords: string[];
  icon: LucideIcon;
  section: ToolSection;
  Component: () => ReactNode;
};

export const SECTIONS: { id: ToolSection; label: string }[] = [
  { id: 'conversioni', label: 'Conversioni e calcoli' },
  { id: 'cucina', label: 'Cucina' },
  { id: 'risparmio', label: 'Risparmio' },
  { id: 'casa', label: 'Casa e bollette' },
];

export const TOOLS: Tool[] = [
  // --- Conversioni ---
  {
    slug: 'convertitore-unita',
    name: 'Convertitore unità',
    description:
      'Converti al volo litri, grammi, gradi, pollici e le misure da cucina (bicchieri, cucchiai, cup).',
    keywords: [
      'conversione',
      'unità',
      'misura',
      'litri',
      'grammi',
      'temperatura',
      'pollici',
      'ml',
      'kg',
    ],
    icon: ArrowLeftRight,
    section: 'conversioni',
    Component: UnitConverter,
  },
  {
    slug: 'percentuali',
    name: 'Percentuali',
    description: 'La percentuale di un valore, quanto pesa una parte sul totale o una variazione.',
    keywords: ['percentuale', 'percento', 'variazione', 'aumento', '%'],
    icon: Percent,
    section: 'conversioni',
    Component: Percentuali,
  },
  {
    slug: 'regola-del-tre',
    name: 'Regola del tre',
    description: 'Trova il quarto valore di una proporzione: A sta a B come C sta a ?.',
    keywords: ['proporzione', 'regola del tre', 'rapporto'],
    icon: Divide,
    section: 'conversioni',
    Component: RegolaDelTre,
  },
  // --- Cucina ---
  {
    slug: 'volume-peso',
    name: 'Volume ↔ peso',
    description: 'Trasforma bicchieri e cucchiai in grammi (e viceversa) per ogni ingrediente.',
    keywords: ['grammi', 'ml', 'bicchiere', 'cucchiaio', 'farina', 'densità', 'ricetta'],
    icon: Scale,
    section: 'cucina',
    Component: VolumePeso,
  },
  {
    slug: 'forno',
    name: 'Forno',
    description: 'Converti la temperatura tra forno statico e ventilato e leggi il gas mark.',
    keywords: ['forno', 'statico', 'ventilato', 'gas mark', 'temperatura', 'gradi'],
    icon: Flame,
    section: 'cucina',
    Component: Forno,
  },
  {
    slug: 'lievito',
    name: 'Lievito',
    description: 'Converti il lievito di birra tra fresco e secco senza sbagliare le dosi.',
    keywords: ['lievito', 'fresco', 'secco', 'birra', 'dosi'],
    icon: ChefHat,
    section: 'cucina',
    Component: Lievito,
  },
  {
    slug: 'riscala-ricetta',
    name: 'Riscala ricetta',
    description: 'Adatta le dosi di una ricetta al numero di porzioni che ti servono.',
    keywords: ['porzioni', 'dosi', 'ricetta', 'persone'],
    icon: Users,
    section: 'cucina',
    Component: RiscalaRicetta,
  },
  {
    slug: 'adatta-stampo',
    name: 'Adatta lo stampo',
    description: 'Ricalcola le dosi di una torta quando cambi il diametro della teglia.',
    keywords: ['stampo', 'teglia', 'torta', 'diametro', 'dosi'],
    icon: CircleDot,
    section: 'cucina',
    Component: AdattaStampo,
  },
  {
    slug: 'quanto-cucinare',
    name: 'Quanto cucinare',
    description: 'Quanti grammi di pasta, riso o carne preparare per i tuoi ospiti.',
    keywords: ['porzioni', 'persone', 'pasta', 'riso', 'grammi', 'ospiti'],
    icon: CakeSlice,
    section: 'cucina',
    Component: PerPersona,
  },
  {
    slug: 'impasto',
    name: "Impasto (baker's %)",
    description: 'Bilancia acqua, sale e lievito in percentuale sul peso della farina.',
    keywords: ['impasto', 'pane', 'pizza', 'idratazione', 'baker', 'farina'],
    icon: Wheat,
    section: 'cucina',
    Component: Impasto,
  },
  // --- Risparmio ---
  {
    slug: 'sconto',
    name: 'Sconto',
    description: 'Calcola il prezzo finale dopo uno sconto e quanto risparmi.',
    keywords: ['sconto', 'prezzo', 'saldi', 'percentuale', 'offerta'],
    icon: Tags,
    section: 'risparmio',
    Component: Sconto,
  },
  {
    slug: 'offerta-3x2',
    name: 'Offerta 3×2 & simili',
    description: "Il prezzo reale a pezzo delle offerte tipo 3×2 o 'prendi N paghi M'.",
    keywords: ['3x2', 'offerta', 'prezzo', 'pezzo', 'promozione'],
    icon: Percent,
    section: 'risparmio',
    Component: OffertaMultipla,
  },
  {
    slug: 'iva',
    name: 'IVA',
    description: "Aggiungi o scorpora l'IVA con le aliquote italiane (22, 10, 5, 4%).",
    keywords: ['iva', 'imponibile', 'lordo', 'aliquota', 'scorporo', 'fattura'],
    icon: Receipt,
    section: 'risparmio',
    Component: Iva,
  },
  {
    slug: 'costo-nel-tempo',
    name: 'Costo nel tempo',
    description: "Quanto pesa davvero un'abitudine (caffè, abbonamenti) al mese e all'anno.",
    keywords: ['abbonamento', 'caffè', 'costo', 'mensile', 'annuo', 'abitudine'],
    icon: CalendarClock,
    section: 'risparmio',
    Component: CostoNelTempo,
  },
  {
    slug: 'fatto-in-casa',
    name: 'Fatto in casa vs comprato',
    description: 'Confronta il costo a porzione di ciò che prepari con il prodotto pronto.',
    keywords: ['fatto in casa', 'risparmio', 'porzione', 'costo'],
    icon: PiggyBank,
    section: 'risparmio',
    Component: FattoInCasa,
  },
  {
    slug: 'dividi-conto',
    name: 'Dividi il conto',
    description: 'Dividi una spesa tra più persone e scopri la quota a testa.',
    keywords: ['conto', 'dividi', 'spesa', 'persone', 'cena'],
    icon: Users,
    section: 'risparmio',
    Component: DividiConto,
  },
  {
    slug: 'cambio-elettrodomestico',
    name: 'Cambio elettrodomestico',
    description: 'Capisci se conviene sostituire un elettrodomestico con uno più efficiente.',
    keywords: ['elettrodomestico', 'classe energetica', 'ammortamento', 'consumo', 'frigo'],
    icon: Calculator,
    section: 'risparmio',
    Component: Ammortamento,
  },
  // --- Casa e bollette ---
  {
    slug: 'costo-elettrodomestico',
    name: 'Costo elettrodomestico',
    description: "Quanto ti costa in bolletta un apparecchio in base a watt e ore d'uso.",
    keywords: ['bolletta', 'energia', 'kwh', 'watt', 'consumo', 'elettrodomestico'],
    icon: Zap,
    section: 'casa',
    Component: CostoElettrodomestico,
  },
  {
    slug: 'gas',
    name: 'Gas m³ → kWh',
    description: 'Converti i metri cubi di gas in kWh e calcola il costo.',
    keywords: ['gas', 'm3', 'kwh', 'bolletta', 'metano', 'riscaldamento'],
    icon: Flame,
    section: 'casa',
    Component: Gas,
  },
  {
    slug: 'rubinetto',
    name: 'Rubinetto che gocciola',
    description: 'Quanta acqua e quanti euro butti via in un anno con un rubinetto che perde.',
    keywords: ['acqua', 'rubinetto', 'spreco', 'perdita', 'gocce'],
    icon: Droplets,
    section: 'casa',
    Component: RubinettoCheGocciola,
  },
  {
    slug: 'btu-condizionatore',
    name: 'BTU condizionatore',
    description: 'La potenza in BTU consigliata per la dimensione della stanza.',
    keywords: ['condizionatore', 'btu', 'climatizzatore', 'stanza', 'raffrescamento'],
    icon: Snowflake,
    section: 'casa',
    Component: Condizionatore,
  },
  {
    slug: 'costo-tragitto',
    name: 'Costo tragitto',
    description: 'Il costo del carburante per un viaggio in base ai km e ai consumi.',
    keywords: ['carburante', 'benzina', 'diesel', 'viaggio', 'km', 'consumo'],
    icon: Fuel,
    section: 'casa',
    Component: Carburante,
  },
  {
    slug: 'vernice',
    name: 'Vernice per m²',
    description: 'Stima i litri di pittura per imbiancare una stanza.',
    keywords: ['vernice', 'pittura', 'imbiancare', 'm2', 'pareti'],
    icon: PaintRoller,
    section: 'casa',
    Component: Vernice,
  },
  {
    slug: 'piastrelle',
    name: 'Piastrelle / parquet',
    description: 'Quante piastrelle servono per coprire una superficie, sfrido incluso.',
    keywords: ['piastrelle', 'parquet', 'pavimento', 'm2', 'sfrido', 'scatole'],
    icon: LayoutGrid,
    section: 'casa',
    Component: Piastrelle,
  },
  {
    slug: 'area-volume-stanza',
    name: 'Area e volume stanza',
    description: 'Area e volume di una stanza per vernice, clima o riscaldamento.',
    keywords: ['area', 'volume', 'stanza', 'm2', 'm3', 'metri'],
    icon: Ruler,
    section: 'casa',
    Component: StanzaAreaVolume,
  },
];

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');

/** Filtra i tool per query su nome, descrizione e keyword. */
export function searchTools(query: string): Tool[] {
  const q = normalize(query.trim());
  if (!q) return TOOLS;
  return TOOLS.filter((t) => {
    const haystack = normalize([t.name, t.description, ...t.keywords].join(' '));
    return haystack.includes(q);
  });
}
