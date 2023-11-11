/**
 * interface for google sheets management
 */
import { Credentials } from 'google-auth-library';
import ScheduleData from '../schedule-data';

interface SheetsManagement {
    getAuthUrl: (scopes: string[]) => string;

    retrieveTokens: (code: string) => Promise<boolean>;

    setCredentials: (credentials: Credentials) => void;

    /**
     * create google sheet
     * @param scheduleData
     * @returns string, sheet URL
     */
    createSheet: (scheduleData: ScheduleData) => Promise<string>;
}

export default SheetsManagement;