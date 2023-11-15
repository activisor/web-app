/**
 * dummy randomizer implementation to scaffold end-to-end
 */
import { injectable } from 'inversify';
import "reflect-metadata";
import { Randomization } from './randomization';
import { RandomizeResult } from './randomize-result';
import Participant from '../participant';
import ScheduleParticipant from './schedule-participant';

@injectable()
class DummyRandomizer implements Randomization {
    randomize (periods: number, groupSize: number, participants: Participant[]) {
        const resultParticipants: ScheduleParticipant[] = [];
        const schedule: Participant[][] = [];
        const result: RandomizeResult = {
            participants: resultParticipants,
            schedule: schedule
        };

        return result;
    }
}

export { DummyRandomizer };
