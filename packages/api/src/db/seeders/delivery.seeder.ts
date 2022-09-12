import { faker } from "@faker-js/faker";
import { DataSource, QueryRunner } from "typeorm";
import ISeeder, { IFactory } from "~/utils/seeder.interface";
import DeliveryEntity, {
  DeliveryCriteriaEnum,
  DeliveryOperatorEnum,
  DeliveryTypeEnum,
} from "../entities/delivery.entity";

export class DeliveryFactory extends IFactory<DeliveryEntity> {
  create(options?: Partial<DeliveryEntity>): DeliveryEntity {
    const e = new DeliveryEntity();
    e.uuid = options?.uuid ?? faker.datatype.uuid();
    e.name = options?.name ?? faker.datatype.string();
    e.article_number = options?.article_number ?? faker.datatype.number();
    e.type = options?.type ?? DeliveryTypeEnum.PERCENT;
    e.condition = options?.condition ?? {
      criteria: DeliveryCriteriaEnum.PRICE,
      op: DeliveryOperatorEnum.GREATER,
      value: faker.datatype.number({ min: 1000, max: 5000 }),
    };
    e.value = options?.value ?? faker.datatype.number({ min: 5, max: 10 });
    return e;
  }
}

export default class DeliverySeeder extends ISeeder<DeliveryEntity> {
  constructor(q: QueryRunner) {
    super(q, new DeliveryFactory());
  }
}
