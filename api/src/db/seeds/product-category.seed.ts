import { DataSource } from "typeorm";
import { faker } from "@faker-js/faker";
import ISeeder, { IFactory } from "~/utils/seeder.interface";
import ProductCategoryEntity from "../entities/product-category.entity";

export class ProductCategoriesFactory extends IFactory<ProductCategoryEntity> {
  create(options: Partial<ProductCategoryEntity> = {}): ProductCategoryEntity {
    const e = new ProductCategoryEntity();
    e.name = options.name || faker.commerce.productName();
    e.image_url = options.image_url || faker.image.imageUrl();
    return e;
  }
}

export default class ProductCategoriesSeeder extends ISeeder<ProductCategoryEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, new ProductCategoriesFactory());
  }
}
