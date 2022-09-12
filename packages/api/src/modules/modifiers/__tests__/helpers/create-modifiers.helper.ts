import { DataSource } from "typeorm";
import ModifierCategoryEntity from "~/db/entities/modifier-category.entity";
import ModifierEntity from "~/db/entities/modifier.entity";
import ModifiersSeeder from "~/db/seeders/modifier.seeder";
import deleteObjectPropsHelper, {
  deleteObjectsPropsHelper,
} from "~/utils/delete-object-props.helper";

export function createModifierHelper(
  dataSource: DataSource,
  category: ModifierCategoryEntity
): Promise<ModifierEntity> {
  const seeder = new ModifiersSeeder(dataSource.createQueryRunner());
  return seeder
    .seed({ category_uuid: category.uuid, category })
    .then(
      modifier =>
        deleteObjectPropsHelper(modifier, [
          "updated_at",
          "created_at",
        ]) as ModifierEntity
    );
}

export default function createModifiersHelper(
  dataSource: DataSource,
  categories: ModifierCategoryEntity[]
) {
  const seeder = new ModifiersSeeder(dataSource.createQueryRunner());
  return seeder
    .run(
      categories.length,
      categories.map(category => ({ category_uuid: category.uuid, category }))
    )
    .then(
      modifiers =>
        deleteObjectsPropsHelper(modifiers, [
          "updated_at",
          "created_at",
        ]) as ModifierEntity[]
    );
}
