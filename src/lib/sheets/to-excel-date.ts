/**
 * Converts a Date to an Excel timestamp.
 */

const MS_PER_DAY = 86400000;
// offset from 1/1/1970 to 1/1/1900 (Excel's epoch)
const EPOCH_OFFSET_DAYS = 25569;

function removeTime(date = new Date()) {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
  }

function toExcelDate(date: Date): number {
    date = removeTime(date);
    const daysSinceEpoch = Math.ceil((date.getTime()) / MS_PER_DAY);
    const daysSinceExcelEpoch = daysSinceEpoch + EPOCH_OFFSET_DAYS;
    return daysSinceExcelEpoch;
}

export { toExcelDate };