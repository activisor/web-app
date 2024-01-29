import { Container } from "inversify";
import { TYPES } from "./inversify-types";
import type { Randomization } from './lib/sheets/randomization';
// import { DummyRandomizer } from './lib/sheets/dummy-randomizer';
import { Randomizer } from './lib/sheets/randomizer';
import type { SheetsManagement } from './lib/sheets/sheets-management';
import { SheetsManager } from './lib/sheets/sheets-manager';
import type { DateRangeParse } from './lib/sheets/date-range-parse';
import { DateRangeParser } from './lib/sheets/date-range-parser';
import type { SheetSpecification } from './lib/sheets/sheet-specification';
// import { DummySpecifier } from './lib/sheets/dummy-specifier';
import { ScheduleSpecifier } from './lib/sheets/schedule-specifier';

import type { EmailExtraction } from './lib/email/email-extraction';
import { SendGridEmailExtractor } from './lib/email/sendgrid-email-extractor';
import type { EmailExtractProcessing } from './lib/email/email-extract-processing';
import { SendGridEmailResponder } from './lib/email/sendgrid-email-responder';
import type { FormDataValidation } from './lib/form-data-validation';
import { SendGridEmailSpamValidator } from './lib/email/sendgrid-email-spam-validator';

const appContainer = new Container();
appContainer.bind<Randomization>(TYPES.Randomization).to(Randomizer);
appContainer.bind<SheetsManagement>(TYPES.SheetsManagement).to(SheetsManager);
appContainer.bind<DateRangeParse>(TYPES.DateRangeParse).to(DateRangeParser);
appContainer.bind<SheetSpecification>(TYPES.SheetSpecification).to(ScheduleSpecifier);
appContainer.bind<EmailExtraction>(TYPES.EmailExtraction).to(SendGridEmailExtractor);
appContainer.bind<EmailExtractProcessing>(TYPES.EmailExtractProcessing).to(SendGridEmailResponder);
appContainer.bind<FormDataValidation>(TYPES.SpamValidation).to(SendGridEmailSpamValidator);

// constants
appContainer.bind<number>(TYPES.DEVARIANCE_COEF).toConstantValue(0.01);
appContainer.bind<string>(TYPES.SCHEDULER_TO_DOMAIN).toConstantValue(process.env.SCHEDULER_TO_DOMAIN as string);
appContainer.bind<string>(TYPES.SCHEDULER_FROM_EMAIL).toConstantValue(process.env.SCHEDULER_FROM_EMAIL as string);
appContainer.bind<string>(TYPES.SENDGRID_API_KEY).toConstantValue(process.env.SENDGRID_API_KEY as string);
appContainer.bind<string>(TYPES.SENDGRID_SCHEDULE_TEMPLATE_ID).toConstantValue(process.env.SENDGRID_SCHEDULE_TEMPLATE_ID as string);

export { appContainer };