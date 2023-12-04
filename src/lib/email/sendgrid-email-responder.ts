/**
 * @module SendGridEmailResponder
 * @description implementation to extract data from SendGrid inbound parse webhook
 */

import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '@/inversify-types';
import sgMail, { MailDataRequired } from '@sendgrid/mail';
import ResponseError from '@sendgrid/helpers/classes/response-error';

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
        @inject(TYPES.SCHEDULER_RESPONDER_EMAIL) schedulerEmail: string
    ) {
        sgMail.setApiKey(apiKey);
        this._schedulerEmail = schedulerEmail;
    }

    async process(emailData: EmailExtract): Promise<boolean> {
        const msg: MailDataRequired = {
            to: emailData.sender,
            from: this._schedulerEmail,
            subject: emailData.subject,
            text: 'and easy to do anywhere, even with Node.js',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        };

        console.log(`msg: ${JSON.stringify(msg)}`);
        let result = false;
        try {
            await sgMail.send(msg);
            console.log(`Email sent to ${emailData.sender}`);
            result = true;
        } catch (error) {
            console.error('Error sending test email');
            if (error instanceof ResponseError) {
                console.error(JSON.stringify(error.response.body))
            }
        }

        return result;
    }
}

export { SendGridEmailResponder };