/**
 * Google sheets manager
 */
import { Credentials, OAuth2Client } from 'google-auth-library';
import { GoogleApis, google } from 'googleapis';
import SheetsManagement from './sheets-management';
import ScheduleData from '../schedule-data';

export const sheetScopes = ['https://www.googleapis.com/auth/spreadsheets'];
const testSheetUrl = 'https://docs.google.com/spreadsheets/d/1fH2lu_BvphQsTrUn5HnrlTTmG-gGmjgqG-9ian1BqEg/edit?usp=sharing';

class SheetsManager implements SheetsManagement {
    // singleton
    private oauth2Client: OAuth2Client | null = null;

    getAuthUrl (scopes: string[]) {
        this.oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_SECRET,
            process.env.GOOGLE_CALLBACK_URL
        );

        const url = this.oauth2Client.generateAuthUrl({
            // 'online' (default) or 'offline' (gets refresh_token)
            access_type: 'offline',

            // If you only need one scope you can pass it as a string
            scope: scopes
          });

        return  url;
    }

    async retrieveTokens (code: string) {
        if (this.oauth2Client) {
            const {tokens} = await this.oauth2Client.getToken(code)
            this.oauth2Client.setCredentials(tokens);
        }

        return true;
    }

    setCredentials (credentials: Credentials) {
        if (!this.oauth2Client) {
            this.oauth2Client = new google.auth.OAuth2(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_SECRET,
                process.env.GOOGLE_CALLBACK_URL
            );
        }

        credentials.token_type = 'Bearer';
        this.oauth2Client.setCredentials(credentials);
    }

    async createSheet (scheduleData: ScheduleData) {
        return new Promise<string>(function(resolve, reject) {
            resolve(testSheetUrl);
          });
    }
}

export default SheetsManager;
