import type { NextRequest } from "next/server"
import { appContainer } from '@/inversify.config';
import { TYPES } from "@/inversify-types";
import type { EmailExtraction } from '@/lib/email/email-extraction';
import type { EmailExtractProcessing } from '@/lib/email/email-extract-processing';
import type { FormDataValidation } from '@/lib/form-data-validation';

export async function POST(request: NextRequest) {
    // parse multipart/form-data
    const formData = await request.formData();

    console.log(`subject: ${formData.get('subject')}`);
    console.log(`cc: ${formData.get('cc')}`);
    console.log(`from: ${formData.get('from')}`);
    console.log(`text: ${formData.get('text')}`);

    console.log(`dkim: ${formData.get('dkim')}, ${typeof formData.get('dkim')}`);
    console.log(`SPF: ${formData.get('SPF')}, ${typeof formData.get('SPF')}`);
    console.log(`spam_score: ${formData.get('spam_score')}, ${typeof formData.get('spam_score')}`);
    console.log(`spam_report: ${formData.get('spam_report')}`);

    const sendGridEmailSpamValidator = appContainer.get<FormDataValidation>(TYPES.SpamValidation);
    if (sendGridEmailSpamValidator.validate(formData)) {
        const sendGridEmailExtractor = appContainer.get<EmailExtraction>(TYPES.EmailExtraction);
        const email = sendGridEmailExtractor.extract(formData);
        console.log(JSON.stringify(email));

        const sendGridEmailResponder = appContainer.get<EmailExtractProcessing>(TYPES.EmailExtractProcessing);
        const result = await sendGridEmailResponder.process(email);
        console.log(`sendGridEmailResponder result: ${result}`);
    }

    return new Response('', { status: 200 });
}
