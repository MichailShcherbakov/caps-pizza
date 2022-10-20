import { faker } from "@faker-js/faker";
import {
  IModifierCategory,
  ModifierCategoryChoiceOptionEnum,
} from "../../../../interfaces";

export const createModifierCategory = (
  options: Partial<IModifierCategory> = {}
): IModifierCategory => {
  return {
    uuid: faker.datatype.uuid(),
    name: faker.datatype.uuid(),
    choice_option: ModifierCategoryChoiceOptionEnum.ONE,
    display: true,
    display_position: faker.datatype.number(),
    ...options,
  };
};

export const createModifierCategories = (count = 5) => {
  const categories: IModifierCategory[] = [];

  for (let i = 0; i < count; i++) {
    categories.push(createModifierCategory());
  }

  return categories;
};

export default createModifierCategory;
