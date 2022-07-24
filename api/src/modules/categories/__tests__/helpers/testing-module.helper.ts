import { ITestingModule } from "~/utils/testing-module.interface";
import CategoriesModule from "../../categories.module";

export class TestingModule extends ITestingModule {
  async init(): Promise<void> {
    await super.init([CategoriesModule]);
  }

  async clearDataSource(): Promise<void> {
    await this.dataSource.query("TRUNCATE categories CASCADE");
  }
}

export default TestingModule;
