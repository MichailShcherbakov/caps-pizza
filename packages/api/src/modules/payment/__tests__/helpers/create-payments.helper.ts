import PaymentEntity from "~/db/entities/payment.entity";
import PaymentSeeder from "~/db/seeders/payment.seeder";
import { ITestingModule } from "~/utils/__tests__/interfaces/testing-module.interface";

export const createPaymentsHelper = (
  testingModule: ITestingModule
): Promise<PaymentEntity[]> => {
  const seeder = new PaymentSeeder(testingModule.queryRunner);
  return seeder.createMany(10);
};

export const createPaymentHelper = (
  testingModule: ITestingModule,
  options: Partial<PaymentEntity> = {}
): Promise<PaymentEntity> => {
  const seeder = new PaymentSeeder(testingModule.queryRunner);
  return seeder.create(options);
};
