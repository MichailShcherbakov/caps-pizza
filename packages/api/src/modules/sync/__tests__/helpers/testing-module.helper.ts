import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import DeliveryEntity from "~/db/entities/delivery.entity";
import ModifierCategoryEntity from "~/db/entities/modifier-category.entity";
import ModifierEntity from "~/db/entities/modifier.entity";
import ProductCategoryEntity from "~/db/entities/product-category.entity";
import ProductEntity from "~/db/entities/product.entity";
import DeliveriesModule from "~/modules/delivery/deliveries.module";
import DeliveriesService from "~/modules/delivery/deliveries.service";
import ModifiersModule from "~/modules/modifiers/modifiers.module";
import ModifiersService from "~/modules/modifiers/modifiers.service";
import ProductsModule from "~/modules/products/products.module";
import ProductsService from "~/modules/products/products.service";
import { ITestingModule, Module } from "~/utils/testing-module.interface";
import SyncModule from "../../sync.module";

export default class UnitTestingModule extends ITestingModule {
  protected compile(modules: Module[]): Promise<TestingModule> {
    return Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([
          ProductEntity,
          ProductCategoryEntity,
          ModifierEntity,
          ModifierCategoryEntity,
          DeliveryEntity,
        ]),
        ...modules,
      ],
    })
      .overrideProvider(getRepositoryToken(ProductEntity))
      .useValue({})
      .overrideProvider(getRepositoryToken(ProductCategoryEntity))
      .useValue({})
      .overrideProvider(getRepositoryToken(ModifierEntity))
      .useValue({})
      .overrideProvider(getRepositoryToken(ModifierCategoryEntity))
      .useValue({})
      .overrideProvider(getRepositoryToken(DeliveryEntity))
      .useValue({})
      .overrideProvider(ProductsService)
      .useValue({ findOne: jest.fn() })
      .overrideProvider(ModifiersService)
      .useValue({ findOne: jest.fn() })
      .overrideProvider(DeliveriesService)
      .useValue({ findOne: jest.fn() })
      .compile();
  }

  init(): Promise<void> {
    return super.initMock([
      SyncModule,
      ProductsModule,
      ModifiersModule,
      DeliveriesModule,
    ]);
  }

  async clearDataSource(): Promise<void> {}
}
