/**
 * @module base64-convert
 * @description converts EmailExtract to and from base64 encoding in web and nodejs
 */

import { EmailExtract } from './email-extract';

function isNodeJs(): boolean {
    return (typeof window === 'undefined');
}

function encode(emailExtract: EmailExtract): string {
    const json = JSON.stringify(emailExtract);
    if (isNodeJs()) {
        console.log('isNodeJs');
        return Buffer.from(json).toString('base64');
    }

    return btoa(json);
}

function decode(encoded: string): EmailExtract {

    if (isNodeJs()) {
        const json = Buffer.from(encoded, 'base64').toString();
        return JSON.parse(json);
    }

    const json = atob(encoded);
    return JSON.parse(json);
}

export { decode, encode, isNodeJs };