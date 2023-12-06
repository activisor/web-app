import { extractEmail, extractName, isFromDomain } from '@/lib/email/extract-email-fields';

test('should extract email with name and email', () => {
  const result = extractEmail('From: First Last Name <test@email.com>');
  expect(result).toBe('test@email.com');
});

test('should return "" for email when not valid', () => {
  const result = extractEmail('test@email');
  expect(result).toBe('');
});

test('should remove spaces around email', () => {
  const result = extractEmail(' test@email.com ');
  expect(result).toBe('test@email.com');
});

test('should extract name with first and last name', () => {
  const result = extractName('From: First Last Name <test@email.com>');
  expect(result).toBe('Last Name');
});

test('should extract name with first and hyphenated last name', () => {
  const result = extractName('To: First Last-Name <test@email.com>');
  expect(result).toBe('First Last-Name');
});

test('should extract single name without spaces', () => {
  const result = extractName(' Last <test@email.com>');
  expect(result).toBe('Last');
});

test('should return "" for name when none', () => {
  const result = extractName('<test@email.com>');
  expect(result).toBe('');
});

test('should return true when email is from reference domain', () => {
  const result = isFromDomain('test@mail.test.com', 'mail.test.com');
  expect(result).toBe(true);
});

test('should return false when email is from subdomain of reference domain', () => {
  const result = isFromDomain('test@mail.test.com', 'test.com');
  expect(result).toBe(false);
});

test('should return false when email is from root domain of reference subdomain', () => {
  const result = isFromDomain('test@test.com', 'mail.test.com');
  expect(result).toBe(false);
});