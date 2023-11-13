import type { NextRequest } from "next/server"
import { getToken } from 'next-auth/jwt';
import ScheduleData from '../../../lib/schedule-data';
import SheetsManager from '../../../lib/sheets/sheets-manager';

export async function POST(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET as string
  })
  if (token) {
    // Signed in
    const dto: ScheduleData = await request.json();
    const sheetsManager = new SheetsManager();
    sheetsManager.setCredentials({
      access_token: token.accessToken as string,
      refresh_token: token.refreshToken as string,
      expiry_date: token.exp as number
    });
    const sheetUrl = await sheetsManager.createSheet(dto);

    const obj = { url: sheetUrl };
    const blob = new Blob([JSON.stringify(obj, null, 2)], {
      type: "application/json",
    });
    return new Response(blob);
  }

  return new Response('', { status: 401 });
}