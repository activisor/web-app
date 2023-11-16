import { ScheduleSpecifier } from '@/lib/sheets/schedule-specifier';

const dates = [
  new Date(2023, 10, 15),
  new Date(2023, 10, 22),
];

const participantA = {
  name: 'A Test',
  email: 'a@test.com',
  total: 0
};
const participantB = {
  name: 'B Test',
  email: 'b@test.com',
  total: 0
};
const participantC = {
  name: 'C Test',
  email: 'c@test.com',
  total: 0
};


const participantMatrix = {
  participants: [
    participantA,
    participantB,
    participantC,
  ],
  schedule: [
    [participantA, participantB],
    [participantB, participantC],
  ]
};

const sut = new ScheduleSpecifier();

test('adds title and header row', () => {
  const result = sut.generate(dates, participantMatrix);

  expect(result.properties.title).toBe('Schedule');

  expect(result.data.length).toBeGreaterThan(0);
  const grid0 = result.data[0];
  expect(grid0.startRow).toBe(0);
  expect(grid0.startColumn).toBe(0);

  expect(grid0.rowData.length).toBeGreaterThan(0);
  const row0Values = grid0.rowData[0].values;
  expect(row0Values.length).toBeGreaterThan(0);

  expect(row0Values[0].userEnteredValue).toBeTruthy();
  expect(row0Values[0].userEnteredValue.stringValue).toBe('Name');
  expect(row0Values[1].userEnteredValue).toBeTruthy();
  expect(row0Values[1].userEnteredValue.stringValue).toBe('Email');

  expect(row0Values[2].userEnteredValue).toBeTruthy();
  expect(row0Values[2].userEnteredValue.stringValue).toBe('11/15/23');

  expect(row0Values[3].userEnteredValue).toBeTruthy();
  expect(row0Values[3].userEnteredValue.stringValue).toBe('11/22/23');
});

/**
 * expected output:
 * header row
 * [ A Test ][ a@test.com ][ x ] [   ]
 * [ B Test ][ b@test.com ][ x ] [ x ]
 * [ C Test ][ c@test.com ][   ] [ x ]
 */
test('adds participant rows', () => {
  const result = sut.generate(dates, participantMatrix);

  expect(result.data[0].rowData.length).toBeGreaterThan(3);
  const row1Values = result.data[0].rowData[1].values;

  expect(row1Values[0].userEnteredValue).toBeTruthy();
  expect(row1Values[0].userEnteredValue.stringValue).toBe(participantA.name);
  expect(row1Values[1].userEnteredValue).toBeTruthy();
  expect(row1Values[1].userEnteredValue.stringValue).toBe(participantA.email);
  expect(row1Values[2].userEnteredValue).toBeTruthy();
  expect(row1Values[2].userEnteredValue.stringValue).toMatch(/[xX]/);
  expect(row1Values[3].userEnteredValue.stringValue).not.toBeTruthy();

  const row2Values = result.data[0].rowData[2].values;
  expect(row2Values[0].userEnteredValue).toBeTruthy();
  expect(row2Values[0].userEnteredValue.stringValue).toBe(participantB.name);
  expect(row2Values[1].userEnteredValue).toBeTruthy();
  expect(row2Values[1].userEnteredValue.stringValue).toBe(participantB.email);
  expect(row2Values[2].userEnteredValue).toBeTruthy();
  expect(row2Values[2].userEnteredValue.stringValue).toMatch(/[xX]/);
  expect(row2Values[3].userEnteredValue).toBeTruthy();
  expect(row2Values[3].userEnteredValue.stringValue).toMatch(/[xX]/);

  const row3Values = result.data[0].rowData[3].values;
  expect(row3Values[0].userEnteredValue).toBeTruthy();
  expect(row3Values[0].userEnteredValue.stringValue).toBe(participantC.name);
  expect(row3Values[1].userEnteredValue).toBeTruthy();
  expect(row3Values[1].userEnteredValue.stringValue).toBe(participantC.email);
  expect(row3Values[2].userEnteredValue.stringValue).not.toBeTruthy();
  expect(row3Values[3].userEnteredValue).toBeTruthy();
  expect(row3Values[3].userEnteredValue.stringValue).toMatch(/[xX]/);
});
