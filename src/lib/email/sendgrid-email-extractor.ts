/**
 * @module SendGridEmailExtractor
 * @description implementation to extract data from SendGrid inbound parse webhook
 */

import { injectable, inject } from 'inversify';
import "reflect-metadata";
import { TYPES } from "@/inversify-types";

import { EmailExtraction } from './email-extraction';
import { EmailExtract } from './email-extract';
import { Participant } from '../participant';

function toTitleCase(str: string) {
    // greedy match for all non-whitespace and non-hyphen characters
    return str.replace(/[^\s\-]+/g, function(txt: string){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function parseEmail(text: string): Participant {
    if (!text) {
        return {
            email: '',
            name: ''
        };
    };

    // email regex: optional non-capturing groups for < and > around email address,
    //   then match text with no whitespace or @, then @,
    //   then text with no whitespace or @, then ., then text with no whitespace or @
    const emailMatches = text.match(/(?:<)?([^\s@]+@[^\s@]+\.[^\s@>]+)(?:>)?/);
    const email = emailMatches ? emailMatches[1] : '';

    // name regex: capture group preceding <
    const nameMatches = text.match(/(.*)</);
    let name = nameMatches ? nameMatches[1] : '';
    name = toTitleCase(name.trim());

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
            const participant = parseEmail(item);
            if (participant.email != this._schedulerEmail) {
                participants.push(participant);
            }
        });
    }

    extract(body: FormData): EmailExtract {
        const sender: Participant = parseEmail(body.get('from') as string);
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

        const emailExtract: EmailExtract = {
            participants: participants,
            sender: sender,
            subject: subject? subject.trim() : ''
        };

        return emailExtract;
    }
}

export { SendGridEmailExtractor };
