
/**
 * removes all instances of substringToRemove from inputString
 * @param inputString
 * @param substringToRemove
 * @returns
 */
function removeSubstring(inputString: string, substringToRemove: string): string {
    const regex = new RegExp(substringToRemove, 'g');
    return inputString.replace(regex, '');
}

function toTitleCase(str: string) {
    // greedy match for all non-whitespace and non-hyphen characters
    return str.replace(/[^\s\-]+/g, function(txt: string){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

export { removeSubstring, toTitleCase }