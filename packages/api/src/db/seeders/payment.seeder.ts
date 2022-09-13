import { faker } from "@faker-js/faker";
import { QueryRunner } from "typeorm";
import ISeeder, { IFactory } from "~/utils/seeder.interface";
import PaymentEntity from "../entities/payment.entity";

export class PaymentFactory extends IFactory<PaymentEntity> {
  create(options?: Partial<PaymentEntity>): PaymentEntity {
    const e = new PaymentEntity();
    e.name = options?.name ?? faker.datatype.string();
    e.code = options?.code ?? faker.datatype.number();
    return e;
  }
}

export default class PaymentSeeder extends ISeeder<PaymentEntity> {
  constructor(q: QueryRunner) {
    super(q, new PaymentFactory());
  }
}
