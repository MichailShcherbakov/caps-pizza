import { DataSource } from "typeorm";
import ProductCategoryEntity from "~/db/entities/product-category.entity";
import ProductEntity from "~/db/entities/product.entity";
import ProductsSeeder from "~/db/seeders/product.seeder";
import deleteObjectPropsHelper, {
  deleteObjectsPropsHelper,
} from "~/utils/delete-object-props.helper";

export default function createProductsHelper(
  dataSource: DataSource,
  categories: ProductCategoryEntity[]
): Promise<ProductEntity[]> {
  const seeder = new ProductsSeeder(dataSource.createQueryRunner());
  return seeder
    .run(
      categories.length,
      categories.map(category => ({ category_uuid: category.uuid, category }))
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
  dataSource: DataSource,
  category: ProductCategoryEntity
): Promise<ProductEntity> {
  const seeder = new ProductsSeeder(dataSource.createQueryRunner());
  return seeder
    .seed({ category_uuid: category.uuid, category })
    .then(
      product =>
        deleteObjectPropsHelper(product, [
          "updated_at",
          "created_at",
        ]) as ProductEntity
    );
}
