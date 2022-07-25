import { DataSource } from "typeorm";
import CategoryEntity from "~/db/entities/category.entity";
import ProductEntity from "~/db/entities/product.entity";
import ProductsSeeder from "~/db/seeds/product.seed";

export const createProductsHelper = (
  dataSource: DataSource,
  categories: CategoryEntity[]
): Promise<ProductEntity[]> => {
  const seeder = new ProductsSeeder(dataSource);
  return seeder.run(
    categories.length,
    categories.map((c) => ({ category_uuid: c.uuid }))
  );
};

export default createProductsHelper;
