import { toDaysArray, toDaysOfWeek, orderedDaysArray } from '@/lib/days-of-week-convert';

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
  // ref @/lib/days-of-week
  const daysOfWeek = {
    sun: false,
    mon: true,
    tue: true,
    wed: true,
    thu: false,
    fri: false,
    sat: false
  };

  const result = toDaysArray(daysOfWeek);
  expect(result).toEqual(refArray);
});


test('create full ordered array', () => {
  const result = orderedDaysArray();
  expect(result.length).toEqual(7);
  expect(result[0]).toEqual('sun');
  expect(result[1]).toEqual('mon');
  expect(result[2]).toEqual('tue');
  expect(result[3]).toEqual('wed');
  expect(result[4]).toEqual('thu');
  expect(result[5]).toEqual('fri');
  expect(result[6]).toEqual('sat');
});
