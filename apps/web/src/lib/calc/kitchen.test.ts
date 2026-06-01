import { describe, expect, it } from 'vitest';
import {
  bakersPercentage,
  celsiusToGasMark,
  convertYeast,
  gasMarkToCelsius,
  ovenConvert,
  panScaleFactor,
  recipeScaleFactor,
  scaleIngredients,
  servingAmount,
  volumeToWeight,
  weightToVolume,
} from './kitchen.ts';

describe('kitchen — volume↔peso', () => {
  it('acqua 1:1', () => {
    expect(volumeToWeight('acqua', 250)).toBe(250);
    expect(weightToVolume('acqua', 250)).toBe(250);
  });
  it('farina (densità 0.53)', () => {
    expect(volumeToWeight('farina', 200)).toBeCloseTo(106);
  });
  it('ingrediente sconosciuto', () => {
    expect(() => volumeToWeight('plutonio', 1)).toThrow();
  });
});

describe('kitchen — forno', () => {
  it('statico↔ventilato (±20)', () => {
    expect(ovenConvert(200, 'static', 'fan')).toBe(180);
    expect(ovenConvert(180, 'fan', 'static')).toBe(200);
    expect(ovenConvert(200, 'static', 'static')).toBe(200);
  });
  it('gas mark', () => {
    expect(gasMarkToCelsius(6)).toBe(200);
    expect(celsiusToGasMark(200)).toBe(6);
    expect(celsiusToGasMark(185)).toBe(4); // 180 più vicino di 190? 185→ equidistante, prende il primo
  });
});

describe('kitchen — lievito', () => {
  it('fresco↔secco (fattore 3)', () => {
    expect(convertYeast(21, 'fresh', 'dry')).toBe(7);
    expect(convertYeast(7, 'dry', 'fresh')).toBe(21);
  });
});

describe('kitchen — ricette e stampi', () => {
  it('fattore porzioni', () => {
    expect(recipeScaleFactor(4, 6)).toBe(1.5);
    expect(() => recipeScaleFactor(0, 4)).toThrow();
  });
  it('riscala ingredienti', () => {
    expect(scaleIngredients([100, 200, 50], 4, 8)).toEqual([200, 400, 100]);
  });
  it('adatta stampo (rapporto aree)', () => {
    // da Ø20 a Ø24 → (24/20)² = 1.44
    expect(
      panScaleFactor({ shape: 'round', diameter: 20 }, { shape: 'round', diameter: 24 }),
    ).toBeCloseTo(1.44);
    // rettangolare 20x30 = 600 cm² vs rotonda Ø20 ≈ 314 cm²
    expect(
      panScaleFactor({ shape: 'round', diameter: 20 }, { shape: 'rect', width: 20, length: 30 }),
    ).toBeCloseTo(600 / (Math.PI * 100), 4);
  });
});

describe('kitchen — porzioni e impasto', () => {
  it('grammi per persone', () => {
    expect(servingAmount('pasta', 4)).toBe(320);
  });
  it("baker's percentage", () => {
    const r = bakersPercentage(1000, { hydration: 65, salt: 2, yeast: 1 });
    expect(r.water).toBe(650);
    expect(r.salt).toBe(20);
    expect(r.yeast).toBe(10);
    expect(r.total).toBe(1680);
  });
});
