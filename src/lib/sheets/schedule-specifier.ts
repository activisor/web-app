import { injectable } from 'inversify';
import "reflect-metadata";
import type { RandomizeResult } from './randomize-result';
import type { SheetSpecification } from './sheet-specification';

@injectable()
class ScheduleSpecifier implements SheetSpecification {
    generate(dates: Date[], participantMatrix: RandomizeResult) {
        //const numDates = dates.length;

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
        for (let i = 0; i < dates.length; i++) {
            headerRow.values.push({
                userEnteredValue: {
                    stringValue: `${dates[i].toLocaleDateString('en-US', { dateStyle: 'short' })}`,
                },
            });
        }

        const rowData = [ headerRow ];
        const scheduleRows = this._generateScheduleRows(participantMatrix);

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

    _generateScheduleRows(participantMatrix: RandomizeResult) {
        const result = Array<any>();
        for (let i = 0; i < participantMatrix.participants.length; i++) {
            const participant = participantMatrix.participants[i];
            const row = {
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
            for (let j = 0; j < participantMatrix.schedule.length; j++) {
                let participationKey = '';
                for (let k = 0; k < participantMatrix.schedule[j].length; k++) {
                    // console.log(JSON.stringify(participantMatrix.schedule[j][k]));
                    if (participantMatrix.schedule[j][k].email === participant.email) {
                        participationKey = 'X';
                        break;
                    }
                }

                row.values.push({
                    userEnteredValue: {
                        stringValue: participationKey,
                    },
                });
            }

            result.push(row);
        }

        return result;
    }
}

export { ScheduleSpecifier };