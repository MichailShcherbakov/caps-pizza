import { DataSource } from "typeorm";
import { faker } from "@faker-js/faker";
import ISeeder, { IFactory } from "~/utils/seeder.interface";
import DiscountEntity, {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
  DiscountTypeEnum,
} from "../entities/discount.entity";

export class DiscountsFactory extends IFactory<DiscountEntity> {
  create(options: Partial<DiscountEntity> = {}): DiscountEntity {
    const e = new DiscountEntity();
    e.name = options.name ?? faker.word.noun();
    e.type = options.type ?? DiscountTypeEnum.PERCENT;
    e.condition = options.condition ?? {
      criteria: DiscountCriteriaEnum.PRICE,
      op: DiscountOperatorEnum.GREATER,
      value: faker.datatype.number({ min: 2000, max: 5000 }),
    };
    e.value = options.value ?? faker.datatype.number({ min: 1, max: 30 });
    e.products = options.products ?? [];
    e.product_categories = options.product_categories ?? [];
    e.modifiers = options.modifiers ?? [];
    return e;
  }
}

export default class DiscountsSeeder extends ISeeder<DiscountEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, new DiscountsFactory());
  }
}
