import { validateCode } from '@/lib/validate-code';

const refCodes = [
  'Abcd',
  'Efgh',
];

test('valid code returns true', () => {
  const code = 'aBCD';
  expect(validateCode(code, refCodes)).toBe(true);
});