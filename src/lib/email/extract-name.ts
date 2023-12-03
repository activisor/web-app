
// Extracts the name from an email address.

// (\w+(?:[\s-]+[\w-]+)?): Capturing group that matches one or two words.
//    \w+: Matches one or more word characters (letters, digits, or underscores).
//    (?:[\s-]+[\w-]+)?: Non-capturing group that matches an optional space followed by one or more word or hyphen characters
// \s*: Matches zero or more whitespace characters.
// <: Matches the literal "<".
// [^<]*: Matches zero or more characters that are not "<". to the end of the string.

const regex = /(\w+(?:[\s-]+[\w-]+)?)\s*<[^<]*$/;


function extractName(text: string): string {
    const matches = text.match(regex);
    return matches && matches[1] ? matches[1] : '';
}

export { extractName };