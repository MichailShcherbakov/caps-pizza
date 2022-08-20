import { faker } from "@faker-js/faker";
import ModifierEntity from "~/db/entities/modifier.entity";
import { TEST_DOUGH_MODIFIER_CATEGORY } from "./modifier-categories.data";

export const TEST_TRADITIONAL_DOUGH_MODIFIER: ModifierEntity = {
  uuid: faker.datatype.uuid(),
  name: "Tiny Dough",
  article_number: faker.datatype.number(),
  price: 50,
  category_uuid: TEST_DOUGH_MODIFIER_CATEGORY.uuid,
  category: TEST_DOUGH_MODIFIER_CATEGORY,
  updated_at: new Date(),
  created_at: new Date(),
};

export const TEST_FLUFFY_DOUGH_MODIFIER: ModifierEntity = {
  uuid: faker.datatype.uuid(),
  name: "Fluffy Dough",
  article_number: faker.datatype.number(),
  price: 100,
  category_uuid: TEST_DOUGH_MODIFIER_CATEGORY.uuid,
  category: TEST_DOUGH_MODIFIER_CATEGORY,
  updated_at: new Date(),
  created_at: new Date(),
};
