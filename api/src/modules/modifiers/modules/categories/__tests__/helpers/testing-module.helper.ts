import { ITestingModule } from "~/utils/testing-module.interface";
import ModifierCategoriesModule from "../../categories.module";

export default class TestingModule extends ITestingModule {
  async init() {
    await super.init([ModifierCategoriesModule]);
  }

  clearDataSource(): Promise<void> {
    return this.dataSource.query("TRUNCATE modifier_categories CASCADE");
  }
}
