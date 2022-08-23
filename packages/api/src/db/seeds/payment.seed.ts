import { faker } from "@faker-js/faker";
import { DataSource } from "typeorm";
import ISeeder, { IFactory } from "~/utils/seeder.interface";
import PaymentEntity from "../entities/payment.entity";

export class PaymentFactory extends IFactory<PaymentEntity> {
  create(options?: Partial<PaymentEntity>): PaymentEntity {
    const e = new PaymentEntity();
    e.uuid = options?.uuid ?? faker.datatype.uuid();
    e.name = options?.name ?? faker.datatype.string();
    e.code = options?.code ?? faker.datatype.number();
    return e;
  }
}

export default class PaymentSeeder extends ISeeder<PaymentEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, new PaymentFactory());
  }
}
