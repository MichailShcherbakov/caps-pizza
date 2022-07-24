import { DataSource } from "typeorm";
import { faker } from "@faker-js/faker";
import ISeeder, { IFactory } from "~/utils/seeder.interface";
import CategoryEntity from "../entities/category.entity";

export class CategoriesFactory extends IFactory<CategoryEntity> {
  create(options: Partial<CategoryEntity> = {}): CategoryEntity {
    const e = new CategoryEntity();
    e.name = options.name || faker.commerce.productName();
    e.image_url = options.image_url || faker.image.imageUrl();
    return e;
  }
}

export class CategoriesSeeder extends ISeeder<CategoryEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, new CategoriesFactory());
  }
}

export default CategoriesSeeder;
