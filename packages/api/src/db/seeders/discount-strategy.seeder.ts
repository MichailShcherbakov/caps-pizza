import { QueryRunner } from "typeorm";
import ISeeder, { IFactory } from "~/utils/seeder.interface";
import {
  DiscountCriteriaEnum,
  DiscountOperatorEnum,
} from "../entities/discount.entity";
import DiscountStrategyEntity from "../entities/discount-strategy.entity";

export type DiscountStrategiesFactoryOptions = Partial<DiscountStrategyEntity> &
  Pick<DiscountStrategyEntity, "discount_uuid">;

export class DiscountStrategiesFactory extends IFactory<DiscountStrategyEntity> {
  create(options: DiscountStrategiesFactoryOptions): DiscountStrategyEntity {
    const e = new DiscountStrategyEntity();
    e.discount_uuid = options.discount_uuid;
    e.discount = options.discount;
    e.condition = options.condition ?? {
      criteria: DiscountCriteriaEnum.PRICE,
      op: DiscountOperatorEnum.GREATER,
      value: 950,
    };
    e.products = options.products ?? [];
    e.product_categories = options.product_categories ?? [];
    e.modifiers = options.modifiers ?? [];
    return e;
  }
}

export default class DiscountStrategiesSeeder extends ISeeder<DiscountStrategyEntity> {
  constructor(q: QueryRunner) {
    super(q, new DiscountStrategiesFactory());
  }
}
