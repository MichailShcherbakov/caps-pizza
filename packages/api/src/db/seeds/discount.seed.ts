import { DataSource } from "typeorm";
import { faker } from "@faker-js/faker";
import ISeeder, { IFactory } from "~/utils/seeder.interface";
import DiscountEntity, { DiscountTypeEnum } from "../entities/discount.entity";

export class DiscountsFactory extends IFactory<DiscountEntity> {
  create(options: Partial<DiscountEntity> = {}): DiscountEntity {
    const e = new DiscountEntity();
    e.name = options.name ?? faker.datatype.string();
    e.type = options.type ?? DiscountTypeEnum.PERCENT;
    e.value = options.value ?? faker.datatype.number({ min: 1, max: 30 });
    e.strategies = options.strategies ?? [];
    return e;
  }
}

export default class DiscountsSeeder extends ISeeder<DiscountEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, new DiscountsFactory());
  }
}
