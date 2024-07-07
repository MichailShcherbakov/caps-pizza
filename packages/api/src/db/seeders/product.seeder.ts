import { faker } from "@faker-js/faker";
import { QueryRunner } from "typeorm";
import ISeeder, { IFactory } from "~/utils/seeder.interface";
import ProductEntity from "../entities/product.entity";

export class ProductsFactory extends IFactory<ProductEntity> {
  create(
    options: Partial<ProductEntity> = {}
  ): ProductEntity {
    const e = new ProductEntity();
    e.name = options.name ?? faker.commerce.productName();
    e.desc = options.desc;
    e.article_number =
      options.article_number ??
      faker.datatype.number({ max: 99999, min: 10000 });
    e.image_url = options.image_url ?? faker.image.imageUrl();
    e.price = options.price ?? faker.datatype.number({ max: 1000, min: 150 });
    e.volume = options.volume;
    e.weight = options.weight;
    e.tags = options.tags ?? ["first:2", "second:4"];
    e.categories = options.categories ?? [];
    e.modifiers = options.modifiers ?? [];
    return e;
  }
}

export class ProductsSeeder extends ISeeder<ProductEntity> {
  constructor(q: QueryRunner) {
    super(q, new ProductsFactory());
  }
}

export default ProductsSeeder;
