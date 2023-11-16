/**
 * interface for parsing date range and frequency into a list of dates
 */
import Frequency from '../frequency';

interface DateRangeParse {
    parse: (startDate: Date, endDate: Date, frequency: Frequency) => Date[];
}

export type { DateRangeParse };