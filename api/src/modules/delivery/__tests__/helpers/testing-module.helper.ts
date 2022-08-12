import SyncService from "~/modules/sync/sync.service";
import { ITestingModule } from "~/utils/testing-module.interface";
import DeliveryModule from "../../deliveries.module";

export default class TestingModule extends ITestingModule {
  async init(): Promise<void> {
    await super.init([DeliveryModule]);

    const syncService = this.get<SyncService>(SyncService);
    syncService.syncWithFrontPad = jest.fn(() => Promise.resolve(true));
  }

  async clearDataSource(): Promise<void> {
    await this.dataSource.query("TRUNCATE deliveries CASCADE");
  }
}
