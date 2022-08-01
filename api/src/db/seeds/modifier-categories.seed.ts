import { faker } from "@faker-js/faker";
import { DataSource } from "typeorm";
import ISeeder, { IFactory } from "~/utils/seeder.interface";
import ModifierCategoryEntity from "../entities/modifier-category.entity";

export class ModifierCategoriesFactory extends IFactory<ModifierCategoryEntity> {
  create(
    options: Partial<ModifierCategoryEntity> = {}
  ): ModifierCategoryEntity {
    const newModifierCategory = new ModifierCategoryEntity();
    newModifierCategory.name = options.name || faker.word.noun();
    newModifierCategory.image_url = options.image_url;
    return newModifierCategory;
  }
}

export default class ModifierCategoriesSeeder extends ISeeder<ModifierCategoryEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, new ModifierCategoriesFactory());
  }
}
