/**
 * interface for generating a google sheet specification
 */
import { sheets_v4 } from 'googleapis';
import type { RandomizeResult } from './randomize-result';

interface SheetSpecification {
    generate: (dates: Date[], participantMatrix: RandomizeResult) => sheets_v4.Schema$Sheet;
}

export { SheetSpecification };