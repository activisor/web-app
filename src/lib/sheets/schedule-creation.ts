/**
 * interface for schedule creation
 */
import type { ScheduleData } from '../schedule-data';
import type { ScheduleResult } from './schedule-result';

interface ScheduleCreation {
    create: (scheduleData: ScheduleData) => ScheduleResult;
}

export type { ScheduleCreation };