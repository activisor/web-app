import type { NextRequest } from "next/server"
import { appContainer } from '@/inversify.config';
import { TYPES } from "@/inversify-types";

export async function POST(request: NextRequest) {
    // parse multipart/form-data
    const formData = await request.formData()

    console.log(formData);
    return new Response('', { status: 200 });
}
