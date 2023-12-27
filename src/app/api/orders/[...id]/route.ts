import type { NextRequest } from 'next/server';
import fetch from 'node-fetch';
import { baseUrl, generateAccessToken } from '../paypal-api-auth';

/**
 * Capture payment for the created order to complete the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 */

const captureOrder = async (orderId: string) => {
    const accessToken = await generateAccessToken();
    const url = `${baseUrl}/v2/checkout/orders/${orderId}/capture`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
            // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
            // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
            // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
            // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
        },
    });

    return {
        jsonResponse: await response.json(),
        httpStatusCode: response.status,
    };
};

export async function POST(request: NextRequest, { params }: { params: { id: Array<string> } }): Promise<Response> {
    try {
        const { jsonResponse, httpStatusCode } = await captureOrder(params.id[0]);

        return new Response(JSON.stringify(jsonResponse), { status: httpStatusCode });
    } catch (error) {
        console.error("Failed to create order:", error);
        return new Response('Failed to create order.', { status: 500 });
    }
}