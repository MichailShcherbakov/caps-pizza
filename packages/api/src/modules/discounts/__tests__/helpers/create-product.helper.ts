import { faker } from "@faker-js/faker";
import { IProductWithFullPrice } from "@monorepo/common";

export default function createProductHelper(
  options: Omit<
    IProductWithFullPrice,
    "uuid" | "name" | "article_number" | "image_url" | "count" | "fullPrice"
  >
): IProductWithFullPrice {
  return {
    ...options,
    uuid: faker.datatype.uuid(),
    name: faker.commerce.productName(),
    article_number: faker.datatype.number(),
    image_url: faker.image.imageUrl(),
    count: 1,
    fullPrice:
      options.price + options.modifiers.reduce((cost, m) => cost + m.price, 0),
  };
}
