import { injectable } from 'inversify';
import "reflect-metadata";
import { sheets_v4 } from 'googleapis';
import type { RandomizeResult } from './randomize-result';
import type { SheetSpecification } from './sheet-specification';
import { toA1Notation } from '../a1-notation';

// marks particpant's spot on schedule
const SCHEDULE_MARKER = 'X';
const COLUMN_OFFSET = 2; // name, email

// google sheet palette color "light green 3", #D9EAD3
const HeaderColor = {
    red: 217 / 255,
    green: 234 / 255,
    blue: 211 / 255,
    alpha: 1.0
};

// google sheet palette color "dark grey 2", #999999
const HeaderExpiredColor = {
    red: 153 / 255,
    green: 153 / 255,
    blue: 153 / 255,
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
                    foregroundColor: {
                        red: 1.0,
                        green: 0.0,
                        blue: 0.0,
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
                backgroundColor: HeaderExpiredColor,
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
                        relativeDate: 'TODAY',
                    },
                ],
            },
            format: {
                backgroundColor: HeaderColor,
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

function getHeaderRowsFormatRequest(sheetId: number, numDates: number): sheets_v4.Schema$Request {
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
                    backgroundColor: HeaderColor,
                },
            },
            fields: 'userEnteredFormat(backgroundColor)',
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
            },
            {
                userEnteredValue: {
                    stringValue: 'Email',
                },
            },
        ],
    };

    if (headerRow.values === undefined) {
        throw new Error('headerRow.values is undefined');
    }

    for (let i = 0; i < dates.length; i++) {
        headerRow.values.push({
            userEnteredValue: {
                stringValue: `${dates[i].toLocaleDateString('en-US', { dateStyle: 'short' })}`,
            },
        });
    }
    headerRow.values.push({
        userEnteredValue: {
            stringValue: 'Total',
        },
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
            ...this._addCellFormatting(sheetId, participantMatrix)
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
                    rule: dateExpiredConditionalFormat,
                    index: 1,
                },
            },
            {
                addConditionalFormatRule: {
                    rule: datePendingConditionalFormat,
                    index: 2,
                },
            },
        ];

        return result;
    }

    _addCellFormatting(sheetId: number, participantMatrix: RandomizeResult): sheets_v4.Schema$Request[] {
        const numDates = getNumDates(participantMatrix);

        const result = [
            getCenteredTextCellFormatRequest(sheetId),
            // getHeaderRowsFormatRequest(sheetId, numDates),
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

        return result;
    }
}

export {
    ScheduleSpecifier,
    getCenteredTextCellFormatRequest,
    getHeaderRowsFormatRequest,
    getDateExpiredConditionalFormatRule,
    getTotalsConditionalFormatRule,
    HeaderColor,
    HeaderExpiredColor,
};