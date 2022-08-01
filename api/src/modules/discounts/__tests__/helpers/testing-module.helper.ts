import { ITestingModule } from "~/utils/testing-module.interface";
import DiscountsModule from "../../discounts.module";

export default class TestingModule extends ITestingModule {
  init(): Promise<void> {
    return super.init([DiscountsModule]);
  }

  clearDataSource(): Promise<void> {
    return this.dataSource.query("TRUNCATE discounts CASCADE");
  }
}
