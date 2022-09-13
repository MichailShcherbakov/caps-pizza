import AuthModule from "~/modules/auth/auth.module";
import ProductsModule from "~/modules/products/products.module";
import { ITestingModule } from "~/utils/__tests__/interfaces/testing-module.interface";

export class TestingModule extends ITestingModule {
  async init(): Promise<void> {
    await super.init([AuthModule, ProductsModule]);
  }

  async clearDataSource(): Promise<void> {
    await this.queryRunner.query("TRUNCATE product_categories CASCADE");
  }
}

export default TestingModule;
