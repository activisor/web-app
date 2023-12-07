import { iToAlpha, toA1Notation } from '@/lib/a1-notation';

test('0 returns A', () => {
    const result = iToAlpha(0);
    expect(result).toBe('A');
});

test('25 returns Z', () => {
  const result = iToAlpha(25);
  expect(result).toBe('Z');
});

test('26 returns AA', () => {
  const result = iToAlpha(26);
  expect(result).toBe('AA');
});

test('row 0, column 0 returns A1', () => {
  const result = toA1Notation(0, 0);
  expect(result).toBe('A1');
});
