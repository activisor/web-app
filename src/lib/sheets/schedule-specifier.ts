import { injectable } from 'inversify';
import "reflect-metadata";
import { sheets_v4 } from 'googleapis';
import type { RandomizeResult } from './randomize-result';
import type { SheetSpecification } from './sheet-specification';
import { toExcelDate } from './to-excel-date';
import { toA1Notation } from '../a1-notation';

// marks particpant's spot on schedule
const SCHEDULE_MARKER = 'X';
const COLUMN_OFFSET = 2; // name, email

const DefaultColor = {
    red: 1.0,
    green: 1.0,
    blue: 1.0,
    alpha: 1.0
};

// '#BBDEFB', light blue 100
const ThemePrimaryLightRgb = {
    red: 187 / 255,
    green: 222 / 255,
    blue: 251 / 255,
    alpha: 1.0
};

// '#2194F3', blue 500
const ThemePrimaryMainRgb = {
    red: 33 / 255,
    green: 148 / 255,
    blue: 243 / 255,
    alpha: 1.0
};

// '#1769AA', dark blue
const ThemePrimaryDarkRgb = {
    red: 26 / 255,
    green: 117 / 255,
    blue: 210 / 255,
    alpha: 1.0
};

// '#FFAC33', light orange
const ThemeSecondaryLightRgb = {
    red: 255 / 255,
    green: 224 / 255,
    blue: 178 / 255,
    alpha: 1.0
};

// '#B26A00', dark orange
const ThemeSecondaryDarkRgb = {
    red: 245 / 255,
    green: 125 / 255,
    blue: 0 / 255,
    alpha: 1.0
};

// google sheet palette color "dark grey 2", #999999
const DarkGrey2Rgb = {
    red: 153 / 255,
    green: 153 / 255,
    blue: 153 / 255,
    alpha: 1.0
};

const RedRgb = {
    red: 1.0,
    green: 0.0,
    blue: 0.0,
    alpha: 1.0
};

// google sheet palette color "light grey 1", #D9D9D9
const LightGrey1Rgb = {
    red: 217 / 255,
    green: 217 / 255,
    blue: 217 / 255,
    alpha: 1.0
};


// google sheet palette color "light grey 2", #EFEFEF
const LightGrey2Rgb = {
    red: 239 / 255,
    green: 239 / 255,
    blue: 239 / 255,
    alpha: 1.0
};

// google sheet palette color "light grey 3", #F3F3F3
const LightGrey3Rgb = {
    red: 243 / 255,
    green: 243 / 255,
    blue: 243 / 255,
    alpha: 1.0
};

type Cell = {
    row: number;    // 0 based
    column: number; // 0 based
};

function getNumDates(participantMatrix: RandomizeResult): number {
    if (participantMatrix.schedule.length === 0) {
        throw new Error('participantMatrix.schedule.length is 0');
    }

    return participantMatrix.schedule.length;
}

function getTotalsFormula(first: Cell, last: Cell): string {
    const firstCellLocation = toA1Notation(first.row, first.column);
    const lastCellLocation = toA1Notation(last.row, last.column);

    return `=COUNTIF(${firstCellLocation}:${lastCellLocation}, "${SCHEDULE_MARKER}")`;
}

function getSumFormula(first: Cell, last: Cell): string {
    const firstCellLocation = toA1Notation(first.row, first.column);
    const lastCellLocation = toA1Notation(last.row, last.column);

    return `=SUM(${firstCellLocation}:${lastCellLocation})`;
}

function getTotalsConditionalFormatRule(sheetId: number, rowIndex: number, numDates: number, groupNum: number): sheets_v4.Schema$ConditionalFormatRule {
    return {
        ranges: [
            {
                startRowIndex: rowIndex,
                endRowIndex: rowIndex + 1,
                startColumnIndex: COLUMN_OFFSET,
                endColumnIndex: COLUMN_OFFSET + numDates,
                sheetId,
            },
        ],
        booleanRule: {
            condition: {
                type: 'NUMBER_NOT_EQ',
                values: [
                    {
                        userEnteredValue: `${groupNum}`,
                    },
                ],
            },
            format: {
                textFormat: {
                    foregroundColorStyle:{
                        rgbColor: RedRgb
                    },
                    bold: true,
                },
            },
        },
    };
}

function getDateExpiredConditionalFormatRule(sheetId: number, rowIndex: number, numDates: number): sheets_v4.Schema$ConditionalFormatRule {
    return {
        ranges: [
            {
                startRowIndex: rowIndex,
                endRowIndex: rowIndex + 1,
                startColumnIndex: COLUMN_OFFSET,
                endColumnIndex: COLUMN_OFFSET + numDates,
                sheetId,
            },
        ],
        booleanRule: {
            condition: {
                type: 'DATE_BEFORE',
                values: [
                    {
                        relativeDate: 'TODAY',
                    },
                ],
            },
            format: {
                backgroundColorStyle: {
                    rgbColor: LightGrey2Rgb
                },
                textFormat: {
                    foregroundColorStyle:{
                        rgbColor: DarkGrey2Rgb
                    },
                },
            },
        },
    };
}

function getDatePendingConditionalFormatRule(sheetId: number, rowIndex: number, numDates: number): sheets_v4.Schema$ConditionalFormatRule {
    return {
        ranges: [
            {
                startRowIndex: rowIndex,
                endRowIndex: rowIndex + 1,
                startColumnIndex: COLUMN_OFFSET,
                endColumnIndex: COLUMN_OFFSET + numDates,
                sheetId,
            },
        ],
        booleanRule: {
            condition: {
                type: 'DATE_AFTER',
                values: [
                    {
                        relativeDate: 'YESTERDAY',
                    },
                ],
            },
            format: {
                backgroundColorStyle: {
                    rgbColor: ThemePrimaryLightRgb
                } ,
            },
        },
    };
}

function getCenteredTextCellFormatRequest(sheetId: number): sheets_v4.Schema$Request {
    return {
        repeatCell: {
            range: {
                sheetId: sheetId as number,
                startRowIndex: 0,
                //                endRowIndex: 1000,
                startColumnIndex: 2,
                //                endColumnIndex: 16384,
            },
            cell: {
                userEnteredFormat: {
                    horizontalAlignment: 'CENTER',
                },
            },
            fields: 'userEnteredFormat(horizontalAlignment)',
        },
    };
}

function getAutoResizeDimensionsRequest(sheetId: number): sheets_v4.Schema$Request {
    return {
        autoResizeDimensions: {
            dimensions: {
                sheetId: sheetId as number,
                dimension: 'COLUMNS',
                startIndex: 0,
            },
        },
    };
}

function getHeaderRowFormatRequest(sheetId: number, numDates: number): sheets_v4.Schema$Request {
    return {
        repeatCell: {
            range: {
                sheetId: sheetId as number,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: COLUMN_OFFSET + numDates + 1,
            },
            cell: {
                userEnteredFormat: {
                    borders: {
                        bottom: {
                            style: 'SOLID',
                            width: 1,
                        },
                    },
                    padding: {
                        top: 4,
                        right: 4,
                        bottom: 4,
                        left: 4,
                    },
                    numberFormat: {
                        type: 'DATE',
                        pattern: 'M/d/yy',
                    },
                },
            },
            fields: 'userEnteredFormat(borders, padding, numberFormat)',
        },
    };
}

function getHeaderDatesDimensionRequest(sheetId: number, numDates: number): sheets_v4.Schema$Request {
    return {
        updateDimensionProperties: {
            range: {
                sheetId: sheetId as number,
                dimension: 'COLUMNS',
                startIndex: COLUMN_OFFSET,
                endIndex: COLUMN_OFFSET + numDates + 1,
            },
            properties: {
                pixelSize: 62,
            },
            fields: 'pixelSize',
        },
    };
}

function getBandingFormatRequest(sheetId: number, numDates: number, numParticipants: number): sheets_v4.Schema$Request {
    return {
        addBanding: {
            bandedRange: {
                range: {
                    sheetId: sheetId as number,
                    startRowIndex: 1,
                    endRowIndex: numParticipants + 1,
                    startColumnIndex: 0,
                    endColumnIndex: COLUMN_OFFSET + numDates + 1,
                },
                rowProperties: {
                    firstBandColorStyle: {
                        rgbColor: DefaultColor
                    },
                    secondBandColorStyle: {
                        rgbColor: LightGrey3Rgb
                    },
                },
            },
        },
    };
}

function getTotalsRowFormatRequest(sheetId: number, numDates: number, numParticipants: number): sheets_v4.Schema$Request {
    return {
        repeatCell: {
            range: {
                sheetId: sheetId as number,
                startRowIndex: numParticipants + 1,
                endRowIndex: numParticipants + 2,
                startColumnIndex: 0,
                endColumnIndex: COLUMN_OFFSET + numDates + 1,
            },
            cell: {
                userEnteredFormat: {
                    borders: {
                        top: {
                            style: 'SOLID',
                            width: 1,
                        },
                    },
                    padding: {
                        top: 4,
                        right: 4,
                        bottom: 4,
                        left: 4,
                    },
                },
            },
            fields: 'userEnteredFormat(borders, padding)',
        },
    };
}

function getParticipantColumnsFormatRequest(sheetId: number, numParticipants: number): sheets_v4.Schema$Request {
    return {
        repeatCell: {
            range: {
                sheetId: sheetId as number,
                startRowIndex: 1,
                endRowIndex: numParticipants + 1,
                startColumnIndex: 0,
                endColumnIndex: COLUMN_OFFSET,
            },
            cell: {
                userEnteredFormat: {
                    padding: {
                        // top: 4,
                        right: 8,
                        // bottom: 4,
                        left: 8,
                    },
                },
            },
            fields: 'userEnteredFormat(padding)',
        },
    };
}

function getHeaderRow(dates: Date[]): sheets_v4.Schema$RowData {
    const headerRow: sheets_v4.Schema$RowData = {
        values: [
            {
                userEnteredValue: {
                    stringValue: 'Name',
                },
                userEnteredFormat: {
                    backgroundColorStyle: {
                        rgbColor: ThemeSecondaryLightRgb
                    },
                }
            },
            {
                userEnteredValue: {
                    stringValue: 'Email',
                },
                userEnteredFormat: {
                    backgroundColorStyle: {
                        rgbColor: ThemeSecondaryLightRgb
                    },
                }
            },
        ],
    };

    if (headerRow.values === undefined) {
        throw new Error('headerRow.values is undefined');
    }

    for (let i = 0; i < dates.length; i++) {
        headerRow.values.push({
            userEnteredValue: {
                numberValue: toExcelDate(dates[i]),

            },
        });
    }
    headerRow.values.push({
        userEnteredValue: {
            stringValue: 'Total',
        },
        userEnteredFormat: {
            backgroundColorStyle: {
                rgbColor: ThemeSecondaryLightRgb
            },
        }
    });

    return headerRow;
}

function getTotalsRow(numParticipants: number, numDates: number, rowOffset: number): sheets_v4.Schema$RowData {
    const row: sheets_v4.Schema$RowData = {
        values: [
            {
                userEnteredValue: {
                    stringValue: '',
                },
            },
            {
                userEnteredValue: {
                    stringValue: 'Total',
                },
                userEnteredFormat: {
                    backgroundColorStyle: {
                        rgbColor: ThemeSecondaryLightRgb
                    },
                }
            },
        ],
    };

    if (row.values === undefined) {
        throw new Error('row.values is undefined');
    }

    for (let i = 0; i <= numDates; i++) {
        const firstCell = {
            row: rowOffset,
            column: COLUMN_OFFSET + i,
        };
        const lastCell = {
            row: rowOffset + numParticipants - 1,
            column: COLUMN_OFFSET + i,
        };

        if (i < numDates) {
            row.values.push({
                userEnteredValue: {
                    formulaValue: getTotalsFormula(firstCell, lastCell),
                },
            });
        } else {
            row.values.push({
                userEnteredValue: {
                    formulaValue: getSumFormula(firstCell, lastCell),
                },
            });
        }
    }

    return row;
}

function getBlankRow(): sheets_v4.Schema$RowData {
    const row: sheets_v4.Schema$RowData = {
        values: [
            {
                userEnteredValue: {
                    stringValue: '',
                },
            },
        ],
    };

    return row;
}

function getBrandingRow(): sheets_v4.Schema$RowData {
    const url = 'https://activisor.com';
    const row: sheets_v4.Schema$RowData = {
        values: [
            {
                userEnteredValue: {
                    stringValue: 'created using',
                },
                userEnteredFormat: {
                    textFormat: {
                        foregroundColorStyle:{
                            rgbColor: ThemeSecondaryDarkRgb
                        },
                    },
                },
            },
            {
                userEnteredValue: {
                    formulaValue: `=HYPERLINK("${url}", "Activisor")`,
                },
                userEnteredFormat: {
                    textFormat: {
                        foregroundColorStyle:{
                            rgbColor: ThemePrimaryMainRgb
                        },
                    },
                },
            },
        ],
    };

    return row;
}

@injectable()
class ScheduleSpecifier implements SheetSpecification {
    generate(dates: Date[], participantMatrix: RandomizeResult): sheets_v4.Schema$Sheet {
        const headerRow: sheets_v4.Schema$RowData = getHeaderRow(dates);
        const rowData = [headerRow];
        const rowOffset = rowData.length;

        const scheduleRows = this._generateScheduleRows(participantMatrix, rowOffset);

        return {
            properties: {
                title: 'Schedule',
            },
            data: [
                {
                    startRow: 0,
                    startColumn: 0,
                    rowData: rowData.concat(scheduleRows)
                },
            ],
        };
    }

    addFormatting(sheetId: number, participantMatrix: RandomizeResult): sheets_v4.Schema$Request[] {
        const result = [
            ...this._addConditionalFormatting(sheetId, participantMatrix),
            ...this._addStaticFormatting(sheetId, participantMatrix),
        ];

        return result;
    }

    _addConditionalFormatting(sheetId: number, participantMatrix: RandomizeResult): sheets_v4.Schema$Request[] {
        const numDates = getNumDates(participantMatrix);
        const totalsConditionalFormatRowIndex = 1 + participantMatrix.participants.length;
        const groupSize = participantMatrix.schedule[0].length;
        const totalsConditionalFormat = getTotalsConditionalFormatRule(sheetId, totalsConditionalFormatRowIndex, numDates, groupSize);
        const dateExpiredConditionalFormat = getDateExpiredConditionalFormatRule(sheetId, 0, numDates);
        const datePendingConditionalFormat = getDatePendingConditionalFormatRule(sheetId, 0, numDates);

        const result: sheets_v4.Schema$Request[] = [
            {
                addConditionalFormatRule: {
                    rule: totalsConditionalFormat,
                    index: 0,
                },
            },
            {
                addConditionalFormatRule: {
                    rule: datePendingConditionalFormat,
                    index: 1,
                },
            },
            {
                addConditionalFormatRule: {
                    rule: dateExpiredConditionalFormat,
                    index: 2,
                },
            },
        ];

        return result;
    }

    _addStaticFormatting(sheetId: number, participantMatrix: RandomizeResult): sheets_v4.Schema$Request[] {
        const numDates = getNumDates(participantMatrix);
        const numParticipants = participantMatrix.participants.length;

        const result = [
            getAutoResizeDimensionsRequest(sheetId),
            getCenteredTextCellFormatRequest(sheetId),
            getHeaderRowFormatRequest(sheetId, numDates),
            // getHeaderTotalFormatRequest(sheetId, numDates),
            getHeaderDatesDimensionRequest(sheetId, numDates),
            getParticipantColumnsFormatRequest(sheetId, numParticipants),
            getTotalsRowFormatRequest(sheetId, numDates, numParticipants),
            // getDailyTotalFormatRequest(sheetId, numParticipants),
            getBandingFormatRequest(sheetId, numDates, numParticipants),
        ];

        return result;
    }

    _generateScheduleRows(participantMatrix: RandomizeResult, rowOffset: number): sheets_v4.Schema$RowData[] {
        const result = Array<sheets_v4.Schema$RowData>();
        const numDates = getNumDates(participantMatrix);

        const groupSize = participantMatrix.schedule[0].length;

        for (let i = 0; i < participantMatrix.participants.length; i++) {
            const participant = participantMatrix.participants[i];
            const row: sheets_v4.Schema$RowData = {
                values: [
                    {
                        userEnteredValue: {
                            stringValue: participant.name,
                        },
                    },
                    {
                        userEnteredValue: {
                            stringValue: participant.email,
                        },
                    },
                ],
            };

            if (row.values === undefined) {
                throw new Error('row.values is undefined');
            }

            for (let j = 0; j < numDates; j++) {
                let participationKey = '';
                for (let k = 0; k < groupSize; k++) {
                    if (participantMatrix.schedule[j][k].email === participant.email) {
                        participationKey = SCHEDULE_MARKER;
                        break;
                    }
                }

                row.values.push({
                    userEnteredValue: {
                        stringValue: participationKey,
                    },
                });
            }

            // add total events sum formula to row
            const firstCell = {
                row: rowOffset + i,
                column: COLUMN_OFFSET,
            };
            const lastCell = {
                row: rowOffset + i,
                column: COLUMN_OFFSET + numDates - 1,
            };
            row.values.push({
                userEnteredValue: {
                    formulaValue: getTotalsFormula(firstCell, lastCell),
                },
            });

            result.push(row);
        }

        const totalsRow = getTotalsRow(participantMatrix.participants.length, numDates, rowOffset);
        result.push(totalsRow);

        const blankRow = getBlankRow();
        result.push(blankRow);
        result.push(blankRow);
        const brandingRow = getBrandingRow();
        result.push(brandingRow);

        return result;
    }
}

export {
    ScheduleSpecifier,
    getCenteredTextCellFormatRequest,
    getHeaderRowFormatRequest,
    getParticipantColumnsFormatRequest,
    getDateExpiredConditionalFormatRule,
    getTotalsConditionalFormatRule,
    RedRgb
};