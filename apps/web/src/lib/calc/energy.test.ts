import { describe, expect, it } from 'vitest';
import {
  applianceCost,
  drippingTap,
  fuelCostPer100km,
  gasCost,
  gasKwhToM3,
  gasM3ToKwh,
  kwhPerDay,
  recommendedBtu,
  tripElectricCost,
  tripFuelCost,
  waterCost,
} from './energy.ts';

describe('energy — elettrodomestici', () => {
  it('kwhPerDay', () => {
    expect(kwhPerDay(2000, 1)).toBe(2); // 2000W per 1h = 2 kWh
  });
  it('applianceCost ogni giorno', () => {
    const r = applianceCost({ watts: 2000, hoursPerDay: 1, pricePerKwh: 0.25 });
    expect(r.kwhDay).toBe(2);
    expect(r.costDay).toBe(0.5);
    expect(r.costYear).toBeCloseTo(182.5); // 0.5 * 365
  });
  it('applianceCost con giorni/settimana', () => {
    const r = applianceCost({ watts: 1000, hoursPerDay: 2, pricePerKwh: 0.25, daysPerWeek: 3 });
    // 2 kWh/giorno * 0.25 = 0.5 €/giorno d'uso; 3/7*365 ≈ 156.4 giorni
    expect(r.costYear).toBeCloseTo(0.5 * (3 / 7) * 365);
  });
});

describe('energy — gas', () => {
  it('m³ ↔ kWh', () => {
    expect(gasM3ToKwh(1)).toBeCloseTo(10.69);
    expect(gasKwhToM3(10.69)).toBeCloseTo(1);
  });
  it('costo gas', () => {
    expect(gasCost(100, 0.1)).toBeCloseTo(106.9);
  });
});

describe('energy — acqua', () => {
  it('waterCost', () => {
    expect(waterCost(1000, 1.5)).toBe(1.5); // 1000 l = 1 m³
  });
  it('rubinetto che gocciola', () => {
    const r = drippingTap(10, 1.5); // 10 gocce/min, 0.05 ml/goccia
    // 10*0.05*60*24/1000 = 0.72 l/giorno
    expect(r.litersPerDay).toBeCloseTo(0.72);
    expect(r.litersPerYear).toBeCloseTo(262.8);
  });
});

describe('energy — condizionatore & carburante', () => {
  it('BTU consigliati', () => {
    expect(recommendedBtu(20)).toBe(6800);
  });
  it('carburante', () => {
    expect(fuelCostPer100km(6, 1.8)).toBeCloseTo(10.8);
    expect(tripFuelCost(50, 6, 1.8)).toBeCloseTo(5.4);
    expect(tripElectricCost(100, 18, 0.25)).toBeCloseTo(4.5);
  });
});
