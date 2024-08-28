/**
 * DTO for a schedule participant
 */
interface Participant {
    email: string;
    id?: number;
    name: string;
    isSender?: boolean;
    isHalfShare?: boolean;
}

export type { Participant };