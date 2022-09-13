import ModifierCategoryEntity from "~/db/entities/modifier-category.entity";
import ModifierCategoriesSeeder from "~/db/seeders/modifier-categories.seeder";
import deleteObjectPropsHelper, {
  deleteObjectsPropsHelper,
} from "~/utils/delete-object-props.helper";
import { ITestingModule } from "~/utils/testing-module.interface";

export default function createModifierCategoriesHelper(
  testingModule: ITestingModule
): Promise<ModifierCategoryEntity[]> {
  const seeder = new ModifierCategoriesSeeder(testingModule.queryRunner);
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
  testingModule: ITestingModule
): Promise<ModifierCategoryEntity> {
  const seeder = new ModifierCategoriesSeeder(testingModule.queryRunner);
  return seeder
    .seed({})
    .then(
      category =>
        deleteObjectPropsHelper(category, [
          "updated_at",
          "created_at",
        ]) as ModifierCategoryEntity
    );
}
