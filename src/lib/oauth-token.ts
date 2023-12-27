/**
 * OAuth Token
 */

interface OAuthToken {
    access_token: string;
    app_id?: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
    scope: string;
    nonce?: string;
}

export type { OAuthToken };