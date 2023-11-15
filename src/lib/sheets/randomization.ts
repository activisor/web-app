/**
 * interface for schedule randomization
 */
import type { RandomizeResult } from './randomize-result';
import Participant from '../participant';

interface Randomization {
    randomize: (periods: number, groupSize: number, participants: Participant[]) => RandomizeResult;
}

export type { Randomization };