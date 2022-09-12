import { faker } from "@faker-js/faker";
import { QueryRunner } from "typeorm";
import ISeeder, { IFactory } from "~/utils/seeder.interface";
import ModifierCategoryEntity from "../entities/modifier-category.entity";

export class ModifierCategoriesFactory extends IFactory<ModifierCategoryEntity> {
  create(
    options: Partial<ModifierCategoryEntity> = {}
  ): ModifierCategoryEntity {
    const newModifierCategory = new ModifierCategoryEntity();
    newModifierCategory.name = options.name ?? faker.datatype.string();
    newModifierCategory.image_url = options.image_url;
    newModifierCategory.display_position =
      options.display_position ?? faker.datatype.number({ min: 1, max: 5 });
    return newModifierCategory;
  }
}

export default class ModifierCategoriesSeeder extends ISeeder<ModifierCategoryEntity> {
  constructor(q: QueryRunner) {
    super(q, new ModifierCategoriesFactory());
  }
}
