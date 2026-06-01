// Calcolatori per casa / bollette / energia — funzioni pure, granulari.
import { GAS_M3_TO_KWH } from './data.ts';

// ---------------------------------------------------------------------------
// Costo di un elettrodomestico (W × h × €/kWh)
// ---------------------------------------------------------------------------

export type ApplianceUsage = {
  watts: number;
  hoursPerDay: number;
  pricePerKwh: number;
  /** Giorni d'uso a settimana (default 7). */
  daysPerWeek?: number;
};

/** kWh consumati al giorno (nei giorni di utilizzo). */
export function kwhPerDay(watts: number, hoursPerDay: number): number {
  return (watts * hoursPerDay) / 1000;
}

/** Costo d'uso giorno/mese/anno di un elettrodomestico. */
export function applianceCost(u: ApplianceUsage): {
  kwhDay: number;
  costDay: number;
  costMonth: number;
  costYear: number;
} {
  const daysPerWeek = u.daysPerWeek ?? 7;
  const kwhDay = kwhPerDay(u.watts, u.hoursPerDay);
  const costDay = kwhDay * u.pricePerKwh;
  const yearlyDays = (daysPerWeek / 7) * 365;
  const costYear = costDay * yearlyDays;
  return { kwhDay, costDay, costMonth: costYear / 12, costYear };
}

// ---------------------------------------------------------------------------
// Gas: m³ ↔ kWh ↔ €
// ---------------------------------------------------------------------------

/** m³ di gas → kWh (coefficiente PCS, default ~10.69). */
export function gasM3ToKwh(m3: number, coefficient = GAS_M3_TO_KWH): number {
  return m3 * coefficient;
}

/** kWh → m³ di gas. */
export function gasKwhToM3(kwh: number, coefficient = GAS_M3_TO_KWH): number {
  return kwh / coefficient;
}

/** Costo di un consumo gas espresso in m³, dato €/kWh. */
export function gasCost(m3: number, pricePerKwh: number, coefficient = GAS_M3_TO_KWH): number {
  return gasM3ToKwh(m3, coefficient) * pricePerKwh;
}

// ---------------------------------------------------------------------------
// Acqua
// ---------------------------------------------------------------------------

/** Costo di un consumo d'acqua in litri, dato €/m³ (1 m³ = 1000 l). */
export function waterCost(liters: number, pricePerM3: number): number {
  return (liters / 1000) * pricePerM3;
}

/**
 * Spreco di un rubinetto che gocciola: litri/giorno e costo annuo.
 * Una goccia ≈ 0,05 ml.
 */
export function drippingTap(
  dropsPerMinute: number,
  pricePerM3: number,
  mlPerDrop = 0.05,
): { litersPerDay: number; litersPerYear: number; costPerYear: number } {
  const litersPerDay = (dropsPerMinute * mlPerDrop * 60 * 24) / 1000;
  const litersPerYear = litersPerDay * 365;
  return { litersPerDay, litersPerYear, costPerYear: waterCost(litersPerYear, pricePerM3) };
}

// ---------------------------------------------------------------------------
// Condizionatore: BTU consigliati
// ---------------------------------------------------------------------------

/**
 * BTU consigliati per una stanza. Regola pratica: ~340 BTU/m² (base),
 * scalabile con un fattore (esposizione/soffitti alti).
 */
export function recommendedBtu(squareMeters: number, factor = 340): number {
  return squareMeters * factor;
}

// ---------------------------------------------------------------------------
// Carburante / tragitto
// ---------------------------------------------------------------------------

/** Costo carburante ogni 100 km, dato consumo (l/100km) e €/litro. */
export function fuelCostPer100km(consumptionL100: number, pricePerLiter: number): number {
  return consumptionL100 * pricePerLiter;
}

/** Costo carburante per un tragitto di `km`. */
export function tripFuelCost(km: number, consumptionL100: number, pricePerLiter: number): number {
  return (km / 100) * consumptionL100 * pricePerLiter;
}

/** Costo per un tragitto di un'auto elettrica (kWh/100km × €/kWh). */
export function tripElectricCost(km: number, kwh100: number, pricePerKwh: number): number {
  return (km / 100) * kwh100 * pricePerKwh;
}
