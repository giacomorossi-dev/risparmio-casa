// Convertitore di unità di misura — funzioni pure + catalogo per la UI.
// Ogni categoria ha un'unità base; ogni unità un fattore `toBase`. La temperatura
// è speciale (offset), gestita a parte.

export type UnitCategory = 'length' | 'mass' | 'volume' | 'area' | 'energy' | 'temperature';

export type UnitDef = {
  id: string;
  label: string;
  /** Fattore moltiplicativo verso l'unità base della categoria. */
  toBase: number;
};

type CategoryDef = { base: string; units: UnitDef[] };

export const UNIT_CATALOG: Record<Exclude<UnitCategory, 'temperature'>, CategoryDef> = {
  length: {
    base: 'm',
    units: [
      { id: 'mm', label: 'millimetri (mm)', toBase: 0.001 },
      { id: 'cm', label: 'centimetri (cm)', toBase: 0.01 },
      { id: 'm', label: 'metri (m)', toBase: 1 },
      { id: 'km', label: 'chilometri (km)', toBase: 1000 },
      { id: 'in', label: 'pollici (in)', toBase: 0.0254 },
    ],
  },
  mass: {
    base: 'g',
    units: [
      { id: 'mg', label: 'milligrammi (mg)', toBase: 0.001 },
      { id: 'g', label: 'grammi (g)', toBase: 1 },
      { id: 'kg', label: 'chilogrammi (kg)', toBase: 1000 },
      { id: 'oz', label: 'once (oz)', toBase: 28.349523125 },
      { id: 'lb', label: 'libbre (lb)', toBase: 453.59237 },
    ],
  },
  volume: {
    base: 'l',
    units: [
      { id: 'ml', label: 'millilitri (ml)', toBase: 0.001 },
      { id: 'cl', label: 'centilitri (cl)', toBase: 0.01 },
      { id: 'dl', label: 'decilitri (dl)', toBase: 0.1 },
      { id: 'l', label: 'litri (l)', toBase: 1 },
      { id: 'cucchiaino', label: 'cucchiaini (5 ml)', toBase: 0.005 },
      { id: 'cucchiaio', label: 'cucchiai (15 ml)', toBase: 0.015 },
      { id: 'bicchiere', label: 'bicchieri (200 ml)', toBase: 0.2 },
      { id: 'tazza', label: 'tazze (250 ml)', toBase: 0.25 },
      { id: 'cup', label: 'cup US (240 ml)', toBase: 0.24 },
    ],
  },
  area: {
    base: 'm2',
    units: [
      { id: 'cm2', label: 'centimetri² (cm²)', toBase: 0.0001 },
      { id: 'm2', label: 'metri² (m²)', toBase: 1 },
      { id: 'ettaro', label: 'ettari (ha)', toBase: 10000 },
      { id: 'km2', label: 'chilometri² (km²)', toBase: 1_000_000 },
    ],
  },
  energy: {
    base: 'kWh',
    units: [
      { id: 'Wh', label: 'wattora (Wh)', toBase: 0.001 },
      { id: 'kWh', label: 'chilowattora (kWh)', toBase: 1 },
      { id: 'kcal', label: 'chilocalorie (kcal)', toBase: 0.001163 },
      { id: 'BTU', label: 'BTU', toBase: 0.000293071 },
    ],
  },
};

const TEMPERATURE_UNITS: UnitDef[] = [
  { id: 'C', label: 'Celsius (°C)', toBase: 1 },
  { id: 'F', label: 'Fahrenheit (°F)', toBase: 1 },
  { id: 'K', label: 'Kelvin (K)', toBase: 1 },
];

/** Tutte le unità di una categoria (per i menu della UI). */
export function unitsOf(category: UnitCategory): UnitDef[] {
  if (category === 'temperature') return TEMPERATURE_UNITS;
  return UNIT_CATALOG[category].units;
}

function findCategory(unitId: string): UnitCategory {
  if (TEMPERATURE_UNITS.some((u) => u.id === unitId)) return 'temperature';
  for (const cat of Object.keys(UNIT_CATALOG) as Exclude<UnitCategory, 'temperature'>[]) {
    if (UNIT_CATALOG[cat].units.some((u) => u.id === unitId)) return cat;
  }
  throw new RangeError(`Unità sconosciuta: ${unitId}`);
}

function toCelsius(value: number, from: string): number {
  if (from === 'C') return value;
  if (from === 'F') return ((value - 32) * 5) / 9;
  return value - 273.15; // K
}

function fromCelsius(value: number, to: string): number {
  if (to === 'C') return value;
  if (to === 'F') return (value * 9) / 5 + 32;
  return value + 273.15; // K
}

/**
 * Converte `value` da un'unità a un'altra della STESSA categoria.
 * Lancia se le unità appartengono a categorie diverse.
 */
export function convert(value: number, fromId: string, toId: string): number {
  const fromCat = findCategory(fromId);
  const toCat = findCategory(toId);
  if (fromCat !== toCat) {
    throw new RangeError(`Categorie incompatibili: ${fromCat} → ${toCat}`);
  }
  if (fromCat === 'temperature') {
    return fromCelsius(toCelsius(value, fromId), toId);
  }
  const units = UNIT_CATALOG[fromCat].units;
  const from = units.find((u) => u.id === fromId);
  const to = units.find((u) => u.id === toId);
  if (!from || !to) throw new RangeError('Unità non trovata');
  return (value * from.toBase) / to.toBase;
}
