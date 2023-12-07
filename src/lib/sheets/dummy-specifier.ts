/**
 * generates dummy sheet specification to scaffold end-to-end
 */
import { injectable } from 'inversify';
import "reflect-metadata";
import { sheets_v4 } from 'googleapis';
import type { RandomizeResult } from './randomize-result';
import type { SheetSpecification } from './sheet-specification';

@injectable()
class DummySpecifier implements SheetSpecification {
    generate(dates: Date[], participantMatrix: RandomizeResult) {
        return {
            properties: {
                title: 'Schedule',
            },
            data: [
                {
                    startRow: 0,
                    startColumn: 0,
                    rowData: [
                        {
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
                                {
                                    userEnteredValue: {
                                        stringValue: `${dates[0].toLocaleDateString()}`,
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        };
    }

    addConditionalFormatting(sheetId: number, participantMatrix: RandomizeResult): sheets_v4.Schema$Request[] {
        return Array<sheets_v4.Schema$Request>();
    }
}

export { DummySpecifier };