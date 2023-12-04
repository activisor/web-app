/**
 * @module SendGridEmailExtractor
 * @description implementation to extract data from SendGrid inbound parse webhook
 */

import { injectable, inject } from 'inversify';
import "reflect-metadata";
import { TYPES } from "@/inversify-types";

import { EmailExtraction } from './email-extraction';
import { EmailExtract } from './email-extract';
import { extractEmail, extractName } from './extract-email-fields';
import { Participant } from '../participant';
import { toTitleCase } from '../text';

function getParticipant(text: string): Participant | null {
    if (!text) {
        return null;
    };

    const email = extractEmail(text);
    if (!email) {
        return null;
    };

    let name = extractName(text);
    name = toTitleCase(name);

    return {
        email: email,
        name: name
    };
}

/**
 * @class SendGridEmailExtractor
 * @implements EmailExtraction
 * @description implementation to extract data from SendGrid inbound parse webhook
 */
class SendGridEmailExtractor implements EmailExtraction {
    private _schedulerEmail: string;

    constructor(@inject(TYPES.SCHEDULER_EMAIL) schedulerEmail: string) {
        this._schedulerEmail = schedulerEmail;
    }

    _addParticipants(participants: Participant[], items: string): void {
        const itemsList: string[] = items.split(',');
        itemsList.forEach((item) => {
            const participant = getParticipant(item);
            if (participant && (participant.email != this._schedulerEmail)) {
                participants.push(participant);
            }
        });
    }

    extract(body: FormData): EmailExtract {
        const sender = getParticipant(body.get('from') as string);
        if (!sender) {
            throw new Error('Sender not found');
        }
        
        const participants: Participant[] = [sender];

        const subject: string = body.get('subject') as string;

        const cc: string = body.get('cc') as string;
        if (cc) {
            this._addParticipants(participants, cc);
        }

        const to: string = body.get('to') as string;
        if (to) {
            this._addParticipants(participants, to);
        }

        const text: string = body.get('text') as string;

        if (text) {
            const textSections = text.toLowerCase().split(/from:|to:|cc:/);
            textSections.forEach((section) => {
                if (section.length > 1) {
                    this._addParticipants(participants, section);
                }
            });
        }

        const emailExtract: EmailExtract = {
            participants: participants,
            sender: sender,
            subject: subject? subject.trim() : ''
        };

        return emailExtract;
    }
}

export { SendGridEmailExtractor };
