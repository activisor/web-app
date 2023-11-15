/**
 * Google sheets manager
 */
import { injectable, inject } from "inversify";
import "reflect-metadata";
import { Credentials, OAuth2Client } from 'google-auth-library';
import { GoogleApis, google } from 'googleapis';
import type { SheetsManagement } from './sheets-management';
import ScheduleData from '../schedule-data';
import type { Randomization } from './randomization';
import "reflect-metadata";
import { TYPES } from "@/inversify-types";


const testSheetUrl = 'https://docs.google.com/spreadsheets/d/1fH2lu_BvphQsTrUn5HnrlTTmG-gGmjgqG-9ian1BqEg/edit?usp=sharing';

@injectable()
class SheetsManager implements SheetsManagement {
    private _randomizer: Randomization;

    public constructor(@inject(TYPES.Randomization) randomizer: Randomization) {
        this._randomizer = randomizer;
    }

    // singleton
    private oauth2Client: OAuth2Client | null = null;

    getAuthUrl(scopes: string[]) {
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

        return url;
    }

    async retrieveTokens(code: string) {
        if (this.oauth2Client) {
            const { tokens } = await this.oauth2Client.getToken(code)
            this.oauth2Client.setCredentials(tokens);
        }

        return true;
    }

    setCredentials(credentials: Credentials) {
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

    async createSheet(scheduleData: ScheduleData) {
        const periods = 2;
        const result = this._randomizer.randomize(periods, scheduleData.groupSize, scheduleData.participants);
        console.log(result);
        
        const service = google.sheets({ version: 'v4', auth: this.oauth2Client as OAuth2Client });
        const requestBody = {
            properties: {
                title: scheduleData.scheduleName,
            },
        };
        const spreadsheet = await service.spreadsheets.create({
            requestBody,
            fields: 'spreadsheetId',
        }, {});

        return `https://docs.google.com/spreadsheets/d/${spreadsheet.data.spreadsheetId}/edit?usp=sharing`;
    }
}

export { SheetsManager };
