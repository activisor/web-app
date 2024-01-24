/**
 * https://developers.google.com/sheets/api/guides/formats#date_and_time_format_patterns
 *
 */

import { toExcelDate } from '@/lib/sheets/to-excel-date';

test('converts Date to Excel serial date', () => {
  const date = new Date('2021-01-01T05:00:00.000Z');
  expect(toExcelDate(date)).toBe(44197);
});