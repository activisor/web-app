import { DateRangeParser } from '@/lib/sheets/date-range-parser';
import Frequency from '@/lib/frequency';

test('parses >1 day date range with daily frequency', () => {
  const sut = new DateRangeParser();

  const startDate = new Date(2021, 0, 1);
  const endDate = new Date(2021, 0, 2);
  const result = sut.parse(startDate, endDate, Frequency.Daily);

  expect(result.length).toBe(2);
  expect(result[0].getFullYear()).toBe(2021);
  expect(result[0].getMonth()).toBe(0);
  expect(result[0].getDate()).toBe(1);
  expect(result[1].getFullYear()).toBe(2021);
  expect(result[1].getMonth()).toBe(0);
  expect(result[1].getDate()).toBe(2);
});

test('parses <1 week date range with 1 week frequency', () => {
  const sut = new DateRangeParser();

  const startDate = new Date(2021, 0, 1);
  const endDate = new Date(2021, 0, 7);
  const result = sut.parse(startDate, endDate, Frequency.Weekly);

  expect(result.length).toBe(1);
  expect(result[0].getFullYear()).toBe(2021);
  expect(result[0].getMonth()).toBe(0);
  expect(result[0].getDate()).toBe(1);
});

test('parses >1 week date range with 1 week frequency', () => {
  const sut = new DateRangeParser();

  const startDate = new Date(2021, 0, 1);
  const endDate = new Date(2021, 0, 9);
  const result = sut.parse(startDate, endDate, Frequency.Weekly);

  expect(result.length).toBe(2);
  expect(result[0].getFullYear()).toBe(2021);
  expect(result[0].getMonth()).toBe(0);
  expect(result[0].getDate()).toBe(1);
  expect(result[1].getFullYear()).toBe(2021);
  expect(result[1].getMonth()).toBe(0);
  expect(result[1].getDate()).toBe(8);
});

test('parses >2 week date range with biweekly frequency', () => {
  const sut = new DateRangeParser();

  const startDate = new Date(2021, 0, 1);
  const endDate = new Date(2021, 0, 15);
  const result = sut.parse(startDate, endDate, Frequency.Biweekly);

  expect(result.length).toBe(2);
  expect(result[0].getFullYear()).toBe(2021);
  expect(result[0].getMonth()).toBe(0);
  expect(result[0].getDate()).toBe(1);
  expect(result[1].getFullYear()).toBe(2021);
  expect(result[1].getMonth()).toBe(0);
  expect(result[1].getDate()).toBe(15);
});