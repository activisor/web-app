import type { NextRequest } from "next/server"
import { getToken } from 'next-auth/jwt';

/**
 * validates received discount code
 * @param request
 * @returns
 */
export async function GET(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET as string
    })

    if (token) {
        const unlocked = process.env.UNLOCKED as string;
        const code = request.nextUrl.searchParams.get('code');

        const dto = {
            validCode: false,
            paymentClientId: process.env.PAYPAL_CLIENT_ID,
            currency: 'USD',
        };

        const referenceCode: string = process.env.DISCOUNT_CODE as string;
        if (unlocked==='true' || (code && (code.toLowerCase() === referenceCode.toLowerCase()))) {
            dto.validCode = true;
        }

        const blob = new Blob([JSON.stringify(dto, null, 2)], {
            type: "application/json",
        });
        return new Response(blob);
    }

    return new Response('', { status: 401 });
}