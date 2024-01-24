/**
 * DTO for schedule creation date parameters
 */
import Frequency from './frequency';
import type { DaysOfWeek } from './days-of-week';

interface ScheduleDates {
    startDate: Date;
    endDate: Date;
    frequency: Frequency;
    daysOfWeek: DaysOfWeek;
}

export type { ScheduleDates };
