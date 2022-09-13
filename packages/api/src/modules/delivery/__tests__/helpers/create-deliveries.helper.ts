import DeliveryEntity from "~/db/entities/delivery.entity";
import DeliverySeeder from "~/db/seeders/delivery.seeder";
import { ITestingModule } from "~/utils/__tests__/interfaces/testing-module.interface";

export const createDeliveriesHelper = (
  testingModule: ITestingModule
): Promise<DeliveryEntity[]> => {
  const seeder = new DeliverySeeder(testingModule.queryRunner);
  return seeder.createMany(10);
};

export const createDeliveryHelper = (
  testingModule: ITestingModule,
  options: Partial<DeliveryEntity> = {}
): Promise<DeliveryEntity> => {
  const seeder = new DeliverySeeder(testingModule.queryRunner);
  return seeder.create(options);
};
