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

export { iToAlpha };