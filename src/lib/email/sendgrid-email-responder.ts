/**
 * @module SendGridEmailResponder
 * @description implementation to extract data from SendGrid inbound parse webhook
 */

import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '@/inversify-types';
import sgMail, { MailDataRequired } from '@sendgrid/mail';
import ResponseError from '@sendgrid/helpers/classes/response-error';

import { encode, decode } from '../base64-convert';
import { removeSubstring } from '../text';
import { EmailExtract } from '../email-extract';
import { EmailExtractProcessing } from './email-extract-processing';

/**
 * @class SendGridEmailResponder
 * @implements EmailExtractProcessing
 * @description sends email using SendGrid in response to in-bound email extraction
 */
@injectable()
class SendGridEmailResponder implements EmailExtractProcessing {
    private _schedulerEmail: string;
    private _emailTemplateId: string;

    constructor(
        @inject(TYPES.SENDGRID_API_KEY) apiKey: string,
        @inject(TYPES.SCHEDULER_RESPONDER_EMAIL) schedulerEmail: string,
        @inject(TYPES.SENDGRID_TEMPLATE_ID) emailTemplateId: string,
    ) {
        sgMail.setApiKey(apiKey);
        this._schedulerEmail = schedulerEmail;
        this._emailTemplateId = emailTemplateId;
    }

    async process(emailData: EmailExtract): Promise<boolean> {
        emailData.subject = removeSubstring(emailData.subject, 'Fwd: ');
        const queryParam = encode(emailData);

        const msg: MailDataRequired = {
            to: emailData.sender,
            from: this._schedulerEmail,
            subject: `Re: ${emailData.subject}`,
            templateId: this._emailTemplateId,
            dynamicTemplateData: {
              userName: emailData.sender.name,
              scheduleMakerLink: `https://activisor.com?data=${queryParam}`,
            },
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