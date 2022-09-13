import { faker } from "@faker-js/faker";
import { QueryRunner } from "typeorm";
import ISeeder, { IFactory } from "~/utils/seeder.interface";
import PromotionEntity from "../entities/promotion.entity";

export class PromotionFactory extends IFactory<PromotionEntity> {
  create(options?: Partial<PromotionEntity>): PromotionEntity {
    const e = new PromotionEntity();
    e.name = options?.name ?? faker.datatype.string();
    e.image_url = options?.image_url ?? faker.datatype.string();
    e.display = options?.display ?? true;
    e.display_position = options?.display_position ?? faker.datatype.number();
    return e;
  }
}

export default class PromotionSeeder extends ISeeder<PromotionEntity> {
  constructor(q: QueryRunner) {
    super(q, new PromotionFactory());
  }
}
