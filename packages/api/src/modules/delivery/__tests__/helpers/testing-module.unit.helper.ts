import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import DeliveryEntity from "~/db/entities/delivery.entity";
import SyncService from "~/modules/sync/sync.service";
import { ITestingModule } from "~/utils/__tests__/interfaces/testing-module.interface";
import DeliveriesService from "../../deliveries.service";

export default class UnitTestingModule extends ITestingModule {
  protected compile(): Promise<TestingModule> {
    return Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([DeliveryEntity])],
      providers: [DeliveriesService, SyncService],
    })
      .overrideProvider(getRepositoryToken(DeliveryEntity))
      .useValue({
        find: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn(),
        delete: jest.fn(),
      })
      .overrideProvider(SyncService)
      .useValue({})
      .compile();
  }

  init(): Promise<void> {
    return super.initMock();
  }

  async clearDataSource(): Promise<void> {}
}
