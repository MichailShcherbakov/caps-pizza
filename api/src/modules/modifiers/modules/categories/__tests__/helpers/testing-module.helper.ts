import ModifiersModule from "~/modules/modifiers/modifiers.module";
import { ITestingModule } from "~/utils/testing-module.interface";

export default class TestingModule extends ITestingModule {
  async init() {
    await super.init([ModifiersModule]);
  }

  clearDataSource(): Promise<void> {
    return this.dataSource.query("TRUNCATE modifier_categories CASCADE");
  }
}
