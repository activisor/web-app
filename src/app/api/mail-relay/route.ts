import type { NextRequest } from "next/server"
import { appContainer } from '@/inversify.config';
import { TYPES } from "@/inversify-types";

export async function POST(request: NextRequest) {
    console.log('POST /api/mail-relay');
    return new Response('', { status: 200 });
}
