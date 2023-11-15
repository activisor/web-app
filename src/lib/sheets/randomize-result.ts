/**
 * DTO for randomized schedule result
 */
import Participant from '../participant';
import type { ScheduleParticipant } from './schedule-participant';

interface RandomizeResult {
    // roster
    participants: ScheduleParticipant[];
    
    // first dimension is period, second dimension is group
    schedule: Participant[][];
}

export type { RandomizeResult };
