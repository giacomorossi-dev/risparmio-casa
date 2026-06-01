import { describe, expect, it } from 'vitest';
import {
  addDays,
  applyPercentChange,
  percentageOf,
  percentChange,
  round,
  ruleOfThree,
  whatPercent,
} from './math.ts';

describe('math', () => {
  it('percentageOf', () => {
    expect(percentageOf(20, 50)).toBe(10);
    expect(percentageOf(100, 80)).toBe(80);
  });

  it('whatPercent', () => {
    expect(whatPercent(10, 50)).toBe(20);
    expect(() => whatPercent(1, 0)).toThrow();
  });

  it('percentChange', () => {
    expect(percentChange(50, 75)).toBe(50);
    expect(percentChange(100, 50)).toBe(-50);
    expect(() => percentChange(0, 10)).toThrow();
  });

  it('applyPercentChange', () => {
    expect(applyPercentChange(50, 50)).toBe(75);
    expect(applyPercentChange(100, -20)).toBe(80);
  });

  it('ruleOfThree', () => {
    expect(ruleOfThree(2, 10, 6)).toBe(30);
    expect(() => ruleOfThree(0, 1, 1)).toThrow();
  });

  it('addDays', () => {
    const base = new Date('2026-01-01T00:00:00Z');
    expect(addDays(base, 31).toISOString().slice(0, 10)).toBe('2026-02-01');
    expect(base.toISOString().slice(0, 10)).toBe('2026-01-01'); // non muta
  });

  it('round', () => {
    expect(round(1.23456)).toBe(1.23);
    expect(round(1.005, 2)).toBe(1.0);
    expect(round(1.239, 1)).toBe(1.2);
  });
});
