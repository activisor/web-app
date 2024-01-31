/**
 * @module SendGridEmailNotifier
 * @description implementation to send email notification to participants using SendGrid
 */

import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '@/inversify-types';
import sgMail, { MailDataRequired } from '@sendgrid/mail';
import ResponseError from '@sendgrid/helpers/classes/response-error';

import type { Participant } from '../participant';
import type { ScheduleData } from '../schedule-data';
import { Notification } from './notification';

@injectable()
class SendGridEmailNotifier implements Notification {
    private _schedulerEmail: string;
    private _emailTemplateId: string;

    constructor(
        @inject(TYPES.SENDGRID_API_KEY) apiKey: string,
        @inject(TYPES.SCHEDULER_FROM_EMAIL) schedulerEmail: string,
        @inject(TYPES.SENDGRID_NOTIFY_TEMPLATE_ID) emailTemplateId: string,
    ) {
        sgMail.setApiKey(apiKey);
        this._schedulerEmail = schedulerEmail;
        this._emailTemplateId = emailTemplateId;
    }

    async send(data: ScheduleData, spreadsheetId: string): Promise<boolean> {

        let sender: Participant | undefined;
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?usp=sharing`;

        // create list of all participant emails, except cc sender
        const participants: string[] = [];
        data.participants.forEach((participant) => {
            if (!sender && participant.isSender) {
                sender = participant;
            } else {
                participants.push(participant.email);
            }
        });

        const senderName = sender?.name?? '';

        const msg: MailDataRequired = {
            to: participants,
            cc: sender?.email?? '',
            from: this._schedulerEmail,
            templateId: this._emailTemplateId,
            dynamicTemplateData: {
                subject: `${senderName} has shared ${data.scheduleName} with you`,
                scheduleName: data.scheduleName,
                sender: senderName,
                scheduleLink: sheetUrl,
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

export { SendGridEmailNotifier };