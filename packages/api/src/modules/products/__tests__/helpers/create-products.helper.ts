import { DataSource } from "typeorm";
import ProductCategoryEntity from "~/db/entities/product-category.entity";
import ProductEntity from "~/db/entities/product.entity";
import ProductsSeeder from "~/db/seeds/product.seed";

export default function createProductsHelper(
  dataSource: DataSource,
  categories: ProductCategoryEntity[]
): Promise<ProductEntity[]> {
  const seeder = new ProductsSeeder(dataSource);
  return seeder.run(
    categories.length,
    categories.map(category => ({ category_uuid: category.uuid, category }))
  );
}

export function createProductHelper(
  dataSource: DataSource,
  category: ProductCategoryEntity
): Promise<ProductEntity> {
  const seeder = new ProductsSeeder(dataSource);
  return seeder.seed({ category_uuid: category.uuid, category });
}
