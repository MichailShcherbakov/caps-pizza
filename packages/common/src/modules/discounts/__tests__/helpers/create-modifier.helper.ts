import { faker } from "@faker-js/faker";
import { IModifier } from "../../../../interfaces";

export const createModifier = (options: Partial<IModifier> = {}): IModifier => {
  return {
    uuid: faker.datatype.uuid(),
    name: faker.datatype.uuid(),
    desc: faker.datatype.uuid(),
    article_number: faker.datatype.number(),
    image_url: faker.image.imageUrl(),
    price: faker.datatype.number(),
    display: true,
    display_position: faker.datatype.number(),
    category_uuid: faker.datatype.uuid(),
    ...options,
  };
};

export const createModifiers = (count = 5) => {
  const modifiers: IModifier[] = [];

  for (let i = 0; i < count; i++) {
    modifiers.push(createModifier({ price: 0 }));
  }

  return modifiers;
};

export default createModifier;
