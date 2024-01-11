import type { NextRequest } from "next/server"
import { getToken } from 'next-auth/jwt';
import type { ScheduleData } from '@/lib/schedule-data';
import { SheetsManagement } from '@/lib/sheets/sheets-management';
import { appContainer } from '@/inversify.config';
import { TYPES } from "@/inversify-types";

export async function DELETE(request: NextRequest, { params }: { params: { sheetId: string } }) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET as string
    })
    if (token) {
        // Signed in
        const sheetsManager = appContainer.get<SheetsManagement>(TYPES.SheetsManagement);
        sheetsManager.setCredentials({
            access_token: token.accessToken as string,
            refresh_token: token.refreshToken as string,
            expiry_date: token.exp as number
        });

        const success = await sheetsManager.deleteSpreadsheet(params.sheetId);
        return success? new Response('', { status: 200 }) : new Response('', { status: 400 });
    }

    return new Response('', { status: 401 });
}