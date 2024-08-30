/**
 * single pass randomizer implementation
 * - assigns random weights to participants and sorts by weight
 * - predetermine average frequency by round, assigns variance-based coeficient to each random weight
 * - filters by max occurrences per participant
 */
import { injectable, inject } from 'inversify';
import "reflect-metadata";
import { TYPES } from "@/inversify-types";
import { shuffleArray } from '../arrays';
import { generatePairs } from './pair-generator';
import type { Randomization } from './randomization';
import type { RandomizeResult } from './randomize-result';
import type { Participant } from '../participant';
import type { ScheduleParticipant } from './schedule-participant';

@injectable()
class Randomizer implements Randomization {
    private _devarianceCoef: number;

    constructor(@inject(TYPES.DEVARIANCE_COEF) devarianceCoef: number) {
        this._devarianceCoef = devarianceCoef;
    }

    _getFullShares(participants: Participant[]): number {
        let count = 0;
        participants.forEach(participant => {
            count += participant.isHalfShare? 0.5 : 1;
        })

        return count;
    }

    _meanCount(periods: number, groupSize: number, numParticipants: number): number {
        return periods * groupSize / numParticipants;
    }

    _scoreParticipant(participant: Participant, groupSize: number, schedule: Participant[][], meanCount: number, maxCount: number)
        : number {
        if (participant.isHalfShare) {
            meanCount /= 2;
        }

        let existingCount = 0;
        for (let i = 0; i < schedule.length; i++) {
            for (let j = 0; j < groupSize; j++) {
                if (schedule[i][j].email === participant.email) {
                    existingCount++;
                }
            }
        }
/*
        let coef = 1;
        if (existingCount >= maxCount) {
            coef = 0;
        } else if (existingCount > meanCount) {
            coef = this._devarianceCoef;
        }
*/
        const coef = (existingCount > meanCount) ? this._devarianceCoef : 1;
        return coef * Math.random();
    }

    _scoreParticipants(participants: Participant[], groupSize: number, schedule: Participant[][], meanCount: number, maxCount: number)
        : {participant: Participant, score: number}[] {
        const scores: {participant: Participant, score: number}[] = [];
        for (let i = 0; i < participants.length; i++) {
            const score = this._scoreParticipant(participants[i], groupSize, schedule, meanCount, maxCount);
            scores.push({ participant: participants[i], score });
        }
        return scores;
    }

    /**
     *
     * @param scores sort by descending score
     * @param groupSize
     * @returns
     */
    _rankParticipants(scores: {participant: Participant, score: number}[], groupSize: number)
        : Participant[] {
        scores.sort((a, b) => b.score - a.score);
        const result: Participant[] = [];
        for (let i = 0; i < groupSize; i++) {
            result.push(scores[i].participant);
        }
        return result;
    }

    _randomizePair(periods: number, participants: Participant[]): Participant[][] {
        const schedule: Participant[][] = generatePairs<Participant>(participants, periods);
        return shuffleArray<Participant[]>(schedule);
    }

    randomize(periods: number, groupSize: number, participants: Participant[]) {
        const fullShares = this._getFullShares(participants);
        const resultParticipants: ScheduleParticipant[] = [];
        for (let i = 0; i < participants.length; i++) {
            resultParticipants.push({ ...participants[i], total: 0 });
        }

        // participant group by week
        let schedule: Participant[][] = [];

        if ((groupSize === 2) && fullShares === participants.length) {
            schedule = this._randomizePair(periods, participants);
        } else {
            const group = groupSize > fullShares ? fullShares : groupSize;
            const maxCount = this._meanCount(periods, group, fullShares);
            console.log(`maxCount: ${maxCount}`);
            for (let i = 0; i < periods; i++) {
                const meanCount = this._meanCount(i, group, fullShares);
                const scoredParticipants = this._scoreParticipants(participants, group, schedule, meanCount, maxCount);
                const groupParticipants = this._rankParticipants(scoredParticipants, group);
                schedule.push(groupParticipants);
            }
        }

        const result: RandomizeResult = {
            participants: resultParticipants,
            schedule: schedule
        };

        return result;
    }

    randomize_old(periods: number, groupSize: number, participants: Participant[]) {
        const fullShares = this._getFullShares(participants);
        const resultParticipants: ScheduleParticipant[] = [];
        const group = groupSize > fullShares ? fullShares : groupSize;
        for (let i = 0; i < participants.length; i++) {
            resultParticipants.push({ ...participants[i], total: 0 });
        }

        const maxCount = this._meanCount(periods, group, fullShares);
        console.log(`maxCount: ${maxCount}`);
        // participant group by week
        const schedule: Participant[][] = [];
        for (let i = 0; i < periods; i++) {
            const meanCount = this._meanCount(i, group, fullShares);
            const scoredParticipants = this._scoreParticipants(participants, group, schedule, meanCount, maxCount);
            const groupParticipants = this._rankParticipants(scoredParticipants, group);
            schedule.push(groupParticipants);
        }

        const result: RandomizeResult = {
            participants: resultParticipants,
            schedule: schedule
        };

        return result;
    }
}

export { Randomizer };