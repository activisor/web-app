/**
 * calculates the variance of the given values
 */
import type { RandomizeResult } from '@/lib/sheets/randomize-result';
import type { Participant } from '@/lib/participant';

/**
 * calculates the variance of the given values
 * @param values
 * @returns
 */
export function variance(values: number[]): number {
    const mean = values.reduce((a, b) => a + b) / values.length;
    return values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
}

/**
 * gets all possible pairs from the given participants
 * @param participants
 * @returns
 */
function getPairs(participants: Participant[]): Participant[][] {
    const pairs: Participant[][] = [];
    for (let i = 0; i < participants.length; i++) {
        for (let j = i + 1; j < participants.length; j++) {
            pairs.push([participants[i], participants[j]]);
        }
    }
    return pairs;
}

/**
 * calculates the variance of participant pair counts in the given schedule
 * @param participantMatrix
 * @returns
 */
export function pairsVariance(participantMatrix: RandomizeResult): number {
    const pairs = getPairs(participantMatrix.participants);
    const pairCounts: number[] = [];
    for (let i = 0; i < pairs.length; i++) {
        pairCounts.push(0);
    }

    for (let i = 0; i < participantMatrix.schedule.length; i++) {
        const period = participantMatrix.schedule[i];

            for (let k = 0; k < pairs.length; k++) {
                const pair = pairs[k];
                const pair0Match = (periodElement: Participant) => periodElement.email === pair[0].email;
                const pair1Match = (periodElement: Participant) => periodElement.email === pair[1].email;
                if (period.some(pair0Match) && period.some(pair1Match)) {
                    pairCounts[k]++;
                }
            }
    }
    console.log(JSON.stringify(pairCounts));
    return variance(pairCounts);
}