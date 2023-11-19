/**
 * Google sheets manager
 */
import { injectable, inject } from "inversify";
import "reflect-metadata";
import { TYPES } from "@/inversify-types";
import { Credentials, OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import type { SheetsManagement } from './sheets-management';
import type { ScheduleData } from '../schedule-data';
import type { DateRangeParse } from './date-range-parse';
import type { Randomization } from './randomization';
import type { SheetSpecification } from './sheet-specification';
import { pairsVariance } from '@/analytics/pairs-variance';

@injectable()
class SheetsManager implements SheetsManagement {
    private _randomizer: Randomization;
    private _dateRangeParser: DateRangeParse;
    private _sheetSpecifier: SheetSpecification;

    public constructor(
        @inject(TYPES.Randomization) randomizer: Randomization,
        @inject(TYPES.DateRangeParse) dateRangeParser: DateRangeParse,
        @inject(TYPES.SheetSpecification) sheetSpecifier: SheetSpecification
    ) {
        this._randomizer = randomizer;
        this._dateRangeParser = dateRangeParser;
        this._sheetSpecifier = sheetSpecifier;
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
        const startDate = new Date(scheduleData.startDate);
        const endDate = new Date(scheduleData.endDate);
        const dates = this._dateRangeParser.parse(startDate, endDate, scheduleData.frequency);
        const periods = dates.length;
        const result = this._randomizer.randomize(periods, scheduleData.groupSize, scheduleData.participants);
        console.log(`dates: ${JSON.stringify(dates)}`);
        for (let i = 0; i < result.schedule.length; i++) {
            const row = result.schedule[i];
            console.log(`row ${i}: ${row.map(p => p.name).join(', ')}`);
        }
        const variance = pairsVariance(result);
        console.log(`variance: ${variance}`);

        const service = google.sheets({ version: 'v4', auth: this.oauth2Client as OAuth2Client });
        const requestBody = {
            properties: {
                title: scheduleData.scheduleName,
            },
            sheets: [ this._sheetSpecifier.generate(dates, result) ]
        };
        const spreadsheet = await service.spreadsheets.create({
            requestBody,
            fields: 'spreadsheetId',
        }, {});

        return `https://docs.google.com/spreadsheets/d/${spreadsheet.data.spreadsheetId}/edit?usp=sharing`;
    }
}

export { SheetsManager };
