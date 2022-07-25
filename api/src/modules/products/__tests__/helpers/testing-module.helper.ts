import { ITestingModule } from "~/utils/testing-module.interface";
import ProductsModule from "../../products.module";

export class TestingModule extends ITestingModule {
  async init() {
    await super.init([ProductsModule]);
  }

  async clearDataSource(): Promise<void> {
    await this.dataSource.query("TRUNCATE products, categories CASCADE");
  }
}

export default TestingModule;
