import { ITestingModule } from "~/utils/testing-module.interface";
import ProductsModule from "../../products.module";

export default class TestingModule extends ITestingModule {
  init(): Promise<void> {
    return super.init([ProductsModule]);
  }

  async clearDataSource(): Promise<void> {
    await this.dataSource.query(
      "TRUNCATE products, product_categories CASCADE"
    );
  }
}
