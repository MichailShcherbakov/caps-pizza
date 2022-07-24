import { DataSource } from "typeorm";
import CategoryEntity from "~/db/entities/category.entity";
import CategoriesSeeder from "~/db/seeds/category.seed";

export const createCategoriesHelper = (
  dataSource: DataSource
): Promise<CategoryEntity[]> => {
  const seeder = new CategoriesSeeder(dataSource);
  return seeder.run(10);
};

export const createCategoryHelper = (
  dataSource: DataSource
): Promise<CategoryEntity> => {
  const seeder = new CategoriesSeeder(dataSource);
  return seeder.seed();
};

export default createCategoriesHelper;
