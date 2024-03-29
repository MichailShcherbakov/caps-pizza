import { faker } from "@faker-js/faker";
import { QueryRunner } from "typeorm";
import ISeeder, { IFactory } from "~/utils/seeder.interface";
import ModifierEntity from "../entities/modifier.entity";

export class ModifiersFactory extends IFactory<ModifierEntity> {
  create(
    options: Partial<Omit<ModifierEntity, "category_uuid">> &
      Pick<ModifierEntity, "category_uuid">
  ): ModifierEntity {
    const newModifier = new ModifierEntity();
    newModifier.name = options.name ?? faker.commerce.productName();
    newModifier.desc = options.desc;
    newModifier.image_url = options.image_url;
    newModifier.article_number =
      options.article_number ??
      faker.datatype.number({ max: 99999, min: 10000 });
    newModifier.price =
      options.price ?? faker.datatype.number({ max: 1000, min: 150 });
    newModifier.category_uuid = options.category_uuid;
    newModifier.category = options.category;
    newModifier.display = options.display ?? true;
    newModifier.display_position =
      options.display_position ?? faker.datatype.number({ max: 5, min: 1 });
    return newModifier;
  }
}

export default class ModifiersSeeder extends ISeeder<ModifierEntity> {
  constructor(q: QueryRunner) {
    super(q, new ModifiersFactory());
  }
}
