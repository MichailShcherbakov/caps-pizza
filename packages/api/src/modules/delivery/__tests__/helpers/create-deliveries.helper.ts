import DeliveryEntity from "~/db/entities/delivery.entity";
import DeliverySeeder from "~/db/seeders/delivery.seeder";
import { ITestingModule } from "~/utils/testing-module.interface";

export const createDeliveriesHelper = (
  testingModule: ITestingModule
): Promise<DeliveryEntity[]> => {
  const seeder = new DeliverySeeder(testingModule.queryRunner);
  return seeder.run(10);
};

export const createDeliveryHelper = (
  testingModule: ITestingModule,
  options: Partial<DeliveryEntity> = {}
): Promise<DeliveryEntity> => {
  const seeder = new DeliverySeeder(testingModule.queryRunner);
  return seeder.seed(options);
};
