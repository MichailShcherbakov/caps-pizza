import { DataSource } from "typeorm";
import ModifierCategoryEntity from "~/db/entities/modifier-category.entity";
import ModifiersSeeder from "~/db/seeds/modifier.seed";

export default function createModifiersHelper(
  dataSource: DataSource,
  categories: ModifierCategoryEntity[]
) {
  const seeder = new ModifiersSeeder(dataSource);
  return seeder.run(
    categories.length,
    categories.map(c => ({ category_uuid: c.uuid }))
  );
}
