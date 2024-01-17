/**
 * DTO for schedule creation parameters
 */
import type { Participant } from './participant';
import Frequency from './frequency';

interface ScheduleData {
    scheduleName: string;
    participants: Participant[];
    startDate?: Date;
    endDate?: Date;
    groupSize?: number;
    frequency?: Frequency;
    totalCost?: number;
}

export type { ScheduleData };
