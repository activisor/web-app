/**
 * @module SendGridEmailExtractor
 * @description implementation to extract data from SendGrid inbound parse webhook
 */

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
    extract(body: FormData): EmailExtract {
        const participants: Participant[] = [];
        const sender: Participant = parseEmail(body.get('from') as string);
        /*
        const sender: Participant = {
            email: body.get('from') as string,
            name: body.get('fromname') as string
        };
        */
        const subject: string = body.get('subject') as string;

        const cc: string = body.get('cc') as string;
        if (cc) {
            const ccList: string[] = cc.split(',');
            ccList.forEach((cc) => {
                const ccParticipant: Participant = {
                    email: cc,
                    name: cc
                };
                participants.push(ccParticipant);
            });
        }

        const to: string = body.get('to') as string;
        if (to) {
            const toList: string[] = to.split(',');
            toList.forEach((to) => {
                const toParticipant: Participant = {
                    email: to,
                    name: to
                };
                participants.push(toParticipant);
            });
        }

        const emailExtract: EmailExtract = {
            participants: participants,
            sender: sender,
            subject: subject
        };

        return emailExtract;
    }
}

export { SendGridEmailExtractor };
