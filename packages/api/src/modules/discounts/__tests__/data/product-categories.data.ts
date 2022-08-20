import { faker } from "@faker-js/faker";
import ProductCategoryEntity from "~/db/entities/product-category.entity";

export const TEST_PIZZA_PRODUCT_CATEGORY: ProductCategoryEntity = {
  uuid: faker.datatype.uuid(),
  name: "Pizza",
  image_url: faker.image.imageUrl(),
  updated_at: new Date(),
  created_at: new Date(),
};

export const TEST_ROLL_PRODUCT_CATEGORY: ProductCategoryEntity = {
  uuid: faker.datatype.uuid(),
  name: "Roll",
  image_url: faker.image.imageUrl(),
  updated_at: new Date(),
  created_at: new Date(),
};
