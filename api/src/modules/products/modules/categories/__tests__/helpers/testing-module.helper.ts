import ProductsModule from "~/modules/products/products.module";
import { ITestingModule } from "~/utils/testing-module.interface";

export class TestingModule extends ITestingModule {
  async init(): Promise<void> {
    await super.init([ProductsModule]);
  }

  async clearDataSource(): Promise<void> {
    await this.dataSource.query("TRUNCATE product_categories CASCADE");
  }
}

export default TestingModule;
