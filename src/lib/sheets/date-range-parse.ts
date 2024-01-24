/**
 * interface for parsing date range and frequency into a list of dates
 */
import Frequency from '../frequency';
import type { ScheduleDates } from '../schedule-dates';

interface DateRangeParse {
    parse: (scheduleDates: ScheduleDates) => Date[];
}

export type { DateRangeParse };