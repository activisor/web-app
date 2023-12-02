/**
 * interface for extracting emails from FormData
 * ref: https://docs.sendgrid.com/for-developers/parsing-email/setting-up-the-inbound-parse-webhook#example-default-payload
 */
import { EmailExtract } from './email-extract';

interface EmailExtraction {
    extract: (body: FormData) => EmailExtract;
}

export type { EmailExtraction };