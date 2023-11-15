import { Container } from "inversify";
import { TYPES } from "./inversify-types";
import type { Randomization } from './lib/sheets/randomization';
import { DummyRandomizer } from './lib/sheets/dummy-randomizer';
import type { SheetsManagement } from './lib/sheets/sheets-management';
import { SheetsManager } from './lib/sheets/sheets-manager';

const appContainer = new Container();
appContainer.bind<Randomization>(TYPES.Randomization).to(DummyRandomizer);
appContainer.bind<SheetsManagement>(TYPES.SheetsManagement).to(SheetsManager);

export { appContainer };