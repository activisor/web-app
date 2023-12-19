/**
 * interface for google sheets management
 */
import { Credentials } from 'google-auth-library';
import type { ScheduleData } from '../schedule-data';

interface SheetsManagement {
    getAuthUrl: (scopes: string[]) => string;

    retrieveTokens: (code: string) => Promise<boolean>;

    setCredentials: (credentials: Credentials) => void;

    /**
     * create google sheet
     * @param scheduleData
     * @returns string, sheet ID
     */
    createSheet: (scheduleData: ScheduleData) => Promise<string>;
}

export type { SheetsManagement };