/**
 * DTO for participant after randomized schedule assignment
 */
import type { Participant } from '../participant';

interface ScheduleParticipant extends Participant {
    total: number;
}

export type { ScheduleParticipant };
