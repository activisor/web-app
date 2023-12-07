import { iToAlpha } from '@/lib/i-to-alpha';

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
