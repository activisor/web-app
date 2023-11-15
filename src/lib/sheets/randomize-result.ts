/**
 * DTO for randomized schedule result
 */
import Participant from '../participant';
import ScheduleParticipant from './schedule-participant';


export interface RandomizeResult {
    participants: ScheduleParticipant[];
    schedule: Participant[][];
}
