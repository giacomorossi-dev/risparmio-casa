import { describe, expect, it } from 'vitest';
import { convert, unitsOf } from './units.ts';

describe('units.convert', () => {
  it('volume', () => {
    expect(convert(1, 'l', 'ml')).toBe(1000);
    expect(convert(500, 'ml', 'l')).toBe(0.5);
    expect(convert(1, 'bicchiere', 'ml')).toBeCloseTo(200);
    expect(convert(15, 'ml', 'cucchiaio')).toBeCloseTo(1);
  });

  it('mass', () => {
    expect(convert(1, 'kg', 'g')).toBe(1000);
    expect(convert(2500, 'g', 'kg')).toBe(2.5);
    expect(convert(1, 'lb', 'g')).toBeCloseTo(453.592, 2);
  });

  it('length', () => {
    expect(convert(1, 'm', 'cm')).toBe(100);
    expect(convert(1, 'in', 'cm')).toBeCloseTo(2.54);
  });

  it('temperature', () => {
    expect(convert(0, 'C', 'F')).toBe(32);
    expect(convert(100, 'C', 'F')).toBe(212);
    expect(convert(212, 'F', 'C')).toBeCloseTo(100);
    expect(convert(0, 'C', 'K')).toBeCloseTo(273.15);
  });

  it('energy', () => {
    expect(convert(1, 'kWh', 'Wh')).toBe(1000);
  });

  it('rifiuta categorie incompatibili', () => {
    expect(() => convert(1, 'g', 'ml')).toThrow();
    expect(() => convert(1, 'l', 'kg')).toThrow();
  });

  it('unitsOf elenca le unità', () => {
    expect(unitsOf('temperature').map((u) => u.id)).toEqual(['C', 'F', 'K']);
    expect(unitsOf('mass').length).toBeGreaterThan(3);
  });
});
