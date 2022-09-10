import AuthModule from "~/modules/auth/auth.module";
import ModifiersModule from "~/modules/modifiers/modifiers.module";
import SyncService from "~/modules/sync/sync.service";
import { ITestingModule } from "~/utils/testing-module.interface";
import PromotionsModule from "../../promotions.module";

export default class TestingModule extends ITestingModule {
  async init(): Promise<void> {
    await super.init([AuthModule, PromotionsModule, ModifiersModule]);

    const syncService = this.get<SyncService>(SyncService);
    syncService.syncWithFrontPad = jest.fn(() => Promise.resolve(true));
  }

  async clearDataSource(): Promise<void> {
    await this.dataSource.query("TRUNCATE promotions CASCADE");
  }
}
