import type { NextRequest } from "next/server"
import { appContainer } from '@/inversify.config';
import { TYPES } from "@/inversify-types";
import type { EmailExtraction } from '@/lib/email/email-extraction';
import type { EmailExtractProcessing } from '@/lib/email/email-extract-processing';
import type { FormDataValidation } from '@/lib/form-data-validation';

export async function POST(request: Request) {
    try {
        // parse multipart/form-data
        console.log(`url: ${request.url}`);
        const formData = await request.formData();

        console.log(`subject: ${formData.get('subject')}`);
        console.log(`cc: ${formData.get('cc')}`);
        console.log(`from: ${formData.get('from')}`);
        console.log(`text: ${formData.get('text')}`);

        const sendGridEmailSpamValidator = appContainer.get<FormDataValidation>(TYPES.SpamValidation);
        if (sendGridEmailSpamValidator.validate(formData)) {
            const sendGridEmailExtractor = appContainer.get<EmailExtraction>(TYPES.EmailExtraction);
            const email = sendGridEmailExtractor.extract(formData);

            const sendGridEmailResponder = appContainer.get<EmailExtractProcessing>(TYPES.EmailExtractProcessing);
            const result = await sendGridEmailResponder.process(email);
            console.log(`sendGridEmailResponder result: ${result}`);
        }
    } catch (err: any) {
        if (err instanceof Error) {
            console.log(err.name); // the type of error
            console.log(err.message); // the description of the error
            console.log(err.stack); // the stack trace of the error
        }

        return new Response('', { status: 500 });
    }

    return new Response('', { status: 200 });
}
