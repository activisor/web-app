import { injectable } from 'inversify';
import "reflect-metadata";
import type { RandomizeResult } from './randomize-result';
import type { SheetSpecification } from './sheet-specification';

@injectable()
class ScheduleSpecifier implements SheetSpecification {
    generate(dates: Date[], participantMatrix: RandomizeResult) {
        const numDates = dates.length;

        const headerRow = {
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
        for (let i = 0; i < numDates; i++) {
            headerRow.values.push({
                userEnteredValue: {
                    stringValue: `${dates[i].toLocaleDateString('en-US', { dateStyle: 'short' })}`,
                },
            });
        }

        return {
            properties: {
                title: 'Schedule',
            },
            data: [
                {
                    startRow: 0,
                    startColumn: 0,
                    rowData: [
                        headerRow,
                    ],
                },
            ],
        };
    }
}

export { ScheduleSpecifier };