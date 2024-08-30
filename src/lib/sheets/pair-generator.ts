/**
 * generate pairs from set of participants
 *
 */
export function generatePairs<Type>(names: Type[], numEvents: number): Type[][] {
    const pairs: Type[][] = [];

    // rotate keys i, j through names array numEvents times
    const maxIdx = names.length;
    if (maxIdx > 0) {
        let completed = false;
        while (!completed) {
            for (let i = 0; i < maxIdx - 1; i++) {
                if (completed) {
                    break;
                }

                for (let j = i + 1; j < maxIdx; j++) {
                    pairs.push([names[i], names[j]])
                    if (pairs.length >= numEvents) {
                        completed = true;
                        break;
                    }
                }
            }
        }
    }

    return pairs;
}