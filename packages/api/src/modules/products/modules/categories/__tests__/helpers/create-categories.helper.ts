import { DataSource } from "typeorm";
import ProductCategoryEntity from "~/db/entities/product-category.entity";
import ProductCategoriesSeeder from "~/db/seeders/product-category.seeder";
import deleteObjectPropsHelper, {
  deleteObjectsPropsHelper,
} from "~/utils/delete-object-props.helper";

export default function createProductCategoriesHelper(
  dataSource: DataSource
): Promise<ProductCategoryEntity[]> {
  const seeder = new ProductCategoriesSeeder(dataSource.createQueryRunner());
  return seeder
    .run(10)
    .then(
      categories =>
        deleteObjectsPropsHelper(categories, [
          "updated_at",
          "created_at",
        ]) as ProductCategoryEntity[]
    );
}

export const createProductCategoryHelper = (
  dataSource: DataSource
): Promise<ProductCategoryEntity> => {
  const seeder = new ProductCategoriesSeeder(dataSource.createQueryRunner());
  return seeder
    .seed({})
    .then(
      category =>
        deleteObjectPropsHelper(category, [
          "updated_at",
          "created_at",
        ]) as ProductCategoryEntity
    );
};
