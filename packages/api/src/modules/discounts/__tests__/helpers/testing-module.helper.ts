import AuthModule from "~/modules/auth/auth.module";
import { ITestingModule } from "~/utils/testing-module.interface";
import DiscountsModule from "../../discounts.module";

export default class TestingModule extends ITestingModule {
  init(): Promise<void> {
    return super.init([AuthModule, DiscountsModule]);
  }

  clearDataSource(): Promise<void> {
    return this.dataSource.query(
      "TRUNCATE discounts, discount_strategies CASCADE"
    );
  }
}
