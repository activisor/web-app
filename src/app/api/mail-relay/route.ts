import type { NextRequest } from "next/server"
import { appContainer } from '@/inversify.config';
import { TYPES } from "@/inversify-types";

export async function POST(request: NextRequest) {
    const dto = await request.json();
    console.log(dto);
    return new Response('', { status: 200 });
}
