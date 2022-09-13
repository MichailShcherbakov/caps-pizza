import ProductCategoryEntity from "~/db/entities/product-category.entity";
import ProductCategoriesSeeder from "~/db/seeders/product-category.seeder";
import deleteObjectPropsHelper, {
  deleteObjectsPropsHelper,
} from "~/utils/__tests__/helpers/delete-object-props.helper";
import { ITestingModule } from "~/utils/__tests__/interfaces/testing-module.interface";

export default function createProductCategoriesHelper(
  testingModule: ITestingModule
): Promise<ProductCategoryEntity[]> {
  const seeder = new ProductCategoriesSeeder(testingModule.queryRunner);
  return seeder
    .createMany(10)
    .then(
      categories =>
        deleteObjectsPropsHelper(categories, [
          "updated_at",
          "created_at",
        ]) as ProductCategoryEntity[]
    );
}

export const createProductCategoryHelper = (
  testingModule: ITestingModule
): Promise<ProductCategoryEntity> => {
  const seeder = new ProductCategoriesSeeder(testingModule.queryRunner);
  return seeder
    .create()
    .then(
      category =>
        deleteObjectPropsHelper(category, [
          "updated_at",
          "created_at",
        ]) as ProductCategoryEntity
    );
};
