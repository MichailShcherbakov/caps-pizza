import { ITestingModule } from "~/utils/testing-module.interface";
import OrdersModule from "../../orders.module";

export default class TestingModule extends ITestingModule {
  init(): Promise<void> {
    return super.init([OrdersModule]);
  }

  clearDataSource(): Promise<void> {
    return this.dataSource.query(
      "TRUNCATE products, product_categories, modifiers, modifier_categories CASCADE"
    );
  }
}
