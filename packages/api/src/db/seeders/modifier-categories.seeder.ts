import { faker } from "@faker-js/faker";
import { QueryRunner } from "typeorm";
import {
  ModifierCategoryChoiceOptionEnum,
  ModifierCategoryDisplayVariantEnum,
} from "@monorepo/common";
import ISeeder, { IFactory } from "~/utils/seeder.interface";
import ModifierCategoryEntity from "../entities/modifier-category.entity";

export class ModifierCategoriesFactory extends IFactory<ModifierCategoryEntity> {
  create(
    options: Partial<ModifierCategoryEntity> = {}
  ): ModifierCategoryEntity {
    const newModifierCategory = new ModifierCategoryEntity();
    newModifierCategory.name = options.name ?? faker.datatype.uuid();
    newModifierCategory.image_url = options.image_url;
    newModifierCategory.choice_option =
      options.choice_option ?? ModifierCategoryChoiceOptionEnum.ONE;
    newModifierCategory.display = options.display ?? true;
    newModifierCategory.display_name = options.display_name;
    newModifierCategory.display_variant =
      options.display_variant ?? ModifierCategoryDisplayVariantEnum.SWITCHER;
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
