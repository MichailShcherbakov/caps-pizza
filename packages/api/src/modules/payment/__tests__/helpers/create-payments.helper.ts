import { DataSource } from "typeorm";
import PaymentEntity from "~/db/entities/payment.entity";
import PaymentSeeder from "~/db/seeders/payment.seeder";

export const createPaymentsHelper = (
  dataSource: DataSource
): Promise<PaymentEntity[]> => {
  const seeder = new PaymentSeeder(dataSource.createQueryRunner());
  return seeder.run(10);
};

export const createPaymentHelper = (
  dataSource: DataSource,
  options: Partial<PaymentEntity>
): Promise<PaymentEntity> => {
  const seeder = new PaymentSeeder(dataSource.createQueryRunner());
  return seeder.seed(options);
};
