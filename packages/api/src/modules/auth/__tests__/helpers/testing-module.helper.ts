import { ITestingModule } from "~/utils/__tests__/interfaces/testing-module.interface";
import AuthModule from "../../auth.module";

export default class TestingModule extends ITestingModule {
  async init(): Promise<void> {
    await super.init([AuthModule]);
  }

  async clearDataSource(): Promise<void> {
    await this.dataSource.query("TRUNCATE users CASCADE");
  }
}
