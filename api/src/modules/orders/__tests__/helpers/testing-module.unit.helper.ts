import { HttpService } from "@nestjs/axios";
import { Test, TestingModule } from "@nestjs/testing";
import DeliveriesService from "~/modules/delivery/deliveries.service";
import DiscountsService from "~/modules/discounts/discounts.service";
import ModifiersService from "~/modules/modifiers/modifiers.service";
import ProductsService from "~/modules/products/products.service";
import { ITestingModule } from "~/utils/testing-module.interface";
import OrdersService from "../../orders.service";

export default class UnitTestingModule extends ITestingModule {
  protected compile(): Promise<TestingModule> {
    return Test.createTestingModule({
      providers: [
        HttpService,
        OrdersService,
        ProductsService,
        ModifiersService,
        DiscountsService,
        DeliveriesService,
      ],
    })
      .overrideProvider(HttpService)
      .useValue({})
      .overrideProvider(ProductsService)
      .useValue({ find: jest.fn() })
      .overrideProvider(ModifiersService)
      .useValue({ find: jest.fn() })
      .overrideProvider(DiscountsService)
      .useValue({ find: jest.fn(), calculate: jest.fn() })
      .overrideProvider(DeliveriesService)
      .useValue({
        findOne: jest.fn(),
        getAvailableDeliveries: jest.fn(),
        calculate: jest.fn(),
      })
      .compile();
  }

  init(): Promise<void> {
    return super.initMock();
  }

  async clearDataSource(): Promise<void> {}
}
