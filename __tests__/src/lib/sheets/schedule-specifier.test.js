import { ScheduleSpecifier } from '@/lib/sheets/schedule-specifier';

const dates = [
  new Date(2023, 10, 15),
  new Date(2023, 10, 22),
];

const participantMatrix = {
  participants: [
    {
      name: 'A Test',
      email: 'a@test.com',
      total: 0
    },
    {
      name: 'B Test',
      email: 'b@test.com',
      total: 0
    }
  ],
  schedule: [
    [],
    [],
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
