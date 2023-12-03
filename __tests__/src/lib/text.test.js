import { removeSubstring, toTitleCase } from '@/lib/text';

test('should remove substring', () => {
  const result = removeSubstring('abc', 'b');
  expect(result).toBe('ac');
});

test('should remove substring from start', () => {
  const result = removeSubstring('abc', 'a');
  expect(result).toBe('bc');
});

test('should remove substring from end', () => {
  const result = removeSubstring('abc', 'c');
  expect(result).toBe('ab');
});

test('should change spaced words to title case', () => {
  const result = toTitleCase(' aB, CD ef ');
  expect(result).toBe(' Ab, Cd Ef ');
});

test('should change hyphenated words to title case', () => {
  const result = toTitleCase('aB-CD-ef');
  expect(result).toBe('Ab-Cd-Ef');
});
