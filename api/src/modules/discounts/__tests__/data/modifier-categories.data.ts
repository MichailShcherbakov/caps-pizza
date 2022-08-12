import { faker } from "@faker-js/faker";
import ModifierCategoryEntity from "~/db/entities/modifier-category.entity";

export const TEST_DOUGH_MODIFIER_CATEGORY: ModifierCategoryEntity = {
  uuid: faker.datatype.uuid(),
  name: "Dough",
  updated_at: new Date(),
  created_at: new Date(),
};
