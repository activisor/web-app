import type { NextRequest } from "next/server"
import { appContainer } from '@/inversify.config';
import { TYPES } from "@/inversify-types";

export async function POST(request: NextRequest) {
    let dto = "";
    try {
        dto = await request.json();
    } catch (error) {
        console.log(error);
        dto = await request.text();
    }

    console.log(dto);
    return new Response('', { status: 200 });
}
