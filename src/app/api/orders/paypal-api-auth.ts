/**
 * Paypal API Auth Utilties
 */
import fetch from 'node-fetch';
import { OAuthToken } from '@/lib/oauth-token';

const sandboxSubdomain = process.env.PAYPAL_ENVIRONMENT === 'sandbox'? '.sandbox' : '';
const baseUrl =  `https://api-m${sandboxSubdomain}.paypal.com`;

const generateAccessToken = async () => {
    try {
        const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
        const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

        if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
            throw new Error("MISSING_API_CREDENTIALS");
        }

        const auth = Buffer.from(
            PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
        ).toString("base64");

        const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
            method: "POST",
            body: "grant_type=client_credentials",
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });

        const data = await response.json() as OAuthToken;

        return data.access_token;

    } catch (error) {
        console.error("Failed to generate Access Token:", error);
    }
};

export { baseUrl, generateAccessToken };