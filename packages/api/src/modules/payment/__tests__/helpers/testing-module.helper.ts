import AuthModule from "~/modules/auth/auth.module";
import { ITestingModule } from "~/utils/testing-module.interface";
import PaymentModule from "../../payment.module";

export default class TestingModule extends ITestingModule {
  async init(): Promise<void> {
    await super.init([AuthModule, PaymentModule]);
  }

  async clearDataSource(): Promise<void> {
    await this.queryRunner.query("TRUNCATE payments CASCADE");
  }
}
