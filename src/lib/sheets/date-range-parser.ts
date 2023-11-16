/**
 * @module DateRangeParser
 * @description Parses a date range and frequency into an array of dates.
 */
import { injectable } from 'inversify';
import "reflect-metadata";
import type { DateRangeParse } from './date-range-parse';
import Frequency from '../frequency';

@injectable()
class DateRangeParser implements DateRangeParse {
    parse(startDate: Date, endDate: Date, frequency: Frequency): Date[] {
        const result = Array<Date>();
        result.push(startDate);

        let nextDate = this._getNextDate(startDate, frequency);
        while (nextDate <= endDate) {
            result.push(nextDate);
            nextDate = this._getNextDate(nextDate, frequency);
        }

        return result;
    }

    _getNextDate(currentDate: Date, frequency: Frequency): Date {
        const result = new Date(currentDate);
        switch (frequency) {
            case Frequency.Daily:
                result.setDate(result.getDate() + 1);
                break;
            case Frequency.Weekly:
                result.setDate(result.getDate() + 7);
                break;
            case Frequency.Biweekly:
                result.setDate(result.getDate() + 14);
                break;
            case Frequency.Monthly:
                result.setMonth(result.getMonth() + 1);
                break;
            default:
                throw new Error(`Frequency ${frequency} not supported`);
        }

        console.log(`getNextDate: ${result}`);
        return result;
    }
}

export { DateRangeParser };