/**
 * interface for email notification
 */
import exp from 'constants';
import type { ScheduleData } from '../schedule-data';

interface Notification {
    /**
     * send an email notification
     * @param scheduleData
     * @returns true if successful, false otherwise
     */
    send: (scheduleData: ScheduleData, spreadsheetId: string) => Promise<boolean>;
}

export type { Notification };