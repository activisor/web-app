import type { NextRequest } from "next/server"
import { getToken } from 'next-auth/jwt';
import { publicRuntimeConfig } from '@/lib/app-constants';
import { getPrice } from '@/lib/get-price';
import { validateCode } from '@/lib/validate-code';

const refCodes = process.env.DISCOUNT_CODE?.split(',') ?? [];
const referralDiscount = process.env.REFERRAL_DISCOUNT? parseInt(process.env.REFERRAL_DISCOUNT) : 0;

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

    if (token || publicRuntimeConfig.UX_DEV_MODE) {
        const code = request.nextUrl.searchParams.get('code');
        const referral = request.nextUrl.searchParams.get('referral');
        const isReferral = referral === 'true';

        const dto = {
            validCode: false,
            paymentClientId: process.env.PAYPAL_CLIENT_ID,
            currency: 'USD',
            priceCents: getPrice(isReferral, referralDiscount),
            referralDiscount: referralDiscount,
        };

        const unlocked = process.env.UNLOCKED === 'true';
        if (unlocked || validateCode(code as string, refCodes)) {
            dto.validCode = true;
        }

        const blob = new Blob([JSON.stringify(dto, null, 2)], {
            type: "application/json",
        });
        return new Response(blob);
    }

    return new Response('', { status: 401 });
}
