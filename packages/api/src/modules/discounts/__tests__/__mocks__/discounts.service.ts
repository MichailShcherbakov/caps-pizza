import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import DiscountEntity from "~/db/entities/discount.entity";
import ModifiersService from "~/modules/modifiers/modifiers.service";
import ProductCategoriesService from "~/modules/products/modules/categories/categories.service";
import ProductsService from "~/modules/products/products.service";
import { ITestingModule } from "~/utils/testing-module.interface";
import DiscountsModule from "../../discounts.module";
import DiscountsService from "../../discounts.service";

export class UnitTestingModule extends ITestingModule {
  protected compile(): Promise<TestingModule> {
    return Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([DiscountEntity])],
      providers: [
        DiscountsService,
        ProductsService,
        ProductCategoriesService,
        ModifiersService,
      ],
    })
      .overrideProvider(getRepositoryToken(DiscountEntity))
      .useValue({
        find: jest.fn(),
      })
      .overrideProvider(ProductCategoriesService)
      .useValue({ find: jest.fn() })
      .overrideProvider(ProductsService)
      .useValue({ find: jest.fn() })
      .overrideProvider(ModifiersService)
      .useValue({ find: jest.fn() })
      .compile();
  }

  init(): Promise<void> {
    return super.initMock([DiscountsModule]);
  }

  async clearDataSource(): Promise<void> {}
}
