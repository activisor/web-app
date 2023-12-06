/**
 * SendGrid Email Spam Validator
 */
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import type { FormDataValidation } from '../form-data-validation';

function validateSpamScore(spamScore: string | null): boolean {
    if (spamScore) {
        const score = Number(spamScore);
        if (score >= 5) {
            return false;
        }
    }

    return true;
}

@injectable()
class SendGridEmailSpamValidator implements FormDataValidation {
    validate(body: FormData): boolean {
        const spamScore = body.get('spam_score') as string | null;
        const validSpamScore = validateSpamScore(spamScore);

        const dkim = body.get('dkim') as string | null;
        const dkimValid = (dkim && dkim.includes('pass')) as boolean;

        const spf = body.get('SPF') as string | null;
        const spfValid = (spf === 'pass');

        return validSpamScore && dkimValid && spfValid;
    }
}

export { SendGridEmailSpamValidator };