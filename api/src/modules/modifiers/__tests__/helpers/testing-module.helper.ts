import { ITestingModule } from "~/utils/testing-module.interface";
import ModifiersModule from "../../modifiers.module";

export default class TestingModule extends ITestingModule {
  init(): Promise<void> {
    return super.init([ModifiersModule]);
  }

  async clearDataSource(): Promise<void> {
    await this.dataSource.query(
      "TRUNCATE modifiers, modifier_categories CASCADE"
    );
  }
}
