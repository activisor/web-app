/**
 * @module SendGridEmailResponder
 * @description implementation to extract data from SendGrid inbound parse webhook
 */

import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '@/inversify-types';
import sendGridMail from '@sendgrid/mail';

import { EmailExtract } from './email-extract';
import { EmailExtractProcessing } from './email-extract-processing';

/**
 * @class SendGridEmailResponder
 * @implements EmailExtractProcessing
 * @description sends email using SendGrid in response to in-bound email extraction
 */
@injectable()
class SendGridEmailResponder implements EmailExtractProcessing {
    private _schedulerEmail: string;

    constructor(
        @inject(TYPES.SENDGRID_API_KEY) apiKey: string,
        @inject(TYPES.SCHEDULER_EMAIL) schedulerEmail: string
    ) {
        sendGridMail.setApiKey(apiKey);
        this._schedulerEmail = schedulerEmail;
    }

    process(emailData: EmailExtract): boolean {
        console.log(`emailData: ${JSON.stringify(emailData)}`);

        const msg = {
            to: emailData.sender,
            from: this._schedulerEmail, // Change to your verified sender
            subject: emailData.subject,
            text: 'and easy to do anywhere, even with Node.js',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        };

        sendGridMail
            .send(msg)
            .then(() => {
                console.log('Email sent')
            })
            .catch((error) => {
                console.error(error)
            });

        return true;
    }
}

export { SendGridEmailResponder };