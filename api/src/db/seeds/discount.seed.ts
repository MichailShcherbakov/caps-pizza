import { DataSource } from "typeorm";
import { faker } from "@faker-js/faker";
import ISeeder, { IFactory } from "~/utils/seeder.interface";
import DiscountEntity, {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  DiscountScopeEnum,
  DiscountTypeEnum,
} from "../entities/discount.entity";

export class DiscountsFactory extends IFactory<DiscountEntity> {
  create(options: Partial<DiscountEntity> = {}): DiscountEntity {
    const e = new DiscountEntity();
    e.name = options.name || faker.word.noun();
    e.type = options.type || DiscountTypeEnum.PERCENT;
    e.scope = options.scope || DiscountScopeEnum.GLOBAL;
    e.condition = options.condition || {
      criteria: DiscountCriteriaEnum.PRICE,
      op: DiscountOperatorEnum.GREATER,
      value: faker.datatype.number({ min: 2000, max: 5000 }),
    };
    e.value = faker.datatype.number({ min: 1, max: 30 });
    return e;
  }
}

export default class DiscountsSeeder extends ISeeder<DiscountEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, new DiscountsFactory());
  }
}
