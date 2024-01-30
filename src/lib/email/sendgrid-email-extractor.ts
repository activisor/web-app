/**
 * @module SendGridEmailExtractor
 * @description implementation to extract data from SendGrid inbound parse webhook
 */

import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '@/inversify-types';

import { EmailExtraction } from './email-extraction';
import { EmailExtract } from '../email-extract';
import { extractEmail, extractName, isFromDomain } from './extract-email-fields';
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

    const name = extractName(text);

    return {
        email: email,
        name: toTitleCase(name)
    };
}

function getUniqueParticipants(participants: Participant[]): Participant[] {
    const uniqueParticipants: Participant[] = [];
    participants.forEach((participant) => {
        if (!uniqueParticipants.find((p) => p.email === participant.email)) {
            uniqueParticipants.push(participant);
        }
    });
    return uniqueParticipants;
}

/**
 * @class SendGridEmailExtractor
 * @implements EmailExtraction
 * @description implementation to extract schedule data from SendGrid inbound parse webhook
 */
@injectable()
class SendGridEmailExtractor implements EmailExtraction {
    private _schedulerDomain: string;

    constructor(@inject(TYPES.SCHEDULER_TO_DOMAIN) schedulerDomain: string) {
        this._schedulerDomain = schedulerDomain;
    }

    _addParticipants(participants: Participant[], items: string): void {
        const itemsList: string[] = items.split(',');
        itemsList.forEach((item) => {
            const participant = getParticipant(item);
            if (participant && !isFromDomain(participant.email, this._schedulerDomain)) {
                participants.push(participant);
            }
        });
    }

    extract(body: FormData): EmailExtract {
        const sender = getParticipant(body.get('from') as string);
        if (!sender) {
            throw new Error('Sender not found');
        }

        sender.isSender = true;
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

            /* sections can be:
                [0] - text before from:, can split on \n
                [1] - from:
                [2] - text before to:
                [3] - to:
                [4] - text before cc:
                [5] - cc:
            */
            for (let i = 0; i < textSections.length; i++) {
                if (i === 0) {
                    const bodySections = textSections[i].split(/\n| |,/);
                    bodySections.forEach((section) => {
                        if (section.length > 1) {
                            this._addParticipants(participants, section);
                        }
                    });
                } else if(textSections[i].length > 1) {
                    this._addParticipants(participants, textSections[i]);
                }
            }
        }

        const emailExtract: EmailExtract = {
            participants: getUniqueParticipants(participants),
            sender: sender,
            subject: subject? subject.trim() : ''
        };

        return emailExtract;
    }
}

export { SendGridEmailExtractor };
