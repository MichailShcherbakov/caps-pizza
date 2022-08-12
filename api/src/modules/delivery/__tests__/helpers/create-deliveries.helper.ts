import { DataSource } from "typeorm";
import DeliveryEntity from "~/db/entities/delivery.entity";
import DeliverySeeder from "~/db/seeds/delivery.seed";

export const createDeliveriesHelper = (
  dataSource: DataSource
): Promise<DeliveryEntity[]> => {
  const seeder = new DeliverySeeder(dataSource);
  return seeder.run(10);
};

export const createDeliveryHelper = (
  dataSource: DataSource,
  options?: Partial<DeliveryEntity>
): Promise<DeliveryEntity> => {
  const seeder = new DeliverySeeder(dataSource);
  return seeder.seed(options);
};
