/**
 * interface for email referral
 */

interface Referral {
    /**
     * send an email notification
     * @param senderName
     * @param recipients: destination emails
     * @returns true if successful, false otherwise
     */
    send: (senderName: string, recipients:string[]) => Promise<boolean>;
}

export type { Referral };