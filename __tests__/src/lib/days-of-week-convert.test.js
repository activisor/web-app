import { DaysOfWeek } from '@/lib/days-of-week';
import { toArray, toDaysOfWeek } from '@/lib/days-of-week-convert';

const refArray = ['mon', 'tue', 'wed'];

test('converts array to DaysOfWeek', () => {
  const result = toDaysOfWeek(refArray);
  expect(result.sun).not.toBeTruthy();
  expect(result.mon).toBeTruthy();
  expect(result.tue).toBeTruthy();
  expect(result.wed).toBeTruthy();
  expect(result.thu).not.toBeTruthy();
  expect(result.fri).not.toBeTruthy();
  expect(result.sat).not.toBeTruthy();
});

test('converts DaysOfWeek to array', () => {
  const daysOfWeek = {
    sun: false,
    mon: true,
    tue: true,
    wed: true,
    thu: false,
    fri: false,
    sat: false
  };

  const result = toArray(daysOfWeek);
  expect(result).toEqual(refArray);
});
