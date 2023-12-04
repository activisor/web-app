
// Extracts email related fields from text.

// (\w+(?:[\s-]+[\w-]+)?): Capturing group that matches one or two words.
//    \w+: Matches one or more word characters (letters, digits, or underscores).
//    (?:[\s-]+[\w-]+)?: Non-capturing group that matches an optional space followed by one or more word or hyphen characters
// \s*: Matches zero or more whitespace characters.
// <: Matches the literal "<".
// [^<]*: Matches zero or more characters that are not "<". to the end of the string.
const NAME_REGEX = /(\w+(?:[\s-]+[\w-]+)?)\s*<[^<]*$/;

// email regex: optional non-capturing groups for < and > around email address,
//   then match text with no whitespace or @, then @,
//   then text with no whitespace or @, then ., then text with no whitespace or @
const EMAIL_REGEX = /(?:<)?([^\s@]+@[^\s@]+\.[^\s@>]+)(?:>)?/;

function extract(text: string, regex: RegExp): string {
    const matches = text.match(regex);
    return matches && matches[1] ? matches[1] : '';
}

function extractEmail(text: string): string {
    return extract(text, EMAIL_REGEX);
}

function extractName(text: string): string {
    return extract(text, NAME_REGEX);
}

export { extractEmail, extractName };