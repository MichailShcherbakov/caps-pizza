import PaymentEntity from "~/db/entities/payment.entity";
import PaymentSeeder from "~/db/seeders/payment.seeder";
import { ITestingModule } from "~/utils/testing-module.interface";

export const createPaymentsHelper = (
  testingModule: ITestingModule
): Promise<PaymentEntity[]> => {
  const seeder = new PaymentSeeder(testingModule.queryRunner);
  return seeder.run(10);
};

export const createPaymentHelper = (
  testingModule: ITestingModule,
  options: Partial<PaymentEntity> = {}
): Promise<PaymentEntity> => {
  const seeder = new PaymentSeeder(testingModule.queryRunner);
  return seeder.seed(options);
};
