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

const appContainer = new Container();
appContainer.bind<Randomization>(TYPES.Randomization).to(Randomizer);
appContainer.bind<SheetsManagement>(TYPES.SheetsManagement).to(SheetsManager);
appContainer.bind<DateRangeParse>(TYPES.DateRangeParse).to(DateRangeParser);
appContainer.bind<SheetSpecification>(TYPES.SheetSpecification).to(ScheduleSpecifier);
appContainer.bind<EmailExtraction>(TYPES.SendGridEmailExtractor).to(SendGridEmailExtractor);
appContainer.bind<EmailExtractProcessing>(TYPES.SendGridEmailResponder).to(SendGridEmailResponder);

// constants
appContainer.bind<number>(TYPES.DEVARIANCE_COEF).toConstantValue(0.01);
appContainer.bind<string>(TYPES.SCHEDULE_ENTRY_EMAIL).toConstantValue(process.env.SCHEDULE_ENTRY_EMAIL as string);
appContainer.bind<string>(TYPES.SCHEDULER_RESPONDER_EMAIL).toConstantValue(process.env.SCHEDULER_RESPONDER_EMAIL as string);
appContainer.bind<string>(TYPES.SENDGRID_API_KEY).toConstantValue(process.env.SENDGRID_API_KEY as string);

export { appContainer };