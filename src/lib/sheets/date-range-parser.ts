/**
 * @module DateRangeParser
 * @description Parses a date range and frequency into an array of dates.
 */
import { injectable } from 'inversify';
import "reflect-metadata";
import type { DateRangeParse } from './date-range-parse';
import Frequency from '../frequency';
import type { ScheduleDates } from '../schedule-dates';
import type { DaysOfWeek } from '../days-of-week';

/**
 * Increment through days of week array starting at dayOfWeek until true is found, handling wrap around.
 * @param date
 * @param daysOfWeek
 * @returns
 */
function getNextDayOfWeekMatch(date: Date, daysOfWeek: DaysOfWeek): Date {
    const daysOfWeekArray = Object.values(daysOfWeek);
    const dayOfWeek = date.getDay();

    let i = 0;
    const weekLength = 7
    while (i < 2 * weekLength) {
        if ((i >= dayOfWeek) && (daysOfWeekArray[i % weekLength] === true)) {
            if (i === dayOfWeek) {
                break; // date is already a day of week match;
            }

            date.setDate(date.getDate() + i - dayOfWeek);
            break;
        }

        i++;
    }

    return date;
}

function getNextDate(currentDate: Date, frequency: Frequency, daysOfWeek: DaysOfWeek): Date {
        let result = new Date(currentDate);
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
            case Frequency.DaysOfWeek:
                // increment by one day
                result.setDate(result.getDate() + 1);
                result = getNextDayOfWeekMatch(result, daysOfWeek);
                break;
            default:
                throw new Error(`Frequency ${frequency} not supported`);
        }

        return result;
    }

function getStartDate(scheduleDates: ScheduleDates): Date {
    const calcStartDate = scheduleDates.frequency === Frequency.DaysOfWeek;
    if (calcStartDate) {
        return getNextDayOfWeekMatch(scheduleDates.startDate, scheduleDates.daysOfWeek);
    }

    return scheduleDates.startDate;
}

@injectable()
class DateRangeParser implements DateRangeParse {
    parse(scheduleDates: ScheduleDates): Date[] {
        const result = Array<Date>();
        let nextDate = getStartDate(scheduleDates);

        while (nextDate <= scheduleDates.endDate) {
            result.push(nextDate);
            nextDate = getNextDate(nextDate, scheduleDates.frequency, scheduleDates.daysOfWeek);
        }

        return result;
    }
}

export { DateRangeParser, getNextDayOfWeekMatch };