import type { NextRequest } from "next/server"
import { getToken } from 'next-auth/jwt';
import type { ScheduleData } from '@/lib/schedule-data';
import type { Notification } from "@/lib/email/notification";

import { appContainer } from '@/inversify.config';
import { TYPES } from "@/inversify-types";

export async function POST(request: NextRequest, { params }: { params: { sheetId: string } }) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET as string
    })
    if (token) {
        // Signed in
        const dto: ScheduleData = await request.json();
        const notifier = appContainer.get<Notification>(TYPES.Notification);

        const success = await notifier.send(dto, params.sheetId);
        return success? new Response('', { status: 200 }) : new Response('', { status: 400 });
    }

    return new Response('', { status: 401 });
}
