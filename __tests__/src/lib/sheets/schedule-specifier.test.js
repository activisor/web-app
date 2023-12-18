import {
    ScheduleSpecifier,
    getCenteredTextCellFormatRequest,
    getHeaderRowFormatRequest,
    getParticipantColumnsFormatRequest,
    getDateExpiredConditionalFormatRule,
    getTotalsConditionalFormatRule,
    RedRgb
} from '@/lib/sheets/schedule-specifier';

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
    expect(row0Values[2].userEnteredValue.numberValue).toBeTruthy();

    expect(row0Values[3].userEnteredValue).toBeTruthy();
    expect(row0Values[3].userEnteredValue.numberValue).toBeTruthy();
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

    expect(result.data[0].rowData.length).toBeGreaterThanOrEqual(5);
    const row1Values = result.data[0].rowData[1].values;

    expect(row1Values[0].userEnteredValue).toBeTruthy();
    expect(row1Values[0].userEnteredValue.stringValue).toBe(participantA.name);
    expect(row1Values[1].userEnteredValue).toBeTruthy();
    expect(row1Values[1].userEnteredValue.stringValue).toBe(participantA.email);
    expect(row1Values[2].userEnteredValue).toBeTruthy();
    expect(row1Values[2].userEnteredValue.stringValue).toMatch(/[xX]/);
    expect(row1Values[3].userEnteredValue.stringValue).toBeFalsy();
    expect(row1Values[4].userEnteredValue.formulaValue).toBe('=COUNTIF(C2:D2, "X")');

    const row2Values = result.data[0].rowData[2].values;
    expect(row2Values[0].userEnteredValue).toBeTruthy();
    expect(row2Values[0].userEnteredValue.stringValue).toBe(participantB.name);
    expect(row2Values[1].userEnteredValue).toBeTruthy();
    expect(row2Values[1].userEnteredValue.stringValue).toBe(participantB.email);
    expect(row2Values[2].userEnteredValue).toBeTruthy();
    expect(row2Values[2].userEnteredValue.stringValue).toMatch(/[xX]/);
    expect(row2Values[3].userEnteredValue).toBeTruthy();
    expect(row2Values[3].userEnteredValue.stringValue).toMatch(/[xX]/);
    expect(row2Values[4].userEnteredValue.formulaValue).toBe('=COUNTIF(C3:D3, "X")');

    const row3Values = result.data[0].rowData[3].values;
    expect(row3Values[0].userEnteredValue).toBeTruthy();
    expect(row3Values[0].userEnteredValue.stringValue).toBe(participantC.name);
    expect(row3Values[1].userEnteredValue).toBeTruthy();
    expect(row3Values[1].userEnteredValue.stringValue).toBe(participantC.email);
    expect(row3Values[2].userEnteredValue.stringValue).toBeFalsy();
    expect(row3Values[3].userEnteredValue).toBeTruthy();
    expect(row3Values[3].userEnteredValue.stringValue).toMatch(/[xX]/);
    expect(row3Values[4].userEnteredValue.formulaValue).toBe('=COUNTIF(C4:D4, "X")');

    const row4Values = result.data[0].rowData[4].values;
    expect(row4Values[0].userEnteredValue.stringValue).toBeFalsy();
    expect(row4Values[1].userEnteredValue.stringValue).toBe('Total');
    expect(row4Values[2].userEnteredValue.formulaValue).toBe('=COUNTIF(C2:C4, "X")');
    expect(row4Values[3].userEnteredValue.formulaValue).toBe('=COUNTIF(D2:D4, "X")');
    expect(row4Values[4].userEnteredValue.formulaValue).toBe('=SUM(E2:E4)');
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
    const sheetId = 0;
    const rowIndex = 4;
    const numDates = 2;
    const groupNum = 2;
    const rule /* sheets_v4.Schema$ConditionalFormatRule */ = getTotalsConditionalFormatRule(sheetId, rowIndex, numDates, groupNum);

    // rule
    expect(rule).toBeTruthy();
    expect(rule.booleanRule).toBeTruthy();
    expect(rule.booleanRule.condition).toBeTruthy();
    expect(rule.booleanRule.condition.type).toBe('NUMBER_NOT_EQ');
    expect(rule.booleanRule.condition.values).toBeTruthy();
    expect(rule.booleanRule.condition.values.length).toBe(1);
    expect(rule.booleanRule.condition.values[0]).toBeTruthy();
    expect(rule.booleanRule.condition.values[0].userEnteredValue).toBe('2');

    // range
    expect(rule.ranges).toBeTruthy();
    expect(rule.ranges.length).toBe(1);
    expect(rule.ranges[0]).toBeTruthy();
    expect(rule.ranges[0].startRowIndex).toBe(4);
    expect(rule.ranges[0].endRowIndex).toBe(5);
    expect(rule.ranges[0].startColumnIndex).toBe(2);
    expect(rule.ranges[0].endColumnIndex).toBe(4);
    expect(rule.ranges[0].sheetId).toBe(sheetId);

    // format
    expect(rule.booleanRule.format).toBeTruthy();
    expect(rule.booleanRule.format.textFormat).toBeTruthy();
    expect(rule.booleanRule.format.textFormat.foregroundColorStyle).toBeTruthy();
    expect(rule.booleanRule.format.textFormat.foregroundColorStyle.rgbColor).toEqual(RedRgb);
    expect(rule.booleanRule.format.textFormat.bold).toBeTruthy();
});

test('adds header expired conditional formatting', () => {
    const sheetId = 0;
    const rowIndex = 0;
    const numDates = 2;
    const groupNum = 2;
    const rule /* sheets_v4.Schema$ConditionalFormatRule */ = getDateExpiredConditionalFormatRule(sheetId, rowIndex, numDates, groupNum);

    // rule
    expect(rule.booleanRule).toBeTruthy();
    expect(rule.booleanRule.condition).toBeTruthy();
    expect(rule.booleanRule.condition.type).toBe('DATE_BEFORE');
    expect(rule.booleanRule.condition.values).toBeTruthy();
    expect(rule.booleanRule.condition.values.length).toBe(1);
    expect(rule.booleanRule.condition.values[0]).toBeTruthy();
    expect(rule.booleanRule.condition.values[0].relativeDate).toBe('TODAY');

    // range
    expect(rule.ranges).toBeTruthy();
    expect(rule.ranges.length).toBe(1);
    expect(rule.ranges[0]).toBeTruthy();
    expect(rule.ranges[0].startRowIndex).toBe(0);
    expect(rule.ranges[0].endRowIndex).toBe(1);
    expect(rule.ranges[0].startColumnIndex).toBe(2);
    expect(rule.ranges[0].endColumnIndex).toBe(4);
    expect(rule.ranges[0].sheetId).toBe(sheetId);

    // format backgroundColorStyle
    expect(rule.booleanRule.format).toBeTruthy();
    expect(rule.booleanRule.format.backgroundColorStyle).toBeTruthy();
    expect(rule.booleanRule.format.backgroundColorStyle.rgbColor).toBeTruthy();
//    expect(rule.booleanRule.format.backgroundColorStyle.rgbColor.red).toBe(GreyRgb.red);
//    expect(rule.booleanRule.format.backgroundColorStyle.rgbColor.green).toBe(GreyRgb.green);
//    expect(rule.booleanRule.format.backgroundColorStyle.rgbColor.blue).toBe(GreyRgb.blue);
});

test('adds center-justified cell formatting', () => {
    const sheetId = 0;
    const result /* sheets_v4.Schema$Request */ = getCenteredTextCellFormatRequest(sheetId);

    expect(result.repeatCell).toBeTruthy();
    const format = result.repeatCell;
    expect(format.range).toBeTruthy();
    expect(format.range.sheetId).toBe(sheetId);
    expect(format.range.startRowIndex).toBe(0);
    expect(format.range.startColumnIndex).toBe(2);

    expect(format.cell).toBeTruthy();
    expect(format.cell.userEnteredFormat).toBeTruthy();
    expect(format.cell.userEnteredFormat.horizontalAlignment).toBe('CENTER');
    expect(format.fields).toBe('userEnteredFormat(horizontalAlignment)');
});

test('adds header row formatting', () => {
    const sheetId = 0;
    const result /* sheets_v4.Schema$Request */ = getHeaderRowFormatRequest(sheetId, 2);

    expect(result.repeatCell).toBeTruthy();
    const format = result.repeatCell;
    expect(format.range).toBeTruthy();
    expect(format.range.sheetId).toBe(sheetId);
    expect(format.range.startRowIndex).toBe(0);
    expect(format.range.endRowIndex).toBe(1);
    expect(format.range.startColumnIndex).toBe(0);
    expect(format.range.endColumnIndex).toBe(5);

    expect(format.cell).toBeTruthy();
    expect(format.cell.userEnteredFormat).toBeTruthy();
    expect(format.cell.userEnteredFormat.numberFormat).toBeTruthy();
    expect(format.cell.userEnteredFormat.numberFormat.type).toBe('DATE');
    expect(format.cell.userEnteredFormat.numberFormat.pattern).toBe('M/d/yy');
});

test('adds participant columns formatting', () => {
    const sheetId = 0;
    const numParticipants = 3;
    const result /* sheets_v4.Schema$Request */ = getParticipantColumnsFormatRequest(sheetId, numParticipants);

    expect(result.repeatCell).toBeTruthy();
    const format = result.repeatCell;
    expect(format.range).toBeTruthy();
    expect(format.range.sheetId).toBe(sheetId);
    expect(format.range.startRowIndex).toBe(1);
    expect(format.range.endRowIndex).toBe(1 + numParticipants);
    expect(format.range.startColumnIndex).toBe(0);
    expect(format.range.endColumnIndex).toBe(2);

    expect(format.cell).toBeTruthy();
    expect(format.cell.userEnteredFormat).toBeTruthy();
    expect(format.cell.userEnteredFormat.padding).toBeTruthy();
});