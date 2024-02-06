import type { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { getToken } from 'next-auth/jwt';
import { authOptions } from '@/lib/auth';
import { appContainer } from '@/inversify.config';
import { TYPES } from "@/inversify-types";
import type { Referral } from '@/lib/email/referral';

/**
 *
 * @param request send email to referrals
 * @returns
 */
export async function POST(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET as string
    })
    if (token) {
        // Signed in
        const session = await getServerSession(authOptions);
        const senderName = session?.user?.name?? token.email as string;
        const dto: string[] = await request.json();
        const referrer = appContainer.get<Referral>(TYPES.Referral);

        const success = await referrer.send(senderName, dto);
        return success? new Response('', { status: 200 }) : new Response('', { status: 400 });
    }

    return new Response('', { status: 401 })
}
