/**
 *
 * @param i
 * @returns A for 0, AA for 26, AB for 27, etc.
 */
function iToAlpha(i: number): string {
    let result = '';
    let remainder = i;

    while (remainder >= 0) {
        result = String.fromCharCode(65 + (remainder % 26)) + result;
        remainder = Math.floor(remainder / 26) - 1;
    }

    return result;
}

/**
 *
 * @param row 0 based
 * @param column 0 based
 * @returns A1 notation for the given row and column
 */
function toA1Notation(row: number, column: number): string {
    return `${iToAlpha(column)}${row + 1}`;
}

export { iToAlpha, toA1Notation };