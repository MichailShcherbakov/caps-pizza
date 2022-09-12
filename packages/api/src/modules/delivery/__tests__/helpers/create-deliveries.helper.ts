import { DataSource } from "typeorm";
import DeliveryEntity from "~/db/entities/delivery.entity";
import DeliverySeeder from "~/db/seeders/delivery.seeder";

export const createDeliveriesHelper = (
  dataSource: DataSource
): Promise<DeliveryEntity[]> => {
  const seeder = new DeliverySeeder(dataSource.createQueryRunner());
  return seeder.run(10);
};

export const createDeliveryHelper = (
  dataSource: DataSource,
  options: Partial<DeliveryEntity>
): Promise<DeliveryEntity> => {
  const seeder = new DeliverySeeder(dataSource.createQueryRunner());
  return seeder.seed(options);
};
