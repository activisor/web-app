import { extractName } from '@/lib/email/extract-name';

test('should extract name with first and last name', () => {
  const result = extractName('From: First Last Name <test@email.com>');
  expect(result).toBe('Last Name');
});

test('should extract name with first and hyphenated last name', () => {
  const result = extractName('To: First Last-Name <test@email.com>');
  expect(result).toBe('First Last-Name');
});

test('should extract name with single name', () => {
  const result = extractName('Last <test@email.com>');
  expect(result).toBe('Last');
});
