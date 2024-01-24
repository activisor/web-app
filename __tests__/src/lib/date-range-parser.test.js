import { DateRangeParser, getNextDayOfWeekMatch } from '@/lib/sheets/date-range-parser';
import Frequency from '@/lib/frequency';
// import test from 'node:test';

test('day of week matches date', () => {
  const date = new Date(2023, 10, 15);

  const daysOfWeek = {
    sun: false,
    mon: false,
    tue: false,
    wed: true,
    thu: false,
    fri: false,
    sat: false
  };
  const result = getNextDayOfWeekMatch(date, daysOfWeek);
  expect(result.getFullYear()).toBe(2023);
  expect(result.getMonth()).toBe(10);
  expect(result.getDate()).toBe(15);
});

test('day of week before date', () => {
  const date = new Date(2023, 10, 15);

  const daysOfWeek = {
    sun: false,
    mon: false,
    tue: true,
    wed: false,
    thu: false,
    fri: false,
    sat: false
  };
  const result = getNextDayOfWeekMatch(date, daysOfWeek);
  expect(result.getFullYear()).toBe(2023);
  expect(result.getMonth()).toBe(10);
  expect(result.getDate()).toBe(21);
});

test('parses >1 day date range with daily frequency', () => {
  const sut = new DateRangeParser();

  const scheduleDates = {
    startDate: new Date(2021, 0, 1),
    endDate: new Date(2021, 0, 2),
    frequency: Frequency.Daily,
  }
  const result = sut.parse(scheduleDates);

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

  const scheduleDates = {
    startDate: new Date(2021, 0, 1),
    endDate: new Date(2021, 0, 7),
    frequency: Frequency.Weekly,
  }
  const result = sut.parse(scheduleDates);

  expect(result.length).toBe(1);
  expect(result[0].getFullYear()).toBe(2021);
  expect(result[0].getMonth()).toBe(0);
  expect(result[0].getDate()).toBe(1);
});

test('parses >1 week date range with 1 week frequency', () => {
  const sut = new DateRangeParser();

  const scheduleDates = {
    startDate: new Date(2023, 10, 15),
    endDate: new Date(2023, 10, 22),
    frequency: Frequency.Weekly,
  }
  const result = sut.parse(scheduleDates);

  expect(result.length).toBe(2);
  expect(result[0].getFullYear()).toBe(2023);
  expect(result[0].getMonth()).toBe(10);
  expect(result[0].getDate()).toBe(15);
  expect(result[1].getFullYear()).toBe(2023);
  expect(result[1].getMonth()).toBe(10);
  expect(result[1].getDate()).toBe(22);
});

test('parses >2 week date range with biweekly frequency', () => {
  const sut = new DateRangeParser();

  const scheduleDates = {
    startDate: new Date(2021, 0, 1),
    endDate: new Date(2021, 0, 15),
    frequency: Frequency.Biweekly,
  }
  const result = sut.parse(scheduleDates);

  expect(result.length).toBe(2);
  expect(result[0].getFullYear()).toBe(2021);
  expect(result[0].getMonth()).toBe(0);
  expect(result[0].getDate()).toBe(1);
  expect(result[1].getFullYear()).toBe(2021);
  expect(result[1].getMonth()).toBe(0);
  expect(result[1].getDate()).toBe(15);
});

test('parses >1 month date range with monthly frequency', () => {
  const sut = new DateRangeParser();

  const scheduleDates = {
    startDate: new Date(2021, 0, 1),
    endDate: new Date(2021, 1, 2),
    frequency: Frequency.Monthly,
  }
  const result = sut.parse(scheduleDates);

  expect(result.length).toBe(2);
  expect(result[0].getFullYear()).toBe(2021);
  expect(result[0].getMonth()).toBe(0);
  expect(result[0].getDate()).toBe(1);
  expect(result[1].getFullYear()).toBe(2021);
  expect(result[1].getMonth()).toBe(1);
  expect(result[1].getDate()).toBe(1);
});

test('parses >1 week with two days per week frequency', () => {
  const sut = new DateRangeParser();

  const scheduleDates = {
    startDate: new Date(2023, 10, 15),
    endDate: new Date(2023, 10, 22),
    frequency: Frequency.DaysOfWeek,
    daysOfWeek: {
      sun: true,
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: true
    }
  }
  const result = sut.parse(scheduleDates);

  expect(result.length).toBe(2);
  expect(result[0].getFullYear()).toBe(2023);
  expect(result[0].getMonth()).toBe(10);
  expect(result[0].getDate()).toBe(18);

  expect(result[1].getFullYear()).toBe(2023);
  expect(result[1].getMonth()).toBe(10);
  expect(result[1].getDate()).toBe(19);
});
