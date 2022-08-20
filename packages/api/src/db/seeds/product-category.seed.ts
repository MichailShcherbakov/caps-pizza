import { DataSource } from "typeorm";
import { faker } from "@faker-js/faker";
import ISeeder, { IFactory } from "~/utils/seeder.interface";
import ProductCategoryEntity from "../entities/product-category.entity";

export class ProductCategoriesFactory extends IFactory<ProductCategoryEntity> {
  create(options: Partial<ProductCategoryEntity> = {}): ProductCategoryEntity {
    const e = new ProductCategoryEntity();
    e.name = options.name ?? faker.commerce.productName();
    e.image_url = options.image_url ?? faker.image.imageUrl();
    e.display_position =
      options.display_position ?? faker.datatype.number({ min: 1, max: 5 });
    return e;
  }
}

export default class ProductCategoriesSeeder extends ISeeder<ProductCategoryEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, new ProductCategoriesFactory());
  }
}
