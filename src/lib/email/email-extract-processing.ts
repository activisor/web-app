/**
 * interface for processing EmailExtracts
 */
import { EmailExtract } from './email-extract';

interface EmailExtractProcessing {
    /**
     * process an EmailExtract
     * @param emailData
     * @returns true if successful, false otherwise
     */
    process: (emailData: EmailExtract) => boolean;
}

export type { EmailExtractProcessing };