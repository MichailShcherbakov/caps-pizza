import { DataSource } from "typeorm";
import ModifierCategoryEntity from "~/db/entities/modifier-category.entity";
import ModifierCategoriesSeeder from "~/db/seeds/modifier-categories.seed";
import deleteObjectPropsHelper, {
  deleteObjectsPropsHelper,
} from "~/utils/delete-object-props.helper";

export default function createModifierCategoriesHelper(
  dataSource: DataSource
): Promise<ModifierCategoryEntity[]> {
  const seeder = new ModifierCategoriesSeeder(dataSource);
  return seeder
    .run(10)
    .then(
      categories =>
        deleteObjectsPropsHelper(categories, [
          "updated_at",
          "created_at",
        ]) as ModifierCategoryEntity[]
    );
}

export function createModifierCategoryHelper(
  dataSource: DataSource
): Promise<ModifierCategoryEntity> {
  const seeder = new ModifierCategoriesSeeder(dataSource);
  return seeder
    .seed()
    .then(
      category =>
        deleteObjectPropsHelper(category, [
          "updated_at",
          "created_at",
        ]) as ModifierCategoryEntity
    );
}
