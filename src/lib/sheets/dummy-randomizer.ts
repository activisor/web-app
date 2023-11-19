/**
 * dummy randomizer implementation to scaffold end-to-end
 * copies short list of participants to schedule and repeats for each period
 * to test, group size must = number of participants
 */
import { injectable } from 'inversify';
import "reflect-metadata";
import type { Randomization } from './randomization';
import type { RandomizeResult } from './randomize-result';
import type { Participant } from '../participant';
import type { ScheduleParticipant } from './schedule-participant';

@injectable()
class DummyRandomizer implements Randomization {
    randomize(periods: number, groupSize: number, participants: Participant[]) {
        const resultParticipants: ScheduleParticipant[] = [];
        const group = groupSize > participants.length ? participants.length : groupSize;
        for (let i = 0; i < group; i++) {
            resultParticipants.push({ ...participants[i], total: 0 });
        }

        const schedule: Participant[][] = [];
        for (let i = 0; i < periods; i++) {
            schedule.push(resultParticipants);
        }

        const result: RandomizeResult = {
            participants: resultParticipants,
            schedule: schedule
        };

        return result;
    }
}

export { DummyRandomizer };
