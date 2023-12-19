/**
 * @module base64-convert
 * @description converts objects to and from base64 encoding in web and nodejs
 */

import { EmailExtract } from './email-extract';

function isNodeJs(): boolean {
    return (typeof window === 'undefined');
}

function encode(emailExtract: object): string {
    const json = JSON.stringify(emailExtract);
    if (isNodeJs()) {
        console.log('isNodeJs');
        return Buffer.from(json).toString('base64');
    }

    return btoa(json);
}

function decode(encoded: string): any {
    if (encoded) {
        if (isNodeJs()) {
            const json = Buffer.from(encoded, 'base64').toString();
            return JSON.parse(json);
        }

        const json = atob(encoded);
        return JSON.parse(json);
    }

    return encoded;
}

export { decode, encode, isNodeJs };