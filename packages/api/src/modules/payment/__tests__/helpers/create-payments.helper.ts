import { DataSource } from "typeorm";
import PaymentEntity from "~/db/entities/payment.entity";
import PaymentSeeder from "~/db/seeds/payment.seed";

export const createPaymentsHelper = (
  dataSource: DataSource
): Promise<PaymentEntity[]> => {
  const seeder = new PaymentSeeder(dataSource);
  return seeder.run(10);
};

export const createPaymentHelper = (
  dataSource: DataSource,
  options?: Partial<PaymentEntity>
): Promise<PaymentEntity> => {
  const seeder = new PaymentSeeder(dataSource);
  return seeder.seed(options);
};
