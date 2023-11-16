import { Container } from "inversify";
import { TYPES } from "./inversify-types";
import type { Randomization } from './lib/sheets/randomization';
import { DummyRandomizer } from './lib/sheets/dummy-randomizer';
import type { SheetsManagement } from './lib/sheets/sheets-management';
import { SheetsManager } from './lib/sheets/sheets-manager';
import type { DateRangeParse } from './lib/sheets/date-range-parse';
import { DateRangeParser } from './lib/sheets/date-range-parser';

const appContainer = new Container();
appContainer.bind<Randomization>(TYPES.Randomization).to(DummyRandomizer);
appContainer.bind<SheetsManagement>(TYPES.SheetsManagement).to(SheetsManager);
appContainer.bind<DateRangeParse>(TYPES.DateRangeParse).to(DateRangeParser);

export { appContainer };