import type { NextRequest } from 'next/server';
import fetch from 'node-fetch';
import { baseUrl, generateAccessToken } from './paypal-api-auth';

/**
 * Create an order to start the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
const createOrder = async (cart: any) => {
    // use the cart information passed from the front-end to calculate the purchase unit details
    console.log(
        "shopping cart information passed from the frontend createOrder() callback:",
        cart,
    );

    const accessToken = await generateAccessToken();
    const url = `${baseUrl}/v2/checkout/orders`;
    const payload = {
        intent: "CAPTURE",
        purchase_units: [
            {
                amount: {
                    currency_code: "USD",
                    value: "1.00",
                },
            },
        ],
    };

    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
            // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
            // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
            // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
            // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
        },
        method: "POST",
        body: JSON.stringify(payload),
    });

    return {
        jsonResponse: await response.json(),
        httpStatusCode: response.status,
    };
};

export async function POST(request: NextRequest): Promise<Response> {
    try {
        // use the cart information passed from the front-end to calculate the order amount detals
        const cart = await request.json();

        const { jsonResponse, httpStatusCode } = await createOrder(cart);
        return new Response(JSON.stringify(jsonResponse), { status: httpStatusCode });
    } catch (error) {
        console.error("Failed to create order:", error);
        return new Response('Failed to create order.', { status: 500 });
    }
}