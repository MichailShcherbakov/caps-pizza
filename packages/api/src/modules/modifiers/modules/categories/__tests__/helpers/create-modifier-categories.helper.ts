import { DataSource } from "typeorm";
import ModifierCategoryEntity from "~/db/entities/modifier-category.entity";
import ModifierCategoriesSeeder from "~/db/seeds/modifier-categories.seed";

export default function createModifierCategoriesHelper(
  dataSource: DataSource
): Promise<ModifierCategoryEntity[]> {
  const seeder = new ModifierCategoriesSeeder(dataSource);
  return seeder.run(10);
}

export function createModifierCategoryHelper(
  dataSource: DataSource
): Promise<ModifierCategoryEntity> {
  const seeder = new ModifierCategoriesSeeder(dataSource);
  return seeder.seed();
}
