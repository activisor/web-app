/**
 * DTO for a schedule participant
 */

interface Participant {
    email: string;
    id?: number;
    name: string;
    isSender?: boolean;
}

export type { Participant };