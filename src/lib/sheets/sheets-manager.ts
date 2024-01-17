/**
 * Google sheets manager
 */
import { injectable, inject } from "inversify";
import "reflect-metadata";
import { TYPES } from "@/inversify-types";
import { Credentials, OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

import Frequency from '../frequency';
import type { SheetsManagement } from './sheets-management';
import type { ScheduleData } from '../schedule-data';
import type { DateRangeParse } from './date-range-parse';
import type { Randomization } from './randomization';
import type { SheetSpecification } from './sheet-specification';
import { pairsVariance } from '@/analytics/pairs-variance';

function isValidSchedulData(scheduleData: ScheduleData): boolean {
    if (scheduleData.scheduleName
        && scheduleData.participants && (scheduleData.participants.length > 0)
        && scheduleData.startDate
        && scheduleData.endDate
        && scheduleData.groupSize
        && scheduleData.frequency) {
        return true;
    }

    return false;
}

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

    async createSpreadsheet(scheduleData: ScheduleData) {
        if (isValidSchedulData(scheduleData)) {
            const startDate = new Date(scheduleData.startDate as Date);
            const endDate = new Date(scheduleData.endDate as Date);
            const dates = this._dateRangeParser.parse(startDate, endDate, scheduleData.frequency as Frequency);
            const periods = dates.length;
            const result = this._randomizer.randomize(periods, scheduleData.groupSize as number, scheduleData.participants);
            /*
            console.log(`dates: ${JSON.stringify(dates)}`);
            for (let i = 0; i < result.schedule.length; i++) {
                const row = result.schedule[i];
                console.log(`row ${i}: ${row.map(p => p.name).join(', ')}`);
            }
            */

            if (scheduleData.participants.length > 1) {
                const variance = pairsVariance(result);
                console.log(`variance: ${variance}`);
            }

            const totalCost = scheduleData.totalCost ? scheduleData.totalCost as number : 0;
            const requestBody = {
                properties: {
                    title: scheduleData.scheduleName,
                },
                sheets: [this._sheetSpecifier.generate(dates, result, totalCost)]
            };
            const service = google.sheets({ version: 'v4', auth: this.oauth2Client as OAuth2Client });
            const spreadsheet = await service.spreadsheets.create({
                requestBody,
                fields: 'spreadsheetId,sheets(properties(sheetId))',
            }, {});

            const firstSheetId = spreadsheet.data.sheets && spreadsheet.data.sheets[0] && spreadsheet.data.sheets[0].properties
                ? spreadsheet.data.sheets[0].properties.sheetId
                : 0;

            const formatRequests = this._sheetSpecifier.addFormatting(firstSheetId as number, result);

            await service.spreadsheets.batchUpdate({
                spreadsheetId: spreadsheet.data.spreadsheetId as string,
                requestBody: {
                    requests: /*Schema$Request[]*/ formatRequests,
                },
            }, {});
            /*
                        const sheetData = await service.spreadsheets.get({
                            spreadsheetId: spreadsheet.data.spreadsheetId as string,
                            includeGridData: true,
                        }, {});

                        if (sheetData.data.sheets && sheetData.data.sheets[0]
                            && sheetData.data.sheets[0].data
                            && sheetData.data.sheets[0].data[0]
                            && sheetData.data.sheets[0].data[0].rowData
                            && sheetData.data.sheets[0].data[0].rowData[1]
                            && sheetData.data.sheets[0].data[0].rowData[1].values
                            && sheetData.data.sheets[0].data[0].rowData[1].values[0]) {
                            console.log(`{ conditionalFormats: ${JSON.stringify(sheetData.data.sheets[0].data[0].rowData[1].values[0])} }`);
                        }
            */
            return `${spreadsheet.data.spreadsheetId}`;
        }

        return '';
    }

    async deleteSpreadsheet(spreadsheetId: string) {
        if (this.oauth2Client) {
            const service = google.drive({ version: 'v3', auth: this.oauth2Client as OAuth2Client });
            await service.files.delete({
                fileId: spreadsheetId,
            });

            return true;
        }

        return false;
    }
}

export { SheetsManager };
