import { DataSource } from "typeorm";
import ModifierCategoryEntity from "~/db/entities/modifier-category.entity";
import ModifiersSeeder from "~/db/seeds/modifier.seed";

export function createModifierHelper(
  dataSource: DataSource,
  category: ModifierCategoryEntity
) {
  const seeder = new ModifiersSeeder(dataSource);
  return seeder.seed({ category_uuid: category.uuid, category });
}

export default function createModifiersHelper(
  dataSource: DataSource,
  categories: ModifierCategoryEntity[]
) {
  const seeder = new ModifiersSeeder(dataSource);
  return seeder.run(
    categories.length,
    categories.map(category => ({ category_uuid: category.uuid, category }))
  );
}
