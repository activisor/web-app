/**
 * interface for google sheets management
 */
import { Credentials } from 'google-auth-library';
import type { ScheduleData } from '../schedule-data';

interface SheetsManagement {
    // *** For subsequent OAuth2 requests ***
    // getAuthUrl: (scopes: string[]) => string;
    // retrieveTokens: (code: string) => Promise<boolean>;

    setCredentials: (credentials: Credentials) => void;

    /**
     * create google sheet
     * @param scheduleData
     * @returns string, spreadsheet ID
     */
    createSpreadsheet: (scheduleData: ScheduleData) => Promise<string>;

    /**
     * delete spreadsheet
     * @param spreadsheetId
     * @returns boolean, true if deleted
     */
    deleteSpreadsheet: (spreadsheetId: string) => Promise<boolean>;
}

export type { SheetsManagement };