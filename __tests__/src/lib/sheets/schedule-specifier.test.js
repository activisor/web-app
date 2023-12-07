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
 * expected output: sheets_v4.Schema$Sheet
 * [ header row... ]
 * [ A Test ] [ a@test.com ] [ x ]         [   ]         [=COUNTIF(C2:D2, "x"]
 * [ B Test ] [ b@test.com ] [ x ]         [ x ]         [=COUNTIF(C3:D3, "x")]
 * [ C Test ] [ c@test.com ] [   ]         [ x ]         [=COUNTIF(C4:D4, "x")]
 * [        ] [ Total      ] [=SUM(C2:C4)] [=SUM(D2:D4)] [=SUM(E2:E4)]
 */
test('adds participant rows and totals', () => {
  const result = sut.generate(dates, participantMatrix);

  expect(result.data[0].rowData.length).toBe(5);
  const row1Values = result.data[0].rowData[1].values;

  expect(row1Values[0].userEnteredValue).toBeTruthy();
  expect(row1Values[0].userEnteredValue.stringValue).toBe(participantA.name);
  expect(row1Values[1].userEnteredValue).toBeTruthy();
  expect(row1Values[1].userEnteredValue.stringValue).toBe(participantA.email);
  expect(row1Values[2].userEnteredValue).toBeTruthy();
  expect(row1Values[2].userEnteredValue.stringValue).toMatch(/[xX]/);
  expect(row1Values[3].userEnteredValue.stringValue).toBeFalsy();
  expect(row1Values[4].userEnteredValue.formulaValue ).toBe('=COUNTIF(C2:D2, "X")');

  const row2Values = result.data[0].rowData[2].values;
  expect(row2Values[0].userEnteredValue).toBeTruthy();
  expect(row2Values[0].userEnteredValue.stringValue).toBe(participantB.name);
  expect(row2Values[1].userEnteredValue).toBeTruthy();
  expect(row2Values[1].userEnteredValue.stringValue).toBe(participantB.email);
  expect(row2Values[2].userEnteredValue).toBeTruthy();
  expect(row2Values[2].userEnteredValue.stringValue).toMatch(/[xX]/);
  expect(row2Values[3].userEnteredValue).toBeTruthy();
  expect(row2Values[3].userEnteredValue.stringValue).toMatch(/[xX]/);
  expect(row2Values[4].userEnteredValue.formulaValue ).toBe('=COUNTIF(C3:D3, "X")');

  const row3Values = result.data[0].rowData[3].values;
  expect(row3Values[0].userEnteredValue).toBeTruthy();
  expect(row3Values[0].userEnteredValue.stringValue).toBe(participantC.name);
  expect(row3Values[1].userEnteredValue).toBeTruthy();
  expect(row3Values[1].userEnteredValue.stringValue).toBe(participantC.email);
  expect(row3Values[2].userEnteredValue.stringValue).toBeFalsy();
  expect(row3Values[3].userEnteredValue).toBeTruthy();
  expect(row3Values[3].userEnteredValue.stringValue).toMatch(/[xX]/);
  expect(row3Values[4].userEnteredValue.formulaValue ).toBe('=COUNTIF(C4:D4, "X")');

  const row4Values = result.data[0].rowData[4].values;
  expect(row4Values[0].userEnteredValue.stringValue).toBeFalsy();
  expect(row4Values[1].userEnteredValue.stringValue).toBe('Total');
  expect(row4Values[2].userEnteredValue.formulaValue ).toBe('=COUNTIF(C2:C4, "X")');
  expect(row4Values[3].userEnteredValue.formulaValue ).toBe('=COUNTIF(D2:D4, "X")');
  expect(row4Values[4].userEnteredValue.formulaValue ).toBe('=SUM(E2:E4)');
});

/**
 * ref: https://developers.google.com/sheets/api/guides/conditional-format
 *      https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/other#ConditionType
 *
 * expected result: sheets_v4.Schema$Sheet.
 *     conditionalFormats?: Schema$ConditionalFormatRule[]
 *
 *     conditionalFormats: [
 *        {
 *           booleanRule: Schema$BooleanRule
 *           ranges: Schema$GridRange[] [
 *             {
 *               sheetId?: 0,
 *               startRowIndex: 1,
 *               endRowIndex: 4,
 *               startColumnIndex: 2,
 *               endColumnIndex: 3,
 *             }
 *    ]
 *
 *    Schema$BooleanRule {
 *      condition: Schema$BooleanCondition
 *      format: Schema$CellFormat
 *   }
 *
 */
test('adds event total conditional formatting', () => {
  const result = sut.generate(dates, participantMatrix);
  expect(result.conditionalFormats).toBeTruthy();
  expect(result.conditionalFormats.length).toBe(1);

  const format = result.conditionalFormats[0];

  // rule
  expect(format.booleanRule).toBeTruthy();
  expect(format.booleanRule.condition).toBeTruthy();
  expect(format.booleanRule.condition.type).toBe('CUSTOM_FORMULA');
  expect(format.booleanRule.condition.values).toBeTruthy();
  expect(format.booleanRule.condition.values.length).toBe(1);
  expect(format.booleanRule.condition.values[0]).toBeTruthy();
  expect(format.booleanRule.condition.values[0].userEnteredValue).toBe('=NUMBER_NOT_EQ(2)');

  // range
  expect(format.ranges).toBeTruthy();
  expect(format.ranges.length).toBe(1);
  expect(format.ranges[0]).toBeTruthy();
  expect(format.ranges[0].startRowIndex).toBe(4);
  expect(format.ranges[0].endRowIndex).toBe(4);
  expect(format.ranges[0].startColumnIndex).toBe(2);
  expect(format.ranges[0].endColumnIndex).toBe(3);

  // format
  expect(format.booleanRule.format).toBeTruthy();
  expect(format.booleanRule.format.textFormat).toBeTruthy();
  expect(format.booleanRule.format.textFormat.foregroundColor).toBeTruthy();
  expect(format.booleanRule.format.textFormat.foregroundColor.red).toBe(1);
  expect(format.booleanRule.format.textFormat.bold).toBeTruthy();
});
