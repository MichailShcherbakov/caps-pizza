import AuthModule from "~/modules/auth/auth.module";
import ModifiersModule from "~/modules/modifiers/modifiers.module";
import { ITestingModule } from "~/utils/testing-module.interface";

export default class TestingModule extends ITestingModule {
  async init() {
    await super.init([AuthModule, ModifiersModule]);
  }

  clearDataSource(): Promise<void> {
    return this.queryRunner.query("TRUNCATE modifier_categories CASCADE");
  }
}
