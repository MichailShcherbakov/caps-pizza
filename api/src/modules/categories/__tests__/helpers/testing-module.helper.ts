import { ITestingModule } from "~/utils/testing-module.interface";
import CategoriesModule from "../../categories.module";

export class TestingModule extends ITestingModule {
  async init() {
    await super.init([CategoriesModule]);
  }
}

export default TestingModule;
