// Utilità matematiche trasversali — funzioni pure, riusabili in tutte le app.

/** Percentuale di un valore: percentageOf(20, 50) = 10 (20% di 50). */
export function percentageOf(percent: number, value: number): number {
  return (value * percent) / 100;
}

/** Quanto percento è `part` di `whole`: whatPercent(10, 50) = 20. */
export function whatPercent(part: number, whole: number): number {
  if (whole === 0) throw new RangeError('whole non può essere 0');
  return (part / whole) * 100;
}

/** Variazione percentuale da `from` a `to`: percentChange(50, 75) = 50. */
export function percentChange(from: number, to: number): number {
  if (from === 0) throw new RangeError('from non può essere 0');
  return ((to - from) / from) * 100;
}

/** Applica una variazione percentuale: applyPercentChange(50, 50) = 75. */
export function applyPercentChange(value: number, percent: number): number {
  return value * (1 + percent / 100);
}

/** Regola del tre: a sta a b come c sta a ? → ruleOfThree(2, 10, 6) = 30. */
export function ruleOfThree(a: number, b: number, c: number): number {
  if (a === 0) throw new RangeError('a non può essere 0');
  return (b * c) / a;
}

/** Aggiunge `days` giorni a una data (non muta l'originale). */
export function addDays(date: Date, days: number): Date {
  const d = new Date(date.getTime());
  d.setDate(d.getDate() + days);
  return d;
}

/** Arrotonda a `decimals` cifre (default 2). */
export function round(value: number, decimals = 2): number {
  const f = 10 ** decimals;
  return Math.round(value * f) / f;
}
