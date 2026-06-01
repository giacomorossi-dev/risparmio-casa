import { describe, expect, it } from 'vitest';
import {
  addVat,
  applyDiscount,
  compareAppliances,
  costOverTime,
  costPerUse,
  cumulativeDiscount,
  discountPercent,
  homemadeVsBought,
  multiBuyUnitPrice,
  removeVat,
  secondHalfPriceUnit,
  splitByShares,
  splitEven,
} from './money.ts';

describe('money — sconti', () => {
  it('applyDiscount / discountPercent', () => {
    expect(applyDiscount(100, 30)).toBe(70);
    expect(discountPercent(100, 70)).toBe(30);
    expect(() => discountPercent(0, 0)).toThrow();
  });
  it('cumulativeDiscount', () => {
    expect(cumulativeDiscount(100, [30, 20])).toBeCloseTo(56); // 0.7*0.8
  });
  it('offerte multi-acquisto', () => {
    expect(multiBuyUnitPrice(3, 3, 2)).toBeCloseTo(2); // 3x2 su prezzo 3
    expect(secondHalfPriceUnit(10)).toBe(7.5);
  });
});

describe('money — IVA', () => {
  it('addVat', () => {
    expect(addVat(100, 22)).toEqual({ vat: 22, gross: 122 });
  });
  it('removeVat', () => {
    const r = removeVat(122, 22);
    expect(r.net).toBeCloseTo(100);
    expect(r.vat).toBeCloseTo(22);
  });
});

describe('money — costo nel tempo', () => {
  it('costOverTime month→year', () => {
    expect(costOverTime(10, 'month').year).toBe(120);
  });
  it('costOverTime day→year', () => {
    expect(costOverTime(1, 'day').year).toBe(365);
  });
  it('costPerUse', () => {
    expect(costPerUse(200, 50)).toBe(4);
    expect(() => costPerUse(1, 0)).toThrow();
  });
});

describe('money — fatto in casa / conto', () => {
  it('homemadeVsBought', () => {
    const r = homemadeVsBought(6, 4, 3);
    expect(r.homemadePerServing).toBe(1.5);
    expect(r.savingPerServing).toBe(1.5);
  });
  it('splitEven / splitByShares', () => {
    expect(splitEven(100, 4)).toBe(25);
    expect(splitByShares(100, [1, 1, 2])).toEqual([25, 25, 50]);
    expect(() => splitEven(10, 0)).toThrow();
  });
});

describe('money — ammortamento elettrodomestici', () => {
  it('confronto vecchio vs nuovo su 10 anni', () => {
    const r = compareAppliances(
      { price: 0, yearlyKwh: 400 }, // vecchio già in casa
      { price: 500, yearlyKwh: 200 }, // nuovo più efficiente
      0.25,
      10,
    );
    expect(r.currentCost).toBe(1000); // 400*0.25*10
    expect(r.replacementCost).toBe(1000); // 500 + 200*0.25*10
    expect(r.saving).toBe(0); // pareggio a 10 anni
  });
});
