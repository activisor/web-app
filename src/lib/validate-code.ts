/**
 * Validate the code against the reference codes
 * returns true if case-insensitive match is found
 * @param code
 * @param refCodes
 * @returns boolean
 */
function validateCode(code: string, refCodes: string[]): boolean {
  return refCodes.some((refCode) => refCode.toLowerCase() === code.toLowerCase());
}

export { validateCode };
