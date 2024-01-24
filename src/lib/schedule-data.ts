/**
 * DTO for schedule creation parameters
 */
import type { Participant } from './participant';
import Frequency from './frequency';
import type { ScheduleDates } from './schedule-dates';

interface ScheduleData {
    scheduleName: string;
    participants: Participant[];
    groupSize?: number;
    totalCost?: number;
    dates?: ScheduleDates;
}

export type { ScheduleData };
