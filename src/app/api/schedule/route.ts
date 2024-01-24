import type { NextRequest } from "next/server"
import { getToken } from 'next-auth/jwt';
import type { ScheduleData } from '@/lib/schedule-data';
import { SheetsManagement } from '@/lib/sheets/sheets-management';
import { appContainer } from '@/inversify.config';
import { TYPES } from "@/inversify-types";

// DTO returned to client
interface SheetResult {
    sheetId: string;
}

export async function POST(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET as string
    })
    if (token) {
        // Signed in
        const dto: ScheduleData = await request.json();
        // convert dates to Date objects
        if (dto.dates) {
            dto.dates.startDate = new Date(dto.dates.startDate);
            dto.dates.endDate = new Date(dto.dates.endDate);
        }
        
        const sheetsManager = appContainer.get<SheetsManagement>(TYPES.SheetsManagement);
        sheetsManager.setCredentials({
            access_token: token.accessToken as string,
            refresh_token: token.refreshToken as string,
            expiry_date: token.exp as number
        });

        const sheetId = await sheetsManager.createSpreadsheet(dto);

        if (sheetId) {
            const obj: SheetResult = {
                sheetId: sheetId,
             };
            const blob = new Blob([JSON.stringify(obj, null, 2)], {
                type: "application/json",
            });
            return new Response(blob);
        }

        return new Response('', { status: 400 });
    }

    return new Response('', { status: 401 });
}
