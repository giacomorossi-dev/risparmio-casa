// Calcolatori per il risparmio / denaro — funzioni pure, granulari.

// ---------------------------------------------------------------------------
// Sconti
// ---------------------------------------------------------------------------

/** Prezzo dopo uno sconto percentuale. */
export function applyDiscount(price: number, percent: number): number {
  return price * (1 - percent / 100);
}

/** Percentuale di sconto dato prezzo pieno e finale. */
export function discountPercent(original: number, final: number): number {
  if (original <= 0) throw new RangeError('original deve essere > 0');
  return ((original - final) / original) * 100;
}

/** Applica più sconti in sequenza (cumulativi): es. [30, 20] → 0.7*0.8. */
export function cumulativeDiscount(price: number, percents: number[]): number {
  return percents.reduce((acc, p) => acc * (1 - p / 100), price);
}

/**
 * Prezzo unitario effettivo di un'offerta "compra N, paghi M" (es. 3x2).
 * effectiveUnitPrice(2, 3, 2) → paghi 2 unità su 3 ⇒ 1.333 a unità.
 */
export function multiBuyUnitPrice(unitPrice: number, buy: number, pay: number): number {
  if (buy <= 0) throw new RangeError('buy deve essere > 0');
  return (unitPrice * pay) / buy;
}

/** "Il secondo a metà prezzo": prezzo medio unitario su una coppia. */
export function secondHalfPriceUnit(unitPrice: number): number {
  return (unitPrice + unitPrice / 2) / 2; // = 0.75 * unitPrice
}

// ---------------------------------------------------------------------------
// IVA
// ---------------------------------------------------------------------------

/** Aggiunge l'IVA a un imponibile. */
export function addVat(net: number, rate: number): { vat: number; gross: number } {
  const vat = (net * rate) / 100;
  return { vat, gross: net + vat };
}

/** Scorpora l'IVA da un totale lordo. */
export function removeVat(gross: number, rate: number): { net: number; vat: number } {
  const net = gross / (1 + rate / 100);
  return { net, vat: gross - net };
}

// ---------------------------------------------------------------------------
// Costo nel tempo
// ---------------------------------------------------------------------------

export type Period = 'day' | 'week' | 'month' | 'year';

const PER_YEAR: Record<Period, number> = { day: 365, week: 52, month: 12, year: 1 };

/** Proietta un costo da un periodo a tutti gli altri. */
export function costOverTime(amount: number, period: Period): Record<Period, number> {
  const yearly = amount * PER_YEAR[period];
  return {
    day: yearly / PER_YEAR.day,
    week: yearly / PER_YEAR.week,
    month: yearly / PER_YEAR.month,
    year: yearly,
  };
}

/** Costo per singolo utilizzo. */
export function costPerUse(price: number, uses: number): number {
  if (uses <= 0) throw new RangeError('uses deve essere > 0');
  return price / uses;
}

// ---------------------------------------------------------------------------
// Fatto in casa vs comprato
// ---------------------------------------------------------------------------

/** Confronta il costo a porzione fatto-in-casa vs comprato pronto. */
export function homemadeVsBought(
  ingredientsTotal: number,
  servings: number,
  boughtUnitPrice: number,
): { homemadePerServing: number; boughtPerServing: number; savingPerServing: number } {
  if (servings <= 0) throw new RangeError('servings deve essere > 0');
  const homemadePerServing = ingredientsTotal / servings;
  return {
    homemadePerServing,
    boughtPerServing: boughtUnitPrice,
    savingPerServing: boughtUnitPrice - homemadePerServing,
  };
}

// ---------------------------------------------------------------------------
// Dividi il conto
// ---------------------------------------------------------------------------

/** Divide un totale in parti uguali fra `people` persone. */
export function splitEven(total: number, people: number): number {
  if (people <= 0) throw new RangeError('people deve essere > 0');
  return total / people;
}

/** Divide un totale in base a quote/pesi (es. [1, 1, 2] → ultimi paga doppio). */
export function splitByShares(total: number, shares: number[]): number[] {
  const sum = shares.reduce((a, b) => a + b, 0);
  if (sum <= 0) throw new RangeError('La somma delle quote deve essere > 0');
  return shares.map((s) => (total * s) / sum);
}

// ---------------------------------------------------------------------------
// Ammortamento elettrodomestico (acquisto + energia nel tempo)
// ---------------------------------------------------------------------------

export type Appliance = { price: number; yearlyKwh: number };

/** Costo totale (acquisto + energia) su `years` anni a un dato €/kWh. */
export function applianceTotalCost(a: Appliance, pricePerKwh: number, years: number): number {
  return a.price + a.yearlyKwh * pricePerKwh * years;
}

/**
 * Confronta due elettrodomestici (es. vecchio vs nuovo) su `years` anni:
 * restituisce i due costi totali e il risparmio del secondo rispetto al primo.
 */
export function compareAppliances(
  current: Appliance,
  replacement: Appliance,
  pricePerKwh: number,
  years: number,
): { currentCost: number; replacementCost: number; saving: number } {
  const currentCost = applianceTotalCost(current, pricePerKwh, years);
  const replacementCost = applianceTotalCost(replacement, pricePerKwh, years);
  return { currentCost, replacementCost, saving: currentCost - replacementCost };
}
