import { describe, expect, it } from 'vitest';
import { paintLiters, rectArea, roomVolume, tilesNeeded } from './home.ts';

describe('home', () => {
  it('aree e volumi', () => {
    expect(rectArea(4, 2.7)).toBeCloseTo(10.8);
    expect(roomVolume(4, 5, 2.7)).toBeCloseTo(54);
  });

  it('vernice per m²', () => {
    // 40 m² pareti, 2 mani, 10 m²/l → 8 l
    expect(paintLiters({ wallArea: 40, coats: 2, coveragePerLiter: 10 })).toBe(8);
    // con deduzioni porte/finestre
    expect(paintLiters({ wallArea: 40, deductions: 5, coats: 2, coveragePerLiter: 10 })).toBe(7);
    expect(() => paintLiters({ wallArea: 10, coveragePerLiter: 0 })).toThrow();
  });

  it('piastrelle con sfrido', () => {
    const r = tilesNeeded({ area: 20, tileArea: 0.36, wastePercent: 10, perBox: 6 });
    expect(r.areaWithWaste).toBeCloseTo(22);
    expect(r.tiles).toBe(Math.ceil(22 / 0.36)); // 62
    expect(r.boxes).toBe(Math.ceil(r.tiles / 6));
    expect(() => tilesNeeded({ area: 10, tileArea: 0 })).toThrow();
  });
});
