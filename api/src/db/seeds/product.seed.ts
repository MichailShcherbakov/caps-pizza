import { faker } from "@faker-js/faker";
import { DataSource } from "typeorm";
import ISeeder, { IFactory } from "~/utils/seeder.interface";
import ProductEntity from "../entities/product.entity";

export class ProductsFactory extends IFactory<ProductEntity> {
  create(options: Partial<ProductEntity> = {}): ProductEntity {
    const e = new ProductEntity();
    e.name = options.name || faker.commerce.productName();
    e.desc = options.desc || faker.word.adjective();
    e.article_number =
      options.article_number || Number.parseInt(faker.random.numeric());
    e.category_uuid = options.category_uuid || faker.datatype.uuid();
    e.image_url = options.image_url || faker.image.imageUrl();
    e.price = options.price || faker.datatype.number();
    return e;
  }
}

export class ProductsSeeder extends ISeeder<ProductEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, new ProductsFactory());
  }
}

export default ProductsSeeder;
