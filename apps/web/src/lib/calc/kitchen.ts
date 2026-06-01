// Calcolatori per la cucina — funzioni pure, granulari, testabili.
import { GAS_MARK_TO_CELSIUS, INGREDIENT_DENSITY, SERVING_GRAMS } from './data.ts';

// ---------------------------------------------------------------------------
// Volume ↔ peso per ingrediente (densità)
// ---------------------------------------------------------------------------

/** ml di un ingrediente → grammi. */
export function volumeToWeight(ingredientId: string, ml: number): number {
  const d = INGREDIENT_DENSITY[ingredientId];
  if (!d) throw new RangeError(`Ingrediente sconosciuto: ${ingredientId}`);
  return ml * d.gPerMl;
}

/** grammi di un ingrediente → ml. */
export function weightToVolume(ingredientId: string, grams: number): number {
  const d = INGREDIENT_DENSITY[ingredientId];
  if (!d) throw new RangeError(`Ingrediente sconosciuto: ${ingredientId}`);
  return grams / d.gPerMl;
}

// ---------------------------------------------------------------------------
// Forno
// ---------------------------------------------------------------------------

export type OvenMode = 'static' | 'fan';

/** Converte la temperatura tra forno statico e ventilato (ventilato ≈ −20 °C). */
export function ovenConvert(celsius: number, from: OvenMode, to: OvenMode): number {
  if (from === to) return celsius;
  return from === 'static' ? celsius - 20 : celsius + 20;
}

/** Gas mark → °C. */
export function gasMarkToCelsius(mark: number): number {
  const c = GAS_MARK_TO_CELSIUS[mark];
  if (c === undefined) throw new RangeError(`Gas mark non valido: ${mark}`);
  return c;
}

/** °C → gas mark più vicino (in caso di parità vince il mark più basso). */
export function celsiusToGasMark(celsius: number): number {
  let bestMark = 1;
  let bestDiff = Number.POSITIVE_INFINITY;
  for (const [mark, temp] of Object.entries(GAS_MARK_TO_CELSIUS)) {
    const diff = Math.abs(temp - celsius);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestMark = Number(mark);
    }
  }
  return bestMark;
}

// ---------------------------------------------------------------------------
// Lievito: fresco ↔ secco (fattore 3)
// ---------------------------------------------------------------------------

export type YeastType = 'fresh' | 'dry';
const FRESH_TO_DRY = 3;

/** Converte i grammi di lievito tra fresco e secco. */
export function convertYeast(grams: number, from: YeastType, to: YeastType): number {
  if (from === to) return grams;
  return from === 'fresh' ? grams / FRESH_TO_DRY : grams * FRESH_TO_DRY;
}

// ---------------------------------------------------------------------------
// Riscalare ricette
// ---------------------------------------------------------------------------

/** Fattore per passare da N porzioni a M porzioni. */
export function recipeScaleFactor(fromServings: number, toServings: number): number {
  if (fromServings <= 0) throw new RangeError('fromServings deve essere > 0');
  return toServings / fromServings;
}

/** Riscala una lista di quantità (ingredienti) per il numero di porzioni. */
export function scaleIngredients(
  quantities: number[],
  fromServings: number,
  toServings: number,
): number[] {
  const f = recipeScaleFactor(fromServings, toServings);
  return quantities.map((q) => q * f);
}

// ---------------------------------------------------------------------------
// Adattare lo stampo (rapporto fra aree)
// ---------------------------------------------------------------------------

export type Pan =
  | { shape: 'round'; diameter: number }
  | { shape: 'rect'; width: number; length: number };

function panArea(pan: Pan): number {
  return pan.shape === 'round' ? Math.PI * (pan.diameter / 2) ** 2 : pan.width * pan.length;
}

/** Fattore di dosaggio per passare da uno stampo a un altro (rapporto aree). */
export function panScaleFactor(from: Pan, to: Pan): number {
  const a = panArea(from);
  if (a <= 0) throw new RangeError('Area stampo di partenza non valida');
  return panArea(to) / a;
}

// ---------------------------------------------------------------------------
// Quanto cucinare per N persone
// ---------------------------------------------------------------------------

/** Grammi totali di un alimento per `people` persone. */
export function servingAmount(itemId: string, people: number): number {
  const item = SERVING_GRAMS[itemId];
  if (!item) throw new RangeError(`Alimento sconosciuto: ${itemId}`);
  return item.grams * people;
}

// ---------------------------------------------------------------------------
// Impasto: baker's percentage (percentuali sul peso della farina)
// ---------------------------------------------------------------------------

export type DoughPercents = { hydration: number; salt: number; yeast: number };

/** Dato il peso della farina e le percentuali, restituisce i grammi. */
export function bakersPercentage(
  flourGrams: number,
  { hydration, salt, yeast }: DoughPercents,
): { flour: number; water: number; salt: number; yeast: number; total: number } {
  const water = (flourGrams * hydration) / 100;
  const saltG = (flourGrams * salt) / 100;
  const yeastG = (flourGrams * yeast) / 100;
  return {
    flour: flourGrams,
    water,
    salt: saltG,
    yeast: yeastG,
    total: flourGrams + water + saltG + yeastG,
  };
}
