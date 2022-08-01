import { DataSource } from "typeorm";
import ProductCategoryEntity from "~/db/entities/product-category.entity";
import ProductCategoriesSeeder from "~/db/seeds/product-category.seed";

export default function createProductCategoriesHelper(
  dataSource: DataSource
): Promise<ProductCategoryEntity[]> {
  const seeder = new ProductCategoriesSeeder(dataSource);
  return seeder.run(10);
}

export const createProductCategoryHelper = (
  dataSource: DataSource
): Promise<ProductCategoryEntity> => {
  const seeder = new ProductCategoriesSeeder(dataSource);
  return seeder.seed();
};
