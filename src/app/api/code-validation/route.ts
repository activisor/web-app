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
        const code = request.nextUrl.searchParams.get('code');
        if (code) {
            const dto = {
                valid: false
             };

            const referenceCode: string = process.env.DISCOUNT_CODE as string;
            if (code.toLowerCase() === referenceCode.toLowerCase()) {
                dto.valid = true;
            }

            const blob = new Blob([JSON.stringify(dto, null, 2)], {
                type: "application/json",
            });
            return new Response(blob);
        }

        return new Response('', { status: 400 });
    }

    return new Response('', { status: 401 });
}
