/**
 * @module DateRangeParser
 * @description Parses a date range and frequency into an array of dates.
 */
import type { DateRangeParse } from './date-range-parse';
import Frequency from '../frequency';

class DateRangeParser implements DateRangeParse {
    parse(startDate: Date, endDate: Date, frequency: Frequency): Date[] {
        const result = Array<Date>();
        result.push(startDate);

        let nextDate = this.getNextDate(startDate, frequency);
        while (nextDate <= endDate) {
            result.push(nextDate);
            nextDate = this.getNextDate(nextDate, frequency);
        }

        return result;
    }

    getNextDate(currentDate: Date, frequency: Frequency): Date {
        const result = new Date(currentDate);
        switch (frequency) {
            case Frequency.Daily:
                // result.setDate(result.getDate() + 1);
                break;
            case Frequency.Weekly:
                result.setDate(result.getDate() + 7);
                break;
            case Frequency.Biweekly:
                // result.setDate(result.getDate() + 14);
                break;
            case Frequency.Monthly:
                // result.setMonth(result.getMonth() + 1);
                break;
        }

        return result;
    }
}

export { DateRangeParser };