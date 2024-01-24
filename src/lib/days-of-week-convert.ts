/**
 * conversions between string arrays and DaysOfWeek
 */

import exp from 'constants';
import type { DaysOfWeek } from './days-of-week';

function toDaysOfWeek(days: string[]): DaysOfWeek {
    const daysOfWeek: DaysOfWeek = {
        sun: false,
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: false
    };

    days.forEach((day) => {
        switch (day) {
            case 'sun':
                daysOfWeek.sun = true;
                break;
            case 'mon':
                daysOfWeek.mon = true;
                break;
            case 'tue':
                daysOfWeek.tue = true;
                break;
            case 'wed':
                daysOfWeek.wed = true;
                break;
            case 'thu':
                daysOfWeek.thu = true;
                break;
            case 'fri':
                daysOfWeek.fri = true;
                break;
            case 'sat':
                daysOfWeek.sat = true;
                break;
            default:
                break;
        }
    });

    return daysOfWeek;
}

function toDaysArray(daysOfWeek: DaysOfWeek): string[] {
    const days: string[] = [];

    if (daysOfWeek.sun) {
        days.push('sun');
    }
    if (daysOfWeek.mon) {
        days.push('mon');
    }
    if (daysOfWeek.tue) {
        days.push('tue');
    }
    if (daysOfWeek.wed) {
        days.push('wed');
    }
    if (daysOfWeek.thu) {
        days.push('thu');
    }
    if (daysOfWeek.fri) {
        days.push('fri');
    }
    if (daysOfWeek.sat) {
        days.push('sat');
    }

    return days;
}

export { toDaysArray, toDaysOfWeek };