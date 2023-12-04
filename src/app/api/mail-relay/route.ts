import type { NextRequest } from "next/server"
import { appContainer } from '@/inversify.config';
import { TYPES } from "@/inversify-types";
import { EmailExtraction } from '@/lib/email/email-extraction';

export async function POST(request: NextRequest) {
    // parse multipart/form-data
    const formData = await request.formData()

    console.log(formData);
    console.log(`subject: ${formData.get('subject')}`);
    console.log(`cc: ${formData.get('cc')}`);
    console.log(`dkim: ${formData.get('dkim')}, ${typeof formData.get('dkim')}`);
    console.log(`from: ${formData.get('from')}`);
    console.log(`text: ${formData.get('text')}`);

    const sendGridEmailExtractor = appContainer.get<EmailExtraction>(TYPES.SendGridEmailExtractor);
    const email = sendGridEmailExtractor.extract(formData);
    console.log(JSON.stringify(email));

    return new Response('', { status: 200 });
}
