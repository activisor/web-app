/**
 * DTO for email extraction parameters
 */
import type { Participant } from '../participant';

interface EmailExtract {
    participants: Participant[];
    sender: Participant;
    subject: string;
}

export type { EmailExtract };