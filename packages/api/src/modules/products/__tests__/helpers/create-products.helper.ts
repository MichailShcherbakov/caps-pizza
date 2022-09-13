import ProductCategoryEntity from "~/db/entities/product-category.entity";
import ProductEntity from "~/db/entities/product.entity";
import ProductsSeeder from "~/db/seeders/product.seeder";
import deleteObjectPropsHelper, {
  deleteObjectsPropsHelper,
} from "~/utils/__tests__/helpers/delete-object-props.helper";
import { ITestingModule } from "~/utils/__tests__/interfaces/testing-module.interface";

export default function createProductsHelper(
  testingModule: ITestingModule,
  categories: ProductCategoryEntity[]
): Promise<ProductEntity[]> {
  const seeder = new ProductsSeeder(testingModule.queryRunner);
  return seeder
    .createManyFrom(
      categories.map(c => ({
        category_uuid: c.uuid,
        category: c,
      }))
    )
    .then(
      products =>
        deleteObjectsPropsHelper(products, [
          "updated_at",
          "created_at",
        ]) as ProductEntity[]
    );
}

export function createProductHelper(
  testingModule: ITestingModule,
  category: ProductCategoryEntity
): Promise<ProductEntity> {
  const seeder = new ProductsSeeder(testingModule.queryRunner);
  return seeder
    .create({ category_uuid: category.uuid, category })
    .then(
      product =>
        deleteObjectPropsHelper(product, [
          "updated_at",
          "created_at",
        ]) as ProductEntity
    );
}
