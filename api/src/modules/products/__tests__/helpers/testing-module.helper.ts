import ModifiersModule from "~/modules/modifiers/modifiers.module";
import { ITestingModule } from "~/utils/testing-module.interface";
import ProductsModule from "../../products.module";

export default class TestingModule extends ITestingModule {
  init(): Promise<void> {
    return super.init([ProductsModule, ModifiersModule]);
  }

  async clearDataSource(): Promise<void> {
    await this.dataSource.query("TRUNCATE products CASCADE");
  }
}
