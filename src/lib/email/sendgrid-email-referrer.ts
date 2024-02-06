/**
 * @module SendGridEmailReferrer
 * @description implementation to send email referrals using SendGrid
 */

import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '@/inversify-types';
import sgMail, { MailDataRequired } from '@sendgrid/mail';
import ResponseError from '@sendgrid/helpers/classes/response-error';

import type { Referral } from './referral';

@injectable()
class SendGridEmailReferrer implements Referral {
    private _schedulerEmail: string;
    private _emailTemplateId: string;

    constructor(
        @inject(TYPES.SENDGRID_API_KEY) apiKey: string,
        @inject(TYPES.SCHEDULER_FROM_EMAIL) schedulerEmail: string,
        @inject(TYPES.SENDGRID_REFER_TEMPLATE_ID) emailTemplateId: string,
    ) {
        sgMail.setApiKey(apiKey);
        this._schedulerEmail = schedulerEmail;
        this._emailTemplateId = emailTemplateId;
    }

    async send(senderName: string, recipients:string[]): Promise<boolean> {
        const msg: MailDataRequired = {
            to: recipients,
            from: this._schedulerEmail,
            templateId: this._emailTemplateId,
            dynamicTemplateData: {
                subject: `${senderName} thought you might find the Activisor schedule maker useful`,
                sender: senderName,
            },
        };

        if (process.env.NODE_ENV === "development") {
            console.log(`Test mode msg: ${JSON.stringify(msg)}`);
        }

        let result = false;
        if (process.env.STUB_SENDGRID === 'true') {
            return true;
        }

        try {
            await sgMail.send(msg);
            console.log(`Email sent`);
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

export { SendGridEmailReferrer };