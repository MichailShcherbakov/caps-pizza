import AuthModule from "~/modules/auth/auth.module";
import SyncService from "~/modules/sync/sync.service";
import { ITestingModule } from "~/utils/__tests__/interfaces/testing-module.interface";
import DeliveryModule from "../../deliveries.module";

export default class TestingModule extends ITestingModule {
  async init(): Promise<void> {
    await super.init([AuthModule, DeliveryModule]);

    const syncService = this.get<SyncService>(SyncService);
    syncService.syncWithFrontPad = jest.fn(() => Promise.resolve(true));
  }

  async clearDataSource(): Promise<void> {
    await this.queryRunner.query("TRUNCATE deliveries CASCADE");
  }
}
