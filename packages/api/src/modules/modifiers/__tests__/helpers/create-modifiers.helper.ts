import ModifierCategoryEntity from "~/db/entities/modifier-category.entity";
import ModifierEntity from "~/db/entities/modifier.entity";
import ModifiersSeeder from "~/db/seeders/modifier.seeder";
import deleteObjectPropsHelper, {
  deleteObjectsPropsHelper,
} from "~/utils/__tests__/helpers/delete-object-props.helper";
import { ITestingModule } from "~/utils/__tests__/interfaces/testing-module.interface";

export function createModifierHelper(
  testingModule: ITestingModule,
  category: ModifierCategoryEntity
): Promise<ModifierEntity> {
  const seeder = new ModifiersSeeder(testingModule.queryRunner);
  return seeder
    .create({ category_uuid: category.uuid, category })
    .then(
      modifier =>
        deleteObjectPropsHelper(modifier, [
          "updated_at",
          "created_at",
        ]) as ModifierEntity
    );
}

export default function createModifiersHelper(
  testingModule: ITestingModule,
  categories: ModifierCategoryEntity[]
) {
  const seeder = new ModifiersSeeder(testingModule.queryRunner);
  return seeder
    .createManyFrom(
      categories.map(c => ({
        category_uuid: c.uuid,
        category: c,
      }))
    )
    .then(
      modifiers =>
        deleteObjectsPropsHelper(modifiers, [
          "updated_at",
          "created_at",
        ]) as ModifierEntity[]
    );
}
