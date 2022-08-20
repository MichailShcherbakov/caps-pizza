import { faker } from "@faker-js/faker";
import ProductEntity from "~/db/entities/product.entity";

export default function createProductHelper(
  options: Omit<
    ProductEntity,
    | "uuid"
    | "name"
    | "article_number"
    | "image_url"
    | "updated_at"
    | "created_at"
  >
) {
  return {
    ...options,
    uuid: faker.datatype.uuid(),
    name: faker.commerce.productName(),
    image_url: faker.image.imageUrl(),
    article_number: faker.datatype.number(),
    updated_at: new Date(),
    created_at: new Date(),
    full_price:
      options.price + options.modifiers.reduce((cost, m) => cost + m.price, 0),
  };
}
