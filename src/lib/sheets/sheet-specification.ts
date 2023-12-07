/**
 * interface for generating a google sheet specification
 */
import { sheets_v4 } from 'googleapis';
import type { RandomizeResult } from './randomize-result';

interface SheetSpecification {
    generate: (dates: Date[], participantMatrix: RandomizeResult) => sheets_v4.Schema$Sheet;

    addFormatting: (sheetId: number, participantMatrix: RandomizeResult) => sheets_v4.Schema$Request[];
}

export type { SheetSpecification };